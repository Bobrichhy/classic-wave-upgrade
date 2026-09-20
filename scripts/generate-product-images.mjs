#!/usr/bin/env node
/**
 * Batch-generates AI product photography for items in constants.ts using
 * Gemini, saves them to public/images/, and rewrites each product's
 * imageUrl in constants.ts to point at the new local file.
 *
 * Usage:
 *   node scripts/generate-product-images.mjs                 # all products
 *   node scripts/generate-product-images.mjs --pilot=3        # first N only
 *   node scripts/generate-product-images.mjs --ids=p-riggs-perfume,bs-osca  # specific ids
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI } from '@google/genai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CONSTANTS_PATH = path.join(ROOT, 'constants.ts');
const IMAGES_DIR = path.join(ROOT, 'public', 'images');

function loadEnvLocal() {
  const envPath = path.join(ROOT, '.env.local');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
  for (const line of lines) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim();
  }
}
loadEnvLocal();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('GEMINI_API_KEY not found in .env.local');
  process.exit(1);
}

const args = process.argv.slice(2);
const pilotArg = args.find((a) => a.startsWith('--pilot='));
const idsArg = args.find((a) => a.startsWith('--ids='));
const pilotCount = pilotArg ? parseInt(pilotArg.split('=')[1], 10) : null;
const onlyIds = idsArg ? idsArg.split('=')[1].split(',').map((s) => s.trim()) : null;

const ai = new GoogleGenAI({ apiKey });

const CATEGORY_OBJECT = {
  PERFUME: 'an elegant luxury perfume bottle',
  BODY_SPRAY: 'a premium aerosol body spray can',
  ROLL_ON: 'a sleek roll-on deodorant bottle',
  BODY_OIL: 'an elegant fragrance oil bottle with a dropper cap',
};

const GENDER_STYLE = {
  MALE: 'masculine, bold, dark-toned',
  FEMALE: 'feminine, elegant, soft-toned',
};

function buildPrompt(p) {
  const object = CATEGORY_OBJECT[p.category] || 'an elegant luxury fragrance bottle';
  const style = GENDER_STYLE[p.gender] || 'elegant';
  return `High-end commercial product photography of ${object} named "${p.name}".
Scent notes: ${p.notes}. ${style} aesthetic, premium design, exquisite cap/nozzle design.
Soft dramatic studio lighting, ultra-detailed, dark reflective marble surface, soft mist background,
8K resolution, elegant luxury atmosphere with black and gold color accents.`;
}

// Parses each product literal out of constants.ts (one product per line).
function parseProducts(source) {
  const lines = source.split('\n');
  const products = [];
  lines.forEach((line, idx) => {
    const idM = line.match(/id: '([^']+)'/);
    if (!idM) return;
    const nameM = line.match(/name: '([^']+)'/);
    const categoryM = line.match(/category: Category\.(\w+)/);
    const genderM = line.match(/gender: Gender\.(\w+)/);
    const notesM = line.match(/notes: '([^']+)'/);
    const imageM = line.match(/imageUrl: '([^']+)'/);
    if (!nameM || !categoryM || !genderM || !notesM || !imageM) return;
    products.push({
      lineIndex: idx,
      id: idM[1],
      name: nameM[1],
      category: categoryM[1],
      gender: genderM[1],
      notes: notesM[1],
      imageUrl: imageM[1],
    });
  });
  return products;
}

async function generateImageWithRetry(prompt, attempt = 1) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: prompt,
      config: { responseModalities: ['IMAGE', 'TEXT'] },
    });
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        return { data: part.inlineData.data, mimeType: part.inlineData.mimeType };
      }
    }
    throw new Error('No image data in response');
  } catch (err) {
    const msg = (err?.message || '').toLowerCase();
    const retryable = msg.includes('quota') || msg.includes('429') || msg.includes('resource_exhausted') || msg.includes('fetch failed');
    if (retryable && attempt < 4) {
      const delay = attempt * 8000;
      console.log(`  retrying in ${delay / 1000}s (attempt ${attempt + 1})...`);
      await new Promise((r) => setTimeout(r, delay));
      return generateImageWithRetry(prompt, attempt + 1);
    }
    throw err;
  }
}

function extForMime(mime) {
  if (mime.includes('png')) return 'png';
  if (mime.includes('jpeg') || mime.includes('jpg')) return 'jpg';
  if (mime.includes('webp')) return 'webp';
  return 'png';
}

async function main() {
  const source = fs.readFileSync(CONSTANTS_PATH, 'utf-8');
  let lines = source.split('\n');
  let products = parseProducts(source);

  if (onlyIds) products = products.filter((p) => onlyIds.includes(p.id));
  else if (pilotCount) products = products.slice(0, pilotCount);

  console.log(`Generating ${products.length} product image(s)...\n`);

  const results = { ok: [], failed: [] };

  for (const [i, p] of products.entries()) {
    process.stdout.write(`[${i + 1}/${products.length}] ${p.id} (${p.name})... `);
    try {
      const prompt = buildPrompt(p);
      const { data, mimeType } = await generateImageWithRetry(prompt);
      const ext = extForMime(mimeType);
      const filename = `${p.id}.${ext}`;
      const filepath = path.join(IMAGES_DIR, filename);
      fs.writeFileSync(filepath, Buffer.from(data, 'base64'));

      const newImageUrl = `/images/${filename}`;
      const line = lines[p.lineIndex];
      lines[p.lineIndex] = line.replace(`imageUrl: '${p.imageUrl}'`, `imageUrl: '${newImageUrl}'`);
      fs.writeFileSync(CONSTANTS_PATH, lines.join('\n'));

      console.log(`OK -> ${newImageUrl}`);
      results.ok.push(p.id);
    } catch (err) {
      console.log(`FAILED (${err.message})`);
      results.failed.push({ id: p.id, error: err.message });
    }
    // Gentle pacing to avoid rate-limit bursts
    await new Promise((r) => setTimeout(r, 3000));
  }

  console.log(`\nDone. ${results.ok.length} succeeded, ${results.failed.length} failed.`);
  if (results.failed.length) {
    console.log('Failed:', JSON.stringify(results.failed, null, 2));
  }
}

main();
