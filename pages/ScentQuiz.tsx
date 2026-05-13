
import React, { useState } from 'react';
import { getScentRecommendation, parseGeminiError } from '../geminiService';
import { PRODUCTS } from '../constants';
import { Product } from '../types';
import { Sparkles, Loader2, RefreshCw, ShoppingCart, AlertCircle, ChevronLeft } from 'lucide-react';

interface ScentQuizProps {
  onAddToCart: (p: Product) => void;
}

const ERROR_MESSAGES: Record<string, string> = {
  API_KEY_MISSING: "AI service is not configured. Please contact the store.",
  QUOTA_EXCEEDED: "Our AI sommelier is taking a short break. Please try again in a few minutes.",
  NETWORK_ERROR: "Connection issue. Please check your internet and try again.",
  UNKNOWN_ERROR: "Something went wrong while curating your scent. Please try again."
};

const ScentQuiz: React.FC<ScentQuizProps> = ({ onAddToCart }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ mood: '', occasion: '', preference: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<{ product: Product; reason: string } | null>(null);

  const questions = [
    {
      key: 'mood',
      title: 'How do you want to feel?',
      subtitle: 'Set the tone for your signature scent',
      options: [
        { label: 'Powerful & Confident', emoji: '🔥' },
        { label: 'Fresh & Energetic', emoji: '⚡' },
        { label: 'Romantic & Sweet', emoji: '🌹' },
        { label: 'Relaxed & Serene', emoji: '🌿' }
      ]
    },
    {
      key: 'occasion',
      title: 'Where are you heading?',
      subtitle: 'Match your fragrance to the moment',
      options: [
        { label: 'Class / Daily Grind', emoji: '📚' },
        { label: 'Night Out / Dinner', emoji: '🌙' },
        { label: 'Special Date', emoji: '💎' },
        { label: 'Gym / Sports', emoji: '🏋️' }
      ]
    },
    {
      key: 'preference',
      title: 'What notes do you prefer?',
      subtitle: 'Your scent DNA',
      options: [
        { label: 'Woody & Spicy', emoji: '🪵' },
        { label: 'Floral & Fruity', emoji: '🌸' },
        { label: 'Fresh & Aquatic', emoji: '🌊' },
        { label: 'Sweet & Oriental', emoji: '✨' }
      ]
    }
  ];

  const handleSelect = (val: string) => {
    const key = questions[step].key;
    const newAnswers = { ...answers, [key]: val };
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      processQuiz(newAnswers);
    }
  };

  const processQuiz = async (finalAnswers: typeof answers) => {
    setLoading(true);
    setError(null);
    try {
      const result = await getScentRecommendation(finalAnswers);
      const product = PRODUCTS.find(p => p.id === result.productId) || PRODUCTS[0];
      setRecommendation({ product, reason: result.reason });
    } catch (err: any) {
      const code = parseGeminiError(err);
      setError(ERROR_MESSAGES[code] || ERROR_MESSAGES.UNKNOWN_ERROR);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers({ mood: '', occasion: '', preference: '' });
    setRecommendation(null);
    setError(null);
  };

  const progressPct = ((step) / questions.length) * 100;

  return (
    <div className="pt-24 md:pt-32 pb-20 px-4 min-h-screen">
      <div className="max-w-2xl mx-auto">

        {!recommendation && !loading && !error && (
          <div className="animate-fade-in">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/5 text-[#FFD700] text-[10px] font-bold tracking-[0.3em] mb-6 uppercase">
                <Sparkles size={12} className="animate-pulse" /> AI SCENT CURATOR
              </div>
              <h1 className="font-serif text-4xl md:text-5xl text-white mb-3">Scent Persona Quiz</h1>
              <p className="text-zinc-500 text-sm">Let our AI find the fragrance that speaks to your soul.</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-[10px] text-zinc-600 font-bold tracking-widest uppercase mb-2">
                <span>Question {step + 1} of {questions.length}</span>
                <span>{Math.round(progressPct)}% complete</span>
              </div>
              <div className="h-1 bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FFD700] rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${((step + 0.5) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-zinc-950 border border-zinc-900 p-8 rounded-3xl shadow-2xl">
              {step > 0 && (
                <button
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-1 text-zinc-600 hover:text-zinc-300 text-xs mb-6 transition-colors"
                >
                  <ChevronLeft size={14} /> Back
                </button>
              )}
              <p className="text-zinc-500 text-xs tracking-widest uppercase mb-1">{questions[step].subtitle}</p>
              <h2 className="text-white text-2xl font-serif italic mb-8">{questions[step].title}</h2>

              <div className="grid gap-3">
                {questions[step].options.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => handleSelect(opt.label)}
                    className="w-full text-left p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-300 hover:border-[#FFD700] hover:text-white hover:bg-zinc-900 transition-all group flex items-center gap-4"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">{opt.emoji}</span>
                    <span className="font-medium">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="text-center py-20 flex flex-col items-center">
            <div className="relative mb-8">
              <div className="w-24 h-24 rounded-full border-2 border-[#FFD700]/20 flex items-center justify-center">
                <Loader2 size={40} className="text-[#FFD700] animate-spin" />
              </div>
              <div className="absolute inset-0 rounded-full bg-[#FFD700]/5 animate-ping" />
            </div>
            <h2 className="font-serif text-3xl text-white italic mb-3">Curating your essence...</h2>
            <p className="text-zinc-500 text-sm">Analyzing your aura for the perfect match</p>
          </div>
        )}

        {error && (
          <div className="text-center py-20 bg-zinc-950 border border-red-900/20 rounded-3xl p-12 animate-fade-in">
            <AlertCircle size={48} className="text-red-500 mx-auto mb-6" />
            <h2 className="text-white text-2xl font-serif mb-4">Quiz Unavailable</h2>
            <p className="text-zinc-400 mb-8 max-w-md mx-auto text-sm leading-relaxed">{error}</p>
            <button
              onClick={reset}
              className="bg-[#FFD700] text-black font-bold px-10 py-3 rounded-full hover:bg-white transition-colors"
            >
              TRY AGAIN
            </button>
          </div>
        )}

        {recommendation && (
          <div className="bg-zinc-950 border border-[#FFD700]/30 rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
            <div className="h-1 w-full bg-gradient-to-r from-[#FFD700] via-amber-400 to-[#FFD700]" />
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-2 text-[#FFD700] mb-6">
                <Sparkles size={16} className="animate-pulse" />
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase">Your AI Scent Match</span>
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-2/5">
                  <img
                    src={recommendation.product.imageUrl}
                    className="w-full h-80 object-cover rounded-2xl shadow-xl border border-zinc-800"
                    alt={recommendation.product.name}
                  />
                </div>
                <div className="w-full md:w-3/5">
                  <h2 className="font-serif text-3xl md:text-4xl text-white mb-1">{recommendation.product.name}</h2>
                  <p className="text-[#FFD700] text-2xl font-bold mb-6">₦{recommendation.product.price.toLocaleString()}</p>
                  <div className="bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800 mb-8 relative">
                    <span className="text-[#FFD700] text-4xl leading-none absolute -top-2 left-4">"</span>
                    <p className="italic text-zinc-300 text-sm leading-relaxed pt-4">{recommendation.reason}</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => onAddToCart(recommendation.product)}
                      className="w-full bg-[#FFD700] text-black font-bold py-4 rounded-full flex items-center justify-center gap-2 hover:bg-white transition-all"
                    >
                      ADD TO CART <ShoppingCart size={18} />
                    </button>
                    <button
                      onClick={reset}
                      className="w-full border border-zinc-700 text-zinc-400 font-bold py-4 rounded-full flex items-center justify-center gap-2 hover:text-white hover:border-zinc-500 transition-all"
                    >
                      RETAKE QUIZ <RefreshCw size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScentQuiz;
