import { useState } from 'react';
import { 
  Music, 
  Loader2, 
  Feather, 
  Sparkles, 
  Volume2, 
  Mic2, 
  ChevronRight,
  Disc,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { generateMusicalNotes } from '@/services/llm';
import { toast } from 'sonner';

const SurSuggestionPage = () => {
  const [content, setContent] = useState('');
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSuggest = async () => {
    if (!content.trim()) {
      toast.error('The music needs lyrics to flow, Sahim.');
      return;
    }
    
    setIsLoading(true);
    setSuggestion(null); // Clear previous suggestion
    try {
      const result = await generateMusicalNotes(content, "melodic");
      setSuggestion(result);
      toast.success('The Sur and Raag have been assigned! 🎶');
    } catch (error) {
      console.error('Sur error:', error);
      toast.error('The melody was lost in the void.');
    } finally {
      setIsLoading(false);
    }
  };

  // Simple parser to handle Markdown bold (**) and new lines
  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Replace **text** with bold span
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={i} className="mb-4 last:mb-0">
          {parts.map((part, j) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <span key={j} className="text-primary font-bold drop-shadow-sm">
                  {part.slice(2, -2)}
                </span>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="min-h-screen py-16 px-4 xl:px-8 bg-gradient-to-b from-background to-background/90 relative overflow-hidden">
      
      {/* Background Musical Notes Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[600px] bg-primary/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute -top-20 -right-20 opacity-5 rotate-12 pointer-events-none">
        <Music className="w-96 h-96 text-primary" />
      </div>

      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        
        {/* Elegant Header */}
        <header className="text-center space-y-6">
          <div className="flex items-center justify-center gap-4">
            <div className="p-4 bg-primary/10 rounded-full border border-primary/20 shadow-2xl">
              <Mic2 className="w-12 h-12 text-primary animate-float" />
            </div>
            <h1 className="text-5xl xl:text-8xl font-black tracking-tighter gradient-text uppercase font-serif italic">
              Sur Studio
            </h1>
          </div>
          <p className="text-2xl text-warm-muted italic font-serif">
            "Every verse has a hidden melody. Let the Maestro find the Raag in your words."
          </p>
        </header>

        {/* The Composition Canvas */}
        <Card className="glass-card royal-frame border-none shadow-2xl bg-black/5 dark:bg-black/20 overflow-visible">
          <CardHeader className="border-b border-primary/10 py-6 bg-primary/5">
            <CardTitle className="text-3xl font-serif italic text-primary flex items-center gap-4">
              <Disc className="w-8 h-8 animate-spin-slow text-primary/60" /> Breathe Music into Verses
            </CardTitle>
          </CardHeader>
          
          <CardContent className="pt-10 space-y-8">
            <div className="relative group">
              <Textarea
                placeholder="Paste your lyrics or poem here to find its musical soul..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-64 resize-none !text-2xl md:!text-3xl font-serif italic bg-background/40 border-primary/20 focus:border-primary/50 rounded-2xl p-10 leading-relaxed shadow-inner placeholder:text-xl placeholder:text-warm-muted/20"
              />
            </div>

            <Button 
              onClick={handleSuggest} 
              disabled={isLoading}
              className="w-full btn-royal h-20 text-3xl font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl active:scale-[0.98] transition-all"
            >
              {isLoading ? (
                <><Loader2 className="w-8 h-8 mr-4 animate-spin" /> Tuning Raag...</>
              ) : (
                <><Volume2 className="w-8 h-8 mr-4" /> Invoke Musical Analysis</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Suggestion Result Display */}
        {(suggestion || isLoading) && (
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 max-w-4xl mx-auto pt-8">
            <Card className="glass-card royal-frame border-none bg-black/40 p-8 md:p-12 text-left space-y-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
              
              {isLoading ? (
                <div className="py-12 space-y-6 text-center">
                  <div className="flex justify-center gap-4">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="w-1.5 h-12 bg-primary/40 rounded-full animate-music-bar" style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                  <p className="text-xl italic text-primary/60 font-serif">Composing the sonic architecture...</p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center gap-4 text-center">
                    <div className="bg-primary/20 p-4 rounded-full">
                       <Play className="w-8 h-8 text-primary fill-primary" />
                    </div>
                    <h3 className="text-sm uppercase tracking-[0.5em] font-bold text-primary">The Assigned Melody</h3>
                  </div>
                  
                  {/* Formatted Content Area */}
                  <div className="max-w-none font-serif italic text-xl md:text-2xl text-foreground/90 leading-relaxed adab-spacing text-center md:text-left">
                    {renderFormattedText(suggestion!)}
                  </div>

                  <div className="pt-8 flex flex-wrap justify-center gap-8 text-[10px] font-bold uppercase tracking-widest text-primary/40">
                    <span className="flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Raag Alignment</span>
                    <span className="flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Tempo Mapping</span>
                    <span className="flex items-center gap-2"><ChevronRight className="w-3 h-3" /> Emotional Scale</span>
                  </div>
                </>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default SurSuggestionPage;