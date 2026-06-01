import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Music2,
  Loader2,
  Mic2,
  Sparkles,
  Disc3,
  Play,
  AudioLines,
  Piano,
  Drum,
  Wand2,
  Share2,
  Download,
  Copy,
  Check,
  Volume2,
  Radio,
  Headphones,
  Stars,
  Waves,
  Flame,
  Globe2,
  ChevronRight,
  BadgeCheck,
  Coins,
  Lock,
  ScrollText,
  Orbit,
  Guitar,
} from 'lucide-react';

import {
  motion,
  AnimatePresence,
} from 'framer-motion';

import { toast } from 'sonner';

import { useAuth } from '@/contexts/AuthContext';

import {
  generateMusicalNotes,
} from '@/services/llm';

import {
  subtractCredit,
} from '@/db/api';

import {
  Button,
} from '@/components/ui/button';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Textarea,
} from '@/components/ui/textarea';

import {
  Badge,
} from '@/components/ui/badge';

import {
  Separator,
} from '@/components/ui/separator';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

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

const dropdownClass = `
z-[99999]
rounded-3xl
border
border-primary/10
bg-background/95
backdrop-blur-2xl
shadow-[0_20px_80px_rgba(0,0,0,0.25)]
overflow-hidden
`;

const floatingAnimation = {
  animate: {
    y: [0, -10, 0],
  },

  transition: {
    duration: 5,
    repeat: Infinity,
    ease: 'easeInOut',
  },
};

const SurSuggestionPage = () => {
  const navigate = useNavigate();

  const resultRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const textareaRef =
    useRef<HTMLTextAreaElement | null>(
      null
    );

  const {
    user,
    credits,
  } = useAuth();

  const [
    content,
    setContent,
  ] = useState('');

  const [
    outputLanguage,
    setOutputLanguage,
  ] = useState('English');

  const [
    suggestion,
    setSuggestion,
  ] =
    useState<MusicalAnalysis | null>(
      null
    );

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const [
    copied,
    setCopied,
  ] = useState(false);

  const [
    streamingText,
    setStreamingText,
  ] = useState('');

  const [
    wordCount,
    setWordCount,
  ] = useState(0);

  const isOutOfCredits =
    credits !== null && credits <= 0;

  useEffect(() => {
    const words =
      content
        ?.trim()
        ?.split(/\s+/)
        ?.filter(Boolean)?.length ||
      0;

    setWordCount(words);
  }, [content]);

  useEffect(() => {
    if (
      suggestion &&
      resultRef.current
    ) {
      resultRef.current.scrollIntoView(
        {
          behavior: 'smooth',
          block: 'start',
        }
      );
    }
  }, [suggestion]);

  const musicMoods = useMemo(
    () => [
      'Cinematic Heartbreak',
      'Sufi Romance',
      'Dark Poetry',
      'Midnight Rain',
      'Soulful Ghazal',
      'Dreamy Lo-Fi',
      'Classical Serenity',
      'Bollywood Passion',
    ],
    []
  );

  const cleanAIResponse = (
    text: string
  ) => {
    return text
      ?.replace(/```/g, '')
      ?.replace(/\*\*/g, '')
      ?.replace(/###/g, '')
      ?.trim();
  };

  const handleSuggest =
    async () => {
      if (!content.trim()) {
        toast.error(
          'Please write lyrics or poetry first.'
        );

        return;
      }

      if (!user) {
        toast.error(
          'Please sign in first.'
        );

        return;
      }

      if (isOutOfCredits) {
        toast.error(
          'No credits remaining.'
        );

        navigate('/shop');

        return;
      }

      try {
        setIsLoading(true);

        setSuggestion(null);

        setStreamingText('');

        const result =
          await generateMusicalNotes(
            content,
            'melodic',
            outputLanguage
          );

        if (!result) {
          throw new Error(
            'Empty AI response'
          );
        }

        const success =
          await subtractCredit(
            user.id
          );

        if (!success) {
          throw new Error(
            'Credit deduction failed'
          );
        }

        const cleaned =
          typeof result === 'string'
            ? cleanAIResponse(
                result
              )
            : result;

        setSuggestion(
          cleaned as MusicalAnalysis
        );

        toast.success(
          'Musical blueprint created.'
        );

        window.dispatchEvent(
          new Event(
            'creditsUpdated'
          )
        );
      } catch (error: any) {
        console.error(error);

        if (
          error?.message?.includes(
            '503'
          )
        ) {
          toast.error(
            'AI servers are busy. Try again.'
          );
        } else {
          toast.error(
            'Generation failed.'
          );
        }
      } finally {
        setIsLoading(false);
      }
    };

  const handleCopy = async () => {
    if (!suggestion) return;

    const text = JSON.stringify(
      suggestion,
      null,
      2
    );

    await navigator.clipboard.writeText(
      text
    );

    setCopied(true);

    toast.success(
      'Musical analysis copied.'
    );

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleExport = () => {
    toast.info(
      'PDF export system coming soon.'
    );
  };

  return (
    <div
      className="
      relative
      min-h-screen
      overflow-x-hidden
      bg-gradient-to-b
      from-background
      via-background
      to-primary/5
    "
    >
      {/* BACKGROUND */}
      <div
        className="
        absolute
        inset-0
        pointer-events-none
        overflow-hidden
      "
      >
        <motion.div
          {...floatingAnimation}
          className="
          absolute
          top-[-120px]
          left-1/2
          -translate-x-1/2
          w-[700px]
          h-[700px]
          rounded-full
          bg-primary/10
          blur-[140px]
        "
        />

        <motion.div
          {...floatingAnimation}
          transition={{
            duration: 7,
            repeat: Infinity,
          }}
          className="
          absolute
          bottom-[-150px]
          right-[-100px]
          w-[500px]
          h-[500px]
          rounded-full
          bg-fuchsia-500/10
          blur-[120px]
        "
        />
      </div>

      <div
        className="
        relative
        z-10
        max-w-7xl
        mx-auto
        px-4
        sm:px-6
        lg:px-8
        py-10
        space-y-10
      "
      >
        {/* HERO */}
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          className="
          text-center
          space-y-6
        "
        >
          <div
            className="
            flex
            justify-center
          "
          >
            <div
              className="
              p-6
              rounded-full
              border
              border-primary/20
              bg-primary/10
              backdrop-blur-xl
            "
            >
              <Disc3
                className="
                w-16
                h-16
                text-primary
                animate-spin
                [animation-duration:8s]
              "
              />
            </div>
          </div>

          <div className="space-y-4">
            <h1
              className="
              text-5xl
              sm:text-6xl
              lg:text-7xl
              font-black
              tracking-tight
            "
            >
              Sur Studio
            </h1>

            <p
              className="
              max-w-3xl
              mx-auto
              text-lg
              sm:text-xl
              text-muted-foreground
              leading-relaxed
            "
            >
              Transform poetry into
              cinematic musical
              direction with raag,
              vocal texture,
              instrumentation,
              BPM,
              emotional architecture,
              and soundtrack vision.
            </p>
          </div>

          <div
            className="
            flex
            flex-wrap
            justify-center
            gap-3
          "
          >
            <Badge
              className="
              px-4
              py-2
              rounded-full
            "
            >
              <Music2 className="w-4 h-4 mr-2" />
              AI Music Director
            </Badge>

            <Badge
              variant="secondary"
              className="
              px-4
              py-2
              rounded-full
            "
            >
              <Waves className="w-4 h-4 mr-2" />
              Multi-Language Support
            </Badge>

            <Badge
              variant="outline"
              className="
              px-4
              py-2
              rounded-full
            "
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Gemini 1.5 Flash
            </Badge>
          </div>
        </motion.div>

        {/* MAIN CARD */}
        <Card
          className="
          rounded-[36px]
          border-primary/10
          bg-background/60
          backdrop-blur-2xl
          shadow-[0_20px_120px_rgba(0,0,0,0.25)]
          overflow-visible
        "
        >
          <CardHeader
            className="
            border-b
            border-primary/10
          "
          >
            <div
              className="
              flex
              flex-col
              lg:flex-row
              lg:items-center
              lg:justify-between
              gap-5
            "
            >
              <div>
                <CardTitle
                  className="
                  text-3xl
                  font-black
                  flex
                  items-center
                  gap-3
                "
                >
                  <Mic2 className="w-8 h-8 text-primary" />
                  Musical Direction
                </CardTitle>

                <p
                  className="
                  text-muted-foreground
                  mt-2
                "
                >
                  Analyze lyrical
                  energy and create
                  soundtrack direction.
                </p>
              </div>

              <div
                className="
                flex
                flex-wrap
                gap-3
              "
              >
                <Badge
                  variant="secondary"
                  className="
                  px-4
                  py-2
                "
                >
                  <Coins className="w-4 h-4 mr-2" />
                  Credits:
                  {' '}
                  {credits ?? 0}
                </Badge>

                <Badge
                  variant="outline"
                  className="
                  px-4
                  py-2
                "
                >
                  <ScrollText className="w-4 h-4 mr-2" />
                  Words:
                  {' '}
                  {wordCount}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent
            className="
            p-6
            sm:p-8
            space-y-8
          "
          >
            {/* TEXTAREA */}
            <div className="space-y-4">
              <div
                className="
                flex
                items-center
                justify-between
              "
              >
                <h3
                  className="
                  uppercase
                  tracking-[0.2em]
                  text-sm
                  text-primary
                  font-bold
                "
                >
                  Lyrics / Poetry
                </h3>

                <Badge
                  variant="outline"
                >
                  Cinematic Input
                </Badge>
              </div>

              <Textarea
                ref={textareaRef}
                value={content}
                onChange={(e) =>
                  setContent(
                    e.target.value
                  )
                }
                disabled={isLoading}
                placeholder="
Describe your lyrics, poetry, emotional scenes, heartbreak lines, cinematic verses, philosophical emotions...
                "
                className="
                min-h-[320px]
                resize-none
                rounded-[30px]
                border-primary/10
                bg-background/40
                p-8
                text-lg
                leading-relaxed
                shadow-inner
                overflow-y-auto
              "
              />
            </div>

            {/* SETTINGS */}
            <div
              className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-6
            "
            >
              <div className="space-y-2">
                <label
                  className="
                  text-sm
                  font-semibold
                "
                >
                  Output Language
                </label>

                <Select
                  value={
                    outputLanguage
                  }
                  onValueChange={
                    setOutputLanguage
                  }
                >
                  <SelectTrigger
                    className="
                    h-14
                    rounded-2xl
                  "
                  >
                    <SelectValue />
                  </SelectTrigger>

                  <SelectContent
                    className={
                      dropdownClass
                    }
                    position="popper"
                  >
                    <SelectItem value="English">
                      English
                    </SelectItem>

                    <SelectItem value="Bengali">
                      Bengali
                    </SelectItem>

                    <SelectItem value="Hindi">
                      Hindi
                    </SelectItem>

                    <SelectItem value="Urdu">
                      Urdu
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label
                  className="
                  text-sm
                  font-semibold
                "
                >
                  Suggested Vibes
                </label>

                <div
                  className="
                  flex
                  flex-wrap
                  gap-3
                "
                >
                  {musicMoods.map(
                    (mood) => (
                      <Badge
                        key={mood}
                        variant="secondary"
                        className="
                        rounded-full
                        px-4
                        py-2
                        cursor-pointer
                        hover:scale-105
                        transition-transform
                      "
                        onClick={() =>
                          setContent(
                            (
                              prev
                            ) =>
                              prev +
                              ` ${mood}`
                          )
                        }
                      >
                        {mood}
                      </Badge>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* BUTTON */}
            {isOutOfCredits ? (
              <Button
                type="button"
                onClick={() =>
                  navigate('/shop')
                }
                className="
                h-16
                w-full
                rounded-3xl
                text-lg
                font-black
                bg-destructive
              "
              >
                <Lock className="w-5 h-5 mr-3" />
                No Credits Left
              </Button>
            ) : (
              <Button
                onClick={
                  handleSuggest
                }
                disabled={
                  isLoading ||
                  !content.trim()
                }
                className="
                h-16
                w-full
                rounded-3xl
                text-lg
                font-black
                shadow-2xl
              "
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Composing Soundscape...
                  </>
                ) : (
                  <>
                    <AudioLines className="w-5 h-5 mr-3" />
                    Generate Musical Direction
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* LOADING */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
              }}
            >
              <Card
                className="
                rounded-[32px]
                border-primary/10
                bg-background/50
                backdrop-blur-xl
              "
              >
                <CardContent
                  className="
                  py-16
                  flex
                  flex-col
                  items-center
                  justify-center
                  space-y-8
                "
                >
                  <div
                    className="
                    flex
                    items-end
                    gap-2
                    h-20
                  "
                  >
                    {[...Array(8)].map(
                      (_, i) => (
                        <div
                          key={i}
                          className="
                          w-3
                          rounded-full
                          bg-primary
                          animate-pulse
                        "
                          style={{
                            height: `${
                              20 +
                              i *
                                10
                            }px`,
                            animationDelay: `${i * 0.1}s`,
                          }}
                        />
                      )
                    )}
                  </div>

                  <div className="text-center">
                    <h3
                      className="
                      text-2xl
                      font-bold
                    "
                    >
                      AI Composer Working...
                    </h3>

                    <p
                      className="
                      text-muted-foreground
                      mt-2
                    "
                    >
                      Analyzing emotional
                      cadence, vocal
                      atmosphere, and
                      cinematic music
                      direction.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* RESULTS */}
        <AnimatePresence>
          {suggestion &&
            !isLoading && (
              <motion.div
                ref={resultRef}
                initial={{
                  opacity: 0,
                  y: 40,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="
                space-y-8
              "
              >
                {/* TOP GRID */}
                <div
                  className="
                  grid
                  grid-cols-1
                  md:grid-cols-3
                  gap-6
                "
                >
                  {[
                    {
                      title:
                        'Raag',
                      value:
                        suggestion
                          .core_identity
                          .raag,
                      icon:
                        Music2,
                    },

                    {
                      title:
                        'Tempo',
                      value:
                        suggestion
                          .core_identity
                          .taal_tempo,
                      icon:
                        Radio,
                    },

                    {
                      title:
                        'Instrumentation',
                      value:
                        suggestion
                          .core_identity
                          .instruments,
                      icon:
                        Piano,
                    },
                  ].map(
                    (
                      item,
                      index
                    ) => (
                      <Card
                        key={index}
                        className="
                        rounded-[28px]
                        border-primary/10
                        bg-background/50
                        backdrop-blur-xl
                      "
                      >
                        <CardContent
                          className="
                          p-6
                          space-y-4
                        "
                        >
                          <div
                            className="
                            w-14
                            h-14
                            rounded-2xl
                            bg-primary/10
                            flex
                            items-center
                            justify-center
                          "
                          >
                            <item.icon className="w-7 h-7 text-primary" />
                          </div>

                          <div>
                            <div
                              className="
                              uppercase
                              text-xs
                              tracking-[0.2em]
                              text-muted-foreground
                              mb-2
                            "
                            >
                              {
                                item.title
                              }
                            </div>

                            <div
                              className="
                              text-xl
                              font-bold
                              leading-relaxed
                            "
                            >
                              {
                                item.value
                              }
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>

                {/* HOOK */}
                <Card
                  className="
                  rounded-[32px]
                  border-primary/10
                  bg-primary/5
                  overflow-hidden
                "
                >
                  <CardContent
                    className="
                    p-10
                    flex
                    flex-col
                    md:flex-row
                    gap-8
                    items-center
                  "
                  >
                    <div
                      className="
                      w-24
                      h-24
                      rounded-full
                      bg-primary
                      text-primary-foreground
                      flex
                      items-center
                      justify-center
                      shrink-0
                    "
                    >
                      <Flame className="w-10 h-10" />
                    </div>

                    <div className="space-y-3">
                      <Badge>
                        Main Attraction
                      </Badge>

                      <h2
                        className="
                        text-3xl
                        font-black
                      "
                      >
                        Hook Potential
                      </h2>

                      <p
                        className="
                        text-lg
                        leading-relaxed
                        text-muted-foreground
                      "
                      >
                        {
                          suggestion.attraction_points
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* STANZAS */}
                <div className="space-y-6">
                  <div
                    className="
                    flex
                    items-center
                    gap-3
                  "
                  >
                    <Guitar className="w-7 h-7 text-primary" />

                    <h2
                      className="
                      text-3xl
                      font-black
                    "
                    >
                      Stanza Breakdown
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {suggestion.stanzas.map(
                      (
                        stanza,
                        index
                      ) => (
                        <Card
                          key={index}
                          className="
                          rounded-[32px]
                          border-primary/10
                          bg-background/40
                          overflow-hidden
                        "
                        >
                          <CardContent className="p-0">
                            <div
                              className="
                              grid
                              grid-cols-1
                              lg:grid-cols-12
                            "
                            >
                              <div
                                className="
                                lg:col-span-4
                                p-8
                                bg-primary/5
                                border-b
                                lg:border-b-0
                                lg:border-r
                                border-primary/10
                              "
                              >
                                <Badge
                                  variant="secondary"
                                  className="mb-4"
                                >
                                  Verse
                                  {' '}
                                  {index + 1}
                                </Badge>

                                <p
                                  className="
                                  text-xl
                                  italic
                                  leading-relaxed
                                "
                                >
                                  "
                                  {
                                    stanza.lyrics_snippet
                                  }
                                  "
                                </p>
                              </div>

                              <div
                                className="
                                lg:col-span-8
                                p-8
                                grid
                                grid-cols-1
                                md:grid-cols-3
                                gap-6
                              "
                              >
                                <div className="space-y-2">
                                  <div
                                    className="
                                    uppercase
                                    text-xs
                                    tracking-[0.2em]
                                    text-muted-foreground
                                  "
                                  >
                                    Mood
                                  </div>

                                  <p
                                    className="
                                    leading-relaxed
                                  "
                                  >
                                    {
                                      stanza.mood_shift
                                    }
                                  </p>
                                </div>

                                <div className="space-y-2">
                                  <div
                                    className="
                                    uppercase
                                    text-xs
                                    tracking-[0.2em]
                                    text-muted-foreground
                                  "
                                  >
                                    Swaras
                                  </div>

                                  <p
                                    className="
                                    leading-relaxed
                                  "
                                  >
                                    {
                                      stanza.swaras
                                    }
                                  </p>
                                </div>

                                <div className="space-y-2">
                                  <div
                                    className="
                                    uppercase
                                    text-xs
                                    tracking-[0.2em]
                                    text-muted-foreground
                                  "
                                  >
                                    Vocals
                                  </div>

                                  <p
                                    className="
                                    leading-relaxed
                                  "
                                  >
                                    {
                                      stanza.vocals
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    )}
                  </div>
                </div>

                {/* NOTES */}
                <Card
                  className="
                  rounded-[32px]
                  border-primary/10
                  bg-background/50
                "
                >
                  <CardContent
                    className="
                    p-8
                    flex
                    flex-col
                    md:flex-row
                    gap-6
                  "
                  >
                    <div
                      className="
                      w-16
                      h-16
                      rounded-2xl
                      bg-primary/10
                      flex
                      items-center
                      justify-center
                      shrink-0
                    "
                    >
                      <Stars className="w-8 h-8 text-primary" />
                    </div>

                    <div className="space-y-3">
                      <Badge>
                        Director Notes
                      </Badge>

                      <p
                        className="
                        text-lg
                        leading-relaxed
                        text-muted-foreground
                      "
                      >
                        {
                          suggestion.maestro_notes
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* ACTIONS */}
                <div
                  className="
                  flex
                  flex-col
                  md:flex-row
                  gap-4
                "
                >
                  <Button
                    variant="outline"
                    onClick={
                      handleCopy
                    }
                    className="
                    h-14
                    flex-1
                    rounded-2xl
                  "
                  >
                    {copied ? (
                      <>
                        <Check className="w-5 h-5 mr-2" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5 mr-2" />
                        Copy Result
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={
                      handleExport
                    }
                    className="
                    h-14
                    flex-1
                    rounded-2xl
                  "
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Export PDF
                  </Button>

                  <Button
                    variant="outline"
                    className="
                    h-14
                    flex-1
                    rounded-2xl
                  "
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Share
                  </Button>
                </div>
              </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SurSuggestionPage;