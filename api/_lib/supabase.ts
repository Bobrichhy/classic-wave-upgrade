import type { CartItem } from '../../types.js';

export interface OrderRecord {
  customer_name: string;
  phone: string;
  hostel: string | null;
  fulfilment: 'delivery' | 'pickup';
  notes: string | null;
  items: CartItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
}

function supabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error('SUPABASE_NOT_CONFIGURED');
  return { url, key };
}

// Normalize to digits only so "0801 234 5678" and "+2348012345678" match the same customer
export function normalizePhone(phone: string): string {
  return (phone || '').replace(/\D/g, '');
}

export async function createOrder(order: OrderRecord) {
  const { url, key } = supabaseConfig();

  const res = await fetch(`${url}/rest/v1/orders`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      ...order,
      phone: normalizePhone(order.phone),
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`SUPABASE_INSERT_FAILED: ${res.status} ${text}`);
  }

  const rows = await res.json();
  return rows[0];
}

export async function getOrdersByPhone(phone: string) {
  const { url, key } = supabaseConfig();
  const normalized = normalizePhone(phone);

  const res = await fetch(
    `${url}/rest/v1/orders?phone=eq.${encodeURIComponent(normalized)}&order=created_at.desc`,
    {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`SUPABASE_QUERY_FAILED: ${res.status} ${text}`);
  }

  return res.json();
}
