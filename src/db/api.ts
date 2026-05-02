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
    return null;
  }
  
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

  if (filters?.language) query = query.eq('language', filters.language);
  if (filters?.emotion) query = query.eq('emotion', filters.emotion);
  if (filters?.poetry_type) query = query.eq('poetry_type', filters.poetry_type);
  if (filters?.is_featured !== undefined) query = query.eq('is_featured', filters.is_featured);
  if (filters?.is_daily !== undefined) query = query.eq('is_daily', filters.is_daily);

  query = query.order('created_at', { ascending: false });

  if (filters?.limit) query = query.limit(filters.limit);

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching poems:', error);
    return [];
  }
  return Array.isArray(data) ? data : [];
};

// Optimized: Now maps favorite status directly so "My Poems" tab shows correct heart icons
export const getUserPoems = async (): Promise<PoemWithFavorite[]> => {
  const userId = getUserId();
  const { data, error } = await supabase
    .from('poems')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error || !data) {
    console.error('Error fetching user poems:', error);
    return [];
  }

  if (data.length === 0) return [];

  // Fetch favorite status only for the loaded poems
  const poemIds = data.map(p => p.id);
  const { data: favorites } = await supabase
    .from('favorites')
    .select('poem_id')
    .eq('user_id', userId)
    .in('poem_id', poemIds);

  const favoritePoemIds = new Set(favorites?.map(f => f.poem_id) || []);

  return data.map(poem => ({
    ...poem,
    is_favorited: favoritePoemIds.has(poem.id)
  }));
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
    .insert({ user_id: userId, poem_id: poemId })
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

// Optimized: Added !inner to prevent rendering crashed null poems if original poem was deleted
export const getUserFavorites = async (): Promise<PoemWithFavorite[]> => {
  const userId = getUserId();
  const { data, error } = await supabase
    .from('favorites')
    .select('poem_id, poems!inner(*)') 
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

  if (error) return false;
  return !!data;
};

// Optimized: Checks ONLY the specific poem IDs fetched, instead of the entire user favorite history
export const getPoemsWithFavoriteStatus = async (filters?: {
  language?: LanguageType;
  emotion?: string;
  poetry_type?: PoetryType;
  is_featured?: boolean;
  is_daily?: boolean;
  limit?: number;
}): Promise<PoemWithFavorite[]> => {
  const poems = await getPoems(filters);
  if (!poems || poems.length === 0) return [];

  const userId = getUserId();
  const poemIds = poems.map(p => p.id);

  const { data: favorites } = await supabase
    .from('favorites')
    .select('poem_id')
    .eq('user_id', userId)
    .in('poem_id', poemIds);

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