import type { VercelRequest, VercelResponse } from './_lib/types';
import { getOrdersByPhone } from './_lib/supabase.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'METHOD_NOT_ALLOWED' });
    return;
  }
  try {
    const { phone } = req.body || {};
    if (!phone || String(phone).replace(/\D/g, '').length < 7) {
      res.status(400).json({ error: 'INVALID_PHONE' });
      return;
    }
    const orders = await getOrdersByPhone(phone);
    res.status(200).json({ orders });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'UNKNOWN_ERROR' });
  }
}
