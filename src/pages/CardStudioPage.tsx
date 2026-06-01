import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';
import { Download, Sparkles, ArrowRight, ArrowLeft, RefreshCw, Feather, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { generatePoem } from '@/services/llm'; // Amader AI Engine

// --- CONFIGURATION DATA ---
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

const THEMES = [
  { id: 'royal', label: 'Royal Gold', bg: 'bg-gradient-to-br from-stone-900 via-[#1a1510] to-stone-900', text: 'text-amber-400', border: 'border-amber-500/30' },
  { id: 'minimal', label: 'Clean Minimal', bg: 'bg-stone-50', text: 'text-stone-800', border: 'border-stone-200' },
  { id: 'midnight', label: 'Midnight Blue', bg: 'bg-gradient-to-br from-slate-900 to-blue-950', text: 'text-blue-100', border: 'border-blue-500/20' },
  { id: 'blush', label: 'Soft Blush', bg: 'bg-rose-50', text: 'text-rose-900', border: 'border-rose-200' },
];

const CardStudioPage = () => {
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState({ recipient: '', occasion: '', theme: 'royal' });
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);

  // AI Generation Logic
  const handleGenerate = async () => {
    if (!selection.recipient || !selection.occasion) {
      toast.error("Please select who it's for and what to say!");
      return;
    }
    
    setIsGenerating(true);
    setStep(4); // Move to final step immediately for loading state
    
    try {
      const result = await generatePoem({
        poetry_type: 'couplet',
        language: 'english', // Can make this dynamic later
        emotion: selection.occasion,
        target_person: selection.recipient,
        tone_filter: 'soft_romantic',
        line_length: 'short',
        user_message: `Write a short, highly emotional greeting card message (2-4 lines) for my ${selection.recipient} on their ${selection.occasion}. Make it extremely touching and beautiful.`
      });
      setGeneratedText(result);
    } catch (error) {
      toast.error("Failed to weave the words. Try again.");
      setStep(3); // Go back if failed
    } finally {
      setIsGenerating(false);
    }
  };

  // Image Download Logic
  const downloadCard = async () => {
    if (cardRef.current === null) return;
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 3 });
      const link = document.createElement('a');
      link.download = `PoetVerse_Card_${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Card downloaded successfully!");
    } catch (err) {
      toast.error("Oops! Couldn't save the image.");
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-[#09090b] text-foreground pt-24 pb-12 px-4 selection:bg-amber-500/30">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <Feather className="w-10 h-10 text-amber-500 mx-auto" />
          <h1 className="text-4xl md:text-5xl font-black font-serif uppercase tracking-widest text-stone-900 dark:text-stone-100">
            Card Studio
          </h1>
          <p className="text-stone-500 font-serif italic text-lg">
            Answer a few quick questions. We'll shape the words around you.
          </p>
        </div>

        {/* Wizard Container */}
        <div className="bg-white dark:bg-stone-950/50 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 md:p-12 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: WHO IS THIS FOR? */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="flex items-center gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center">1</div>
                  <h2 className="text-2xl font-serif text-stone-800 dark:text-stone-200">Who is this for?</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {RECIPIENTS.map((rec) => (
                    <button
                      key={rec.id}
                      onClick={() => setSelection({ ...selection, recipient: rec.id })}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${selection.recipient === rec.id ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10' : 'border-stone-200 dark:border-stone-800 hover:border-amber-300 dark:hover:border-stone-600'}`}
                    >
                      <span className="text-2xl">{rec.icon}</span>
                      <span className="font-medium text-stone-700 dark:text-stone-300">{rec.label}</span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end pt-6">
                  <Button onClick={() => setStep(2)} disabled={!selection.recipient} className="h-12 px-8 bg-stone-900 text-white dark:bg-amber-600 dark:text-stone-950 font-bold tracking-wider uppercase">Next Step <ArrowRight className="w-4 h-4 ml-2" /></Button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: WHAT TO SAY? */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="flex items-center gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center">2</div>
                  <h2 className="text-2xl font-serif text-stone-800 dark:text-stone-200">What is the occasion?</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {OCCASIONS.map((occ) => (
                    <button
                      key={occ.id}
                      onClick={() => setSelection({ ...selection, occasion: occ.id })}
                      className={`p-4 rounded-xl border-2 transition-all text-left font-medium ${selection.occasion === occ.id ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400' : 'border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-amber-300'}`}
                    >
                      {occ.label}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between pt-6">
                  <Button variant="ghost" onClick={() => setStep(1)} className="h-12"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
                  <Button onClick={() => setStep(3)} disabled={!selection.occasion} className="h-12 px-8 bg-stone-900 text-white dark:bg-amber-600 dark:text-stone-950 font-bold tracking-wider uppercase">Next Step <ArrowRight className="w-4 h-4 ml-2" /></Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: CHOOSE THEME */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <div className="flex items-center gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center">3</div>
                  <h2 className="text-2xl font-serif text-stone-800 dark:text-stone-200">Select a Design Style</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {THEMES.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelection({ ...selection, theme: t.id })}
                      className={`h-24 rounded-xl border-2 transition-all flex items-center justify-center font-bold tracking-widest uppercase ${t.bg} ${t.text} ${selection.theme === t.id ? 'ring-4 ring-amber-500/50 scale-95' : 'hover:scale-[0.98]'}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between pt-6">
                  <Button variant="ghost" onClick={() => setStep(2)} className="h-12"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
                  <Button onClick={handleGenerate} className="h-12 px-8 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black tracking-widest uppercase shadow-lg">
                    <Sparkles className="w-4 h-4 mr-2" /> Generate Card
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: RESULT & DOWNLOAD */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8 text-center">
                {isGenerating ? (
                  <div className="py-24 flex flex-col items-center justify-center space-y-6">
                    <Feather className="w-12 h-12 text-amber-500 animate-bounce" />
                    <h3 className="text-2xl font-serif italic text-stone-600 dark:text-stone-400">The Maestro is writing your feelings...</h3>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* THIS IS THE ACTUAL CARD THAT GETS RENDERED AS AN IMAGE */}
                    <div className="flex justify-center p-4 bg-stone-100 dark:bg-stone-900 rounded-2xl overflow-hidden">
                      <div 
                        ref={cardRef} 
                        className={`w-full max-w-md aspect-[4/5] p-12 flex flex-col items-center justify-center text-center relative overflow-hidden rounded-xl border-4 ${THEMES.find(t => t.id === selection.theme)?.bg} ${THEMES.find(t => t.id === selection.theme)?.border} ${THEMES.find(t => t.id === selection.theme)?.text}`}
                      >
                        {/* Decorative Background Elements */}
                        <div className="absolute top-4 left-4 opacity-20"><Feather className="w-12 h-12" /></div>
                        <div className="absolute bottom-4 right-4 opacity-20 rotate-180"><Feather className="w-12 h-12" /></div>
                        
                        <p className="text-sm font-bold tracking-[0.3em] uppercase mb-8 opacity-80">For My {selection.recipient}</p>
                        
                        <p className="text-2xl md:text-3xl font-serif italic leading-relaxed whitespace-pre-wrap drop-shadow-md">
                          "{generatedText}"
                        </p>
                        
                        <div className="mt-12 opacity-60 flex flex-col items-center">
                          <Heart className="w-4 h-4 mb-2" fill="currentColor" />
                          <p className="text-[10px] uppercase tracking-widest font-bold">Crafted with PoetVerse</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-center gap-4 flex-wrap">
                      <Button variant="outline" onClick={handleGenerate} className="h-14 px-6 border-stone-300 dark:border-stone-700">
                        <RefreshCw className="w-5 h-5 mr-2" /> Rewrite
                      </Button>
                      <Button onClick={downloadCard} className="h-14 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold tracking-widest uppercase shadow-xl">
                        <Download className="w-5 h-5 mr-2" /> Save & Share Image
                      </Button>
                      <Button variant="ghost" onClick={() => { setStep(1); setGeneratedText(''); }} className="h-14 px-6">
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