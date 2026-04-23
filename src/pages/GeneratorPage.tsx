import { useState } from 'react';
import { Sparkles, Loader2, Settings2, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
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
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPoem, setGeneratedPoem] = useState<PoemWithFavorite | null>(null);
  const [streamingText, setStreamingText] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language: 'english',
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

  const onSubmit = async (values: FormValues) => {
    setIsGenerating(true);
    setGeneratedPoem(null);
    setStreamingText('');

    try {
      const fullText = await generatePoem(
        {
          language: values.language,
          emotion: values.emotion,
          poetry_type: values.poetry_type,
          mood: values.mood,
          target_person: values.target_person,
          line_length: values.line_length,
          rhyme_style: values.rhyme_style,
          word_difficulty: values.word_difficulty,
          tone_filter: values.tone_filter,
          emotion_level: values.emotion_level,
          flow_style: values.flow_style,
          user_message: values.user_message,
        },
        (chunk) => {
          setStreamingText((prev) => prev + chunk);
        }
      );

      let musicalNotes = undefined;
      if (values.add_musical_notes) {
        toast.info('Generating musical notes...');
        musicalNotes = await generateMusicalNotes(fullText, values.emotion);
      }

      const savedPoem = await createPoem({
        content: fullText,
        language: values.language,
        emotion: values.emotion,
        poetry_type: values.poetry_type,
        line_length: values.line_length,
        rhyme_style: values.rhyme_style,
        word_difficulty: values.word_difficulty,
        tone_filter: values.tone_filter,
        emotion_level: values.emotion_level,
        flow_style: values.flow_style,
        musical_notes: musicalNotes,
      });

      if (savedPoem) {
        setGeneratedPoem({ ...savedPoem, is_favorited: false });
        toast.success('Poetry created with love! ✨');
      } else {
        toast.error('Failed to save poem');
      }
    } catch (error) {
      console.error('Error generating poem:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsGenerating(false);
      setStreamingText('');
    }
  };

  const emotions = [
    'love', 'sad', 'heartbreak', 'attitude', 'spiritual',
    'friendship', 'motivation', 'romantic', 'inspirational', 'melancholy',
    'loneliness', 'hope', 'emptiness', 'excitement', 'confusion'
  ];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl xl:text-5xl font-bold gradient-text flex items-center justify-center gap-3">
            <Sparkles className="w-10 h-10 text-primary" />
            Poetry Generator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Share your feelings, and I'll transform them into beautiful poetry. 
            I'm here to understand and express your emotions through the art of verse. ✨
          </p>
        </div>

        <Card className="card-elegant">
          <CardHeader>
            <CardTitle>Tell Me Your Feelings</CardTitle>
            <CardDescription>
              Express yourself freely - I'm here to listen and create poetry that resonates with your heart
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="user_message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Message (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell me what's on your mind... your feelings, your story, your emotions..."
                          className="min-h-24 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Share your thoughts in any language - I understand Hindi, Urdu, Bengali, Hinglish, and English
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="language"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Poetry Language</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="urdu">Urdu • اردو</SelectItem>
                            <SelectItem value="roman_urdu">Roman Urdu (English Pronunciation)</SelectItem>
                            <SelectItem value="hindi">Hindi • हिन्दी</SelectItem>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="bengali">Bengali • বাংলা</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="poetry_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Poetry Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select poetry type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="shayari">Shayari</SelectItem>
                            <SelectItem value="ghazal">Ghazal</SelectItem>
                            <SelectItem value="nazm">Nazm</SelectItem>
                            <SelectItem value="song">Full-Length Song</SelectItem>
                            <SelectItem value="poem">Poem</SelectItem>
                            <SelectItem value="couplet">Couplet</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="emotion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emotion / Theme</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an emotion" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {emotions.map((emotion) => (
                              <SelectItem key={emotion} value={emotion}>
                                {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="target_person"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>For Whom (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., my beloved, a friend, myself"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
                  <CollapsibleTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full gap-2"
                    >
                      <Settings2 className="w-4 h-4" />
                      {showAdvanced ? 'Hide' : 'Show'} Advanced Customization
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="line_length"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Line Length</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="short">Short</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="long">Long</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="rhyme_style"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rhyme Style</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="no_rhyme">No Rhyme - Free Verse</SelectItem>
                                <SelectItem value="soft_rhyme">Soft Rhyme - Subtle & Natural</SelectItem>
                                <SelectItem value="strong_rhyme">Strong Rhyme - Clear & Consistent</SelectItem>
                                <SelectItem value="internal_rhyme">Internal Rhyme - Within Lines</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="word_difficulty"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Word Difficulty</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="simple">Simple</SelectItem>
                                <SelectItem value="poetic">Poetic</SelectItem>
                                <SelectItem value="classical">Classical</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="emotion_level"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Emotion Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="surface">Surface - Light & Accessible</SelectItem>
                                <SelectItem value="deep">Deep - Layered Meaning</SelectItem>
                                <SelectItem value="very_deep">Very Deep - Philosophical</SelectItem>
                                <SelectItem value="painfully_honest">Painfully Honest - Raw Truth</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="flow_style"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Flow</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="slow">Slow</SelectItem>
                                <SelectItem value="smooth">Smooth</SelectItem>
                                <SelectItem value="dramatic">Dramatic</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tone_filter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tone / Style (Optional)</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a tone" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="classical">Classical - Mir, Ghalib, Faiz</SelectItem>
                                <SelectItem value="sufi">Sufi - Mystical & Spiritual</SelectItem>
                                <SelectItem value="modern">Modern - Contemporary</SelectItem>
                                <SelectItem value="dark">Dark - Melancholic & Gothic</SelectItem>
                                <SelectItem value="soft_romantic">Soft Romantic - Gentle & Tender</SelectItem>
                                <SelectItem value="bollywood">Bollywood</SelectItem>
                                <SelectItem value="old_school_ghazal">Old-school Ghazal</SelectItem>
                                <SelectItem value="rap">Rap</SelectItem>
                                <SelectItem value="romantic">Romantic</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="add_musical_notes"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={field.onChange}
                              className="w-4 h-4 rounded border-input"
                            />
                          </FormControl>
                          <FormLabel className="!mt-0 flex items-center gap-2">
                            <Music className="w-4 h-4" />
                            Add Musical Notes / Sur Suggestions
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </CollapsibleContent>
                </Collapsible>

                <Button
                  type="submit"
                  className="w-full gap-2"
                  disabled={isGenerating}
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating your poetry...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate Poetry
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {isGenerating && streamingText && (
          <Card className="card-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                Crafting your poetry with care...
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="poetry-text text-lg text-foreground min-h-32 whitespace-pre-wrap">
                {streamingText}
              </div>
            </CardContent>
          </Card>
        )}

        {generatedPoem && !isGenerating && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Your Poetry</h2>
            <PoemCard poem={generatedPoem} />
          </div>
        )}
      </div>
    </div>
  );
};

export default GeneratorPage;