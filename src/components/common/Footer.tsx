import { Feather } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black/5 dark:bg-background border-t border-primary/10 mt-auto overflow-hidden">
      {/* Top Golden Glow Line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="max-w-[1400px] mx-auto py-16 px-4 xl:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-12 xl:gap-8">
          
          {/* Brand Section */}
          <div className="xl:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-full border border-primary/20">
                <Feather className="w-5 h-5 text-primary" />
              </div>
              <span className="text-2xl font-black gradient-text uppercase tracking-widest font-serif">
                PoetVerse
              </span>
            </div>
            <p className="text-warm-muted text-lg max-w-sm leading-relaxed font-serif italic">
              "A sanctuary for words, where emotions find their true rhythm across languages and time."
            </p>
          </div>

          {/* Languages */}
          <div>
            <h3 className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-6">
              Languages
            </h3>
            <div className="space-y-3 font-medium text-foreground/70">
              <p className="hover:text-primary transition-colors cursor-default">Urdu • اردو</p>
              <p className="hover:text-primary transition-colors cursor-default">Hindi • हिन्दी</p>
              <p className="hover:text-primary transition-colors cursor-default">English</p>
              <p className="hover:text-primary transition-colors cursor-default">Bengali • বাংলা</p>
            </div>
          </div>

          {/* Poetry Forms */}
          <div>
            <h3 className="text-sm font-bold text-primary uppercase tracking-[0.2em] mb-6">
              Poetry Forms
            </h3>
            <div className="space-y-3 font-medium text-foreground/70">
              <p className="hover:text-primary transition-colors cursor-default">Shayari & Ghazal</p>
              <p className="hover:text-primary transition-colors cursor-default">Nazm & Classic Poem</p>
              <p className="hover:text-primary transition-colors cursor-default">Full-Length Song</p>
              <p className="hover:text-primary transition-colors cursor-default">Two-Line Couplet</p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-16 pt-8 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-warm-muted/60">
          <p className="tracking-wider uppercase text-xs font-bold">
            © {currentYear} PoetVerse. Crafted with Adab.
          </p>
          
          {/* Minimal Links */}
          <div className="flex items-center gap-6 text-xs uppercase tracking-widest font-bold">
            <Link to="#" className="hover:text-primary transition-colors">Privacy</Link>
            <div className="w-1 h-1 rounded-full bg-primary/30" />
            <Link to="#" className="hover:text-primary transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;