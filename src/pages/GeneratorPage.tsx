import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { 
  Sparkles, Loader2, Settings2, Music, Feather, ScrollText, 
  Coins, Copy, Check, Download, Send, RefreshCw, User, Bot, Sparkle
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';

import { generatePoem, generateMusicalNotes, continuePoemConversation } from '@/services/llm';
import { createPoem, addCredits } from '@/db/api';
import { getPoetDNA } from '@/services/poetDNA';
import { useAuth } from '@/contexts/AuthContext';
import { usePoemStore } from '@/store/usePoemStore';

/* =========================================================
   📊 COMPREHENSIVE ZOD SCHEMA (DNA PARAMETERS)
========================================================= */
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
  literary_style: z.enum(['cinematic_poetic', 'classical_antique', 'modern_minimalist', 'abstract_surreal']).optional(),
  creativity_level: z.enum(['conservative', 'balanced', 'high', 'radical_chaos']).optional(),
  metaphor_density: z.enum(['none', 'sparse', 'balanced', 'heavy_layered']).optional(),
  philosophical_depth: z.enum(['none', 'shallow', 'medium', 'existential_void']).optional(),
  realism_level: z.enum(['magical_realism', 'raw_realism', 'romanticized']).optional(),
  uniqueness_level: z.enum(['standard', 'high', 'very_high', 'unprecedented']).optional(),
  sensory_details: z.enum(['visual', 'auditory', 'tactile', 'all_sensory']).optional(),
  poetic_device_focus: z.enum(['alliteration', 'assonance', 'personification', 'enjambment', 'immersive_imagery']).optional(),
  atmosphere_type: z.enum(['cinematic', 'gothic_dark', 'dreamlike', 'melancholic', 'ethereal']).optional(),
  ending_impact: z.enum(['abrupt_silence', 'resolved_peace', 'emotionally_haunting', 'philosophical_question']).optional()
});

type FormValues = z.infer<typeof formSchema>;

const GeneratorPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // UI States
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Zustand Store
  const { 
    isWorkspaceActive, currentPoemText, originalPoemText, chatHistory,
    startWorkspace, updatePoemText, addChatMessage, resetWorkspace 
  } = usePoemStore();

  const { user, credits } = useAuth();
  const isOutOfCredits = credits !== null && credits <= 0;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language: 'bengali', emotion: 'love', poetry_type: 'poem',
      user_message: '', mood: '', target_person: '',
      line_length: 'medium', rhyme_style: 'soft_rhyme', word_difficulty: 'poetic',
      tone_filter: 'modern', emotion_level: 'deep', flow_style: 'smooth',
      add_musical_notes: false, literary_style: 'cinematic_poetic',
      creativity_level: 'high', metaphor_density: 'balanced',
      philosophical_depth: 'medium', realism_level: 'raw_realism',
      uniqueness_level: 'very_high', sensory_details: 'all_sensory',
      poetic_device_focus: 'immersive_imagery', atmosphere_type: 'cinematic',
      ending_impact: 'emotionally_haunting'
    },
  });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  useEffect(() => {
    const dna = getPoetDNA();
    if (dna) {
      form.setValue('emotion_level', dna.emotionalTendency as any);
      form.setValue('rhyme_style', dna.rhymePreference as any);
      form.setValue('word_difficulty', dna.wordComplexity as any);
      form.setValue('tone_filter', dna.style as any);
      if (dna.preferredLanguages?.length > 0) form.setValue('language', dna.preferredLanguages[0] as any);
    }
    const lang = searchParams.get('language');
    const emotion = searchParams.get('emotion');
    const type = searchParams.get('type');
    if (lang) form.setValue('language', lang as any);
    if (emotion) form.setValue('emotion', emotion);
    if (type) form.setValue('poetry_type', type as any);
  }, [searchParams, form]);

  /* =========================================================
     ⚙️ CORE GENERATION PIPELINE (PHASE 1 ENGINE)
  ========================================================= */
  const onSubmit = async (values: FormValues) => {
    if (!user) {
      toast.error('Identity required! Please sign in to command the quill.');
      return;
    }
    if (isOutOfCredits) {
      toast.error('The ink has run dry. Your credits are exhausted.');
      navigate('/shop');
      return;
    }

    setIsGenerating(true);
    setStreamingText('');

    const deductionSuccess = await addCredits(user.id, -1);
    if (!deductionSuccess) {
      toast.error('Vault verification failed. Network unstable.');
      setIsGenerating(false);
      return;
    }
    window.dispatchEvent(new Event('creditsUpdated'));

    try {
      const fullText = await generatePoem(values, (chunk) => setStreamingText((prev) => prev + chunk));
      let extractedMusicalNotes = undefined; 
      
      if (values.add_musical_notes) {
        toast.info('The Maestro is assigning Sur and Raag...');
        const analysis = await generateMusicalNotes(fullText, values.emotion);
        extractedMusicalNotes = (analysis as any)?.stanzas; 
      }

      const savedPoem = await createPoem({ ...values, content: fullText, musical_notes: extractedMusicalNotes });
      if (savedPoem) {
        toast.success('Verses bound to eternity!');
        startWorkspace(fullText);
      } else {
        throw new Error("SaaS Database sealing rejected.");
      }
    } catch (error) {
      console.error("Pipeline Crash:", error);
      await addCredits(user.id, 1);
      window.dispatchEvent(new Event('creditsUpdated'));
      toast.error('The Muse vanished. 1 credit has been securely refunded.');
      setStreamingText('');
    } finally {
      setIsGenerating(false);
    }
  };

  /* =========================================================
     💬 LIVE REWRITE & FEEDBACK LOOP (PHASE 2 ENGINE)
  ========================================================= */
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;

    const userQuery = chatInput.trim();
    setChatInput('');
    addChatMessage({ role: 'user', content: userQuery });
    setIsChatLoading(true);

    try {
      const response = await continuePoemConversation(currentPoemText, userQuery, form.getValues('language'));
      if (response && response.rewritten_poem) {
        updatePoemText(response.rewritten_poem);
        addChatMessage({ 
          role: 'ai', 
          content: `${response.ai_notes}\n\n**Key Refinements:**\n${response.improvement_summary.map(s => `• ${s}`).join('\n')}` 
        });
        toast.success('Poem modified symmetrically!');
      } else {
        throw new Error("Invalid format parsing.");
      }
    } catch (error) {
      console.error("Chat Mutation Error:", error);
      toast.error("AI couldn't re-align the parameters. Try simpler instructions.");
    } finally {
      setIsChatLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentPoemText);
    setCopied(true);
    toast.success('Verses copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadTxt = () => {
    const element = document.createElement("a");
    const file = new Blob([currentPoemText], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Maestro_Verse_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const emotions = ['love', 'sad', 'heartbreak', 'attitude', 'spiritual', 'friendship', 'motivation', 'romantic', 'hope', 'loneliness'];

  return (
    <div className="min-h-screen w-full relative bg-stone-50 dark:bg-[#09090b] text-stone-900 dark:text-stone-100 transition-colors duration-500 selection:bg-amber-500/30">
      <AnimatePresence mode="wait">
        
        {!isWorkspaceActive ? (
          /* =========================================================
             👑 INDUSTRIAL SAE DESIGN PHASE 1: GENERATOR CAPTURE
          ========================================================= */
          <motion.div
            key="input-form-stage"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-5xl mx-auto py-16 px-4 sm:px-6 lg:px-8 space-y-12"
          >
            <header className="text-center space-y-4">
              <div className="inline-flex p-4 bg-amber-100 dark:bg-amber-500/10 rounded-full border border-amber-200 dark:border-amber-500/20 mb-2 shadow-sm">
                <Feather className="w-8 h-8 text-amber-600 dark:text-amber-500 animate-float" />
              </div>
              <h1 className="text-5xl sm:text-7xl font-black tracking-tight font-serif text-stone-900 dark:text-transparent dark:bg-gradient-to-r dark:from-amber-200 dark:via-yellow-400 dark:to-amber-500 dark:bg-clip-text uppercase drop-shadow-sm">
                Master's Studio
              </h1>
              <p className="text-stone-500 dark:text-stone-400 max-w-xl mx-auto text-sm sm:text-base font-medium">
                Architect high-literature poetry, couplets, and musical ballads configured with premium creative weights.
              </p>
            </header>

            <Card className="border-0 shadow-2xl bg-white dark:bg-stone-900/40 backdrop-blur-2xl rounded-3xl overflow-hidden ring-1 ring-stone-200 dark:ring-stone-800 transition-all duration-300">
              <CardHeader className="border-b border-stone-100 dark:border-stone-800/60 bg-stone-50/50 dark:bg-stone-950/40 px-8 py-6">
                <CardTitle className="text-2xl font-serif italic text-amber-700 dark:text-amber-400 flex items-center gap-3">
                  <Sparkle className="w-5 h-5 text-amber-500" /> Summon The Symphony
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-8 sm:p-10 space-y-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
                    
                    <FormField
                      control={form.control}
                      name="user_message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-amber-700 dark:text-amber-500 text-[10px] uppercase tracking-[0.2em] font-black">The Seed of Inspiration</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your raw imagination, fragments of memories, dynamic scenery, or silent pain..."
                              className="min-h-[160px] text-lg sm:text-xl font-serif italic bg-stone-50 dark:bg-stone-950/50 border-stone-200 dark:border-stone-800 rounded-2xl p-6 focus-visible:ring-amber-500/30 transition-all placeholder:text-stone-400 dark:placeholder:text-stone-600 resize-none shadow-inner"
                              disabled={isGenerating}
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                      <FormField control={form.control} name="language" render={({ field }) => (
                        <FormItem><FormLabel className="text-stone-500 dark:text-stone-400 text-[10px] uppercase tracking-widest font-bold">Tongue</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger className="h-12 bg-white dark:bg-stone-950/40 border-stone-200 dark:border-stone-800 rounded-xl"><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
                              <SelectItem value="bengali">Bengali • বাংলা</SelectItem>
                              <SelectItem value="urdu">Urdu • اردو</SelectItem>
                              <SelectItem value="roman_urdu">Roman Urdu</SelectItem>
                              <SelectItem value="hindi">Hindi • हिन्दी</SelectItem>
                              <SelectItem value="english">English</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}/>

                      <FormField control={form.control} name="poetry_type" render={({ field }) => (
                        <FormItem><FormLabel className="text-stone-500 dark:text-stone-400 text-[10px] uppercase tracking-widest font-bold">Poetic Form</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger className="h-12 bg-white dark:bg-stone-950/40 border-stone-200 dark:border-stone-800 rounded-xl"><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800">
                              <SelectItem value="poem">Classic Poem</SelectItem>
                              <SelectItem value="ghazal">Ghazal</SelectItem>
                              <SelectItem value="shayari">Shayari</SelectItem>
                              <SelectItem value="nazm">Nazm</SelectItem>
                              <SelectItem value="song">Lyrical Ballad</SelectItem>
                              <SelectItem value="couplet">Couplet</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}/>

                      <FormField control={form.control} name="emotion" render={({ field }) => (
                        <FormItem><FormLabel className="text-stone-500 dark:text-stone-400 text-[10px] uppercase tracking-widest font-bold">Core Essence</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl><SelectTrigger className="h-12 bg-white dark:bg-stone-950/40 border-stone-200 dark:border-stone-800 rounded-xl capitalize"><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 max-h-64">
                              {emotions.map(e => <SelectItem key={e} value={e} className="capitalize">{e}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}/>
                    </div>

                    {/* =========================================================
                       ⚙️ COLLAPSIBLE CONSOLE MATRICES
                    ========================================================= */}
                    <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced} className="w-full">
                      <CollapsibleTrigger asChild>
                        <Button type="button" variant="outline" className="w-full border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/20 text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 gap-2 font-serif italic rounded-xl h-14 transition-all">
                          <Settings2 className="w-4 h-4 text-amber-500" />
                          {showAdvanced ? "Lock Advanced Engineering Bay" : "Open Advanced Blueprint Weights"}
                        </Button>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent className="mt-6 p-8 rounded-2xl bg-stone-50 dark:bg-stone-950/40 border border-stone-200 dark:border-stone-800/80 space-y-8 animate-in fade-in-50 duration-500">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                          <FormField control={form.control} name="literary_style" render={({ field }) => (
                            <FormItem><FormLabel className="text-[10px] uppercase tracking-[0.15em] text-stone-500 font-bold">Aesthetic Execution</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800"><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800"><SelectItem value="cinematic_poetic">Cinematic Lyrical</SelectItem><SelectItem value="classical_antique">Vintage Scholar</SelectItem><SelectItem value="modern_minimalist">Modern Realistic</SelectItem><SelectItem value="abstract_surreal">Existential Surreal</SelectItem></SelectContent>
                              </Select>
                            </FormItem>
                          )}/>

                          <FormField control={form.control} name="creativity_level" render={({ field }) => (
                            <FormItem><FormLabel className="text-[10px] uppercase tracking-[0.15em] text-stone-500 font-bold">Creative Variance Weight</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800"><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800"><SelectItem value="conservative">Conservative Strict</SelectItem><SelectItem value="balanced">Symmetric Standard</SelectItem><SelectItem value="high">High Artistic</SelectItem><SelectItem value="radical_chaos">Radical Unbound</SelectItem></SelectContent>
                              </Select>
                            </FormItem>
                          )}/>

                          <FormField control={form.control} name="metaphor_density" render={({ field }) => (
                            <FormItem><FormLabel className="text-[10px] uppercase tracking-[0.15em] text-stone-500 font-bold">Metaphorical Saturation</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800"><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800"><SelectItem value="none">Literal Simple</SelectItem><SelectItem value="sparse">Sparse Accents</SelectItem><SelectItem value="balanced">Balanced Symbolism</SelectItem><SelectItem value="heavy_layered">Dense Cryptic</SelectItem></SelectContent>
                              </Select>
                            </FormItem>
                          )}/>

                          <FormField control={form.control} name="philosophical_depth" render={({ field }) => (
                            <FormItem><FormLabel className="text-[10px] uppercase tracking-[0.15em] text-stone-500 font-bold">Existential Core Density</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800"><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800"><SelectItem value="none">Surface Expression</SelectItem><SelectItem value="shallow">Light Musings</SelectItem><SelectItem value="medium">Layered Insight</SelectItem><SelectItem value="existential_void">Existential Depth</SelectItem></SelectContent>
                              </Select>
                            </FormItem>
                          )}/>

                          <FormField control={form.control} name="rhyme_style" render={({ field }) => (
                            <FormItem><FormLabel className="text-[10px] uppercase tracking-[0.15em] text-stone-500 font-bold">Rhyming Architecture</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800"><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800"><SelectItem value="no_rhyme">Free Verse (Blank)</SelectItem><SelectItem value="soft_rhyme">Slant/Soft Rhyme</SelectItem><SelectItem value="strong_rhyme">Perfect Rhyme</SelectItem><SelectItem value="internal_rhyme">Internal Couplings</SelectItem></SelectContent>
                              </Select>
                            </FormItem>
                          )}/>

                          <FormField control={form.control} name="ending_impact" render={({ field }) => (
                            <FormItem><FormLabel className="text-[10px] uppercase tracking-[0.15em] text-stone-500 font-bold">Resolution Trajectory</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl><SelectTrigger className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800"><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800"><SelectItem value="abrupt_silence">Sudden Silence</SelectItem><SelectItem value="resolved_peace">Harmonious Peace</SelectItem><SelectItem value="emotionally_haunting">Haunting Echo</SelectItem><SelectItem value="philosophical_question">Open Question</SelectItem></SelectContent>
                              </Select>
                            </FormItem>
                          )}/>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-4 border-t border-stone-200 dark:border-stone-800/60">
                          <FormField control={form.control} name="mood" render={({ field }) => (
                            <FormItem><FormLabel className="text-[10px] uppercase tracking-[0.15em] text-stone-500 font-bold">Environmental Mood Modifiers</FormLabel>
                              <FormControl><Input placeholder="e.g., Midnight, Rainy, Abandoned Studio" className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 h-11" {...field} /></FormControl>
                            </FormItem>
                          )}/>
                          <FormField control={form.control} name="target_person" render={({ field }) => (
                            <FormItem><FormLabel className="text-[10px] uppercase tracking-[0.15em] text-stone-500 font-bold">Dedicated Subject Anchor</FormLabel>
                              <FormControl><Input placeholder="e.g., An estranged companion" className="bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 h-11" {...field} /></FormControl>
                            </FormItem>
                          )}/>
                          <FormField control={form.control} name="add_musical_notes" render={({ field }) => (
                            <FormItem className="flex flex-row items-center gap-4 space-y-0 p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900/20 mt-6 cursor-pointer hover:border-amber-500/40 transition-all shadow-sm">
                              <FormControl><input type="checkbox" checked={field.value} onChange={field.onChange} className="w-5 h-5 rounded accent-amber-500 cursor-pointer" /></FormControl>
                              <FormLabel className="flex items-center gap-2 text-stone-700 dark:text-stone-300 font-bold text-xs cursor-pointer tracking-wide"><Music className="w-4 h-4 text-amber-500" /> Assign Structural Sur/Raag</FormLabel>
                            </FormItem>
                          )}/>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>

                    {isOutOfCredits ? (
                      <Button type="button" onClick={() => navigate('/shop')} className="w-full h-16 text-xl font-black uppercase tracking-widest bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 rounded-xl animate-pulse shadow-sm">
                        <Coins className="w-6 h-6 mr-3" /> Out of Ink! Unlock the Vault
                      </Button>
                    ) : (
                      <Button type="submit" className="w-full h-16 text-xl font-black uppercase tracking-[0.2em] bg-amber-500 hover:bg-amber-600 dark:bg-gradient-to-r dark:from-amber-600 dark:to-amber-500 dark:hover:from-amber-500 dark:hover:to-yellow-500 text-white dark:text-stone-950 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300" disabled={isGenerating}>
                        {isGenerating ? <><Loader2 className="w-6 h-6 mr-3 animate-spin" /> Manifesting From The Matrix...</> : <><Sparkles className="w-6 h-6 mr-3" /> Command The Quill</>}
                      </Button>
                    )}
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Live Streaming Execution Board */}
            <AnimatePresence>
              {isGenerating && streamingText && (
                <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="w-full pb-20">
                  <Card className="border-0 ring-1 ring-amber-500/20 bg-white dark:bg-stone-950 shadow-2xl rounded-2xl overflow-hidden">
                    <CardHeader className="border-b border-stone-100 dark:border-stone-900 py-4 px-8 bg-stone-50 dark:bg-stone-900/20">
                      <CardTitle className="flex items-center gap-3 text-amber-600 dark:text-amber-400 font-serif text-xl tracking-wide">
                        <Feather className="w-5 h-5 animate-pulse text-amber-500" /> The AI Poet is Writing...
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="py-16 px-8 max-w-3xl mx-auto text-center">
                      <div className="text-xl sm:text-3xl text-stone-800 dark:text-stone-200 whitespace-pre-wrap leading-relaxed italic font-serif tracking-wide select-none">
                        {streamingText}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* =========================================================
             🖥️ HIGH-END ZEN WORKSPACE PHASE 2: SPLIT PRODUCTION ENVIRONMENT
          ========================================================= */
          <motion.div
            key="zen-workspace-stage"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-screen flex flex-col md:flex-row bg-white dark:bg-[#09090b] overflow-hidden"
          >
            {/* 🖥️ LEFT SIDE PANEL: REAL-TIME LITERARY PLATFORM (60%) */}
            <div className="w-full md:w-[60%] h-1/2 md:h-full border-b md:border-b-0 md:border-r border-stone-200 dark:border-stone-900 overflow-y-auto p-6 sm:p-12 flex flex-col justify-between custom-scrollbar bg-stone-50 dark:bg-gradient-to-br dark:from-stone-950 dark:via-[#0d0d11] dark:to-stone-950">
              
              <div className="w-full max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-900 pb-4">
                  <span className="text-[10px] uppercase tracking-[0.3em] font-black text-amber-600 dark:text-amber-500/80 flex items-center gap-2">
                    <Feather className="w-3.5 h-3.5" /> Living Manuscript
                  </span>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={copyToClipboard} className="text-stone-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-stone-200 dark:hover:bg-stone-900 transition-colors">
                      {copied ? <Check className="w-4 h-4 text-green-500 dark:text-green-400" /> : <Copy className="w-4 h-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={downloadTxt} className="text-stone-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-stone-200 dark:hover:bg-stone-900 transition-colors">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Main Interactive Poem Field */}
                <div className="py-12">
                  <textarea
                    value={currentPoemText}
                    onChange={(e) => updatePoemText(e.target.value)}
                    className="w-full min-h-[400px] bg-transparent text-2xl sm:text-4xl text-stone-800 dark:text-stone-200 font-serif italic text-center focus:outline-none border-none resize-none leading-relaxed custom-scrollbar tracking-wide font-medium"
                    placeholder="The canvas is empty..."
                  />
                </div>
              </div>

              <div className="w-full max-w-3xl mx-auto flex items-center justify-between pt-6 border-t border-stone-200 dark:border-stone-900/60 text-xs text-stone-500 dark:text-stone-500 font-medium tracking-wide">
                <span>Words: {currentPoemText.split(/\s+/).filter(Boolean).length}</span>
                <Button 
                  variant="link" 
                  onClick={() => {
                    if(confirm("Discard modifications and restore original blueprint?")) updatePoemText(originalPoemText);
                  }}
                  className="text-stone-500 dark:text-stone-500 hover:text-amber-600 dark:hover:text-amber-500 h-auto p-0 flex items-center gap-1 font-serif transition-colors"
                >
                  <RefreshCw className="w-3 h-3" /> Rollback To Original Generation
                </Button>
                <Button 
                  onClick={resetWorkspace} 
                  className="bg-stone-200 dark:bg-stone-900 hover:bg-stone-300 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-300 border border-stone-300 dark:border-stone-800 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors"
                >
                  Seal File & Return
                </Button>
              </div>
            </div>

            {/* 💬 RIGHT SIDE PANEL: ADVANCED INTERACTION INTERFACE (40%) */}
            <div className="w-full md:w-[40%] h-1/2 md:h-full bg-stone-100 dark:bg-[#0b0b0e] flex flex-col justify-between border-t md:border-t-0 border-stone-200 dark:border-stone-900">
              
              {/* Chat Header */}
              <div className="px-8 py-5 border-b border-stone-200 dark:border-stone-900 bg-white/50 dark:bg-stone-950/40 backdrop-blur-md flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <span className="text-sm font-bold tracking-widest font-serif text-stone-800 dark:text-stone-200">Maestro Co-Poet Chat</span>
                </div>
                <span className="text-[9px] font-black uppercase text-stone-400 dark:text-stone-500 tracking-[0.2em] border border-stone-300 dark:border-stone-800 px-2 py-1 rounded-md">SaaS Loop</span>
              </div>

              {/* Chat Flow Stream */}
              <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar bg-transparent">
                {chatHistory.map((msg, index) => (
                  <div key={index} className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-amber-100 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-400' : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400'}`}>
                      {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                    </div>
                    <div className={`p-5 rounded-3xl text-sm leading-relaxed tracking-wide ${msg.role === 'user' ? 'bg-amber-500 dark:bg-amber-600 text-white dark:text-stone-950 font-medium rounded-tr-sm shadow-md' : 'bg-white dark:bg-stone-900/70 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800/60 rounded-tl-sm shadow-sm whitespace-pre-wrap'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                
                {isChatLoading && (
                  <div className="flex gap-4 mr-auto items-center text-stone-500 dark:text-stone-500 text-xs italic font-serif bg-white dark:bg-stone-900/40 p-4 rounded-2xl rounded-tl-sm border border-stone-200 dark:border-stone-800/50 w-fit">
                    <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                    Maestro is restructuring the metrics...
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input Interface */}
              <form onSubmit={handleChatSubmit} className="p-6 border-t border-stone-200 dark:border-stone-900 bg-white/80 dark:bg-stone-950/80 backdrop-blur-xl flex gap-3">
                <Input
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Tell Maestro to make the vocabulary simpler, add rhythm..."
                  className="flex-1 h-12 bg-stone-50 dark:bg-stone-900/60 border-stone-200 dark:border-stone-800 focus-visible:ring-amber-500/30 text-stone-800 dark:text-stone-200 rounded-xl px-5 placeholder:text-stone-400 dark:placeholder:text-stone-600"
                  disabled={isChatLoading}
                />
                <Button type="submit" size="icon" className="h-12 w-12 rounded-xl bg-amber-500 hover:bg-amber-600 text-white dark:text-stone-950 shrink-0 shadow-md transition-transform active:scale-95" disabled={isChatLoading || !chatInput.trim()}>
                  <Send className="w-5 h-5" />
                </Button>
              </form>

            </div>

          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default GeneratorPage;