import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Feather, Library, ScrollText, LockKeyhole } from 'lucide-react';
import { PoemCard } from '@/components/poetry/PoemCard';
import { getUserPoems } from '@/db/api';
import type { Poem } from '@/types/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext'; // 🔴 Auth Context যোগ করা হয়েছে

const MyPoemsPage = () => {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading: authLoading } = useAuth(); // 🔴 ইউজার চেক করা হচ্ছে

  const loadPoems = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const data = await getUserPoems();
      setPoems(data);
    } catch (error) {
      console.error('Error loading user poems:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      loadPoems();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading]);

  // 🔴 যদি ইউজার লগ-ইন না থাকে, তবে এই স্ক্রিন দেখাবে (Security Lock)
  if (!authLoading && !user) {
    return (
      <div className="min-h-screen py-32 px-4 bg-gradient-to-b from-background to-background/80 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center text-center space-y-6 max-w-xl animate-in fade-in zoom-in duration-700">
          <div className="p-6 bg-primary/10 rounded-full border border-primary/20 shadow-2xl">
            <LockKeyhole className="w-16 h-16 text-primary" />
          </div>
          <h2 className="text-4xl font-black uppercase font-serif italic text-primary">Archives Locked</h2>
          <p className="text-xl text-warm-muted font-serif">
            Identify yourself to the Maestro to access your sealed verses.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 xl:px-8 bg-gradient-to-b from-background to-background/80 relative overflow-hidden">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto space-y-12 relative z-10">
        
        {/* Elite Header */}
        <header className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-4">
            <div className="p-4 bg-primary/10 rounded-full glow-gold border border-primary/20">
              <Library className="w-10 h-10 text-primary animate-float" />
            </div>
            <h1 className="text-5xl xl:text-6xl font-black tracking-tighter gradient-text uppercase">
              The Archives
            </h1>
          </div>
          <p className="text-xl text-warm-muted leading-relaxed font-serif italic">
            "Your personal collection of verses, sealed in time."
          </p>
        </header>

        {/* Loading State - Royal Skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="glass-card royal-frame h-[350px] border-none bg-black/5 dark:bg-black/20">
                <CardHeader className="border-b border-primary/10 pb-4">
                  <Skeleton className="h-8 w-3/4 bg-primary/10 rounded-md" />
                  <Skeleton className="h-4 w-1/2 bg-primary/5 mt-3 rounded-md" />
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <Skeleton className="h-4 w-full bg-primary/5 rounded-md" />
                  <Skeleton className="h-4 w-full bg-primary/5 rounded-md" />
                  <Skeleton className="h-4 w-5/6 bg-primary/5 rounded-md" />
                  <Skeleton className="h-4 w-4/6 bg-primary/5 rounded-md" />
                  <div className="pt-6">
                    <Skeleton className="h-12 w-full bg-primary/10 rounded-lg" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State - The Blank Canvas */}
        {!isLoading && poems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-8 glass-card royal-frame max-w-3xl mx-auto bg-black/5 dark:bg-black/20 animate-in fade-in zoom-in duration-700">
            <ScrollText className="w-24 h-24 text-primary/30 animate-pulse" />
            <div className="space-y-4">
              <h3 className="text-3xl font-serif italic text-primary">The Vault is Empty</h3>
              <p className="text-lg text-warm-muted max-w-md mx-auto">
                No verses have been sealed here yet. The Maestro's quill awaits its first drop of ink.
              </p>
            </div>
            <Button asChild className="btn-royal h-14 px-8 text-lg uppercase tracking-widest font-bold mt-4 shadow-xl">
              <Link to="/generate">
                <Feather className="w-5 h-5 mr-3" /> Command The Quill
              </Link>
            </Button>
          </div>
        )}

        {/* Grid of Masterpieces */}
        {!isLoading && poems.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {poems.map((poem, index) => (
              <div 
                key={poem.id} 
                className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <PoemCard 
                  poem={poem} 
                  onFavoriteChange={loadPoems}
                  onDelete={loadPoems}
                  showDelete={true}
                />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default MyPoemsPage;