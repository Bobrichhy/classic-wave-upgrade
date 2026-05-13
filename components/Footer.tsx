
import React from 'react';
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <h2 className="font-serif text-3xl font-bold text-[#FFD700] tracking-widest mb-6">CLASSIC WAVE</h2>
          <p className="text-zinc-500 mb-8 max-w-sm">
            Mobile-based luxury fragrance store serving the UNILAG community. Quality you can smell, luxury you can afford.
          </p>
          <div className="flex space-x-4">
            <a href="https://wa.me/2348085597947" target="_blank" rel="noopener noreferrer" className="text-zinc-400 hover:text-[#FFD700] transition-colors" aria-label="WhatsApp"><MessageCircle size={24} /></a>
            <a href="#" className="text-zinc-400 hover:text-[#FFD700] transition-colors" aria-label="Instagram"><Instagram size={24} /></a>
            <a href="#" className="text-zinc-400 hover:text-[#FFD700] transition-colors" aria-label="Facebook"><Facebook size={24} /></a>
            <a href="#" className="text-zinc-400 hover:text-[#FFD700] transition-colors" aria-label="Twitter"><Twitter size={24} /></a>
          </div>
        </div>

        <div>
          <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Quick Links</h3>
          <ul className="space-y-4 text-zinc-500 text-sm">
            <li><Link to="/category/PERFUME" className="hover:text-[#FFD700]">Perfumes</Link></li>
            <li><Link to="/category/BODY_SPRAY" className="hover:text-[#FFD700]">Body Sprays</Link></li>
            <li><Link to="/category/ROLL_ON" className="hover:text-[#FFD700]">Roll ons</Link></li>
            <li><Link to="/quiz" className="hover:text-[#FFD700]">Scent Quiz</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-sm">Contact Us</h3>
          <ul className="space-y-4 text-zinc-500 text-sm">
            <li className="flex items-center gap-3"><MapPin size={16} className="text-[#FFD700]" /> University of Lagos, Akoka</li>
            <li className="flex items-center gap-3"><Phone size={16} className="text-[#FFD700]" /> +234 808 559 7947</li>
            <li className="flex items-center gap-3"><Mail size={16} className="text-[#FFD700]" /> sales@classicwave.com</li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 mt-20 pt-10 border-t border-zinc-900 text-center">
        <p className="text-zinc-600 text-xs tracking-widest">
          &copy; {new Date().getFullYear()} CLASSIC WAVE FRAGRANCES. ALL RIGHTS RESERVED. <br />
          MOBILE DELIVERY TO ALL UNILAG HOSTELS.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
