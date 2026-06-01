// ======================================================
// RewritePanel.tsx
// PoetVerse Ultra Premium Rewrite + Refinement Engine
// ======================================================

import {
  useMemo,
  useState,
} from 'react';

import {
  Wand2,
  Sparkles,
  BrainCircuit,
  Loader2,
  Copy,
  Check,
  RefreshCcw,
  Crown,
  Flame,
  Quote,
  BookOpenText,
  Layers3,
  PenSquare,
  ArrowRight,
  Stars,
  ScrollText,
  Eye,
  Feather,
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';

import { Textarea } from '@/components/ui/textarea';

import { Separator } from '@/components/ui/separator';

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

import {
  improvePoem,
} from '@/services/llm';

import { cn } from '@/lib/utils';

// ======================================================
// TYPES
// ======================================================

interface RewritePanelProps {
  poem: string;

  onRewrite?: (
    feedback: string
  ) => Promise<void>;
  loading?: boolean;
    language?: string;  
}

interface RewriteVersion {
  id: string;

  title: string;

  description: string;

  content: string;

  createdAt: number;
}

// ======================================================
// REWRITE MODES
// ======================================================

const rewriteModes = [
  {
    id: 'cinematic',

    title:
      'Cinematic Rewrite',

    description:
      'Visual storytelling, atmosphere, scene-like imagery.',

    icon: Sparkles,

    prompt:
      'Rewrite this poem with cinematic imagery, atmosphere, emotional realism, and scene-like storytelling.',
  },

  {
    id: 'deep',

    title:
      'Emotional Depth',

    description:
      'Haunting emotions, layered pain, emotional realism.',

    icon: Flame,

    prompt:
      'Deepen the emotions naturally. Make it emotionally haunting and painfully human without melodrama.',
  },

  {
    id: 'literary',

    title:
      'Literary Masterpiece',

    description:
      'Elite literary quality with layered symbolism.',

    icon: Crown,

    prompt:
      'Transform this into premium literary poetry with layered symbolism, sophisticated metaphors, and intellectual elegance.',
  },

  {
    id: 'simple',

    title:
      'Simple & Beautiful',

    description:
      'Easy vocabulary while preserving beauty.',

    icon: BookOpenText,

    prompt:
      'Rewrite this using simple but emotionally beautiful language. Make it understandable and human.',
  },

  {
    id: 'philosophical',

    title:
      'Philosophical',

    description:
      'Existential and philosophical undertones.',

    icon: BrainCircuit,

    prompt:
      'Add philosophical depth and existential undertones while preserving emotional beauty.',
  },

  {
    id: 'rhythm',

    title:
      'Rhythm & Flow',

    description:
      'Better cadence, transitions, and immersive rhythm.',

    icon: Feather,

    prompt:
      'Improve rhythm, cadence, transitions, and poetic musicality naturally.',
  },
];

// ======================================================
// COMPONENT
// ======================================================

const RewritePanel = ({
  poem,
  language = 'english',
  onRewrite,
}: RewritePanelProps) => {
  // ====================================================
  // STATES
  // ====================================================

  const [
    isGenerating,
    setIsGenerating,
  ] = useState(false);

  const [
    customPrompt,
    setCustomPrompt,
  ] = useState('');

  const [
    copied,
    setCopied,
  ] = useState(false);

  const [
    versions,
    setVersions,
  ] = useState<
    RewriteVersion[]
  >([]);

  const [
    activeVersion,
    setActiveVersion,
  ] = useState<
    string | null
  >(null);

  // ====================================================
  // CURRENT VERSION
  // ====================================================

  const currentVersion =
    useMemo(() => {
      return versions.find(
        (v) =>
          v.id === activeVersion
      );
    }, [
      versions,
      activeVersion,
    ]);

  // ====================================================
  // COPY
  // ====================================================

  const handleCopy =
    async (
      text: string
    ) => {
      try {
        await navigator.clipboard.writeText(
          text
        );

        setCopied(true);

        toast.success(
          'Copied successfully.'
        );

        setTimeout(() => {
          setCopied(false);
        }, 1800);
      } catch {
        toast.error(
          'Copy failed.'
        );
      }
    };

  // ====================================================
  // GENERATE REWRITE
  // ====================================================

  const generateRewrite =
    async (
      title: string,
      prompt: string,
      description?: string
    ) => {
      try {
        setIsGenerating(true);

        const result =
          await improvePoem(
            poem,
            prompt,
            language
          );

        const version: RewriteVersion =
          {
            id:
              crypto.randomUUID(),

            title,

            description:
              description ||
              'AI rewritten version.',

            content:
              result.improved_poem,

            createdAt:
              Date.now(),
          };

        setVersions((prev) => [
          version,
          ...prev,
        ]);

        setActiveVersion(
          version.id
        );

        toast.success(
          `${title} generated successfully.`
        );
      } catch (error) {
        console.error(error);

        toast.error(
          'Rewrite generation failed.'
        );
      } finally {
        setIsGenerating(false);
      }
    };

  // ====================================================
  // CUSTOM REWRITE
  // ====================================================

  const handleCustomRewrite =
    async () => {
      if (
        !customPrompt.trim()
      ) {
        toast.error(
          'Write custom instructions first.'
        );

        return;
      }

      await generateRewrite(
        'Custom Rewrite',
        customPrompt,
        'User-defined AI rewrite.'
      );
    };

  // ====================================================
  // APPLY VERSION
  // ====================================================

  const applyVersion =
    () => {
      if (
        !currentVersion
      )
        return;

      onRewrite?.(
        currentVersion.content
      );

      toast.success(
        'Rewrite applied successfully.'
      );
    };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <Card
        className="
        overflow-hidden
        rounded-[32px]
        border-primary/10
        bg-background/70
        shadow-[0_20px_100px_rgba(0,0,0,0.25)]
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
            gap-5
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
                text-3xl
                font-black
              "
              >
                <Wand2 className="h-8 w-8 text-primary" />
                Rewrite Laboratory
              </CardTitle>

              <CardDescription className="mt-2 text-base">
                Generate multiple professional rewritten versions of your poetry with advanced literary AI refinement.
              </CardDescription>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge className="rounded-full px-4 py-2">
                <Sparkles className="mr-2 h-4 w-4" />
                Premium AI Rewrite
              </Badge>

              <Badge
                variant="secondary"
                className="rounded-full px-4 py-2"
              >
                <Layers3 className="mr-2 h-4 w-4" />
                Multi Version Engine
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          {/* REWRITE MODES */}
          <div className="space-y-5">
            <div
              className="
              flex
              items-center
              gap-2
              text-sm
              font-bold
              uppercase
              tracking-[0.2em]
              text-primary
            "
            >
              <Stars className="h-4 w-4" />
              Rewrite Modes
            </div>

            <div
              className="
              grid
              grid-cols-1
              gap-5
              md:grid-cols-2
              xl:grid-cols-3
            "
            >
              {rewriteModes.map(
                (mode) => {
                  const Icon =
                    mode.icon;

                  return (
                    <motion.button
                      whileHover={{
                        y: -4,
                      }}
                      whileTap={{
                        scale: 0.98,
                      }}
                      key={mode.id}
                      disabled={
                        isGenerating
                      }
                      onClick={() =>
                        generateRewrite(
                          mode.title,
                          mode.prompt,
                          mode.description
                        )
                      }
                      className="
                      group
                      overflow-hidden
                      rounded-[28px]
                      border
                      border-primary/10
                      bg-background/40
                      p-6
                      text-left
                      transition-all
                      hover:border-primary/20
                      hover:bg-primary/5
                    "
                    >
                      <div
                        className="
                        mb-5
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-2xl
                        bg-primary/10
                        transition-all
                        group-hover:scale-110
                      "
                      >
                        <Icon className="h-6 w-6 text-primary" />
                      </div>

                      <div className="space-y-2">
                        <h3
                          className="
                          text-lg
                          font-bold
                        "
                        >
                          {mode.title}
                        </h3>

                        <p
                          className="
                          text-sm
                          leading-relaxed
                          text-muted-foreground
                        "
                        >
                          {
                            mode.description
                          }
                        </p>
                      </div>

                      <div
                        className="
                        mt-5
                        flex
                        items-center
                        text-sm
                        font-semibold
                        text-primary
                      "
                      >
                        Generate Rewrite
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </div>
                    </motion.button>
                  );
                }
              )}
            </div>
          </div>

          {/* CUSTOM PROMPT */}
          <div className="mt-10">
            <div
              className="
              mb-4
              flex
              items-center
              gap-2
              text-sm
              font-bold
              uppercase
              tracking-[0.2em]
              text-primary
            "
            >
              <PenSquare className="h-4 w-4" />
              Custom AI Instructions
            </div>

            <div
              className="
              overflow-hidden
              rounded-[30px]
              border
              border-primary/10
              bg-background/40
            "
            >
              <Textarea
                value={customPrompt}
                disabled={
                  isGenerating
                }
                onChange={(e) =>
                  setCustomPrompt(
                    e.target.value
                  )
                }
                placeholder="
Examples:
• Add moon imagery and loneliness
• Make it feel like classic Urdu literature
• Reduce dramatic words
• Make transitions smoother
• Add emotional realism
• Improve final stanza
• Make it more quotable
                "
                className="
                min-h-[180px]
                resize-none
                border-0
                bg-transparent
                p-6
                text-base
                leading-[1.9]
                focus-visible:ring-0
              "
              />

              <div
                className="
                flex
                flex-wrap
                items-center
                justify-between
                gap-4
                border-t
                border-primary/10
                p-5
              "
              >
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className="rounded-full"
                  >
                    <Quote className="mr-1 h-3 w-3" />
                    Human Emotion
                  </Badge>

                  <Badge
                    variant="secondary"
                    className="rounded-full"
                  >
                    <BrainCircuit className="mr-1 h-3 w-3" />
                    Literary Intelligence
                  </Badge>
                </div>

                <Button
                  disabled={
                    isGenerating
                  }
                  onClick={
                    handleCustomRewrite
                  }
                  className="
                  h-14
                  rounded-2xl
                  px-8
                  text-base
                  font-bold
                "
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Rewriting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate Rewrite
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* GENERATED VERSIONS */}
          <AnimatePresence>
            {versions.length > 0 && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="mt-10"
              >
                <Separator className="mb-8" />

                <Tabs
                  value={
                    activeVersion ||
                    versions[0]?.id
                  }
                  onValueChange={
                    setActiveVersion
                  }
                  className="space-y-6"
                >
                  <TabsList
                    className="
                    h-auto
                    flex-wrap
                    rounded-3xl
                    bg-background/40
                    p-2
                  "
                  >
                    {versions.map(
                      (
                        version,
                        index
                      ) => (
                        <TabsTrigger
                          key={
                            version.id
                          }
                          value={
                            version.id
                          }
                          className="
                          rounded-2xl
                          px-5
                          py-3
                        "
                        >
                          Version
                          {' '}
                          {index + 1}
                        </TabsTrigger>
                      )
                    )}
                  </TabsList>

                  {versions.map(
                    (
                      version,
                      index
                    ) => (
                      <TabsContent
                        key={
                          version.id
                        }
                        value={
                          version.id
                        }
                        className="space-y-6"
                      >
                        {/* VERSION HEADER */}
                        <div
                          className="
                          flex
                          flex-col
                          gap-5
                          lg:flex-row
                          lg:items-center
                          lg:justify-between
                        "
                        >
                          <div>
                            <div
                              className="
                              flex
                              items-center
                              gap-3
                            "
                            >
                              <Badge className="rounded-full">
                                <RefreshCcw className="mr-1 h-3 w-3" />
                                Rewrite
                                {' '}
                                {index + 1}
                              </Badge>

                              <Badge
                                variant="secondary"
                                className="rounded-full"
                              >
                                <Stars className="mr-1 h-3 w-3" />
                                AI Enhanced
                              </Badge>
                            </div>

                            <h3
                              className="
                              mt-4
                              text-2xl
                              font-black
                            "
                            >
                              {
                                version.title
                              }
                            </h3>

                            <p
                              className="
                              mt-2
                              max-w-2xl
                              text-muted-foreground
                            "
                            >
                              {
                                version.description
                              }
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-3">
                            <Button
                              variant="outline"
                              className="rounded-2xl"
                              onClick={() =>
                                handleCopy(
                                  version.content
                                )
                              }
                            >
                              {copied ? (
                                <>
                                  <Check className="mr-2 h-4 w-4" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="mr-2 h-4 w-4" />
                                  Copy
                                </>
                              )}
                            </Button>

                            <Button
                              className="
                              rounded-2xl
                              px-6
                            "
                              onClick={
                                applyVersion
                              }
                            >
                              <Check className="mr-2 h-4 w-4" />
                              Apply Rewrite
                            </Button>
                          </div>
                        </div>

                        {/* POEM CARD */}
                        <Card
                          className="
                          rounded-[32px]
                          border-primary/10
                          bg-background/50
                          backdrop-blur-2xl
                        "
                        >
                          <CardContent className="p-8">
                            <div
                              className="
                              mb-6
                              flex
                              items-center
                              gap-3
                            "
                            >
                              <div
                                className="
                                flex
                                h-14
                                w-14
                                items-center
                                justify-center
                                rounded-2xl
                                bg-primary/10
                              "
                              >
                                <ScrollText className="h-6 w-6 text-primary" />
                              </div>

                              <div>
                                <div
                                  className="
                                  text-lg
                                  font-bold
                                "
                                >
                                  Rewritten Poetry
                                </div>

                                <div
                                  className="
                                  text-sm
                                  text-muted-foreground
                                "
                                >
                                  AI refined literary version
                                </div>
                              </div>
                            </div>

                            <div
                              className="
                              whitespace-pre-wrap
                              font-serif
                              text-[18px]
                              leading-[2.15]
                              italic
                              sm:text-[20px]
                            "
                            >
                              {
                                version.content
                              }
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    )
                  )}
                </Tabs>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};

export default RewritePanel;