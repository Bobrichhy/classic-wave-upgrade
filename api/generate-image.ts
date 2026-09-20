import type { VercelRequest, VercelResponse } from './_lib/types';
import { generateImage, normalizeError } from './_lib/gemini.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
    return;
  }
  try {
    const { productName } = req.body || {};
    const imageUrl = await generateImage(productName);
    res.status(200).json({ imageUrl });
  } catch (err: any) {
    res.status(500).json({ error: normalizeError(err) });
  }
}
