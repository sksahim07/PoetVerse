import { useState } from 'react';
import { Heart, Copy, Share2, Download, Music, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { toast } from 'sonner';
import type { PoemWithFavorite } from '@/types/types';
import { addFavorite, removeFavorite, deletePoem } from '@/db/api';

interface PoemCardProps {
  poem: PoemWithFavorite;
  onFavoriteChange?: () => void;
  onDelete?: () => void;
  showDelete?: boolean;
}

const languageLabels: Record<string, string> = {
  urdu: 'Urdu • اردو',
  roman_urdu: 'Roman Urdu',
  hindi: 'Hindi • हिन्दी',
  english: 'English',
  bengali: 'Bengali • বাংলা'
};

const poetryTypeLabels: Record<string, string> = {
  shayari: 'Shayari',
  ghazal: 'Ghazal',
  nazm: 'Nazm',
  song: 'Song',
  poem: 'Poem',
  couplet: 'Couplet'
};

export const PoemCard = ({ poem, onFavoriteChange, onDelete, showDelete = false }: PoemCardProps) => {
  const [isFavorited, setIsFavorited] = useState(poem.is_favorited || false);
  const [isLoading, setIsLoading] = useState(false);
  const [showMusicalNotes, setShowMusicalNotes] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(poem.content);
      toast.success('Poem copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy poem');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${poetryTypeLabels[poem.poetry_type]} - ${poem.emotion}`,
          text: poem.content
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      handleCopy();
      toast.success('Poem copied! Share it anywhere.');
    }
  };

  const handleDownload = () => {
    let content = poem.content;
    
    if (poem.musical_notes && poem.musical_notes.length > 0) {
      content += '\n\n--- Musical Notes ---\n';
      poem.musical_notes.forEach((note) => {
        content += `\n${note.line}\n→ ${note.note} - ${note.instrument} (${note.mood})\n`;
      });
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `poem-${poem.id.slice(0, 8)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Poem downloaded!');
  };

  const handleFavorite = async () => {
    setIsLoading(true);
    try {
      if (isFavorited) {
        const success = await removeFavorite(poem.id);
        if (success) {
          setIsFavorited(false);
          toast.success('Removed from favorites');
          onFavoriteChange?.();
        } else {
          toast.error('Failed to remove favorite');
        }
      } else {
        const result = await addFavorite(poem.id);
        if (result) {
          setIsFavorited(true);
          toast.success('Added to favorites');
          onFavoriteChange?.();
        } else {
          toast.error('Failed to add favorite');
        }
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this poem?')) {
      return;
    }

    setIsLoading(true);
    try {
      const success = await deletePoem(poem.id);
      if (success) {
        toast.success('Poem deleted successfully');
        onDelete?.();
      } else {
        toast.error('Failed to delete poem');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="card-elegant">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">
            {languageLabels[poem.language]}
          </Badge>
          <Badge variant="outline">
            {poetryTypeLabels[poem.poetry_type]}
          </Badge>
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
            {poem.emotion}
          </Badge>
          {poem.musical_notes && poem.musical_notes.length > 0 && (
            <Badge className="bg-accent/10 text-accent hover:bg-accent/20 gap-1">
              <Music className="w-3 h-3" />
              Musical Notes
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="poetry-text text-lg text-foreground min-h-32 whitespace-pre-wrap">
          {poem.content}
        </div>
        
        {poem.musical_notes && poem.musical_notes.length > 0 && (
          <Collapsible open={showMusicalNotes} onOpenChange={setShowMusicalNotes}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="w-full gap-2">
                <Music className="w-4 h-4" />
                {showMusicalNotes ? 'Hide' : 'Show'} Musical Notes
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4 space-y-3">
              <div className="text-sm font-medium text-muted-foreground mb-2">
                Musical Sur / Note Suggestions:
              </div>
              {poem.musical_notes.map((note, index) => (
                <div key={index} className="p-3 rounded-lg bg-muted/50 space-y-1">
                  <div className="text-sm italic text-foreground">
                    "{note.line}"
                  </div>
                  <div className="text-sm font-medium text-primary">
                    → {note.note} - {note.instrument}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Mood: {note.mood}
                  </div>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}
        
        <div className="text-xs text-muted-foreground">
          Generated by PoetVerse AI
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleFavorite}
            disabled={isLoading}
            className="gap-2"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-primary text-primary' : ''}`} />
            {isFavorited ? 'Favorited' : 'Favorite'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className="gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
          {showDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={isLoading}
              className="gap-2 text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};