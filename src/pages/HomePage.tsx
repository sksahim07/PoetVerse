import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Feather } from 'lucide-react';
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

  // Rotating shers - Hinglish UI text
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

  const vessels = [
    { title: 'Ishq', subtitle: 'Jahaan mohabbat bhi adab mein baat karti hai', link: '/generate?emotion=love' },
    { title: 'Dard', subtitle: 'Kuch alfaaz sirf sehne ke liye hote hain', link: '/generate?emotion=sad' },
    { title: 'Sufi', subtitle: 'Khud se khuda tak ka safar', link: '/generate?emotion=spiritual' },
    { title: 'Ghazal', subtitle: 'Radeef, qaafiya, aur tehzeeb', link: '/generate?type=ghazal' },
    { title: 'Khamoshi', subtitle: 'Jo kaha nahi gaya, wahi likha gaya', link: '/generate' },
  ];

  const floatingMessages = [
    'Adab shor nahi karta.',
    'Gehraai ko waqt chahiye.',
    'Kuch lafz sirf raat mein likhe jaate hain.',
    'Khamoshi bhi ek badi ghazal hai.',
  ];

  return (
    <div className="min-h-screen relative">
      {/* Floating Mini-Mails - Hinglish messages */}
      {floatingMessages.map((msg, idx) => (
        <div key={idx} className="floating-message text-muted-foreground text-sm italic">
          {msg}
        </div>
      ))}

      {/* Hero Section - Shaan Ka Darwaza */}
      <section className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Logo with Slow Glow */}
          <div className="flex justify-center mb-8">
            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center logo-glow">
              <Feather className="w-16 h-16 text-primary" />
            </div>
          </div>

          {/* Text Appearing One by One - Hinglish */}
          <div className="space-y-4">
            <h1 className="text-4xl xl:text-5xl font-bold text-ivory text-appear adab-spacing">
              Yeh lafzon ka bazaar nahi.
            </h1>
            <p className="text-2xl xl:text-3xl text-warm-muted text-appear text-appear-delay-1 font-light">
              Yeh adab ka daaira hai.
            </p>
          </div>

          {/* CTA Buttons - Hinglish */}
          <div className="flex flex-col xl:flex-row gap-4 justify-center items-center pt-8 text-appear text-appear-delay-2">
            <Button asChild size="lg" variant="outline" className="gap-2 royal-border hover:bg-primary hover:text-primary-foreground bg-transparent text-ivory transition-all duration-300">
              <Link to="/generate">
                Qalam uthaiye
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2 royal-border hover:bg-primary hover:text-primary-foreground bg-transparent text-ivory transition-all duration-300">
              <Link to="/analyzer">
                Mehfil shuru karein
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Vessels - Shaayri Ke Daire */}
      <section className="max-w-7xl mx-auto px-4 xl:px-8 py-20 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl xl:text-4xl font-bold text-ivory adab-spacing mb-4">
            Shaayri Ke Daire
          </h2>
          <p className="text-warm-muted text-lg">
            Har daaira ek alag jazbaat ki duniya hai
          </p>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-5 gap-8 xl:gap-12 justify-items-center">
          {vessels.map((vessel, idx) => (
            <Link key={idx} to={vessel.link} className="vessel-circle flex flex-col items-center justify-center p-6 text-center group">
              <h3 className="text-2xl font-bold vessel-title mb-3 adab-spacing">
                {vessel.title}
              </h3>
              <p className="text-sm vessel-subtitle leading-relaxed">
                {vessel.subtitle}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Live Sher Section - Hinglish */}
      <section className="max-w-4xl mx-auto px-4 xl:px-8 py-20 relative z-10">
        <div className="text-center space-y-8">
          <div className="min-h-[120px] flex flex-col items-center justify-center">
            <div key={currentSherIndex} className="sher-fade space-y-3">
              <p className="text-2xl xl:text-3xl text-ivory poetry-text">
                {shers[currentSherIndex].line1}
              </p>
              <p className="text-2xl xl:text-3xl text-ivory poetry-text">
                {shers[currentSherIndex].line2}
              </p>
            </div>
          </div>
          <p className="text-sm text-warm-muted italic">
            Yahaan lafz zinda rehte hain.
          </p>
        </div>
      </section>

      {/* Qalamkhana - Creation Area */}
      <section className="max-w-4xl mx-auto px-4 xl:px-8 py-20 relative z-10">
        <div className="glass-card royal-frame p-8 xl:p-12">
          <div className="text-center space-y-6">
            <div className="gold-border-top pt-6">
              <h2 className="text-3xl xl:text-4xl font-bold gold-accent adab-spacing mb-2">
                Qalamkhana
              </h2>
              <p className="text-warm-muted text-lg">
                Jaise mehfil mein sher pesh karte hain…
              </p>
            </div>
            
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 pt-6">
              <Button asChild variant="outline" className="royal-border hover:bg-primary hover:text-primary-foreground bg-transparent text-ivory transition-all duration-300">
                <Link to="/generate?type=shayari">Shayari</Link>
              </Button>
              <Button asChild variant="outline" className="royal-border hover:bg-primary hover:text-primary-foreground bg-transparent text-ivory transition-all duration-300">
                <Link to="/generate?type=ghazal">Ghazal</Link>
              </Button>
              <Button asChild variant="outline" className="royal-border hover:bg-primary hover:text-primary-foreground bg-transparent text-ivory transition-all duration-300">
                <Link to="/generate?type=nazm">Nazm</Link>
              </Button>
              <Button asChild variant="outline" className="royal-border hover:bg-primary hover:text-primary-foreground bg-transparent text-ivory transition-all duration-300">
                <Link to="/generate?type=song">Song</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Poem Section */}
      {dailyPoem && (
        <section className="max-w-4xl mx-auto px-4 xl:px-8 py-20 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl xl:text-4xl font-bold text-ivory adab-spacing mb-4">
              Aaj Ka Sher
            </h2>
            <p className="text-warm-muted text-lg">
              Har din ek naya ehsaas
            </p>
          </div>
          <PoemCard poem={dailyPoem} />
        </section>
      )}

      {/* Footer - Circle Motif */}
      <footer className="border-t border-border/50 py-12 relative z-10">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <p className="text-lg text-warm-muted italic">
            Lafzon ka ghar — jahan jazbaat adab se likhe jaate hain.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-warm-muted">
            <Link to="/about" className="hover:text-primary transition-colors">
              Hamara Safar
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors">
              Adab Nama
            </Link>
            <Link to="/contact" className="hover:text-primary transition-colors">
              Rabta
            </Link>
          </div>
          <div className="flex justify-center gap-3 pt-4">
            <div className="w-2 h-2 rounded-full bg-primary/30"></div>
            <div className="w-2 h-2 rounded-full bg-primary/50"></div>
            <div className="w-2 h-2 rounded-full bg-primary"></div>
            <div className="w-2 h-2 rounded-full bg-primary/50"></div>
            <div className="w-2 h-2 rounded-full bg-primary/30"></div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
