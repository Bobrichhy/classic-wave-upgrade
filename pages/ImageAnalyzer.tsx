import React, { useState, useRef, useCallback } from 'react';
import { analyzeProductImage, parseGeminiError } from '../geminiService';
import { Upload, Scan, Loader2, AlertCircle, X, Camera, Sparkles, RefreshCw } from 'lucide-react';

const ERROR_MESSAGES: Record<string, string> = {
  API_KEY_MISSING: "AI service is not configured. Please contact the store.",
  QUOTA_EXCEEDED: "Our scanner is taking a short break. Please try again in a few minutes.",
  NETWORK_ERROR: "Connection issue. Please check your internet and try again.",
  UNKNOWN_ERROR: "Unable to analyze the image at this moment. Please try again."
};

// Render analysis with bold section headers
const FormattedAnalysis: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n').filter(l => l.trim());
  return (
    <div className="space-y-3">
      {lines.map((line, i) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          return (
            <h4 key={i} className="text-[#FFD700] text-[10px] font-bold tracking-[0.2em] uppercase mt-5 first:mt-0">
              {line.replace(/\*\*/g, '')}
            </h4>
          );
        }
        return (
          <p key={i} className="text-zinc-300 text-sm leading-relaxed font-light">
            {line}
          </p>
        );
      })}
    </div>
  );
};

const ImageAnalyzer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setAnalysis(null);
    setError(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) processFile(e.target.files[0]);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) processFile(file);
  }, []);

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeProductImage(selectedFile);
      setAnalysis(result || "No analysis could be generated.");
    } catch (err: any) {
      const code = parseGeminiError(err);
      setError(ERROR_MESSAGES[code] || ERROR_MESSAGES.UNKNOWN_ERROR);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setAnalysis(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="pt-24 md:pt-32 pb-20 px-4 min-h-screen bg-black">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/5 text-[#FFD700] text-[10px] font-bold tracking-[0.3em] mb-6 uppercase">
            <Scan size={14} className="animate-pulse" /> AI OPTICAL SENSOR
          </div>
          <h1 className="font-serif text-5xl md:text-6xl text-white mb-4 tracking-tighter leading-tight">
            Decode The <br /><span className="text-[#FFD700] italic">Essence</span>
          </h1>
          <p className="text-zinc-500 max-w-xl mx-auto text-base font-light leading-relaxed">
            Upload any fragrance bottle photo to uncover its notes, personality, and styling secrets using Gemini Vision.
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Upload Area */}
          <div className="space-y-4">
            {!previewUrl ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                className={`group cursor-pointer bg-zinc-950 border-2 border-dashed rounded-3xl h-96 flex flex-col items-center justify-center p-8 transition-all ${
                  isDragging
                    ? 'border-[#FFD700] bg-[#FFD700]/5'
                    : 'border-zinc-800 hover:border-[#FFD700]/50 hover:bg-zinc-900'
                }`}
              >
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all border ${
                  isDragging
                    ? 'bg-[#FFD700]/10 border-[#FFD700] scale-110'
                    : 'bg-zinc-900 border-zinc-800 group-hover:border-[#FFD700] group-hover:scale-105'
                }`}>
                  {isDragging
                    ? <Upload size={32} className="text-[#FFD700]" />
                    : <Camera size={32} className="text-zinc-500 group-hover:text-[#FFD700]" />
                  }
                </div>
                <p className="text-zinc-300 font-serif text-xl italic mb-1">
                  {isDragging ? 'Drop to scan' : 'Upload or Drag & Drop'}
                </p>
                <p className="text-zinc-600 text-xs tracking-widest uppercase">JPG · PNG · WEBP</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </div>
            ) : (
              <div className="relative h-96 bg-zinc-950 rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl group">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                <button
                  onClick={clearSelection}
                  className="absolute top-4 right-4 w-9 h-9 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-red-500/80 transition-all z-10"
                >
                  <X size={16} />
                </button>
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-sm">
                    <Loader2 size={44} className="text-[#FFD700] animate-spin mb-4" />
                    <p className="text-white font-bold tracking-widest text-[10px] animate-pulse">ANALYZING SCENT PROFILE...</p>
                  </div>
                )}
              </div>
            )}

            {previewUrl && !isAnalyzing && (
              <button
                onClick={handleAnalyze}
                className="w-full bg-[#FFD700] text-black font-bold py-4 rounded-full flex items-center justify-center gap-2 uppercase tracking-widest text-xs hover:bg-white transition-all shadow-lg shadow-[#FFD700]/10"
              >
                <Scan size={16} /> ANALYZE NOW
              </button>
            )}

            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-950/20 border border-red-900/30 rounded-xl">
                <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                <div>
                  <p className="text-red-400 text-xs leading-relaxed">{error}</p>
                  {previewUrl && (
                    <button onClick={handleAnalyze} className="text-[#FFD700] text-[10px] font-bold mt-2 flex items-center gap-1 hover:opacity-80">
                      <RefreshCw size={10} /> Retry
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Analysis Result */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-8 relative overflow-hidden min-h-96">
            {analysis ? (
              <div className="animate-fade-in h-full overflow-y-auto">
                <div className="flex items-center gap-2 mb-6 border-b border-[#FFD700]/10 pb-4">
                  <Sparkles size={14} className="text-[#FFD700]" />
                  <h3 className="text-[#FFD700] text-[10px] font-bold tracking-[0.2em] uppercase">Gemini Analysis</h3>
                </div>
                <FormattedAnalysis text={analysis} />
                <button
                  onClick={clearSelection}
                  className="mt-8 w-full border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600 text-xs font-bold py-3 rounded-full tracking-widest uppercase transition-all flex items-center justify-center gap-2"
                >
                  <Scan size={12} /> SCAN ANOTHER
                </button>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 rounded-3xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-center mb-6">
                  <Scan size={32} className="text-zinc-700" />
                </div>
                <p className="text-zinc-600 font-serif text-xl italic">Awaiting Visual Input</p>
                <p className="text-zinc-700 text-xs mt-2 max-w-[200px] leading-relaxed">
                  Upload an image to receive a professional fragrance breakdown
                </p>
              </div>
            )}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#FFD700] rounded-full filter blur-[100px] opacity-5 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageAnalyzer;
