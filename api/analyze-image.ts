import type { VercelRequest, VercelResponse } from './_lib/types';
import { analyzeImage, normalizeError } from './_lib/gemini';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
    return;
  }
  try {
    const { base64Data, mimeType } = req.body || {};
    const text = await analyzeImage(base64Data, mimeType);
    res.status(200).json({ text });
  } catch (err: any) {
    res.status(500).json({ error: normalizeError(err) });
  }
}
