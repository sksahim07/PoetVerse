import { useState } from 'react';
import { Music, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

const formSchema = z.object({
  lyrics: z.string().min(10, 'Please enter at least 10 characters'),
});

type FormValues = z.infer<typeof formSchema>;

interface SurAnalysis {
  structure: {
    totalLines: number;
    sections: string[];
    rhymeScheme: string;
    syllablePattern: string;
  };
  rhythm: {
    taal: string;
    tempo: string;
    beats: string;
    flow: string;
  };
  musicalSuggestions: Array<{
    section: string;
    lines: string;
    sur: string;
    raag: string;
    instrument: string;
    mood: string;
    notes: string;
  }>;
  overallAnalysis: {
    genre: string;
    emotion: string;
    recommendations: string[];
  };
}

const SurSuggestionPage = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<SurAnalysis | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      lyrics: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsAnalyzing(true);
    setAnalysis(null);

    try {
      const API_URL = 'https://api-integrations.appmedo.com/app-7vdxdrk6x5hd/api-rLob8RdzAOl9/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse';
      const APP_ID = import.meta.env.VITE_APP_ID;

      const systemPrompt = `You are a master music composer and analyst with deep expertise in:
- Indian Classical Music (Hindustani & Carnatic traditions)
- Western music theory and composition
- Song structure analysis (verse, chorus, bridge patterns)
- Rhythm and syllable analysis
- Raag theory and emotional mapping
- Taal (rhythm cycles) and tempo variations

COMPREHENSIVE MUSICAL KNOWLEDGE:

INDIAN CLASSICAL SWARAS (Sur):
- Shuddha Swaras: Sa, Re, Ga, Ma, Pa, Dha, Ni
- Komal (Flat): Komal Re, Komal Ga, Komal Dha, Komal Ni
- Tivra (Sharp): Tivra Ma

RAAG CLASSIFICATION BY EMOTION:
Love & Romance:
- Raag Yaman (evening, romantic, peaceful)
- Raag Kafi (devotional love, folk touch)
- Raag Bhairavi (morning, all emotions, versatile)
- Raag Khamaj (light classical, romantic)

Sadness & Longing:
- Raag Darbari (deep sadness, serious)
- Raag Bhimpalasi (afternoon, longing)
- Raag Marwa (evening, intense longing)
- Raag Bageshri (night, melancholic beauty)

Devotional & Spiritual:
- Raag Bhairav (morning, serious, devotional)
- Raag Todi (midday, intense devotion)
- Raag Puriya (evening, devotional)
- Raag Malkauns (late night, meditative)

Joy & Celebration:
- Raag Bilawal (morning, joyful, bright)
- Raag Durga (evening, uplifting)
- Raag Bhupali (evening, peaceful joy)
- Raag Desh (monsoon, celebration)

TAAL (Rhythm Cycles):
- Teentaal: 16 beats (most common, versatile)
- Keherwa: 8 beats (light, film songs)
- Dadra: 6 beats (romantic, ghazals)
- Rupak: 7 beats (unique, expressive)
- Jhaptaal: 10 beats (complex, classical)
- Ektaal: 12 beats (slow, serious)

INSTRUMENTS BY MOOD:
Traditional Indian:
- Sitar: Romantic, classical depth
- Flute (Bansuri): Peaceful, devotional, romantic
- Sarod: Serious, deep emotions
- Harmonium: Devotional, versatile
- Tabla: Rhythm foundation
- Santoor: Peaceful, meditative
- Shehnai: Celebratory, auspicious

Modern/Fusion:
- Acoustic Guitar: Soft, romantic
- Piano: Versatile, emotional depth
- Strings (Violin): Melancholic, romantic
- Synthesizer: Modern, atmospheric

SONG STRUCTURE ANALYSIS:
Common Patterns:
- Verse-Chorus-Verse-Chorus-Bridge-Chorus
- Mukhda (opening) - Antara (verse) - Mukhda (repeat)
- Intro - Verse 1 - Chorus - Verse 2 - Chorus - Bridge - Chorus - Outro

Rhyme Schemes:
- AABB (couplet rhyme)
- ABAB (alternate rhyme)
- ABCB (simple alternate)
- AAAA (monorhyme)
- Free verse (no fixed rhyme)

SYLLABLE & RHYTHM ANALYSIS:
- Count syllables per line
- Identify stress patterns (laghu/guru in Indian, iambic/trochaic in Western)
- Detect natural pauses and breathing points
- Analyze flow consistency`;

      const userPrompt = `Analyze this song/lyrics comprehensively and provide detailed musical suggestions:

LYRICS:
${values.lyrics}

Provide a complete analysis in the following JSON format:
{
  "structure": {
    "totalLines": <number>,
    "sections": ["section names like Verse 1, Chorus, Bridge"],
    "rhymeScheme": "AABB or ABAB etc",
    "syllablePattern": "description of syllable count per line"
  },
  "rhythm": {
    "taal": "suggested taal name (e.g., Teentaal, Keherwa)",
    "tempo": "slow/medium/fast",
    "beats": "beat count (e.g., 16, 8, 6)",
    "flow": "description of rhythmic flow"
  },
  "musicalSuggestions": [
    {
      "section": "section name (e.g., Verse 1, Chorus)",
      "lines": "the actual lines from this section",
      "sur": "suggested swaras (e.g., Sa-Re-Ga-Ma or C-D-E-F)",
      "raag": "suggested raag name with brief description",
      "instrument": "primary instrument suggestion",
      "mood": "emotional quality",
      "notes": "additional musical notes or tips"
    }
  ],
  "overallAnalysis": {
    "genre": "identified genre (e.g., Romantic Ballad, Sufi, Modern Pop)",
    "emotion": "primary emotion detected",
    "recommendations": ["list of 3-5 specific recommendations for improvement or enhancement"]
  }
}

CRITICAL: Return ONLY valid JSON, no markdown, no code blocks, no extra text.`;

      const requestBody = {
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: systemPrompt + '\n\n' + userPrompt
              }
            ]
          }
        ]
      };

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-Id': APP_ID
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      if (!response.body) {
        throw new Error('Response body is null');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data.trim() === '') continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.candidates && parsed.candidates[0]?.content?.parts) {
                const text = parsed.candidates[0].content.parts[0]?.text || '';
                if (text) {
                  fullText += text;
                }
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
        }
      }

      // Extract JSON from response
      const jsonMatch = fullText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysisData = JSON.parse(jsonMatch[0]);
        setAnalysis(analysisData);
        toast.success('Analysis complete! 🎵');
      } else {
        throw new Error('Could not parse analysis response');
      }
    } catch (error) {
      console.error('Error analyzing song:', error);
      toast.error('Failed to analyze. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Music className="w-10 h-10 text-primary" />
            <h1 className="text-4xl xl:text-5xl font-bold gradient-text">
              Sur Suggestion Studio
            </h1>
          </div>
          <p className="text-lg text-warm-muted max-w-2xl mx-auto">
            Submit your own song lyrics and get comprehensive musical analysis with sur, raag, taal, and instrument suggestions
          </p>
        </div>

        {/* Input Form */}
        <Card className="glass-card royal-frame">
          <CardHeader>
            <CardTitle className="text-ivory flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Your Song Lyrics
            </CardTitle>
            <CardDescription className="text-warm-muted">
              Paste your complete song lyrics below. Include all sections (verses, chorus, bridge, etc.)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="lyrics"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-ivory">Song Lyrics</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Enter your song lyrics here...&#10;&#10;Example:&#10;[Verse 1]&#10;Dil mein chhupa ke rakhta hoon&#10;Ek raaz jo tumhara hai&#10;&#10;[Chorus]&#10;Tum ho meri zindagi&#10;Tum ho mera pyaar..."
                          className="min-h-[300px] poetry-text placeholder-elegant"
                          disabled={isAnalyzing}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  size="lg"
                  disabled={isAnalyzing}
                  className="w-full btn-royal"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing Your Song...
                    </>
                  ) : (
                    <>
                      <Music className="w-5 h-5 mr-2" />
                      Analyze & Get Sur Suggestions
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Structure Analysis */}
            <Card className="glass-card royal-frame">
              <CardHeader>
                <CardTitle className="text-ivory">Song Structure Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                    <div className="text-sm text-warm-muted mb-1">Total Lines</div>
                    <div className="text-2xl font-bold text-primary">{analysis.structure.totalLines}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                    <div className="text-sm text-warm-muted mb-1">Rhyme Scheme</div>
                    <div className="text-2xl font-bold text-primary">{analysis.structure.rhymeScheme}</div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                  <div className="text-sm text-warm-muted mb-2">Sections Detected</div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.structure.sections.map((section, idx) => (
                      <span key={idx} className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
                        {section}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                  <div className="text-sm text-warm-muted mb-1">Syllable Pattern</div>
                  <div className="text-ivory">{analysis.structure.syllablePattern}</div>
                </div>
              </CardContent>
            </Card>

            {/* Rhythm Analysis */}
            <Card className="glass-card royal-frame">
              <CardHeader>
                <CardTitle className="text-ivory">Rhythm & Taal Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/30 text-center">
                    <div className="text-sm text-warm-muted mb-1">Taal</div>
                    <div className="text-xl font-bold text-primary">{analysis.rhythm.taal}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/30 text-center">
                    <div className="text-sm text-warm-muted mb-1">Tempo</div>
                    <div className="text-xl font-bold text-primary">{analysis.rhythm.tempo}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/30 text-center">
                    <div className="text-sm text-warm-muted mb-1">Beats</div>
                    <div className="text-xl font-bold text-primary">{analysis.rhythm.beats}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/30 text-center">
                    <div className="text-sm text-warm-muted mb-1">Flow</div>
                    <div className="text-xl font-bold text-primary capitalize">{analysis.rhythm.flow}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Musical Suggestions */}
            <Card className="glass-card royal-frame">
              <CardHeader>
                <CardTitle className="text-ivory">Sur & Raag Suggestions</CardTitle>
                <CardDescription className="text-warm-muted">
                  Detailed musical recommendations for each section
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {analysis.musicalSuggestions.map((suggestion, idx) => (
                  <div key={idx} className="p-6 rounded-lg bg-muted/30 border border-primary/20 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-primary">{suggestion.section}</h3>
                      <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-sm">
                        {suggestion.mood}
                      </span>
                    </div>
                    
                    <div className="p-3 rounded bg-background/50 border border-border/30">
                      <div className="text-sm italic text-warm-muted whitespace-pre-wrap">
                        {suggestion.lines}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                      <div>
                        <div className="text-xs text-warm-muted mb-1">Sur / Notes</div>
                        <div className="text-ivory font-medium">{suggestion.sur}</div>
                      </div>
                      <div>
                        <div className="text-xs text-warm-muted mb-1">Raag</div>
                        <div className="text-ivory font-medium">{suggestion.raag}</div>
                      </div>
                      <div>
                        <div className="text-xs text-warm-muted mb-1">Instrument</div>
                        <div className="text-ivory font-medium">{suggestion.instrument}</div>
                      </div>
                    </div>

                    {suggestion.notes && (
                      <div className="pt-2 border-t border-border/30">
                        <div className="text-xs text-warm-muted mb-1">Additional Notes</div>
                        <div className="text-sm text-ivory">{suggestion.notes}</div>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Overall Analysis */}
            <Card className="glass-card royal-frame">
              <CardHeader>
                <CardTitle className="text-ivory">Overall Analysis & Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                    <div className="text-sm text-warm-muted mb-1">Genre</div>
                    <div className="text-lg font-bold text-primary">{analysis.overallAnalysis.genre}</div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                    <div className="text-sm text-warm-muted mb-1">Primary Emotion</div>
                    <div className="text-lg font-bold text-primary">{analysis.overallAnalysis.emotion}</div>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                  <div className="text-sm text-warm-muted mb-3">Expert Recommendations</div>
                  <ul className="space-y-2">
                    {analysis.overallAnalysis.recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-ivory">
                        <span className="text-primary mt-1">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
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
