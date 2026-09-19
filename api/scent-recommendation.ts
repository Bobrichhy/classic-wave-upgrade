import type { VercelRequest, VercelResponse } from './_lib/types';
import { scentRecommendation, normalizeError } from './_lib/gemini';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
    return;
  }
  try {
    const result = await scentRecommendation(req.body || {});
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: normalizeError(err) });
  }
}
