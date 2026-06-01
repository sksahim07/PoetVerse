import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';
import { Download, Sparkles, ArrowRight, ArrowLeft, RefreshCw, Feather, Heart, PenLine, Maximize, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { generatePoem } from '@/services/llm'; 

// --- ARCHITECTURE DATA ---
const RECIPIENTS = [
  { id: 'partner', label: 'Partner / Lover', icon: '❤️' },
  { id: 'mother', label: 'Mother', icon: '👑' },
  { id: 'father', label: 'Father', icon: '🛡️' },
  { id: 'friend', label: 'Best Friend', icon: '🤝' },
  { id: 'sibling', label: 'Brother / Sister', icon: '🎭' },
  { id: 'myself', label: 'For Myself', icon: '✨' },
];

const FORMATS = [
  { id: 'letter', label: 'Heartfelt Letter', desc: 'Deep, structured prose' },
  { id: 'note', label: 'Short Aesthetic Note', desc: 'Crisp, impactful thoughts' },
  { id: 'poetry', label: 'Poetic / Shayari', desc: 'Rhyming or deep verses' },
];

const VIBES = [
  { 
    id: 'royal', label: 'Royal & Elegant', 
    cardClass: 'bg-stone-950 text-amber-400 border-amber-500/40 rounded-xl',
    innerBorder: 'border-amber-500/30 border',
    font: 'font-serif', icon: 'Feather', iconColor: 'text-amber-600/30'
  },
  { 
    id: 'cute', label: 'Cute & Pookie', 
    cardClass: 'bg-pink-50 text-rose-600 border-pink-200 shadow-pink-200/50 rounded-[3rem]',
    innerBorder: 'border-pink-300 border-dashed border-2 rounded-[2.5rem]',
    font: 'font-sans font-medium tracking-tight', icon: 'Heart', iconColor: 'text-pink-300'
  },
  { 
    id: 'vintage', label: 'Vintage Classic', 
    cardClass: 'bg-[#F4F1EA] text-[#4A3C31] border-[#8B7355]/40 rounded-sm shadow-xl',
    innerBorder: 'border-[#8B7355]/40 border-double border-4',
    font: 'font-serif italic', icon: 'Feather', iconColor: 'text-[#8B7355]/20'
  },
  { 
    id: 'minimal', label: 'Minimal Aesthetic', 
    cardClass: 'bg-white text-stone-800 border-stone-100 shadow-2xl rounded-3xl',
    innerBorder: 'border-transparent',
    font: 'font-sans font-light tracking-wide', icon: 'Sparkles', iconColor: 'text-stone-200'
  },
];

const CardStudioPage = () => {
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState({ 
    recipient: '', 
    rawEmotion: '', 
    language: 'Benglish',
    format: 'letter',
    vibe: 'royal',
    orientation: 'vertical' // vertical | horizontal
  });
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);

  // Advanced Prompt Engineering
  const handleGenerate = async () => {
    if (!selection.recipient || !selection.rawEmotion.trim()) {
      toast.error("Please pour your heart out first!");
      return;
    }
    
    setIsGenerating(true);
    setStep(4); 
    
    try {
      // The Master Prompt that stops the mixing of languages and forces the correct format
      const masterPrompt = `
        You are an elite ghostwriter and emotional translator. 
        Analyze this raw thought/emotion from the user: "${selection.rawEmotion}".
        
        TASK: Translate and expand these thoughts into a beautifully structured, highly emotional ${selection.format} for their ${selection.recipient}.
        
        STRICT RULES:
        1. Output Language: Write EXACTLY in ${selection.language} (e.g., if Benglish, use English alphabet but Bengali words perfectly. If Roman Urdu, use English alphabet but Urdu words). DO NOT awkwardly mix languages like Bengali and Urdu together.
        2. Format constraint: If the format is 'letter' or 'note', write PROSE, do not force rhyming poetry. Make it sound like a deeply personal, hand-written message.
        3. Vibe: The tone should match a ${selection.vibe} aesthetic.
        
        Output ONLY the final crafted message text. No intros, no quotes.
      `;

      const result = await generatePoem({
        poetry_type: 'poem', // Overridden by our strict user_message prompt
        language: selection.language as any,
        emotion: 'deep',
        target_person: selection.recipient,
        tone_filter: 'soft_romantic',
        emotion_level: 'very_deep',
        user_message: masterPrompt
      });
      
      setGeneratedText(result);
    } catch (error) {
      toast.error("Failed to translate your emotions. Try again.");
      setStep(3); 
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadCard = async () => {
    if (cardRef.current === null) return;
    const toastId = toast.loading("Rendering high-res masterpiece...");
    try {
      const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 3, quality: 1.0 });
      const link = document.createElement('a');
      link.download = `PoetVerse_${selection.recipient}_Card.png`;
      link.href = dataUrl;
      link.click();
      toast.success("Masterpiece saved!", { id: toastId });
    } catch (err) {
      toast.error("Failed to render image.", { id: toastId });
    }
  };

  const activeVibe = VIBES.find(v => v.id === selection.vibe);

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090b] text-foreground pt-24 pb-20 px-4 transition-colors duration-500">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <Feather className="w-10 h-10 text-amber-500 mx-auto" />
          <h1 className="text-4xl md:text-5xl font-black font-serif uppercase tracking-widest text-stone-900 dark:text-stone-100">
            The Letter Studio
          </h1>
          <p className="text-stone-500 font-medium text-sm md:text-base max-w-2xl mx-auto uppercase tracking-widest">
            Pour your chaotic thoughts. We'll craft the perfect message.
          </p>
        </div>

        {/* Wizard Container */}
        <div className="bg-white dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 rounded-[2rem] p-6 md:p-12 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: RECIPIENT */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <h2 className="text-2xl font-serif text-stone-800 dark:text-stone-200 border-b border-stone-100 dark:border-stone-800 pb-4">1. Who is this for?</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {RECIPIENTS.map((rec) => (
                    <button
                      key={rec.id}
                      onClick={() => setSelection({ ...selection, recipient: rec.id })}
                      className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${selection.recipient === rec.id ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10 shadow-sm scale-95' : 'border-stone-200 dark:border-stone-800 hover:border-amber-300'}`}
                    >
                      <span className="text-3xl">{rec.icon}</span>
                      <span className="font-bold uppercase tracking-wider text-xs">{rec.label}</span>
                    </button>
                  ))}
                </div>
                <div className="flex justify-end pt-4">
                  <Button onClick={() => setStep(2)} disabled={!selection.recipient} className="h-14 px-10 bg-stone-900 text-white dark:bg-amber-600 dark:text-stone-950 font-black tracking-widest uppercase rounded-xl">Next <ArrowRight className="w-5 h-5 ml-3" /></Button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: RAW EMOTION & LANGUAGE */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <h2 className="text-2xl font-serif text-stone-800 dark:text-stone-200 border-b border-stone-100 dark:border-stone-800 pb-4">2. Pour Your Heart Out</h2>
                
                <div className="space-y-4">
                  <label className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-amber-600">
                    <PenLine className="w-4 h-4" /> Just type what you feel (Any language)
                  </label>
                  <textarea
                    value={selection.rawEmotion}
                    onChange={(e) => setSelection({ ...selection, rawEmotion: e.target.value })}
                    placeholder="E.g., Maa, ami tomake onek bhalobashi kintu kokhono bolte pari na. Tumi amar jiboner shobtheke boro ashirbad..."
                    className="w-full h-40 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl p-5 text-stone-700 dark:text-stone-300 focus:ring-2 focus:ring-amber-500/50 resize-none font-medium placeholder:italic"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-stone-500">Output Language Style</label>
                  <div className="flex flex-wrap gap-3">
                    {['Benglish', 'Roman-Urdu', 'English', 'Bengali Script', 'Hindi Script', 'Hinglish'].map(lang => (
                      <button 
                        key={lang} onClick={() => setSelection({...selection, language: lang})}
                        className={`px-4 py-2 rounded-full border text-xs font-bold uppercase tracking-wider ${selection.language === lang ? 'bg-stone-900 text-white border-stone-900 dark:bg-white dark:text-stone-900' : 'border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400'}`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-stone-100 dark:border-stone-800">
                  <Button variant="ghost" onClick={() => setStep(1)} className="h-14 font-bold uppercase tracking-widest"><ArrowLeft className="w-5 h-5 mr-3" /> Back</Button>
                  <Button onClick={() => setStep(3)} disabled={!selection.rawEmotion.trim()} className="h-14 px-10 bg-stone-900 text-white dark:bg-amber-600 dark:text-stone-950 font-black tracking-widest uppercase rounded-xl">Next <ArrowRight className="w-5 h-5 ml-3" /></Button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: FORMAT, ORIENTATION & VIBE */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                <h2 className="text-2xl font-serif text-stone-800 dark:text-stone-200 border-b border-stone-100 dark:border-stone-800 pb-4">3. Shape & Aesthetics</h2>

                {/* Format & Orientation Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-stone-500">Message Format</label>
                    <div className="space-y-3">
                      {FORMATS.map(f => (
                        <button key={f.id} onClick={() => setSelection({...selection, format: f.id})} className={`w-full text-left p-4 rounded-xl border-2 transition-all ${selection.format === f.id ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10' : 'border-stone-200 dark:border-stone-800'}`}>
                          <div className="font-bold text-sm uppercase tracking-wider">{f.label}</div>
                          <div className="text-xs text-stone-500">{f.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-black uppercase tracking-[0.2em] text-stone-500">Card Orientation</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button onClick={() => setSelection({...selection, orientation: 'vertical'})} className={`h-32 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${selection.orientation === 'vertical' ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10' : 'border-stone-200 dark:border-stone-800'}`}>
                        <Smartphone className="w-8 h-8" />
                        <span className="font-bold text-xs uppercase tracking-widest">Portrait</span>
                      </button>
                      <button onClick={() => setSelection({...selection, orientation: 'horizontal'})} className={`h-32 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${selection.orientation === 'horizontal' ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10' : 'border-stone-200 dark:border-stone-800'}`}>
                        <Maximize className="w-8 h-8 rotate-90" />
                        <span className="font-bold text-xs uppercase tracking-widest">Landscape</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Vibe Grid */}
                <div className="space-y-4">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-stone-500">Visual Vibe</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {VIBES.map(v => (
                      <button key={v.id} onClick={() => setSelection({...selection, vibe: v.id})} className={`p-4 rounded-xl border-2 flex flex-col items-center text-center transition-all ${selection.vibe === v.id ? 'border-amber-500 bg-amber-50 dark:bg-amber-500/10 scale-95 ring-2 ring-amber-500/20' : 'border-stone-200 dark:border-stone-800 hover:scale-95'}`}>
                        <span className="font-bold text-xs uppercase tracking-wider">{v.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-6 border-t border-stone-100 dark:border-stone-800">
                  <Button variant="ghost" onClick={() => setStep(2)} className="h-14 font-bold uppercase tracking-widest"><ArrowLeft className="w-5 h-5 mr-3" /> Back</Button>
                  <Button onClick={handleGenerate} className="h-14 px-10 bg-amber-500 hover:bg-amber-600 text-stone-950 font-black tracking-widest uppercase rounded-xl shadow-xl hover:-translate-y-1">
                    <Sparkles className="w-5 h-5 mr-3" /> Craft Masterpiece
                  </Button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: MASSIVE CARD & DOWNLOAD */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-10 text-center w-full">
                {isGenerating ? (
                  <div className="py-32 flex flex-col items-center justify-center space-y-6">
                    <Feather className="w-16 h-16 text-amber-500 animate-bounce" />
                    <h3 className="text-2xl md:text-3xl font-serif italic text-stone-800 dark:text-stone-200">Decoding your feelings...</h3>
                    <p className="text-stone-500 uppercase tracking-widest text-xs font-bold">Crafting a {selection.vibe} {selection.format}</p>
                  </div>
                ) : (
                  <div className="space-y-10 flex flex-col items-center w-full">
                    
                    {/* --- THE RESPONSIVE HIGH-RES CARD UI --- */}
                    <div className={`p-4 sm:p-8 bg-stone-100/50 dark:bg-[#050505] rounded-[2rem] overflow-hidden border border-stone-200 dark:border-stone-800/50 shadow-inner w-full flex justify-center`}>
                      
                      {/* THIS DIV IS CONVERTED TO IMAGE. Aspect ratio changes based on orientation */}
                      <div 
                        ref={cardRef} 
                        className={`relative w-full overflow-hidden shadow-2xl flex flex-col items-center justify-center text-center p-10 sm:p-16 
                          ${selection.orientation === 'horizontal' ? 'aspect-[4/3] max-w-4xl' : 'aspect-[3/4] sm:aspect-[4/5] max-w-xl'} 
                          ${activeVibe?.cardClass} border-4`}
                      >
                        {/* Dynamic Inner Border based on Vibe */}
                        <div className={`absolute inset-4 sm:inset-6 ${activeVibe?.innerBorder} pointer-events-none`} />
                        
                        {/* Corner Accents */}
                        <div className={`absolute top-10 left-10 w-8 h-8 ${activeVibe?.iconColor}`}>
                          {activeVibe?.icon === 'Feather' && <Feather />}
                          {activeVibe?.icon === 'Heart' && <Heart fill="currentColor" />}
                          {activeVibe?.icon === 'Sparkles' && <Sparkles />}
                        </div>
                        
                        {/* Recipient Header */}
                        <p className="text-xs sm:text-sm font-black tracking-[0.4em] uppercase mb-8 md:mb-12 opacity-70 z-10 border-b border-current pb-2">
                          To My {selection.recipient}
                        </p>
                        
                        {/* Core Poetry/Message */}
                        <div className={`w-full px-4 z-10 ${activeVibe?.font}`}>
                          <p className={`whitespace-pre-wrap drop-shadow-md leading-relaxed ${selection.format === 'note' ? 'text-4xl md:text-6xl' : selection.orientation === 'horizontal' ? 'text-2xl md:text-4xl' : 'text-xl md:text-3xl'}`}>
                            {generatedText}
                          </p>
                        </div>
                        
                        {/* Footer Branding */}
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-50 flex flex-col items-center z-10">
                          <p className="text-[8px] sm:text-[10px] uppercase tracking-[0.4em] font-black">Crafted with PoetVerse</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-center gap-4 flex-wrap max-w-3xl mx-auto w-full">
                      <Button variant="outline" onClick={handleGenerate} className="h-16 px-8 border-2 border-stone-300 dark:border-stone-700 font-black uppercase tracking-widest rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 flex-1 min-w-[200px]">
                        <RefreshCw className="w-5 h-5 mr-3" /> Rewrite
                      </Button>
                      <Button onClick={downloadCard} className="h-16 px-10 bg-emerald-600 hover:bg-emerald-500 text-white font-black tracking-[0.2em] uppercase shadow-2xl rounded-xl flex-1 min-w-[250px]">
                        <Download className="w-5 h-5 mr-3" /> Save Image
                      </Button>
                      <Button variant="ghost" onClick={() => { setStep(1); setGeneratedText(''); setSelection({...selection, rawEmotion: ''}); }} className="h-16 px-8 font-bold uppercase tracking-widest text-stone-500 flex-1 min-w-[150px]">
                        Restart
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