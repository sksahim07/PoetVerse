import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// ১. কবিতা জেনারেট করার ফাংশন (সব প্যারামিটার সহ)
export async function generatePoem(params: any, onChunk?: (chunk: string) => void) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
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

// ২. লিটারারি অ্যানালাইসিস ফাংশন
export async function analyzePoem(content: string, language: string = 'bengali') {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `You are a world-class literary critic and scholar. Analyze the following verses written in ${language}:
    
    "${content}"
    
    Provide a professional, deep, and surgical evaluation covering:
    1. Emotional Architecture: The layers of feelings.
    2. Metaphors & Symbolism: Deconstructing the hidden meanings.
    3. Rhythmic & Structural Quality: Evaluation of flow and meter.
    4. Overall Impact: The legacy of this piece.
    
    Write the response in a royal and poetic tone using a mix of English and ${language}.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Analysis Error:", error);
    throw error;
  }
}

// ৩. মিউজিক্যাল সুর সাজেশন ফাংশন
export async function generateMusicalNotes(content: string, emotion: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Act as a Raag Maestro. Based on these lyrics: "${content}", suggest:
    - Suitable Indian Raag (e.g., Yaman, Bhairavi, Darbari).
    - Taal and Tempo (BPM).
    - Recommended Instruments.
    - Emotional Scale.
    The dominant emotion is ${emotion}. Give a concise but poetic musical soul-mapping.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Musical Note Error:", error);
    throw error;
  }
}