import { useState } from 'react';
import { 
  Music, Loader2, Volume2, Mic2, Disc, Play, Guitar, Info, Sparkles, ListMusic 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { generateMusicalNotes } from '@/services/llm';
import { toast } from 'sonner';

// Type definition for our new JSON structure
interface MusicalAnalysis {
  core_identity: {
    raag: string;
    taal_tempo: string;
    instruments: string;
  };
  stanzas: Array<{
    lyrics_snippet: string;
    mood_shift: string;
    swaras: string;
    vocals: string;
  }>;
  maestro_notes: string;
  attraction_points: string;
}

const SurSuggestionPage = () => {
  const [content, setContent] = useState('');
  const [outputLanguage, setOutputLanguage] = useState('English');
  const [suggestion, setSuggestion] = useState<MusicalAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSuggest = async () => {
    if (!content.trim()) {
      toast.error('The music needs lyrics to flow, Sahim.');
      return;
    }
    
    setIsLoading(true);
    setSuggestion(null); 
    try {
      const result = await generateMusicalNotes(content, "melodic", outputLanguage);
      setSuggestion(result);
      toast.success('The Maestro has delivered the blueprint! 🎶');
    } catch (error) {
      console.error('Sur error:', error);
      toast.error('The melody was lost in the void. (Check console for JSON error)');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Added pb-32 so the bottom doesn't get cut off when scrolling
    <div className="min-h-screen py-16 px-4 xl:px-8 pb-32 bg-gradient-to-b from-background to-background/90 relative overflow-x-hidden">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[600px] bg-primary/5 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute -top-20 -right-20 opacity-5 rotate-12 pointer-events-none">
        <Music className="w-96 h-96 text-primary" />
      </div>

      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        
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

        <Card className="glass-card royal-frame border-none shadow-2xl bg-black/5 dark:bg-black/20">
          <CardHeader className="border-b border-primary/10 py-6 bg-primary/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="text-3xl font-serif italic text-primary flex items-center gap-4">
              <Disc className="w-8 h-8 animate-spin-slow text-primary/60" /> Breathe Music into Verses
            </CardTitle>
            
            {/* Language Selector */}
            <div className="w-full sm:w-48 z-50">
              <Select value={outputLanguage} onValueChange={setOutputLanguage}>
                <SelectTrigger className="bg-background/40 border-primary/20 h-12">
                  <SelectValue placeholder="Output Language" />
                </SelectTrigger>
                <SelectContent className="bg-black/95 backdrop-blur-2xl border-primary/20 z-[9999]">
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Bengali">Bengali</SelectItem>
                  <SelectItem value="Hindi">Hindi</SelectItem>
                  <SelectItem value="Hinglish">Hinglish</SelectItem>
                  <SelectItem value="Roman Urdu">Roman Urdu</SelectItem>
                  <SelectItem value="Urdu">Urdu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          
          <CardContent className="pt-10 space-y-8">
            <Textarea
              placeholder="Paste your lyrics or poem here to find its musical soul..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-64 resize-none !text-2xl md:!text-3xl font-serif italic bg-background/40 border-primary/20 focus:border-primary/50 rounded-2xl p-10 leading-relaxed shadow-inner placeholder:text-warm-muted/20"
            />

            <Button 
              onClick={handleSuggest} 
              disabled={isLoading}
              className="w-full btn-royal h-20 text-2xl md:text-3xl font-black uppercase tracking-[0.2em] rounded-2xl shadow-2xl active:scale-[0.98] transition-all"
            >
              {isLoading ? (
                <><Loader2 className="w-8 h-8 mr-4 animate-spin" /> Tuning Raag...</>
              ) : (
                <><Volume2 className="w-8 h-8 mr-4" /> Invoke Musical Analysis</>
              )}
            </Button>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="py-20 text-center space-y-6 animate-in fade-in">
            <div className="flex justify-center gap-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="w-2 h-16 bg-primary/60 rounded-full animate-music-bar shadow-[0_0_15px_rgba(212,175,55,0.5)]" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
            <p className="text-2xl italic text-primary font-serif">Composing the sonic architecture...</p>
          </div>
        )}

        {suggestion && !isLoading && (
          <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000 space-y-8">
            
            {/* Core Identity Box */}
            <Card className="glass-card royal-frame bg-primary/5 border-primary/20">
              <CardHeader className="border-b border-primary/10 bg-black/20">
                <CardTitle className="text-primary flex items-center gap-3 text-2xl uppercase tracking-widest"><Play className="w-6 h-6" /> Core Identity</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-black/40 p-6 rounded-xl border border-primary/10">
                  <h4 className="text-primary/60 text-xs uppercase font-bold mb-2">Primary Raag</h4>
                  <p className="text-xl font-serif text-foreground/90">{suggestion.core_identity.raag}</p>
                </div>
                <div className="bg-black/40 p-6 rounded-xl border border-primary/10">
                  <h4 className="text-primary/60 text-xs uppercase font-bold mb-2">Taal & Tempo</h4>
                  <p className="text-xl font-serif text-foreground/90">{suggestion.core_identity.taal_tempo}</p>
                </div>
                <div className="bg-black/40 p-6 rounded-xl border border-primary/10">
                  <h4 className="text-primary/60 text-xs uppercase font-bold mb-2">Instrumentation</h4>
                  <p className="text-xl font-serif text-foreground/90">{suggestion.core_identity.instruments}</p>
                </div>
              </CardContent>
            </Card>

            {/* Attraction Points (The Hook) */}
            <Card className="glass-card border-primary/30 shadow-[0_0_30px_rgba(212,175,55,0.1)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none"><Sparkles className="w-32 h-32 text-primary" /></div>
              <CardContent className="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center">
                <div className="p-5 bg-primary/10 rounded-full shrink-0">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl text-primary uppercase tracking-widest font-bold mb-4">The Hook (Attraction Points)</h3>
                  <p className="text-2xl font-serif italic text-foreground/90 leading-relaxed adab-spacing">{suggestion.attraction_points}</p>
                </div>
              </CardContent>
            </Card>

            {/* Stanza Breakdown */}
            <Card className="glass-card border-none bg-black/20">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-3 text-2xl uppercase tracking-widest"><ListMusic className="w-6 h-6" /> Stanza Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {suggestion.stanzas.map((stanza, idx) => (
                  <div key={idx} className="bg-black/40 border border-primary/10 rounded-2xl p-6 md:p-8 hover:border-primary/30 transition-colors">
                    <div className="mb-6 inline-block bg-primary/10 px-4 py-2 rounded-lg border border-primary/20">
                      <p className="text-lg text-primary font-serif italic">"{stanza.lyrics_snippet}..."</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="text-primary/60 text-[10px] uppercase font-bold mb-1">Mood Shift</h4>
                        <p className="text-foreground/80 font-serif text-lg">{stanza.mood_shift}</p>
                      </div>
                      <div>
                        <h4 className="text-primary/60 text-[10px] uppercase font-bold mb-1">Melodic Movement</h4>
                        <p className="text-foreground/80 font-serif text-lg">{stanza.swaras}</p>
                      </div>
                      <div>
                        <h4 className="text-primary/60 text-[10px] uppercase font-bold mb-1">Vocal Dynamics</h4>
                        <p className="text-foreground/80 font-serif text-lg">{stanza.vocals}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Maestro Notes */}
            <Card className="glass-card royal-frame bg-primary/5">
              <CardContent className="p-8 md:p-10 flex gap-6">
                <Info className="w-8 h-8 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl text-primary uppercase tracking-widest font-bold mb-4">Director's Note</h3>
                  <p className="text-xl md:text-2xl font-serif text-foreground/80 leading-relaxed">{suggestion.maestro_notes}</p>
                </div>
              </CardContent>
            </Card>

          </div>
        )}
      </div>
    </div>
  );
};

export default SurSuggestionPage;