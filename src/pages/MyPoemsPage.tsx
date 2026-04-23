import { useEffect, useState } from 'react';
import { Feather } from 'lucide-react';
import { PoemCard } from '@/components/poetry/PoemCard';
import { getUserPoems } from '@/db/api';
import type { Poem } from '@/types/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const MyPoemsPage = () => {
  const [poems, setPoems] = useState<Poem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPoems = async () => {
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
    loadPoems();
  }, []);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl xl:text-5xl font-bold gradient-text flex items-center justify-center gap-3">
            <Feather className="w-10 h-10 text-primary" />
            My Poems
          </h1>
          <p className="text-lg text-muted-foreground">
            Your personal collection of generated poetry
          </p>
        </div>

        {isLoading && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32 bg-muted" />
                </CardHeader>
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
              You haven't generated any poems yet. Start creating your first masterpiece!
            </p>
          </div>
        )}

        {!isLoading && poems.length > 0 && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {poems.map((poem) => (
              <PoemCard 
                key={poem.id} 
                poem={poem} 
                onFavoriteChange={loadPoems}
                onDelete={loadPoems}
                showDelete={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPoemsPage;
