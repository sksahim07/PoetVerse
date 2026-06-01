// ===============================================
// LiteraryScores.tsx
// Ultra Premium Literary Intelligence Panel
// ===============================================

import {
  motion,
  AnimatePresence,
} from 'framer-motion';

import {
  BrainCircuit,
  Sparkles,
  Waves,
  BookOpen,
  Orbit,
  Flame,
  Crown,
  Quote,
  Sigma,
  Activity,
  BarChart3,
  Feather,
  LucideIcon,
  Lightbulb,
  ScrollText,
  Star,
} from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

import {
  Badge,
} from '@/components/ui/badge';

import {
  Progress,
} from '@/components/ui/progress';

import {
  Separator,
} from '@/components/ui/separator';

import {
  cn,
} from '@/lib/utils';

// ===============================================
// TYPES
// ===============================================

export interface LiteraryAnalysis {
  emotional_score: number;
  metaphor_score: number;
  originality_score: number;
  rhythm_score: number;
  literary_score: number;
  philosophical_score: number;
}

interface LiteraryScoresProps {
  scores?: LiteraryAnalysis | null;

  loading?: boolean;

  poem?: string;

  className?: string;
}

// ===============================================
// SCORE ITEM TYPE
// ===============================================

interface ScoreCardItem {
  key: keyof LiteraryAnalysis;

  label: string;

  description: string;

  icon: LucideIcon;

  gradient: string;

  glow: string;

  interpretation: (
    value: number
  ) => string;
}

// ===============================================
// SCORE CONFIG
// ===============================================

const scoreItems: ScoreCardItem[] = [
  {
    key: 'emotional_score',

    label:
      'Emotional Resonance',

    description:
      'Measures emotional realism, impact, and psychological authenticity.',

    icon: Flame,

    gradient:
      'from-rose-500/20 via-pink-500/10 to-red-500/20',

    glow:
      'shadow-[0_0_50px_rgba(244,63,94,0.25)]',

    interpretation: (
      value
    ) => {
      if (value >= 95)
        return 'Devastatingly emotional and unforgettable.';

      if (value >= 85)
        return 'Deep emotional immersion with strong realism.';

      if (value >= 70)
        return 'Emotionally compelling and expressive.';

      return 'Emotion exists but can become more immersive.';
    },
  },

  {
    key: 'metaphor_score',

    label:
      'Metaphorical Intelligence',

    description:
      'Analyzes symbolic layering, imagery depth, and literary sophistication.',

    icon: Orbit,

    gradient:
      'from-violet-500/20 via-fuchsia-500/10 to-purple-500/20',

    glow:
      'shadow-[0_0_50px_rgba(168,85,247,0.25)]',

    interpretation: (
      value
    ) => {
      if (value >= 95)
        return 'Metaphors feel cinematic and multi-layered.';

      if (value >= 85)
        return 'Strong symbolic architecture and imagery.';

      if (value >= 70)
        return 'Creative imagery with poetic potential.';

      return 'Metaphors could become more original and layered.';
    },
  },

  {
    key: 'originality_score',

    label:
      'Originality',

    description:
      'Detects uniqueness, freshness, and avoidance of cliché structures.',

    icon: Sparkles,

    gradient:
      'from-cyan-500/20 via-sky-500/10 to-blue-500/20',

    glow:
      'shadow-[0_0_50px_rgba(6,182,212,0.25)]',

    interpretation: (
      value
    ) => {
      if (value >= 95)
        return 'Exceptionally unique literary voice.';

      if (value >= 85)
        return 'Distinctive atmosphere and identity.';

      if (value >= 70)
        return 'Creative and emotionally fresh.';

      return 'Some familiar patterns remain.';
    },
  },

  {
    key: 'rhythm_score',

    label:
      'Rhythm & Flow',

    description:
      'Evaluates cadence, readability, pacing, and sonic elegance.',

    icon: Waves,

    gradient:
      'from-emerald-500/20 via-green-500/10 to-lime-500/20',

    glow:
      'shadow-[0_0_50px_rgba(16,185,129,0.25)]',

    interpretation: (
      value
    ) => {
      if (value >= 95)
        return 'Flow feels musical and hypnotic.';

      if (value >= 85)
        return 'Elegant pacing and immersive rhythm.';

      if (value >= 70)
        return 'Smooth and emotionally readable.';

      return 'Cadence can become more fluid.';
    },
  },

  {
    key: 'literary_score',

    label:
      'Literary Sophistication',

    description:
      'Measures maturity, elegance, intelligence, and artistic quality.',

    icon: Crown,

    gradient:
      'from-amber-500/20 via-yellow-500/10 to-orange-500/20',

    glow:
      'shadow-[0_0_50px_rgba(251,191,36,0.25)]',

    interpretation: (
      value
    ) => {
      if (value >= 95)
        return 'Masterpiece-level literary execution.';

      if (value >= 85)
        return 'Highly polished and intellectually refined.';

      if (value >= 70)
        return 'Strong literary foundation.';

      return 'Writing quality can become more elevated.';
    },
  },

  {
    key: 'philosophical_score',

    label:
      'Philosophical Depth',

    description:
      'Measures existential layers, reflective thinking, and hidden meaning.',

    icon: BrainCircuit,

    gradient:
      'from-indigo-500/20 via-blue-500/10 to-slate-500/20',

    glow:
      'shadow-[0_0_50px_rgba(99,102,241,0.25)]',

    interpretation: (
      value
    ) => {
      if (value >= 95)
        return 'Profoundly existential and thought-provoking.';

      if (value >= 85)
        return 'Strong philosophical undertones.';

      if (value >= 70)
        return 'Reflective and meaningful.';

      return 'Can explore deeper thematic complexity.';
    },
  },
];

// ===============================================
// HELPERS
// ===============================================

function getOverallRank(
  average: number
) {
  if (average >= 97)
    return {
      title:
        'Immortal Masterpiece',

      color:
        'text-yellow-400',

      badge:
        'Legendary',
    };

  if (average >= 90)
    return {
      title:
        'Elite Literary Work',

      color:
        'text-violet-400',

      badge:
        'Elite',
    };

  if (average >= 82)
    return {
      title:
        'Advanced Poetic Craft',

      color:
        'text-cyan-400',

      badge:
        'Advanced',
    };

  if (average >= 70)
    return {
      title:
        'Strong Emotional Writing',

      color:
        'text-emerald-400',

      badge:
        'Strong',
    };

  return {
    title:
      'Developing Literary Potential',

    color:
      'text-muted-foreground',

    badge:
      'Developing',
  };
}

function getAverageScore(
  scores: LiteraryAnalysis
) {
  const values = Object.values(
    scores
  );

  const total = values.reduce(
    (acc, curr) => acc + curr,
    0
  );

  return Math.round(
    total / values.length
  );
}

// ===============================================
// LOADING STATE
// ===============================================

const LoadingCard = () => {
  return (
    <div
      className="
      grid
      grid-cols-1
      gap-5
      lg:grid-cols-2
    "
    >
      {Array.from({
        length: 6,
      }).map((_, index) => (
        <div
          key={index}
          className="
          h-[230px]
          animate-pulse
          rounded-[30px]
          border
          border-white/10
          bg-white/[0.03]
        "
        />
      ))}
    </div>
  );
};

// ===============================================
// SCORE CARD
// ===============================================

interface ScoreCardProps {
  item: ScoreCardItem;

  value: number;

  index: number;
}

const ScoreCard = ({
  item,
  value,
  index,
}: ScoreCardProps) => {
  const Icon = item.icon;

  return (
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
        delay: index * 0.06,
        duration: 0.45,
      }}
    >
      <Card
        className={cn(
          `
          relative
          overflow-hidden
          rounded-[30px]
          border-white/10
          bg-white/[0.03]
          backdrop-blur-3xl
          transition-all
          duration-500
          hover:-translate-y-1
        `,
          item.glow
        )}
      >
        {/* Gradient BG */}
        <div
          className={cn(
            `
            absolute
            inset-0
            bg-gradient-to-br
            opacity-80
          `,
            item.gradient
          )}
        />

        {/* Noise */}
        <div
          className="
          absolute
          inset-0
          opacity-[0.03]
          mix-blend-overlay
          [background-image:url('https://www.transparenttextures.com/patterns/asfalt-dark.png')]
        "
        />

        <CardContent
          className="
          relative
          z-10
          p-7
        "
        >
          {/* TOP */}
          <div
            className="
            flex
            items-start
            justify-between
            gap-4
          "
          >
            <div
              className="
              flex
              items-center
              gap-4
            "
            >
              <div
                className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-3xl
                border
                border-white/10
                bg-black/20
              "
              >
                <Icon
                  className="
                  h-8
                  w-8
                  text-white
                "
                />
              </div>

              <div>
                <h3
                  className="
                  text-xl
                  font-black
                "
                >
                  {item.label}
                </h3>

                <p
                  className="
                  mt-1
                  text-sm
                  leading-relaxed
                  text-muted-foreground
                "
                >
                  {
                    item.description
                  }
                </p>
              </div>
            </div>

            <Badge
              className="
              rounded-full
              px-4
              py-2
              text-sm
              font-black
            "
            >
              {value}/100
            </Badge>
          </div>

          {/* PROGRESS */}
          <div className="mt-7">
            <Progress
              value={value}
              className="
              h-3
              rounded-full
            "
            />
          </div>

          {/* VALUE */}
          <div
            className="
            mt-7
            flex
            items-end
            justify-between
          "
          >
            <div>
              <div
                className="
                text-5xl
                font-black
                tracking-tight
              "
              >
                {value}
              </div>

              <div
                className="
                text-sm
                text-muted-foreground
              "
              >
                Literary Score
              </div>
            </div>

            <div
              className="
              max-w-[240px]
              text-right
              text-sm
              leading-relaxed
              text-muted-foreground
            "
            >
              {item.interpretation(
                value
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// ===============================================
// AI INSIGHTS
// ===============================================

interface InsightProps {
  average: number;
}

const AIInsights = ({
  average,
}: InsightProps) => {
  const insights = [
    'The poem demonstrates strong emotional coherence and layered emotional architecture.',

    'Several lines contain cinematic visual storytelling rather than generic lyrical phrasing.',

    'The symbolic language suggests philosophical awareness beyond surface-level romanticism.',

    'Rhythm consistency helps maintain immersion across emotional transitions.',

    'The writing avoids excessive melodrama while still preserving emotional gravity.',
  ];

  return (
    <Card
      className="
      relative
      overflow-hidden
      rounded-[34px]
      border-white/10
      bg-white/[0.03]
      backdrop-blur-3xl
    "
    >
      <div
        className="
        absolute
        inset-0
        bg-gradient-to-br
        from-primary/10
        via-transparent
        to-fuchsia-500/10
      "
      />

      <CardHeader
        className="
        relative
        z-10
      "
      >
        <CardTitle
          className="
          flex
          items-center
          gap-3
          text-3xl
          font-black
        "
        >
          <Lightbulb
            className="
            h-8
            w-8
            text-yellow-400
          "
          />

          AI Literary Insights
        </CardTitle>

        <CardDescription
          className="
          text-base
          leading-relaxed
        "
        >
          Advanced literary interpretation
          generated through emotional,
          philosophical, and structural
          analysis.
        </CardDescription>
      </CardHeader>

      <CardContent
        className="
        relative
        z-10
        space-y-4
      "
      >
        {insights.map(
          (
            insight,
            index
          ) => (
            <motion.div
              key={index}
              initial={{
                opacity: 0,
                x: -20,
              }}
              animate={{
                opacity: 1,
                x: 0,
              }}
              transition={{
                delay:
                  0.15 +
                  index * 0.08,
              }}
              className="
              flex
              gap-4
              rounded-2xl
              border
              border-white/5
              bg-black/10
              p-5
            "
            >
              <div
                className="
                mt-1
                flex
                h-7
                w-7
                items-center
                justify-center
                rounded-full
                bg-primary/15
              "
              >
                <Star
                  className="
                  h-4
                  w-4
                  text-primary
                "
                />
              </div>

              <p
                className="
                text-sm
                leading-relaxed
                text-muted-foreground
              "
              >
                {insight}
              </p>
            </motion.div>
          )
        )}

        <Separator className="my-3" />

        <div
          className="
          flex
          items-center
          justify-between
          rounded-2xl
          border
          border-primary/15
          bg-primary/5
          p-5
        "
        >
          <div>
            <div
              className="
              text-sm
              uppercase
              tracking-[0.25em]
              text-primary
            "
            >
              AI Evaluation
            </div>

            <div
              className="
              mt-2
              text-xl
              font-black
            "
            >
              {
                getOverallRank(
                  average
                ).title
              }
            </div>
          </div>

          <div
            className="
            text-right
          "
          >
            <div
              className="
              text-5xl
              font-black
            "
            >
              {average}
            </div>

            <div
              className="
              text-sm
              text-muted-foreground
            "
            >
              Overall Score
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ===============================================
// MAIN COMPONENT
// ===============================================

export const LiteraryScores = ({
  scores,
  loading,
  poem,
  className,
}: LiteraryScoresProps) => {
  if (
    loading ||
    !scores
  ) {
    return (
      <div
        className={cn(
          'space-y-8',
          className
        )}
      >
        <LoadingCard />
      </div>
    );
  }

  const average =
    getAverageScore(
      scores
    );

  const rank =
    getOverallRank(
      average
    );

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 30,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className={cn(
        `
        relative
        overflow-hidden
        rounded-[40px]
        border
        border-white/10
        bg-white/[0.03]
        p-6
        backdrop-blur-3xl
      `,
        className
      )}
    >
      {/* Background Glow */}
      <div
        className="
        absolute
        inset-0
        overflow-hidden
        pointer-events-none
      "
      >
        <div
          className="
          absolute
          left-[-120px]
          top-[-120px]
          h-[300px]
          w-[300px]
          rounded-full
          bg-primary/10
          blur-[120px]
        "
        />

        <div
          className="
          absolute
          bottom-[-120px]
          right-[-120px]
          h-[320px]
          w-[320px]
          rounded-full
          bg-fuchsia-500/10
          blur-[120px]
        "
        />
      </div>

      {/* HEADER */}
      <div
        className="
        relative
        z-10
        mb-10
      "
      >
        <div
          className="
          flex
          flex-col
          gap-6
          xl:flex-row
          xl:items-center
          xl:justify-between
        "
        >
          <div>
            <div
              className="
              mb-4
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
                rounded-3xl
                bg-primary/10
              "
              >
                <BrainCircuit
                  className="
                  h-7
                  w-7
                  text-primary
                "
                />
              </div>

              <Badge
                className="
                rounded-full
                px-4
                py-2
                text-sm
              "
              >
                AI Literary Engine
              </Badge>
            </div>

            <h2
              className="
              text-4xl
              font-black
              tracking-tight
            "
            >
              Literary Intelligence
            </h2>

            <p
              className="
              mt-3
              max-w-3xl
              text-base
              leading-relaxed
              text-muted-foreground
            "
            >
              Deep emotional, symbolic,
              rhythmic, and philosophical
              evaluation powered by
              advanced literary analysis.
            </p>
          </div>

          {/* OVERALL */}
          <motion.div
            whileHover={{
              scale: 1.03,
            }}
            className="
            relative
            overflow-hidden
            rounded-[32px]
            border
            border-white/10
            bg-black/20
            p-7
            backdrop-blur-2xl
          "
          >
            <div
              className="
              absolute
              inset-0
              bg-gradient-to-br
              from-primary/10
              to-fuchsia-500/10
            "
            />

            <div
              className="
              relative
              z-10
            "
            >
              <div
                className="
                text-sm
                uppercase
                tracking-[0.3em]
                text-primary
              "
              >
                Overall Evaluation
              </div>

              <div
                className="
                mt-4
                flex
                items-end
                gap-4
              "
              >
                <div
                  className="
                  text-7xl
                  font-black
                  leading-none
                "
                >
                  {average}
                </div>

                <div
                  className="
                  pb-2
                "
                >
                  <div
                    className={cn(
                      `
                      text-xl
                      font-black
                    `,
                      rank.color
                    )}
                  >
                    {rank.title}
                  </div>

                  <div
                    className="
                    mt-1
                    text-sm
                    text-muted-foreground
                  "
                  >
                    AI Literary Verdict
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* SCORE GRID */}
      <div
        className="
        relative
        z-10
        grid
        grid-cols-1
        gap-6
        lg:grid-cols-2
      "
      >
        {scoreItems.map(
          (
            item,
            index
          ) => (
            <ScoreCard
              key={item.key}
              item={item}
              value={
                scores[
                  item.key
                ]
              }
              index={index}
            />
          )
        )}
      </div>

      {/* INSIGHTS */}
      <div
        className="
        relative
        z-10
        mt-10
      "
      >
        <AIInsights
          average={average}
        />
      </div>

      {/* POEM PREVIEW */}
      <AnimatePresence>
        {poem && (
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="
            relative
            z-10
            mt-10
          "
          >
            <Card
              className="
              rounded-[34px]
              border-white/10
              bg-black/20
              backdrop-blur-2xl
            "
            >
              <CardHeader>
                <CardTitle
                  className="
                  flex
                  items-center
                  gap-3
                  text-2xl
                  font-black
                "
                >
                  <ScrollText
                    className="
                    h-7
                    w-7
                    text-primary
                  "
                  />

                  Evaluated Poetry
                </CardTitle>

                <CardDescription>
                  AI-scored poetic content.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div
                  className="
                  whitespace-pre-wrap
                  rounded-[28px]
                  border
                  border-white/5
                  bg-white/[0.03]
                  p-8
                  text-lg
                  leading-[2]
                  text-foreground/90
                "
                >
                  {poem}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
};

export default LiteraryScores;