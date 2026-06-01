// =======================================================
// GeneratorForm.tsx
// Ultra Premium Professional Poetry Generator Form
// Cinematic + AI Interactive + Advanced Literary Controls
// =======================================================

import { useEffect, useMemo, useRef, useState } from "react";

import {
  Sparkles,
  BrainCircuit,
  Crown,
  Music,
  Quote,
  Wand2,
  Loader2,
  Flame,
  Lock,
  Stars,
  Feather,
  ScrollText,
  Drama,
  AudioWaveform,
  MessagesSquare,
  PenSquare,
  BookText,
  Bot,
  ChevronDown,
  ChevronUp,
  Settings2,
  Gem,
  Orbit,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";

import * as z from "zod";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";

import {
  generatePoem,
  improvePoem,
  analyzePoem,
  generateMusicalNotes,
  analyzePoemScores,
} from "@/services/llm";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import { Separator } from "@/components/ui/separator";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// =======================================================
// TYPES
// =======================================================

const formSchema = z.object({
  language: z.string(),

  poetry_type: z.string(),

  emotion: z.string(),

  user_message: z.string().optional(),

  mood: z.string().optional(),

  target_person: z.string().optional(),

  line_length: z.string(),

  rhyme_style: z.string(),

  word_difficulty: z.string(),

  tone_filter: z.string(),

  emotion_level: z.string(),

  flow_style: z.string(),

  literary_style: z.string(),

  creativity_level: z.string(),

  metaphor_density: z.string(),

  philosophical_depth: z.string(),

  realism_level: z.string(),

  uniqueness_level: z.string(),

  sensory_details: z.string(),

  dialogue_style: z.string(),

  narrative_mode: z.string(),

  intensity_mode: z.string(),

  add_musical_notes: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface GeneratorFormProps {
  credits?: number | null;

  onGenerated?: (data: any) => void;
}

// =======================================================
// CONSTANTS
// =======================================================

const selectClass = `
z-[999999]
rounded-3xl
border
border-primary/15
bg-background/95
backdrop-blur-3xl
shadow-[0_25px_100px_rgba(0,0,0,0.35)]
max-h-[280px]
overflow-y-auto
`;

const emotions = [
  "love",
  "heartbreak",
  "melancholy",
  "loneliness",
  "dark romance",
  "nostalgia",
  "hope",
  "despair",
  "friendship",
  "spiritual",
  "motivation",
  "existential",
  "regret",
  "midnight sadness",
  "obsession",
  "dreams",
  "emptiness",
  "confusion",
  "healing",
  "devotion",
];

const aiSuggestions = [
  "Write about rain touching abandoned railway tracks",
  "Create a heartbreak poem with philosophical undertones",
  "Write a cinematic midnight loneliness nazm",
  "Generate deep Urdu style romantic imagery",
  "Write a poem like fading memories inside old rooms",
  "Create emotionally restrained pain, not melodrama",
];

// =======================================================
// REUSABLE SELECT FIELD
// =======================================================

interface SelectFieldProps {
  control: any;
  name: string;
  label: string;

  items: {
    label: string;
    value: string;
  }[];
}

function SelectField({
  control,
  name,
  label,
  items,
}: SelectFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel
            className="
            text-sm
            font-semibold
            tracking-wide
          "
          >
            {label}
          </FormLabel>

          <Select
            value={field.value}
            onValueChange={field.onChange}
          >
            <FormControl>
              <SelectTrigger
                className="
                h-14
                rounded-2xl
                border-primary/10
                bg-background/40
                px-5
                text-base
                shadow-sm
              "
              >
                <SelectValue />
              </SelectTrigger>
            </FormControl>

            <SelectContent className={selectClass}>
              {items.map((item) => (
                <SelectItem
                  key={item.value}
                  value={item.value}
                  className="
                  rounded-xl
                  py-3
                "
                >
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}

// =======================================================
// MAIN COMPONENT
// =======================================================

export default function GeneratorForm({
  credits,
  onGenerated,
}: GeneratorFormProps) {
  const textareaRef =
    useRef<HTMLTextAreaElement | null>(
      null
    );

  const [isGenerating, setIsGenerating] =
    useState(false);

  const [showAdvanced, setShowAdvanced] =
    useState(true);

  const [streamingText, setStreamingText] =
    useState("");

  const [finalPoem, setFinalPoem] =
    useState("");

  const [analysis, setAnalysis] =
    useState("");

  const [musicData, setMusicData] =
    useState<any>(null);

  const [scores, setScores] =
    useState<any>(null);

  const [improvePrompt, setImprovePrompt] =
    useState("");

  const [improvedPoem, setImprovedPoem] =
    useState("");

  const [aiChatInput, setAiChatInput] =
    useState("");

  const [aiConversation, setAiConversation] =
    useState<
      {
        role: "user" | "assistant";
        content: string;
      }[]
    >([]);

  const [generationProgress, setGenerationProgress] =
    useState(0);

  // =======================================================
  // FORM
  // =======================================================

  const form = useForm<FormValues>({
    resolver:
      zodResolver(formSchema),

    defaultValues: {
      language: "bengali",

      poetry_type: "poem",

      emotion: "love",

      user_message: "",

      mood: "",

      target_person: "",

      line_length: "medium",

      rhyme_style: "soft_rhyme",

      word_difficulty: "poetic",

      tone_filter: "modern",

      emotion_level: "deep",

      flow_style: "smooth",

      literary_style:
        "cinematic literary",

      creativity_level: "high",

      metaphor_density: "high",

      philosophical_depth:
        "medium",

      realism_level: "human",

      uniqueness_level: "high",

      sensory_details:
        "cinematic",

      dialogue_style: "minimal",

      narrative_mode:
        "immersive",

      intensity_mode:
        "balanced",

      add_musical_notes: true,
    },
  });

  // =======================================================
  // WORD COUNT
  // =======================================================

  const watchedMessage =
    form.watch("user_message");

  const wordCount = useMemo(() => {
    return (
      watchedMessage
        ?.trim()
        ?.split(/\s+/)
        ?.filter(Boolean)?.length || 0
    );
  }, [watchedMessage]);

  // =======================================================
  // AUTO TEXTAREA
  // =======================================================

  useEffect(() => {
    const el = textareaRef.current;

    if (!el) return;

    el.style.height = "auto";

    el.style.height =
      el.scrollHeight + "px";
  }, [watchedMessage]);

  // =======================================================
  // FAKE PROGRESS
  // =======================================================

  useEffect(() => {
    let interval: any;

    if (isGenerating) {
      interval = setInterval(() => {
        setGenerationProgress(
          (prev) => {
            if (prev >= 95)
              return prev;

            return prev + 3;
          }
        );
      }, 500);
    }

    return () =>
      clearInterval(interval);
  }, [isGenerating]);

  // =======================================================
  // GENERATE
  // =======================================================

  const handleGenerate = async (
    values: FormValues
  ) => {
    try {
      setIsGenerating(true);

      setStreamingText("");

      setFinalPoem("");

      setAnalysis("");

      setMusicData(null);

      setScores(null);

      setImprovedPoem("");

      setGenerationProgress(0);

      const poem =
        await generatePoem(
          values,
          (chunk) => {
            setStreamingText(
              (prev) =>
                prev + chunk
            );
          }
        );

      setFinalPoem(poem);

      const [
        literaryAnalysis,
        poemScores,
      ] = await Promise.all([
        analyzePoem(
          poem,
          values.language
        ),

        analyzePoemScores(poem),
      ]);

      setAnalysis(
        literaryAnalysis
      );

      setScores(poemScores);

      if (
        values.add_musical_notes
      ) {
        try {
          const musical =
            await generateMusicalNotes(
              poem,
              values.emotion,
              values.language
            );

          setMusicData(musical);
        } catch (error) {
          console.error(error);
        }
      }

      setGenerationProgress(100);

      toast.success(
        "Masterpiece generated successfully."
      );

      onGenerated?.({
        poem,
        analysis:
          literaryAnalysis,
        scores: poemScores,
      });
    } catch (error) {
      console.error(error);

      toast.error(
        "Generation failed."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  // =======================================================
  // AI IMPROVE
  // =======================================================

  const handleImprove =
    async () => {
      if (
        !finalPoem ||
        !improvePrompt
      )
        return;

      try {
        const improved =
          await improvePoem(
            finalPoem,
            improvePrompt,
            form.getValues(
              "language"
            )
          );

        setImprovedPoem(
          improved.improved_poem
        );

        toast.success(
          "Poem improved."
        );
      } catch (error) {
        console.error(error);

        toast.error(
          "Improvement failed."
        );
      }
    };

  // =======================================================
  // AI CHAT
  // =======================================================

  const handleAiChat =
    async () => {
      if (
        !aiChatInput.trim()
      )
        return;

      const userMsg =
        aiChatInput;

      setAiConversation(
        (prev) => [
          ...prev,
          {
            role: "user",
            content: userMsg,
          },
        ]
      );

      setAiChatInput("");

      try {
        const result =
          await improvePoem(
            finalPoem,
            userMsg,
            form.getValues(
              "language"
            )
          );

        setAiConversation(
          (prev) => [
            ...prev,
            {
              role:
                "assistant",
              content:
                result.feedback
                  .literary_strength,
            },
          ]
        );
      } catch (error) {
        console.error(error);
      }
    };

  // =======================================================
  // UI
  // =======================================================

  return (
    <div className="space-y-8">
      {/* MAIN CARD */}

      <Card
        className="
        overflow-hidden
        rounded-[40px]
        border-primary/10
        bg-background/70
        shadow-[0_30px_120px_rgba(0,0,0,0.35)]
        backdrop-blur-3xl
      "
      >
        {/* HEADER */}

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
              <div
                className="
                mb-4
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-primary/15
                bg-primary/10
                px-5
                py-2
              "
              >
                <Crown className="h-4 w-4 text-primary" />

                <span
                  className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.25em]
                "
                >
                  Premium AI Poetry
                </span>
              </div>

              <CardTitle
                className="
                text-4xl
                font-black
                tracking-tight
              "
              >
                Poetry Creation Studio
              </CardTitle>

              <CardDescription
                className="
                mt-3
                max-w-2xl
                text-base
                leading-relaxed
              "
              >
                Generate cinematic,
                philosophical,
                emotionally layered,
                deeply symbolic poetry
                with advanced literary
                intelligence.
              </CardDescription>
            </div>

            <div
              className="
              flex
              flex-wrap
              gap-3
            "
            >
              <Badge className="rounded-full px-5 py-2">
                <BrainCircuit className="mr-2 h-4 w-4" />
                Emotional AI
              </Badge>

              <Badge
                variant="secondary"
                className="rounded-full px-5 py-2"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Cinematic Writing
              </Badge>

              <Badge
                variant="outline"
                className="rounded-full px-5 py-2"
              >
                Credits:
                {" "}
                {credits ?? 0}
              </Badge>
            </div>
          </div>
        </CardHeader>

        {/* FORM */}

        <CardContent className="p-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(
                handleGenerate
              )}
              className="space-y-8"
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
                  <FormLabel
                    className="
                    text-sm
                    font-bold
                    uppercase
                    tracking-[0.25em]
                    text-primary
                  "
                  >
                    Imagination Engine
                  </FormLabel>

                  <Badge variant="outline">
                    Words:
                    {" "}
                    {wordCount}
                  </Badge>
                </div>

                <FormField
                  control={form.control}
                  name="user_message"
                  render={({
                    field,
                  }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          {...field}
                          ref={(
                            el
                          ) => {
                            textareaRef.current =
                              el;
                          }}
                          placeholder="Describe rain, loneliness, fading memories, heartbreak, abandoned cities, philosophical silence, old rooms..."
                          className="
                          min-h-[260px]
                          resize-none
                          rounded-[32px]
                          border-primary/10
                          bg-background/30
                          p-7
                          text-lg
                          leading-[2]
                          shadow-inner
                        "
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                {/* SUGGESTIONS */}

                <div
                  className="
                  flex
                  flex-wrap
                  gap-3
                "
                >
                  {aiSuggestions.map(
                    (
                      suggestion
                    ) => (
                      <button
                        key={
                          suggestion
                        }
                        type="button"
                        onClick={() =>
                          form.setValue(
                            "user_message",
                            suggestion
                          )
                        }
                        className="
                        rounded-full
                        border
                        border-primary/10
                        bg-background/40
                        px-4
                        py-2
                        text-sm
                        transition-all
                        hover:border-primary/30
                        hover:bg-primary/5
                      "
                      >
                        {suggestion}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* MAIN GRID */}

              <div
                className="
                grid
                grid-cols-1
                gap-6
                md:grid-cols-2
                xl:grid-cols-3
              "
              >
                <SelectField
                  control={form.control}
                  name="language"
                  label="Language"
                  items={[
                    {
                      label:
                        "বাংলা",
                      value:
                        "bengali",
                    },

                    {
                      label:
                        "English",
                      value:
                        "english",
                    },

                    {
                      label:
                        "اردو",
                      value:
                        "urdu",
                    },
                  ]}
                />

                <SelectField
                  control={form.control}
                  name="poetry_type"
                  label="Poetry Type"
                  items={[
                    {
                      label:
                        "Poem",
                      value:
                        "poem",
                    },

                    {
                      label:
                        "Nazm",
                      value:
                        "nazm",
                    },

                    {
                      label:
                        "Ghazal",
                      value:
                        "ghazal",
                    },

                    {
                      label:
                        "Shayari",
                      value:
                        "shayari",
                    },
                  ]}
                />

                <SelectField
                  control={form.control}
                  name="emotion"
                  label="Emotion"
                  items={emotions.map(
                    (emotion) => ({
                      label:
                        emotion,
                      value:
                        emotion,
                    })
                  )}
                />
              </div>

              {/* ADVANCED */}

              <div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setShowAdvanced(
                      (
                        prev
                      ) => !prev
                    )
                  }
                  className="
                  h-14
                  w-full
                  rounded-2xl
                "
                >
                  <Settings2 className="mr-2 h-5 w-5" />

                  Advanced Literary Controls

                  {showAdvanced ? (
                    <ChevronUp className="ml-2 h-5 w-5" />
                  ) : (
                    <ChevronDown className="ml-2 h-5 w-5" />
                  )}
                </Button>
              </div>

              <AnimatePresence>
                {showAdvanced && (
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
                      y: -20,
                    }}
                    className="
                    rounded-[32px]
                    border
                    border-primary/10
                    bg-background/30
                    p-6
                  "
                  >
                    <div
                      className="
                      grid
                      grid-cols-1
                      gap-6
                      md:grid-cols-2
                      xl:grid-cols-4
                    "
                    >
                      <SelectField
                        control={
                          form.control
                        }
                        name="word_difficulty"
                        label="Vocabulary"
                        items={[
                          {
                            label:
                              "Simple",
                            value:
                              "simple",
                          },

                          {
                            label:
                              "Poetic",
                            value:
                              "poetic",
                          },

                          {
                            label:
                              "Classical",
                            value:
                              "classical",
                          },
                        ]}
                      />

                      <SelectField
                        control={
                          form.control
                        }
                        name="creativity_level"
                        label="Creativity"
                        items={[
                          {
                            label:
                              "Balanced",
                            value:
                              "balanced",
                          },

                          {
                            label:
                              "High",
                            value:
                              "high",
                          },

                          {
                            label:
                              "Extreme",
                            value:
                              "extreme",
                          },
                        ]}
                      />

                      <SelectField
                        control={
                          form.control
                        }
                        name="metaphor_density"
                        label="Metaphors"
                        items={[
                          {
                            label:
                              "Low",
                            value:
                              "low",
                          },

                          {
                            label:
                              "Balanced",
                            value:
                              "balanced",
                          },

                          {
                            label:
                              "High",
                            value:
                              "high",
                          },
                        ]}
                      />

                      <SelectField
                        control={
                          form.control
                        }
                        name="philosophical_depth"
                        label="Philosophy"
                        items={[
                          {
                            label:
                              "Minimal",
                            value:
                              "minimal",
                          },

                          {
                            label:
                              "Medium",
                            value:
                              "medium",
                          },

                          {
                            label:
                              "Deep",
                            value:
                              "deep",
                          },
                        ]}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* GENERATE */}

              <Button
                type="submit"
                disabled={
                  isGenerating
                }
                className="
                h-16
                w-full
                rounded-3xl
                text-lg
                font-black
              "
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                    Generating Literary Masterpiece...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-3 h-5 w-5" />
                    Generate Poetry
                  </>
                )}
              </Button>

              {/* PROGRESS */}

              {isGenerating && (
                <div className="space-y-3">
                  <div
                    className="
                    flex
                    items-center
                    justify-between
                    text-sm
                  "
                  >
                    <span>
                      AI Generation
                    </span>

                    <span>
                      {
                        generationProgress
                      }
                      %
                    </span>
                  </div>

                  <div
                    className="
                    h-3
                    overflow-hidden
                    rounded-full
                    bg-muted
                  "
                  >
                    <motion.div
                      animate={{
                        width: `${generationProgress}%`,
                      }}
                      className="
                      h-full
                      rounded-full
                      bg-primary
                    "
                    />
                  </div>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* STREAMING */}

      <AnimatePresence>
        {streamingText &&
          isGenerating && (
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
            >
              <Card
                className="
                rounded-[36px]
                border-primary/10
                bg-background/70
              "
              >
                <CardHeader>
                  <CardTitle
                    className="
                    flex
                    items-center
                    gap-3
                    text-2xl
                  "
                  >
                    <Feather className="h-6 w-6 animate-pulse text-primary" />

                    AI Poet is Writing...
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div
                    className="
                    whitespace-pre-wrap
                    font-serif
                    text-xl
                    italic
                    leading-[2.2]
                  "
                  >
                    {streamingText}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
      </AnimatePresence>

      {/* FINAL RESULT */}

      {finalPoem && (
        <div className="space-y-8">
          {/* FINAL POEM */}

          <Card
            className="
            rounded-[36px]
            border-primary/10
            bg-background/70
          "
          >
            <CardHeader>
              <CardTitle
                className="
                flex
                items-center
                gap-3
                text-3xl
              "
              >
                <ScrollText className="h-7 w-7 text-primary" />
                Generated Poetry
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div
                className="
                whitespace-pre-wrap
                font-serif
                text-xl
                leading-[2.2]
              "
              >
                {finalPoem}
              </div>
            </CardContent>
          </Card>

          {/* ANALYSIS */}

          {analysis && (
            <Card
              className="
              rounded-[36px]
              border-primary/10
            "
            >
              <CardHeader>
                <CardTitle
                  className="
                  flex
                  items-center
                  gap-3
                "
                >
                  <BrainCircuit className="h-6 w-6 text-primary" />
                  Literary Analysis
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div
                  className="
                  whitespace-pre-wrap
                  leading-[2]
                "
                >
                  {analysis}
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI IMPROVER */}

          <Card
            className="
            rounded-[36px]
            border-primary/10
          "
          >
            <CardHeader>
              <CardTitle
                className="
                flex
                items-center
                gap-3
              "
              >
                <Wand2 className="h-6 w-6 text-primary" />
                Improve This Poem
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <Textarea
                value={improvePrompt}
                onChange={(e) =>
                  setImprovePrompt(
                    e.target.value
                  )
                }
                placeholder="Tell AI how to improve the poem..."
                className="
                min-h-[150px]
                rounded-3xl
              "
              />

              <Button
                onClick={
                  handleImprove
                }
                className="
                rounded-2xl
              "
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Improve Poetry
              </Button>

              {improvedPoem && (
                <div
                  className="
                  whitespace-pre-wrap
                  rounded-3xl
                  border
                  border-primary/10
                  bg-background/40
                  p-6
                  font-serif
                  text-lg
                  leading-[2]
                "
                >
                  {improvedPoem}
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI CHAT */}

          <Card
            className="
            rounded-[36px]
            border-primary/10
          "
          >
            <CardHeader>
              <CardTitle
                className="
                flex
                items-center
                gap-3
              "
              >
                <Bot className="h-6 w-6 text-primary" />
                Talk With AI Poet
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <div
                className="
                max-h-[500px]
                space-y-4
                overflow-y-auto
              "
              >
                {aiConversation.map(
                  (
                    msg,
                    index
                  ) => (
                    <div
                      key={index}
                      className={`
                      rounded-3xl
                      p-5
                      ${
                        msg.role ===
                        "user"
                          ? "bg-primary/10"
                          : "bg-background/40"
                      }
                    `}
                    >
                      <div
                        className="
                        mb-2
                        text-xs
                        font-bold
                        uppercase
                        tracking-[0.2em]
                      "
                      >
                        {msg.role}
                      </div>

                      <div
                        className="
                        whitespace-pre-wrap
                        leading-[1.9]
                      "
                      >
                        {
                          msg.content
                        }
                      </div>
                    </div>
                  )
                )}
              </div>

              <div
                className="
                flex
                gap-3
              "
              >
                <Textarea
                  value={
                    aiChatInput
                  }
                  onChange={(e) =>
                    setAiChatInput(
                      e.target.value
                    )
                  }
                  placeholder="Ask AI how to improve lines, metaphors, rhythm..."
                  className="
                  min-h-[120px]
                  rounded-3xl
                "
                />

                <Button
                  onClick={
                    handleAiChat
                  }
                  className="
                  h-auto
                  rounded-3xl
                "
                >
                  <MessagesSquare className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}