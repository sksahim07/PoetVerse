import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { getPoetDNA, savePoetDNA, clearPoetDNA, getDefaultPoetDNA, type PoetDNA } from '@/services/poetDNA';
import { Sparkles, Heart, Moon, Cloud, Feather, Fingerprint, RotateCcw, Save } from 'lucide-react';

const PoetDNAPage = () => {
  const { toast } = useToast();
  const [dna, setDNA] = useState<PoetDNA>(getDefaultPoetDNA());
  const [hasExistingDNA, setHasExistingDNA] = useState(false);

  useEffect(() => {
    const existingDNA = getPoetDNA();
    if (existingDNA) {
      setDNA(existingDNA);
      setHasExistingDNA(true);
    }
  }, []);

  const handleSave = () => {
    savePoetDNA(dna);
    setHasExistingDNA(true);
    toast({
      title: 'The Mirror has Memorized You',
      description: 'Aapka adabi mizaj samajh liya gaya hai. The Maestro will now write in your voice.',
    });
  };

  const handleReset = () => {
    clearPoetDNA();
    setDNA(getDefaultPoetDNA());
    setHasExistingDNA(false);
    toast({
      title: 'DNA Reset',
      description: 'Your poetic slate has been wiped clean.',
    });
  };

  const styles = [
    { value: 'classical', label: 'Classical', description: 'Mir, Ghalib, Faiz style - timeless elegance', icon: Feather },
    { value: 'modern', label: 'Modern', description: 'Contemporary poetry with fresh perspectives', icon: Sparkles },
    { value: 'sufi', label: 'Sufi', description: 'Mystical, spiritual, divine connection', icon: Moon },
    { value: 'dark', label: 'Dark', description: 'Melancholic, gothic, deep shadows', icon: Cloud },
    { value: 'soft_romantic', label: 'Soft Romantic', description: 'Gentle, tender, heartfelt expressions', icon: Heart },
  ];

  const emotionalTendencies = [
    { value: 'surface', label: 'Surface', description: 'Light, accessible, easy to understand' },
    { value: 'deep', label: 'Deep', description: 'Layered meaning, symbolic imagery' },
    { value: 'very_deep', label: 'Very Deep', description: 'Philosophical, existential themes' },
    { value: 'painfully_honest', label: 'Painfully Honest', description: 'Raw, vulnerable, unfiltered truth' },
  ];

  const rhymePreferences = [
    { value: 'soft_rhyme', label: 'Soft Rhyme', description: 'Subtle, natural rhyming' },
    { value: 'strong_rhyme', label: 'Strong Rhyme', description: 'Clear, consistent rhyming' },
    { value: 'no_rhyme', label: 'No Rhyme', description: 'Free verse, focus on meaning' },
    { value: 'internal_rhyme', label: 'Internal Rhyme', description: 'Rhymes within lines' },
  ];

  const wordComplexities = [
    { value: 'simple', label: 'Simple', description: 'Everyday words, accessible' },
    { value: 'poetic', label: 'Poetic', description: 'Elegant, literary vocabulary' },
    { value: 'classical', label: 'Classical', description: 'Traditional, sophisticated words' },
  ];

  const languages = [
    { value: 'urdu', label: 'Urdu' },
    { value: 'hindi', label: 'Hindi' },
    { value: 'english', label: 'English' },
    { value: 'bengali', label: 'Bengali' },
  ];

  const themes = [
    { value: 'love', label: 'Love & Romance' },
    { value: 'spiritual', label: 'Spiritual & Sufi' },
    { value: 'sad', label: 'Sadness & Pain' },
    { value: 'motivation', label: 'Motivation & Hope' },
    { value: 'friendship', label: 'Friendship & Bonds' },
    { value: 'heartbreak', label: 'Heartbreak & Loss' },
  ];

  return (
    <div className="min-h-screen py-16 px-4 xl:px-8 bg-gradient-to-b from-background to-background/90 relative overflow-hidden">
      
      {/* Mystical Background Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto space-y-12 relative z-10">
        
        {/* The Oracle Header */}
        <header className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-4">
            <div className="relative p-4 bg-primary/10 rounded-full border border-primary/20 glow-gold">
              <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping opacity-20" />
              <Fingerprint className="w-12 h-12 text-primary animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl xl:text-7xl font-black tracking-tighter gradient-text uppercase font-serif">
              Poet's DNA
            </h1>
            <p className="text-xl text-warm-muted leading-relaxed italic font-serif">
              "Define the architecture of your soul. Let the Maestro speak your exact language."
            </p>
          </div>
          {hasExistingDNA && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm uppercase tracking-widest font-bold">
              <Sparkles className="w-4 h-4" />
              DNA Sequence Active
            </div>
          )}
        </header>

        {/* --- Options Grid --- */}
        <div className="space-y-8">
          
          {/* Poetic Style */}
          <Card className="glass-card royal-frame border-none shadow-2xl bg-black/5 dark:bg-black/20">
            <CardHeader className="border-b border-primary/10 pb-6">
              <CardTitle className="text-3xl font-serif italic text-primary">I. The Voice</CardTitle>
              <CardDescription className="text-warm-muted text-lg">Choose your dominant poetic persona.</CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <RadioGroup value={dna.style} onValueChange={(value: string) => setDNA({ ...dna, style: value as any })}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {styles.map((style) => {
                    const Icon = style.icon;
                    return (
                      <div key={style.value} className="relative group">
                        <RadioGroupItem value={style.value} id={style.value} className="peer sr-only" />
                        <Label 
                          htmlFor={style.value} 
                          className="flex flex-col p-6 rounded-xl border border-primary/20 bg-background/40 hover:bg-primary/5 hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:shadow-[0_0_20px_rgba(184,134,11,0.15)] transition-all duration-300 cursor-pointer h-full"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <Icon className="w-5 h-5 text-primary" />
                            <span className="text-xl font-bold text-foreground uppercase tracking-wider">{style.label}</span>
                          </div>
                          <p className="text-sm text-warm-muted/80 leading-relaxed">{style.description}</p>
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Emotional Depth & Word Complexity (Side by Side on Large Screens) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            <Card className="glass-card royal-frame border-none shadow-2xl bg-black/5 dark:bg-black/20">
              <CardHeader className="border-b border-primary/10 pb-6">
                <CardTitle className="text-2xl font-serif italic text-primary">II. The Depth</CardTitle>
                <CardDescription className="text-warm-muted">How deep should the verses dive?</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <RadioGroup value={dna.emotionalTendency} onValueChange={(value: string) => setDNA({ ...dna, emotionalTendency: value as any })}>
                  <div className="space-y-3">
                    {emotionalTendencies.map((tendency) => (
                      <div key={tendency.value} className="relative">
                        <RadioGroupItem value={tendency.value} id={tendency.value} className="peer sr-only" />
                        <Label 
                          htmlFor={tendency.value} 
                          className="flex flex-col p-4 rounded-xl border border-primary/10 bg-background/40 hover:bg-primary/5 peer-data-[state=checked]:border-primary/50 peer-data-[state=checked]:bg-primary/10 transition-all cursor-pointer"
                        >
                          <span className="text-lg font-bold text-foreground">{tendency.label}</span>
                          <span className="text-sm text-warm-muted">{tendency.description}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card className="glass-card royal-frame border-none shadow-2xl bg-black/5 dark:bg-black/20">
              <CardHeader className="border-b border-primary/10 pb-6">
                <CardTitle className="text-2xl font-serif italic text-primary">III. The Lexicon</CardTitle>
                <CardDescription className="text-warm-muted">Choose your vocabulary weight.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <RadioGroup value={dna.wordComplexity} onValueChange={(value: string) => setDNA({ ...dna, wordComplexity: value as any })}>
                  <div className="space-y-3">
                    {wordComplexities.map((complexity) => (
                      <div key={complexity.value} className="relative">
                        <RadioGroupItem value={complexity.value} id={complexity.value} className="peer sr-only" />
                        <Label 
                          htmlFor={complexity.value} 
                          className="flex flex-col p-4 rounded-xl border border-primary/10 bg-background/40 hover:bg-primary/5 peer-data-[state=checked]:border-primary/50 peer-data-[state=checked]:bg-primary/10 transition-all cursor-pointer"
                        >
                          <span className="text-lg font-bold text-foreground">{complexity.label}</span>
                          <span className="text-sm text-warm-muted">{complexity.description}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

          </div>

          {/* Rhyme Preference */}
          <Card className="glass-card royal-frame border-none shadow-2xl bg-black/5 dark:bg-black/20">
            <CardHeader className="border-b border-primary/10 pb-6">
              <CardTitle className="text-2xl font-serif italic text-primary">IV. The Rhythm</CardTitle>
              <CardDescription className="text-warm-muted">How should your poetry flow?</CardDescription>
            </CardHeader>
            <CardContent className="pt-8">
              <RadioGroup value={dna.rhymePreference} onValueChange={(value: string) => setDNA({ ...dna, rhymePreference: value as any })}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rhymePreferences.map((rhyme) => (
                    <div key={rhyme.value} className="relative">
                      <RadioGroupItem value={rhyme.value} id={rhyme.value} className="peer sr-only" />
                      <Label 
                        htmlFor={rhyme.value} 
                        className="flex flex-col p-5 rounded-xl border border-primary/10 bg-background/40 hover:bg-primary/5 peer-data-[state=checked]:border-primary/50 peer-data-[state=checked]:bg-primary/10 transition-all cursor-pointer"
                      >
                        <span className="text-lg font-bold text-foreground">{rhyme.label}</span>
                        <span className="text-sm text-warm-muted mt-1">{rhyme.description}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Languages & Themes (Checkboxes) */}
          <Card className="glass-card royal-frame border-none shadow-2xl bg-black/5 dark:bg-black/20">
            <CardHeader className="border-b border-primary/10 pb-6">
              <CardTitle className="text-2xl font-serif italic text-primary">V. The Elements</CardTitle>
              <CardDescription className="text-warm-muted">Select your preferred languages and core themes.</CardDescription>
            </CardHeader>
            <CardContent className="pt-8 space-y-8">
              
              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Tongues</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {languages.map((lang) => {
                    const isChecked = dna.preferredLanguages.includes(lang.value as any);
                    return (
                      <div key={lang.value} className="relative">
                        <Checkbox
                          id={lang.value}
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setDNA({ ...dna, preferredLanguages: [...dna.preferredLanguages, lang.value as any] });
                            } else {
                              setDNA({ ...dna, preferredLanguages: dna.preferredLanguages.filter(l => l !== lang.value) });
                            }
                          }}
                          className="peer sr-only"
                        />
                        <Label 
                          htmlFor={lang.value} 
                          className={`flex items-center justify-center p-4 rounded-xl border transition-all cursor-pointer text-center font-bold tracking-wide ${
                            isChecked ? 'bg-primary/10 border-primary text-primary shadow-sm' : 'bg-background/40 border-primary/10 text-warm-muted hover:border-primary/30 hover:text-foreground'
                          }`}
                        >
                          {lang.label}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Motifs</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {themes.map((theme) => {
                    const isChecked = dna.favoriteThemes.includes(theme.value as any);
                    return (
                      <div key={theme.value} className="relative">
                        <Checkbox
                          id={theme.value}
                          checked={isChecked}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setDNA({ ...dna, favoriteThemes: [...dna.favoriteThemes, theme.value as any] });
                            } else {
                              setDNA({ ...dna, favoriteThemes: dna.favoriteThemes.filter(t => t !== theme.value) });
                            }
                          }}
                          className="peer sr-only"
                        />
                        <Label 
                          htmlFor={theme.value} 
                          className={`flex items-center justify-center p-4 rounded-xl border transition-all cursor-pointer text-center font-bold tracking-wide ${
                            isChecked ? 'bg-primary/10 border-primary text-primary shadow-sm' : 'bg-background/40 border-primary/10 text-warm-muted hover:border-primary/30 hover:text-foreground'
                          }`}
                        >
                          {theme.label}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>

            </CardContent>
          </Card>

        </div>

        {/* Action Center */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8 border-t border-primary/10">
          <Button onClick={handleSave} className="btn-royal h-16 px-12 text-xl font-bold uppercase tracking-widest w-full sm:w-auto shadow-2xl">
            <Save className="w-5 h-5 mr-3" />
            Seal The DNA
          </Button>
          
          {hasExistingDNA && (
            <Button onClick={handleReset} variant="outline" className="h-16 px-8 text-lg uppercase font-bold border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive w-full sm:w-auto transition-colors">
              <RotateCcw className="w-5 h-5 mr-3" />
              Shatter The Mirror
            </Button>
          )}
        </div>

      </div>
    </div>
  );
};

export default PoetDNAPage;