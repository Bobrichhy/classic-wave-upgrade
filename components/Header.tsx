
import React, { useState } from 'react';
import { Menu, X, ShoppingCart, Search, Sparkles, Scan, Crown, PackageSearch } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ cartCount, onCartClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'HOME', to: '/' },
    { name: 'PERFUME', to: '/category/PERFUME' },
    { name: 'BODY SPRAY', to: '/category/BODY_SPRAY' },
    { name: 'ROLL ON', to: '/category/ROLL_ON' },
    { name: 'VIP', to: '/vip', icon: <Crown size={12} />, highlight: true },
    { name: 'QUIZ', to: '/quiz' },
    { name: 'SCANNER', to: '/scanner', icon: <Scan size={12} />, highlight: false },
    { name: 'STUDIO', to: '/studio', icon: <Sparkles size={12} />, highlight: true },
    { name: 'ORDER', to: '/order' },
    { name: 'MY ORDERS', to: '/my-orders', icon: <PackageSearch size={12} /> },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full bg-black/95 backdrop-blur-lg z-50 border-b border-[#FFD700]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 md:h-20 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="font-serif text-xl md:text-2xl font-bold tracking-widest text-[#FFD700]">
              CLASSIC WAVE
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-4 lg:space-x-7 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className={`flex items-center gap-1 whitespace-nowrap transition-colors text-[10px] lg:text-[13px] font-medium tracking-wider ${
                  link.highlight ? 'text-[#FFD700] hover:text-white' : 'text-[#C0C0C0] hover:text-[#FFD700]'
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            <div className="flex items-center space-x-4 ml-4">
              <button className="text-[#C0C0C0] hover:text-[#FFD700]">
                <Search size={18} />
              </button>
              <button onClick={onCartClick} className="relative text-[#C0C0C0] hover:text-[#FFD700]">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#FFD700] text-black text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-black">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button onClick={onCartClick} className="relative text-[#C0C0C0] hover:text-[#FFD700]">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#FFD700] text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-black">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-[#C0C0C0] hover:text-[#FFD700] focus:outline-none"
            >
              {isOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black border-t border-[#FFD700]/10 animate-fade-in-down absolute w-full left-0">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-4 text-sm font-bold tracking-widest transition-all ${
                  link.highlight ? 'text-[#FFD700] bg-[#FFD700]/5 border-l-2 border-[#FFD700]' : 'text-[#C0C0C0] hover:text-[#FFD700]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {link.icon}
                  {link.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
