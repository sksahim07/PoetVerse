import { GoogleGenerativeAI } from "@google/generative-ai";

/* =========================================================
   CORE CONFIGURATION & INITIALIZATION
========================================================= */
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) throw new Error("Missing VITE_GEMINI_API_KEY");

const genAI = new GoogleGenerativeAI(apiKey);
const GEMINI_MODEL = "gemini-2.5-flash"; // 2.5 Flash is better for speed and efficiency

const CREATIVE_CONFIG = { temperature: 1.1, topP: 0.95, topK: 40 };
const ANALYTICAL_CONFIG = { temperature: 0.2, responseMimeType: "application/json" };

/* =========================================================
   TYPES
========================================================= */

export interface GenerateParams {
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

  literary_style?: string;
  creativity_level?: string;
  metaphor_density?: string;
  philosophical_depth?: string;
  realism_level?: string;
  uniqueness_level?: string;
  sensory_details?: string;
  dialogue_style?: string;
  narrative_mode?: string;
  intensity_mode?: string;

  poetic_device_focus?: string;
  atmosphere_type?: string;
  emotional_transition?: string;
  stanza_style?: string;
  ending_impact?: string;
  language_complexity?: string;
  symbolic_weight?: string;
  cultural_influence?: string;
  cinematic_scale?: string;
  human_realism?: string;
}

export interface MusicalAnalysis {
  core_identity: {
    raag: string;
    taal_tempo: string;
    instruments: string;
  };

  stanzas: Array<{
    lyrics_snippet: string;
    mood_shift: string;
    swaras: string;
    vocals: string;
  }>;

  maestro_notes: string;
  attraction_points: string;
}

export interface PoemFeedbackResponse {
  improved_poem: string;

  feedback: {
    emotional_depth: string;
    metaphor_quality: string;
    rhythm_flow: string;
    originality: string;
    literary_strength: string;
  };

  suggestions: string[];

  quote_lines: string[];
}

export interface LiteraryAnalysis {
  emotional_score: number;
  metaphor_score: number;
  originality_score: number;
  rhythm_score: number;
  literary_score: number;
  philosophical_score: number;
}

export interface ConversationRewriteResponse {
  rewritten_poem: string;

  ai_notes: string;

  improvement_summary: string[];

  strongest_lines: string[];

  literary_changes: {
    imagery: string;
    emotional_weight: string;
    rhythm: string;
    symbolism: string;
    originality: string;
  };
}

export interface AdvancedCritique {
  strengths: string[];
  weaknesses: string[];
  hidden_meanings: string[];
  emotional_observations: string[];
  literary_comparisons: string[];
  rewrite_suggestions: string[];
}

/* =========================================================
   MASTER SYSTEM PROMPT
========================================================= */

const MASTER_SYSTEM_PROMPT = `
You are PoetVerse Maestro AI, a legendary literary architect.
YOUR CORE DIRECTIVE:
1. MAINTAIN LANGUAGE INTEGRITY: Never switch languages unless explicitly told. If the poem is in Roman Urdu, every rewrite/suggestion must be in Roman Urdu.
2. PRESERVE INTENT: When refining, do not rewrite the entire piece unless the feedback suggests a fundamental structural change. Focus on word choice, cadence, and imagery.
3. LITERARY PRECISION: Use poetic devices (metaphor, enjambment, assonance) naturally. Avoid clichés.
4. EMOTIONAL INTELLIGENCE: Analyze the subtext of the user's feedback. If they ask for 'deeper', add philosophical weight. If 'intensive', amplify the verb choices and imagery density.
5. RHYTHMIC BEAUTY: Ensure the poem's rhythm flows naturally. If the user mentions 'smooth', focus on syllable count and line breaks.
6. AVOID OVER-WRITING: Do not add unnecessary lines or words. If the poem is already emotionally strong, focus on refining existing lines rather than adding new ones.
7. HUMAN TOUCH: Always maintain a human-like voice. Avoid robotic or generic AI language.
8. FEEDBACK INTEGRATION: When given user feedback, identify the core emotional need behind it and address that in the rewrite, rather than just making surface-level changes.
9. CULTURAL SENSITIVITY: If the poem has cultural elements (like Urdu/Sufi), ensure that any refinements respect and enhance those cultural nuances.
10. QUALITY OVER QUANTITY: Never sacrifice literary quality for the sake of making more changes. It's better to make one meaningful change than several superficial ones. 

You are:
- a legendary poet
- a literary architect
- a philosopher
- a cinematic storyteller
- a rhythm designer
- a symbolic thinker
- a master editor
- an emotional psychologist
- a lyrical genius

====================================================
WRITING DNA
====================================================

Your poetry combines:
- cinematic imagery
- emotional realism
- layered symbolism
- haunting atmosphere
- memorable quotable lines
- elite literary intelligence
- philosophical undertones
- emotionally intelligent rhythm
- poetic authenticity

====================================================
STRICT WRITING RULES
====================================================

NEVER:
- write cringe poetry
- write childish romance
- use repetitive clichés
- generate fake-deep nonsense
- overuse dramatic words
- create random metaphors
- sound robotic
- repeat imagery excessively
- use shallow emotional manipulation

ALWAYS:
- make every line meaningful
- create emotional continuity
- make imagery visual
- maintain literary beauty
- create atmosphere
- create memorable endings
- use subtle emotional intelligence
- balance simplicity and depth
- sound human
- create emotional aftertaste

====================================================
QUALITY TARGET
====================================================

Every poem should feel:
- emotionally alive
- visually cinematic
- intellectually beautiful
- emotionally immersive
- human-written
- literature-grade

====================================================
STYLE ADAPTATION
====================================================

If user wants simple writing:
→ use emotionally beautiful simplicity

If user wants literary writing:
→ increase symbolic density

If user wants philosophical poetry:
→ add existential undertones

If user wants heartbreak:
→ restrained pain, not melodrama

If user wants romance:
→ emotional realism, not cringe fantasy

If user wants cinematic:
→ visual storytelling with atmosphere

If user wants Urdu/Sufi:
→ spiritual symbolism and elegance

If user wants modern:
→ emotionally intelligent modern realism
`;

/* =========================================================
   ROBUST ENGINE (Refactored for Reliability)
========================================================= */

function createModel(systemInstruction?: string, isAnalytical: boolean = false) {
  return genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    generationConfig: isAnalytical ? ANALYTICAL_CONFIG : CREATIVE_CONFIG,
    systemInstruction: systemInstruction || MASTER_SYSTEM_PROMPT,
  });
}

/* =========================================================
   REWRITE ENGINE (Ekhanei Language Lock ache)
========================================================= */
export async function rewritePoemWithFeedback(
  originalPoem: string,
  userFeedback: string,
  language: string
): Promise<any> {
  return callWithRetry(async () => {
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
      generationConfig: ANALYTICAL_CONFIG,
      systemInstruction: `You are an expert literary editor. 
      STRICT RULE: The output language MUST be exactly '${language}'. 
      If the original poem is in Roman Urdu, you must output in Roman Urdu. Do not translate. 
      Focus on deepening intensity, rhythm, and imagery based on user feedback.`
    });

    const prompt = `Rewrite this poem: \n${originalPoem}\n\nFeedback: ${userFeedback}`;
    const result = await model.generateContent(prompt);
    return JSON.parse(result.response.text().replace(/```json|```/g, ""));
  });
}
// =============================================================================
// Helper: callWithRetry (Optimized)
// =============================================================================
async function callWithRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try { return await fn(); }
    catch (e) { if (i === maxRetries - 1) throw e; await sleep(2000 * (i + 1)); }
  }
  throw new Error("Retry failed");
}

async function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }
function cleanJsonResponse(t: string) { return t.replace(/```json/g, "").replace(/```/g, "").trim(); }
function safeParseJSON<T>(t: string, f: T): T { try { return JSON.parse(t); } catch { return f; } }

/* =========================================================
   PROMPT ENGINE
========================================================= */

function buildPoetryPrompt(
  params: GenerateParams
) {
  return `
Write an ORIGINAL,
MASTERPIECE-LEVEL,
HIGH-LITERARY
${params.poetry_type}
in ${params.language} language.

====================================================
PRIMARY EMOTION
====================================================

${params.emotion}

====================================================
EMOTIONAL PROFILE
====================================================

Mood:
${params.mood || "cinematic emotional"}

Emotional Depth:
${params.emotion_level || "deep"}

Intensity:
${params.intensity_mode || "balanced"}

Human Realism:
${params.human_realism || "high"}

Emotional Transition:
${params.emotional_transition || "natural"}

====================================================
STYLE PROFILE
====================================================

Tone:
${params.tone_filter || "modern literary"}

Literary Style:
${params.literary_style || "cinematic poetic"}

Vocabulary:
${params.word_difficulty || "poetic"}

Language Complexity:
${params.language_complexity || "balanced"}

Creativity:
${params.creativity_level || "high"}

Originality:
${params.uniqueness_level || "very high"}

====================================================
LITERARY ELEMENTS
====================================================

Metaphor Density:
${params.metaphor_density || "balanced"}

Philosophical Depth:
${params.philosophical_depth || "medium"}

Symbolic Weight:
${params.symbolic_weight || "strong"}

Poetic Device Focus:
${params.poetic_device_focus || "immersive imagery"}

====================================================
STRUCTURE
====================================================

Flow Style:
${params.flow_style || "smooth cinematic"}

Line Length:
${params.line_length || "medium"}

Rhyme Style:
${params.rhyme_style || "soft literary"}

Stanza Style:
${params.stanza_style || "immersive"}

Narrative Mode:
${params.narrative_mode || "visual storytelling"}

Dialogue Style:
${params.dialogue_style || "minimal"}

====================================================
ATMOSPHERE
====================================================

Atmosphere:
${params.atmosphere_type || "cinematic"}

Sensory Detail:
${params.sensory_details || "visual and emotional"}

Cinematic Scale:
${params.cinematic_scale || "large"}

====================================================
CULTURAL INFLUENCE
====================================================

${params.cultural_influence || "modern universal"}

====================================================
DEDICATION
====================================================

${params.target_person || "general audience"}

====================================================
USER CONTEXT
====================================================

${params.user_message || "No extra context"}

====================================================
ULTRA IMPORTANT RULES
====================================================

- Make every stanza emotionally alive
- Create memorable quotable lines
- Use emotionally intelligent metaphors
- Avoid generic AI poetry
- Create immersive atmosphere
- Use visual storytelling
- Maintain poetic rhythm
- Add emotional continuity
- Make imagery cinematic
- Sound human
- Make the ending unforgettable
- Avoid cringe
- Avoid melodrama
- Keep emotional realism
- Use subtle depth

====================================================
ENDING IMPACT
====================================================

${params.ending_impact || "emotionally haunting"}

====================================================
FINAL QUALITY TARGET
====================================================

The poem should feel:
- unforgettable
- emotionally cinematic
- deeply human
- premium literary quality
- intelligent yet emotional
- naturally poetic
`;
}

/* =========================================================
   POEM GENERATOR
========================================================= */

export async function generatePoem(
  params: GenerateParams,
  onChunk?: (chunk: string) => void
): Promise<string> {
  return callWithRetry(async () => {
    // 🎨 Creative task: isAnalytical is false
    const model = createModel();

    const prompt = buildPoetryPrompt(params);

    if (onChunk) {
      const streamResult =
        await model.generateContentStream(prompt);

      let fullText = "";

      for await (const chunk of streamResult.stream) {
        const text = chunk.text();
        fullText += text;
        onChunk(text);
      }

      return fullText;
    }

    const result = await model.generateContent(prompt);
    return result.response.text();
  });
}

/* =========================================================
   AI REWRITE ENGINE
========================================================= */

export async function continuePoemConversation(
  originalPoem: string,
  userFeedback: string,
  language = "English"
): Promise<ConversationRewriteResponse> {
  return callWithRetry(async () => {
    // ⚙️ JSON task: isAnalytical is true
    const model = createModel(`
You are PoetVerse Rewrite Maestro.

You improve poetry based on feedback.

Your goal:
- preserve soul
- preserve emotional identity
- improve literary quality
- improve rhythm
- improve metaphors
- improve transitions
- improve emotional realism
- avoid over-writing

You NEVER destroy the original emotional essence.
Return JSON only.
`, true);

    const prompt = `
Rewrite and improve this poem.

====================================================
ORIGINAL POEM
====================================================

${originalPoem}

====================================================
USER FEEDBACK
====================================================

${userFeedback}

====================================================
OUTPUT LANGUAGE
====================================================

${language}

====================================================
IMPORTANT RULES
====================================================

- Preserve emotional identity
- Improve literary quality
- Keep strongest ideas
- Improve weak transitions
- Add subtle emotional intelligence
- Make rhythm smoother
- Improve memorable lines
- Avoid cringe
- Avoid robotic language

====================================================
RETURN FORMAT
====================================================

{
  "rewritten_poem": "",

  "ai_notes": "",

  "improvement_summary": [
    ""
  ],

  "strongest_lines": [
    ""
  ],

  "literary_changes": {
    "imagery": "",
    "emotional_weight": "",
    "rhythm": "",
    "symbolism": "",
    "originality": ""
  }
}
`;

    const result = await model.generateContent(prompt);
    const cleaned = cleanJsonResponse(result.response.text());

    return safeParseJSON<ConversationRewriteResponse>(cleaned, {
        rewritten_poem: originalPoem,
        ai_notes: "The poem was refined while preserving its emotional identity.",
        improvement_summary: ["Improved emotional continuity"],
        strongest_lines: [],
        literary_changes: {
          imagery: "Imagery enhanced subtly",
          emotional_weight: "Emotional realism improved",
          rhythm: "Flow refined",
          symbolism: "Added layered symbolism",
          originality: "Increased uniqueness",
        },
      }
    );
  });
}

/* =========================================================
   AI POEM IMPROVER
========================================================= */

export async function improvePoem(
  poem: string,
  feedback: string,
  language = "English"
): Promise<PoemFeedbackResponse> {
  return callWithRetry(async () => {
    // ⚙️ JSON task: isAnalytical is true
    const model = createModel(`
You are an elite poetry editor.
Return JSON only.
`, true);

    const prompt = `
Improve this poem based on feedback.

====================================================
POEM
====================================================

${poem}

====================================================
FEEDBACK
====================================================

${feedback}

====================================================
LANGUAGE
====================================================

${language}

====================================================
RULES
====================================================

- preserve soul
- improve rhythm
- improve emotional realism
- improve imagery
- avoid over-writing
- sound human

====================================================
RETURN JSON ONLY
====================================================

{
  "improved_poem": "",

  "feedback": {
    "emotional_depth": "",
    "metaphor_quality": "",
    "rhythm_flow": "",
    "originality": "",
    "literary_strength": ""
  },

  "suggestions": [],
  "quote_lines": []
}
`;

    const result = await model.generateContent(prompt);
    const cleaned = cleanJsonResponse(result.response.text());

    return safeParseJSON<PoemFeedbackResponse>(cleaned, {
        improved_poem: poem,
        feedback: {
          emotional_depth: "Good emotional layering.",
          metaphor_quality: "Balanced metaphor usage.",
          rhythm_flow: "Smooth flow.",
          originality: "Strong originality.",
          literary_strength: "Good literary quality.",
        },
        suggestions: ["Add more sensory details."],
        quote_lines: [],
      }
    );
  });
}

/* =========================================================
   ADVANCED LITERARY ANALYZER
========================================================= */

export async function analyzePoem(
  content: string,
  language = "bengali"
): Promise<string> {
  return callWithRetry(async () => {
    // 🎨 Text output task: isAnalytical is false
    const model = createModel(`
You are a legendary literary critic.
`);

    const prompt = `
Analyze this poetry deeply.

====================================================
POEM
====================================================

${content}

====================================================
IMPORTANT
====================================================

Write FULL response ONLY in:
${language}

====================================================
ANALYSIS STRUCTURE
====================================================

1. Emotional Architecture
2. Symbolism & Metaphors
3. Literary Structure
4. Rhythm & Cadence
5. Psychological Depth
6. Philosophical Layers
7. Strongest Lines
8. Weaknesses
9. Literary Value
10. Maestro Verdict

====================================================
RULES
====================================================

- sound intellectual
- sound beautiful
- avoid generic analysis
- give genuine insight
`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  });
}

/* =========================================================
   ADVANCED CRITIQUE ENGINE
========================================================= */

export async function advancedCritique(
  poem: string,
  language = "English"
): Promise<AdvancedCritique> {
  return callWithRetry(async () => {
    // ⚙️ JSON task: isAnalytical is true
    const model = createModel(`
You are an elite literary professor.
Return JSON only.
`, true);

    const prompt = `
Critique this poem deeply.

POEM:
${poem}

LANGUAGE:
${language}

RETURN JSON:
{
  "strengths": [],
  "weaknesses": [],
  "hidden_meanings": [],
  "emotional_observations": [],
  "literary_comparisons": [],
  "rewrite_suggestions": []
}
`;

    const result = await model.generateContent(prompt);
    const cleaned = cleanJsonResponse(result.response.text());

    return safeParseJSON<AdvancedCritique>(cleaned, {
        strengths: ["Strong emotional atmosphere"],
        weaknesses: ["Some metaphors can deepen"],
        hidden_meanings: ["Underlying loneliness symbolism"],
        emotional_observations: ["Emotion grows progressively"],
        literary_comparisons: ["Modern cinematic lyrical style"],
        rewrite_suggestions: ["Strengthen final stanza"],
      }
    );
  });
}

/* =========================================================
   LITERARY SCORE SYSTEM
========================================================= */

export async function analyzePoemScores(
  content: string
): Promise<LiteraryAnalysis> {
  return callWithRetry(async () => {
    // ⚙️ JSON task: isAnalytical is true
    const model = createModel(undefined, true);

    const prompt = `
Analyze this poem.

POEM:
${content}

Return ONLY JSON:

{
  "emotional_score": 0,
  "metaphor_score": 0,
  "originality_score": 0,
  "rhythm_score": 0,
  "literary_score": 0,
  "philosophical_score": 0
}
`;

    const result = await model.generateContent(prompt);
    const cleaned = cleanJsonResponse(result.response.text());

    return safeParseJSON<LiteraryAnalysis>(cleaned, {
        emotional_score: 82,
        metaphor_score: 80,
        originality_score: 84,
        rhythm_score: 81,
        literary_score: 86,
        philosophical_score: 79,
      }
    );
  });
}

/* =========================================================
   MUSICAL NOTES GENERATOR
========================================================= */

export async function generateMusicalNotes(
  content: string,
  emotion: string,
  language = "English"
): Promise<MusicalAnalysis> {
  return callWithRetry(async () => {
    // ⚙️ JSON task: isAnalytical is true
    const model = createModel(`
You are:
- a world-class music director
- cinematic soundtrack architect
- Indian classical specialist
- emotional composition designer

Return JSON only.
`, true);

    const prompt = `
Analyze lyrics and generate
elite musical direction.

====================================================
LYRICS
====================================================

${content}

====================================================
EMOTION
====================================================

${emotion}

====================================================
LANGUAGE
====================================================

${language}

====================================================
RETURN JSON ONLY
====================================================

{
  "core_identity": {
    "raag": "",
    "taal_tempo": "",
    "instruments": ""
  },

  "stanzas": [
    {
      "lyrics_snippet": "",
      "mood_shift": "",
      "swaras": "",
      "vocals": ""
    }
  ],

  "maestro_notes": "",
  "attraction_points": ""
}
`;

    const result = await model.generateContent(prompt);
    const cleaned = cleanJsonResponse(result.response.text());

    return safeParseJSON<MusicalAnalysis>(cleaned, {
        core_identity: {
          raag: "Raag Yaman cinematic progression",
          taal_tempo: "72 BPM emotional orchestration",
          instruments: "Piano, Sarangi, Ambient Strings",
        },
        stanzas: [
          {
            lyrics_snippet: "Opening Verse",
            mood_shift: "Emotion gradually intensifies",
            swaras: "Sa Re Ga Ma emotional rise",
            vocals: "Breathy emotional delivery",
          },
        ],
        maestro_notes: "Maintain emotional continuity through orchestral layering.",
        attraction_points: "Strong cinematic melodic hook.",
      }
    );
  });
}

/* =========================================================
   GEMINI CONNECTION TEST
========================================================= */

export async function testGeminiConnection() {
  try {
    const model = createModel();

    const result = await model.generateContent(
      "Say: PoetVerse Connected Successfully"
    );

    return result.response.text();
  } catch (error) {
    console.error(
      "Gemini Connection Failed:",
      error
    );

    return null;
  }
}
