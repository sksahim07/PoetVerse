import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toPng, toJpeg } from 'html-to-image';
import { 
  Heart, Moon, Star, Feather, Flower2, Cloud, Sun, Sparkles, 
  Download, Copy, Share2, Save, RotateCcw, Palette, Type, Layout, 
  ChevronRight, ChevronLeft, Wand2, PenTool, Eraser, ZoomIn, ZoomOut,
  Check, MessageSquare, Image, Settings
} from 'lucide-react';

// ====================================================================
// CONSTANTS & DATA ENGINES
// ====================================================================

const RECIPIENTS = [
  { id: 'partner', emoji: '❤️', title: 'Partner / Lover', desc: 'For the love of your life' },
  { id: 'mother', emoji: '👩‍👧', title: 'Mother', desc: 'For the one who gave you life' },
  { id: 'father', emoji: '👨‍👧', title: 'Father', desc: 'For your pillar of strength' },
  { id: 'bestfriend', emoji: '🤝', title: 'Best Friend', desc: 'For your partner in crime' },
  { id: 'brother', emoji: '👦', title: 'Brother', desc: 'For your brother from another' },
  { id: 'sister', emoji: '👧', title: 'Sister', desc: 'For your built-in best friend' },
  { id: 'husband', emoji: '💍', title: 'Husband', desc: 'For your forever person' },
  { id: 'wife', emoji: '💐', title: 'Wife', desc: 'For your beautiful wife' },
  { id: 'crush', emoji: '😘', title: 'Crush', desc: 'For the one you admire' },
  { id: 'teacher', emoji: '📚', title: 'Teacher', desc: 'For your guide and mentor' },
  { id: 'mentor', emoji: '🧭', title: 'Mentor', desc: 'For the one who showed the way' },
  { id: 'child', emoji: '👶', title: 'Child', desc: 'For your little wonder' },
  { id: 'myself', emoji: '🧍', title: 'For Myself', desc: 'A letter to myself' },
  { id: 'custom', emoji: '✍️', title: 'Custom Person', desc: 'For someone special' },
];

const LANGUAGES = ['Benglish', 'Roman Urdu', 'English', 'Bengali Script', 'Hindi Script', 'Urdu Script', 'Hinglish'];
const FORMATS = [
  { id: 'letter', title: 'Heartfelt Letter', desc: 'Long emotional prose. No forced rhyming.' },
  { id: 'note', title: 'Aesthetic Note', desc: 'Short. Elegant. Instagram-style.' },
  { id: 'shayari', title: 'Shayari / Poetry', desc: 'Rhymed. Literary. Deep.' },
  { id: 'open', title: 'Open Letter', desc: 'Public-style emotional letter.' },
  { id: 'confession', title: 'Confession Letter', desc: 'Love confession.' },
  { id: 'apology', title: 'Apology Letter', desc: 'Sorry letter.' },
  { id: 'farewell', title: 'Farewell Letter', desc: 'Goodbye message.' },
];

const THEMES = [
  { id: 'royal', name: 'Royal Luxury', bg: 'bg-gradient-to-br from-gray-900 to-amber-900', text: 'text-amber-200', border: 'border-4 border-amber-500', accent: 'text-amber-400' },
  { id: 'cute', name: 'Cute & Pookie', bg: 'bg-gradient-to-br from-pink-200 to-rose-100', text: 'text-pink-800', border: 'border-4 border-rose-300', accent: 'text-rose-500' },
  { id: 'vintage', name: 'Vintage', bg: 'bg-gradient-to-br from-[#3E2723] to-[#D7CCC8]', text: 'text-[#3E2723]', border: 'border-4 border-[#5D4037]', accent: 'text-[#8D6E63]' },
  { id: 'minimal', name: 'Minimal', bg: 'bg-white', text: 'text-gray-800', border: 'border border-gray-200', accent: 'text-black' },
  { id: 'glass', name: 'Glassmorphism', bg: 'bg-white/30 backdrop-blur-xl', text: 'text-gray-900', border: 'border border-white/50', accent: 'text-blue-600' },
  { id: 'floral', name: 'Floral', bg: 'bg-gradient-to-br from-green-50 to-white', text: 'text-green-900', border: 'border-4 border-green-200', accent: 'text-green-600' },
  { id: 'darkromantic', name: 'Dark Romantic', bg: 'bg-gradient-to-br from-gray-900 to-purple-950', text: 'text-purple-200', border: 'border-4 border-purple-800', accent: 'text-purple-400' },
];

const FONTS = [
  { id: 'playfair', family: "'Playfair Display', serif", name: 'Playfair Display' },
  { id: 'cormorant', family: "'Cormorant Garamond', serif", name: 'Cormorant' },
  { id: 'inter', family: "'Inter', sans-serif", name: 'Inter' },
  { id: 'poppins', family: "'Poppins', sans-serif", name: 'Poppins' },
  { id: 'merriweather', family: "'Merriweather', serif", name: 'Merriweather' },
  { id: 'dancing', family: "'Dancing Script', cursive", name: 'Dancing Script' },
  { id: 'greatvibes', family: "'Great Vibes', cursive", name: 'Great Vibes' },
  { id: 'cinzel', family: "'Cinzel', serif", name: 'Cinzel' },
];

const COLORS = [
  { id: 'gold', hex: '#D4AF37' }, { id: 'rosegold', hex: '#B76E79' }, { id: 'silver', hex: '#C0C0C0' },
  { id: 'emerald', hex: '#50C878' }, { id: 'ruby', hex: '#E0115F' }, { id: 'sapphire', hex: '#0F52BA' },
  { id: 'purple', hex: '#800080' }, { id: 'pink', hex: '#FFC0CB' }, { id: 'black', hex: '#000000' },
  { id: 'white', hex: '#FFFFFF' },
];

const ORIENTATIONS = [
  { id: 'portrait', ratio: 'aspect-[4/5]', name: 'Portrait (4:5)', w: 800, h: 1000 },
  { id: 'landscape', ratio: 'aspect-[4/3]', name: 'Landscape (4:3)', w: 1000, h: 750 },
  { id: 'square', ratio: 'aspect-square', name: 'Square (1:1)', w: 900, h: 900 },
  { id: 'story', ratio: 'aspect-[9/16]', name: 'Story (9:16)', w: 1080, h: 1920 },
];

const DECORATIONS = {
  stickers: [
    { id: 'heart', emoji: '❤️' }, { id: 'rose', emoji: '🌹' }, { id: 'moon', emoji: '🌙' },
    { id: 'star', emoji: '⭐' }, { id: 'butterfly', emoji: '🦋' }, { id: 'feather', emoji: '🪶' },
  ],
  corners: ['Luxury', 'Vintage', 'Minimal'],
  textures: ['Paper', 'Luxury Paper', 'Old Paper', 'Noise Grain'],
};

const PRESETS = ['Birthday', 'Anniversary', 'Valentine', "Mother's Day", "Father's Day", 'Friendship Day', 'Wedding', 'Eid', 'Durga Puja', 'Christmas', 'New Year', 'Graduation', 'Farewell'];
const REWRITE_OPTIONS = ['Romantic', 'Emotional', 'Formal', 'Poetic', 'Simpler', 'Shorter', 'Longer', 'Deeper', 'Heartbreaking', 'Inspirational'];

const LOADING_MESSAGES = ["Decoding Emotions...", "Writing Your Letter...", "Designing Masterpiece...", "Preparing Final Card..."];

// ====================================================================
// MOCK AI ENGINE
// ====================================================================

const detectLanguage = (text: string): string => {
  if(/[\u0980-\u09FF]/.test(text)) return 'Bengali Script';
  if(/[\u0600-\u06FF]/.test(text)) return 'Urdu Script';
  if(/[\u0900-\u097F]/.test(text)) return 'Hindi Script';
  if(text.match(/\b(ami|tumi|valo|bhalo|kori)\b/i)) return 'Benglish';
  if(text.match(/\b(main|tum|hai|mujhe|tujhe)\b/i)) return 'Hinglish';
  if(text.match(/\b(hoon|tumhara|mera|mein)\b/i)) return 'Roman Urdu';
  return 'English';
};

const generateMockContent = (emotion: string, recipient: string, format: string, intensity: number) => {
  // Highly simplified mock generation for demonstration
  const titleMap: Record<string, string> = {
    'mother': 'My Dearest Mother',
    'partner': 'To The One Who Changed My Life',
    'crush': 'A Letter I Never Sent',
    'bestfriend': 'Ekta Kotha Ja Bola Hoyni',
  };
  const title = titleMap[recipient] || 'A Message From The Heart';
  
  let body = `There are things I carry in my heart that I rarely say out loud. But today, I want to express them.\n\n${emotion}\n\n`;
  if(intensity > 7) body += "These feelings consume my very soul. ";
  body += "You mean the world to me, and I am grateful every day for your presence.";

  if(format === 'shayari') body = `Dil se jo baat nikalti hai, asar rakhti hai\n${emotion}\nPar naseeb mein yeh baat likhi, woh yaar rakhti hai.`;
  if(format === 'note') body = `Just wanted to say: ${emotion}. You are my everything.`;

  const signatures = ['With Love', 'Forever Yours', 'Tumhara', 'Always Grateful', 'Sincerely'];
  const signature = signatures[Math.floor(Math.random() * signatures.length)];

  return { title, body, signature };
};

// ====================================================================
// MAIN COMPONENT
// ====================================================================

export default function CardStudioPage() {
  // --- STATE MANAGEMENT ---
  const [darkMode, setDarkMode] = useState(false);
  const [step, setStep] = useState(1);
  const [recipient, setRecipient] = useState('');
  const [emotion, setEmotion] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [language, setLanguage] = useState('English');
  const [format, setFormat] = useState('letter');
  const [preset, setPreset] = useState('');
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(0);
  
  const [cardTitle, setCardTitle] = useState('');
  const [cardBody, setCardBody] = useState('');
  const [cardSignature, setCardSignature] = useState('');
  
  const [theme, setTheme] = useState('royal');
  const [font, setFont] = useState("'Playfair Display', serif");
  const [color, setColor] = useState('#D4AF37');
  const [orientation, setOrientation] = useState('portrait');
  const [decorations, setDecorations] = useState<string[]>([]);
  
  const [myCards, setMyCards] = useState<any[]>([]);
  const [showSaved, setShowSaved] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  // --- MEMOIZED VALUES ---
  const currentTheme = useMemo(() => THEMES.find(t => t.id === theme)!, [theme]);
  const currentOrientation = useMemo(() => ORIENTATIONS.find(o => o.id === orientation)!, [orientation]);
  const isDark = darkMode || ['royal', 'darkromantic'].includes(theme);

  // --- AI GENERATION LOGIC ---
  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    setLoadingMsg(0);
    
    const interval = setInterval(() => {
      setLoadingMsg(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 800);

    // Simulate AI Delay
    setTimeout(() => {
      clearInterval(interval);
      const result = generateMockContent(emotion, recipient, format, intensity);
      setCardTitle(result.title);
      setCardBody(result.body);
      setCardSignature(result.signature);
      setIsGenerating(false);
      setStep(3); // Jump to editor
    }, 3000);
  }, [emotion, recipient, format, intensity]);

  // --- REWRITE LOGIC ---
  const handleRewrite = useCallback((type: string) => {
    setIsGenerating(true);
    setLoadingMsg(0);
    const interval = setInterval(() => setLoadingMsg(prev => (prev + 1) % LOADING_MESSAGES.length), 500);
    
    setTimeout(() => {
      clearInterval(interval);
      setCardBody(prev => `[Rewritten: ${type}]\n\n${prev}\n\n*This version is now more ${type.toLowerCase()}.*`);
      setIsGenerating(false);
    }, 1500);
  }, []);

  // --- EXPORT LOGIC ---
  const handleExport = useCallback(async (format: 'png' | 'jpeg', quality: number) => {
    if (!cardRef.current) return;
    const exportFunc = format === 'jpeg' ? toJpeg : toPng;
    
    try {
      const dataUrl = await exportFunc(cardRef.current, {
        quality: 1,
        pixelRatio: quality, // 3x, 4x, 5x
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = `poetverse-card-${quality}x.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed', err);
    }
  }, []);

  // --- SAVE DRAFT ---
  const handleSaveDraft = useCallback(() => {
    const draft = {
      id: Date.now(), recipient, emotion, language, theme, format, 
      title: cardTitle, body: cardBody, signature: cardSignature, font, color, orientation
    };
    setMyCards(prev => [draft, ...prev]);
    alert('Draft Saved!');
  }, [recipient, emotion, language, theme, format, cardTitle, cardBody, cardSignature, font, color, orientation]);

  const loadDraft = useCallback((draft: any) => {
    setRecipient(draft.recipient); setEmotion(draft.emotion); setLanguage(draft.language);
    setTheme(draft.theme); setFormat(draft.format); setCardTitle(draft.title);
    setCardBody(draft.body); setCardSignature(draft.signature); setFont(draft.font);
    setColor(draft.color); setOrientation(draft.orientation);
    setShowSaved(false);
    setStep(3);
  }, []);

  // --- LANGUAGE DETECTION ---
  useEffect(() => {
    if (emotion.length > 5) {
      setLanguage(detectLanguage(emotion));
    }
  }, [emotion]);

  // ====================================================================
  // UI RENDERING
  // ====================================================================
  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-gray-950 text-white' : 'bg-gray-50 text-gray-900'} font-sans`}>
      
      {/* --- HEADER --- */}
      <header className={`flex justify-between items-center p-4 border-b ${darkMode ? 'border-gray-800 bg-gray-900/80' : 'border-gray-200 bg-white/80'} backdrop-blur-lg sticky top-0 z-50`}>
        <div className="flex items-center gap-2">
          <Sparkles className="text-amber-500" />
          <h1 className="text-xl font-bold tracking-tight">PoetVerse Studio</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowSaved(true)} className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1 ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}>
            <Save size={14}/> My Cards
          </button>
          <button onClick={() => setDarkMode(!darkMode)} className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main className="flex flex-col lg:flex-row min-h-[calc(100vh-60px)]">
        
        {/* --- LEFT PANEL: WIZARD & CONTROLS --- */}
        <div className="lg:w-1/2 xl:w-2/5 p-6 lg:overflow-y-auto lg:h-[calc(100vh-60px)]">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Recipient & Format */}
            {step === 1 && (
              <motion.div key="step1" initial={{opacity: 0, x: -50}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: 50}} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-1">Who is this for?</h2>
                  <p className="text-sm opacity-60">Select the recipient to set the tone</p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {RECIPIENTS.map(r => (
                    <motion.button key={r.id} whileHover={{scale: 1.05}} whileTap={{scale: 0.95}}
                      onClick={() => setRecipient(r.id)}
                      className={`p-3 rounded-xl text-left transition-all border-2 ${recipient === r.id ? 'border-amber-500 bg-amber-500/10' : (darkMode ? 'border-gray-700 bg-gray-800 hover:border-gray-600' : 'border-gray-200 bg-white hover:border-gray-300')}`}>
                      <div className="text-2xl mb-1">{r.emoji}</div>
                      <div className="font-semibold text-sm">{r.title}</div>
                      <div className="text-xs opacity-50 mt-0.5 line-clamp-1">{r.desc}</div>
                    </motion.button>
                  ))}
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Preset Occasions</h3>
                  <div className="flex flex-wrap gap-2">
                    {PRESETS.map(p => (
                      <button key={p} onClick={() => setPreset(p)} className={`px-3 py-1 rounded-full text-xs font-medium ${preset === p ? 'bg-amber-500 text-white' : (darkMode ? 'bg-gray-800' : 'bg-gray-100')}`}>{p}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Format</h3>
                  <div className="space-y-2">
                    {FORMATS.map(f => (
                      <button key={f.id} onClick={() => setFormat(f.id)} className={`w-full text-left p-3 rounded-lg border transition-all ${format === f.id ? 'border-amber-500 bg-amber-500/10' : (darkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-gray-50')}`}>
                        <div className="font-medium text-sm">{f.title}</div>
                        <div className="text-xs opacity-50">{f.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <button disabled={!recipient} onClick={() => setStep(2)} className="w-full bg-gradient-to-r from-amber-500 to-orange-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
                  Continue <ChevronRight size={18} />
                </button>
              </motion.div>
            )}

            {/* STEP 2: Emotion Input */}
            {step === 2 && (
              <motion.div key="step2" initial={{opacity: 0, x: -50}} animate={{opacity: 1, x: 0}} exit={{opacity: 0, x: 50}} className="space-y-6">
                <button onClick={() => setStep(1)} className="flex items-center gap-1 text-sm opacity-60 hover:opacity-100"><ChevronLeft size={16}/> Back</button>
                <div>
                  <h2 className="text-2xl font-bold mb-1">Pour your heart out</h2>
                  <p className="text-sm opacity-60">Write anything. No grammar required.</p>
                </div>

                <div className="relative">
                  <textarea 
                    value={emotion} onChange={e => setEmotion(e.target.value)}
                    placeholder="maa ami tomake onek bhalobashi... or I miss her everyday..."
                    className={`w-full h-64 p-4 rounded-xl border resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}
                    maxLength={5000}
                  />
                  <div className="absolute bottom-3 right-3 text-xs opacity-40">{emotion.length} / 5000</div>
                </div>

                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Detected Language</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 font-semibold">{language}</span>
                  </div>
                  <select value={language} onChange={e => setLanguage(e.target.value)} className={`w-full text-sm p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
                    {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                <div>
                  <label className="flex justify-between text-sm font-medium mb-2">
                    <span>Emotional Intensity</span>
                    <span className="text-amber-500">{intensity <= 3 ? 'Soft' : intensity <= 6 ? 'Medium' : intensity <= 8 ? 'Deep' : 'Heartbreaking'}</span>
                  </label>
                  <input type="range" min="1" max="10" value={intensity} onChange={e => setIntensity(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"/>
                </div>

                <button disabled={emotion.length < 5} onClick={handleGenerate} className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
                  <Wand2 size={18}/> Generate Translation
                </button>
              </motion.div>
            )}

            {/* STEP 3: Customization & Editor */}
            {step === 3 && !isGenerating && (
              <motion.div key="step3" initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="space-y-6">
                <div className="flex justify-between items-center">
                  <button onClick={() => setStep(2)} className="flex items-center gap-1 text-sm opacity-60 hover:opacity-100"><ChevronLeft size={16}/> Back</button>
                  <button onClick={handleSaveDraft} className="flex items-center gap-1 text-sm bg-green-500/10 text-green-500 px-3 py-1 rounded-lg"><Save size={14}/> Save Draft</button>
                </div>

                <div className="space-y-3">
                  <input type="text" value={cardTitle} onChange={e => setCardTitle(e.target.value)} className={`w-full p-2 text-xl font-bold bg-transparent border-b focus:outline-none ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}/>
                  <textarea value={cardBody} onChange={e => setCardBody(e.target.value)} className={`w-full h-40 p-2 bg-transparent border rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}/>
                  <input type="text" value={cardSignature} onChange={e => setCardSignature(e.target.value)} className={`w-full p-2 bg-transparent border-b focus:outline-none italic ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}/>
                </div>

                {/* AI Rewrite Studio */}
                <div>
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-1"><Sparkles size={14}/> AI Rewrite Studio</h3>
                  <div className="flex flex-wrap gap-2">
                    {REWRITE_OPTIONS.map(opt => (
                      <button key={opt} onClick={() => handleRewrite(opt)} className={`px-2 py-1 text-xs rounded-full border transition-all ${darkMode ? 'border-gray-600 hover:bg-gray-700' : 'border-gray-200 hover:bg-gray-100'}`}>
                        Make {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme Engine */}
                <div>
                  <h3 className="text-sm font-semibold mb-2 flex items-center gap-1"><Palette size={14}/> Theme Engine</h3>
                  <div className="grid grid-cols-4 gap-2">
                    {THEMES.map(t => (
                      <button key={t.id} onClick={() => setTheme(t.id)} className={`h-12 rounded-lg ${t.bg} border-2 ${theme === t.id ? 'border-amber-500 scale-105' : 'border-transparent'} transition-all`} title={t.name}></button>
                    ))}
                  </div>
                </div>

                {/* Font & Orientation */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-semibold mb-2 flex items-center gap-1"><Type size={14}/> Font</h3>
                    <select value={font} onChange={e => setFont(e.target.value)} className={`w-full text-sm p-2 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                      {FONTS.map(f => <option key={f.id} value={f.family}>{f.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold mb-2 flex items-center gap-1"><Layout size={14}/> Orientation</h3>
                    <select value={orientation} onChange={e => setOrientation(e.target.value)} className={`w-full text-sm p-2 rounded-lg border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                      {ORIENTATIONS.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
                    </select>
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <h3 className="text-sm font-semibold mb-2">Accent Color</h3>
                  <div className="flex gap-2">
                    {COLORS.map(c => (
                      <button key={c.id} onClick={() => setColor(c.hex)} className={`w-8 h-8 rounded-full border-2 transition-all ${color === c.hex ? 'border-amber-500 scale-110' : 'border-transparent'}`} style={{backgroundColor: c.hex}}></button>
                    ))}
                  </div>
                </div>

                {/* Decorations */}
                <div>
                  <h3 className="text-sm font-semibold mb-2">Decorations</h3>
                  <div className="flex gap-2">
                    {DECORATIONS.stickers.map(s => (
                      <button key={s.id} onClick={() => setDecorations(prev => prev.includes(s.id) ? prev.filter(p => p !== s.id) : [...prev, s.id])} className={`text-2xl p-1 rounded-lg transition-all ${decorations.includes(s.id) ? 'bg-amber-500/20 scale-110' : 'opacity-50 hover:opacity-100'}`}>
                        {s.emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Export Studio */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-1"><Download size={14}/> Export Studio</h3>
                  <div className="grid grid-cols-3 gap-2">
                    <button onClick={() => handleExport('png', 3)} className="p-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700">PNG 3x</button>
                    <button onClick={() => handleExport('png', 5)} className="p-2 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700">PNG 5x HD</button>
                    <button onClick={() => handleExport('jpeg', 3)} className="p-2 text-xs bg-blue-800 text-white rounded-lg hover:bg-blue-900">JPEG 3x</button>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 p-2 text-xs border rounded-lg flex items-center justify-center gap-1"><Share2 size={12}/> WhatsApp</button>
                    <button className="flex-1 p-2 text-xs border rounded-lg flex items-center justify-center gap-1"><Copy size={12}/> Copy Img</button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* LOADING STATE */}
            {isGenerating && (
              <motion.div key="loading" initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="flex flex-col items-center justify-center h-full space-y-6">
                <div className="relative w-24 h-24">
                  <motion.div animate={{rotate: 360}} transition={{duration: 2, repeat: Infinity, ease: "linear"}} className="absolute inset-0 border-4 border-t-amber-500 rounded-full"></motion.div>
                  <div className="absolute inset-0 flex items-center justify-center text-4xl">
                    <motion.div animate={{scale: [1, 1.2, 1]}} transition={{duration: 1, repeat: Infinity}}>❤️</motion.div>
                  </div>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div key={loadingMsg} initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}} exit={{opacity: 0, y: -10}} className="text-lg font-semibold text-amber-500">
                    {LOADING_MESSAGES[loadingMsg]}
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* --- RIGHT PANEL: LIVE PREVIEW --- */}
        <div className="lg:w-1/2 xl:w-3/5 p-6 flex items-center justify-center lg:fixed lg:right-0 lg:top-[60px] lg:h-[calc(100vh-60px)] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-950">
          
          <motion.div 
            className={`shadow-2xl rounded-lg overflow-hidden ${currentOrientation.ratio} w-full max-w-md transition-all duration-500`}
            layout
          >
            <div ref={cardRef} className={`relative w-full h-full flex flex-col p-8 md:p-12 ${currentTheme.bg} ${currentTheme.border} transition-colors duration-500`} style={{fontFamily: font}}>
              
              {/* Background Texture/Noise overlay */}
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')"}}></div>

              {/* Decorations Layer */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {decorations.includes('heart') && <div className="absolute top-4 left-4 text-4xl opacity-30 animate-pulse">❤️</div>}
                {decorations.includes('heart') && <div className="absolute bottom-4 right-4 text-4xl opacity-30 animate-pulse">❤️</div>}
                {decorations.includes('moon') && <div className="absolute top-6 right-6 text-3xl opacity-40">🌙</div>}
                {decorations.includes('star') && <div className="absolute top-2 left-1/4 text-2xl opacity-30">⭐</div>}
                {decorations.includes('rose') && <div className="absolute bottom-6 left-6 text-3xl opacity-40">🌹</div>}
                {decorations.includes('butterfly') && <div className="absolute top-1/3 right-4 text-2xl opacity-30">🦋</div>}
                {decorations.includes('feather') && <div className="absolute bottom-1/4 left-4 text-2xl opacity-30">🪶</div>}
              </div>

              {/* Content Layer */}
              <div className="relative z-10 flex flex-col h-full justify-center">
                <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${currentTheme.accent} transition-colors duration-500`} style={{borderColor: color, borderBottom: `2px solid ${color}`, paddingBottom: '8px', display: 'inline-block'}}>
                  {cardTitle || "Your Title Here"}
                </h2>
                
                <p className={`text-base md:text-lg leading-relaxed flex-grow whitespace-pre-wrap ${currentTheme.text} transition-colors duration-500`} style={{color: isDark && currentTheme.id !== 'cute' ? currentTheme.text : undefined}}>
                  {cardBody || "Your beautifully translated emotions will appear here as you type or generate..."}
                </p>
                
                <div className="mt-6 text-right">
                  <p className="text-lg italic" style={{color: color}}>
                    — {cardSignature || "With Love"}
                  </p>
                </div>
              </div>

              {/* Corner Decorations */}
              <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 pointer-events-none" style={{borderColor: color}}></div>
              <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 pointer-events-none" style={{borderColor: color}}></div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* --- SAVED CARDS MODAL --- */}
      <AnimatePresence>
        {showSaved && (
          <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowSaved(false)}>
            <motion.div initial={{scale: 0.9, y: 20}} animate={{scale: 1, y: 0}} exit={{scale: 0.9, y: 20}} className={`w-full max-w-lg p-6 rounded-2xl ${darkMode ? 'bg-gray-900' : 'bg-white'}`} onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold mb-4">My Saved Cards</h2>
              {myCards.length === 0 ? (
                <p className="text-center opacity-50 py-8">No saved cards yet.</p>
              ) : (
                <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                  {myCards.map(card => (
                    <div key={card.id} className={`p-3 rounded-lg border cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`} onClick={() => loadDraft(card)}>
                      <div className="font-semibold">{card.title}</div>
                      <div className="text-xs opacity-60 truncate">{card.body}</div>
                      <div className="text-xs text-amber-500 mt-1">{card.recipient} • {card.language}</div>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={() => setShowSaved(false)} className="mt-4 w-full py-2 rounded-lg bg-gray-100 dark:bg-gray-800 font-medium">Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}