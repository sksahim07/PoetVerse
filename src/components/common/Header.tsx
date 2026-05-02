import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X, Feather } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import routes from '@/routes';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const navigation = routes.filter((route) => route.visible !== false);

  // Scroll Detection for Glass Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-background/70 backdrop-blur-xl border-b border-primary/20 shadow-lg shadow-primary/5' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="max-w-[1400px] mx-auto px-4 xl:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <Link to="/" className="flex items-center gap-3 group relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700" />
            <div className="relative p-2 rounded-full bg-primary/10 border border-primary/20 group-hover:border-primary/50 transition-colors">
              <Feather className="w-6 h-6 text-primary" />
            </div>
            <span className="text-3xl font-black gradient-text tracking-tighter uppercase font-serif">
              PoetVerse
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-5 py-2.5 text-sm font-bold uppercase tracking-widest rounded-lg transition-all duration-300 group overflow-hidden ${
                    isActive 
                      ? 'text-primary' 
                      : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  {/* Background Hover Effect */}
                  <div className={`absolute inset-0 bg-primary/10 transition-transform duration-300 ${isActive ? 'scale-100' : 'scale-0 group-hover:scale-100'}`} />
                  
                  {/* Bottom Border Effect */}
                  <div className={`absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                  
                  <span className="relative z-10">{item.name}</span>
                </Link>
              );
            })}
            
            <div className="w-px h-8 bg-primary/20 mx-4" /> {/* Divider */}

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full hover:bg-primary/10 text-primary transition-all duration-500 hover:rotate-12"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>

          {/* Mobile Navigation Controls */}
          <div className="lg:hidden flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full text-primary"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-full text-primary hover:bg-primary/10"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-20 left-0 w-full bg-background/95 backdrop-blur-2xl border-b border-primary/20 shadow-2xl animate-in slide-in-from-top-4 duration-300">
            <div className="px-4 py-6 space-y-2 max-w-7xl mx-auto">
              {navigation.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-6 py-4 text-sm font-bold uppercase tracking-widest rounded-xl transition-all ${
                      isActive
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-foreground/70 hover:bg-primary/5 hover:text-foreground'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;