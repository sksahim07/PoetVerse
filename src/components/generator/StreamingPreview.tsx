// ===============================================
// StreamingPreview.tsx
// Ultra Premium Streaming Poetry Preview
// Cinematic Live AI Writing Experience
// ===============================================

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import {
  Loader2,
  Sparkles,
  Feather,
  BrainCircuit,
  Wand2,
  Quote,
  Stars,
  Flame,
  Music4,
  Crown,
  BookOpen,
  HeartCrack,
  Clock3,
  Sigma,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Separator } from "@/components/ui/separator";

import { cn } from "@/lib/utils";

// ===============================================
// TYPES
// ===============================================

interface StreamingPreviewProps {
  streamingText: string;
  isGenerating: boolean;
  generationProgress: number;

  selectedEmotion?: string;
  selectedLanguage?: string;
  selectedType?: string;

  estimatedQuality?: string;
  aiThought?: string;
}

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
    ?.filter((line) => line.trim() !== "")
    .length;
}

function estimateReadingTime(
  text: string
) {
  const words = countWords(text);

  return Math.max(
    1,
    Math.ceil(words / 180)
  );
}

function getCurrentStage(
  progress: number
) {
  if (progress < 15)
    return {
      label:
        "Analyzing emotional architecture...",
      icon: BrainCircuit,
    };

  if (progress < 35)
    return {
      label:
        "Constructing poetic rhythm...",
      icon: Sigma,
    };

  if (progress < 55)
    return {
      label:
        "Creating metaphors & imagery...",
      icon: Wand2,
    };

  if (progress < 75)
    return {
      label:
        "Enhancing literary atmosphere...",
      icon: Stars,
    };

  if (progress < 95)
    return {
      label:
        "Refining emotional impact...",
      icon: Flame,
    };

  return {
    label:
      "Finalizing masterpiece...",
    icon: Crown,
  };
}

// ===============================================
// LIVE TYPING CURSOR
// ===============================================

const TypingCursor = () => {
  return (
    <motion.span
      animate={{
        opacity: [1, 0],
      }}
      transition={{
        repeat: Infinity,
        duration: 0.8,
      }}
      className="
      ml-1
      inline-block
      h-7
      w-[3px]
      rounded-full
      bg-primary
      align-middle
    "
    />
  );
};

// ===============================================
// FLOATING PARTICLES
// ===============================================

const FloatingParticles = () => {
  return (
    <>
      {[...Array(12)].map(
        (_, index) => (
          <motion.div
            key={index}
            initial={{
              opacity: 0,
              y: 50,
            }}
            animate={{
              opacity: [
                0,
                0.6,
                0,
              ],

              y: [
                50,
                -80,
              ],

              x: [
                0,
                Math.random() * 60 -
                  30,
              ],
            }}
            transition={{
              repeat: Infinity,
              duration:
                5 +
                Math.random() * 5,

              delay:
                index * 0.4,
            }}
            className="
            absolute
            h-2
            w-2
            rounded-full
            bg-primary/30
          "
            style={{
              left: `${
                Math.random() * 100
              }%`,
              bottom: 0,
            }}
          />
        )
      )}
    </>
  );
};

// ===============================================
// AI THOUGHTS
// ===============================================

const aiThoughts = [
  "Searching for emotionally intelligent metaphors...",
  "Balancing rhythm and literary atmosphere...",
  "Crafting cinematic imagery...",
  "Avoiding repetitive poetic clichés...",
  "Enhancing quotable lines...",
  "Building philosophical undertones...",
  "Maintaining emotional realism...",
  "Refining literary cadence...",
];

// ===============================================
// MAIN COMPONENT
// ===============================================

export default function StreamingPreview({
  streamingText,
  isGenerating,
  generationProgress,

  selectedEmotion,
  selectedLanguage,
  selectedType,

  estimatedQuality = "Masterpiece",
  aiThought,
}: StreamingPreviewProps) {
  const currentStage =
    getCurrentStage(
      generationProgress
    );

  const StageIcon =
    currentStage.icon;

  const words =
    countWords(streamingText);

  const lines =
    countLines(streamingText);

  const readingTime =
    estimateReadingTime(
      streamingText
    );

  const dynamicThought =
    aiThought ||
    aiThoughts[
      generationProgress %
        aiThoughts.length
    ];

  // =============================================
  // EMPTY STATE
  // =============================================

  if (
    !isGenerating &&
    !streamingText
  ) {
    return null;
  }

  // =============================================
  // UI
  // =============================================

  return (
    <AnimatePresence>
      <motion.div
        initial={{
          opacity: 0,
          y: 30,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: -30,
        }}
        transition={{
          duration: 0.5,
        }}
        className="
        relative
        overflow-hidden
      "
      >
        {/* =========================================
            BACKGROUND GLOW
        ========================================= */}

        <div
          className="
          absolute
          inset-0
          overflow-hidden
          rounded-[40px]
          pointer-events-none
        "
        >
          <div
            className="
            absolute
            left-1/2
            top-[-220px]
            h-[500px]
            w-[500px]
            -translate-x-1/2
            rounded-full
            bg-primary/10
            blur-[140px]
          "
          />

          <div
            className="
            absolute
            bottom-[-200px]
            right-[-100px]
            h-[400px]
            w-[400px]
            rounded-full
            bg-fuchsia-500/10
            blur-[120px]
          "
          />

          <FloatingParticles />
        </div>

        {/* =========================================
            MAIN CARD
        ========================================= */}

        <Card
          className="
          relative
          overflow-hidden
          rounded-[40px]
          border-primary/10
          bg-background/75
          shadow-[0_30px_120px_rgba(0,0,0,0.45)]
          backdrop-blur-3xl
        "
        >
          {/* =====================================
              HEADER
          ===================================== */}

          <CardHeader
            className="
            border-b
            border-primary/10
            pb-6
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
              {/* LEFT */}
              <div
                className="
                flex
                items-start
                gap-5
              "
              >
                <motion.div
                  animate={{
                    scale: [
                      1,
                      1.05,
                      1,
                    ],
                  }}
                  transition={{
                    repeat:
                      Infinity,
                    duration: 2,
                  }}
                  className="
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-3xl
                  border
                  border-primary/20
                  bg-primary/10
                "
                >
                  <Feather
                    className="
                    h-8
                    w-8
                    text-primary
                  "
                  />
                </motion.div>

                <div>
                  <div
                    className="
                    flex
                    flex-wrap
                    items-center
                    gap-3
                  "
                  >
                    <h2
                      className="
                      text-3xl
                      font-black
                      tracking-tight
                    "
                    >
                      AI Poet
                      is Writing...
                    </h2>

                    <Badge
                      className="
                      rounded-full
                      px-4
                      py-1.5
                    "
                    >
                      <Sparkles className="mr-2 h-4 w-4" />
                      Live Stream
                    </Badge>
                  </div>

                  <p
                    className="
                    mt-2
                    max-w-2xl
                    text-sm
                    leading-relaxed
                    text-muted-foreground
                  "
                  >
                    Advanced literary
                    intelligence is
                    generating layered
                    metaphors,
                    emotional rhythm,
                    cinematic atmosphere,
                    and memorable poetic
                    transitions in
                    real-time.
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div
                className="
                flex
                flex-wrap
                items-center
                gap-3
              "
              >
                <Badge
                  variant="secondary"
                  className="
                  rounded-full
                  px-4
                  py-2
                "
                >
                  <BrainCircuit className="mr-2 h-4 w-4" />
                  {estimatedQuality}
                </Badge>

                {selectedEmotion && (
                  <Badge
                    variant="outline"
                    className="
                    rounded-full
                    px-4
                    py-2
                  "
                  >
                    <HeartCrack className="mr-2 h-4 w-4" />
                    {
                      selectedEmotion
                    }
                  </Badge>
                )}

                {selectedType && (
                  <Badge
                    variant="outline"
                    className="
                    rounded-full
                    px-4
                    py-2
                  "
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    {selectedType}
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>

          {/* =====================================
              CONTENT
          ===================================== */}

          <CardContent className="p-8">
            {/* ===================================
                PROGRESS
            =================================== */}

            <div className="mb-8">
              <div
                className="
                mb-3
                flex
                items-center
                justify-between
                text-sm
              "
              >
                <div
                  className="
                  flex
                  items-center
                  gap-2
                  font-medium
                "
                >
                  <StageIcon className="h-4 w-4 text-primary" />

                  {
                    currentStage.label
                  }
                </div>

                <div
                  className="
                  font-bold
                  text-primary
                "
                >
                  {
                    generationProgress
                  }
                  %
                </div>
              </div>

              <div
                className="
                h-3
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
                    width: `${generationProgress}%`,
                  }}
                  transition={{
                    ease:
                      "easeOut",
                  }}
                  className="
                  relative
                  h-full
                  overflow-hidden
                  rounded-full
                  bg-primary
                "
                >
                  <motion.div
                    animate={{
                      x: [
                        "-100%",
                        "200%",
                      ],
                    }}
                    transition={{
                      repeat:
                        Infinity,
                      duration: 1.5,
                      ease: "linear",
                    }}
                    className="
                    absolute
                    inset-0
                    bg-gradient-to-r
                    from-transparent
                    via-white/40
                    to-transparent
                  "
                  />
                </motion.div>
              </div>
            </div>

            {/* ===================================
                AI THINKING
            =================================== */}

            <motion.div
              animate={{
                opacity: [
                  0.6,
                  1,
                  0.6,
                ],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.5,
              }}
              className="
              mb-8
              flex
              items-center
              gap-3
              rounded-3xl
              border
              border-primary/10
              bg-primary/5
              p-5
            "
            >
              <Loader2
                className="
                h-5
                w-5
                animate-spin
                text-primary
              "
              />

              <div
                className="
                text-sm
                text-muted-foreground
              "
              >
                {dynamicThought}
              </div>
            </motion.div>

            {/* ===================================
                LIVE POETRY
            =================================== */}

            <div
              className="
              relative
              overflow-hidden
              rounded-[34px]
              border
              border-primary/10
              bg-background/50
              p-8
            "
            >
              {/* BACKDROP */}
              <div
                className="
                absolute
                inset-0
                bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_60%)]
              "
              />

              {/* TOP BAR */}
              <div
                className="
                relative
                mb-6
                flex
                flex-wrap
                items-center
                justify-between
                gap-4
              "
              >
                <div
                  className="
                  flex
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
                    <Quote className="mr-2 h-4 w-4" />
                    Live Composition
                  </Badge>

                  {selectedLanguage && (
                    <Badge
                      variant="outline"
                      className="
                      rounded-full
                      px-4
                      py-2
                    "
                    >
                      {
                        selectedLanguage
                      }
                    </Badge>
                  )}
                </div>

                <div
                  className="
                  flex
                  items-center
                  gap-3
                  text-sm
                  text-muted-foreground
                "
                >
                  <div
                    className="
                    flex
                    items-center
                    gap-1.5
                  "
                  >
                    <BookOpen className="h-4 w-4" />
                    {words} words
                  </div>

                  <Separator
                    orientation="vertical"
                    className="h-4"
                  />

                  <div
                    className="
                    flex
                    items-center
                    gap-1.5
                  "
                  >
                    <Feather className="h-4 w-4" />
                    {lines} lines
                  </div>

                  <Separator
                    orientation="vertical"
                    className="h-4"
                  />

                  <div
                    className="
                    flex
                    items-center
                    gap-1.5
                  "
                  >
                    <Clock3 className="h-4 w-4" />
                    {
                      readingTime
                    }
                    m read
                  </div>
                </div>
              </div>

              {/* POEM TEXT */}
              <div
                className={cn(
                  `
                  relative
                  whitespace-pre-wrap
                  break-words
                  font-serif
                  text-[1.1rem]
                  leading-[2.2]
                  tracking-[0.015em]
                  text-foreground/95
                  sm:text-[1.2rem]
                `
                )}
              >
                {streamingText}

                {isGenerating && (
                  <TypingCursor />
                )}
              </div>
            </div>

            {/* ===================================
                FOOTER INSIGHTS
            =================================== */}

            <div
              className="
              mt-8
              grid
              grid-cols-1
              gap-5
              md:grid-cols-2
              xl:grid-cols-4
            "
            >
              <motion.div
                whileHover={{
                  y: -3,
                }}
                className="
                rounded-3xl
                border
                border-primary/10
                bg-background/40
                p-5
              "
              >
                <div
                  className="
                  mb-3
                  flex
                  items-center
                  gap-2
                "
                >
                  <BrainCircuit className="h-5 w-5 text-primary" />

                  <div
                    className="
                    font-semibold
                  "
                  >
                    Literary Depth
                  </div>
                </div>

                <p
                  className="
                  text-sm
                  leading-relaxed
                  text-muted-foreground
                "
                >
                  AI is balancing
                  symbolism, emotional
                  realism, layered
                  metaphors, and poetic
                  cadence dynamically.
                </p>
              </motion.div>

              <motion.div
                whileHover={{
                  y: -3,
                }}
                className="
                rounded-3xl
                border
                border-primary/10
                bg-background/40
                p-5
              "
              >
                <div
                  className="
                  mb-3
                  flex
                  items-center
                  gap-2
                "
                >
                  <Wand2 className="h-5 w-5 text-primary" />

                  <div
                    className="
                    font-semibold
                  "
                  >
                    Metaphor Engine
                  </div>
                </div>

                <p
                  className="
                  text-sm
                  leading-relaxed
                  text-muted-foreground
                "
                >
                  Generating unique
                  imagery, atmosphere,
                  and emotionally
                  intelligent transitions.
                </p>
              </motion.div>

              <motion.div
                whileHover={{
                  y: -3,
                }}
                className="
                rounded-3xl
                border
                border-primary/10
                bg-background/40
                p-5
              "
              >
                <div
                  className="
                  mb-3
                  flex
                  items-center
                  gap-2
                "
                >
                  <Music4 className="h-5 w-5 text-primary" />

                  <div
                    className="
                    font-semibold
                  "
                  >
                    Rhythm Layer
                  </div>
                </div>

                <p
                  className="
                  text-sm
                  leading-relaxed
                  text-muted-foreground
                "
                >
                  Cadence, line pacing,
                  emotional flow, and
                  poetic movement are
                  continuously refined.
                </p>
              </motion.div>

              <motion.div
                whileHover={{
                  y: -3,
                }}
                className="
                rounded-3xl
                border
                border-primary/10
                bg-background/40
                p-5
              "
              >
                <div
                  className="
                  mb-3
                  flex
                  items-center
                  gap-2
                "
                >
                  <Crown className="h-5 w-5 text-primary" />

                  <div
                    className="
                    font-semibold
                  "
                  >
                    Premium Output
                  </div>
                </div>

                <p
                  className="
                  text-sm
                  leading-relaxed
                  text-muted-foreground
                "
                >
                  Focused on memorable,
                  quotable, cinematic,
                  and emotionally lasting
                  literary quality.
                </p>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}