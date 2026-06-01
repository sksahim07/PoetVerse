import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Feather, PenTool, Search, Heart, Sparkles, Quote as QuoteIconLucide } from 'lucide-react';
import { getPoemsWithFavoriteStatus } from '@/db/api';
import type { PoemWithFavorite } from '@/types/types';
import { PoemCard } from '@/components/poetry/PoemCard';
import { supabase } from '@/db/supabase'; 
import { useAuth } from '@/contexts/AuthContext'; 
import { useHomeStore } from '@/store/useHomeStore'; 

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); 
  
  // Dynamic Data from Supabase
  const { dailyVerse, activeEvent, fetchHomeData } = useHomeStore();
  const [dailyPoem, setDailyPoem] = useState<PoemWithFavorite | null>(null);
  const [currentSherIndex, setCurrentSherIndex] = useState(0);

  useEffect(() => {
    fetchHomeData(); 
    const loadDailyPoem = async () => {
      try {
        const poems = await getPoemsWithFavoriteStatus({ is_daily: true, limit: 1 });
        setDailyPoem(poems[0] || null);
      } catch (error) {
        console.error('Failed to load daily poem:', error);
      }
    };
    loadDailyPoem();
  }, [fetchHomeData]);

  const shers = [
    { line1: 'Kuch alfaaz sirf raat mein likhe jaate hain', line2: 'Jab khamoshi bhi ek zuban ban jaati hai' },
    { line1: 'Gehraai ko waqt chahiye', line2: 'Jaldi mein likha hua sher, sher nahi hota' },
    { line1: 'Yeh lafzon ka bazaar nahi', line2: 'Yeh adab ka daaira hai' },
    { line1: 'Mohabbat bhi adab mein baat karti hai', line2: 'Jahan sukoon ho, wahan shor nahi hota' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSherIndex((prev) => (prev + 1) % shers.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const googleAuth = (window as any).GoogleAuth;
      if (!googleAuth) throw new Error('GoogleAuth is not available');
      googleAuth.initialize({
        clientId: '994914434393-qmn96bvrlqk2piist6bjuk3f2qoevifu.apps.googleusercontent.com',
        scopes: ['profile', 'email'],
        grantOfflineAccess: true,
      });
      try { await googleAuth.signOut(); } catch (e) {}
      const googleUser = await googleAuth.signIn();
      if (googleUser.authentication?.idToken) {
        const { error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: googleUser.authentication.idToken,
        });
        if (error) throw error;
        window.location.reload();
      }
    } catch (error) {
      console.error('Login Failed:', error);
    }
  };

  const vessels = [
    { title: 'Ishq', subtitle: 'Jahaan mohabbat adab mein baat karti hai', link: '/generate?emotion=love' },
    { title: 'Dard', subtitle: 'Kuch alfaaz sirf sehne ke liye hote hain', link: '/generate?emotion=sad' },
    { title: 'Sufi', subtitle: 'Khud se khuda tak ka safar', link: '/generate?emotion=spiritual' },
    { title: 'Ghazal', subtitle: 'Radeef, qaafiya, aur tehzeeb', link: '/generate?type=ghazal' },
    { title: 'Khamoshi', subtitle: 'Jo kaha nahi gaya, wahi likha gaya', link: '/generate' },
  ];

  const floatingMessages = [
    { text: 'Adab shor nahi karta.', pos: 'top-32 left-10 xl:left-24', delay: 0 },
    { text: 'Gehraai ko waqt chahiye.', pos: 'top-64 right-10 xl:right-24', delay: 2 },
    { text: 'Kuch lafz sirf raat mein likhe jaate hain.', pos: 'bottom-32 left-20 xl:left-32', delay: 4 },
    { text: 'Khamoshi bhi ek badi ghazal hai.', pos: 'bottom-64 right-20 xl:right-32', delay: 1 },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#FAFAFA] dark:bg-[#09090b] selection:bg-amber-500/30 text-stone-900 dark:text-stone-50">
      
      {/* --- DYNAMIC EVENT BANNER --- */}
      <AnimatePresence>
        {activeEvent && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            className={`w-full bg-${activeEvent.theme_color}-100 dark:bg-${activeEvent.theme_color}-900/20 py-3 px-4 text-center z-50 relative border-b border-${activeEvent.theme_color}-200 dark:border-${activeEvent.theme_color}-800/50`}
          >
            <p className={`text-xs md:text-sm font-bold text-${activeEvent.theme_color}-800 dark:text-${activeEvent.theme_color}-400 flex items-center justify-center gap-2 tracking-[0.2em] uppercase`}>
              <Heart className="w-4 h-4 animate-pulse" /> 
              {activeEvent.banner_title} 
              <span className="font-medium hidden sm:inline-block normal-case tracking-normal opacity-70">— {activeEvent.banner_subtitle}</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Messages (Hidden on Mobile to prevent UI break) */}
      {floatingMessages.map((msg, idx) => (
        <motion.div 
          key={idx} 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: [0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, delay: msg.delay, ease: "easeInOut" }}
          className={`absolute ${msg.pos} text-stone-300 dark:text-stone-800 font-serif italic text-lg hidden lg:block z-0 select-none`}
        >
          {msg.text}
        </motion.div>
      ))}

      {/* --- HERO SECTION --- */}
      <section className="min-h-[85vh] flex flex-col items-center justify-center px-4 relative z-10 pt-16 pb-12">
        <div className="max-w-6xl mx-auto text-center space-y-10 w-full">
          
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }} className="flex justify-center mb-6 relative">
             <div className="absolute inset-0 bg-amber-500/10 blur-[60px] rounded-full w-48 h-48 mx-auto animate-pulse" />
            <div className="relative w-28 h-28 md:w-32 md:h-32 rounded-full border border-stone-200 dark:border-stone-800/60 bg-white/50 dark:bg-stone-900/50 backdrop-blur-xl flex items-center justify-center shadow-lg group hover:border-amber-500/50 transition-all duration-500">
              <Feather className="w-12 h-12 md:w-14 md:h-14 text-amber-600 dark:text-amber-500 group-hover:scale-110 transition-transform duration-500" />
            </div>
          </motion.div>

          <div className="space-y-6">
            <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="text-6xl md:text-8xl xl:text-9xl font-black tracking-tighter uppercase font-serif text-stone-900 dark:text-white drop-shadow-sm">
              PoetVerse
            </motion.h1>
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="space-y-3">
              <p className="text-2xl md:text-4xl lg:text-5xl font-serif italic font-medium text-stone-700 dark:text-stone-300">Yeh lafzon ka bazaar nahi.</p>
              <p className="text-sm md:text-lg font-bold tracking-[0.3em] md:tracking-[0.5em] uppercase text-amber-600 dark:text-amber-500">Yeh adab ka daaira hai.</p>
            </motion.div>
          </div>

          {/* TOUCH RESPONSIVE BUTTONS */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 w-full max-w-3xl mx-auto flex-wrap">
            <motion.div whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Button asChild className="h-16 px-8 text-sm md:text-base uppercase tracking-widest font-black w-full bg-stone-900 hover:bg-stone-800 text-white dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200 rounded-xl shadow-xl transition-all">
                <Link to="/generate"><PenTool className="w-5 h-5 mr-3" /> Qalam Uthaiye</Link>
              </Button>
            </motion.div>
            
            <motion.div whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Button onClick={() => navigate('/card-studio')} className="h-16 px-8 text-sm md:text-base uppercase tracking-widest font-black w-full bg-amber-50 hover:bg-amber-100 text-amber-900 dark:bg-stone-900 dark:hover:bg-stone-800 border-2 border-amber-200 dark:border-stone-800 dark:text-amber-500 rounded-xl transition-all shadow-md">
                <Heart className="w-5 h-5 mr-3" /> Create Wish Card
              </Button>
            </motion.div>

            <motion.div whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
              <Button asChild variant="ghost" className="h-16 px-6 text-sm md:text-base uppercase tracking-widest font-bold w-full text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-all">
                <Link to="/analyzer"><Search className="w-5 h-5 mr-3" /> Explore</Link>
              </Button>
            </motion.div>

            {!user && (
              <motion.div whileTap={{ scale: 0.95 }} className="w-full sm:w-auto mt-4 sm:mt-0">
                <button onClick={handleGoogleLogin} className="flex items-center justify-center bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-lg h-16 px-8 text-sm font-bold uppercase tracking-widest text-stone-800 dark:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800 transition-all w-full">
                  <img className="h-5 w-5 mr-3" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
                  Sign In
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* --- VESSELS SECTION --- */}
      <section className="max-w-[1400px] mx-auto px-4 py-24 md:py-32 border-t border-stone-200 dark:border-stone-800/50">
        <div className="text-center mb-16 md:mb-24 space-y-4">
          <p className="uppercase tracking-[0.4em] text-xs font-bold text-stone-400 dark:text-stone-500">Explore</p>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-widest font-serif">Shaayri Ke Daire</h2>
        </div>
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {vessels.map((vessel, idx) => (
            <motion.div key={idx} whileHover={{ y: -8 }} whileTap={{ scale: 0.96 }} className="w-full sm:w-64 md:w-72">
              <Link to={vessel.link} className="block h-full p-8 md:p-10 rounded-[2rem] bg-white dark:bg-stone-900/50 backdrop-blur-sm border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-xl transition-all text-center group">
                <h3 className="text-3xl font-bold mb-3 font-serif italic text-stone-800 dark:text-stone-200 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">{vessel.title}</h3>
                <p className="text-xs md:text-sm text-stone-500 dark:text-stone-400 leading-relaxed font-medium uppercase tracking-wider">{vessel.subtitle}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* --- LIVE SHER (Clean & Animated) --- */}
      <section className="max-w-5xl mx-auto px-4 py-20 md:py-24">
        <div className="rounded-[2.5rem] border border-stone-200 dark:border-stone-800/50 p-8 md:p-20 text-center space-y-10 bg-white/50 dark:bg-stone-900/20 shadow-xl relative overflow-hidden backdrop-blur-md">
          <QuoteIconLucide className="w-10 h-10 text-amber-500/40 mx-auto" />
          <div className="min-h-[140px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div key={currentSherIndex} initial={{ opacity: 0, y: 15, filter: "blur(4px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -15, filter: "blur(4px)" }} transition={{ duration: 0.6 }} className="space-y-6 w-full">
                <p className="text-2xl md:text-4xl lg:text-5xl font-serif italic font-medium text-stone-800 dark:text-stone-200 leading-relaxed">"{shers[currentSherIndex].line1}"</p>
                <p className="text-xl md:text-3xl font-serif italic text-stone-500 dark:text-stone-400 leading-relaxed">{shers[currentSherIndex].line2}</p>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="pt-8 border-t border-stone-200 dark:border-stone-800/50 inline-block px-8">
            <p className="text-[10px] md:text-xs text-amber-600 dark:text-amber-500 uppercase tracking-[0.4em] font-black">Yahaan lafz zinda rehte hain</p>
          </div>
        </div>
      </section>

      {/* --- TODAY'S REFLECTION (Dynamic from DB) --- */}
      {dailyVerse && (
        <section className="max-w-4xl mx-auto px-4 py-20">
          <div className="flex items-center gap-6 mb-12">
            <div className="h-[1px] flex-1 bg-stone-200 dark:bg-stone-800"></div>
            <span className="text-xs font-black uppercase tracking-[0.4em] text-amber-600 dark:text-amber-500">Today's Reflection</span>
            <div className="h-[1px] flex-1 bg-stone-200 dark:bg-stone-800"></div>
          </div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 rounded-[2rem] p-8 md:p-14 shadow-2xl text-center relative">
            <QuoteIconLucide className="absolute top-6 left-6 w-8 h-8 text-stone-200 dark:text-stone-800" />
            <p className="text-2xl md:text-4xl font-serif italic text-stone-800 dark:text-stone-200 leading-relaxed">"{dailyVerse.verse_text}"</p>
            <div className="mt-8">
              <p className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-widest">— {dailyVerse.author_name}</p>
            </div>
          </motion.div>
        </section>
      )}

      {/* --- LEGACY FEATURED POEM --- */}
      {dailyPoem && (
        <section className="max-w-3xl mx-auto px-4 py-20 mb-10">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-2xl md:text-4xl font-black uppercase tracking-[0.2em] font-serif">Featured Masterpiece</h2>
          </div>
          <PoemCard poem={dailyPoem} />
        </section>
      )}
    </div>
  );
};

export default HomePage;