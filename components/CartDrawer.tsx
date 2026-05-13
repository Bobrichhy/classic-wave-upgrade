
import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';
import { Link } from 'react-router-dom';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onUpdateQuantity, onRemove }) => {
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-black border-l border-zinc-800 flex flex-col shadow-2xl animate-slide-in-right">
        <div className="p-6 flex justify-between items-center border-b border-zinc-800">
          <h2 className="text-xl font-serif text-[#FFD700] font-bold flex items-center">
            <ShoppingBag className="mr-2" /> YOUR CART
          </h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-zinc-500 italic">Your cart is currently empty.</p>
              <button 
                onClick={onClose}
                className="mt-4 text-[#FFD700] hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 items-start">
                <img src={item.imageUrl} alt={item.name} className="w-20 h-24 object-cover rounded border border-zinc-800" />
                <div className="flex-1">
                  <h3 className="text-white font-medium">{item.name}</h3>
                  <p className="text-[#FFD700] text-sm mb-2">₦{item.price.toLocaleString()}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-zinc-700 rounded-full px-2 py-0.5">
                      <button onClick={() => onUpdateQuantity(item.id, -1)} className="text-zinc-400 hover:text-white"><Minus size={14} /></button>
                      <span className="mx-3 text-sm">{item.quantity}</span>
                      <button onClick={() => onUpdateQuantity(item.id, 1)} className="text-zinc-400 hover:text-white"><Plus size={14} /></button>
                    </div>
                    <button onClick={() => onRemove(item.id)} className="text-zinc-500 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                </div>
                <p className="text-white font-semibold">₦{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-zinc-950 border-t border-zinc-800">
          <div className="flex justify-between mb-4">
            <span className="text-zinc-400">Subtotal</span>
            <span className="text-white font-bold text-lg">₦{subtotal.toLocaleString()}</span>
          </div>
          <p className="text-xs text-zinc-500 mb-6 italic">Delivery calculated at next step (Flat ₦600 for UNILAG)</p>
          <Link 
            to="/order"
            onClick={onClose}
            className={`block w-full text-center bg-[#FFD700] text-black font-bold py-4 rounded-lg hover:bg-white transition-colors tracking-widest ${items.length === 0 ? 'opacity-50 pointer-events-none' : ''}`}
          >
            PROCEED TO ORDER
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
