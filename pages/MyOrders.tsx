
import React, { useState } from 'react';
import { PackageSearch, Loader2, AlertCircle, Truck, Store, Clock } from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  hostel: string | null;
  fulfilment: 'delivery' | 'pickup';
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  total: number;
  status: string;
}

const MyOrders: React.FC = () => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[] | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrders(null);
    try {
      const res = await fetch('/api/get-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'UNKNOWN_ERROR');
      setOrders(data.orders);
    } catch (err) {
      setError('Could not fetch your orders right now. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 md:pt-32 pb-20 px-4 min-h-screen">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/5 text-[#FFD700] text-[10px] font-bold tracking-[0.3em] mb-6 uppercase">
            <PackageSearch size={12} /> ORDER HISTORY
          </div>
          <h1 className="font-serif text-4xl md:text-5xl text-white mb-3">My Orders</h1>
          <p className="text-zinc-500 text-sm">Enter the WhatsApp number you ordered with to see your order history.</p>
        </header>

        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 mb-10 bg-zinc-950 p-4 rounded-2xl border border-zinc-900">
          <input
            required
            type="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="e.g. 08012345678"
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white text-sm focus:border-[#FFD700] outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#FFD700] text-black font-bold px-8 py-4 rounded-xl text-xs tracking-widest uppercase hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Find My Orders'}
          </button>
        </form>

        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-950/20 border border-red-900/30 rounded-xl mb-6">
            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
            <p className="text-red-400 text-xs leading-relaxed">{error}</p>
          </div>
        )}

        {orders && orders.length === 0 && (
          <div className="text-center py-16 border-2 border-dashed border-zinc-800 rounded-2xl">
            <p className="text-zinc-500 text-sm">No orders found for that number.</p>
          </div>
        )}

        {orders && orders.length > 0 && (
          <div className="space-y-5">
            {orders.map(order => (
              <div key={order.id} className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-zinc-900">
                  <div className="flex items-center gap-2 text-zinc-500 text-xs">
                    <Clock size={14} />
                    {new Date(order.created_at).toLocaleString('en-NG', { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full border border-zinc-800 text-zinc-400">
                    {order.fulfilment === 'delivery' ? <Truck size={12} /> : <Store size={12} />}
                    {order.fulfilment === 'delivery' ? `Delivery — ${order.hostel}` : 'Self Pickup'}
                  </div>
                  <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-[#FFD700]/10 text-[#FFD700] border border-[#FFD700]/20">
                    {order.status}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm text-zinc-300">
                      <span>{item.quantity}× {item.name}</span>
                      <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-zinc-900">
                  <span className="text-zinc-500 text-xs uppercase tracking-widest">Total</span>
                  <span className="text-[#FFD700] font-bold text-lg">₦{order.total.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
