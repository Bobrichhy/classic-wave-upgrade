import type { VercelRequest, VercelResponse } from './_lib/types';
import { createOrder } from './_lib/supabase';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
    return;
  }
  try {
    const order = await createOrder(req.body || {});
    res.status(200).json({ order });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'UNKNOWN_ERROR' });
  }
}
