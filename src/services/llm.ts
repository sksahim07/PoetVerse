import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

interface GenerateParams {
  poetry_type: string;
  language: string;
  emotion: string;
  mood?: string;
  user_message?: string;
  tone_filter?: string;
  emotion_level?: string;
  word_difficulty?: string;
  flow_style?: string;
  line_length?: string;
  rhyme_style?: string;
  target_person?: string;
}

// ১. কবিতা জেনারেট করার ফাংশন
export async function generatePoem(params: GenerateParams, onChunk?: (chunk: string) => void) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    
    const prompt = `You are a legendary poet (Maestro). Write a highly sophisticated ${params.poetry_type} in ${params.language}.
    - Core Emotion: ${params.emotion}
    - Mood/Ambience: ${params.mood || 'Standard'}
    - Additional Context: ${params.user_message || 'None'}
    - Stylistic Tone: ${params.tone_filter || 'Classical'}
    - Emotional Depth: ${params.emotion_level || 'Deep'}
    - Vocabulary Level: ${params.word_difficulty || 'Poetic'}
    - Poetic Flow: ${params.flow_style || 'Smooth'}
    - Structure: ${params.line_length || 'Medium'} length with ${params.rhyme_style || 'Soft'} rhyming style.
    - Addressed to: ${params.target_person || 'General Audience'}
    
    Make it royal, evocative, and literature-grade. Focus on deep metaphors and avoid clichés.`;

    const result = await model.generateContentStream(prompt);
    let fullText = "";

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullText += chunkText;
      if (onChunk) onChunk(chunkText);
    }
    return fullText;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
}

// ২. লিটারারি অ্যানালাইসিস ফাংশন (Strict Language Enforcement)
export async function analyzePoem(content: string, language: string = 'bengali') {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `You are a world-class literary critic and scholar. Analyze the following verses:
    
    "${content}"
    
    CRITICAL RULE FOR OUTPUT: You MUST write your ENTIRE response STRICTLY and EXCLUSIVELY in the "${language}" language. Do NOT use English or Hinglish/Romanized scripts unless you are directly quoting the original text. Use the native script of the language (e.g., use actual Bengali script for Bengali, Devanagari for Hindi).
    
    Provide a professional, deep, and surgical evaluation covering:
    1. Emotional Architecture: The layers of feelings.
    2. Metaphors & Symbolism: Deconstructing the hidden meanings.
    3. Rhythmic & Structural Quality: Evaluation of flow and meter.
    4. Overall Impact: The legacy of this piece.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Analysis Error:", error);
    throw error;
  }
}

// ৩. মিউজিক্যাল সুর সাজেশন ফাংশন (Professional A-to-Z Stanza Breakdown)
export async function generateMusicalNotes(content: string, emotion: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Act as a master Indian Classical Musician, Composer, and Music Director. Perform a highly professional, A-to-Z musical analysis on these lyrics:
    
    "${content}"
    
    Dominant Emotion: ${emotion}

    Output your response strictly in clean Markdown format so it can be parsed nicely. Do not use generic filler words. Be surgical and specific. Provide a deep, structural breakdown covering:

    **1. Core Musical Identity**
    - **Primary Raag & Justification:** (Name the exact Raag and logically explain why it fits the emotion).
    - **Suggested Taal & Tempo:** (Rhythm/Beats and precise BPM range).
    - **Instrumentation:** (Which instruments to use and for what purpose).

    **2. Stanza-by-Stanza Composition (The Blueprint)**
    Break down the lyrics stanza by stanza (or line by line if it's short). For each part, specify:
    - **Mood Shift:** How the feeling changes.
    - **Melodic Movement (Swaras):** Suggest specific note patterns (e.g., touching Komal Re, or gliding from Pa to Sa).
    - **Vocal Dynamics:** Where to take a breath, where to use 'Meend' (glides), and which words to emphasize.

    **3. Maestro's Vision (Director's Note)**
    - Your professional, direct opinion on how the song should begin (Prelude/Alaap).
    - How it should end (Fade out, Crescendo, or an abrupt stop).
    - Any hidden thematic or rhythmic connections between lines that the singer must focus on.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Musical Note Error:", error);
    throw error;
  }
}