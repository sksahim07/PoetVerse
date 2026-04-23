export type LanguageType = 'urdu' | 'hindi' | 'english' | 'bengali' | 'roman_urdu';

export type PoetryType = 'shayari' | 'ghazal' | 'nazm' | 'song' | 'poem' | 'couplet';

export type EmotionType = 'love' | 'sad' | 'heartbreak' | 'attitude' | 'spiritual' | 'friendship' | 'motivation' | 'romantic' | 'inspirational' | 'melancholy' | 'loneliness' | 'hope' | 'emptiness' | 'excitement' | 'confusion';

export type LineLengthType = 'short' | 'medium' | 'long';

export type RhymeStyleType = 'no_rhyme' | 'soft_rhyme' | 'strong_rhyme' | 'internal_rhyme';

export type WordDifficultyType = 'simple' | 'poetic' | 'classical';

export type ToneFilterType = 'classical' | 'sufi' | 'modern' | 'dark' | 'soft_romantic' | 'bollywood' | 'old_school_ghazal' | 'rap' | 'romantic';

export type EmotionLevelType = 'surface' | 'deep' | 'very_deep' | 'painfully_honest';

export type FlowStyleType = 'slow' | 'smooth' | 'dramatic';

export type ConversationLanguageType = 'hindi' | 'urdu' | 'bengali' | 'hinglish' | 'english';

export interface MusicalNote {
  line: string;
  note: string;
  instrument: string;
  mood: string;
}

export interface Poem {
  id: string;
  user_id: string;
  content: string;
  language: LanguageType;
  emotion: string;
  poetry_type: PoetryType;
  is_featured: boolean;
  is_daily: boolean;
  created_at: string;
  line_length?: string;
  rhyme_style?: string;
  word_difficulty?: string;
  tone_filter?: string;
  emotion_level?: string;
  flow_style?: string;
  musical_notes?: MusicalNote[];
  conversation_language?: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  poem_id: string;
  created_at: string;
}

export interface PoemWithFavorite extends Poem {
  is_favorited?: boolean;
}

export interface GeneratePoemRequest {
  language: LanguageType;
  emotion: string;
  poetry_type: PoetryType;
  mood?: string;
  target_person?: string;
  line_length?: LineLengthType;
  rhyme_style?: RhymeStyleType;
  word_difficulty?: WordDifficultyType;
  tone_filter?: ToneFilterType;
  emotion_level?: EmotionLevelType;
  flow_style?: FlowStyleType;
  conversation_language?: ConversationLanguageType;
  user_message?: string;
}
