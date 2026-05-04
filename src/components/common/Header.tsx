import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X, Feather, LogIn, LogOut, User as UserIcon, Coins } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import routes from '@/routes';
import { supabase } from '@/db/supabase';
import { useAuth } from '@/contexts/AuthContext'; 

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  const { user, credits } = useAuth(); 
  
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const navigation = routes.filter((route) => route.visible !== false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { 
          redirectTo: window.location.origin,
          queryParams: { prompt: 'select_account' }
        }
      });
      if (error) throw error;
    } catch (error: any) {
      console.error('Login error:', error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
  };

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
                    isActive ? 'text-primary' : 'text-foreground/70 hover:text-foreground'
                  }`}
                >
                  <div className={`absolute inset-0 bg-primary/10 transition-transform duration-300 ${isActive ? 'scale-100' : 'scale-0 group-hover:scale-100'}`} />
                  <div className={`absolute bottom-0 left-0 h-[2px] bg-primary transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                  <span className="relative z-10">{item.name}</span>
                </Link>
              );
            })}
            
            <div className="w-px h-8 bg-primary/20 mx-4" />

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full hover:bg-primary/10 text-primary transition-all duration-500 hover:rotate-12 mr-2"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>

            {user ? (
              <div className="flex items-center gap-2">
                {/* Desktop Credit Counter with Link to Shop */}
                <Link 
                  to="/shop" 
                  className="flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 shadow-inner hover:bg-primary/20 transition-all group/credit"
                  title="Visit Vault to Recharge"
                >
                  <Coins className="w-4 h-4 text-primary animate-pulse" />
                  <span className="text-sm font-black text-primary">
                    {credits !== null ? credits : '...'}
                  </span>
                  <div className="ml-1 bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold group-hover/credit:scale-110 transition-transform">
                    +
                  </div>
                </Link>

                <div className="flex items-center gap-3 ml-2 bg-primary/5 p-1 pr-4 rounded-full border border-primary/10 transition-all hover:bg-primary/10">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                    <UserIcon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-tighter opacity-80 max-w-[80px] truncate">
                    {user.email?.split('@')[0]}
                  </span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={handleLogout}
                    className="w-8 h-8 rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                onClick={handleGoogleLogin} 
                className="gap-2 font-bold tracking-widest uppercase rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-0.5"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Navigation Controls */}
          <div className="lg:hidden flex items-center gap-2">
            {user && (
              /* Mobile Credit Link to Shop */
              <Link 
                to="/shop"
                className="flex items-center gap-1.5 bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20 mr-1 active:scale-95 transition-transform"
              >
                <Coins className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-black text-primary">{credits ?? 0}</span>
                <span className="ml-0.5 text-[10px] font-bold text-primary">+</span>
              </Link>
            )}
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
            <div className="px-4 py-6 space-y-4 max-w-7xl mx-auto">
              <div className="space-y-2">
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
              
              <div className="h-px w-full bg-primary/20 my-4" />
              
              {user ? (
                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black uppercase text-primary leading-none mb-1">Logged In</span>
                        <span className="text-sm font-medium opacity-70 truncate max-w-[150px]">{user.email}</span>
                      </div>
                    </div>
                    {/* Mobile Menu Credit Link */}
                    <Link 
                      to="/shop" 
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 bg-primary/20 px-3 py-1 rounded-full border border-primary/30"
                    >
                      <Coins className="w-4 h-4 text-primary" />
                      <span className="text-sm font-black text-primary">{credits ?? 0}</span>
                      <div className="ml-1 bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                        +
                      </div>
                    </Link>
                  </div>
                  <Button 
                    variant="destructive"
                    onClick={handleLogout} 
                    className="w-full gap-2 font-bold tracking-widest uppercase rounded-xl py-6 shadow-lg shadow-destructive/20"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout Account
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={handleGoogleLogin} 
                  className="w-full gap-2 font-bold tracking-widest uppercase rounded-xl py-6 shadow-lg shadow-primary/20 bg-primary text-primary-foreground"
                >
                  <LogIn className="w-5 h-5" />
                  Sign In With Google
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;