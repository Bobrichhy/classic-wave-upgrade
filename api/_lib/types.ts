import type { IncomingMessage, ServerResponse } from 'http';

// Minimal shape of what Vercel's Node.js runtime hands to a serverless
// function — avoids depending on @vercel/node for two type aliases.
export interface VercelRequest extends IncomingMessage {
  body?: any;
  query?: Record<string, string | string[]>;
  cookies?: Record<string, string>;
}

export interface VercelResponse extends ServerResponse {
  status(code: number): VercelResponse;
  json(body: any): VercelResponse;
  send(body: any): VercelResponse;
}
