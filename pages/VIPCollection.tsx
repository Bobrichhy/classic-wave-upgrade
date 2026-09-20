
import React from 'react';
import { PRODUCTS } from '../constants';
import ProductCard from '../components/ProductCard';
import { Product } from '../types';
import { Crown, ShieldCheck } from 'lucide-react';

interface VIPCollectionProps {
  onAddToCart: (p: Product) => void;
}

const VIPCollection: React.FC<VIPCollectionProps> = ({ onAddToCart }) => {
  const vipProducts = PRODUCTS.filter(p => p.vip);

  return (
    <div className="pt-24 md:pt-32 pb-20 px-4 min-h-screen bg-black">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-14 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#FFD700]/40 bg-[#FFD700]/5 text-[#FFD700] text-[10px] font-bold tracking-[0.3em] mb-6 uppercase">
            <Crown size={14} /> BY INVITATION ONLY
          </div>
          <h1 className="font-serif text-5xl md:text-7xl text-white mb-4 tracking-tighter leading-tight">
            The <span className="text-[#FFD700] italic">VIP</span> Collection
          </h1>
          <p className="text-zinc-500 max-w-2xl mx-auto text-base font-light leading-relaxed">
            Our most exclusive designer imports — Tom Ford, Dior, Yves Saint Laurent, Armani and more.
            Reserved for those who settle for nothing less than the original.
          </p>
          <div className="inline-flex items-center gap-2 mt-6 text-zinc-600 text-[10px] font-bold tracking-widest uppercase">
            <ShieldCheck size={14} className="text-[#FFD700]" /> 100% Authentic · Verified Imports
          </div>
        </header>

        {vipProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 animate-fade-in">
            {vipProducts.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-zinc-800 rounded-2xl">
            <p className="text-zinc-500 text-sm md:text-lg px-4">The VIP collection is being curated. Check back soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VIPCollection;
