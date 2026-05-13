import React, { useState } from 'react';
import { generateProductImage, parseGeminiError } from '../geminiService';
import { Sparkles, Download, RefreshCw, Wand2, Image as ImageIcon, Loader2, AlertCircle, Clock } from 'lucide-react';

const ASPECT_RATIOS = [
  { label: "1:1", value: "1:1" },
  { label: "3:4", value: "3:4" },
  { label: "4:3", value: "4:3" },
  { label: "9:16", value: "9:16" },
  { label: "16:9", value: "16:9" }
];

const ERROR_MESSAGES: Record<string, { title: string; body: string; icon: 'clock' | 'alert' }> = {
  API_KEY_MISSING: {
    title: "Studio Offline",
    body: "AI service is not configured. Please contact the store.",
    icon: 'alert'
  },
  QUOTA_EXCEEDED: {
    title: "Studio Busy",
    body: "Our AI studio is at capacity right now. Free tier quotas reset daily — please try again shortly or contact us to upgrade.",
    icon: 'clock'
  },
  NETWORK_ERROR: {
    title: "Connection Lost",
    body: "Check your internet connection and try again.",
    icon: 'alert'
  },
  UNKNOWN_ERROR: {
    title: "Studio Error",
    body: "Something went wrong. Please try again in a moment.",
    icon: 'alert'
  }
};

const DesignStudio: React.FC = () => {
  const [productName, setProductName] = useState('');
  const [aspectRatio, setAspectRatio] = useState('3:4');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorKey, setErrorKey] = useState<string | null>(null);

  const handleGenerate = async (name?: string) => {
    const target = name ?? productName;
    if (!target.trim()) return;
    if (name) setProductName(name);

    setIsGenerating(true);
    setErrorKey(null);
    try {
      const imageUrl = await generateProductImage(target);
      setGeneratedImage(imageUrl);
    } catch (err: any) {
      setErrorKey(parseGeminiError(err));
    } finally {
      setIsGenerating(false);
    }
  };

  const presets = [
    "Midnight Oud Intense",
    "Yara Pink Petal",
    "24K Liquid Gold",
    "Storm Tiger Claw",
    "Amber Silk Essence"
  ];

  const errInfo = errorKey ? ERROR_MESSAGES[errorKey] ?? ERROR_MESSAGES.UNKNOWN_ERROR : null;

  return (
    <div className="pt-24 md:pt-32 pb-20 px-4 min-h-screen bg-black">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-14 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/5 text-[#FFD700] text-[10px] font-bold tracking-[0.3em] mb-6 uppercase">
            <Sparkles size={14} className="animate-pulse" /> AI VISUAL STUDIO
          </div>
          <h1 className="font-serif text-5xl md:text-7xl text-white mb-4 tracking-tighter leading-tight">
            Design Your <br /><span className="text-[#FFD700] italic">Signature</span> Visual
          </h1>
          <p className="text-zinc-500 max-w-2xl mx-auto text-base font-light leading-relaxed">
            Generate studio-grade fragrance photography using Gemini AI. Type a name, pick a canvas, and watch it come to life.
          </p>
        </header>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Controls */}
          <div className="space-y-7 bg-zinc-950 p-8 md:p-10 rounded-3xl border border-zinc-900 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FFD700]/30 to-transparent" />

            {/* Product Name Input */}
            <div>
              <label className="block text-zinc-500 text-[10px] font-bold uppercase mb-3 tracking-[0.2em]">Product Identity</label>
              <div className="relative">
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                  placeholder="e.g. Royal Musk Elixir"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-white focus:border-[#FFD700] outline-none transition-all pr-12 text-sm placeholder:text-zinc-700"
                />
                <Wand2 className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
              </div>
            </div>

            {/* Aspect Ratio */}
            <div>
              <label className="block text-zinc-500 text-[10px] font-bold uppercase mb-3 tracking-[0.2em]">Canvas Ratio</label>
              <div className="grid grid-cols-5 gap-2">
                {ASPECT_RATIOS.map((ratio) => (
                  <button
                    key={ratio.value}
                    onClick={() => setAspectRatio(ratio.value)}
                    className={`flex items-center justify-center p-3 rounded-xl border transition-all text-[10px] font-bold ${
                      aspectRatio === ratio.value
                        ? 'border-[#FFD700] bg-[#FFD700]/10 text-[#FFD700]'
                        : 'border-zinc-800 bg-zinc-900 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300'
                    }`}
                  >
                    {ratio.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Presets */}
            <div>
              <label className="block text-zinc-500 text-[10px] font-bold uppercase mb-3 tracking-[0.2em]">Quick Presets</label>
              <div className="flex flex-wrap gap-2">
                {presets.map(name => (
                  <button
                    key={name}
                    onClick={() => handleGenerate(name)}
                    disabled={isGenerating}
                    className="px-4 py-2 rounded-lg border border-zinc-800 bg-zinc-900/30 text-zinc-500 text-xs hover:border-[#FFD700] hover:text-[#FFD700] transition-all font-medium disabled:opacity-40"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={() => handleGenerate()}
              disabled={isGenerating || !productName.trim()}
              className={`w-full py-5 rounded-full font-bold tracking-[0.2em] uppercase text-xs flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-xl ${
                isGenerating || !productName.trim()
                  ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800'
                  : 'bg-[#FFD700] text-black hover:bg-white shadow-[#FFD700]/10'
              }`}
            >
              {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
              {isGenerating ? 'RENDERING...' : 'GENERATE MASTERPIECE'}
            </button>

            {/* Error */}
            {errInfo && (
              <div className="flex items-start gap-3 p-5 bg-red-950/10 border border-red-900/25 rounded-2xl animate-fade-in">
                {errInfo.icon === 'clock'
                  ? <Clock className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
                  : <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
                }
                <div>
                  <p className="text-white text-xs font-bold mb-1">{errInfo.title}</p>
                  <p className="text-zinc-400 text-xs leading-relaxed">{errInfo.body}</p>
                </div>
              </div>
            )}
          </div>

          {/* Preview Canvas */}
          <div className="relative group flex flex-col items-center">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#FFD700]/20 to-amber-600/20 rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition duration-1000 pointer-events-none" />
            <div
              className="relative bg-zinc-950 rounded-[2rem] border border-zinc-900 overflow-hidden flex items-center justify-center shadow-2xl w-full"
              style={{ aspectRatio: aspectRatio.replace(':', '/') }}
            >
              {generatedImage ? (
                <img src={generatedImage} alt="Generated Visual" className="w-full h-full object-cover animate-fade-in" />
              ) : (
                <div className="text-center p-12 max-w-xs">
                  <div className="w-20 h-20 bg-zinc-900/50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-zinc-800 border border-zinc-800">
                    {isGenerating
                      ? <Loader2 size={32} className="animate-spin text-[#FFD700]" />
                      : <ImageIcon size={32} />
                    }
                  </div>
                  <h3 className="text-zinc-400 font-serif text-2xl mb-2 italic">Visual Preview</h3>
                  <p className="text-zinc-600 text-xs leading-relaxed tracking-wide">
                    {isGenerating ? "Rendering at 8K resolution..." : "Artistry awaits your command."}
                  </p>
                </div>
              )}
            </div>

            {generatedImage && (
              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = generatedImage;
                    link.download = `${productName.replace(/\s+/g, '-').toLowerCase()}-visual.png`;
                    link.click();
                  }}
                  className="flex items-center gap-2 px-8 py-3 bg-zinc-900 rounded-full text-white hover:text-[#FFD700] border border-zinc-800 hover:border-[#FFD700] text-[10px] font-bold tracking-widest transition-all"
                >
                  <Download size={14} /> DOWNLOAD
                </button>
                <button
                  onClick={() => handleGenerate()}
                  disabled={isGenerating}
                  className="p-3 bg-zinc-900 rounded-full text-white hover:text-[#FFD700] border border-zinc-800 hover:border-[#FFD700] transition-all disabled:opacity-40"
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignStudio;
