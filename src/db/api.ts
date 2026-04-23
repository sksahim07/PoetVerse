import { supabase } from './supabase';
import type { Poem, Favorite, LanguageType, PoetryType, PoemWithFavorite } from '@/types/types';

export const getUserId = (): string => {
  let userId = localStorage.getItem('poetverse_user_id');
  if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem('poetverse_user_id', userId);
  }
  return userId;
};

export const createPoem = async (poemData: Omit<Poem, 'id' | 'created_at' | 'user_id' | 'is_featured' | 'is_daily'>): Promise<Poem | null> => {
  const userId = getUserId();
  
  console.log('Creating poem with data:', {
    contentLength: poemData.content.length,
    poetry_type: poemData.poetry_type,
    hasMusicalNotes: !!poemData.musical_notes
  });
  
  const { data, error } = await supabase
    .from('poems')
    .insert({
      user_id: userId,
      content: poemData.content,
      language: poemData.language,
      emotion: poemData.emotion,
      poetry_type: poemData.poetry_type,
      is_featured: false,
      is_daily: false,
      line_length: poemData.line_length || null,
      rhyme_style: poemData.rhyme_style || null,
      word_difficulty: poemData.word_difficulty || null,
      tone_filter: poemData.tone_filter || null,
      emotion_level: poemData.emotion_level || null,
      flow_style: poemData.flow_style || null,
      musical_notes: poemData.musical_notes || null,
      conversation_language: poemData.conversation_language || null
    })
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error creating poem:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return null;
  }
  
  console.log('Poem created successfully:', data?.id);
  return data;
};

export const getPoems = async (filters?: {
  language?: LanguageType;
  emotion?: string;
  poetry_type?: PoetryType;
  is_featured?: boolean;
  is_daily?: boolean;
  limit?: number;
}): Promise<Poem[]> => {
  let query = supabase.from('poems').select('*');

  if (filters?.language) {
    query = query.eq('language', filters.language);
  }
  if (filters?.emotion) {
    query = query.eq('emotion', filters.emotion);
  }
  if (filters?.poetry_type) {
    query = query.eq('poetry_type', filters.poetry_type);
  }
  if (filters?.is_featured !== undefined) {
    query = query.eq('is_featured', filters.is_featured);
  }
  if (filters?.is_daily !== undefined) {
    query = query.eq('is_daily', filters.is_daily);
  }

  query = query.order('created_at', { ascending: false });

  if (filters?.limit) {
    query = query.limit(filters.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching poems:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
};

export const getUserPoems = async (): Promise<Poem[]> => {
  const userId = getUserId();
  const { data, error } = await supabase
    .from('poems')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user poems:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
};

export const getPoemById = async (id: string): Promise<Poem | null> => {
  const { data, error } = await supabase
    .from('poems')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('Error fetching poem:', error);
    return null;
  }
  return data;
};

export const addFavorite = async (poemId: string): Promise<Favorite | null> => {
  const userId = getUserId();
  const { data, error } = await supabase
    .from('favorites')
    .insert({
      user_id: userId,
      poem_id: poemId
    })
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error adding favorite:', error);
    return null;
  }
  return data;
};

export const removeFavorite = async (poemId: string): Promise<boolean> => {
  const userId = getUserId();
  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('user_id', userId)
    .eq('poem_id', poemId);

  if (error) {
    console.error('Error removing favorite:', error);
    return false;
  }
  return true;
};

export const getUserFavorites = async (): Promise<PoemWithFavorite[]> => {
  const userId = getUserId();
  const { data, error } = await supabase
    .from('favorites')
    .select('poem_id, poems(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }

  if (!Array.isArray(data)) return [];

  return data.map((fav: any) => ({
    ...fav.poems,
    is_favorited: true
  }));
};

export const checkIfFavorited = async (poemId: string): Promise<boolean> => {
  const userId = getUserId();
  const { data, error } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('poem_id', poemId)
    .maybeSingle();

  if (error) {
    console.error('Error checking favorite:', error);
    return false;
  }
  return !!data;
};

export const getPoemsWithFavoriteStatus = async (filters?: {
  language?: LanguageType;
  emotion?: string;
  poetry_type?: PoetryType;
  is_featured?: boolean;
  is_daily?: boolean;
  limit?: number;
}): Promise<PoemWithFavorite[]> => {
  const poems = await getPoems(filters);
  const userId = getUserId();

  const { data: favorites } = await supabase
    .from('favorites')
    .select('poem_id')
    .eq('user_id', userId);

  const favoritePoemIds = new Set(favorites?.map(f => f.poem_id) || []);

  return poems.map(poem => ({
    ...poem,
    is_favorited: favoritePoemIds.has(poem.id)
  }));
};

export const deletePoem = async (poemId: string): Promise<boolean> => {
  const userId = getUserId();
  
  const { error } = await supabase
    .from('poems')
    .delete()
    .eq('id', poemId)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting poem:', error);
    return false;
  }
  
  return true;
};
