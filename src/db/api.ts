import { supabase } from './supabase';
import type { Poem, Favorite, LanguageType, PoetryType, PoemWithFavorite } from '@/types/types';

/**
 * ইউজারের আইডি পাওয়ার জন্য এই ফাংশন অ্যাসিঙ্ক্রোনাস।
 */
export const getUserId = async (): Promise<string | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id || null;
};

/**
 * ইউজারের বর্তমান ক্রেডিট চেক করার ফাংশন
 */
export const getUserCredits = async (userId: string): Promise<number> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('credits')
    .eq('id', userId)
    .single();

  if (error || !data) return 0;
  return data.credits;
};

/**
 * ক্রেডিট কমানোর কোর লজিক
 */
export const subtractCredit = async (userId: string): Promise<boolean> => {
  const currentCredits = await getUserCredits(userId);
  
  if (currentCredits <= 0) return false;

  const { error } = await supabase
    .from('profiles')
    .update({ credits: currentCredits - 1 })
    .eq('id', userId);

  return !error;
};

/**
 * ক্রেডিট যোগ করার কোর লজিক (নতুন সংযোজন)
 * অ্যাড দেখলে বা টাকা দিয়ে কিনলে এই ফাংশনটি কল হবে।
 */
export const addCredits = async (userId: string, amount: number): Promise<boolean> => {
  try {
    const currentCredits = await getUserCredits(userId);
    
    const { error } = await supabase
      .from('profiles')
      .update({ credits: currentCredits + amount })
      .eq('id', userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Add Credit Error:', error);
    return false;
  }
};

/**
 * কবিতা তৈরি এবং ক্রেডিট ম্যানেজমেন্ট
 */
export const createPoem = async (poemData: Omit<Poem, 'id' | 'created_at' | 'user_id' | 'is_featured' | 'is_daily'>): Promise<Poem | null> => {
  const userId = await getUserId();
  if (!userId) return null;

  const credits = await getUserCredits(userId);
  if (credits <= 0) return null;

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

  if (error) return null;

  if (error) return null;

// Credit already deducted before generation
return data;
};

// --- বাকি সব ফাংশন যা ছিল ---

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
  return error ? [] : (Array.isArray(data) ? data : []);
};

export const getUserPoems = async (): Promise<PoemWithFavorite[]> => {
  const userId = await getUserId();
  if (!userId) return [];
  const { data, error } = await supabase.from('poems').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  if (error || !data || data.length === 0) return [];
  const poemIds = data.map(p => p.id);
  const { data: favorites } = await supabase.from('favorites').select('poem_id').eq('user_id', userId).in('poem_id', poemIds);
  const favoritePoemIds = new Set(favorites?.map(f => f.poem_id) || []);
  return data.map(poem => ({ ...poem, is_favorited: favoritePoemIds.has(poem.id) }));
};

export const getPoemById = async (id: string): Promise<Poem | null> => {
  const { data, error } = await supabase.from('poems').select('*').eq('id', id).maybeSingle();
  return error ? null : data;
};

export const addFavorite = async (poemId: string): Promise<Favorite | null> => {
  const userId = await getUserId();
  if (!userId) return null;
  const { data, error } = await supabase.from('favorites').insert({ user_id: userId, poem_id: poemId }).select().maybeSingle();
  return error ? null : data;
};

export const removeFavorite = async (poemId: string): Promise<boolean> => {
  const userId = await getUserId();
  if (!userId) return false;
  const { error } = await supabase.from('favorites').delete().eq('user_id', userId).eq('poem_id', poemId);
  return !error;
};

export const getUserFavorites = async (): Promise<PoemWithFavorite[]> => {
  const userId = await getUserId();
  if (!userId) return [];
  const { data, error } = await supabase.from('favorites').select('poem_id, poems!inner(*)').eq('user_id', userId).order('created_at', { ascending: false });
  if (error || !Array.isArray(data)) return [];
  return data.map((fav: any) => ({ ...fav.poems, is_favorited: true }));
};

export const checkIfFavorited = async (poemId: string): Promise<boolean> => {
  const userId = await getUserId();
  if (!userId) return false;
  const { data, error } = await supabase.from('favorites').select('id').eq('user_id', userId).eq('poem_id', poemId).maybeSingle();
  return !error && !!data;
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
  if (!poems || poems.length === 0) return [];
  const userId = await getUserId();
  if (!userId) return poems.map(p => ({ ...p, is_favorited: false }));
  const poemIds = poems.map(p => p.id);
  const { data: favorites } = await supabase.from('favorites').select('poem_id').eq('user_id', userId).in('poem_id', poemIds);
  const favoritePoemIds = new Set(favorites?.map(f => f.poem_id) || []);
  return poems.map(poem => ({ ...poem, is_favorited: favoritePoemIds.has(poem.id) }));
};

export const deletePoem = async (poemId: string): Promise<boolean> => {
  const userId = await getUserId();
  if (!userId) return false;
  const { error } = await supabase.from('poems').delete().eq('id', poemId).eq('user_id', userId);
  return !error;
};

// ============================================================================
// HOME PAGE DYNAMIC DATA FETCHING
// ============================================================================

export async function getTodayVerse() {
  try {
    // Get today's date in YYYY-MM-DD format based on local time
    const today = new Date().toLocaleDateString('en-CA'); 
    
    const { data, error } = await supabase
      .from('daily_verses')
      .select('*')
      .eq('display_date', today)
      .single();

    if (error && error.code !== 'PGRST116') {
       console.error("Error fetching daily verse:", error);
    }
    return data;
  } catch (err) {
    console.error("Catch error in getTodayVerse:", err);
    return null;
  }
}

export async function getActiveEvent() {
  try {
    const today = new Date().toLocaleDateString('en-CA');
    
    const { data, error } = await supabase
      .from('app_events')
      .select('*')
      .lte('start_date', today)
      .gte('end_date', today)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') {
       console.error("Error fetching active event:", error);
    }
    return data;
  } catch (err) {
    console.error("Catch error in getActiveEvent:", err);
    return null;
  }
}