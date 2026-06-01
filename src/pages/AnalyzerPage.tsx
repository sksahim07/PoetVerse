import { useEffect, useMemo, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import {
  Search,
  Loader2,
  Feather,
  ScrollText,
  Copy,
  Sparkles,
  BookOpen,
  Coins,
  Crown,
  BrainCircuit,
  Languages,
  PenSquare,
  AudioLines,
  Quote,
  Wand2,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Stars,
  Flame,
  ScanSearch,
} from 'lucide-react';

import {
  motion,
  AnimatePresence,
} from 'framer-motion';

import { toast } from 'sonner';

import {
  analyzePoem,
} from '@/services/llm';

import {
  subtractCredit,
  addCredits,
} from '@/db/api';

import {
  useAuth,
} from '@/contexts/AuthContext';

import {
  Button,
} from '@/components/ui/button';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const languages = [
  {
    value: 'bengali',
    label: 'Bengali • বাংলা',
  },
  {
    value: 'english',
    label: 'English',
  },
  {
    value: 'urdu',
    label: 'Urdu • اردو',
  },
  {
    value: 'hindi',
    label: 'Hindi • हिन्दी',
  },
];

const analysisModes = [
  {
    title: 'Symbolism',
    icon: BrainCircuit,
  },
  {
    title: 'Emotion Layers',
    icon: Flame,
  },
  {
    title: 'Philosophical Depth',
    icon: Stars,
  },
  {
    title: 'Literary Structure',
    icon: Feather,
  },
];

const quickPrompts = [
  'Analyze hidden meanings',
  'Break emotional architecture',
  'Find metaphorical depth',
  'Critique literary quality',
  'Analyze rhythm and cadence',
  'Reveal symbolism',
];

const dropdownClass = `
z-[99999]
rounded-2xl
border
border-primary/10
bg-background/95
backdrop-blur-2xl
shadow-2xl
overflow-hidden
`;

export const AnalyzerPage = () => {
  const navigate = useNavigate();

  const { user, credits } =
    useAuth();

  const textareaRef =
    useRef<HTMLTextAreaElement | null>(
      null
    );

  const [content, setContent] =
    useState('');

  const [language, setLanguage] =
    useState('bengali');

  const [analysis, setAnalysis] =
    useState<string | null>(null);

  const [streamingText, setStreamingText] =
    useState('');

  const [isAnalyzing, setIsAnalyzing] =
    useState(false);

  const [copied, setCopied] =
    useState(false);

  const [wordCount, setWordCount] =
    useState(0);

  const [charCount, setCharCount] =
    useState(0);

  const [readingTime, setReadingTime] =
    useState(0);

  const isOutOfCredits =
    credits !== null &&
    credits <= 0;

  useEffect(() => {
    const words =
      content
        ?.trim()
        ?.split(/\s+/)
        ?.filter(Boolean)?.length || 0;

    setWordCount(words);

    setCharCount(content.length);

    setReadingTime(
      Math.max(
        1,
        Math.ceil(words / 180)
      )
    );
  }, [content]);

  const intensityLevel =
    useMemo(() => {
      if (wordCount < 20)
        return 'Minimal';

      if (wordCount < 80)
        return 'Moderate';

      if (wordCount < 200)
        return 'Deep';

      return 'Epic';
    }, [wordCount]);

  const handleAnalyze =
    async () => {
      if (!content.trim()) {
        toast.error(
          'The Analyzer requires verses.'
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
          'No credits left.'
        );

        navigate('/shop');

        return;
      }

      try {
        setAnalysis(null);

        setStreamingText('');

        setIsAnalyzing(true);

        const deducted =
          await subtractCredit(
            user.id
          );

        if (!deducted) {
          toast.error(
            'Unable to consume credit.'
          );

          return;
        }

        window.dispatchEvent(
          new Event(
            'creditsUpdated'
          )
        );

        const result =
          await analyzePoem(
            content,
            language
          );

        setStreamingText(result);

        setTimeout(() => {
          setAnalysis(result);
        }, 500);

        toast.success(
          'Analysis complete.'
        );
      } catch (error: any) {
        console.error(
          'Analysis Error:',
          error
        );

        if (user?.id) {
          await addCredits(
            user.id,
            1
          );

          window.dispatchEvent(
            new Event(
              'creditsUpdated'
            )
          );
        }

        if (
          error?.message?.includes(
            '503'
          )
        ) {
          toast.error(
            'AI servers are overloaded. Please retry.'
          );
        } else {
          toast.error(
            'Literary analysis failed.'
          );
        }
      } finally {
        setIsAnalyzing(false);
      }
    };

  const handleCopy = async () => {
    if (!analysis) return;

    try {
      await navigator.clipboard.writeText(
        analysis
      );

      setCopied(true);

      toast.success(
        'Analysis copied.'
      );

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      toast.error(
        'Copy failed.'
      );
    }
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
      {/* Background Effects */}

      <div
        className="
        absolute
        inset-0
        pointer-events-none
      "
      >
        <div
          className="
          absolute
          top-[-120px]
          left-1/2
          -translate-x-1/2
          w-[900px]
          h-[900px]
          rounded-full
          bg-primary/10
          blur-[180px]
        "
        />

        <div
          className="
          absolute
          bottom-[-250px]
          right-[-120px]
          w-[500px]
          h-[500px]
          rounded-full
          bg-primary/5
          blur-[160px]
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
        {/* Hero */}

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
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
              p-5
              rounded-full
              bg-primary/10
              border
              border-primary/20
              backdrop-blur-2xl
            "
            >
              <Search
                className="
                w-14
                h-14
                text-primary
              "
              />
            </div>
          </div>

          <div
            className="
            space-y-4
          "
          >
            <h1
              className="
              text-5xl
              sm:text-6xl
              lg:text-7xl
              font-black
              tracking-tight
              leading-none
            "
            >
              Literary Analyzer
            </h1>

            <p
              className="
              text-lg
              text-muted-foreground
              max-w-3xl
              mx-auto
              leading-relaxed
            "
            >
              Analyze emotional
              architecture,
              symbolism,
              philosophical layers,
              cadence,
              rhythm,
              literary structure,
              and hidden meanings
              with AI-powered precision.
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
              <BrainCircuit className="w-4 h-4 mr-2" />
              AI Literary Engine
            </Badge>

            <Badge
              variant="secondary"
              className="
              px-4
              py-2
              rounded-full
            "
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Symbolism Detection
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
              Philosophical Analysis
            </Badge>
          </div>
        </motion.div>

        {/* Top Stats */}

        <div
          className="
          grid
          grid-cols-2
          lg:grid-cols-4
          gap-4
        "
        >
          <Card
            className="
            rounded-3xl
            border-primary/10
            bg-background/50
            backdrop-blur-2xl
          "
          >
            <CardContent
              className="
              p-6
            "
            >
              <div
                className="
                flex
                items-center
                justify-between
              "
              >
                <div>
                  <div
                    className="
                    text-sm
                    text-muted-foreground
                  "
                  >
                    Credits
                  </div>

                  <div
                    className="
                    text-3xl
                    font-black
                  "
                  >
                    {credits ?? 0}
                  </div>
                </div>

                <Coins className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card
            className="
            rounded-3xl
            border-primary/10
            bg-background/50
            backdrop-blur-2xl
          "
          >
            <CardContent className="p-6">
              <div
                className="
                flex
                items-center
                justify-between
              "
              >
                <div>
                  <div
                    className="
                    text-sm
                    text-muted-foreground
                  "
                  >
                    Words
                  </div>

                  <div
                    className="
                    text-3xl
                    font-black
                  "
                  >
                    {wordCount}
                  </div>
                </div>

                <PenSquare className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card
            className="
            rounded-3xl
            border-primary/10
            bg-background/50
            backdrop-blur-2xl
          "
          >
            <CardContent className="p-6">
              <div
                className="
                flex
                items-center
                justify-between
              "
              >
                <div>
                  <div
                    className="
                    text-sm
                    text-muted-foreground
                  "
                  >
                    Reading Time
                  </div>

                  <div
                    className="
                    text-3xl
                    font-black
                  "
                  >
                    {readingTime}m
                  </div>
                </div>

                <ScrollText className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card
            className="
            rounded-3xl
            border-primary/10
            bg-background/50
            backdrop-blur-2xl
          "
          >
            <CardContent className="p-6">
              <div
                className="
                flex
                items-center
                justify-between
              "
              >
                <div>
                  <div
                    className="
                    text-sm
                    text-muted-foreground
                  "
                  >
                    Intensity
                  </div>

                  <div
                    className="
                    text-3xl
                    font-black
                  "
                  >
                    {intensityLevel}
                  </div>
                </div>

                <Flame className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid */}

        <div
          className="
          grid
          grid-cols-1
          xl:grid-cols-12
          gap-8
          items-start
        "
        >
          {/* LEFT */}

          <Card
            className="
            xl:col-span-5
            rounded-[32px]
            border-primary/10
            bg-background/60
            backdrop-blur-2xl
            shadow-[0_20px_100px_rgba(0,0,0,0.25)]
            overflow-visible
          "
          >
            <CardHeader
              className="
              border-b
              border-primary/10
            "
            >
              <CardTitle
                className="
                text-2xl
                font-black
                flex
                items-center
                gap-3
              "
              >
                <Feather className="w-7 h-7 text-primary" />
                The Manuscript
              </CardTitle>

              <CardDescription>
                Paste your poetry,
                ghazal,
                shayari,
                lyrics,
                philosophical writing,
                or emotional verses.
              </CardDescription>
            </CardHeader>

            <CardContent
              className="
              p-6
              space-y-6
            "
            >
              <Textarea
                ref={(element) => {
                  textareaRef.current =
                    element;
                }}
                placeholder="Write your verses, poetry, heartbreak, philosophical thoughts, midnight emotions..."
                value={content}
                onChange={(e) =>
                  setContent(
                    e.target.value
                  )
                }
                disabled={isAnalyzing}
                className="
                min-h-[420px]
                resize-none
                rounded-3xl
                border-primary/10
                bg-background/40
                p-6
                text-lg
                leading-relaxed
                shadow-inner
              "
              />

              <div
                className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-5
              "
              >
                <div
                  className="
                  space-y-2
                "
                >
                  <div
                    className="
                    text-xs
                    uppercase
                    tracking-[0.2em]
                    text-primary
                  "
                  >
                    Output Language
                  </div>

                  <Select
                    value={language}
                    onValueChange={
                      setLanguage
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
                      {languages.map(
                        (lang) => (
                          <SelectItem
                            key={
                              lang.value
                            }
                            value={
                              lang.value
                            }
                          >
                            {
                              lang.label
                            }
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div
                  className="
                  flex
                  items-end
                "
                >
                  {isOutOfCredits ? (
                    <Button
                      type="button"
                      onClick={() =>
                        navigate(
                          '/shop'
                        )
                      }
                      className="
                      h-14
                      w-full
                      rounded-2xl
                      bg-destructive
                      text-base
                      font-bold
                    "
                    >
                      <Coins className="w-5 h-5 mr-2" />
                      Top-Up Required
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={
                        handleAnalyze
                      }
                      disabled={
                        isAnalyzing ||
                        !content.trim()
                      }
                      className="
                      h-14
                      w-full
                      rounded-2xl
                      text-base
                      font-black
                    "
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Invoke Analysis
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>

              <Separator />

              <div
                className="
                grid
                grid-cols-2
                md:grid-cols-3
                gap-3
              "
              >
                {quickPrompts.map(
                  (prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() =>
                        setContent(
                          (prev) =>
                            prev +
                            '\n' +
                            prompt
                        )
                      }
                      className="
                      rounded-2xl
                      border
                      border-primary/10
                      bg-background/40
                      p-3
                      text-sm
                      transition-all
                      hover:border-primary/30
                      hover:bg-primary/5
                    "
                    >
                      {prompt}
                    </button>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          {/* RIGHT */}

          <Card
            className="
            xl:col-span-7
            rounded-[32px]
            border-primary/10
            bg-background/60
            backdrop-blur-2xl
            shadow-[0_20px_100px_rgba(0,0,0,0.25)]
            min-h-[850px]
            overflow-hidden
          "
          >
            <CardHeader
              className="
              border-b
              border-primary/10
              flex
              flex-row
              items-center
              justify-between
            "
            >
              <div>
                <CardTitle
                  className="
                  text-2xl
                  font-black
                  flex
                  items-center
                  gap-3
                "
                >
                  <BookOpen className="w-7 h-7 text-primary" />
                  Maestro's Critique
                </CardTitle>

                <CardDescription className="mt-2">
                  Deep literary,
                  emotional,
                  and symbolic analysis.
                </CardDescription>
              </div>

              {analysis && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={
                    handleCopy
                  }
                  className="
                  rounded-2xl
                "
                >
                  {copied ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </Button>
              )}
            </CardHeader>

            <CardContent
              className="
              p-8
            "
            >
              {!analysis &&
                !isAnalyzing && (
                  <div
                    className="
                    h-full
                    min-h-[650px]
                    flex
                    flex-col
                    items-center
                    justify-center
                    text-center
                    space-y-8
                  "
                  >
                    <div
                      className="
                      p-8
                      rounded-full
                      bg-primary/5
                      border
                      border-primary/10
                    "
                    >
                      <ScanSearch className="w-20 h-20 text-primary/40" />
                    </div>

                    <div
                      className="
                      space-y-4
                    "
                    >
                      <h2
                        className="
                        text-3xl
                        font-black
                      "
                      >
                        Awaiting Manuscript
                      </h2>

                      <p
                        className="
                        text-muted-foreground
                        max-w-xl
                        mx-auto
                        leading-relaxed
                      "
                      >
                        Your literary
                        analysis will
                        appear here with
                        deep emotional,
                        symbolic,
                        and philosophical
                        breakdowns.
                      </p>
                    </div>

                    <div
                      className="
                      grid
                      grid-cols-2
                      gap-4
                      max-w-xl
                    "
                    >
                      {analysisModes.map(
                        (
                          mode
                        ) => {
                          const Icon =
                            mode.icon;

                          return (
                            <div
                              key={
                                mode.title
                              }
                              className="
                              rounded-2xl
                              border
                              border-primary/10
                              bg-background/40
                              p-5
                              text-left
                            "
                            >
                              <Icon className="w-6 h-6 text-primary mb-3" />

                              <div
                                className="
                                font-bold
                              "
                              >
                                {
                                  mode.title
                                }
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}

              <AnimatePresence>
                {isAnalyzing && (
                  <motion.div
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 1,
                    }}
                    exit={{
                      opacity: 0,
                    }}
                    className="
                    min-h-[650px]
                    flex
                    flex-col
                    items-center
                    justify-center
                    text-center
                    space-y-8
                  "
                  >
                    <div
                      className="
                      relative
                    "
                    >
                      <Loader2
                        className="
                        w-24
                        h-24
                        animate-spin
                        text-primary/20
                      "
                      />

                      <Sparkles
                        className="
                        absolute
                        top-1/2
                        left-1/2
                        -translate-x-1/2
                        -translate-y-1/2
                        w-10
                        h-10
                        text-primary
                        animate-pulse
                      "
                      />
                    </div>

                    <div
                      className="
                      space-y-3
                    "
                    >
                      <h2
                        className="
                        text-3xl
                        font-black
                      "
                      >
                        Analyzing Literary Depth
                      </h2>

                      <p
                        className="
                        text-muted-foreground
                        italic
                      "
                      >
                        Consulting metaphorical structures,
                        symbolism,
                        cadence,
                        and emotional layers...
                      </p>
                    </div>

                    {streamingText && (
                      <div
                        className="
                        max-w-3xl
                        mx-auto
                        rounded-3xl
                        border
                        border-primary/10
                        bg-background/40
                        p-8
                        text-left
                        whitespace-pre-wrap
                        leading-[2]
                      "
                      >
                        {streamingText}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {analysis &&
                  !isAnalyzing && (
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
                        duration: 0.6,
                      }}
                      className="
                      space-y-8
                    "
                    >
                      <div
                        className="
                        flex
                        flex-wrap
                        gap-3
                      "
                      >
                        <Badge>
                          <BrainCircuit className="w-4 h-4 mr-2" />
                          Emotional Analysis
                        </Badge>

                        <Badge variant="secondary">
                          <Stars className="w-4 h-4 mr-2" />
                          Symbolism
                        </Badge>

                        <Badge variant="outline">
                          <BookOpen className="w-4 h-4 mr-2" />
                          Literary Breakdown
                        </Badge>
                      </div>

                      <div
                        className="
                        rounded-[32px]
                        border
                        border-primary/10
                        bg-primary/5
                        p-8
                        md:p-10
                        whitespace-pre-wrap
                        leading-[2]
                        text-lg
                        text-foreground/90
                      "
                      >
                        {analysis}
                      </div>
                    </motion.div>
                  )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalyzerPage;