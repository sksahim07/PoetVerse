import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';
import { Download, Sparkles, ArrowRight, ArrowLeft, RefreshCw, Feather, Heart, PenLine } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { generatePoem } from '@/services/llm'; 

// --- ADVANCED CONFIGURATION DATA ---
const RECIPIENTS = [
  { id: 'partner', label: 'Partner / Lover', icon: '❤️' },
  { id: 'mother', label: 'Mother', icon: '👑' },
  { id: 'father', label: 'Father', icon: '🛡️' },
  { id: 'friend', label: 'Best Friend', icon: '🤝' },
  { id: 'sibling', label: 'Brother / Sister', icon: '🎭' },
  { id: 'mentor', label: 'Teacher / Mentor', icon: '📚' },
];

const OCCASIONS = [
  { id: 'birthday', label: 'Birthday Wishes' },
  { id: 'anniversary', label: 'Anniversary' },
  { id: 'apology', label: 'Saying Sorry' },
  { id: 'motivation', label: 'Motivation / Cheer up' },
  { id: 'gratitude', label: 'Thank You' },
  { id: 'random', label: 'Just Because' },
];

const LANGUAGES = [
  { id: 'english', label: 'English' },
  { id: 'bengali', label: 'Bengali (বাংলা)' },
  { id: 'hindi', label: 'Hindi (हिंदी)' },
  { id: 'urdu', label: 'Urdu (اردو)' },
  { id: 'roman_urdu', label: 'Roman Urdu' },
];

// Aesthetic Themes with precise Tailwind classes
const THEMES = [
  { 
    id: 'royal', 
    label: 'Royal Gold', 
    bg: 'bg-stone-950', 
    text: 'text-amber-400', 
    border: 'border-amber-500/40',
    accent: 'text-amber-600/30'
  },
  { 
    id: 'ethereal', 
    label: 'Ethereal White', 
    bg: 'bg-stone-50', 
    text: 'text-stone-800', 
    border: 'border-stone-300',
    accent: 'text-stone-300'
  },
  { 
    id: 'vintage', 
    label: 'Vintage Sepia', 
    bg: 'bg-[#F4F1EA]', 
    text: 'text-[#4A3C31]', 
    border: 'border-[#8B7355]/40',
    accent: 'text-[#8B7355]/20'
  },
  { 
    id: 'ruby', 
    label: 'Deep Ruby', 
    bg: 'bg-[#2A0808]', 
    text: 'text-rose-200', 
    border: 'border-rose-400/40',
    accent: 'text-rose-500/20'
  },
];

const CardStudioPage = () => {
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState({ 
    recipient: '', 
    occasion: '', 
    customInstruction: '', // New Custom Prompt
    language: 'english',   // New Language Selection
    theme: 'royal' 
  });
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);

  // Advanced AI Generation Logic
  const handleGenerate = async () => {
    if (!selection.recipient || !selection.occasion) {
      toast.error("Please complete the required fields.");
      return;
    }
    
    setIsGenerating(true);
    setStep(4); 
    
    try {
      // Building a precise prompt
      let basePrompt = `Write a highly emotional, poetic greeting card message (3-5 lines) for my ${selection.recipient} on the occasion of ${selection.occasion}.`;
      if (selection.customInstruction.trim() !== '') {
        basePrompt += ` VERY IMPORTANT INSTRUCTION TO INCLUDE: ${selection.customInstruction}`;
      }

      const result = await generatePoem({
        poetry_type: 'poem',
        language: selection.language as any,
        emotion: selection.occasion,
        target_person: selection.recipient,
        tone_filter: 'soft_romantic',
        emotion_level: 'very_deep',
        user_message: basePrompt
      });
      
      setGeneratedText(result);
    } catch (error) {
      toast.error("Failed to weave the words. Try again.");
      setStep(3); 
    } finally {
      setIsGenerating(false);
    }
  };

  // High-Res Image Download Logic
  const downloadCard = async () => {
    if (cardRef.current === null) return;
    
    const toastId = toast.loading("Rendering high-res masterpiece...");
    try {
      const dataUrl = await toPng(cardRef.current, { 
        cacheBust: true, 
        pixelRatio: 3, // HD Quality
        quality: 1.0,
      });
      const link = document.createElement('a');
      link.download = `PoetVerse_${selection.recipient}_Card.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Card saved to your device!", { id: toastId });
    } catch (err) {
      toast.error("Failed to render image.", { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#09090b] text-foreground pt-24 pb-20 px-4 transition-colors duration-500">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <Feather className="w-10 h-10 text-amber-500 mx-auto animate-float" />
          <h1 className="text-4xl md:text-6xl font-black font-serif uppercase tracking-widest text-stone-900 dark:text-stone-100">
            Card Studio
          </h1>
          <p className="text-stone-500 font-serif italic text-lg max-w-xl mx-auto">
            Direct the Maestro. Choose your language, set the tone, and forge a masterpiece that echoes your exact feelings.
          </p>
        </div>

        {/* Wizard Container */}
        <div className="bg-white dark:bg-stone-950/40 border border-stone-200 dark:border-stone-800/80 rounded-[2rem] p-6 md:p-12 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: RECIPIENT */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="flex items-center gap-4 border-b border-stone-100 dark:border-stone-800/60 pb-6">
                  <div className="w-10 h-10 rounded-full bg-amber-500 text-stone-950 font-black flex items-center justify-center shadow-lg">1</div>
                  <h2 className="text-3xl font-serif text-stone-800 dark:text-stone-200">Who is receiving this?</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                  {RECIPIENTS.map((rec) => (
                    <button
                      key={rec.id}
                      onClick={() => setSelection({ ...selection, recipient: rec.id })}
                      className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${selection.recipient === rec.id ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10 shadow-md scale-95' : 'border-stone-200 dark:border-stone-800 hover:border-amber-300 dark:hover:border-stone-600 bg-stone-50 dark:bg-stone-900/50'}`}
                    >
                      <span className="text-3xl">{rec.icon}</span>
                      <span className="font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider text-xs md:text-sm">{rec.label}</span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end pt-8">
                  <Button onClick={() => setStep(2)} disabled={!selection.recipient} className="h-14 px-10 bg-stone-900 text-white dark:bg-amber-600 dark:text-stone-950 font-black tracking-[0.2em] uppercase rounded-xl hover:-translate-y-1 transition-transform">
                    Continue <ArrowRight className="w-5 h-5 ml-3" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: OCCASION & CUSTOM PROMPT */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="flex items-center gap-4 border-b border-stone-100 dark:border-stone-800/60 pb-6">
                  <div className="w-10 h-10 rounded-full bg-amber-500 text-stone-950 font-black flex items-center justify-center shadow-lg">2</div>
                  <h2 className="text-3xl font-serif text-stone-800 dark:text-stone-200">What is the message?</h2>
                </div>
                
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-stone-500">Select Core Occasion</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {OCCASIONS.map((occ) => (
                      <button
                        key={occ.id}
                        onClick={() => setSelection({ ...selection, occasion: occ.id })}
                        className={`p-4 rounded-xl border-2 transition-all font-bold text-sm tracking-wider uppercase ${selection.occasion === occ.id ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400' : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-amber-300'}`}
                      >
                        {occ.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-stone-500">
                    <PenLine className="w-4 h-4" /> Personalize It (Optional)
                  </label>
                  <textarea
                    value={selection.customInstruction}
                    onChange={(e) => setSelection({ ...selection, customInstruction: e.target.value })}
                    placeholder="E.g., Mention how much I missed them during the winter, or add an inside joke about coffee..."
                    className="w-full h-32 bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-xl p-5 text-stone-700 dark:text-stone-300 focus:ring-2 focus:ring-amber-500/50 resize-none font-medium placeholder:italic"
                  />
                </div>

                <div className="flex justify-between pt-8 border-t border-stone-100 dark:border-stone-800/60">
                  <Button variant="ghost" onClick={() => setStep(1)} className="h-14 font-bold uppercase tracking-widest"><ArrowLeft className="w-5 h-5 mr-3" /> Back</Button>
                  <Button onClick={() => setStep(3)} disabled={!selection.occasion} className="h-14 px-10 bg-stone-900 text-white dark:bg-amber-600 dark:text-stone-950 font-black tracking-[0.2em] uppercase rounded-xl hover:-translate-y-1 transition-transform">
                    Next Step <ArrowRight className="w-5 h-5 ml-3" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: LANGUAGE & THEME */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="flex items-center gap-4 border-b border-stone-100 dark:border-stone-800/60 pb-6">
                  <div className="w-10 h-10 rounded-full bg-amber-500 text-stone-950 font-black flex items-center justify-center shadow-lg">3</div>
                  <h2 className="text-3xl font-serif text-stone-800 dark:text-stone-200">Aesthetics & Tongue</h2>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-stone-500">Language</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => setSelection({ ...selection, language: lang.id })}
                        className={`py-3 px-2 rounded-xl border-2 transition-all font-bold text-xs tracking-wider uppercase ${selection.language === lang.id ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400' : 'border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-amber-300'}`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-stone-500">Card Design Theme</label>
                  <div className="grid grid-cols-2 gap-4">
                    {THEMES.map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setSelection({ ...selection, theme: t.id })}
                        className={`h-24 rounded-2xl border-2 transition-all flex items-center justify-center font-black tracking-widest uppercase shadow-md ${t.bg} ${t.text} ${selection.theme === t.id ? 'border-amber-500 scale-95 ring-4 ring-amber-500/20' : 'border-transparent hover:scale-[0.98]'}`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-8 border-t border-stone-100 dark:border-stone-800/60">
                  <Button variant="ghost" onClick={() => setStep(2)} className="h-14 font-bold uppercase tracking-widest"><ArrowLeft className="w-5 h-5 mr-3" /> Back</Button>
                  <Button onClick={handleGenerate} className="h-14 px-10 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black tracking-[0.2em] uppercase rounded-xl shadow-xl hover:-translate-y-1 transition-transform">
                    <Sparkles className="w-5 h-5 mr-3" /> Forge Card
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: MASSIVE CARD & DOWNLOAD */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10 text-center">
                {isGenerating ? (
                  <div className="py-32 flex flex-col items-center justify-center space-y-6">
                    <div className="relative">
                      <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full animate-pulse" />
                      <Feather className="w-16 h-16 text-amber-500 animate-bounce relative z-10" />
                    </div>
                    <h3 className="text-3xl font-serif italic text-stone-800 dark:text-stone-200">The Maestro is breathing life into words...</h3>
                    <p className="text-stone-500 uppercase tracking-widest text-xs font-bold">Applying Custom Prompt Constraints</p>
                  </div>
                ) : (
                  <div className="space-y-10">
                    
                    {/* --- THE MASSIVE HIGH-RES CARD UI --- */}
                    <div className="flex justify-center p-4 sm:p-8 bg-stone-100/50 dark:bg-[#050505] rounded-[2rem] overflow-hidden border border-stone-200 dark:border-stone-800/50 shadow-inner">
                      
                      {/* THIS DIV IS CONVERTED TO IMAGE */}
                      <div 
                        ref={cardRef} 
                        className={`w-full max-w-2xl aspect-[3/4] sm:aspect-[4/5] p-10 sm:p-16 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl ${THEMES.find(t => t.id === selection.theme)?.bg} ${THEMES.find(t => t.id === selection.theme)?.text}`}
                      >
                        {/* Elegant Double Border */}
                        <div className={`absolute inset-4 sm:inset-6 border ${THEMES.find(t => t.id === selection.theme)?.border} pointer-events-none`} />
                        <div className={`absolute inset-5 sm:inset-8 border ${THEMES.find(t => t.id === selection.theme)?.border} opacity-50 pointer-events-none`} />
                        
                        {/* Corner Accents */}
                        <Feather className={`absolute top-10 left-10 w-8 h-8 ${THEMES.find(t => t.id === selection.theme)?.accent}`} />
                        <Feather className={`absolute bottom-10 right-10 w-8 h-8 rotate-180 ${THEMES.find(t => t.id === selection.theme)?.accent}`} />
                        
                        {/* Recipient Header */}
                        <p className="text-xs sm:text-sm font-black tracking-[0.4em] uppercase mb-12 opacity-80 z-10 border-b border-current pb-2">
                          For My {selection.recipient}
                        </p>
                        
                        {/* Core Poetry/Message */}
                        <p className="text-3xl sm:text-4xl md:text-5xl font-serif italic leading-[1.6] whitespace-pre-wrap drop-shadow-lg z-10 px-4">
                          "{generatedText}"
                        </p>
                        
                        {/* Footer Branding */}
                        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-70 flex flex-col items-center z-10">
                          <Heart className="w-4 h-4 mb-3" fill="currentColor" />
                          <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] font-black">Crafted with PoetVerse</p>
                        </div>
                      </div>
                      
                    </div>

                    {/* Actions */}
                    <div className="flex justify-center gap-4 flex-wrap max-w-2xl mx-auto">
                      <Button variant="outline" onClick={handleGenerate} className="h-16 px-8 border-2 border-stone-300 dark:border-stone-700 font-black uppercase tracking-widest rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 w-full sm:w-auto">
                        <RefreshCw className="w-5 h-5 mr-3" /> Rewrite
                      </Button>
                      <Button onClick={downloadCard} className="h-16 px-10 bg-emerald-600 hover:bg-emerald-500 text-white font-black tracking-[0.2em] uppercase shadow-2xl hover:shadow-emerald-500/20 hover:-translate-y-1 transition-all rounded-xl w-full sm:w-auto">
                        <Download className="w-5 h-5 mr-3" /> Save HD Image
                      </Button>
                      <Button variant="ghost" onClick={() => { setStep(1); setGeneratedText(''); setSelection({...selection, customInstruction: ''}); }} className="h-16 px-8 font-bold uppercase tracking-widest text-stone-500 w-full sm:w-auto">
                        Start Over
                      </Button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default CardStudioPage;