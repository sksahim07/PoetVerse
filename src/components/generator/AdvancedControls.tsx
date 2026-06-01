// ======================================================
// AIConversation.tsx
// PoetVerse Ultra Premium AI Literary Conversation System
// Massive Professional Production Version
// ======================================================

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  KeyboardEvent,
} from 'react';

import {
  Bot,
  User,
  Sparkles,
  SendHorizonal,
  Loader2,
  BrainCircuit,
  Wand2,
  Copy,
  Check,
  Trash2,
  PenSquare,
  BookOpenText,
  Crown,
  Flame,
  Quote,
  Stars,
  ScrollText,
  Lightbulb,
  MessageSquareQuote,
  RefreshCcw,
  ArrowRight,
  Zap,
  Mic2,
  Feather,
  Drama,
} from 'lucide-react';

import { motion, AnimatePresence } from 'framer-motion';

import { toast } from 'sonner';

import { cn } from '@/lib/utils';

import {
  improvePoem,
  analyzePoem,
} from '@/services/llm';

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

import { ScrollArea } from '@/components/ui/scroll-area';

import { Separator } from '@/components/ui/separator';

// ======================================================
// TYPES
// ======================================================

export type ConversationRole =
  | 'user'
  | 'assistant'
  | 'system';

export type ConversationType =
  | 'normal'
  | 'rewrite'
  | 'analysis'
  | 'suggestion';

export interface ConversationMessage {
  id: string;

  role: ConversationRole;

  content: string;

  createdAt: number;

  type?: ConversationType;
}

interface AIConversationProps {
  poem: string;

  language?: string;

  loading?: boolean;

  onPoemUpdate?: (
    updatedPoem: string
  ) => void;
}

// ======================================================
// QUICK ACTIONS
// ======================================================

const QUICK_ACTIONS = [
  {
    title:
      'Make It More Emotional',

    icon: Flame,

    prompt:
      'Deepen the emotional realism. Add silent pain, emotional heaviness, and haunting feelings.',
  },

  {
    title:
      'Add Better Metaphors',

    icon: Sparkles,

    prompt:
      'Add cinematic metaphors, layered symbolism, and unforgettable imagery.',
  },

  {
    title:
      'Simplify The Language',

    icon: BookOpenText,

    prompt:
      'Rewrite the poem using simpler words while preserving emotional beauty.',
  },

  {
    title:
      'Make It Philosophical',

    icon: BrainCircuit,

    prompt:
      'Add philosophical undertones, existential depth, and reflective meaning.',
  },

  {
    title:
      'Improve Rhythm & Flow',

    icon: Wand2,

    prompt:
      'Improve rhythm, cadence, transitions, and poetic musicality naturally.',
  },

  {
    title:
      'Premium Literary Version',

    icon: Crown,

    prompt:
      'Rewrite this poem at elite literary quality using layered emotions and sophisticated poetic construction.',
  },
];

// ======================================================
// COMPONENT
// ======================================================

const AIConversation = ({
  poem,

  language = 'english',

  loading = false,

  onPoemUpdate,
}: AIConversationProps) => {
  // ====================================================
  // STATES
  // ====================================================

  const [
    messages,
    setMessages,
  ] = useState<
    ConversationMessage[]
  >([]);

  const [
    input,
    setInput,
  ] = useState('');

  const [
    isThinking,
    setIsThinking,
  ] = useState(false);

  const [
    copiedId,
    setCopiedId,
  ] = useState<
    string | null
  >(null);

  const [
    currentPoem,
    setCurrentPoem,
  ] = useState(poem);

  const [
    literaryAnalysis,
    setLiteraryAnalysis,
  ] = useState('');

  const [
    isAnalyzing,
    setIsAnalyzing,
  ] = useState(false);

  const scrollRef =
    useRef<HTMLDivElement | null>(
      null
    );

  // ====================================================
  // MEMOS
  // ====================================================

  const totalMessages =
    useMemo(() => {
      return messages.length;
    }, [messages]);

  // ====================================================
  // INITIAL SYSTEM MESSAGE
  // ====================================================

  useEffect(() => {
    const intro: ConversationMessage =
      {
        id:
          crypto.randomUUID(),

        role: 'assistant',

        type: 'normal',

        createdAt:
          Date.now(),

        content: `
I have analyzed your poem carefully.

Now you can:

• improve weak lines
• deepen emotional impact
• add cinematic metaphors
• simplify difficult words
• improve rhythm and flow
• rewrite specific sections
• add philosophical depth
• strengthen imagery and symbolism
• transform tone and style

Tell me exactly what you want to improve.
        `,
      };

    setMessages([intro]);
  }, []);

  // ====================================================
  // UPDATE POEM
  // ====================================================

  useEffect(() => {
    setCurrentPoem(poem);
  }, [poem]);

  // ====================================================
  // AUTO SCROLL
  // ====================================================

  useEffect(() => {
    if (!scrollRef.current)
      return;

    scrollRef.current.scrollTop =
      scrollRef.current.scrollHeight;
  }, [messages]);

  // ====================================================
  // COPY
  // ====================================================

  const handleCopy = async (
    text: string,
    id: string
  ) => {
    try {
      await navigator.clipboard.writeText(
        text
      );

      setCopiedId(id);

      toast.success(
        'Copied successfully.'
      );

      setTimeout(() => {
        setCopiedId(null);
      }, 1600);
    } catch {
      toast.error(
        'Copy failed.'
      );
    }
  };

  // ====================================================
  // SEND MESSAGE
  // ====================================================

  const sendMessage = async (
    customPrompt?: string
  ) => {
    const finalPrompt =
      customPrompt || input;

    if (!finalPrompt.trim())
      return;

    const userMessage: ConversationMessage =
      {
        id:
          crypto.randomUUID(),

        role: 'user',

        content:
          finalPrompt,

        createdAt:
          Date.now(),

        type: 'normal',
      };

    setMessages((prev) => [
      ...prev,
      userMessage,
    ]);

    setInput('');

    try {
      setIsThinking(true);

      // ==========================================
      // AI IMPROVEMENT
      // ==========================================

      const result =
        await improvePoem(
          currentPoem,
          finalPrompt,
          language
        );

      // ==========================================
      // REWRITE MESSAGE
      // ==========================================

      const rewriteMessage: ConversationMessage =
        {
          id:
            crypto.randomUUID(),

          role:
            'assistant',

          type:
            'rewrite',

          createdAt:
            Date.now(),

          content:
            result.improved_poem,
        };

      // ==========================================
      // FEEDBACK MESSAGE
      // ==========================================

      const feedbackMessage: ConversationMessage =
        {
          id:
            crypto.randomUUID(),

          role:
            'assistant',

          type:
            'suggestion',

          createdAt:
            Date.now(),

          content: `
Emotional Depth:
${result.feedback?.emotional_depth || 'Excellent'}

Metaphor Quality:
${result.feedback?.metaphor_quality || 'Strong'}

Rhythm & Flow:
${result.feedback?.rhythm_flow || 'Smooth'}

Originality:
${result.feedback?.originality || 'Unique'}

Literary Strength:
${result.feedback?.literary_strength || 'High'}

Suggestions:
${
  result.suggestions
    ?.map(
      (s: string) =>
        `• ${s}`
    )
    .join('\n') ||
  '• Continue refining emotional consistency.'
}
          `,
        };

      setMessages((prev) => [
        ...prev,
        rewriteMessage,
        feedbackMessage,
      ]);

      setCurrentPoem(
        result.improved_poem
      );

      onPoemUpdate?.(
        result.improved_poem
      );

      toast.success(
        'Poem upgraded successfully.'
      );
    } catch (error) {
      console.error(error);

      toast.error(
        'AI improvement failed.'
      );
    } finally {
      setIsThinking(false);
    }
  };

  // ====================================================
  // ANALYZE
  // ====================================================

  const runAnalysis =
    async () => {
      try {
        setIsAnalyzing(true);

        const analysis =
          await analyzePoem(
            currentPoem,
            language
          );

        setLiteraryAnalysis(
          analysis
        );

        toast.success(
          'Literary analysis complete.'
        );
      } catch (error) {
        console.error(error);

        toast.error(
          'Analysis failed.'
        );
      } finally {
        setIsAnalyzing(false);
      }
    };

  // ====================================================
  // CLEAR CHAT
  // ====================================================

  const clearChat = () => {
    setMessages([]);

    toast.success(
      'Conversation cleared.'
    );
  };

  // ====================================================
  // ENTER SEND
  // ====================================================

  const handleKeyDown = (
    e: KeyboardEvent<
      HTMLTextAreaElement
    >
  ) => {
    if (
      e.key === 'Enter' &&
      !e.shiftKey
    ) {
      e.preventDefault();

      sendMessage();
    }
  };

  // ====================================================
  // MESSAGE UI
  // ====================================================

  const renderMessage = (
    message: ConversationMessage
  ) => {
    const isUser =
      message.role === 'user';

    return (
      <motion.div
        key={message.id}
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.22,
        }}
        className={cn(
          'flex gap-4',
          isUser
            ? 'justify-end'
            : 'justify-start'
        )}
      >
        {!isUser && (
          <div
            className="
            mt-1
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-2xl
            border
            border-primary/20
            bg-primary/10
          "
          >
            <Bot className="h-5 w-5 text-primary" />
          </div>
        )}

        <div
          className={cn(
            `
            max-w-[85%]
            rounded-[28px]
            border
            p-5
            shadow-xl
            backdrop-blur-2xl
            `,
            isUser
              ? `
                border-primary/20
                bg-primary
                text-primary-foreground
              `
              : `
                border-primary/10
                bg-background/70
              `
          )}
        >
          {/* BADGES */}
          {!isUser &&
            message.type && (
              <div className="mb-4 flex flex-wrap gap-2">
                {message.type ===
                  'rewrite' && (
                  <Badge className="rounded-full">
                    <Wand2 className="mr-1 h-3 w-3" />
                    Improved Version
                  </Badge>
                )}

                {message.type ===
                  'suggestion' && (
                  <Badge
                    variant="secondary"
                    className="rounded-full"
                  >
                    <Lightbulb className="mr-1 h-3 w-3" />
                    Literary Feedback
                  </Badge>
                )}

                {message.type ===
                  'analysis' && (
                  <Badge
                    variant="outline"
                    className="rounded-full"
                  >
                    <BrainCircuit className="mr-1 h-3 w-3" />
                    Analysis
                  </Badge>
                )}
              </div>
            )}

          {/* CONTENT */}
          <div
            className={cn(
              `
              whitespace-pre-wrap
              leading-[2]
              `,
              message.type ===
                'rewrite'
                ? `
                  font-serif
                  text-[17px]
                  italic
                  sm:text-[18px]
                `
                : `
                  text-sm
                  sm:text-[15px]
                `
            )}
          >
            {message.content}
          </div>

          {/* ACTIONS */}
          <div
            className="
            mt-5
            flex
            flex-wrap
            items-center
            gap-2
          "
          >
            <Button
              size="sm"
              variant="ghost"
              className="rounded-xl"
              onClick={() =>
                handleCopy(
                  message.content,
                  message.id
                )
              }
            >
              {copiedId ===
              message.id ? (
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

            {!isUser &&
              message.type ===
                'rewrite' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl"
                  onClick={() => {
                    setCurrentPoem(
                      message.content
                    );

                    onPoemUpdate?.(
                      message.content
                    );

                    toast.success(
                      'Poem updated.'
                    );
                  }}
                >
                  <PenSquare className="mr-2 h-4 w-4" />
                  Use This Version
                </Button>
              )}
          </div>
        </div>

        {isUser && (
          <div
            className="
            mt-1
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-2xl
            border
            border-primary/20
            bg-primary/10
          "
          >
            <User className="h-5 w-5 text-primary" />
          </div>
        )}
      </motion.div>
    );
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div className="space-y-8">
      <Card
        className="
        overflow-hidden
        rounded-[36px]
        border-primary/10
        bg-background/70
        shadow-[0_20px_120px_rgba(0,0,0,0.35)]
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
              <CardTitle
                className="
                flex
                items-center
                gap-3
                text-3xl
                font-black
              "
              >
                <MessageSquareQuote className="h-8 w-8 text-primary" />
                AI Literary Conversation
              </CardTitle>

              <CardDescription className="mt-2 text-base">
                Collaborate with the AI poet
                to refine emotions, rhythm,
                metaphors, imagery, and
                literary beauty.
              </CardDescription>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge className="rounded-full px-4 py-2">
                <Sparkles className="mr-2 h-4 w-4" />
                Premium AI
              </Badge>

              <Badge
                variant="secondary"
                className="rounded-full px-4 py-2"
              >
                <Quote className="mr-2 h-4 w-4" />
                {totalMessages} Messages
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* QUICK ACTIONS */}
          <div className="mb-8">
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
              <Stars className="h-4 w-4" />
              Quick Literary Improvements
            </div>

            <div className="flex flex-wrap gap-3">
              {QUICK_ACTIONS.map(
                (action) => {
                  const Icon =
                    action.icon;

                  return (
                    <Button
                      key={
                        action.title
                      }
                      variant="outline"
                      className="
                      rounded-2xl
                      border-primary/10
                      bg-background/40
                    "
                      onClick={() =>
                        sendMessage(
                          action.prompt
                        )
                      }
                    >
                      <Icon className="mr-2 h-4 w-4" />
                      {action.title}
                    </Button>
                  );
                }
              )}
            </div>
          </div>

          <Separator className="mb-6" />

          {/* CHAT */}
          <ScrollArea
            className="
            h-[700px]
            rounded-[32px]
            border
            border-primary/10
            bg-background/30
            p-6
          "
          >
            <div
              ref={scrollRef}
              className="space-y-6"
            >
              {messages.map(
                renderMessage
              )}

              {/* THINKING */}
              <AnimatePresence>
                {isThinking && (
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
                    className="flex gap-4"
                  >
                    <div
                      className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      border-primary/20
                      bg-primary/10
                    "
                    >
                      <Bot className="h-5 w-5 text-primary" />
                    </div>

                    <div
                      className="
                      flex
                      items-center
                      gap-3
                      rounded-[24px]
                      border
                      border-primary/10
                      bg-background/60
                      px-5
                      py-4
                    "
                    >
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />

                      <span className="text-sm">
                        AI poet is rewriting
                        your masterpiece...
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>

          {/* INPUT */}
          <div className="mt-6">
            <div
              className="
              overflow-hidden
              rounded-[32px]
              border
              border-primary/10
              bg-background/50
              shadow-xl
            "
            >
              <Textarea
                value={input}
                disabled={
                  isThinking ||
                  loading
                }
                onChange={(e) =>
                  setInput(
                    e.target.value
                  )
                }
                onKeyDown={
                  handleKeyDown
                }
                placeholder="
Tell the AI exactly what you want...

Examples:
• Make the ending emotionally devastating
• Add stronger metaphors
• Rewrite with simpler words
• Improve rhythm and flow
• Add philosophical depth
• Make it feel cinematic
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
                    <Flame className="mr-1 h-3 w-3" />
                    Emotional Depth
                  </Badge>

                  <Badge
                    variant="secondary"
                    className="rounded-full"
                  >
                    <Sparkles className="mr-1 h-3 w-3" />
                    Cinematic Imagery
                  </Badge>

                  <Badge
                    variant="secondary"
                    className="rounded-full"
                  >
                    <BrainCircuit className="mr-1 h-3 w-3" />
                    Literary Intelligence
                  </Badge>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="rounded-2xl"
                    disabled={
                      isAnalyzing
                    }
                    onClick={
                      runAnalysis
                    }
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <BrainCircuit className="mr-2 h-4 w-4" />
                        Analyze
                      </>
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    className="rounded-2xl"
                    onClick={
                      clearChat
                    }
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear
                  </Button>

                  <Button
                    disabled={
                      isThinking ||
                      !input.trim()
                    }
                    onClick={() =>
                      sendMessage()
                    }
                    className="
                    h-14
                    rounded-2xl
                    px-8
                    text-base
                    font-bold
                  "
                  >
                    {isThinking ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Thinking...
                      </>
                    ) : (
                      <>
                        <SendHorizonal className="mr-2 h-5 w-5" />
                        Send
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* ANALYSIS */}
          <AnimatePresence>
            {literaryAnalysis && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="mt-8"
              >
                <Card
                  className="
                  rounded-[32px]
                  border-primary/10
                  bg-background/50
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
                      <ScrollText className="h-7 w-7 text-primary" />
                      Literary Analysis
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div
                      className="
                      whitespace-pre-wrap
                      font-serif
                      text-[17px]
                      leading-[2]
                    "
                    >
                      {literaryAnalysis}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIConversation;