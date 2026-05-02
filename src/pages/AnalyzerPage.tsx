import { useState } from 'react';
import { 
  Search, Loader2, Feather, ScrollText, ShieldCheck, 
  Copy, Sparkles, BookOpen, Languages, Share2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { analyzePoem } from '@/services/llm';
import { toast } from 'sonner';

export const AnalyzerPage = () => {
  const [content, setContent] = useState('');
  const [language, setLanguage] = useState('bengali');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!content.trim()) {
      toast.error('The Maestro needs verses to begin the critique.');
      return;
    }
    setIsAnalyzing(true);
    try {
      const result = await analyzePoem(content, language);
      setAnalysis(result);
      toast.success('The evaluation is complete! ✨');
    } catch (error) {
      console.error(error);
      toast.error('Analysis failed. Check your Gemini API connection.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopy = () => {
    if (analysis) {
      navigator.clipboard.writeText(analysis);
      toast.success('Critique copied to parchment.');
    }
  };

  return (
    <div className="min-h-screen py-16 px-4 xl:px-8 bg-gradient-to-b from-background to-background/90 relative overflow-x-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[500px] bg-primary/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        <header className="text-center space-y-6">
          <div className="flex items-center justify-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full border border-primary/20 shadow-xl">
              <Search className="w-10 h-10 text-primary animate-pulse" />
            </div>
            <h1 className="text-5xl xl:text-8xl font-black tracking-tighter gradient-text uppercase font-serif italic">
              Literary Analyzer
            </h1>
          </div>
          <p className="text-2xl text-warm-muted italic font-serif">
            "Deconstruct the soul of your writing with the precision of a master critic."
          </p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          {/* LEFT: Input Section */}
          <div className="xl:col-span-5 flex flex-col gap-6">
            <Card className="glass-card royal-frame bg-black/5 border-none shadow-2xl flex flex-col h-full">
              <CardHeader className="border-b border-primary/10 py-5 bg-primary/5">
                <CardTitle className="text-2xl font-serif italic text-primary flex items-center gap-3">
                  <Feather className="w-6 h-6" /> The Manuscript
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-8 space-y-6 flex-grow flex flex-col">
                <div className="relative group flex-grow">
                  <Textarea
                    placeholder="Type or paste your verses here. Let the Maestro see your soul..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[450px] resize-none !text-2xl md:!text-3xl font-serif italic bg-background/40 border-primary/20 focus:border-primary/50 rounded-2xl p-8 leading-relaxed shadow-inner transition-all placeholder:text-xl placeholder:text-warm-muted/20"
                  />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 items-end pt-4 border-t border-primary/10">
                  <div className="w-full sm:w-48 space-y-2 text-left">
                    <label className="text-[10px] uppercase font-bold text-primary/60 flex items-center gap-2 ml-1">
                      <Languages className="w-3 h-3" /> Language
                    </label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger className="h-12 bg-background/40 border-primary/20 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="z-[100] bg-popover border-primary/20">
                        <SelectItem value="bengali">Bengali</SelectItem>
                        <SelectItem value="urdu">Urdu</SelectItem>
                        <SelectItem value="hindi">Hindi</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    onClick={handleAnalyze} 
                    disabled={isAnalyzing}
                    className="w-full flex-grow btn-royal h-12 text-lg font-black uppercase tracking-widest rounded-xl shadow-lg"
                  >
                    {isAnalyzing ? (
                      <><Loader2 className="w-5 h-5 mr-3 animate-spin" /> Evaluating...</>
                    ) : (
                      <><Sparkles className="w-5 h-5 mr-3" /> Invoke Analysis</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT: Output Section */}
          <div className="xl:col-span-7 flex flex-col gap-6">
            <Card className="glass-card royal-frame bg-black/5 border-none shadow-2xl min-h-[600px] flex flex-col relative overflow-hidden">
              <CardHeader className="border-b border-primary/10 py-5 flex flex-row items-center justify-between bg-primary/5">
                <CardTitle className="text-2xl font-serif italic text-primary flex items-center gap-3">
                  <BookOpen className="w-6 h-6" /> Maestro's Critique
                </CardTitle>
                {analysis && (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={handleCopy} className="text-primary hover:bg-primary/10 rounded-full"><Copy className="w-4 h-4" /></Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="pt-10 flex-grow">
                {!analysis && !isAnalyzing && (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30 py-20">
                    <ScrollText className="w-24 h-24 text-primary" />
                    <p className="text-2xl font-serif italic">"Waiting for your words..."</p>
                  </div>
                )}
                {isAnalyzing && (
                  <div className="h-full flex flex-col items-center justify-center space-y-8 py-20">
                    <div className="w-20 h-20 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
                    <p className="text-xl italic text-primary animate-pulse font-serif">Deconstructing symbolism...</p>
                  </div>
                )}
                {analysis && !isAnalyzing && (
                  <div className="prose prose-invert max-w-none font-serif animate-in fade-in zoom-in duration-1000">
                    <div className="bg-primary/5 rounded-2xl p-8 border border-primary/10 whitespace-pre-wrap text-xl text-foreground/90 leading-loose adab-spacing text-left">
                      {analysis}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};