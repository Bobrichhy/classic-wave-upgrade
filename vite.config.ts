import path from 'path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { scentRecommendation, generateImage, analyzeImage, normalizeError } from './api/_lib/gemini';
import { createOrder, getOrdersByPhone } from './api/_lib/supabase';

// Serves the same /api/* endpoints locally that Vercel serves in production,
// so `npm run dev` works without the Vercel CLI. Secrets (Gemini key,
// Supabase service key) never reach the browser — only read here, server-side.
function apiDevMiddleware(): Plugin {
  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.method !== 'POST' || !req.url?.startsWith('/api/')) return next();

        const readBody = () => new Promise<any>((resolve, reject) => {
          let data = '';
          req.on('data', (chunk) => (data += chunk));
          req.on('end', () => {
            try { resolve(data ? JSON.parse(data) : {}); } catch (e) { reject(e); }
          });
          req.on('error', reject);
        });

        try {
          const body = await readBody();
          let result: unknown;
          let status = 200;

          if (req.url === '/api/scent-recommendation') {
            result = await scentRecommendation(body);
          } else if (req.url === '/api/generate-image') {
            result = { imageUrl: await generateImage(body.productName) };
          } else if (req.url === '/api/analyze-image') {
            result = { text: await analyzeImage(body.base64Data, body.mimeType) };
          } else if (req.url === '/api/create-order') {
            result = { order: await createOrder(body) };
          } else if (req.url === '/api/get-orders') {
            if (!body.phone || String(body.phone).replace(/\D/g, '').length < 7) {
              status = 400;
              result = { error: 'INVALID_PHONE' };
            } else {
              result = { orders: await getOrdersByPhone(body.phone) };
            }
          } else {
            return next();
          }

          res.statusCode = status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result));
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: normalizeError(err) }));
        }
      });
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  // Only used server-side (this config file + the dev middleware above) —
  // never inlined into the client bundle.
  process.env.GEMINI_API_KEY = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
  process.env.SUPABASE_URL = env.SUPABASE_URL || process.env.SUPABASE_URL || '';
  process.env.SUPABASE_SECRET_KEY = env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SECRET_KEY || '';

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react(), apiDevMiddleware()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    }
  };
});
