// ===============================================
// PoemWorkspace.tsx
// Ultra Premium AI Poetry Workspace
// Professional Editing + AI Feedback + Literary Tools
// ===============================================

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  Sparkles,
  Wand2,
  BrainCircuit,
  Copy,
  Download,
  Save,
  RefreshCcw,
  BookOpen,
  Clock3,
  Quote,
  Feather,
  Crown,
  Music4,
  Check,
  Loader2,
  PenSquare,
  Lightbulb,
  MessageSquare,
  Stars,
  Flame,
  Sigma,
  ScrollText,
  Languages,
  Eye,
  HeartCrack,
  Mic2,
  ClipboardCheck,
  BarChart3,
  PencilLine,
  Gem,
  Bookmark,
  ChevronRight,
} from "lucide-react";

import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import { Separator } from "@/components/ui/separator";

import { Textarea } from "@/components/ui/textarea";

import { Input } from "@/components/ui/input";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  improvePoem,
  analyzePoem,
  analyzePoemScores,
  generateMusicalNotes,
} from "@/services/llm";

import { cn } from "@/lib/utils";

// ===============================================
// TYPES
// ===============================================

interface PoemWorkspaceProps {
  initialPoem: string;

  onPoemChange?: (
    poem: string
  ) => void;

  musicalNotes?: any;

  language?: string;
  emotion?: string;
  poetryType?: string;
}

interface SuggestionItem {
  title: string;
  description: string;
}

interface LiteraryScores {
  emotional_score: number;
  metaphor_score: number;
  originality_score: number;
  rhythm_score: number;
  literary_score: number;
  philosophical_score: number;
}

// ===============================================
// CONSTANTS
// ===============================================

const quickSuggestions: SuggestionItem[] =
  [
    {
      title:
        "Make it darker",
      description:
        "Add emotional heaviness, haunting imagery, and restrained pain.",
    },

    {
      title:
        "More philosophical",
      description:
        "Add existential undertones and layered symbolic meaning.",
    },

    {
      title:
        "Simplify words",
      description:
        "Use simpler language while preserving emotional beauty.",
    },

    {
      title:
        "More cinematic",
      description:
        "Create visual scenes, atmosphere, and immersive storytelling.",
    },

    {
      title:
        "Improve rhythm",
      description:
        "Enhance cadence, pacing, and poetic flow naturally.",
    },

    {
      title:
        "More memorable lines",
      description:
        "Add quotable, emotionally striking poetic moments.",
    },
  ];

// ===============================================
// HELPERS
// ===============================================

function countWords(text: string) {
  return text
    ?.trim()
    ?.split(/\s+/)
    ?.filter(Boolean).length;
}

function countLines(text: string) {
  return text
    ?.split("\n")
    ?.filter(
      (line) =>
        line.trim() !== ""
    ).length;
}

function getReadingTime(
  text: string
) {
  return Math.max(
    1,
    Math.ceil(
      countWords(text) / 180
    )
  );
}

function scoreColor(
  value: number
) {
  if (value >= 90)
    return "text-emerald-500";

  if (value >= 75)
    return "text-primary";

  if (value >= 60)
    return "text-yellow-500";

  return "text-red-500";
}

// ===============================================
// SCORE CARD
// ===============================================

interface ScoreCardProps {
  label: string;
  value: number;
  icon: any;
}

const ScoreCard = ({
  label,
  value,
  icon: Icon,
}: ScoreCardProps) => {
  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      className="
      rounded-3xl
      border
      border-primary/10
      bg-background/50
      p-5
    "
    >
      <div
        className="
        mb-4
        flex
        items-center
        justify-between
      "
      >
        <div
          className="
          flex
          items-center
          gap-2
        "
        >
          <Icon className="h-5 w-5 text-primary" />

          <div
            className="
            text-sm
            font-medium
          "
          >
            {label}
          </div>
        </div>

        <div
          className={cn(
            "text-xl font-black",
            scoreColor(value)
          )}
        >
          {value}
        </div>
      </div>

      <div
        className="
        h-2
        overflow-hidden
        rounded-full
        bg-primary/10
      "
      >
        <motion.div
          initial={{
            width: 0,
          }}
          animate={{
            width: `${value}%`,
          }}
          transition={{
            duration: 1,
          }}
          className="
          h-full
          rounded-full
          bg-primary
        "
        />
      </div>
    </motion.div>
  );
};

// ===============================================
// MAIN COMPONENT
// ===============================================

export default function PoemWorkspace({
  initialPoem,

  onPoemChange,

  language = "English",

  emotion = "emotional",

  poetryType = "poem",
}: PoemWorkspaceProps) {
  // =============================================
  // STATES
  // =============================================

  const [
    poem,
    setPoem,
  ] = useState(initialPoem);

  const [
    feedbackPrompt,
    setFeedbackPrompt,
  ] = useState("");

  const [
    aiAnalysis,
    setAiAnalysis,
  ] = useState("");

  const [
    isImproving,
    setIsImproving,
  ] = useState(false);

  const [
    isAnalyzing,
    setIsAnalyzing,
  ] = useState(false);

  const [
    isGeneratingMusic,
    setIsGeneratingMusic,
  ] = useState(false);

  const [
    scores,
    setScores,
  ] =
    useState<LiteraryScores | null>(
      null
    );

  const [
    musicalNotes,
    setMusicalNotes,
  ] = useState<any>(null);

  const [
    aiSuggestions,
    setAiSuggestions,
  ] = useState<string[]>([]);

  const [
    quoteLines,
    setQuoteLines,
  ] = useState<string[]>([]);

  const textareaRef =
    useRef<HTMLTextAreaElement | null>(
      null
    );

  // =============================================
  // MEMOS
  // =============================================

  const wordCount = useMemo(
    () => countWords(poem),
    [poem]
  );

  const lineCount = useMemo(
    () => countLines(poem),
    [poem]
  );

  const readingTime = useMemo(
    () => getReadingTime(poem),
    [poem]
  );

  // =============================================
  // AUTO EXPAND
  // =============================================

  useEffect(() => {
    const textarea =
      textareaRef.current;

    if (!textarea) return;

    textarea.style.height =
      "auto";

    textarea.style.height =
      textarea.scrollHeight +
      "px";
  }, [poem]);

  // =============================================
  // ANALYZE SCORES
  // =============================================

  useEffect(() => {
    const run = async () => {
      try {
        const result =
          await analyzePoemScores(
            poem
          );

        setScores(result);
      } catch (error) {
        console.error(error);
      }
    };

    if (
      poem &&
      poem.length > 50
    ) {
      run();
    }
  }, [poem]);

  // =============================================
  // COPY
  // =============================================

  const handleCopy =
    async () => {
      try {
        await navigator.clipboard.writeText(
          poem
        );

        toast.success(
          "Poem copied successfully."
        );
      } catch {
        toast.error(
          "Copy failed."
        );
      }
    };

  // =============================================
  // DOWNLOAD
  // =============================================

  const handleDownload =
    () => {
      const blob = new Blob(
        [poem],
        {
          type: "text/plain",
        }
      );

      const url =
        URL.createObjectURL(
          blob
        );

      const link =
        document.createElement(
          "a"
        );

      link.href = url;

      link.download =
        "poetverse-poem.txt";

      link.click();

      URL.revokeObjectURL(url);

      toast.success(
        "Poem downloaded."
      );
    };

  // =============================================
  // IMPROVE
  // =============================================

  const handleImprove =
    async (
      customPrompt?: string
    ) => {
      const finalPrompt =
        customPrompt ||
        feedbackPrompt;

      if (!finalPrompt) {
        toast.error(
          "Write feedback first."
        );

        return;
      }

      try {
        setIsImproving(true);

        const result =
          await improvePoem(
            poem,
            finalPrompt,
            language
          );

        setPoem(
          result.improved_poem
        );

        setAiSuggestions(
          result.suggestions ||
            []
        );

        setQuoteLines(
          result.quote_lines ||
            []
        );

        toast.success(
          "Poem improved successfully."
        );
      } catch (error) {
        console.error(error);

        toast.error(
          "Improvement failed."
        );
      } finally {
        setIsImproving(false);
      }
    };

  // =============================================
  // ANALYZE
  // =============================================

  const handleAnalyze =
    async () => {
      try {
        setIsAnalyzing(true);

        const result =
          await analyzePoem(
            poem,
            language
          );

        setAiAnalysis(result);

        toast.success(
          "Literary analysis completed."
        );
      } catch (error) {
        console.error(error);

        toast.error(
          "Analysis failed."
        );
      } finally {
        setIsAnalyzing(false);
      }
    };

  // =============================================
  // MUSICAL NOTES
  // =============================================

  const handleMusic =
    async () => {
      try {
        setIsGeneratingMusic(
          true
        );

        const result =
          await generateMusicalNotes(
            poem,
            emotion,
            language
          );

        setMusicalNotes(result);

        toast.success(
          "Musical guidance generated."
        );
      } catch (error) {
        console.error(error);

        toast.error(
          "Music generation failed."
        );
      } finally {
        setIsGeneratingMusic(
          false
        );
      }
    };

  // =============================================
  // RENDER
  // =============================================

  return (
    <div className="space-y-8">
      {/* =========================================
          HEADER
      ========================================= */}

      <Card
        className="
        overflow-hidden
        rounded-[36px]
        border-primary/10
        bg-background/70
        shadow-[0_25px_120px_rgba(0,0,0,0.35)]
        backdrop-blur-3xl
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
            gap-6
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
          >
            <div>
              <CardTitle
                className="
                flex
                items-center
                gap-3
                text-4xl
                font-black
              "
              >
                <Crown className="h-9 w-9 text-primary" />
                Poem Workspace
              </CardTitle>

              <CardDescription
                className="
                mt-2
                max-w-3xl
                text-base
                leading-relaxed
              "
              >
                Edit, refine,
                analyze, improve,
                and transform your
                poetry with advanced
                AI literary tools,
                emotional feedback,
                and cinematic writing
                intelligence.
              </CardDescription>
            </div>

            <div
              className="
              flex
              flex-wrap
              items-center
              gap-3
            "
            >
              <Badge
                className="
                rounded-full
                px-4
                py-2
              "
              >
                <BookOpen className="mr-2 h-4 w-4" />
                {wordCount} Words
              </Badge>

              <Badge
                variant="secondary"
                className="
                rounded-full
                px-4
                py-2
              "
              >
                <Feather className="mr-2 h-4 w-4" />
                {lineCount} Lines
              </Badge>

              <Badge
                variant="outline"
                className="
                rounded-full
                px-4
                py-2
              "
              >
                <Clock3 className="mr-2 h-4 w-4" />
                {readingTime}m Read
              </Badge>
            </div>
          </div>
        </CardHeader>

        {/* =====================================
            CONTENT
        ===================================== */}

        <CardContent className="p-8">
          {/* ===================================
              TOOLBAR
          =================================== */}

          <div
            className="
            mb-6
            flex
            flex-wrap
            items-center
            gap-3
          "
          >
            <Button
              onClick={
                handleCopy
              }
              variant="outline"
              className="
              rounded-2xl
            "
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy
            </Button>

            <Button
              onClick={
                handleDownload
              }
              variant="outline"
              className="
              rounded-2xl
            "
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>

            <Button
              onClick={
                handleAnalyze
              }
              disabled={
                isAnalyzing
              }
              variant="outline"
              className="
              rounded-2xl
            "
            >
              {isAnalyzing ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <BrainCircuit className="mr-2 h-4 w-4" />
              )}

              Analyze
            </Button>

            <Button
              onClick={
                handleMusic
              }
              disabled={
                isGeneratingMusic
              }
              variant="outline"
              className="
              rounded-2xl
            "
            >
              {isGeneratingMusic ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Music4 className="mr-2 h-4 w-4" />
              )}

              Musical Notes
            </Button>
          </div>

          {/* ===================================
              TEXTAREA
          =================================== */}

          <div
            className="
            rounded-[36px]
            border
            border-primary/10
            bg-background/40
            p-6
          "
          >
            <Textarea
              ref={textareaRef}
              value={poem}
              onChange={(e) =>
                setPoem(
                  e.target.value
                )
              }
              placeholder="Your poetry masterpiece..."
              className="
              min-h-[420px]
              resize-none
              border-0
              bg-transparent
              p-0
              font-serif
              text-[1.1rem]
              leading-[2.1]
              shadow-none
              focus-visible:ring-0
            "
            />
          </div>

          {/* ===================================
              SCORES
          =================================== */}

          {scores && (
            <div
              className="
              mt-8
              grid
              grid-cols-1
              gap-5
              md:grid-cols-2
              xl:grid-cols-3
            "
            >
              <ScoreCard
                label="Emotion"
                value={
                  scores.emotional_score
                }
                icon={HeartCrack}
              />

              <ScoreCard
                label="Metaphors"
                value={
                  scores.metaphor_score
                }
                icon={Gem}
              />

              <ScoreCard
                label="Originality"
                value={
                  scores.originality_score
                }
                icon={Sparkles}
              />

              <ScoreCard
                label="Rhythm"
                value={
                  scores.rhythm_score
                }
                icon={Music4}
              />

              <ScoreCard
                label="Literary"
                value={
                  scores.literary_score
                }
                icon={Crown}
              />

              <ScoreCard
                label="Philosophy"
                value={
                  scores.philosophical_score
                }
                icon={Sigma}
              />
            </div>
          )}

          {/* ===================================
              FEEDBACK
          =================================== */}

          <div className="mt-10">
            <div
              className="
              mb-4
              flex
              items-center
              gap-3
            "
            >
              <MessageSquare className="h-6 w-6 text-primary" />

              <h3
                className="
                text-2xl
                font-black
              "
              >
                AI Feedback &
                Improvement
              </h3>
            </div>

            <div
              className="
              rounded-[34px]
              border
              border-primary/10
              bg-background/40
              p-6
            "
            >
              <Textarea
                value={
                  feedbackPrompt
                }
                onChange={(e) =>
                  setFeedbackPrompt(
                    e.target.value
                  )
                }
                placeholder="Tell the AI how to improve the poem... (example: make it darker, more philosophical, more cinematic, simplify the vocabulary, improve rhythm...)"
                className="
                min-h-[140px]
                resize-none
                rounded-3xl
              "
              />

              {/* QUICK ACTIONS */}
              <div
                className="
                mt-5
                flex
                flex-wrap
                gap-3
              "
              >
                {quickSuggestions.map(
                  (
                    suggestion
                  ) => (
                    <button
                      key={
                        suggestion.title
                      }
                      type="button"
                      onClick={() =>
                        handleImprove(
                          suggestion.description
                        )
                      }
                      className="
                      rounded-full
                      border
                      border-primary/10
                      bg-background/60
                      px-4
                      py-2
                      text-sm
                      transition-all
                      hover:border-primary/30
                      hover:bg-primary/10
                    "
                    >
                      {
                        suggestion.title
                      }
                    </button>
                  )
                )}
              </div>

              <Button
                disabled={
                  isImproving
                }
                onClick={() =>
                  handleImprove()
                }
                className="
                mt-6
                h-14
                rounded-2xl
                px-8
                text-base
                font-bold
              "
              >
                {isImproving ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Improving...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-5 w-5" />
                    Improve Poem
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* ===================================
              TABS
          =================================== */}

          <Tabs
            defaultValue="analysis"
            className="mt-10"
          >
            <TabsList
              className="
              h-auto
              flex-wrap
              rounded-2xl
              p-2
            "
            >
              <TabsTrigger value="analysis">
                Literary Analysis
              </TabsTrigger>

              <TabsTrigger value="quotes">
                Quote Lines
              </TabsTrigger>

              <TabsTrigger value="suggestions">
                Suggestions
              </TabsTrigger>

              <TabsTrigger value="music">
                Musical Notes
              </TabsTrigger>
            </TabsList>

            {/* ANALYSIS */}

            <TabsContent value="analysis">
              <Card
                className="
                mt-6
                rounded-[32px]
                border-primary/10
              "
              >
                <CardContent className="p-8">
                  {aiAnalysis ? (
                    <div
                      className="
                      whitespace-pre-wrap
                      leading-[2]
                    "
                    >
                      {aiAnalysis}
                    </div>
                  ) : (
                    <div
                      className="
                      py-16
                      text-center
                    "
                    >
                      <BrainCircuit
                        className="
                        mx-auto
                        mb-4
                        h-12
                        w-12
                        text-primary
                      "
                      />

                      <h3
                        className="
                        text-xl
                        font-bold
                      "
                      >
                        No Analysis Yet
                      </h3>

                      <p
                        className="
                        mt-2
                        text-muted-foreground
                      "
                      >
                        Run AI literary
                        analysis to deeply
                        inspect emotional
                        architecture,
                        symbolism, rhythm,
                        and literary value.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* QUOTES */}

            <TabsContent value="quotes">
              <Card
                className="
                mt-6
                rounded-[32px]
                border-primary/10
              "
              >
                <CardContent className="p-8">
                  {quoteLines.length >
                  0 ? (
                    <div className="space-y-5">
                      {quoteLines.map(
                        (
                          quote,
                          index
                        ) => (
                          <motion.div
                            key={
                              index
                            }
                            initial={{
                              opacity: 0,
                              y: 15,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            className="
                            rounded-3xl
                            border
                            border-primary/10
                            bg-background/50
                            p-6
                          "
                          >
                            <div
                              className="
                              flex
                              gap-4
                            "
                            >
                              <Quote className="mt-1 h-5 w-5 text-primary" />

                              <div
                                className="
                                font-serif
                                text-lg
                                leading-[1.9]
                              "
                              >
                                {
                                  quote
                                }
                              </div>
                            </div>
                          </motion.div>
                        )
                      )}
                    </div>
                  ) : (
                    <div
                      className="
                      py-16
                      text-center
                    "
                    >
                      <Quote
                        className="
                        mx-auto
                        mb-4
                        h-12
                        w-12
                        text-primary
                      "
                      />

                      <h3
                        className="
                        text-xl
                        font-bold
                      "
                      >
                        No Quote Lines Yet
                      </h3>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* SUGGESTIONS */}

            <TabsContent value="suggestions">
              <Card
                className="
                mt-6
                rounded-[32px]
                border-primary/10
              "
              >
                <CardContent className="p-8">
                  {aiSuggestions.length >
                  0 ? (
                    <div className="space-y-4">
                      {aiSuggestions.map(
                        (
                          suggestion,
                          index
                        ) => (
                          <motion.div
                            key={
                              index
                            }
                            initial={{
                              opacity: 0,
                              x: -15,
                            }}
                            animate={{
                              opacity: 1,
                              x: 0,
                            }}
                            className="
                            flex
                            gap-4
                            rounded-3xl
                            border
                            border-primary/10
                            bg-background/50
                            p-5
                          "
                          >
                            <ChevronRight className="mt-1 h-5 w-5 text-primary" />

                            <div>
                              {
                                suggestion
                              }
                            </div>
                          </motion.div>
                        )
                      )}
                    </div>
                  ) : (
                    <div
                      className="
                      py-16
                      text-center
                    "
                    >
                      <Lightbulb
                        className="
                        mx-auto
                        mb-4
                        h-12
                        w-12
                        text-primary
                      "
                      />

                      <h3
                        className="
                        text-xl
                        font-bold
                      "
                      >
                        No Suggestions Yet
                      </h3>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* MUSIC */}

            <TabsContent value="music">
              <Card
                className="
                mt-6
                rounded-[32px]
                border-primary/10
              "
              >
                <CardContent className="p-8">
                  {musicalNotes ? (
                    <div className="space-y-8">
                      <div
                        className="
                        grid
                        grid-cols-1
                        gap-5
                        md:grid-cols-3
                      "
                      >
                        <div
                          className="
                          rounded-3xl
                          border
                          border-primary/10
                          p-5
                        "
                        >
                          <div
                            className="
                            mb-2
                            font-bold
                          "
                          >
                            Raag
                          </div>

                          <div
                            className="
                            text-sm
                            leading-relaxed
                            text-muted-foreground
                          "
                          >
                            {
                              musicalNotes
                                ?.core_identity
                                ?.raag
                            }
                          </div>
                        </div>

                        <div
                          className="
                          rounded-3xl
                          border
                          border-primary/10
                          p-5
                        "
                        >
                          <div
                            className="
                            mb-2
                            font-bold
                          "
                          >
                            Tempo
                          </div>

                          <div
                            className="
                            text-sm
                            leading-relaxed
                            text-muted-foreground
                          "
                          >
                            {
                              musicalNotes
                                ?.core_identity
                                ?.taal_tempo
                            }
                          </div>
                        </div>

                        <div
                          className="
                          rounded-3xl
                          border
                          border-primary/10
                          p-5
                        "
                        >
                          <div
                            className="
                            mb-2
                            font-bold
                          "
                          >
                            Instruments
                          </div>

                          <div
                            className="
                            text-sm
                            leading-relaxed
                            text-muted-foreground
                          "
                          >
                            {
                              musicalNotes
                                ?.core_identity
                                ?.instruments
                            }
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div>
                        <h3
                          className="
                          mb-4
                          text-2xl
                          font-black
                        "
                        >
                          Maestro Notes
                        </h3>

                        <div
                          className="
                          leading-[2]
                          text-muted-foreground
                        "
                        >
                          {
                            musicalNotes?.maestro_notes
                          }
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="
                      py-16
                      text-center
                    "
                    >
                      <Music4
                        className="
                        mx-auto
                        mb-4
                        h-12
                        w-12
                        text-primary
                      "
                      />

                      <h3
                        className="
                        text-xl
                        font-bold
                      "
                      >
                        No Musical Notes Yet
                      </h3>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}