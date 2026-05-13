
import React, { useState } from 'react';
import { Product, Gender } from '../types';
import { ImageIcon, ShoppingCart, Sparkles } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [imgError, setImgError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="group relative bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden transition-all duration-500 hover:shadow-[0_0_20px_rgba(255,215,0,0.2)] flex flex-col h-full">
      {/* Image Container */}
      <div className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden bg-zinc-950">
        
        {/* Luxury Shimmer/Skeleton while loading */}
        {!isLoaded && !imgError && (
          <div className="absolute inset-0 bg-zinc-900 animate-pulse flex items-center justify-center overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
             <Sparkles className="text-zinc-800" size={32} />
          </div>
        )}

        {!imgError ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            onError={() => {
              console.error(`Failed to load image for ${product.name}`);
              setImgError(true);
            }}
            className={`w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 p-6 text-center border-b border-zinc-800">
            <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-4 text-[#FFD700]/20 border border-zinc-800">
              <ImageIcon size={30} />
            </div>
            <p className="text-[#FFD700] font-serif text-xs italic tracking-[0.2em] leading-tight uppercase px-4">{product.name}</p>
          </div>
        )}
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-3 md:p-6 text-center">
          <div className="border border-[#FFD700]/40 p-2 md:p-4 w-full h-full flex flex-col justify-center items-center">
            <p className="text-[#FFD700] font-serif text-sm md:text-lg mb-1 italic line-clamp-1">{product.notes}</p>
            <p className="text-white text-[9px] md:text-xs mb-3 md:mb-4 line-clamp-2 leading-relaxed opacity-80">{product.description}</p>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="bg-[#FFD700] text-black px-4 md:px-6 py-2 text-[9px] md:text-[10px] font-bold rounded-full hover:bg-white transition-all tracking-widest uppercase flex items-center gap-2"
            >
              <ShoppingCart size={12} /> ADD TO CART
            </button>
          </div>
        </div>

        {/* Floating Gender Badge */}
        <div className="absolute top-3 left-3 flex gap-1 z-10">
          <span className={`px-2 py-0.5 text-[8px] font-bold rounded-md tracking-widest shadow-lg ${product.gender === Gender.MALE ? 'bg-blue-900/90 text-blue-100' : 'bg-pink-900/90 text-pink-100'}`}>
            {product.gender === Gender.MALE ? 'HOMME' : 'FEMME'}
          </span>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-3 md:p-5 bg-zinc-950 border-t border-zinc-900/50 flex-grow">
        <h3 className="text-white font-serif text-xs md:text-base font-medium tracking-wide truncate mb-1.5">{product.name}</h3>
        <div className="flex justify-between items-center">
          <p className="text-[#FFD700] font-bold text-sm md:text-base tracking-tighter">₦{product.price.toLocaleString()}</p>
          <div className="h-px bg-[#FFD700]/10 flex-grow mx-4 hidden md:block" />
          <span className="text-zinc-600 text-[9px] tracking-widest uppercase font-bold">{product.category.replace('_', ' ')}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
