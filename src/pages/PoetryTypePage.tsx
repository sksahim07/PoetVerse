import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, Feather, ScrollText } from 'lucide-react';
import { PoemCard } from '@/components/poetry/PoemCard';
import { getPoemsWithFavoriteStatus } from '@/db/api';
import type { PoemWithFavorite, PoetryType } from '@/types/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const poetryTypeLabels: Record<string, string> = {
  shayari: 'Shayari',
  ghazal: 'Ghazal',
  nazm: 'Nazm',
  song: 'Song',
  poem: 'Classic Poem',
  couplet: 'Couplet'
};

// Added custom descriptions for each poetry form to give a royal feel
const poetryTypeDescriptions: Record<string, string> = {
  shayari: 'Short, impactful expressions carrying the weight of deep emotions.',
  ghazal: 'Melancholic beauty, strictly bound by rhythm, radeef, and qaafiya.',
  nazm: 'A continuous, woven flow of thoughts telling a complete story.',
  song: 'Lyrical verses, perfectly structured to be embraced by melodies.',
  poem: 'Traditional verses painting vivid pictures with profound words.',
  couplet: 'Two lines holding the unsaid secrets of a thousand words.'
};

const PoetryTypePage = () => {
  const { type } = useParams<{ type: string }>();
  const [poems, setPoems] = useState<PoemWithFavorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPoems = async () => {
    if (!type) return;
    setIsLoading(true);
    try {
      const data = await getPoemsWithFavoriteStatus({
        poetry_type: type as PoetryType,
        limit: 30
      });
      setPoems(data);
    } catch (error) {
      console.error('Error loading poems:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPoems();
  }, [type]);

  return (
    <div className="min-h-screen py-16 px-4 xl:px-8 bg-gradient-to-b from-background to-background/90 relative overflow-hidden">
      
      {/* Mystical Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-[1400px] mx-auto space-y-12 relative z-10">
        
        {/* Elite Header */}
        <header className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-4">
            <div className="p-4 bg-primary/10 rounded-full glow-gold border border-primary/20">
              <BookOpen className="w-10 h-10 text-primary animate-float" />
            </div>
            <h1 className="text-5xl xl:text-7xl font-black tracking-tighter gradient-text font-serif">
              {type && poetryTypeLabels[type]}
            </h1>
          </div>
          <p className="text-xl text-warm-muted leading-relaxed font-serif italic">
            "{type && poetryTypeDescriptions[type] ? poetryTypeDescriptions[type] : 'Verses bound by form, freed by emotion.'}"
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
                  <div className="pt-6 flex justify-between items-center">
                    <Skeleton className="h-10 w-24 bg-primary/10 rounded-lg" />
                    <Skeleton className="h-10 w-10 bg-primary/20 rounded-full" />
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
              <h3 className="text-3xl font-serif italic text-primary">The Parchment is Blank</h3>
              <p className="text-lg text-warm-muted max-w-md mx-auto">
                No {type && poetryTypeLabels[type]} has been woven yet. Take the quill and be the first.
              </p>
            </div>
            <Button asChild className="btn-royal h-14 px-8 text-lg uppercase tracking-widest font-bold mt-4 shadow-xl">
              <Link to={`/generate?type=${type}`}>
                <Feather className="w-5 h-5 mr-3" /> Pen a {type && poetryTypeLabels[type]}
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
                />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default PoetryTypePage;