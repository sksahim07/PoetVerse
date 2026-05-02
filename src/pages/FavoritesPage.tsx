import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, HeartCrack, Sparkles } from 'lucide-react';
import { PoemCard } from '@/components/poetry/PoemCard';
import { getPoemsWithFavoriteStatus } from '@/db/api';
import type { PoemWithFavorite } from '@/types/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const FavoritesPage = () => {
  const [poems, setPoems] = useState<PoemWithFavorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPoems = async () => {
    setIsLoading(true);
    try {
      // WARNING: Client-side filtering on a limited query will hide older favorites.
      // This needs to be moved to the backend query in api.ts ASAP.
      const data = await getPoemsWithFavoriteStatus({ limit: 50 });
      setPoems(data.filter((p: PoemWithFavorite) => p.is_favorited));
    } catch (error) {
      console.error('Error loading favorite poems:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPoems();
  }, []);

  return (
    <div className="min-h-screen py-12 px-4 xl:px-8 bg-gradient-to-b from-background to-background/80 relative overflow-hidden">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="max-w-[1400px] mx-auto space-y-12 relative z-10">
        
        <header className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-4">
            <div className="p-4 bg-primary/10 rounded-full glow-gold border border-primary/20">
              <Heart className="w-10 h-10 text-primary animate-pulse" />
            </div>
            <h1 className="text-5xl xl:text-6xl font-black tracking-tighter gradient-text uppercase">
              Treasured Verses
            </h1>
          </div>
          <p className="text-xl text-warm-muted leading-relaxed font-serif italic">
            "The verses that touched your soul, preserved for eternity."
          </p>
        </header>

        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="glass-card royal-frame h-[350px] border-none bg-black/5 dark:bg-black/20">
                <CardHeader className="border-b border-primary/10 pb-4">
                  <Skeleton className="h-8 w-3/4 bg-primary/10 rounded-md" />
                  <Skeleton className="h-4 w-1/2 bg-primary/5 mt-3 rounded-md" />
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <Skeleton className="h-4 w-full bg-primary/5 rounded-md" />
                  <Skeleton className="h-4 w-full bg-primary/5 rounded-md" />
                  <Skeleton className="h-4 w-5/6 bg-primary/5 rounded-md" />
                  <div className="pt-6 flex justify-between items-center">
                    <Skeleton className="h-10 w-24 bg-primary/10 rounded-lg" />
                    <Skeleton className="h-10 w-10 bg-primary/20 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && poems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-8 glass-card royal-frame max-w-3xl mx-auto bg-black/5 dark:bg-black/20 animate-in fade-in zoom-in duration-700">
            <HeartCrack className="w-24 h-24 text-primary/30" />
            <div className="space-y-4">
              <h3 className="text-3xl font-serif italic text-primary">No Favorites Yet</h3>
              <p className="text-lg text-warm-muted max-w-md mx-auto">
                Your vault is empty. Explore the realm of words and heart the ones that speak to you.
              </p>
            </div>
            <Button asChild className="btn-royal h-14 px-8 text-lg uppercase tracking-widest font-bold mt-4 shadow-xl">
              <Link to="/generate">
                <Sparkles className="w-5 h-5 mr-3" /> Find Inspiration
              </Link>
            </Button>
          </div>
        )}

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
                />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default FavoritesPage;