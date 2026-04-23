import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { PoemCard } from '@/components/poetry/PoemCard';
import { getPoemsWithFavoriteStatus } from '@/db/api';
import type { PoemWithFavorite } from '@/types/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const EmotionPage = () => {
  const { emotion } = useParams<{ emotion: string }>();
  const [poems, setPoems] = useState<PoemWithFavorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPoems = async () => {
    if (!emotion) return;
    setIsLoading(true);
    try {
      const data = await getPoemsWithFavoriteStatus({
        emotion: emotion,
        limit: 20
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
  }, [emotion]);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl xl:text-5xl font-bold gradient-text flex items-center justify-center gap-3 capitalize">
            <Sparkles className="w-10 h-10 text-primary" />
            {emotion} Poetry
          </h1>
          <p className="text-lg text-muted-foreground">
            Explore poems expressing {emotion}
          </p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader><Skeleton className="h-6 w-32 bg-muted" /></CardHeader>
                <CardContent className="space-y-4">
                  <Skeleton className="h-32 w-full bg-muted" />
                  <Skeleton className="h-10 w-full bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && poems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              No poems found for this emotion yet. Be the first to create one!
            </p>
          </div>
        )}

        {!isLoading && poems.length > 0 && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {poems.map((poem) => (
              <PoemCard key={poem.id} poem={poem} onFavoriteChange={loadPoems} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmotionPage;