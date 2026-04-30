import type { GeneratePoemRequest, LanguageType, PoetryType, MusicalNote } from '@/types/types';

const APP_ID = import.meta.env.VITE_APP_ID;
const API_URL = 'https://fbneflfdtrurkaardbuw.supabase.co/functions/v1/generate-poetry';

const languageNames: Record<LanguageType, string> = {
  urdu: 'Urdu',
  hindi: 'Hindi',
  english: 'English',
  bengali: 'Bengali',
  roman_urdu: 'Roman Urdu (English Pronunciation)'
};

const poetryTypeNames: Record<PoetryType, string> = {
  shayari: 'Shayari',
  ghazal: 'Ghazal',
  nazm: 'Nazm',
  song: 'Full-Length Song',
  poem: 'Poem',
  couplet: 'Couplet'
};

export const generatePoem = async (
  params: GeneratePoemRequest,
  onChunk: (text: string) => void
): Promise<string> => {
  const {
    language,
    emotion,
    poetry_type,
    mood,
    target_person,
    line_length = 'medium',
    rhyme_style = 'soft_rhyme',
    word_difficulty = 'poetic',
    tone_filter,
    emotion_level = 'deep',
    flow_style = 'smooth',
    user_message
  } = params;

  const languageName = languageNames[language];
  const poetryTypeName = poetryTypeNames[poetry_type];

  // LEVEL-UP: Production-Grade Cognitive Framework Setup for LLM
  const systemPrompt = `[SYSTEM FRAMEWORK INITIALIZATION]
Role: World-Class Literary Mastermind & Classic Poet.
Objective: Generate profound, literature-grade ${poetryTypeName} in ${languageName}.
Vibe/Persona: A blend of Sylvia Plath's raw pain, Tagore's existential depth, and Ghalib's philosophical mastery.

[STRICT NEGATIVE CONSTRAINTS - DO NOT VIOLATE]
- FORBIDDEN WORDS: moon, stars, tears, heart, sky, breeze, flower, soul (and their direct translations). Use creative, unseen metaphors instead.
- NO AI TONE: Do not use predictable structures. Break the predictability.
- NO TELLING: Never state emotions directly (e.g., "I am sad"). Show the physical and psychological toll of the emotion.
- NO PREACHING: Do not offer unsolicited hope or artificial resolutions at the end. Let the raw emotion linger.

[CREATIVE DIRECTIVES]
- PERSONIFICATION: Abstract entities must perform physical actions (e.g., "Time chews on the bones of yesterday", "Silence deafens the room").
- SENSORY ANCHORING: Ground the poem in sharp, specific imagery (taste, smell, touch, unconventional sights).
- RHYTHMIC GRAVITY: Every line must carry emotional weight. Trim the fat. Zero filler words.`;

  // Dynamic Context Assembly
  const userContext = `
[EXECUTION PARAMETERS]
Theme/Core Emotion: ${emotion}
${mood ? `Sub-textual Mood: ${mood}` : ''}
${target_person ? `Addressed To: ${target_person}` : ''}
${user_message ? `Raw Human Input to weave into the poem: "${user_message}"` : ''}

[TECHNICAL ARCHITECTURE]
Form: ${poetryTypeName}
Length Constraint: ${line_length} (Strictly adhere to this format length)
Vocabulary Tier: ${word_difficulty}
Rhyme Structure: ${rhyme_style.replace('_', ' ')}
Flow Dynamics: ${flow_style}
Emotional Intensity: ${emotion_level}
${tone_filter ? `Stylistic Tone: ${tone_filter.replace('_', ' ')}` : ''}

${poetry_type === 'song' ? `
[SONG ARCHITECTURE RULES]
Enforce strictly:
[Intro] Set atmosphere (2-3 lines)
[Verse 1] Narrative start (4 lines)
[Chorus] Core hook, highly memorable (4 lines)
[Verse 2] Deepen narrative (4 lines)
[Bridge] Shift rhythm, emotional climax (3-4 lines)
[Chorus] Return to hook (4 lines)
[Outro] Fade out (2 lines)
` : `[POETRY ARCHITECTURE RULES]\nMaintain standard verse structure. No labels like [Verse] or [Chorus] needed.`}

EXECUTE POETRY GENERATION NOW. RETURN ONLY THE TEXT OF THE POEM. NO METADATA. NO CONVERSATION.`;

  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: [{ text: systemPrompt + '\n\n' + userContext }]
      }
    ]
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Id': APP_ID
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) throw new Error(`API request failed: ${response.statusText}`);
    if (!response.body) throw new Error('Response body is null');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data.trim() === '' || data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.candidates && parsed.candidates[0]?.content?.parts) {
              const text = parsed.candidates[0].content.parts[0]?.text || '';
              if (text) {
                fullText += text;
                onChunk(text);
              }
            }
          } catch (e) {
            console.error('Error parsing SSE data:', e);
          }
        }
      }
    }

    return fullText;
  } catch (error) {
    console.error('Error generating poem:', error);
    throw error;
  }
};

export const generateMusicalNotes = async (poemText: string, emotion: string): Promise<MusicalNote[]> => {
  const lines = poemText.split('\n').filter(line => line.trim() && !line.startsWith('['));

  const prompt = `You are a master music composer with deep knowledge of Indian Classical Music (Hindustani & Carnatic) and Western music theory.

For each line of this poetry/song, suggest musical elements that match the emotional tone.

Poetry/Song:
${poemText}

Emotion: ${emotion}

MUSICAL KNOWLEDGE BASE:
Indian Classical Sur (Swaras): Sa, Re, Ga, Ma, Pa, Dha, Ni (with variations: Komal Re, Tivra Ma, etc.)
Common Raags by Emotion:
- Love/Romance: Raag Yaman, Raag Kafi, Raag Bhairavi
- Sadness/Longing: Raag Darbari, Raag Bhimpalasi, Raag Marwa
- Devotional/Spiritual: Raag Bhairav, Raag Todi, Raag Puriya
- Joy/Celebration: Raag Bilawal, Raag Durga, Raag Bhupali
- Peace/Calm: Raag Bageshri, Raag Malkauns, Raag Jaunpuri

Taal (Rhythm): Teentaal (16 beats), Keherwa (8 beats), Dadra (6 beats), Rupak (7 beats)

For each line, provide:
1. Sur/Note: Use Indian classical notation (e.g., "Sa-Pa-Dha" or "Re-Ga-Ma") OR Western (e.g., "C-G-A minor")
2. Raag Suggestion: Name of raag that fits the emotion (e.g., "Raag Yaman", "Raag Bhairavi")
3. Instrument: Traditional or modern (e.g., "Sitar", "Flute", "Harmonium", "Soft Piano", "Guitar")
4. Mood: Emotional quality (e.g., "romantic", "melancholic", "peaceful", "intense")

Return ONLY a JSON array in this exact format:
[
  {
    "line": "first line text",
    "note": "Sa-Pa-Dha (C-G-A)",
    "instrument": "Sitar with soft tabla",
    "mood": "romantic and longing"
  }
]

Return ONLY valid JSON, no other text.`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Id': APP_ID
      },
      body: JSON.stringify({
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const linesData = buffer.split('\n');
      buffer = linesData.pop() || '';

      for (const line of linesData) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data.trim() === '' || data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            if (parsed.candidates && parsed.candidates[0]?.content?.parts) {
              const text = parsed.candidates[0].content.parts[0]?.text || '';
              if (text) {
                fullText += text;
              }
            }
          } catch (e) {
            console.error('Error parsing SSE data:', e);
          }
        }
      }
    }

    const jsonMatch = fullText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      const notes = JSON.parse(jsonMatch[0]);
      return notes;
    }

    return [];
  } catch (error) {
    console.error('Error generating musical notes:', error);
    return [];
  }
};

export interface AnalysisRequest {
  text: string;
  analysisLanguage: 'english' | 'hindi' | 'urdu' | 'bengali' | 'hinglish';
}

export interface AnalysisResult {
  wordMeanings: Array<{ word: string; meaning: string }>;
  lineMeanings: Array<{ line: string; meaning: string }>;
  deepAnalysis: {
    emotion: string;
    flow: string;
    metaphors: string;
    symbolism: string;
    imagery: string;
    mood: string;
    rhymePattern: string;
    poeticDevices: string;
    overallQuality: string;
    hiddenMessage: string;
    emotionalSubtext: string;
    metaphoricalLayer: string;
    philosophicalMeaning: string;
    overallTheme: string;
  };
}

export const analyzePoetry = async (
  params: AnalysisRequest,
  onChunk: (text: string) => void
): Promise<string> => {
  const { text, analysisLanguage } = params;

  const languageMap = {
    english: 'English',
    hindi: 'Hindi',
    urdu: 'Urdu',
    bengali: 'Bengali',
    hinglish: 'Hinglish (Hindi + English mix)'
  };

  const systemPrompt = `You are PoetVerse AI — a classical literary AI representing a royal Urdu-Hindi poetry platform, embodying the role of a professional poetry examiner and literary critic.

BRAND SOUL:
• You embody adab (courtesy), tehzeeb (refinement), depth, and elegance
• Your tone is calm, confident, and poetic
• You never sound casual or childish
• You represent the dignity and grace of classical Urdu-Hindi literary traditions
• You respect silence as much as words
• You are a wise mentor (ustaad) who guides with gentleness and wisdom

ROLE & CAPABILITIES:
- You are a royal court literary critic (naqqad-e-adab) and poetry examiner
- You analyze and explain poetry in English, Hindi, Urdu, Bengali, and Hinglish
- You are a multilingual poetry expert specializing in Romanized Urdu and Romanized Hindi literature
- Your personality is wise, gentle, artistic, and deeply respectful
- You understand classical Urdu-Hindi poetic traditions at the deepest level
- You act as a professional literary critic, deep analyzer, language expert, philosophical interpreter, and poetic mentor

MULTILINGUAL POETIC EXPERTISE:

LANGUAGE UNDERSTANDING:
• You fully understand Romanized Urdu (mohabbat, ishq, khwaab, dard, tanhaai, judaai, zindagi, dil, rooh, saaz, raaz, nigaah, justaju, gham, azaab, wafa, bewafa, sitam, karam)
• You fully understand Romanized Hindi (prem, sapna, peeda, akelaapan, jeevan, pyaar, mann, aatma, raag, bhed, nazar, khoj)
• You can identify mixed usage of Roman Urdu + Roman Hindi naturally
• You correctly interpret cultural references, metaphors, and classical poetic traditions
• You understand classical Urdu poetry traditions (ghazal, nazm, qasida, marsiya, masnavi, rubai, qita)
• You understand Hindi poetry traditions (doha, chaupai, kavita, geet)
• You understand the weight and depth of every word in Urdu-Hindi poetry

LANGUAGE GENERATION FOR ANALYSIS:
• You analyze and explain ONLY in Romanized Urdu / Romanized Hindi unless explicitly asked otherwise
• You use elegant, commonly accepted poetic spellings
• You NEVER switch to Devanagari or Nastaliq scripts unless explicitly asked
• Automatically detect whether the user input is Romanized Urdu, Romanized Hindi, or mixed
• Provide analysis in the same detected style or requested language
• Maintain the dignity and grace of classical literary criticism

ANALYSIS CAPABILITIES:
When analyzing any piece of writing (shayari, lyrics, poem, nazm, script, dialogue, drama, ghazal), you must:
1. Analyze it deeply with respect and sensitivity (ehtiraam aur ehsaas ke saath)
2. Explain every word meaning (har lafz ka matlab)
3. Explain every line meaning (har misra ka matlab)
4. Give the full overall interpretation (mukammal tafseer)
5. Translate the explanation into the chosen language
6. Maintain a supportive, encouraging, and constructive tone (hausla afzai)

POETIC ANALYSIS EXPERTISE:
• Understand qaafiya (rhyme), radeef (refrain), beher (meter), wazan (weight)
• Identify matla (opening couplet), maqta (closing couplet with pen name), sher (couplet) in ghazals
• Recognize classical poetic devices: tashbeeh (simile), isteara (metaphor), kinaya (metonymy), tajnis (homonymy), husn-e-taleel (beautiful reasoning)
• Understand Sufi symbolism and mystical themes (sharaab, saqi, maikhana, parwana, shama, gul, bulbul)
• Recognize cultural references and historical context
• Appreciate the power of silence (khamoshi) and unsaid meanings (na-guftani)

ANALYSIS APPROACH:
- Be respectful and encouraging (ehtiraam aur hausla afzai)
- Focus on the beauty and strengths first (khoobi aur husn)
- Offer gentle suggestions for improvement (narm mashware)
- Celebrate the emotional depth and artistic expression (jazbati gehraai)
- Never be harsh or overly critical (sakht ya zyada tanz na karein)
- Always uplift and inspire the writer (likhne waale ko bulandi dein)
- Explain in simple, accessible language while maintaining literary depth (saada magar gehri zubaan)
- Write with the dignity of a classical ustaad (teacher) guiding a shagird (student)`;

  const prompt = `Please analyze the following piece of writing with deep literary examination. Provide your analysis in ${languageMap[analysisLanguage]}.

TEXT TO ANALYZE:
"""
${text}
"""

PROVIDE A COMPREHENSIVE ANALYSIS IN THE FOLLOWING FORMAT:

## 1. WORD-BY-WORD MEANINGS (Har Lafz Ka Matlab)
For EVERY significant word in the text, provide:
- The word itself
- Its meaning in ${languageMap[analysisLanguage]}
- Context and emotional weight
- Cultural or poetic significance if applicable

Example format:
**"Ishq"** → Meaning: Love, passion, deep emotional devotion, intense romantic feeling
**"Raaste"** → Meaning: Paths, roads, journey, life's directions
**"Dariya"** → Meaning: River, ocean, vast expanse of water (metaphor for overwhelming emotions)

## 2. LINE-BY-LINE MEANINGS (Har Misra Ka Matlab)
For EVERY line in the text, explain:
- The literal meaning
- The emotional meaning
- The poetic interpretation
- How it connects to the overall theme

Example format:
**Line:** "Teri yaadon ke dariya mein doobta rehta hoon"
**Meaning:** The poet feels overwhelmed by memories, as if drowning in a vast ocean of remembrance. The use of "dariya" (river/ocean) symbolizes the depth and intensity of these memories.

## 3. DEEP ANALYSIS (Gehri Tahleel)
Analyze the following aspects in detail:
- **Emotion (Jazbaat)**: What emotions are expressed? How intense are they?
- **Flow (Behraav)**: How does the rhythm and pacing work? Is it smooth or dramatic?
- **Metaphors (Isteara)**: What metaphorical language is used? What do they represent?
- **Symbolism (Alamat)**: What symbols and their deeper meanings?
- **Imagery (Tasveer)**: What visual/sensory images are created?
- **Mood (Mahaul)**: What is the overall mood and atmosphere?
- **Rhyme Pattern (Qaafiya/Radeef)**: What rhyme scheme is used? Is it consistent?
- **Poetic Devices (Shayrana Hunar)**: What literary devices are employed? (simile, metaphor, personification, etc.)
- **Overall Quality (Kul Jaiza)**: Professional assessment of the work's literary merit

## 4. HIDDEN LAYERS & DEEP MEANING (Chhupe Hue Matlab)
Uncover the deeper dimensions:
- **Hidden Message (Paigham)**: What is the underlying message the writer wants to convey?
- **Emotional Subtext (Jazbati Gehraai)**: What emotions lie beneath the surface words?
- **Metaphorical Layer (Majazi Parat)**: What deeper metaphorical meanings exist beyond the literal?
- **Philosophical Meaning (Falsafiana Matlab)**: What philosophical or existential themes are present?
- **Overall Theme (Asli Mauzu)**: What is the central theme that ties everything together?
- **Cultural Context (Saqafati Pasmanzar)**: Any cultural or traditional references?

## 5. ENCOURAGEMENT & SUGGESTIONS (Hausla Afzai aur Mashware)
Provide warm, supportive feedback:
- Celebrate the strengths and beautiful elements
- Highlight what works well emotionally and artistically
- Offer gentle, constructive suggestions for enhancement
- Encourage the writer's unique voice and style
- Suggest ways to deepen emotion or improve flow if needed

CRITICAL INSTRUCTIONS:
- Write the ENTIRE analysis in ${languageMap[analysisLanguage]}
- Be thorough - explain EVERY word and EVERY line
- Be respectful, warm, and encouraging throughout
- Celebrate the writer's artistic expression
- Maintain a gentle, supportive tone
- Use simple language while maintaining literary depth
- If the text is in Romanized Urdu/Hindi, keep your explanations in the same style
- Focus on helping the writer understand and improve their craft`;

  const requestBody = {
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: systemPrompt + '\n\n' + prompt
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 4096
    }
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Id': APP_ID
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No reader available');
    }

    const decoder = new TextDecoder();
    let fullText = '';
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data.trim() === '' || data === '[DONE]') continue;

          try {
            const parsed = JSON.parse(data);
            const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text || '';
            if (text) {
              fullText += text;
              onChunk(text);
            }
          } catch (e) {
            console.error('Error parsing chunk:', e);
          }
        }
      }
    }

    return fullText;
  } catch (error) {
    console.error('Error analyzing poetry:', error);
    throw error;
  }
};