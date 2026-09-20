
import React, { useState } from 'react';
import { UNILAG_HOSTELS, DELIVERY_FEE, ACCOUNT_DETAILS } from '../constants';
import { CartItem } from '../types';
import { CheckCircle2, CreditCard, MapPin, MessageCircle, ShoppingBag, Truck, Store, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

interface OrderPageProps {
  cartItems: CartItem[];
}

const OrderPage: React.FC<OrderPageProps> = ({ cartItems }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    hostel: UNILAG_HOSTELS[0],
    notes: ''
  });
  const [wantsDelivery, setWantsDelivery] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [copied, setCopied] = useState(false);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = wantsDelivery ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  const copyAccountNumber = () => {
    navigator.clipboard.writeText(ACCOUNT_DETAILS.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenshot) {
      alert("Please upload your payment screenshot before placing the order.");
      return;
    }

    // Save the order so the customer can look it up later by phone number.
    // Best-effort only — WhatsApp remains the source of truth for fulfilment,
    // so a save failure here should never block checkout.
    try {
      await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.name,
          phone: formData.phone,
          hostel: wantsDelivery ? formData.hostel : null,
          fulfilment: wantsDelivery ? 'delivery' : 'pickup',
          notes: formData.notes || null,
          items: cartItems,
          subtotal,
          delivery_fee: deliveryFee,
          total,
        }),
      });
    } catch (err) {
      console.error('Failed to save order history', err);
    }

    const itemList = cartItems
      .map(item => `- ${item.quantity}x ${item.name} (₦${(item.price * item.quantity).toLocaleString()})`)
      .join('\n');

    const deliveryLine = wantsDelivery
      ? `*Delivery to:* ${formData.hostel}\n*Delivery Fee:* ₦${DELIVERY_FEE.toLocaleString()}`
      : `*Fulfilment:* Self Pickup (No delivery fee)`;

    const message =
      `*NEW ORDER — CLASSIC WAVE* 🛒\n\n` +
      `*Customer:* ${formData.name}\n` +
      `*Phone:* ${formData.phone}\n` +
      `${deliveryLine}\n` +
      (formData.notes ? `*Notes:* ${formData.notes}\n` : '') +
      `\n*Order Details:*\n${itemList}\n\n` +
      `*Subtotal:* ₦${subtotal.toLocaleString()}\n` +
      (wantsDelivery ? `*Delivery:* ₦${DELIVERY_FEE.toLocaleString()}\n` : '') +
      `*Total Paid:* ₦${total.toLocaleString()}\n\n` +
      `_Payment screenshot attached for verification._`;

    window.open(`https://wa.me/2348085597947?text=${encodeURIComponent(message)}`, '_blank');
    setIsSubmitted(true);
    window.scrollTo(0, 0);
  };

  if (cartItems.length === 0 && !isSubmitted) {
    return (
      <div className="pt-24 md:pt-32 pb-20 px-4 text-center max-w-2xl mx-auto min-h-screen flex flex-col items-center justify-center">
        <ShoppingBag size={64} className="text-zinc-700 mx-auto mb-6" />
        <h1 className="font-serif text-3xl md:text-4xl text-white mb-4">Your Cart is Empty</h1>
        <p className="text-zinc-400 mb-8 text-sm">Add some fragrances to your cart before checking out.</p>
        <Link to="/" className="inline-block bg-[#FFD700] text-black font-bold px-10 py-4 rounded-full text-sm tracking-widest uppercase">
          BROWSE COLLECTION
        </Link>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="pt-24 md:pt-32 pb-20 px-4 text-center max-w-2xl mx-auto min-h-screen">
        <CheckCircle2 size={64} className="text-[#FFD700] mx-auto mb-6" />
        <h1 className="font-serif text-3xl md:text-4xl text-white mb-4">Order Sent!</h1>
        <p className="text-zinc-400 mb-8 leading-relaxed text-sm max-w-md mx-auto">
          Your order details are ready on WhatsApp.{' '}
          <strong className="text-white">Please attach your payment screenshot</strong> in the chat to confirm your order.
        </p>
        <Link to="/" className="inline-block bg-[#FFD700] text-black font-bold px-10 py-4 rounded-full text-sm tracking-widest uppercase">
          RETURN TO SHOP
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20 md:pt-32 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl text-white mb-8 md:mb-12 text-center tracking-tighter">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 space-y-8 bg-zinc-950 p-6 md:p-8 rounded-2xl border border-zinc-900 shadow-2xl">

            {/* ── Delivery or Pickup ── */}
            <div>
              <h2 className="text-[#FFD700] font-serif text-xl md:text-2xl flex items-center gap-2 mb-5">
                <Truck size={22} /> Fulfilment Method
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setWantsDelivery(true)}
                  className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all ${
                    wantsDelivery
                      ? 'border-[#FFD700] bg-[#FFD700]/5 text-white'
                      : 'border-zinc-800 bg-zinc-900/50 text-zinc-500 hover:border-zinc-700'
                  }`}
                >
                  <Truck size={24} className={wantsDelivery ? 'text-[#FFD700]' : ''} />
                  <span className="font-bold text-sm tracking-wide">Delivery</span>
                  <span className="text-[10px] tracking-widest opacity-70">+₦{DELIVERY_FEE.toLocaleString()}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setWantsDelivery(false)}
                  className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all ${
                    !wantsDelivery
                      ? 'border-[#FFD700] bg-[#FFD700]/5 text-white'
                      : 'border-zinc-800 bg-zinc-900/50 text-zinc-500 hover:border-zinc-700'
                  }`}
                >
                  <Store size={24} className={!wantsDelivery ? 'text-[#FFD700]' : ''} />
                  <span className="font-bold text-sm tracking-wide">Self Pickup</span>
                  <span className="text-[10px] tracking-widest opacity-70">FREE</span>
                </button>
              </div>

              {!wantsDelivery && (
                <p className="mt-3 text-xs text-zinc-500 bg-zinc-900 rounded-xl p-3 border border-zinc-800">
                  📍 Pickup at <span className="text-white font-medium">University of Lagos, Akoka</span> — we'll confirm the exact meetup point via WhatsApp.
                </p>
              )}
            </div>

            {/* ── Contact & Location ── */}
            <div>
              <h2 className="text-[#FFD700] font-serif text-xl md:text-2xl flex items-center gap-2 mb-5">
                <MapPin size={22} /> {wantsDelivery ? 'Delivery Info' : 'Contact Info'}
              </h2>
              <div className="grid gap-4 md:gap-5">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-zinc-500 text-[10px] font-bold uppercase mb-2 tracking-widest">Full Name</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 md:p-4 text-white text-sm focus:border-[#FFD700] outline-none"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-zinc-500 text-[10px] font-bold uppercase mb-2 tracking-widest">WhatsApp Number</label>
                    <input
                      required
                      type="tel"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 md:p-4 text-white text-sm focus:border-[#FFD700] outline-none"
                      placeholder="08012345678"
                    />
                  </div>
                </div>

                {wantsDelivery && (
                  <div>
                    <label className="block text-zinc-500 text-[10px] font-bold uppercase mb-2 tracking-widest">UNILAG Hostel</label>
                    <select
                      value={formData.hostel}
                      onChange={e => setFormData({ ...formData, hostel: e.target.value })}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 md:p-4 text-white text-sm focus:border-[#FFD700] outline-none appearance-none"
                    >
                      {UNILAG_HOSTELS.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-zinc-500 text-[10px] font-bold uppercase mb-2 tracking-widest">
                    {wantsDelivery ? 'Room / Additional Notes (optional)' : 'Additional Notes (optional)'}
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 md:p-4 text-white text-sm focus:border-[#FFD700] outline-none resize-none"
                    placeholder={wantsDelivery ? "Room number, block, special instructions..." : "Preferred pickup time, notes..."}
                  />
                </div>
              </div>
            </div>

            {/* ── Payment ── */}
            <div className="space-y-4">
              <h2 className="text-[#FFD700] font-serif text-xl md:text-2xl flex items-center gap-2">
                <CreditCard size={22} /> Payment
              </h2>

              {/* Account Card */}
              <div className="bg-zinc-900/60 rounded-2xl border border-[#FFD700]/15 overflow-hidden">
                <div className="px-5 py-3 bg-[#FFD700]/5 border-b border-[#FFD700]/10">
                  <p className="text-zinc-400 text-xs">
                    Transfer <span className="text-white font-bold text-base">₦{total.toLocaleString()}</span> to:
                  </p>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Bank</p>
                      <p className="text-white font-bold">{ACCOUNT_DETAILS.bank}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="text-green-400 font-black text-xs">O</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-zinc-900 rounded-xl p-4 border border-zinc-800">
                    <div>
                      <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Account Number</p>
                      <p className="text-white font-mono font-bold text-lg tracking-widest">{ACCOUNT_DETAILS.accountNumber}</p>
                    </div>
                    <button
                      type="button"
                      onClick={copyAccountNumber}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-widest transition-all ${
                        copied
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-zinc-800 text-zinc-400 hover:text-[#FFD700] hover:bg-zinc-700 border border-zinc-700'
                      }`}
                    >
                      {copied ? <><Check size={12} /> COPIED</> : <><Copy size={12} /> COPY</>}
                    </button>
                  </div>

                  <div>
                    <p className="text-[10px] text-zinc-600 uppercase tracking-widest mb-1">Account Name</p>
                    <p className="text-white text-sm font-medium">{ACCOUNT_DETAILS.accountName}</p>
                  </div>
                </div>
              </div>

              {/* Receipt Upload */}
              <div className="relative border-2 border-dashed border-zinc-800 rounded-xl p-6 text-center cursor-pointer hover:border-[#FFD700]/40 transition-colors group">
                <input
                  type="file"
                  required
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  onChange={e => e.target.files?.[0] && setScreenshot(e.target.files[0])}
                />
                {screenshot ? (
                  <div className="flex items-center justify-center gap-2">
                    <Check size={16} className="text-green-400" />
                    <span className="text-green-400 text-sm font-medium">{screenshot.name}</span>
                  </div>
                ) : (
                  <div>
                    <p className="text-zinc-500 text-sm mb-1">Upload Payment Receipt</p>
                    <p className="text-zinc-700 text-[10px] tracking-widest uppercase">Tap to select screenshot</p>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#FFD700] text-black font-bold py-4 rounded-full flex items-center justify-center gap-2 text-xs md:text-sm tracking-widest uppercase hover:bg-white transition-all"
            >
              PLACE ORDER ON WHATSAPP <MessageCircle size={18} />
            </button>
          </form>

          {/* Order Summary Sidebar */}
          <div className="w-full lg:w-80 space-y-4">
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 sticky top-24">
              <h2 className="text-white font-serif text-lg mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between text-xs text-zinc-400">
                    <span className="truncate pr-2">{item.quantity}× {item.name}</span>
                    <span className="flex-shrink-0">₦{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-zinc-800 pt-4 space-y-2">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Subtotal</span>
                  <span>₦{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className={wantsDelivery ? 'text-zinc-400' : 'text-zinc-600'}>
                    Delivery {!wantsDelivery && <span className="text-green-400">(waived)</span>}
                  </span>
                  <span className={wantsDelivery ? 'text-zinc-400' : 'text-green-400'}>
                    {wantsDelivery ? `₦${DELIVERY_FEE.toLocaleString()}` : 'FREE'}
                  </span>
                </div>
                <div className="flex justify-between text-white font-bold text-lg pt-3 border-t border-zinc-800">
                  <span>Total</span>
                  <span className="text-[#FFD700]">₦{total.toLocaleString()}</span>
                </div>
              </div>

              {!wantsDelivery && (
                <p className="mt-4 text-[10px] text-green-400 text-center tracking-wide">
                  🎉 You saved ₦{DELIVERY_FEE.toLocaleString()} with self pickup
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
