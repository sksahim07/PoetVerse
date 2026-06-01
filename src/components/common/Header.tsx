import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X, Feather, LogIn, LogOut, User as UserIcon, Coins } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
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
  
  // Filter visible routes
  const navigation = routes.filter((route) => route.visible !== false);

  // Smooth scroll detector
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Correct Supabase OAuth Flow
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
          ? 'bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-stone-200 dark:border-stone-800 shadow-sm' 
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* --- LOGO SECTION --- */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group relative z-50">
            <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full scale-0 group-hover:scale-150 transition-transform duration-700" />
            <div className="relative p-2 rounded-full bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 group-hover:border-amber-500/50 transition-colors">
              <Feather className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-500" />
            </div>
            <span className="text-xl md:text-2xl font-black uppercase font-serif tracking-widest text-stone-900 dark:text-stone-50">
              PoetVerse
            </span>
          </Link>

          {/* --- DESKTOP NAVIGATION --- */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] rounded-full transition-all duration-300 ${
                    isActive 
                      ? 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10' 
                      : 'text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
            
            <div className="w-px h-6 bg-stone-300 dark:bg-stone-800 mx-4" />

            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-600 dark:text-stone-400 transition-colors mr-2"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            {user ? (
              <div className="flex items-center gap-3">
                {/* Vault / Credits */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/shop" 
                    className="flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 px-4 py-2 rounded-full border border-amber-200 dark:border-amber-800/50 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition-colors group"
                  >
                    <Coins className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <span className="text-sm font-black text-amber-700 dark:text-amber-400">{credits ?? '0'}</span>
                  </Link>
                </motion.div>

                {/* Profile Pill */}
                <div className="flex items-center gap-3 bg-stone-100 dark:bg-stone-900 pl-2 pr-1 py-1 rounded-full border border-stone-200 dark:border-stone-800">
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-stone-800 flex items-center justify-center shadow-sm">
                    <UserIcon className="w-4 h-4 text-stone-600 dark:text-stone-400" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-widest text-stone-600 dark:text-stone-400 max-w-[100px] truncate">
                    {user.email?.split('@')[0]}
                  </span>
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={handleLogout}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/30 text-stone-400 hover:text-red-600 dark:hover:text-red-400 transition-colors ml-1"
                  >
                    <LogOut className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            ) : (
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={handleGoogleLogin} 
                className="flex items-center gap-2 bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-xs font-bold tracking-[0.2em] uppercase rounded-full px-6 py-3 shadow-md hover:shadow-lg transition-all"
              >
                <LogIn className="w-4 h-4" />
                Sign In
              </motion.button>
            )}
          </div>

          {/* --- MOBILE NAVIGATION CONTROLS (Anti-Break Flexbox) --- */}
          <div className="lg:hidden flex items-center gap-2 sm:gap-3 shrink-0 flex-nowrap">
            {user && (
              <motion.div whileTap={{ scale: 0.9 }}>
                <Link 
                  to="/shop"
                  className="flex items-center gap-1.5 bg-amber-100 dark:bg-amber-900/30 px-3 py-1.5 rounded-full border border-amber-200 dark:border-amber-800/50"
                >
                  <Coins className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-black text-amber-700 dark:text-amber-400">{credits ?? 0}</span>
                </Link>
              </motion.div>
            )}
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full bg-stone-100 dark:bg-stone-900 text-stone-600 dark:text-stone-400"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 sm:w-5 sm:h-5" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-md z-50 relative"
            >
              {isMenuOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Menu className="w-4 h-4 sm:w-5 sm:h-5" />}
            </motion.button>
          </div>
        </div>
      </nav>

      {/* --- MOBILE FULL-SCREEN MENU DRAWER --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-[#0a0a0a]/95 backdrop-blur-2xl border-b border-stone-200 dark:border-stone-800 shadow-2xl overflow-y-auto max-h-[85vh] custom-scrollbar"
          >
            <div className="px-6 py-8 space-y-6">
              
              {/* Mobile Menu Links */}
              <div className="space-y-2">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-6 py-4 text-xs font-black uppercase tracking-[0.2em] rounded-2xl transition-all ${
                        isActive
                          ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50'
                          : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-900/50'
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </div>
              
              <div className="h-px w-full bg-stone-200 dark:bg-stone-800" />
              
              {/* Mobile Auth / Profile Section */}
              {user ? (
                <div className="p-5 bg-stone-50 dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white dark:bg-stone-800 flex items-center justify-center shadow-sm shrink-0">
                      <UserIcon className="w-6 h-6 text-stone-400" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-500 tracking-widest mb-1">Logged In As</span>
                      <span className="text-sm font-bold text-stone-800 dark:text-stone-200 truncate w-full">{user.email}</span>
                    </div>
                  </div>
                  
                  <motion.button 
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogout} 
                    className="w-full flex items-center justify-center gap-3 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-black tracking-[0.2em] uppercase rounded-2xl py-4 border border-red-200 dark:border-red-900/50"
                  >
                    <LogOut className="w-5 h-5" /> Logout
                  </motion.button>
                </div>
              ) : (
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGoogleLogin} 
                  className="w-full flex items-center justify-center gap-3 bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-black tracking-[0.2em] uppercase rounded-2xl py-5 shadow-xl"
                >
                  <LogIn className="w-5 h-5" /> Sign In securely
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;