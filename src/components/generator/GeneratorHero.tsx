// ===============================================
// GeneratorHero.tsx
// Cinematic Premium Hero Section
// ===============================================

import {
  Crown,
  Sparkles,
  BrainCircuit,
  Music4,
  Stars,
  Wand2,
  Flame,
  Quote,
} from "lucide-react";

import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";

import { Badge } from "@/components/ui/badge";

interface GeneratorHeroProps {
  emotion?: string;
}

const emotionThemes: Record<
  string,
  {
    glow: string;
    badge: string;
    orb: string;
  }
> = {
  heartbreak: {
    glow:
      "from-indigo-500/20 via-fuchsia-500/10 to-transparent",

    badge:
      "border-indigo-500/20 bg-indigo-500/10 text-indigo-200",

    orb: "bg-indigo-500/20",
  },

  romantic: {
    glow:
      "from-rose-500/20 via-pink-500/10 to-transparent",

    badge:
      "border-rose-500/20 bg-rose-500/10 text-rose-200",

    orb: "bg-rose-500/20",
  },

  dark: {
    glow:
      "from-red-500/20 via-black/30 to-transparent",

    badge:
      "border-red-500/20 bg-red-500/10 text-red-200",

    orb: "bg-red-500/20",
  },

  spiritual: {
    glow:
      "from-emerald-500/20 via-teal-500/10 to-transparent",

    badge:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-200",

    orb: "bg-emerald-500/20",
  },

  motivation: {
    glow:
      "from-amber-500/20 via-orange-500/10 to-transparent",

    badge:
      "border-amber-500/20 bg-amber-500/10 text-amber-100",

    orb: "bg-amber-500/20",
  },
};

export const GeneratorHero = ({
  emotion = "romantic",
}: GeneratorHeroProps) => {
  const currentTheme =
    emotionThemes[emotion] ||
    emotionThemes.romantic;

  const { scrollY } = useScroll();

  const y =
    useTransform(
      scrollY,
      [0, 500],
      [0, 120]
    );

  const opacity =
    useTransform(
      scrollY,
      [0, 350],
      [1, 0.4]
    );

  return (
    <section
      className="
      relative
      overflow-hidden
      rounded-[42px]
      border
      border-white/10
      bg-background/60
      px-6
      py-20
      shadow-[0_25px_120px_rgba(0,0,0,0.45)]
      backdrop-blur-3xl
      sm:px-10
      lg:px-16
    "
    >
      {/* =========================================
          CINEMATIC BACKGROUND
      ========================================= */}

      <motion.div
        style={{
          y,
          opacity,
        }}
        className="
        pointer-events-none
        absolute
        inset-0
      "
      >
        {/* Main Glow */}
        <div
          className={`
          absolute
          left-1/2
          top-[-250px]
          h-[700px]
          w-[700px]
          -translate-x-1/2
          rounded-full
          blur-[160px]
          ${currentTheme.orb}
        `}
        />

        {/* Gradient Overlay */}
        <div
          className={`
          absolute
          inset-0
          bg-gradient-to-br
          ${currentTheme.glow}
        `}
        />

        {/* Floating Orbs */}
        <motion.div
          animate={{
            y: [0, -30, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: "easeInOut",
          }}
          className="
          absolute
          left-[12%]
          top-[20%]
          h-32
          w-32
          rounded-full
          bg-primary/10
          blur-[90px]
        "
        />

        <motion.div
          animate={{
            y: [0, 25, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 10,
            ease: "easeInOut",
          }}
          className="
          absolute
          bottom-[10%]
          right-[10%]
          h-40
          w-40
          rounded-full
          bg-fuchsia-500/10
          blur-[100px]
        "
        />
      </motion.div>

      {/* =========================================
          FLOATING PARTICLES
      ========================================= */}

      <div
        className="
        pointer-events-none
        absolute
        inset-0
        overflow-hidden
      "
      >
        {Array.from({
          length: 18,
        }).map((_, i) => (
          <motion.div
            key={i}
            initial={{
              opacity: 0,
              scale: 0,
            }}
            animate={{
              opacity: [
                0.1,
                0.4,
                0.1,
              ],

              y: [
                0,
                -80,
                0,
              ],

              scale: [
                1,
                1.4,
                1,
              ],
            }}
            transition={{
              repeat: Infinity,
              duration:
                6 + i * 0.7,
              delay: i * 0.4,
            }}
            className="
            absolute
            h-1.5
            w-1.5
            rounded-full
            bg-white/40
          "
            style={{
              left: `${
                Math.random() * 100
              }%`,
              top: `${
                Math.random() * 100
              }%`,
            }}
          />
        ))}
      </div>

      {/* =========================================
          CONTENT
      ========================================= */}

      <div
        className="
        relative
        z-10
        mx-auto
        max-w-6xl
      "
      >
        {/* =====================================
            TOP BADGE
        ===================================== */}

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
            duration: 0.8,
          }}
          className="
          flex
          justify-center
        "
        >
          <div
            className="
            inline-flex
            items-center
            gap-3
            rounded-full
            border
            border-primary/20
            bg-background/50
            px-6
            py-3
            backdrop-blur-2xl
          "
          >
            <div
              className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-primary/15
            "
            >
              <Crown
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
                font-semibold
                tracking-wide
              "
              >
                PoetVerse Maestro Studio
              </div>

              <div
                className="
                text-xs
                text-muted-foreground
              "
              >
                Cinematic AI Poetry Engine
              </div>
            </div>
          </div>
        </motion.div>

        {/* =====================================
            MAIN TITLE
        ===================================== */}

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
            duration: 1,
            delay: 0.15,
          }}
          className="
          mt-10
          text-center
        "
        >
          <h1
            className="
            mx-auto
            max-w-5xl
            text-5xl
            font-black
            leading-[1]
            tracking-tight
            sm:text-6xl
            lg:text-8xl
          "
          >
            Craft
            <span
              className="
              bg-gradient-to-r
              from-primary
              via-fuchsia-300
              to-rose-300
              bg-clip-text
              text-transparent
            "
            >
              {" "}
              Emotionally
            </span>

            <br />

            Immersive Poetry
          </h1>

          <p
            className="
            mx-auto
            mt-8
            max-w-3xl
            text-lg
            leading-[2]
            text-muted-foreground
            sm:text-xl
          "
          >
            Generate literary-grade poetry
            with cinematic atmosphere,
            layered metaphors,
            emotional realism,
            philosophical depth,
            and human-like rhythm —
            powered by advanced AI
            creative intelligence.
          </p>
        </motion.div>

        {/* =====================================
            FEATURE BADGES
        ===================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 25,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.9,
            delay: 0.3,
          }}
          className="
          mt-12
          flex
          flex-wrap
          items-center
          justify-center
          gap-4
        "
        >
          <Badge
            className={`
            rounded-full
            px-5
            py-3
            text-sm
            backdrop-blur-xl
            ${currentTheme.badge}
          `}
          >
            <BrainCircuit className="mr-2 h-4 w-4" />
            Emotional Intelligence
          </Badge>

          <Badge
            className="
            rounded-full
            border-white/10
            bg-background/50
            px-5
            py-3
            text-sm
            backdrop-blur-xl
          "
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Cinematic Imagery
          </Badge>

          <Badge
            className="
            rounded-full
            border-white/10
            bg-background/50
            px-5
            py-3
            text-sm
            backdrop-blur-xl
          "
          >
            <Quote className="mr-2 h-4 w-4" />
            Literary Metaphors
          </Badge>

          <Badge
            className="
            rounded-full
            border-white/10
            bg-background/50
            px-5
            py-3
            text-sm
            backdrop-blur-xl
          "
          >
            <Music4 className="mr-2 h-4 w-4" />
            Musical Atmosphere
          </Badge>

          <Badge
            className="
            rounded-full
            border-white/10
            bg-background/50
            px-5
            py-3
            text-sm
            backdrop-blur-xl
          "
          >
            <Flame className="mr-2 h-4 w-4" />
            Humanized Writing
          </Badge>
        </motion.div>

        {/* =====================================
            QUOTE BLOCK
        ===================================== */}

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.96,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            duration: 1,
            delay: 0.45,
          }}
          className="
          mx-auto
          mt-16
          max-w-4xl
        "
        >
          <div
            className="
            relative
            overflow-hidden
            rounded-[32px]
            border
            border-white/10
            bg-background/40
            p-8
            backdrop-blur-2xl
          "
          >
            <div
              className="
              absolute
              inset-0
              bg-gradient-to-r
              from-primary/5
              via-transparent
              to-fuchsia-500/5
            "
            />

            <div className="relative z-10">
              <div
                className="
                mb-5
                flex
                justify-center
              "
              >
                <div
                  className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-full
                  bg-primary/10
                "
                >
                  <Stars
                    className="
                    h-7
                    w-7
                    text-primary
                  "
                  />
                </div>
              </div>

              <blockquote
                className="
                text-center
                font-serif
                text-2xl
                italic
                leading-[2]
                text-foreground/90
                sm:text-3xl
              "
              >
                “Poetry should not merely
                describe emotion —
                it should resurrect memory,
                atmosphere,
                silence,
                and the weight
                of unspoken things.”
              </blockquote>

              <div
                className="
                mt-6
                text-center
                text-sm
                tracking-[0.3em]
                text-muted-foreground
                uppercase
              "
              >
                PoetVerse Creative Doctrine
              </div>
            </div>
          </div>
        </motion.div>

        {/* =====================================
            CTA INDICATOR
        ===================================== */}

        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 2.5,
          }}
          className="
          mt-16
          flex
          justify-center
        "
        >
          <div
            className="
            flex
            items-center
            gap-3
            text-sm
            text-muted-foreground
          "
          >
            <Wand2 className="h-4 w-4" />

            Begin crafting your
            masterpiece below
          </div>
        </motion.div>
      </div>
    </section>
  );
};