
import React, { useState, useEffect } from 'react';
import { PRODUCTS } from '../constants';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Star, PlayCircle } from 'lucide-react';
import { Product } from '../types';
import { Link } from 'react-router-dom';

const SLIDES = [
  "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=1600",
  "https://images.unsplash.com/photo-1583445013765-d1c20e4a5b5b?auto=format&fit=crop&q=80&w=1600",
  "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?auto=format&fit=crop&q=80&w=1600",
  "https://images.unsplash.com/photo-1547887538-e3a2f32cb1cc?auto=format&fit=crop&q=80&w=1600"
];

const QUOTES = [
  "No elegance is possible without perfume. It is the unseen, unforgettable, ultimate accessory.",
  "A woman’s perfume tells more about her than her handwriting.",
  "Long after one has forgotten what a woman wore, the memory of her perfume lingers.",
  "Scent is the strongest tie to memory.",
  "Perfume is the invisible, unforgettable, fashionable accessory that heralds your arrival and prolongs your departure."
];

const PHRASES = [
  "Essence of Timeless Elegance",
  "Indulge in Exquisite Opulence",
  "Where Luxury Lingers on the Skin",
  "A Whisper of Refinement, Bottled"
];

interface HomeProps {
  onAddToCart: (p: Product) => void;
}

const Home: React.FC<HomeProps> = ({ onAddToCart }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  // Pick one from each category for variety
  const featured = [
    PRODUCTS.find(p => p.id === 'p-storm-elixir-inferno'),
    PRODUCTS.find(p => p.id === 'p-chocolate-musk-new'),
    PRODUCTS.find(p => p.id === 'bs-24k-gold'),
    PRODUCTS.find(p => p.id === 'ro-nivea-men-bw-invisible'),
  ].filter(Boolean) as Product[];

  // Background Slideshow Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // Typewriter Logic
  useEffect(() => {
    const currentPhrase = PHRASES[phraseIndex];
    const typingSpeed = isDeleting ? 40 : 100;
    const pauseTime = 3000;

    const handleTyping = () => {
      if (!isDeleting && displayText === currentPhrase) {
        setTimeout(() => setIsDeleting(true), pauseTime);
        return;
      }

      if (isDeleting && displayText === '') {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % PHRASES.length);
        return;
      }

      const nextText = isDeleting 
        ? currentPhrase.substring(0, displayText.length - 1)
        : currentPhrase.substring(0, displayText.length + 1);
      
      setDisplayText(nextText);
    };

    const typingTimer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(typingTimer);
  }, [displayText, isDeleting, phraseIndex]);

  return (
    <div className="pt-16 md:pt-20 overflow-x-hidden">
      {/* Cinematic Hero Section with Image Slideshow */}
      <section className="relative min-h-[90vh] md:h-[100vh] flex items-center justify-center overflow-hidden py-20 md:py-0">
        {/* Automatic Image Slideshow Background */}
        <div className="absolute inset-0 z-0">
          {SLIDES.map((url, index) => (
            <div
              key={url}
              className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
                index === currentSlide ? 'opacity-60' : 'opacity-0'
              }`}
            >
              <img
                src={url}
                alt="Luxury Fragrance Background"
                className={`w-full h-full object-cover ${index === currentSlide ? 'ken-burns' : ''}`}
              />
            </div>
          ))}
          
          {/* Advanced Luxury Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-70" />
          <div className="absolute inset-0 backdrop-blur-[1px]" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-5 py-2 rounded-full border border-[#FFD700]/40 bg-black/40 backdrop-blur-md text-[#FFD700] text-[9px] md:text-[11px] font-bold tracking-[0.3em] md:tracking-[0.4em] mb-6 md:mb-10 shadow-lg shadow-[#FFD700]/5 animate-fade-in">
             <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-[#FFD700] animate-pulse" />
             ESTABLISHED AT UNILAG
          </div>
          
          {/* Main Shimmering Gradient Headline - Highly Responsive Scaling */}
          <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-4 md:mb-6 tracking-tighter drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] leading-[0.9] shimmer-text">
            Unleash Your <br />
            <span className="italic">Signature</span> Scent
          </h1>

          {/* Typewriter Secondary Headline - Adjusting height for mobile */}
          <div className="h-10 sm:h-12 md:h-16 flex items-center justify-center mb-8 md:mb-10">
            <p className="text-[#FFD700] font-serif text-lg sm:text-2xl md:text-3xl italic tracking-wide opacity-90 px-4">
              {displayText}
              <span className="inline-block w-[2px] h-5 sm:h-6 md:h-8 bg-[#FFD700] ml-1 animate-pulse" />
            </p>
          </div>
          
          <p className="text-[#E0E0E0] text-sm md:text-xl mb-10 md:mb-14 max-w-2xl mx-auto font-light tracking-wide leading-relaxed drop-shadow-md px-4">
            The invisible personality that lingers. Discover luxury fragrances curated specifically for the <span className="text-white font-semibold whitespace-nowrap">UNILAG community</span>.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center px-6">
            <Link 
              to="/category/PERFUME" 
              className="w-full sm:w-auto group relative bg-[#FFD700] text-black px-10 md:px-14 py-4 md:py-6 rounded-full text-center font-bold tracking-widest transition-all transform hover:scale-105 shadow-[0_20px_50px_rgba(255,215,0,0.25)] flex items-center justify-center gap-3 overflow-hidden text-xs md:text-sm"
            >
              <span className="relative z-10">SHOP COLLECTIONS</span>
              <ArrowRight size={18} className="relative z-10 group-hover:translate-x-2 transition-transform duration-300" />
              <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </Link>
            
            <Link 
              to="/quiz" 
              className="w-full sm:w-auto group flex items-center justify-center gap-3 text-white font-bold tracking-widest hover:text-[#FFD700] transition-all py-4 md:py-5 px-8 md:px-10 border border-white/20 rounded-full backdrop-blur-lg bg-white/5 hover:bg-white/10 text-xs md:text-sm"
            >
              <PlayCircle size={20} className="text-[#FFD700] group-hover:scale-110 transition-transform" />
              TAKE SCENT QUIZ
            </Link>
          </div>
        </div>

        {/* Infinite Scrolling Marquee */}
        <div className="absolute bottom-0 left-0 w-full bg-black/60 backdrop-blur-xl border-t border-[#FFD700]/20 py-3 md:py-4 overflow-hidden z-20">
          <div className="flex whitespace-nowrap animate-marquee">
            <div className="flex items-center gap-8 md:gap-12 px-6">
              {QUOTES.map((quote, i) => (
                <div key={i} className="flex items-center gap-8 md:gap-12">
                  <span className="text-white/60 font-serif text-[10px] md:text-sm tracking-wide italic">"{quote}"</span>
                  <span className="text-[#FFD700]/40 text-lg md:text-xl">•</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-8 md:gap-12 px-6" aria-hidden="true">
              {QUOTES.map((quote, i) => (
                <div key={`dup-${i}`} className="flex items-center gap-8 md:gap-12">
                  <span className="text-white/60 font-serif text-[10px] md:text-sm tracking-wide italic">"{quote}"</span>
                  <span className="text-[#FFD700]/40 text-lg md:text-xl">•</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-20 md:py-32 px-4 bg-black relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-20 gap-8">
            <div className="max-w-xl">
              <h2 className="text-[#FFD700] text-[10px] md:text-xs font-bold tracking-[0.4em] md:tracking-[0.5em] mb-4 md:mb-6 uppercase flex items-center gap-4">
                <div className="w-8 md:w-12 h-px bg-[#FFD700]/30" />
                Selected For You
              </h2>
              <h3 className="font-serif text-4xl md:text-6xl text-white tracking-tight leading-tight">Our Exclusive <br /><span className="italic">Favorites</span></h3>
            </div>
            <Link to="/category/PERFUME" className="text-zinc-500 hover:text-[#FFD700] flex items-center group gap-3 text-[10px] md:text-xs font-bold tracking-[0.2em] transition-all pb-2 border-b border-zinc-800 hover:border-[#FFD700]">
              VIEW FULL COLLECTION <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 md:py-40 bg-zinc-950 border-y border-zinc-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 items-center gap-16 md:gap-32">
          <div className="order-2 lg:order-1 relative group">
            <div className="absolute -inset-4 md:-inset-6 border border-[#FFD700]/20 rounded-3xl translate-x-3 translate-y-3 md:translate-x-4 md:translate-y-4" />
            <div className="relative overflow-hidden rounded-2xl">
              <img 
                src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&q=80&w=1200" 
                className="w-full shadow-2xl relative z-10 border border-white/5" 
                alt="Fragrance Philosophy" 
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="font-serif text-4xl md:text-6xl text-white mb-6 md:mb-10 leading-tight">Fragrance is the invisible <br /><span className="text-[#FFD700] italic">personality</span>.</h2>
            <p className="text-zinc-400 text-base md:text-xl leading-relaxed mb-8 md:mb-12 font-light">
              At Classic Wave, we believe that how you smell is just as important as how you look. Based in the heart of Akoka, we've curated a selection that brings premium luxury to the vibrant student life of UNILAG.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8">
              {[
                "100% Authentic Scents",
                "Curated For Him & Her",
                "Affordable Luxury",
                "Direct Hostel Delivery"
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4 text-zinc-300 group">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-[#FFD700]/20 flex items-center justify-center">
                    <Star size={14} fill="currentColor" />
                  </div>
                  <span className="text-[10px] md:text-sm font-bold tracking-widest uppercase">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Luxury Testimonial Section */}
      <section className="py-20 md:py-40 px-4 bg-black text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-[#FFD700] mb-8 md:mb-12 flex justify-center gap-1 md:gap-2">
            {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#FFD700" />)}
          </div>
          <p className="text-xl md:text-5xl text-zinc-200 font-serif italic mb-10 md:mb-14 leading-[1.4] tracking-tight px-4">
            "I ordered the Mousuff Intense and it stayed on for over 12 hours! The delivery to Moremi Hall was super fast. Highly recommend Classic Wave!"
          </p>
          <div className="flex flex-col items-center">
             <div className="w-12 h-[2px] bg-[#FFD700] mb-4 md:mb-6" />
             <p className="text-[#FFD700] font-bold tracking-[0.4em] md:tracking-[0.5em] uppercase text-xs md:text-sm">CHIOMA</p>
             <p className="text-zinc-500 text-[9px] md:text-[10px] tracking-[0.3em] mt-2 uppercase">UNILAG Moremi Resident</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
