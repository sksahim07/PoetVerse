import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Feather, Sparkles, PenTool, Search } from 'lucide-react';
import { getPoemsWithFavoriteStatus } from '@/db/api';
import type { PoemWithFavorite } from '@/types/types';
import { PoemCard } from '@/components/poetry/PoemCard';

const HomePage = () => {
  const [dailyPoem, setDailyPoem] = useState<PoemWithFavorite | null>(null);
  const [currentSherIndex, setCurrentSherIndex] = useState(0);

  useEffect(() => {
    const loadDailyPoem = async () => {
      try {
        const poems = await getPoemsWithFavoriteStatus({ is_daily: true, limit: 1 });
        setDailyPoem(poems[0] || null);
      } catch (error) {
        console.error('Failed to load daily poem:', error);
      }
    };

    loadDailyPoem();
  }, []);

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

  // GOOGLE LOGIN HANDLER
  const handleGoogleLogin = async () => {
    try {
      const user = await GoogleAuth.signIn();
      console.log('User Info:', user);
      alert(`Welcome ${user.name}! Google Login Successful.`);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      alert('Login Failed! Check console for errors.');
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
    { text: 'Adab shor nahi karta.', pos: 'top-32 left-10 xl:left-24' },
    { text: 'Gehraai ko waqt chahiye.', pos: 'top-64 right-10 xl:right-24' },
    { text: 'Kuch lafz sirf raat mein likhe jaate hain.', pos: 'bottom-32 left-20 xl:left-32' },
    { text: 'Khamoshi bhi ek badi ghazal hai.', pos: 'bottom-64 right-20 xl:right-32' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 blur-[120px] pointer-events-none rounded-full" />
      
      {/* Fixed Floating Mini-Mails */}
      {floatingMessages.map((msg, idx) => (
        <div key={idx} className={`absolute ${msg.pos} text-primary/20 font-serif italic text-lg hidden lg:block animate-pulse`}>
          {msg.text}
        </div>
      ))}

      {/* --- HERO SECTION: Shaan Ka Darwaza --- */}
      <section className="min-h-[85vh] flex flex-col items-center justify-center px-4 relative z-10 pt-20">
        <div className="max-w-5xl mx-auto text-center space-y-12">
          
          {/* Elite Logo Presentation */}
          <div className="flex justify-center mb-4 relative">
            <div className="absolute inset-0 bg-primary/20 blur-[60px] rounded-full w-48 h-48 mx-auto animate-pulse" />
            <div className="relative w-32 h-32 rounded-full border border-primary/30 bg-background/50 backdrop-blur-xl flex items-center justify-center shadow-[0_0_40px_rgba(184,134,11,0.15)]">
              <Feather className="w-14 h-14 text-primary animate-float" />
            </div>
          </div>

          {/* Core Message */}
          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl xl:text-9xl font-black gradient-text tracking-tighter uppercase leading-tight animate-in fade-in slide-in-from-bottom-8 duration-1000 font-serif">
              PoetVerse
            </h1>
            <div className="space-y-3">
              <p className="text-3xl md:text-4xl text-foreground font-serif italic font-medium">
                Yeh lafzon ka bazaar nahi.
              </p>
              <p className="text-xl md:text-2xl text-primary font-serif italic tracking-widest uppercase">
                Yeh adab ka daaira hai.
              </p>
            </div>
          </div>

          {/* Primary Actions */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 flex-wrap">
            <Button asChild size="lg" className="btn-royal h-16 px-10 text-lg uppercase tracking-widest font-bold w-full sm:w-auto shadow-2xl">
              <Link to="/generate">
                <PenTool className="w-5 h-5 mr-3" /> Qalam Uthaiye
              </Link>
            </Button>
            
            <Button asChild size="lg" className="h-16 px-10 text-lg uppercase tracking-widest font-bold w-full sm:w-auto bg-transparent border-2 border-primary/30 text-primary hover:bg-primary/10 transition-all duration-300 rounded-lg">
              <Link to="/analyzer">
                <Search className="w-5 h-5 mr-3" /> Explore Depth
              </Link>
            </Button>

            {/* GOOGLE LOGIN TEST BUTTON */}
            <button 
              onClick={handleGoogleLogin}
              className="flex items-center justify-center bg-white border-2 border-gray-200 rounded-lg shadow-lg h-16 px-8 text-sm font-bold text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 w-full sm:w-auto transition-all duration-300"
            >
              <img className="h-6 w-6 mr-3" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" />
              <span className="uppercase tracking-widest">Test Login</span>
            </button>
          </div>
        </div>
      </section>

      {/* --- VESSELS SECTION: Shaayri Ke Daire --- */}
      <section className="max-w-[1400px] mx-auto px-4 py-32 relative z-10 border-t border-primary/10 mt-12">
        <div className="text-center mb-20 space-y-4">
          <div className="flex justify-center items-center gap-3 text-primary mb-2">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="uppercase tracking-[0.3em] text-sm font-bold">Explore</span>
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <h2 className="text-4xl xl:text-5xl font-black text-foreground uppercase tracking-widest font-serif">
            Shaayri Ke Daire
          </h2>
          <p className="text-warm-muted text-xl italic font-serif">
            Har daaira ek alag jazbaat ki duniya hai.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 xl:gap-12">
          {vessels.map((vessel, idx) => (
            <Link key={idx} to={vessel.link} className="group relative w-48 h-48 sm:w-64 sm:h-64">
              <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/20 transition-all duration-500" />
              <div className="relative w-full h-full rounded-full glass-card border border-primary/20 flex flex-col items-center justify-center p-8 text-center shadow-lg group-hover:-translate-y-2 group-hover:shadow-[0_0_40px_rgba(184,134,11,0.2)] transition-all duration-500 bg-black/5 dark:bg-black/20">
                <h3 className="text-3xl font-bold text-primary mb-3 font-serif italic">
                  {vessel.title}
                </h3>
                <p className="text-sm text-foreground/70 leading-relaxed font-medium">
                  {vessel.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* --- LIVE SHER SECTION --- */}
      <section className="max-w-5xl mx-auto px-4 py-24 relative z-10">
        <div className="glass-card royal-frame p-12 md:p-20 text-center space-y-8 bg-black/5 dark:bg-black/20 shadow-2xl relative overflow-hidden">
          {/* Subtle background quote mark */}
          <QuoteIcon className="w-48 h-48 text-primary/5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-180 pointer-events-none" />
          
          <QuoteIcon className="w-12 h-12 text-primary/30 mx-auto rotate-180 relative z-10" />
          <div className="min-h-[140px] flex flex-col items-center justify-center relative z-10">
            <div key={currentSherIndex} className="animate-in fade-in slide-in-from-bottom-4 duration-1000 space-y-6">
              <p className="text-3xl md:text-5xl text-foreground font-serif italic font-medium leading-relaxed">
                {shers[currentSherIndex].line1}
              </p>
              <p className="text-3xl md:text-5xl text-foreground font-serif italic font-medium leading-relaxed">
                {shers[currentSherIndex].line2}
              </p>
            </div>
          </div>
          <p className="text-sm text-primary uppercase tracking-[0.4em] font-bold relative z-10 mt-8 pt-8 border-t border-primary/10">
            Yahaan lafz zinda rehte hain
          </p>
        </div>
      </section>

      {/* --- DAILY POEM SECTION --- */}
      {dailyPoem && (
        <section className="max-w-4xl mx-auto px-4 py-24 relative z-10">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl font-black text-foreground uppercase tracking-widest font-serif">
              Aaj Ka Sher
            </h2>
            <p className="text-primary text-xl italic font-serif">
              Har din ek naya ehsaas
            </p>
          </div>
          <PoemCard poem={dailyPoem} />
        </section>
      )}
    </div>
  );
};

const QuoteIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
  </svg>
);

export default HomePage;