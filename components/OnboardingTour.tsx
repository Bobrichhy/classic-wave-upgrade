
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Sparkles, Scan, Wand2, ShoppingBag, PartyPopper, ArrowRight } from 'lucide-react';

const STORAGE_KEY = 'cw_onboarding_seen';

interface Step {
  icon: React.ReactNode;
  title: string;
  body: string;
  cta?: { label: string; to: string };
}

const STEPS: Step[] = [
  {
    icon: <PartyPopper size={28} />,
    title: 'Welcome to Classic Wave',
    body: "Luxury fragrances for the UNILAG community. Let's show you around in a few quick steps.",
  },
  {
    icon: <Sparkles size={28} />,
    title: 'AI Scent Quiz',
    body: "Not sure what to get? Answer 3 quick questions and our AI will recommend the fragrance that matches your vibe.",
    cta: { label: 'Try the Quiz', to: '/quiz' },
  },
  {
    icon: <Scan size={28} />,
    title: 'AI Scanner',
    body: 'Spot a perfume bottle somewhere? Upload a photo and our AI will break down its notes, personality, and vibe.',
    cta: { label: 'Try the Scanner', to: '/scanner' },
  },
  {
    icon: <Wand2 size={28} />,
    title: 'AI Design Studio',
    body: 'Curious what a custom scent could look like? Type a name and our AI generates stunning bottle visuals.',
    cta: { label: 'Try the Studio', to: '/studio' },
  },
  {
    icon: <ShoppingBag size={28} />,
    title: 'How Ordering Works',
    body: "Add items to your cart, checkout, then confirm your order on WhatsApp with your payment screenshot. Fast delivery to any UNILAG hostel.",
  },
];

const OnboardingTour: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      // localStorage unavailable — just skip the tour rather than crash
    }
  }, []);

  const close = () => {
    setVisible(false);
    try { localStorage.setItem(STORAGE_KEY, '1'); } catch { /* ignore */ }
  };

  if (!visible) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-zinc-950 border border-[#FFD700]/30 rounded-3xl shadow-2xl overflow-hidden">
        <div className="h-1 w-full bg-zinc-900">
          <div
            className="h-full bg-[#FFD700] transition-all duration-500"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        <button
          onClick={close}
          aria-label="Skip tour"
          className="absolute top-5 right-5 text-zinc-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8 pt-10 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#FFD700]/10 border border-[#FFD700]/30 flex items-center justify-center text-[#FFD700]">
            {current.icon}
          </div>

          <h2 className="font-serif text-2xl text-white mb-3">{current.title}</h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-8">{current.body}</p>

          <div className="flex items-center justify-center gap-2 mb-8">
            {STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? 'w-6 bg-[#FFD700]' : 'w-1.5 bg-zinc-700'
                }`}
              />
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {current.cta && (
              <Link
                to={current.cta.to}
                onClick={close}
                className="w-full bg-zinc-900 border border-[#FFD700]/30 text-[#FFD700] font-bold py-3 rounded-full text-xs tracking-widest uppercase hover:bg-zinc-800 transition-all"
              >
                {current.cta.label}
              </Link>
            )}
            <button
              onClick={() => (isLast ? close() : setStep(step + 1))}
              className="w-full bg-[#FFD700] text-black font-bold py-3.5 rounded-full text-xs tracking-widest uppercase hover:bg-white transition-all flex items-center justify-center gap-2"
            >
              {isLast ? "Let's Go" : 'Next'}
              {!isLast && <ArrowRight size={14} />}
            </button>
            {!isLast && (
              <button
                onClick={close}
                className="text-zinc-600 hover:text-zinc-400 text-xs tracking-widest uppercase transition-colors"
              >
                Skip Tour
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingTour;
