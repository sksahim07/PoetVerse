// Poet's DNA - User's poetic style preferences
export interface PoetDNA {
  style: 'classical' | 'modern' | 'sufi' | 'dark' | 'soft_romantic';
  preferredLanguages: string[];
  emotionalTendency: 'deep' | 'surface' | 'very_deep' | 'painfully_honest';
  rhymePreference: 'soft_rhyme' | 'strong_rhyme' | 'no_rhyme' | 'internal_rhyme';
  wordComplexity: 'simple' | 'poetic' | 'classical';
  favoriteThemes: string[];
}

const POET_DNA_KEY = 'poetverse_poet_dna';

export const getPoetDNA = (): PoetDNA | null => {
  try {
    const stored = localStorage.getItem(POET_DNA_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error loading Poet DNA:', error);
    return null;
  }
};

export const savePoetDNA = (dna: PoetDNA): void => {
  try {
    localStorage.setItem(POET_DNA_KEY, JSON.stringify(dna));
  } catch (error) {
    console.error('Error saving Poet DNA:', error);
  }
};

export const clearPoetDNA = (): void => {
  try {
    localStorage.removeItem(POET_DNA_KEY);
  } catch (error) {
    console.error('Error clearing Poet DNA:', error);
  }
};

export const getDefaultPoetDNA = (): PoetDNA => {
  return {
    style: 'classical',
    preferredLanguages: ['urdu', 'hindi'],
    emotionalTendency: 'deep',
    rhymePreference: 'soft_rhyme',
    wordComplexity: 'poetic',
    favoriteThemes: ['love', 'spiritual']
  };
};

// Apply Poet DNA to generation parameters
export const applyPoetDNA = (params: any, dna: PoetDNA | null): any => {
  if (!dna) return params;

  return {
    ...params,
    emotion_level: dna.emotionalTendency,
    rhyme_style: dna.rhymePreference,
    word_difficulty: dna.wordComplexity,
    tone_filter: dna.style
  };
};
