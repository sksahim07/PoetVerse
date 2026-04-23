import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { getPoetDNA, savePoetDNA, clearPoetDNA, getDefaultPoetDNA, type PoetDNA } from '@/services/poetDNA';
import { Sparkles, Heart, Moon, Cloud, Feather } from 'lucide-react';

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
      title: 'Poet\'s DNA Saved',
      description: 'Aapka adabi mizaj samajh liya gaya hai. Your poetic preferences will be applied to future creations.',
    });
  };

  const handleReset = () => {
    clearPoetDNA();
    setDNA(getDefaultPoetDNA());
    setHasExistingDNA(false);
    toast({
      title: 'Poet\'s DNA Reset',
      description: 'Your poetic preferences have been cleared.',
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
    { value: 'urdu', label: 'Urdu (Roman)' },
    { value: 'hindi', label: 'Hindi (Roman)' },
    { value: 'english', label: 'English' },
    { value: 'bengali', label: 'Bengali (Roman)' },
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
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl xl:text-5xl font-bold text-ivory adab-spacing">
            Poet's DNA
          </h1>
          <p className="text-xl text-warm-muted max-w-2xl mx-auto">
            Define your poetic identity. Your preferences will shape every creation.
          </p>
          {hasExistingDNA && (
            <p className="text-sm text-primary italic">
              ✨ Aapka adabi mizaj samajh liya gaya hai
            </p>
          )}
        </div>

        <Card className="glass-card royal-frame">
          <CardHeader>
            <CardTitle className="text-2xl gold-accent">Poetic Style</CardTitle>
            <CardDescription className="text-warm-muted">
              Choose your dominant poetic voice
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={dna.style} onValueChange={(value: any) => setDNA({ ...dna, style: value })}>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {styles.map((style) => {
                  const Icon = style.icon;
                  return (
                    <div key={style.value} className="flex items-start space-x-3 p-4 rounded-lg border border-border/30 hover:border-primary/30 transition-colors">
                      <RadioGroupItem value={style.value} id={style.value} />
                      <div className="flex-1">
                        <Label htmlFor={style.value} className="flex items-center gap-2 cursor-pointer">
                          <Icon className="w-4 h-4 text-primary" />
                          <span className="font-semibold text-ivory">{style.label}</span>
                        </Label>
                        <p className="text-sm text-warm-muted mt-1">{style.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card className="glass-card royal-frame">
          <CardHeader>
            <CardTitle className="text-2xl gold-accent">Emotional Depth</CardTitle>
            <CardDescription className="text-warm-muted">
              How deep should your poetry go?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={dna.emotionalTendency} onValueChange={(value: any) => setDNA({ ...dna, emotionalTendency: value })}>
              <div className="space-y-3">
                {emotionalTendencies.map((tendency) => (
                  <div key={tendency.value} className="flex items-start space-x-3 p-4 rounded-lg border border-border/30 hover:border-primary/30 transition-colors">
                    <RadioGroupItem value={tendency.value} id={tendency.value} />
                    <div className="flex-1">
                      <Label htmlFor={tendency.value} className="cursor-pointer">
                        <span className="font-semibold text-ivory">{tendency.label}</span>
                      </Label>
                      <p className="text-sm text-warm-muted mt-1">{tendency.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card className="glass-card royal-frame">
          <CardHeader>
            <CardTitle className="text-2xl gold-accent">Rhyme Preference</CardTitle>
            <CardDescription className="text-warm-muted">
              Your preferred rhyming style
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={dna.rhymePreference} onValueChange={(value: any) => setDNA({ ...dna, rhymePreference: value })}>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {rhymePreferences.map((rhyme) => (
                  <div key={rhyme.value} className="flex items-start space-x-3 p-4 rounded-lg border border-border/30 hover:border-primary/30 transition-colors">
                    <RadioGroupItem value={rhyme.value} id={rhyme.value} />
                    <div className="flex-1">
                      <Label htmlFor={rhyme.value} className="cursor-pointer">
                        <span className="font-semibold text-ivory">{rhyme.label}</span>
                      </Label>
                      <p className="text-sm text-warm-muted mt-1">{rhyme.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card className="glass-card royal-frame">
          <CardHeader>
            <CardTitle className="text-2xl gold-accent">Word Complexity</CardTitle>
            <CardDescription className="text-warm-muted">
              Vocabulary sophistication level
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={dna.wordComplexity} onValueChange={(value: any) => setDNA({ ...dna, wordComplexity: value })}>
              <div className="space-y-3">
                {wordComplexities.map((complexity) => (
                  <div key={complexity.value} className="flex items-start space-x-3 p-4 rounded-lg border border-border/30 hover:border-primary/30 transition-colors">
                    <RadioGroupItem value={complexity.value} id={complexity.value} />
                    <div className="flex-1">
                      <Label htmlFor={complexity.value} className="cursor-pointer">
                        <span className="font-semibold text-ivory">{complexity.label}</span>
                      </Label>
                      <p className="text-sm text-warm-muted mt-1">{complexity.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <Card className="glass-card royal-frame">
          <CardHeader>
            <CardTitle className="text-2xl gold-accent">Preferred Languages</CardTitle>
            <CardDescription className="text-warm-muted">
              Select your favorite languages (multiple allowed)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              {languages.map((lang) => (
                <div key={lang.value} className="flex items-center space-x-2 p-3 rounded-lg border border-border/30">
                  <Checkbox
                    id={lang.value}
                    checked={dna.preferredLanguages.includes(lang.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setDNA({ ...dna, preferredLanguages: [...dna.preferredLanguages, lang.value] });
                      } else {
                        setDNA({ ...dna, preferredLanguages: dna.preferredLanguages.filter(l => l !== lang.value) });
                      }
                    }}
                  />
                  <Label htmlFor={lang.value} className="cursor-pointer text-ivory">
                    {lang.label}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card royal-frame">
          <CardHeader>
            <CardTitle className="text-2xl gold-accent">Favorite Themes</CardTitle>
            <CardDescription className="text-warm-muted">
              Select themes that resonate with you (multiple allowed)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
              {themes.map((theme) => (
                <div key={theme.value} className="flex items-center space-x-2 p-3 rounded-lg border border-border/30">
                  <Checkbox
                    id={theme.value}
                    checked={dna.favoriteThemes.includes(theme.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setDNA({ ...dna, favoriteThemes: [...dna.favoriteThemes, theme.value] });
                      } else {
                        setDNA({ ...dna, favoriteThemes: dna.favoriteThemes.filter(t => t !== theme.value) });
                      }
                    }}
                  />
                  <Label htmlFor={theme.value} className="cursor-pointer text-ivory">
                    {theme.label}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-center">
          <Button onClick={handleSave} size="lg" className="btn-royal">
            <Sparkles className="w-5 h-5 mr-2" />
            Save Poet's DNA
          </Button>
          {hasExistingDNA && (
            <Button onClick={handleReset} size="lg" variant="outline" className="royal-border text-ivory hover:bg-primary hover:text-primary-foreground transition-all">
              Reset to Default
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PoetDNAPage;