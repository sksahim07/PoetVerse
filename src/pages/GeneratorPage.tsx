import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sparkles, Loader2, Settings2, Music, Feather, ScrollText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { generatePoem, generateMusicalNotes } from '@/services/llm';
import { createPoem } from '@/db/api';
import { PoemCard } from '@/components/poetry/PoemCard';
import type { PoemWithFavorite } from '@/types/types';

const formSchema = z.object({
  language: z.enum(['urdu', 'hindi', 'english', 'bengali', 'roman_urdu']),
  emotion: z.string().min(1, 'Please select an emotion'),
  poetry_type: z.enum(['shayari', 'ghazal', 'nazm', 'song', 'poem', 'couplet']),
  user_message: z.string().optional(),
  mood: z.string().optional(),
  target_person: z.string().optional(),
  line_length: z.enum(['short', 'medium', 'long']).optional(),
  rhyme_style: z.enum(['no_rhyme', 'soft_rhyme', 'strong_rhyme', 'internal_rhyme']).optional(),
  word_difficulty: z.enum(['simple', 'poetic', 'classical']).optional(),
  tone_filter: z.enum(['classical', 'sufi', 'modern', 'dark', 'soft_romantic', 'bollywood', 'old_school_ghazal', 'rap', 'romantic']).optional(),
  emotion_level: z.enum(['surface', 'deep', 'very_deep', 'painfully_honest']).optional(),
  flow_style: z.enum(['slow', 'smooth', 'dramatic']).optional(),
  add_musical_notes: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const GeneratorPage = () => {
  const [searchParams] = useSearchParams();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPoem, setGeneratedPoem] = useState<PoemWithFavorite | null>(null);
  const [streamingText, setStreamingText] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language: 'bengali',
      emotion: 'love',
      poetry_type: 'poem',
      user_message: '',
      mood: '',
      target_person: '',
      line_length: 'medium',
      rhyme_style: 'soft_rhyme',
      word_difficulty: 'poetic',
      tone_filter: undefined,
      emotion_level: 'deep',
      flow_style: 'smooth',
      add_musical_notes: false,
    },
  });

  useEffect(() => {
    const lang = searchParams.get('language');
    const emotion = searchParams.get('emotion');
    const type = searchParams.get('type');
    if (lang) form.setValue('language', lang as any);
    if (emotion) form.setValue('emotion', emotion);
    if (type) form.setValue('poetry_type', type as any);
  }, [searchParams, form]);

  const onSubmit = async (values: FormValues) => {
    setIsGenerating(true);
    setGeneratedPoem(null);
    setStreamingText('');

    try {
      const fullText = await generatePoem(values, (chunk) => setStreamingText(p => p + chunk));
      let musicalNotes = undefined;
      if (values.add_musical_notes) {
        toast.info('The Maestro is assigning Sur and Raag...');
        musicalNotes = await generateMusicalNotes(fullText, values.emotion);
      }
      const savedPoem = await createPoem({ ...values, content: fullText, musical_notes: musicalNotes });
      if (savedPoem) {
        setGeneratedPoem({ ...savedPoem, is_favorited: false });
        toast.success('Verses bound to eternity! ✨');
      }
    } catch (error) {
      console.error(error);
      toast.error('The Muse vanished.');
    } finally {
      setIsGenerating(false);
      setStreamingText('');
    }
  };

  const emotions = ['love', 'sad', 'heartbreak', 'attitude', 'spiritual', 'friendship', 'motivation', 'romantic', 'hope', 'loneliness'];

  return (
    <div className="min-h-screen py-16 px-4 xl:px-8 bg-gradient-to-b from-background to-background/90 relative overflow-visible">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[500px] bg-primary/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto space-y-6 relative z-10 overflow-visible">
        
        <header className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className="p-3 bg-primary/10 rounded-full border border-primary/20 glow-gold">
              <Feather className="w-10 h-10 text-primary animate-float" />
            </div>
            <h1 className="text-5xl xl:text-8xl font-black tracking-tighter gradient-text uppercase font-serif">
              Master's Studio
            </h1>
          </div>
        </header>

        <Card className="glass-card royal-frame border-none shadow-2xl bg-black/5 dark:bg-black/20 overflow-visible">
          <CardHeader className="border-b border-primary/10 py-5 bg-primary/5 overflow-visible">
            <CardTitle className="text-3xl font-serif italic text-primary flex items-center gap-3">
              <ScrollText className="w-8 h-8" /> Craft Your Verse
            </CardTitle>
          </CardHeader>
          
          <CardContent className="pt-6 pb-8 space-y-8 overflow-visible">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 overflow-visible">
                
                <FormField
                  control={form.control}
                  name="user_message"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-primary text-[11px] uppercase tracking-[0.2em] font-bold ml-1">The Spark of Inspiration</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="What whispers to your heart? A lost memory, a silent love..."
                          className="min-h-40 resize-none text-2xl md:text-3xl font-serif italic poetry-text bg-background/40 border-primary/20 focus:border-primary/50 focus:ring-primary/5 rounded-xl p-8 shadow-inner transition-all leading-relaxed placeholder:text-xl placeholder:text-warm-muted/30"
                          {...field}
                          disabled={isGenerating}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-[50] overflow-visible">
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem className="relative z-[53]">
                        <FormLabel className="text-primary text-[10px] uppercase font-bold ml-1">Tongue</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={isGenerating}>
                          <FormControl><SelectTrigger className="h-12 border-primary/20 bg-background/40"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent className="z-[200] bg-popover/98 backdrop-blur-2xl border-primary/20 shadow-2xl">
                            <SelectItem value="bengali">Bengali • বাংলা</SelectItem>
                            <SelectItem value="urdu">Urdu • اردو</SelectItem>
                            <SelectItem value="roman_urdu">Roman Urdu</SelectItem>
                            <SelectItem value="hindi">Hindi • हिन्दी</SelectItem>
                            <SelectItem value="english">English</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="poetry_type"
                    render={({ field }) => (
                      <FormItem className="relative z-[52]">
                        <FormLabel className="text-primary text-[10px] uppercase font-bold ml-1">Form</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={isGenerating}>
                          <FormControl><SelectTrigger className="h-12 border-primary/20 bg-background/40"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent className="z-[200] bg-popover/98 backdrop-blur-2xl border-primary/20 shadow-2xl">
                            <SelectItem value="ghazal">Ghazal</SelectItem>
                            <SelectItem value="shayari">Shayari</SelectItem>
                            <SelectItem value="nazm">Nazm</SelectItem>
                            <SelectItem value="poem">Classic Poem</SelectItem>
                            <SelectItem value="song">Musical Song</SelectItem>
                            <SelectItem value="couplet">Couplet</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="emotion"
                    render={({ field }) => (
                      <FormItem className="relative z-[51]">
                        <FormLabel className="text-primary text-[10px] uppercase font-bold ml-1">Essence</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={isGenerating}>
                          <FormControl><SelectTrigger className="h-12 border-primary/20 bg-background/40 capitalize"><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent className="z-[200] bg-popover/98 backdrop-blur-2xl border-primary/20 shadow-2xl max-h-64">
                            {emotions.map(e => (
                              <SelectItem key={e} value={e} className="capitalize">{e}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced} className="overflow-visible">
                  <CollapsibleTrigger asChild>
                    <Button type="button" variant="outline" className="w-full h-12 border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 gap-2 font-serif italic text-lg rounded-xl transition-all">
                      <Settings2 className="w-5 h-5" />
                      {showAdvanced ? 'Seal the Chamber' : 'Invoke Master Controls'}
                    </Button>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent className="mt-6 p-8 rounded-2xl bg-black/10 dark:bg-black/50 border border-primary/10 space-y-8 animate-in fade-in zoom-in duration-500 overflow-visible relative z-[40]">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-visible">
                      <FormField
                        control={form.control}
                        name="line_length"
                        render={({ field }) => (
                          <FormItem className="relative z-[49]">
                            <FormLabel className="text-[9px] uppercase font-bold text-warm-muted ml-1">Length</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl><SelectTrigger className="bg-background/30 h-10"><SelectValue /></SelectTrigger></FormControl>
                              <SelectContent className="z-[110] bg-popover border-primary/10 shadow-2xl">
                                <SelectItem value="short">Short</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="long">Long</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="word_difficulty"
                        render={({ field }) => (
                          <FormItem className="relative z-[48]">
                            <FormLabel className="text-[9px] uppercase font-bold text-warm-muted ml-1">Lexicon</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl><SelectTrigger className="bg-background/30 h-10"><SelectValue /></SelectTrigger></FormControl>
                              <SelectContent className="z-[110] bg-popover border-primary/10 shadow-2xl">
                                <SelectItem value="simple">Simple</SelectItem><SelectItem value="poetic">Poetic</SelectItem><SelectItem value="classical">Classical</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="emotion_level"
                        render={({ field }) => (
                          <FormItem className="relative z-[47]">
                            <FormLabel className="text-[9px] uppercase font-bold text-warm-muted ml-1">Depth</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl><SelectTrigger className="bg-background/30 h-10"><SelectValue /></SelectTrigger></FormControl>
                              <SelectContent className="z-[110] bg-popover border-primary/10 shadow-2xl">
                                <SelectItem value="surface">Surface</SelectItem><SelectItem value="deep">Deep</SelectItem><SelectItem value="painfully_honest">Raw</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="tone_filter"
                        render={({ field }) => (
                          <FormItem className="relative z-[46]">
                            <FormLabel className="text-[9px] uppercase font-bold text-warm-muted ml-1">Aesthetic</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl><SelectTrigger className="bg-background/30 h-10"><SelectValue placeholder="Original" /></SelectTrigger></FormControl>
                              <SelectContent className="z-[110] bg-popover border-primary/10 shadow-2xl">
                                <SelectItem value="classical">Classical</SelectItem><SelectItem value="sufi">Sufism</SelectItem><SelectItem value="modern">Modern</SelectItem><SelectItem value="dark">Dark</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={form.control}
                        name="mood"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[9px] uppercase font-bold text-warm-muted ml-1">Ambience</FormLabel>
                            <FormControl><Input placeholder="Rainy, Midnight..." className="bg-background/30 h-10 rounded-lg border-primary/10 text-lg" {...field} /></FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="target_person"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[9px] uppercase font-bold text-warm-muted ml-1">Recipient</FormLabel>
                            <FormControl><Input placeholder="A lost lover..." className="bg-background/30 h-10 rounded-lg border-primary/10 text-lg" {...field} /></FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="add_musical_notes"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center gap-4 space-y-0 p-3 rounded-xl border border-primary/10 bg-primary/5 mt-3 group hover:border-primary/40 transition-all cursor-pointer relative z-[10]">
                            <FormControl><input type="checkbox" checked={field.value} onChange={field.onChange} className="w-6 h-6 rounded accent-primary cursor-pointer" /></FormControl>
                            <FormLabel className="flex items-center gap-2 text-primary font-bold text-sm cursor-pointer"><Music className="w-4 h-4" /> Assign Sur</FormLabel>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Button type="submit" className="w-full btn-royal h-16 text-2xl font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl active:scale-[0.98] transition-all relative z-[5]" disabled={isGenerating}>
                  {isGenerating ? <><Loader2 className="w-8 h-8 mr-4 animate-spin" /> Manifesting...</> : <><Sparkles className="w-8 h-8 mr-4" /> Command The Quill</>}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {isGenerating && streamingText && (
          <Card className="glass-card royal-frame animate-in fade-in slide-in-from-bottom-10 duration-700 bg-black/10 border-none shadow-inner">
            <CardHeader className="border-b border-primary/10 py-4"><CardTitle className="flex items-center gap-4 text-primary font-serif italic text-3xl"><Feather className="w-8 h-8 animate-pulse" /> The Quill is Dancing...</CardTitle></CardHeader>
            <CardContent className="py-12"><div className="poetry-text text-3xl text-foreground whitespace-pre-wrap leading-[1.8] adab-spacing text-center max-w-3xl mx-auto italic">{streamingText}</div></CardContent>
          </Card>
        )}

        {generatedPoem && !isGenerating && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 pt-6 pb-12">
            <PoemCard poem={generatedPoem} />
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneratorPage;