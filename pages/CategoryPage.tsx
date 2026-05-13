
import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PRODUCTS } from '../constants';
import { Category, Gender, Product } from '../types';
import ProductCard from '../components/ProductCard';
import { User, UserCheck } from 'lucide-react';

interface CategoryPageProps {
  onAddToCart: (p: Product) => void;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ onAddToCart }) => {
  const { categoryId } = useParams();
  const [activeGender, setActiveGender] = useState<Gender | 'ALL'>('ALL');

  // Reset gender filter when category changes
  useEffect(() => {
    setActiveGender('ALL');
  }, [categoryId]);

  const filteredProducts = useMemo(() => {
    if (!categoryId) return [];
    return PRODUCTS.filter(p => 
      p.category === categoryId && (activeGender === 'ALL' || p.gender === activeGender)
    );
  }, [categoryId, activeGender]);

  const categoryTitle = categoryId
    ? categoryId.replace(/_/g, ' ')
    : 'Fragrances';

  return (
    <div className="pt-20 md:pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 md:mb-12">
          <h1 className="font-serif text-4xl md:text-5xl text-[#FFD700] mb-3 md:mb-4 uppercase tracking-tighter">
            {categoryTitle}S
          </h1>
          <div className="flex flex-col gap-6">
            <p className="text-zinc-400 italic text-sm md:text-base">
              Explore our selection of {categoryTitle.toLowerCase()}s for every style.
            </p>
            
            {/* Filter Bar - Responsive scrollable row */}
            <div className="flex items-center overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide md:overflow-visible md:pb-0 md:mx-0 md:px-0">
              <div className="flex items-center bg-zinc-900 rounded-full p-1 border border-zinc-800 whitespace-nowrap min-w-max">
                <button
                  onClick={() => setActiveGender('ALL')}
                  className={`px-6 py-2 rounded-full text-[10px] md:text-xs font-bold transition-all ${activeGender === 'ALL' ? 'bg-[#FFD700] text-black' : 'text-zinc-400 hover:text-white'}`}
                >
                  ALL ITEMS
                </button>
                <button
                  onClick={() => setActiveGender(Gender.MALE)}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full text-[10px] md:text-xs font-bold transition-all ${activeGender === Gender.MALE ? 'bg-[#FFD700] text-black' : 'text-zinc-400 hover:text-white'}`}
                >
                  <User size={12} /> FOR HIM
                </button>
                <button
                  onClick={() => setActiveGender(Gender.FEMALE)}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full text-[10px] md:text-xs font-bold transition-all ${activeGender === Gender.FEMALE ? 'bg-[#FFD700] text-black' : 'text-zinc-400 hover:text-white'}`}
                >
                  <UserCheck size={12} /> FOR HER
                </button>
              </div>
            </div>
          </div>
        </header>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8 animate-fade-in">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-zinc-800 rounded-2xl">
            <p className="text-zinc-500 text-sm md:text-lg px-4">No products found in this category for the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
