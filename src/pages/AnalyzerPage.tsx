import { useState } from 'react';
import { ShieldCheck, Sparkles, Loader2, FileSearch, Lock, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { analyzePoetry, type AnalysisRequest } from '@/services/llm';

const formSchema = z.object({
  text: z.string().min(10, 'Please enter at least 10 characters to analyze'),
  analysisLanguage: z.enum(['english', 'hindi', 'urdu', 'bengali', 'hinglish']),
});

export const AnalyzerPage = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
      analysisLanguage: 'hinglish',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsAnalyzing(true);
    setAnalysisResult('');

    try {
      await analyzePoetry(values as AnalysisRequest, (chunk) => {
        setAnalysisResult((prev) => prev + chunk);
      });
      toast.success('Analysis complete! ✨');
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error('Failed to analyze. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 xl:px-8">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3">
            <FileSearch className="w-10 h-10 text-primary" />
            <h1 className="text-4xl xl:text-5xl font-bold gradient-text">
              Poetry & Writing Analyzer
            </h1>
          </div>
          <p className="text-lg text-warm-muted">
            Get professional-level evaluation, deep meaning, symbolism, and word-by-word analysis for your poetry, lyrics, or scripts.
          </p>
        </div>

        {/* Privacy Notice Card */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 max-w-4xl mx-auto flex items-start gap-4">
          <div className="p-3 bg-primary/10 rounded-full shrink-0">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-ivory mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-success" /> 100% Privacy Protection
            </h3>
            <p className="text-warm-muted text-sm leading-relaxed">
              No user's poem, song, lyrics, or writing will ever appear on any homepage or public feed. 
              There is no sharing, publishing, or displaying of your content. We guarantee complete privacy 
              for all user writings. The AI does not use your content for public training.
            </p>
          </div>
        </div>

        {/* Split Screen Layout - Fixed Height for Side-by-Side Scrolling */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          
          {/* Left Column: Input Form */}
          <Card className="glass-card royal-frame flex flex-col h-[750px]">
            <CardHeader className="shrink-0 pb-4">
              <CardTitle className="text-2xl gold-accent">Your Masterpiece</CardTitle>
              <CardDescription className="text-warm-muted">
                Paste your Shayari, Ghazal, Poem, Song Lyrics, or Script here.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col min-h-0">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 flex flex-col space-y-4">
                  
                  <FormField
                    control={form.control}
                    name="text"
                    render={({ field }) => (
                      <FormItem className="flex-1 flex flex-col min-h-0">
                        <FormControl className="flex-1 flex flex-col min-h-0">
                          <Textarea
                            placeholder="Paste your writing here to uncover its deepest meanings..."
                            className="flex-1 resize-none text-lg poetry-text placeholder-elegant bg-background/50 border-primary/20 focus:border-primary"
                            disabled={isAnalyzing}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="shrink-0 space-y-4 pt-2 border-t border-primary/10">
                    <FormField
                      control={form.control}
                      name="analysisLanguage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-ivory">Explain Meaning In</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-background/50 border-primary/20 text-ivory h-12 text-md">
                                <SelectValue placeholder="Select language for analysis" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="hinglish">Hinglish (Hindi + English mix)</SelectItem>
                              <SelectItem value="english">English</SelectItem>
                              <SelectItem value="hindi">Hindi</SelectItem>
                              <SelectItem value="urdu">Urdu</SelectItem>
                              <SelectItem value="bengali">Bengali</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full btn-royal h-14 text-xl"
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                          Analyzing Deep Meanings...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-6 h-6 mr-2" />
                          Deep Analyze
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Right Column: Output / Result */}
          <Card className="glass-card royal-frame flex flex-col h-[750px]">
            <CardHeader className="border-b border-primary/20 pb-6 shrink-0">
              <CardTitle className="text-2xl gold-accent flex items-center gap-2">
                <BookOpen className="w-6 h-6" /> Literary Analysis
              </CardTitle>
              <CardDescription className="text-warm-muted">
                Word-by-word meaning, emotional depth, and hidden symbolism.
              </CardDescription>
            </CardHeader>
            
            {/* The scrollable area for the result */}
            <CardContent className="pt-6 flex-1 overflow-y-auto">
              {analysisResult ? (
                <div className="poetry-text text-lg text-ivory whitespace-pre-wrap leading-relaxed pb-8">
                  {analysisResult}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-warm-muted/50 text-center space-y-4">
                  <FileSearch className="w-16 h-16 opacity-50" />
                  <p className="text-lg">Your deep literary analysis will appear here.<br/>Waiting for your words...</p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
};