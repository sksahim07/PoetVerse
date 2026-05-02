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

export async function analyzePoem(content: string, language: string = 'bengali') {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `You are a world-class literary critic and scholar. Analyze the following verses:
    
    "${content}"
    
    CRITICAL RULE FOR OUTPUT: You MUST write your ENTIRE response STRICTLY and EXCLUSIVELY in the "${language}" language. Do NOT use English or Hinglish/Romanized scripts unless you are directly quoting the original text. Use the native script of the language.
    
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

// Updated: JSON output & Language Support
export async function generateMusicalNotes(content: string, emotion: string, language: string = 'English') {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Act as a master Indian Classical Musician and Music Director. Analyze these lyrics:
    
    "${content}"
    
    Dominant Emotion: ${emotion}
    
    CRITICAL INSTRUCTION: You MUST write the ENTIRE response in ${language}.
    CRITICAL FORMATTING: You MUST return ONLY a valid JSON object. Do NOT wrap it in markdown blockquotes (like \`\`\`json). Just the raw JSON object.
    
    Use this EXACT JSON structure:
    {
      "core_identity": {
        "raag": "Name of Raag and brief 1-line justification",
        "taal_tempo": "Suggested Taal and precise BPM",
        "instruments": "2-3 key instruments to use"
      },
      "stanzas": [
        {
          "lyrics_snippet": "First 3-4 words of the stanza",
          "mood_shift": "How the emotion changes here",
          "swaras": "Specific melodic movement or notes to hit",
          "vocals": "Vocal dynamics (breath, meend, emphasis)"
        }
      ],
      "maestro_notes": "Director's vision for prelude, ending, and overall flow",
      "attraction_points": "The 'Hook' - important elements that will attract everybody and make it memorable"
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    // Clean up potential markdown formatting from Gemini
    let jsonString = response.text().replace(/```json/gi, '').replace(/```/g, '').trim();
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Musical Note Error (JSON Parse Failed):", error);
    throw error;
  }
}