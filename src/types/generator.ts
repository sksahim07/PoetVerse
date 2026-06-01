// ======================================================
// generator.ts
// PoetVerse Global Shared Types
// Professional Centralized Type System
// ======================================================

// ======================================================
// CORE LANGUAGE TYPES
// ======================================================

export type Language =
  | "english"
  | "urdu"
  | "hindi"
  | "bengali"
  | "roman_urdu";

// ======================================================
// EMOTION TYPES
// ======================================================

export type Emotion =
  | "love"
  | "heartbreak"
  | "sad"
  | "dark"
  | "romantic"
  | "melancholy"
  | "spiritual"
  | "cinematic"
  | "philosophical"
  | "motivation"
  | "loneliness"
  | "hope"
  | "friendship"
  | "attitude";

// ======================================================
// POETRY TYPES
// ======================================================

export type PoetryType =
  | "poem"
  | "ghazal"
  | "shayari"
  | "nazm"
  | "song"
  | "couplet";

// ======================================================
// WRITING STYLE TYPES
// ======================================================

export type LineLength =
  | "short"
  | "medium"
  | "long";

export type RhymeStyle =
  | "no_rhyme"
  | "soft_rhyme"
  | "strong_rhyme"
  | "internal_rhyme";

export type WordDifficulty =
  | "simple"
  | "poetic"
  | "classical";

export type ToneFilter =
  | "classical"
  | "sufi"
  | "modern"
  | "dark"
  | "soft_romantic"
  | "bollywood"
  | "old_school_ghazal"
  | "rap"
  | "romantic"
  | "cinematic"
  | "philosophical";

export type EmotionLevel =
  | "surface"
  | "deep"
  | "very_deep"
  | "painfully_honest";

export type FlowStyle =
  | "slow"
  | "smooth"
  | "dramatic";

// ======================================================
// FORM VALUES
// ======================================================

export interface FormValues {
  language: Language;

  emotion: Emotion;

  poetry_type: PoetryType;

  user_message?: string;

  mood?: string;

  target_person?: string;

  line_length: LineLength;

  rhyme_style: RhymeStyle;

  word_difficulty: WordDifficulty;

  tone_filter: ToneFilter;

  emotion_level: EmotionLevel;

  flow_style: FlowStyle;

  add_musical_notes: boolean;
}

// ======================================================
// MUSICAL NOTES
// ======================================================

export interface MusicalNotes {
  mood: string;

  scale: string;

  tempo: string;

  instruments: string[];

  cinematic_style?: string;

  vocal_texture?: string;

  emotional_curve?: string;

  atmosphere?: string;
}

// ======================================================
// LITERARY SCORE TYPES
// ======================================================

export interface LiteraryScoresType {
  emotionalDepth: number;

  metaphorQuality: number;

  rhythmFlow: number;

  originality: number;

  imagery: number;

  literaryPower: number;

  symbolism?: number;

  cadence?: number;

  emotionalResonance?: number;
}

// ======================================================
// CONVERSATION TYPES
// ======================================================

export type ConversationRole =
  | "user"
  | "assistant"
  | "system";

export type ConversationType =
  | "normal"
  | "analysis"
  | "rewrite"
  | "suggestion";

export interface ConversationMessage {
  id: string;

  role: ConversationRole;

  content: string;

  createdAt: number;

  type?: ConversationType;
}

// ======================================================
// AI FEEDBACK TYPES
// ======================================================

export interface AIRewriteFeedback {
  emotional_depth: string;

  metaphor_quality: string;

  rhythm_flow: string;

  originality: string;

  literary_strength: string;
}

// ======================================================
// AI REWRITE RESULT
// ======================================================

export interface ImprovePoemResult {
  improved_poem: string;

  feedback: AIRewriteFeedback;

  suggestions: string[];
}

// ======================================================
// POEM VERSION HISTORY
// ======================================================

export interface PoemVersion {
  id: string;

  content: string;

  createdAt: number;

  label?: string;

  score?: number;
}

// ======================================================
// AI INSIGHT TYPES
// ======================================================

export interface AIInsight {
  id: string;

  title: string;

  description: string;

  severity?: "low" | "medium" | "high";
}

// ======================================================
// STREAMING STATUS
// ======================================================

export type GenerationStage =
  | "idle"
  | "preparing"
  | "thinking"
  | "writing"
  | "refining"
  | "analyzing"
  | "finalizing"
  | "completed"
  | "failed";

// ======================================================
// GENERATION STATE
// ======================================================

export interface GenerationState {
  loading: boolean;

  progress: number;

  stage: GenerationStage;

  streamingText: string;

  finalPoem: string;
}

// ======================================================
// SAVED POEM DATABASE MODEL
// ======================================================

export interface SavedPoem {
  id: string;

  user_id?: string;

  title?: string;

  content: string;

  language: Language;

  emotion: Emotion;

  poetry_type: PoetryType;

  created_at?: string;

  updated_at?: string;

  musical_notes?: MusicalNotes | null;
}

// ======================================================
// EXPORT TYPES
// ======================================================

export type ExportFormat =
  | "pdf"
  | "image"
  | "instagram"
  | "audio"
  | "text";

// ======================================================
// THEME / AMBIENT MODES
// ======================================================

export type AmbientMode =
  | "love"
  | "dark"
  | "melancholy"
  | "spiritual"
  | "cinematic"
  | "romantic";

// ======================================================
// POEM ANALYSIS TYPES
// ======================================================

export interface PoemAnalysis {
  strengths: string[];

  weaknesses: string[];

  suggestions: string[];

  literary_summary: string;

  emotional_summary: string;
}

// ======================================================
// GENERATOR UI STATE
// ======================================================

export interface GeneratorUIState {
  showWorkspace: boolean;

  showConversation: boolean;

  showRewritePanel: boolean;

  showAdvancedControls: boolean;
}