// ===============================================
// GenerationProgress.tsx
// Ultra Premium AI Generation Progress System
// PoetVerse Studio
// ===============================================

import {
  BrainCircuit,
  Sparkles,
  Feather,
  Stars,
  Wand2,
  Flame,
  AudioWaveform,
  ScrollText,
  Crown,
  Orbit,
  Loader2,
  CheckCircle2,
  LucideIcon,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import { cn } from "@/lib/utils";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";

import { Badge } from "@/components/ui/badge";

// ===============================================
// TYPES
// ===============================================

interface GenerationProgressProps {
  isGenerating: boolean;

  progress: number;

  streamingText?: string;

  currentStage?: number;

  estimatedTime?: number;

  mode?: "cinematic" | "literary" | "minimal";

  poemType?: string;

  emotion?: string;

  language?: string;
}

// ===============================================
// STAGES
// ===============================================

interface StageItem {
  title: string;
  description: string;
  icon: LucideIcon;
  glow: string;
}

const stages: StageItem[] = [
  {
    title: "Analyzing Emotional Intent",
    description:
      "Understanding hidden emotions, atmosphere, and emotional realism.",
    icon: BrainCircuit,
    glow:
      "from-violet-500/30 to-fuchsia-500/30",
  },

  {
    title: "Building Literary Architecture",
    description:
      "Creating rhythm, poetic cadence, transitions, and narrative structure.",
    icon: ScrollText,
    glow:
      "from-cyan-500/30 to-sky-500/30",
  },

  {
    title: "Forging Symbolism & Metaphors",
    description:
      "Designing layered imagery, cinematic metaphors, and emotional symbolism.",
    icon: Sparkles,
    glow:
      "from-amber-500/30 to-orange-500/30",
  },

  {
    title: "Crafting Human-like Flow",
    description:
      "Refining natural transitions, immersive pacing, and quotable lines.",
    icon: Feather,
    glow:
      "from-pink-500/30 to-rose-500/30",
  },

  {
    title: "Enhancing Literary Intelligence",
    description:
      "Injecting philosophy, emotional subtext, and intellectual beauty.",
    icon: Crown,
    glow:
      "from-emerald-500/30 to-teal-500/30",
  },

  {
    title: "Finalizing Masterpiece",
    description:
      "Polishing atmosphere, emotional impact, and final poetic resonance.",
    icon: Wand2,
    glow:
      "from-indigo-500/30 to-violet-500/30",
  },
];

// ===============================================
// HELPERS
// ===============================================

function getCurrentStage(
  progress: number
) {
  if (progress <= 15) return 0;

  if (progress <= 30) return 1;

  if (progress <= 50) return 2;

  if (progress <= 70) return 3;

  if (progress <= 90) return 4;

  return 5;
}

function getTypingWords(
  text?: string
) {
  if (!text) return 0;

  return text
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

function getCharacterCount(
  text?: string
) {
  return text?.length || 0;
}

// ===============================================
// COMPONENT
// ===============================================

export default function GenerationProgress({
  isGenerating,
  progress,
  streamingText,
  estimatedTime = 12,
  mode = "cinematic",
  poemType,
  emotion,
  language,
}: GenerationProgressProps) {
  const currentStage =
    getCurrentStage(progress);

  const current =
    stages[currentStage];

  const words =
    getTypingWords(streamingText);

  const chars =
    getCharacterCount(
      streamingText
    );

  // ===============================================
  // RENDER
  // ===============================================

  return (
    <AnimatePresence>
      {isGenerating && (
        <motion.div
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: 40,
          }}
          transition={{
            duration: 0.45,
          }}
          className="relative mt-8"
        >
          {/* =======================================
              BACKGROUND GLOW
          ======================================= */}

          <div
            className="
            pointer-events-none
            absolute
            inset-0
            overflow-hidden
            rounded-[40px]
          "
          >
            <motion.div
              animate={{
                opacity: [0.4, 0.7, 0.4],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
              }}
              className={cn(
                `
                absolute
                inset-0
                bg-gradient-to-br
                blur-3xl
              `,
                current.glow
              )}
            />
          </div>

          {/* =======================================
              MAIN CARD
          ======================================= */}

          <Card
            className="
            relative
            overflow-hidden
            rounded-[38px]
            border-primary/10
            bg-background/70
            shadow-[0_30px_120px_rgba(0,0,0,0.35)]
            backdrop-blur-3xl
          "
          >
            {/* ===================================
                TOP SHIMMER
            =================================== */}

            <motion.div
              animate={{
                x: [
                  "-100%",
                  "120%",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
              className="
              absolute
              top-0
              h-full
              w-[35%]
              bg-gradient-to-r
              from-transparent
              via-white/10
              to-transparent
              blur-2xl
            "
            />

            <CardContent className="relative p-8 md:p-10">
              {/* ===================================
                  HEADER
              =================================== */}

              <div
                className="
                flex
                flex-col
                gap-8
                lg:flex-row
                lg:items-start
                lg:justify-between
              "
              >
                {/* LEFT */}
                <div className="flex-1">
                  <div
                    className="
                    mb-5
                    flex
                    items-center
                    gap-4
                  "
                  >
                    <motion.div
                      animate={{
                        rotate: 360,
                      }}
                      transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "linear",
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
                      <current.icon
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
                        items-center
                        gap-3
                      "
                      >
                        <h2
                          className="
                          text-2xl
                          font-black
                          tracking-tight
                        "
                        >
                          AI Maestro
                          Working...
                        </h2>

                        <motion.div
                          animate={{
                            scale: [
                              1,
                              1.25,
                              1,
                            ],
                          }}
                          transition={{
                            duration: 1.8,
                            repeat: Infinity,
                          }}
                        >
                          <Loader2
                            className="
                            h-5
                            w-5
                            animate-spin
                            text-primary
                          "
                          />
                        </motion.div>
                      </div>

                      <p
                        className="
                        mt-1
                        text-sm
                        text-muted-foreground
                      "
                      >
                        Building cinematic
                        poetry with emotional
                        intelligence and
                        literary depth.
                      </p>
                    </div>
                  </div>

                  {/* CURRENT STAGE */}

                  <motion.div
                    key={current.title}
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.35,
                    }}
                    className="
                    rounded-[28px]
                    border
                    border-primary/10
                    bg-background/50
                    p-6
                  "
                  >
                    <div
                      className="
                      mb-3
                      flex
                      items-center
                      gap-3
                    "
                    >
                      <div
                        className="
                        rounded-2xl
                        bg-primary/10
                        p-2.5
                      "
                      >
                        <current.icon
                          className="
                          h-5
                          w-5
                          text-primary
                        "
                        />
                      </div>

                      <div>
                        <div
                          className="
                          text-sm
                          font-bold
                          uppercase
                          tracking-[0.22em]
                          text-primary
                        "
                        >
                          Current Stage
                        </div>

                        <h3
                          className="
                          text-xl
                          font-black
                        "
                        >
                          {
                            current.title
                          }
                        </h3>
                      </div>
                    </div>

                    <p
                      className="
                      text-sm
                      leading-relaxed
                      text-muted-foreground
                    "
                    >
                      {
                        current.description
                      }
                    </p>
                  </motion.div>
                </div>

                {/* RIGHT PANEL */}

                <div
                  className="
                  grid
                  grid-cols-2
                  gap-4
                  lg:w-[320px]
                "
                >
                  <StatCard
                    icon={Feather}
                    title="Words"
                    value={String(words)}
                  />

                  <StatCard
                    icon={Stars}
                    title="Characters"
                    value={String(chars)}
                  />

                  <StatCard
                    icon={Orbit}
                    title="Mode"
                    value={mode}
                  />

                  <StatCard
                    icon={AudioWaveform}
                    title="ETA"
                    value={`${estimatedTime}s`}
                  />
                </div>
              </div>

              {/* ===================================
                  PROGRESS BAR
              =================================== */}

              <div className="mt-10">
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
                    gap-3
                  "
                  >
                    <Badge
                      className="
                      rounded-full
                      px-4
                      py-1.5
                      text-xs
                    "
                    >
                      <Flame className="mr-2 h-3.5 w-3.5" />
                      Literary Engine
                    </Badge>

                    <Badge
                      variant="secondary"
                      className="
                      rounded-full
                      px-4
                      py-1.5
                    "
                    >
                      {poemType ||
                        "Poetry"}
                    </Badge>

                    <Badge
                      variant="outline"
                      className="
                      rounded-full
                      px-4
                      py-1.5
                    "
                    >
                      {emotion ||
                        "Emotion"}
                    </Badge>
                  </div>

                  <div
                    className="
                    text-right
                  "
                  >
                    <div
                      className="
                      text-3xl
                      font-black
                    "
                    >
                      {progress}%
                    </div>

                    <div
                      className="
                      text-xs
                      text-muted-foreground
                    "
                    >
                      Generation Progress
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <Progress
                    value={progress}
                    className="
                    h-5
                    rounded-full
                    bg-primary/10
                  "
                  />

                  <motion.div
                    animate={{
                      x: [
                        "-100%",
                        "150%",
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="
                    pointer-events-none
                    absolute
                    top-0
                    h-full
                    w-[30%]
                    rounded-full
                    bg-white/20
                    blur-md
                  "
                  />
                </div>
              </div>

              {/* ===================================
                  STAGE TIMELINE
              =================================== */}

              <div className="mt-10">
                <div
                  className="
                  mb-5
                  flex
                  items-center
                  gap-3
                "
                >
                  <BrainCircuit
                    className="
                    h-5
                    w-5
                    text-primary
                  "
                  />

                  <h3
                    className="
                    text-lg
                    font-bold
                  "
                  >
                    AI Literary Pipeline
                  </h3>
                </div>

                <div
                  className="
                  grid
                  grid-cols-1
                  gap-4
                  md:grid-cols-2
                  xl:grid-cols-3
                "
                >
                  {stages.map(
                    (
                      stage,
                      index
                    ) => {
                      const Icon =
                        stage.icon;

                      const completed =
                        progress >=
                        ((index + 1) /
                          stages.length) *
                          100;

                      const active =
                        currentStage ===
                        index;

                      return (
                        <motion.div
                          key={
                            stage.title
                          }
                          initial={{
                            opacity: 0,
                            y: 20,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          transition={{
                            delay:
                              index *
                              0.08,
                          }}
                          className={cn(
                            `
                            relative
                            overflow-hidden
                            rounded-[26px]
                            border
                            p-5
                            transition-all
                          `,
                            completed
                              ? `
                                border-primary/30
                                bg-primary/10
                              `
                              : `
                                border-primary/10
                                bg-background/40
                              `,
                            active &&
                              `
                              scale-[1.02]
                              shadow-[0_20px_60px_rgba(124,58,237,0.25)]
                            `
                          )}
                        >
                          {/* ACTIVE GLOW */}

                          {active && (
                            <motion.div
                              animate={{
                                opacity: [
                                  0.25,
                                  0.5,
                                  0.25,
                                ],
                              }}
                              transition={{
                                duration: 2,
                                repeat:
                                  Infinity,
                              }}
                              className={cn(
                                `
                                absolute
                                inset-0
                                bg-gradient-to-br
                                blur-2xl
                              `,
                                stage.glow
                              )}
                            />
                          )}

                          <div className="relative">
                            <div
                              className="
                              mb-4
                              flex
                              items-center
                              justify-between
                            "
                            >
                              <div
                                className={cn(
                                  `
                                  rounded-2xl
                                  p-3
                                `,
                                  completed
                                    ? `
                                      bg-primary/20
                                    `
                                    : `
                                      bg-muted
                                    `
                                )}
                              >
                                <Icon
                                  className={cn(
                                    `
                                    h-5
                                    w-5
                                  `,
                                    completed
                                      ? `
                                        text-primary
                                      `
                                      : `
                                        text-muted-foreground
                                      `
                                  )}
                                />
                              </div>

                              {completed ? (
                                <CheckCircle2
                                  className="
                                  h-5
                                  w-5
                                  text-primary
                                "
                                />
                              ) : (
                                <div
                                  className="
                                  text-xs
                                  font-bold
                                  text-muted-foreground
                                "
                                >
                                  0
                                  {index + 1}
                                </div>
                              )}
                            </div>

                            <h4
                              className="
                              text-sm
                              font-bold
                              leading-snug
                            "
                            >
                              {
                                stage.title
                              }
                            </h4>
                          </div>
                        </motion.div>
                      );
                    }
                  )}
                </div>
              </div>

              {/* ===================================
                  FOOTER INFO
              =================================== */}

              <div
                className="
                mt-10
                flex
                flex-wrap
                items-center
                justify-between
                gap-4
                rounded-[28px]
                border
                border-primary/10
                bg-background/40
                px-6
                py-5
              "
              >
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
                    py-1.5
                  "
                  >
                    <Crown className="mr-2 h-3.5 w-3.5" />
                    Premium Literary AI
                  </Badge>

                  <Badge
                    variant="secondary"
                    className="
                    rounded-full
                    px-4
                    py-1.5
                  "
                  >
                    {language ||
                      "Multi-language"}
                  </Badge>
                </div>

                <div
                  className="
                  text-sm
                  text-muted-foreground
                "
                >
                  The AI is currently
                  refining atmosphere,
                  cadence, symbolism,
                  and emotional realism.
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ===============================================
// STAT CARD
// ===============================================

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
}

function StatCard({
  icon: Icon,
  title,
  value,
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      className="
      rounded-[26px]
      border
      border-primary/10
      bg-background/50
      p-5
    "
    >
      <div
        className="
        mb-3
        flex
        items-center
        justify-between
      "
      >
        <div
          className="
          rounded-2xl
          bg-primary/10
          p-2.5
        "
        >
          <Icon
            className="
            h-4
            w-4
            text-primary
          "
          />
        </div>

        <div
          className="
          h-2
          w-2
          rounded-full
          bg-emerald-500
        "
        />
      </div>

      <div
        className="
        text-2xl
        font-black
        tracking-tight
      "
      >
        {value}
      </div>

      <div
        className="
        mt-1
        text-xs
        uppercase
        tracking-[0.18em]
        text-muted-foreground
      "
      >
        {title}
      </div>
    </motion.div>
  );
}