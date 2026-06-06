// ============================================================
//  POETVERSE — EMOTIONAL TRANSLATION ENGINE & CARD STUDIO
//  CardStudioPage.tsx — Complete Single-File Implementation
// ============================================================
 
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  ChevronRight, ChevronLeft, Check, X, Sparkles, Download,
  Copy, Share2, Edit3, Save, RefreshCw
} from "lucide-react";
 
// ─────────────────────────────────────────
//  INJECTED GLOBAL CSS
// ─────────────────────────────────────────
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Dancing+Script:wght@400;600;700&family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Merriweather:ital,wght@0,300;0,400;1,300&family=Poppins:wght@300;400;500;600&family=Inter:wght@300;400;500;600&display=swap');
 
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
 
@keyframes pvFadeUp   { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
@keyframes pvFadeIn   { from{opacity:0} to{opacity:1} }
@keyframes pvScaleIn  { from{opacity:0;transform:scale(0.93)} to{opacity:1;transform:scale(1)} }
@keyframes pvFloat    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
@keyframes pvSpin     { to{transform:rotate(360deg)} }
@keyframes pvDot      { 0%,80%,100%{transform:scale(0);opacity:0} 40%{transform:scale(1);opacity:1} }
@keyframes pvGoldFlow {
  0%  {background-position:200% center}
  100%{background-position:-200% center}
}
@keyframes pvGlow {
  0%,100%{box-shadow:0 0 8px rgba(255,215,0,0.15)}
  50%    {box-shadow:0 0 28px rgba(255,215,0,0.45)}
}
@keyframes pvTextReveal {
  from{opacity:0;transform:translateY(6px)}
  to  {opacity:1;transform:translateY(0)}
}
 
.pv-fade-up  {animation:pvFadeUp  0.5s ease forwards}
.pv-fade-in  {animation:pvFadeIn  0.35s ease forwards}
.pv-scale-in {animation:pvScaleIn 0.45s cubic-bezier(.16,1,.3,1) forwards}
.pv-float    {animation:pvFloat   3.2s ease-in-out infinite}
 
.pv-shimmer-gold{
  background:linear-gradient(90deg,#a07020,#FFD700,#FFF8DC,#FFD700,#a07020);
  background-size:300% auto;
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
  background-clip:text;
  animation:pvGoldFlow 4s linear infinite;
}
 
.pv-btn-gold{
  background:linear-gradient(135deg,#c9a020,#FFD700,#c9a020);
  background-size:200% 100%;
  color:#1a0a00;
  border:none;
  font-family:'Inter',sans-serif;
  font-weight:600;
  cursor:pointer;
  transition:background-position .3s,transform .15s,box-shadow .2s;
}
.pv-btn-gold:hover:not(:disabled){
  background-position:right center;
  transform:translateY(-1px);
  box-shadow:0 8px 28px rgba(255,215,0,0.38);
}
.pv-btn-gold:active:not(:disabled){transform:translateY(0)}
.pv-btn-gold:disabled{opacity:.4;cursor:not-allowed}
 
.pv-ghost{
  background:rgba(255,255,255,.04);
  border:1px solid rgba(255,255,255,.1);
  color:rgba(255,255,255,.65);
  font-family:'Inter',sans-serif;
  cursor:pointer;
  transition:all .2s;
}
.pv-ghost:hover{background:rgba(255,255,255,.08);color:rgba(255,255,255,.95)}
 
.pv-range{-webkit-appearance:none;appearance:none;height:4px;border-radius:4px;outline:none;cursor:pointer}
.pv-range::-webkit-slider-thumb{
  -webkit-appearance:none;
  width:18px;height:18px;border-radius:50%;
  background:#FFD700;
  box-shadow:0 0 10px rgba(255,215,0,.55);
  cursor:pointer;transition:transform .15s;
}
.pv-range::-webkit-slider-thumb:hover{transform:scale(1.25)}
 
.pv-textarea{resize:vertical}
.pv-textarea:focus,.pv-input:focus{outline:none;border-color:rgba(255,215,0,.45)!important}
 
.pv-scroll::-webkit-scrollbar{width:3px}
.pv-scroll::-webkit-scrollbar-track{background:rgba(255,255,255,.03)}
.pv-scroll::-webkit-scrollbar-thumb{background:rgba(255,215,0,.22);border-radius:2px}
 
.pv-chip-hover{transition:all .15s;cursor:pointer}
.pv-chip-hover:hover{transform:translateY(-1px)}
 
.pv-card-hover{transition:all .22s;cursor:pointer}
.pv-card-hover:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(0,0,0,.35)}
 
/* Responsive studio grid */
.studio-grid{display:grid;grid-template-columns:1fr;gap:20px;align-items:start}
.ctrl-col{order:2}.prev-col{order:1}
@media(min-width:920px){
  .studio-grid{grid-template-columns:1fr 400px}
  .ctrl-col{order:1}.prev-col{order:2}
  .pv-sticky{position:sticky;top:80px}
}
 
/* Recipient grid */
.rec-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}
@media(min-width:480px){.rec-grid{grid-template-columns:repeat(3,1fr)}}
@media(min-width:700px){.rec-grid{grid-template-columns:repeat(4,1fr)}}
 
/* Theme quick-pick grid */
.theme-qk{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}
 
/* Content text-reveal animation for generated card */
.pv-content-line{
  animation:pvTextReveal .6s ease forwards;
  opacity:0;
}
`;
 
// ─────────────────────────────────────────
//  DATA CONSTANTS
// ─────────────────────────────────────────
const RECIPIENTS = [
  { id:"partner",   emoji:"💑", title:"Partner / Lover",  desc:"The one who holds your heart"   },
  { id:"mother",    emoji:"🌸", title:"Mother",           desc:"Who gave you the world"         },
  { id:"father",    emoji:"⚓", title:"Father",           desc:"Who showed you strength"        },
  { id:"bestfriend",emoji:"🤝", title:"Best Friend",      desc:"Your forever human"             },
  { id:"brother",   emoji:"🦅", title:"Brother",          desc:"Childhood companion"            },
  { id:"sister",    emoji:"🌷", title:"Sister",           desc:"Lifelong confidante"            },
  { id:"husband",   emoji:"💍", title:"Husband",          desc:"Your life partner"              },
  { id:"wife",      emoji:"💒", title:"Wife",             desc:"The one you chose forever"      },
  { id:"crush",     emoji:"🌹", title:"Crush",            desc:"That special someone"           },
  { id:"teacher",   emoji:"📚", title:"Teacher",          desc:"Who shaped your mind"           },
  { id:"mentor",    emoji:"⭐", title:"Mentor",           desc:"Your guiding light"             },
  { id:"child",     emoji:"🧒", title:"Child",            desc:"Your greatest joy"              },
  { id:"myself",    emoji:"🪞", title:"For Myself",       desc:"A letter to the soul"           },
  { id:"custom",    emoji:"✏️", title:"Custom Person",    desc:"Someone special to you"         },
];
 
const LANGUAGES = [
  { id:"auto",       flag:"🔮", label:"Auto Detect"   },
  { id:"benglish",   flag:"🇧🇩", label:"Benglish"      },
  { id:"roman-urdu", flag:"🇵🇰", label:"Roman Urdu"    },
  { id:"english",    flag:"🇬🇧", label:"English"       },
  { id:"bengali",    flag:"বাং", label:"Bengali Script" },
  { id:"hindi",      flag:"हिं", label:"Hindi Script"   },
  { id:"hinglish",   flag:"🇮🇳", label:"Hinglish"       },
];
 
const FORMATS = [
  { id:"heartfelt-letter", icon:"💌", title:"Heartfelt Letter",  desc:"Long, deeply personal prose"    },
  { id:"aesthetic-note",   icon:"📝", title:"Aesthetic Note",    desc:"Short, elegant, Instagram-style" },
  { id:"shayari",          icon:"🎭", title:"Shayari / Poetry",  desc:"Rhymed and literary"             },
  { id:"open-letter",      icon:"📖", title:"Open Letter",       desc:"Public emotional letter"         },
  { id:"confession",       icon:"💝", title:"Confession Letter", desc:"Vulnerable love confession"      },
  { id:"apology",          icon:"🙏", title:"Apology Letter",    desc:"Sincere sorry message"           },
  { id:"farewell",         icon:"🕊️", title:"Farewell Letter",   desc:"A meaningful goodbye"            },
];
 
const THEMES = [
  {
    id:"royal-luxury", name:"Royal Luxury", emoji:"👑",
    cardBg:"linear-gradient(160deg,#0e0c07 0%,#1c1708 55%,#0e0c07 100%)",
    border:"1.5px solid rgba(218,165,32,.55)",
    shadow:"0 32px 80px rgba(0,0,0,.9),0 0 50px rgba(218,165,32,.07)",
    titleColor:"#FFD700", contentColor:"#e8d5a3", signatureColor:"#DAA520",
    accent:"#FFD700", titleFont:"Cinzel", contentFont:"Cormorant Garamond",
    glow:"rgba(218,165,32,.25)", backdrop:null,
  },
  {
    id:"cute-pookie", name:"Cute & Pookie", emoji:"🌸",
    cardBg:"linear-gradient(160deg,#fff5fa 0%,#ffe8f3 55%,#fff0f8 100%)",
    border:"1.5px solid rgba(236,72,153,.35)",
    shadow:"0 24px 60px rgba(236,72,153,.18)",
    titleColor:"#be185d", contentColor:"#831843", signatureColor:"#db2777",
    accent:"#f472b6", titleFont:"Dancing Script", contentFont:"Poppins",
    glow:"rgba(236,72,153,.22)", backdrop:null,
  },
  {
    id:"vintage", name:"Vintage", emoji:"📜",
    cardBg:"linear-gradient(160deg,#f5e9d0 0%,#eedcc0 55%,#f0e2c4 100%)",
    border:"2px solid rgba(120,80,30,.5)",
    shadow:"0 24px 60px rgba(40,15,0,.55)",
    titleColor:"#3d1f00", contentColor:"#5c3010", signatureColor:"#7a4520",
    accent:"#8B5A2B", titleFont:"Playfair Display", contentFont:"Merriweather",
    glow:"rgba(139,90,43,.28)", backdrop:null,
  },
  {
    id:"minimal", name:"Minimal", emoji:"◻",
    cardBg:"linear-gradient(160deg,#ffffff,#f8fafc)",
    border:"1px solid rgba(0,0,0,.07)",
    shadow:"0 24px 60px rgba(0,0,0,.1)",
    titleColor:"#0f172a", contentColor:"#374151", signatureColor:"#64748b",
    accent:"#0f172a", titleFont:"Inter", contentFont:"Inter",
    glow:"rgba(0,0,0,.08)", backdrop:null,
  },
  {
    id:"glass", name:"Glassmorphism", emoji:"🔮",
    cardBg:"rgba(255,255,255,.07)",
    border:"1px solid rgba(255,255,255,.18)",
    shadow:"0 24px 60px rgba(0,0,0,.45)",
    titleColor:"#fff", contentColor:"rgba(255,255,255,.88)", signatureColor:"rgba(255,255,255,.65)",
    accent:"#c084fc", titleFont:"Poppins", contentFont:"Inter",
    glow:"rgba(192,132,252,.32)", backdrop:"blur(24px) saturate(180%)",
  },
  {
    id:"floral", name:"Floral", emoji:"🌺",
    cardBg:"linear-gradient(160deg,#f0fff4 0%,#e6ffed 55%,#f0fff4 100%)",
    border:"1.5px solid rgba(34,197,94,.3)",
    shadow:"0 24px 60px rgba(34,197,94,.15)",
    titleColor:"#14532d", contentColor:"#166534", signatureColor:"#15803d",
    accent:"#22c55e", titleFont:"Cormorant Garamond", contentFont:"Merriweather",
    glow:"rgba(34,197,94,.22)", backdrop:null,
  },
  {
    id:"dark-romantic", name:"Dark Romantic", emoji:"🌹",
    cardBg:"linear-gradient(160deg,#1c0208 0%,#280309 55%,#1c0208 100%)",
    border:"1.5px solid rgba(244,63,94,.3)",
    shadow:"0 24px 60px rgba(220,38,38,.28)",
    titleColor:"#fb7185", contentColor:"#fda4af", signatureColor:"#f43f5e",
    accent:"#f43f5e", titleFont:"Cinzel", contentFont:"Cormorant Garamond",
    glow:"rgba(244,63,94,.22)", backdrop:null,
  },
  {
    id:"moonlight", name:"Moonlight", emoji:"🌙",
    cardBg:"linear-gradient(160deg,#080d1a 0%,#0d1528 55%,#080d1a 100%)",
    border:"1px solid rgba(148,163,184,.18)",
    shadow:"0 24px 60px rgba(0,0,0,.85)",
    titleColor:"#bfdbfe", contentColor:"#cbd5e1", signatureColor:"#93c5fd",
    accent:"#60a5fa", titleFont:"Cinzel", contentFont:"Cormorant Garamond",
    glow:"rgba(96,165,250,.2)", backdrop:null,
  },
];
 
const FONTS = [
  { id:"Cormorant Garamond", name:"Cormorant Garamond" },
  { id:"Cinzel",             name:"Cinzel"             },
  { id:"Playfair Display",   name:"Playfair Display"   },
  { id:"Dancing Script",     name:"Dancing Script"     },
  { id:"Great Vibes",        name:"Great Vibes"        },
  { id:"Merriweather",       name:"Merriweather"       },
  { id:"Poppins",            name:"Poppins"            },
  { id:"Inter",              name:"Inter"              },
];
 
const ACCENTS = [
  { hex:"#FFD700", name:"Gold"     },
  { hex:"#E879A0", name:"Rose Gold"},
  { hex:"#C0C0C0", name:"Silver"   },
  { hex:"#34d399", name:"Emerald"  },
  { hex:"#e11d48", name:"Ruby"     },
  { hex:"#3b82f6", name:"Sapphire" },
  { hex:"#a855f7", name:"Amethyst" },
  { hex:"#f472b6", name:"Blush"    },
  { hex:"#c2773f", name:"Copper"   },
  { hex:"#f5f0e8", name:"Pearl"    },
];
 
const ORIENTATIONS = [
  { id:"portrait",  label:"Portrait",  ratio:"4/5"  },
  { id:"landscape", label:"Landscape", ratio:"4/3"  },
  { id:"square",    label:"Square",    ratio:"1/1"  },
  { id:"story",     label:"Story",     ratio:"9/16" },
];
 
const STICKERS = [
  { id:"heart",     e:"❤️" },{ id:"rose",    e:"🌹" },
  { id:"moon",      e:"🌙" },{ id:"star",    e:"⭐" },
  { id:"butterfly", e:"🦋" },{ id:"feather", e:"🪶" },
  { id:"letter",    e:"✉️" },{ id:"flower",  e:"🌸" },
  { id:"sparkle",   e:"✨" },
];
 
const CORNERS = [
  { id:"luxury",  label:"Luxury",  sz:28 },
  { id:"vintage", label:"Vintage", sz:20 },
  { id:"minimal", label:"Minimal", sz:14 },
  { id:"none",    label:"None",    sz:0  },
];
 
const REWRITE_ACTIONS = [
  { id:"romantic",      label:"More Romantic",  icon:"💕", clr:"#f43f5e" },
  { id:"emotional",     label:"More Emotional", icon:"😢", clr:"#8b5cf6" },
  { id:"formal",        label:"More Formal",    icon:"📋", clr:"#3b82f6" },
  { id:"poetic",        label:"More Poetic",    icon:"🎭", clr:"#a78bfa" },
  { id:"simpler",       label:"Make Simpler",   icon:"✂️", clr:"#6b7280" },
  { id:"shorter",       label:"Make Shorter",   icon:"📏", clr:"#f59e0b" },
  { id:"longer",        label:"Make Longer",    icon:"📖", clr:"#10b981" },
  { id:"deeper",        label:"Make Deeper",    icon:"🌊", clr:"#0ea5e9" },
  { id:"heartbreaking", label:"Heartbreaking",  icon:"💔", clr:"#ef4444" },
  { id:"inspirational", label:"Inspirational",  icon:"🌟", clr:"#f97316" },
];
 
const LOADING_MSGS = [
  "Decoding your emotions...",
  "Writing your letter...",
  "Designing the masterpiece...",
  "Preparing your final card...",
];
 
const OCCASIONS = [
  { id:"birthday",    e:"🎂", label:"Birthday"    },
  { id:"anniversary", e:"💑", label:"Anniversary" },
  { id:"valentine",   e:"💝", label:"Valentine's" },
  { id:"mothers-day", e:"🌷", label:"Mother's Day"},
  { id:"fathers-day", e:"👔", label:"Father's Day"},
  { id:"friendship",  e:"🤝", label:"Friendship"  },
  { id:"eid",         e:"🌙", label:"Eid"         },
  { id:"durga-puja",  e:"🪔", label:"Durga Puja"  },
  { id:"christmas",   e:"🎄", label:"Christmas"   },
  { id:"new-year",    e:"🎆", label:"New Year"    },
  { id:"graduation",  e:"🎓", label:"Graduation"  },
  { id:"farewell",    e:"🕊️", label:"Farewell"    },
];
 
const INT_LABELS = ["","Soft","Gentle","Tender","Warm","Heartfelt","Deep","Intense","Overwhelming","Profound","Heartbreaking"];
 
// ─────────────────────────────────────────
//  AI PROMPT BUILDERS
// ─────────────────────────────────────────
function buildGenPrompt({ recipient, emotion, intensity, language, format, occasion }: {
  recipient?: { title?: string; emoji?: string } | null;
  emotion: string;
  intensity: number;
  language: string;
  format: string;
  occasion?: { label?: string; e?: string } | null;
}) {
  const langMap = {
    auto:         "Auto-detect from input; write in that same language/script.",
    benglish:     "Benglish — Bengali vocabulary and expressions in Latin/English script, mixed naturally with English.",
    "roman-urdu": "Roman Urdu — Urdu language written in Latin script.",
    english:      "Pure English.",
    bengali:      "Bengali script (বাংলা হরফে).",
    hindi:        "Hindi script (हिंदी में).",
    hinglish:     "Hinglish — casual, natural mix of Hindi and English.",
  };
  const fmtMap = {
    "heartfelt-letter": "a long, deeply personal emotional prose letter. No forced rhyming. Raw, human, utterly real.",
    "aesthetic-note":   "a short elegant note — poetic, minimal, Instagram-worthy. Leave the reader breathless.",
    shayari:            "Shayari / poetry — rhymed, literary, using the classical Urdu/Hindi tradition. Deeply emotional.",
    "open-letter":      "an open letter — emotional, written as if for the world to witness.",
    confession:         "a love confession letter — vulnerable, courageous, deeply sincere.",
    apology:            "a sincere apology letter — deep remorse, genuine love, and fragile hope.",
    farewell:           "a farewell letter — bittersweet, profoundly meaningful, something they'll keep forever.",
  };
 
  return `You are PoetVerse — an Emotional Translation Engine that transforms raw human feelings into breathtaking written masterpieces.
 
RECIPIENT: ${recipient?.title || "Someone Special"} ${recipient?.emoji || ""}
RAW EMOTION: "${emotion}"
INTENSITY: ${intensity}/10 — ${INT_LABELS[intensity]}
LANGUAGE: ${langMap[language as keyof typeof langMap] || langMap.auto}
FORMAT: Write ${fmtMap[format as keyof typeof fmtMap] || fmtMap["heartfelt-letter"]}
${occasion ? `OCCASION: This is for ${occasion.label} ${occasion.e}` : ""}
 
YOUR MISSION:
— Transform this raw emotion into something beautiful, deeply personal, utterly human.
— Avoid all generic phrases. Capture the specific relationship, specific emotion, specific soul.
— Write as if a real person — deeply moved — crafted this from their own heart.
— The content should make the reader feel seen, loved, or moved to tears.
 
Respond ONLY with this JSON (no preamble, no markdown, no explanation):
{
  "title": "Beautiful evocative title (4–7 words, deeply personal)",
  "content": "Full letter/poem/note (appropriate length for format)",
  "signature": "Closing signature (3–5 words, matches language and relationship)"
}`;
}
 
type RewriteAction =
  | "romantic"
  | "emotional"
  | "formal"
  | "poetic"
  | "simpler"
  | "shorter"
  | "longer"
  | "deeper"
  | "heartbreaking"
  | "inspirational";

function buildRewritePrompt(
  content: string,
  action: RewriteAction
) {
  const inst = {
    romantic:      "much more romantic — amplify longing, tenderness, and desire",
    emotional:     "more emotionally charged — rawer feelings, more vulnerability",
    formal:        "more formal and composed — gravitas and dignity, yet still warm",
    poetic:        "more poetic — vivid metaphors, imagery, and lyrical rhythm",
    simpler:       "simpler — short sentences, everyday words, same emotional core",
    shorter:       "shorter and more powerful — keep only the most essential lines",
    longer:        "longer — add sensory details, memories, and rich feelings",
    deeper:        "deeper — philosophical reflection, introspection, and lasting meaning",
    heartbreaking: "heartbreaking — amplify the ache, loss, and weight of love",
    inspirational: "inspirational — add hope, resilience, and uplifting light",
  };
  return `Rewrite the following to be ${inst[action] || "more beautiful"}.
Keep the same language, recipient, and emotional core. Only transform the expression.
 
ORIGINAL:
${content}
 
Respond ONLY with JSON (no explanation): {"content": "rewritten content here"}`;
}
 
// ─────────────────────────────────────────
//  SHARED STYLE TOKENS
// ─────────────────────────────────────────
const S = {
  sectionLabel: {
    fontFamily:"Inter,sans-serif", fontSize:10,
    color:"rgba(255,255,255,.32)", letterSpacing:"0.13em",
    marginBottom:10,
  },
  panel: {
    background:"rgba(255,255,255,.03)",
    border:"1px solid rgba(255,255,255,.07)",
    borderRadius:14, padding:"18px 20px",
  },
};
 
// ─────────────────────────────────────────
//  MAIN COMPONENT
// ─────────────────────────────────────────
export default function CardStudioPage() {
 
  // Wizard state
  const [step,        setStep]        = useState(1);
  const [recipient,   setRecipient]   = useState<typeof RECIPIENTS[number] | null>(null);
  const [customName,  setCustomName]  = useState("");
  const [emotion,     setEmotion]     = useState("");
  const [intensity,   setIntensity]   = useState(5);
  const [language,    setLanguage]    = useState("auto");
  const [format,      setFormat]      = useState("heartfelt-letter");
  type Occasion = typeof OCCASIONS[number];

  const [occasion, setOccasion] = useState<Occasion | null>(null);
 
  // Card design
  const [theme,        setTheme]        = useState("royal-luxury");
  const [fontOvr, setFontOvr] = useState<string | null>(null);
  const [accentOvr, setAccentOvr] = useState<string | null>(null);
  const [orientation,  setOrientation]  = useState<Orientation>("portrait");
  const [stickerList, setStickerList] = useState<string[]>([]);
  const [cornerStyle,  setCornerStyle]  = useState("luxury");
 
  // Generated content
  const [cardTitle,   setCardTitle]   = useState("");
  const [cardContent, setCardContent] = useState("");
  const [cardSig,     setCardSig]     = useState("");
 
  // Edit mode
  const [editMode, setEditMode] = useState(false);
  const [eTitle,   setETitle]   = useState("");
  const [eContent, setEContent] = useState("");
  const [eSig,     setESig]     = useState("");
 
  // UI
  const [isGen,         setIsGen]         = useState(false);
  const [loadIdx,       setLoadIdx]       = useState(0);
  const [rewriteAction, setRewriteAction] = useState<RewriteAction | null>(null);
  const [activeTab, setActiveTab] = useState<"customize" | "rewrite" | "export">("customize");
  interface ToastData {
    msg: string;
    type: "ok" | "err";
  }

  const [toast, setToast] = useState<ToastData | null>(null);
  interface SavedCard {
    id: string;
    ts: number;
    recTitle: string;
    recEmoji: string;
    title: string;
    content: string;
    signature: string;
    theme: string;
    orientation: string;
  }

  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [showSaved,     setShowSaved]     = useState(false);
  const [isExporting,   setIsExporting]   = useState(false);
  const [exportQ,       setExportQ]       = useState(3);
  const [detectedLang, setDetectedLang] = useState<string | null>(null);
 
  const cardRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | undefined>(undefined);
 
  // ── Derived ──
  const T       = useMemo(() => THEMES.find(t => t.id === theme) || THEMES[0], [theme]);
  const hasCard = !!cardContent;
  const dTitle  = editMode ? eTitle   : cardTitle;
  const dContent= editMode ? eContent : cardContent;
  const dSig    = editMode ? eSig     : cardSig;
  const bodyFont= fontOvr  || T.contentFont;
  const ttFont  = T.titleFont;
  const accent  = accentOvr || T.accent;
  const cSz     = CORNERS.find(c => c.id === cornerStyle)?.sz || 0;
  type Orientation =
    | "portrait"
    | "landscape"
    | "square"
    | "story";

  const arStr = {
    portrait:"4/5",
    landscape:"4/3",
    square:"1/1",
    story:"9/16"
  }[orientation];
 
  // ── Effects ──
  useEffect(() => {
    const el = document.createElement("style");
    el.id = "pv-css";
    if (!document.getElementById("pv-css")) document.head.appendChild(el);
    el.textContent = GLOBAL_CSS;
    return () => { try { document.head.removeChild(el); } catch {} };
  }, []);
 
  useEffect(() => { loadCards(); }, []);
 
  useEffect(() => {
    if (isGen) {
      setLoadIdx(0);
      timerRef.current = window.setInterval(() => setLoadIdx(i => (i + 1) % LOADING_MSGS.length), 2100) as unknown as number;
    } else {
      if (timerRef.current !== undefined) {
        window.clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current !== undefined) window.clearInterval(timerRef.current);
    };
  }, [isGen]);
 
  // Language auto-detect
  useEffect(() => {
    if (!emotion) { setDetectedLang(null); return; }
    const lo = emotion.toLowerCase();
    const bWords = ["ami","tumi","tomake","bhalobashi","maa","baba","akash","hridoy","mon","priya"];
    const uWords = ["tum","mujhe","mere","aap","pyar","mohabbat","dil","ishq","zindagi","teri"];
    const hWords = ["main","tumhara","tumhari","mujhse","pyaar","yaar","dost","teri","meri","hai"];
    if      (/[\u0980-\u09FF]/.test(emotion)) setDetectedLang("Bengali Script");
    else if (/[\u0900-\u097F]/.test(emotion)) setDetectedLang("Hindi Script");
    else if (bWords.some(w => lo.includes(w))) setDetectedLang("Benglish");
    else if (uWords.some(w => lo.includes(w))) setDetectedLang("Roman Urdu");
    else if (hWords.some(w => lo.includes(w))) setDetectedLang("Hinglish");
    else setDetectedLang(null);
  }, [emotion]);
 
  // ── Helpers ──
  const showToast = useCallback(
    (msg: string, type: "ok" | "err" = "ok") => {
      setToast({ msg, type });
      setTimeout(() => setToast(null), 3200);
    }, []);
 
  const loadCards = async () => {
    try {
      const res = await (window as any).storage.list("pvc:");
      if (!res?.keys?.length) return;
      const arr = [];
      for (const k of res.keys) {
        try {
          const r = await (window as any).storage.get(k);
          if (r?.value) arr.push(JSON.parse(r.value));
        } catch {}
      }
      setSavedCards(arr.sort((a, b) => b.ts - a.ts));
    } catch {}
  };
 
  type ClaudeMessage = {
    role: string;
    content: string;
  };

  const callAPI = async (
    messages: ClaudeMessage[]
  ) => {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, messages }),
    });
    const data = await res.json();
    return data.content?.map(
      (b: { text?: string }) => b.text || ""
    ).join("") || "";
  };
 
  const parseJSON = (txt: string) => {
    try {
      const m = txt.match(/\{[\s\S]*\}/);
      return JSON.parse(m?.[0] || "{}");
    } catch { return {}; }
  };
 
  // ── Generate ──
  const generate = useCallback(async () => {
    if (!emotion.trim()) { showToast("Please write your emotion first!", "err"); return; }
    setIsGen(true);
    try {
      const prompt = buildGenPrompt({ recipient, emotion, intensity, language, format, occasion });
      const txt = await callAPI([{ role:"user", content:prompt }]);
      const p = parseJSON(txt);
      const t = p.title    || "A Letter From The Heart";
      const c = p.content  || txt;
      const s = p.signature|| "With Love";
      setCardTitle(t); setCardContent(c); setCardSig(s);
      setETitle(t); setEContent(c); setESig(s);
      setStep(5);
    } catch { showToast("Generation failed. Please try again.", "err"); }
    finally   { setIsGen(false); }
  }, [emotion, recipient, intensity, language, format, occasion, showToast]);
 
  // ── Rewrite ──
  const rewrite = useCallback(
    async (action: RewriteAction) => {
      const src = editMode ? eContent : cardContent;
      if (!src) return;
      setRewriteAction(action);
      try {
        const txt = await callAPI([{ role:"user", content:buildRewritePrompt(src, action) }]);
        const p = parseJSON(txt);
        const nc = p.content || txt;
        setCardContent(nc); setEContent(nc);
        showToast("Rewritten! ✨");
      } catch { showToast("Rewrite failed.", "err"); }
      finally  { setRewriteAction(null); }
    }, [cardContent, eContent, editMode, showToast]);
 
  // ── Save ──
  const saveCard = useCallback(async () => {
    const card = {
      id:`${Date.now()}`, ts:Date.now(),
      recTitle:recipient?.title || "Unknown",
      recEmoji:recipient?.emoji || "💌",
      title:dTitle, content:dContent, signature:dSig,
      theme, orientation,
    };
    try {
      await (window as any).storage.set(`pvc:${card.id}`, JSON.stringify(card));
      await loadCards();
      showToast("Card saved! 💾");
    } catch { showToast("Save failed.", "err"); }
  }, [dTitle, dContent, dSig, theme, orientation, recipient, showToast]);
 
  // ── Export ──
  const exportCard = useCallback(async (fmt = "png") => {
    if (!cardRef.current) return;
    setIsExporting(true);
    try {
      if (!(window as any).html2canvas) {
        await new Promise((res, rej) => {
          const s = document.createElement("script");
          s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js";
          s.onload = res; s.onerror = rej;
          document.head.appendChild(s);
        });
      }
      const canvas = await (window as any).html2canvas(cardRef.current, {
        scale:exportQ, useCORS:true, allowTaint:true, backgroundColor:null, logging:false,
      });
      const mime = { jpeg:"image/jpeg", webp:"image/webp" }[fmt] || "image/png";
      const url  = canvas.toDataURL(mime, 1.0);
      const a    = document.createElement("a");
      a.href = url; a.download = `poetverse-${Date.now()}.${fmt}`; a.click();
      showToast(`Exported as ${fmt.toUpperCase()}! 🎉`);
    } catch { showToast("Export failed. Try again.", "err"); }
    finally  { setIsExporting(false); }
  }, [exportQ, showToast]);
 
  const copyText = useCallback(() => {
    navigator.clipboard.writeText(`${dTitle}\n\n${dContent}\n\n${dSig}`)
      .then(() => showToast("Copied to clipboard! 📋"))
      .catch(() => showToast("Copy failed.", "err"));
  }, [dTitle, dContent, dSig, showToast]);
 
  const saveEdits = () => {
    setCardTitle(eTitle); setCardContent(eContent); setCardSig(eSig);
    setEditMode(false); showToast("Edits saved! ✅");
  };
 
  const toggleSticker = (id: string) =>
    setStickerList(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
 
  // ─────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────
  return (
    <div style={{ minHeight:"100vh", background:"#04030b", color:"#f0eff8", fontFamily:"Inter,sans-serif" }}>
 
      {/* ── TOAST ── */}
      {toast && (
        <div className="pv-fade-up" style={{
          position:"fixed", top:18, right:18, zIndex:9999,
          background: toast.type === "err"
            ? "linear-gradient(135deg,#7f1d1d,#dc2626)"
            : "linear-gradient(135deg,#78501a,#FFD700)",
          color: toast.type === "err" ? "#fff" : "#1a0800",
          padding:"11px 18px", borderRadius:10, fontSize:13, fontWeight:600,
          boxShadow:"0 8px 30px rgba(0,0,0,.55)", maxWidth:300, lineHeight:1.4,
        }}>
          {toast.msg}
        </div>
      )}
 
      {/* ── GENERATION OVERLAY ── */}
      {isGen && (
        <div className="pv-fade-in" style={{
          position:"fixed", inset:0, zIndex:9998,
          background:"rgba(4,3,11,.97)",
          display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center", gap:22,
        }}>
          <div className="pv-float" style={{ fontSize:68, filter:"drop-shadow(0 0 26px rgba(255,215,0,.45))" }}>✨</div>
          <div className="pv-shimmer-gold" style={{
            fontFamily:"Cinzel,serif", fontSize:"clamp(18px,4vw,28px)",
            fontWeight:700, textAlign:"center", padding:"0 24px",
          }}>
            {LOADING_MSGS[loadIdx]}
          </div>
          <div style={{ display:"flex", gap:8 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width:8, height:8, borderRadius:"50%", background:"#FFD700",
                animation:`pvDot 1.4s ${i * 0.22}s ease-in-out infinite`,
              }} />
            ))}
          </div>
          <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:16, fontStyle:"italic", color:"rgba(255,215,0,.35)", marginTop:6 }}>
            Crafting your emotional masterpiece…
          </p>
        </div>
      )}
 
      {/* ── HEADER ── */}
      <header style={{
        position:"sticky", top:0, zIndex:100,
        background:"rgba(4,3,11,.92)", backdropFilter:"blur(14px)",
        borderBottom:"1px solid rgba(255,255,255,.06)",
        padding:"12px 20px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontSize:22, filter:"drop-shadow(0 0 10px rgba(255,215,0,.5))" }}>📜</span>
          <div>
            <div className="pv-shimmer-gold" style={{ fontFamily:"Cinzel,serif", fontSize:17, fontWeight:700, letterSpacing:"0.07em" }}>
              PoetVerse
            </div>
            <div style={{ fontFamily:"Inter", fontSize:9, color:"rgba(255,215,0,.32)", letterSpacing:"0.18em", marginTop:1 }}>
              EMOTIONAL TRANSLATION ENGINE
            </div>
          </div>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          {hasCard && (
            <button onClick={() => { setCardContent(""); setCardTitle(""); setStep(1); setEditMode(false); }} className="pv-ghost" style={{ padding:"7px 14px", borderRadius:8, fontSize:12 }}>
              + New Card
            </button>
          )}
          {savedCards.length > 0 && (
            <button onClick={() => setShowSaved(true)} style={{
              background:"rgba(255,215,0,.07)", border:"1px solid rgba(255,215,0,.22)",
              color:"#FFD700", padding:"7px 14px", borderRadius:8, fontFamily:"Inter", fontSize:12, cursor:"pointer",
            }}>
              My Cards ({savedCards.length})
            </button>
          )}
        </div>
      </header>
 
      {/* ── MAIN ── */}
      <main style={{ maxWidth:1200, margin:"0 auto", padding:"24px 16px" }}>
 
        {/* ════════════════════════════════
            WIZARD (Steps 1–4)
        ════════════════════════════════ */}
        {!hasCard && (
          <div className="pv-fade-in">
 
            {/* Step Indicator */}
            <div style={{ maxWidth:600, margin:"0 auto 32px", display:"flex", alignItems:"center" }}>
              {["Recipient","Emotion","Style","Generate"].flatMap((label, i, arr) => {
                const active = step === i + 1;
                const done   = step >  i + 1;
                const items  = [
                  <div key={`s${i}`} style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:5, flexShrink:0 }}>
                    <div style={{
                      width:32, height:32, borderRadius:"50%",
                      background: done ? "#FFD700" : active ? "rgba(255,215,0,.12)" : "rgba(255,255,255,.04)",
                      border: step >= i+1 ? "1.5px solid rgba(255,215,0,.65)" : "1.5px solid rgba(255,255,255,.1)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontFamily:"Inter", fontSize:12, fontWeight:600,
                      color: done ? "#000" : active ? "#FFD700" : "rgba(255,255,255,.25)",
                      transition:"all .3s",
                    }}>
                      {done ? "✓" : i + 1}
                    </div>
                    <span style={{ fontFamily:"Inter", fontSize:10, color: active ? "#FFD700" : "rgba(255,255,255,.25)", whiteSpace:"nowrap" }}>
                      {label}
                    </span>
                  </div>
                ];
                if (i < arr.length - 1) items.push(
                  <div key={`l${i}`} style={{
                    flex:1, height:1, margin:"0 6px",
                    background: step > i+1 ? "rgba(255,215,0,.4)" : "rgba(255,255,255,.08)",
                    transition:"background .3s", marginBottom:20,
                  }} />
                );
                return items;
              })}
            </div>
 
            {/* Step Container */}
            <div style={{ maxWidth:760, margin:"0 auto" }}>
 
              {/* ─── STEP 1: RECIPIENT ─── */}
              {step === 1 && (
                <div className="pv-fade-up">
                  <div style={{ textAlign:"center", marginBottom:28 }}>
                    <h1 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"clamp(26px,5vw,38px)", fontWeight:600, color:"#FFD700", marginBottom:8 }}>
                      Who is this for?
                    </h1>
                    <p style={{ fontSize:14, color:"rgba(255,255,255,.42)" }}>
                      Choose the recipient of your heartfelt message
                    </p>
                  </div>
 
                  <div className="rec-grid">
                    {RECIPIENTS.map(r => (
                      <button key={r.id} className="pv-card-hover" onClick={() => setRecipient(r)} style={{
                        position:"relative",
                        background: recipient?.id === r.id ? "rgba(255,215,0,.1)" : "rgba(255,255,255,.03)",
                        border:`1.5px solid ${recipient?.id === r.id ? "rgba(255,215,0,.52)" : "rgba(255,255,255,.07)"}`,
                        borderRadius:12, padding:"14px 10px", textAlign:"center", cursor:"pointer",
                        transition:"all .2s",
                      }}>
                        <div style={{ fontSize:"clamp(22px,5vw,30px)", marginBottom:6 }}>{r.emoji}</div>
                        <div style={{ fontFamily:"Inter", fontSize:"clamp(10px,2vw,12px)", fontWeight:600, color: recipient?.id === r.id ? "#FFD700" : "#ddd8f0", marginBottom:3 }}>
                          {r.title}
                        </div>
                        <div style={{ fontFamily:"Inter", fontSize:"clamp(9px,1.5vw,10px)", color:"rgba(255,255,255,.32)", lineHeight:1.3 }}>
                          {r.desc}
                        </div>
                        {recipient?.id === r.id && (
                          <div style={{ position:"absolute", top:7, right:7, width:18, height:18, borderRadius:"50%", background:"#FFD700", display:"flex", alignItems:"center", justifyContent:"center" }}>
                            <Check size={10} color="#000" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
 
                  {recipient?.id === "custom" && (
                    <div style={{ marginTop:14 }}>
                      <input value={customName} onChange={e => setCustomName(e.target.value)}
                        placeholder="Their name or relationship…" className="pv-input" style={{
                          width:"100%", background:"rgba(255,255,255,.04)",
                          border:"1px solid rgba(255,215,0,.3)", borderRadius:8,
                          padding:"11px 14px", color:"#fff", fontFamily:"Inter", fontSize:14,
                        }}
                      />
                    </div>
                  )}
 
                  <div style={{ marginTop:28, display:"flex", justifyContent:"flex-end" }}>
                    <button className="pv-btn-gold" onClick={() => setStep(2)} disabled={!recipient} style={{ padding:"13px 32px", borderRadius:11, fontSize:14, display:"flex", alignItems:"center", gap:8 }}>
                      Continue <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
 
              {/* ─── STEP 2: EMOTION ─── */}
              {step === 2 && (
                <div className="pv-fade-up">
                  <div style={{ textAlign:"center", marginBottom:26 }}>
                    <div style={{ fontSize:38, marginBottom:10 }}>{recipient?.emoji}</div>
                    <h1 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"clamp(26px,5vw,38px)", fontWeight:600, color:"#FFD700", marginBottom:8 }}>
                      What do you feel?
                    </h1>
                    <p style={{ fontSize:14, color:"rgba(255,255,255,.42)" }}>
                      Write anything — messy thoughts, fragments, any language
                    </p>
                  </div>
 
                  <div style={{ position:"relative" }}>
                    <textarea value={emotion} onChange={e => setEmotion(e.target.value)}
                      maxLength={5000} className="pv-textarea" style={{
                        width:"100%", minHeight:210, background:"rgba(255,255,255,.04)",
                        border:"1.5px solid rgba(255,255,255,.1)", borderRadius:14,
                        padding:"16px", color:"#f0eff8",
                        fontFamily:"Cormorant Garamond,serif", fontSize:16, lineHeight:1.8,
                        boxSizing:"border-box", transition:"border-color .2s",
                      }}
                      placeholder={`Write your raw emotion for ${recipient?.title || "them"}…\n\n"maa ami tomake onek bhalobashi"\n"I miss her every single day"\n"tum mere liye sab kuch ho"`}
                    />
                    <div style={{ position:"absolute", bottom:10, right:12, fontFamily:"Inter", fontSize:11, color:"rgba(255,255,255,.22)" }}>
                      {emotion.length} / 5000
                    </div>
                  </div>
 
                  {detectedLang && (
                    <div style={{ marginTop:8, display:"flex", alignItems:"center", gap:6 }}>
                      <div style={{ width:6, height:6, borderRadius:"50%", background:"#4ade80", flexShrink:0 }} />
                      <span style={{ fontFamily:"Inter", fontSize:12, color:"#4ade80" }}>
                        Detected: {detectedLang}
                      </span>
                    </div>
                  )}
 
                  {/* Intensity */}
                  <div style={{ marginTop:20, ...S.panel }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                      <span style={{ fontFamily:"Inter", fontSize:13, fontWeight:500, color:"rgba(255,255,255,.75)" }}>
                        Emotional Intensity
                      </span>
                      <span style={{ fontFamily:"Cormorant Garamond,serif", fontSize:18, color:"#FFD700", fontWeight:600, fontStyle:"italic" }}>
                        {INT_LABELS[intensity]}
                      </span>
                    </div>
                    <input type="range" min={1} max={10} value={intensity}
                      onChange={e => setIntensity(+e.target.value)} className="pv-range"
                      style={{ width:"100%", background:`linear-gradient(to right,rgba(255,215,0,.8) ${(intensity-1)/9*100}%,rgba(255,255,255,.12) ${(intensity-1)/9*100}%)` }}
                    />
                    <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
                      <span style={{ fontFamily:"Inter", fontSize:10, color:"rgba(255,255,255,.25)" }}>Soft Whisper</span>
                      <span style={{ fontFamily:"Inter", fontSize:10, color:"rgba(255,255,255,.25)" }}>Heartbreaking</span>
                    </div>
                  </div>
 
                  {/* Occasion chips */}
                  <div style={{ marginTop:20 }}>
                    <div style={S.sectionLabel}>OCCASION <span style={{ opacity:.55 }}>(optional)</span></div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                      {OCCASIONS.map(oc => (
                        <button key={oc.id} className="pv-chip-hover"
                          onClick={() => setOccasion(occasion?.id === oc.id ? null : oc)} style={{
                            background: occasion?.id === oc.id ? "rgba(255,215,0,.12)" : "rgba(255,255,255,.04)",
                            border:`1px solid ${occasion?.id === oc.id ? "rgba(255,215,0,.45)" : "rgba(255,255,255,.08)"}`,
                            borderRadius:20, padding:"5px 12px", cursor:"pointer", fontFamily:"Inter", fontSize:12,
                            color: occasion?.id === oc.id ? "#FFD700" : "rgba(255,255,255,.45)",
                          }}>
                          {oc.e} {oc.label}
                        </button>
                      ))}
                    </div>
                  </div>
 
                  <div style={{ marginTop:28, display:"flex", justifyContent:"space-between" }}>
                    <button className="pv-ghost" onClick={() => setStep(1)} style={{ padding:"12px 22px", borderRadius:10, fontSize:14, display:"flex", alignItems:"center", gap:6 }}>
                      <ChevronLeft size={15} /> Back
                    </button>
                    <button className="pv-btn-gold" onClick={() => setStep(3)} disabled={!emotion.trim()} style={{ padding:"13px 32px", borderRadius:11, fontSize:14, display:"flex", alignItems:"center", gap:8 }}>
                      Continue <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
 
              {/* ─── STEP 3: STYLE ─── */}
              {step === 3 && (
                <div className="pv-fade-up">
                  <div style={{ textAlign:"center", marginBottom:26 }}>
                    <h1 style={{ fontFamily:"Cormorant Garamond,serif", fontSize:"clamp(26px,5vw,38px)", fontWeight:600, color:"#FFD700", marginBottom:8 }}>
                      Choose your style
                    </h1>
                    <p style={{ fontSize:14, color:"rgba(255,255,255,.42)" }}>Language, format, and visual theme</p>
                  </div>
 
                  {/* Language */}
                  <div style={{ marginBottom:26 }}>
                    <div style={S.sectionLabel}>LANGUAGE</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                      {LANGUAGES.map(l => (
                        <button key={l.id} onClick={() => setLanguage(l.id)} style={{
                          background: language === l.id ? "rgba(255,215,0,.1)" : "rgba(255,255,255,.04)",
                          border:`1.5px solid ${language === l.id ? "rgba(255,215,0,.5)" : "rgba(255,255,255,.08)"}`,
                          borderRadius:8, padding:"9px 14px", cursor:"pointer", fontFamily:"Inter", fontSize:13,
                          color: language === l.id ? "#FFD700" : "rgba(255,255,255,.6)",
                          display:"flex", alignItems:"center", gap:8, transition:"all .15s",
                        }}>
                          <span>{l.flag}</span> {l.label}
                          {language === l.id && <Check size={12} />}
                        </button>
                      ))}
                    </div>
                  </div>
 
                  {/* Format */}
                  <div style={{ marginBottom:26 }}>
                    <div style={S.sectionLabel}>FORMAT</div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:10 }}>
                      {FORMATS.map(f => (
                        <button key={f.id} className="pv-card-hover" onClick={() => setFormat(f.id)} style={{
                          background: format === f.id ? "rgba(255,215,0,.08)" : "rgba(255,255,255,.03)",
                          border:`1.5px solid ${format === f.id ? "rgba(255,215,0,.45)" : "rgba(255,255,255,.07)"}`,
                          borderRadius:12, padding:"14px 16px", cursor:"pointer", textAlign:"left", transition:"all .2s",
                        }}>
                          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:5 }}>
                            <span style={{ fontSize:20 }}>{f.icon}</span>
                            <span style={{ fontFamily:"Inter", fontSize:13, fontWeight:600, color: format === f.id ? "#FFD700" : "#ddd8f0" }}>
                              {f.title}
                            </span>
                          </div>
                          <p style={{ fontFamily:"Inter", fontSize:11, color:"rgba(255,255,255,.35)", margin:0, lineHeight:1.4 }}>
                            {f.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
 
                  {/* Quick Theme */}
                  <div>
                    <div style={S.sectionLabel}>VISUAL THEME <span style={{ opacity:.55 }}>(customizable later)</span></div>
                    <div className="theme-qk">
                      {THEMES.map(t => (
                        <button key={t.id} onClick={() => setTheme(t.id)} style={{
                          background: theme === t.id ? t.cardBg : "rgba(255,255,255,.04)",
                          border:`2px solid ${theme === t.id ? t.accent : "rgba(255,255,255,.06)"}`,
                          borderRadius:12, padding:"11px 5px", cursor:"pointer", textAlign:"center", transition:"all .2s",
                        }}>
                          <div style={{ fontSize:18, marginBottom:3 }}>{t.emoji}</div>
                          <div style={{ fontFamily:"Inter", fontSize:9, color: theme === t.id ? t.accent : "rgba(255,255,255,.38)", lineHeight:1.35 }}>
                            {t.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
 
                  <div style={{ marginTop:28, display:"flex", justifyContent:"space-between" }}>
                    <button className="pv-ghost" onClick={() => setStep(2)} style={{ padding:"12px 22px", borderRadius:10, fontSize:14, display:"flex", alignItems:"center", gap:6 }}>
                      <ChevronLeft size={15} /> Back
                    </button>
                    <button className="pv-btn-gold" onClick={() => setStep(4)} style={{ padding:"13px 32px", borderRadius:11, fontSize:14, display:"flex", alignItems:"center", gap:8 }}>
                      Continue <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
 
              {/* ─── STEP 4: GENERATE ─── */}
              {step === 4 && (
                <div className="pv-fade-up" style={{ textAlign:"center" }}>
                  <div className="pv-float" style={{ fontSize:72, marginBottom:18, filter:"drop-shadow(0 0 28px rgba(255,215,0,.45))" }}>✨</div>
                  <h1 style={{ fontFamily:"Cinzel,serif", fontSize:"clamp(22px,5vw,34px)", fontWeight:700, marginBottom:10, letterSpacing:"0.04em" }}>
                    <span className="pv-shimmer-gold">Ready to create magic?</span>
                  </h1>
                  <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:18, fontStyle:"italic", color:"rgba(255,255,255,.45)", maxWidth:420, margin:"0 auto 32px", lineHeight:1.6 }}>
                    PoetVerse will transform your raw emotion into a beautiful, personalized masterpiece
                  </p>
 
                  {/* Summary */}
                  <div style={{ ...S.panel, maxWidth:440, margin:"0 auto 32px", borderColor:"rgba(255,215,0,.12)", textAlign:"left" }}>
                    <div style={{ fontFamily:"Inter", fontSize:10, color:"rgba(255,215,0,.5)", letterSpacing:"0.15em", marginBottom:14 }}>
                      GENERATION BRIEF
                    </div>
                    {[
                      { l:"For",       v:`${recipient?.emoji} ${recipient?.title}` },
                      { l:"Format",    v: FORMATS.find(f => f.id === format)?.title },
                      { l:"Language",  v: LANGUAGES.find(l => l.id === language)?.label },
                      { l:"Intensity", v:`${intensity}/10 — ${INT_LABELS[intensity]}` },
                      { l:"Theme",     v:`${T.emoji} ${T.name}` },
                      ...(occasion ? [{ l:"Occasion", v:`${occasion.e} ${occasion.label}` }] : []),
                    ].map(({ l, v }) => (
                      <div key={l} style={{ display:"flex", justifyContent:"space-between", marginBottom:9, alignItems:"flex-start" }}>
                        <span style={{ fontFamily:"Inter", fontSize:12, color:"rgba(255,255,255,.32)", minWidth:80 }}>{l}</span>
                        <span style={{ fontFamily:"Inter", fontSize:12, color:"#ddd8f0", textAlign:"right" }}>{v}</span>
                      </div>
                    ))}
                    <div style={{ marginTop:14, paddingTop:12, borderTop:"1px solid rgba(255,255,255,.06)" }}>
                      <div style={{ fontFamily:"Inter", fontSize:10, color:"rgba(255,255,255,.28)", marginBottom:6 }}>YOUR EMOTION</div>
                      <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:14, fontStyle:"italic", color:"rgba(255,255,255,.55)", lineHeight:1.65, margin:0 }}>
                        "{emotion.slice(0, 150)}{emotion.length > 150 ? "…" : ""}"
                      </p>
                    </div>
                  </div>
 
                  <div style={{ display:"flex", justifyContent:"center", gap:12 }}>
                    <button className="pv-ghost" onClick={() => setStep(3)} style={{ padding:"13px 24px", borderRadius:11, fontSize:14, display:"flex", alignItems:"center", gap:6 }}>
                      <ChevronLeft size={15} /> Edit
                    </button>
                    <button className="pv-btn-gold" onClick={generate} style={{
                      padding:"15px 48px", borderRadius:12,
                      fontFamily:"Cinzel,serif", fontSize:16, letterSpacing:"0.04em",
                      display:"flex", alignItems:"center", gap:10,
                    }}>
                      <Sparkles size={18} /> Generate My Card
                    </button>
                  </div>
                </div>
              )}
 
            </div>
          </div>
        )}
 
        {/* ════════════════════════════════
            STUDIO (Step 5)
        ════════════════════════════════ */}
        {hasCard && (
          <div className="pv-scale-in studio-grid">
 
            {/* ── LEFT: CONTROLS ── */}
            <div className="ctrl-col">
 
              {/* Action bar */}
              <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
                {!editMode ? (
                  <button onClick={() => setEditMode(true)} className="pv-ghost" style={{
                    flex:1, padding:"9px 14px", borderRadius:9, fontSize:13,
                    display:"flex", alignItems:"center", justifyContent:"center", gap:7,
                  }}>
                    <Edit3 size={14} /> Edit Text
                  </button>
                ) : (
                  <button onClick={saveEdits} style={{
                    flex:1, padding:"9px 14px", borderRadius:9, fontSize:13,
                    background:"rgba(74,222,128,.12)", border:"1px solid rgba(74,222,128,.3)",
                    color:"#4ade80", fontFamily:"Inter", cursor:"pointer",
                    display:"flex", alignItems:"center", justifyContent:"center", gap:7,
                  }}>
                    <Check size={14} /> Save Edits
                  </button>
                )}
                <button onClick={saveCard} style={{
                  flex:1, padding:"9px 14px", borderRadius:9, fontSize:13,
                  background:"rgba(255,215,0,.08)", border:"1px solid rgba(255,215,0,.22)",
                  color:"#FFD700", fontFamily:"Inter", cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:7,
                }}>
                  <Save size={14} /> Save Draft
                </button>
                <button onClick={generate} className="pv-ghost" title="Regenerate" style={{
                  padding:"9px 13px", borderRadius:9, display:"flex", alignItems:"center",
                }}>
                  <RefreshCw size={15} />
                </button>
              </div>
 
              {/* Inline edit fields */}
              {editMode && (
                <div className="pv-fade-up" style={{ marginBottom:16, display:"flex", flexDirection:"column", gap:10 }}>
                  {[
                    { label:"TITLE",     val:eTitle,   set:setETitle,   ff:ttFont,           rows:1 },
                    { label:"CONTENT",   val:eContent, set:setEContent, ff:bodyFont,         rows:7 },
                    { label:"SIGNATURE", val:eSig,     set:setESig,     ff:"Dancing Script",  rows:1 },
                  ].map(({ label, val, set, ff, rows }) => (
                    <div key={label}>
                      <div style={{ fontFamily:"Inter", fontSize:10, color:"rgba(255,215,0,.42)", letterSpacing:"0.12em", marginBottom:5 }}>{label}</div>
                      {rows === 1 ? (
                        <input value={val} onChange={e => set(e.target.value)} className="pv-input" style={{
                          width:"100%", background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,215,0,.25)",
                          borderRadius:8, padding:"9px 12px", color:"#f0eff8",
                          fontFamily:`${ff},serif`, fontSize:14, boxSizing:"border-box",
                        }} />
                      ) : (
                        <textarea value={val} onChange={e => set(e.target.value)} rows={rows} className="pv-textarea" style={{
                          width:"100%", background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,215,0,.25)",
                          borderRadius:8, padding:"10px 12px", color:"#f0eff8",
                          fontFamily:`${ff},serif`, fontSize:13, lineHeight:1.7, boxSizing:"border-box",
                        }} />
                      )}
                    </div>
                  ))}
                </div>
              )}
 
              {/* Tabs */}
              <div style={{ display:"flex", gap:3, marginBottom:16, background:"rgba(255,255,255,.04)", borderRadius:10, padding:3 }}>
                {[
                  { id:"customize", label:"Customize", icon:"🎨" },
                  { id:"rewrite",   label:"AI Rewrite", icon:"✨" },
                  { id:"export",    label:"Export",     icon:"⬇️" },
                ].map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id as "customize" | "rewrite" | "export")} style={{
                    flex:1, padding:"8px 4px", borderRadius:8,
                    background: activeTab === tab.id ? "rgba(255,215,0,.12)" : "transparent",
                    border:     activeTab === tab.id ? "1px solid rgba(255,215,0,.3)" : "1px solid transparent",
                    color:      activeTab === tab.id ? "#FFD700" : "rgba(255,255,255,.35)",
                    fontFamily:"Inter", fontSize:12, cursor:"pointer",
                    display:"flex", alignItems:"center", justifyContent:"center", gap:5, transition:"all .2s",
                  }}>
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>
 
              {/* ─── CUSTOMIZE TAB ─── */}
              {activeTab === "customize" && (
                <div className="pv-scroll" style={{ maxHeight:"68vh", overflowY:"auto", paddingRight:3 }}>
 
                  {/* Themes */}
                  <div style={{ marginBottom:20 }}>
                    <div style={S.sectionLabel}>VISUAL THEME</div>
                    <div className="theme-qk">
                      {THEMES.map(t => (
                        <button key={t.id} onClick={() => setTheme(t.id)} style={{
                          background: theme === t.id ? t.cardBg : "rgba(255,255,255,.04)",
                          border:`2px solid ${theme === t.id ? t.accent : "rgba(255,255,255,.06)"}`,
                          borderRadius:12, padding:"10px 5px", cursor:"pointer", textAlign:"center", transition:"all .2s",
                        }}>
                          <div style={{ fontSize:18, marginBottom:3 }}>{t.emoji}</div>
                          <div style={{ fontFamily:"Inter", fontSize:9, color: theme === t.id ? t.accent : "rgba(255,255,255,.38)", lineHeight:1.35 }}>
                            {t.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
 
                  {/* Fonts */}
                  <div style={{ marginBottom:20 }}>
                    <div style={S.sectionLabel}>BODY FONT</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                      {FONTS.map(f => (
                        <button key={f.id} onClick={() => setFontOvr(fontOvr === f.id ? null : f.id)} 
                        style={{
                          background: fontOvr === f.id ? "rgba(255,215,0,.09)" : "rgba(255,255,255,.03)",
                          border:`1px solid ${fontOvr === f.id ? "rgba(3, 3, 0, 0.4)" : "rgba(255,255,255,.06)"}`,
                          borderRadius:8, padding:"9px 14px", cursor:"pointer",
                          display:"flex", justifyContent:"space-between", alignItems:"center", transition:"all .15s",
                        }}>
                          <span style={{ fontFamily:`${f.id},serif`, fontSize:15, color: fontOvr === f.id ? "#FFD700" : "#ddd8f0" }}>
                            {f.name}
                          </span>
                          {fontOvr === f.id && <Check size={12} color="#FFD700" />}
                        </button>
                      ))}
                    </div>
                  </div>
 
                  {/* Accent Colors */}
                  <div style={{ marginBottom:20 }}>
                    <div style={S.sectionLabel}>ACCENT COLOR</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:9 }}>
                      {ACCENTS.map(c => (
                        <button key={c.hex} onClick={() => setAccentOvr(accentOvr === c.hex ? null : c.hex)} title={c.name} style={{
                          width:30, height:30, borderRadius:"50%", background:c.hex, cursor:"pointer",
                          border: accentOvr === c.hex ? "3px solid #fff" : "2px solid rgba(255,255,255,.15)",
                          transition:"transform .15s",
                          transform: accentOvr === c.hex ? "scale(1.28)" : "scale(1)",
                        }} />
                      ))}
                    </div>
                  </div>
 
                  {/* Orientation */}
                  <div style={{ marginBottom:20 }}>
                    <div style={S.sectionLabel}>ORIENTATION</div>
                    <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:7 }}>
                      {ORIENTATIONS.map(o => {
                        const dims = { portrait:[11,15], landscape:[18,13], square:[14,14], story:[8,15] };
                        const [w,h] = dims[o.id as keyof typeof dims] || [11,15];
                        return (
                          <button key={o.id} onClick={() => setOrientation(o.id as Orientation)} style={{
                            background: orientation === o.id ? "rgba(255,215,0,.09)" : "rgba(255,255,255,.03)",
                            border:`1px solid ${orientation === o.id ? "rgba(255,215,0,.4)" : "rgba(255,255,255,.07)"}`,
                            borderRadius:9, padding:"9px 10px", cursor:"pointer",
                            display:"flex", alignItems:"center", gap:9, fontFamily:"Inter", fontSize:12,
                            color: orientation === o.id ? "#FFD700" : "rgba(255,255,255,.48)", transition:"all .15s",
                          }}>
                            <span style={{ display:"inline-block", width:w, height:h, flexShrink:0, borderRadius:2, border:`1.5px solid ${orientation === o.id ? "#FFD700" : "rgba(255,255,255,.28)"}` }} />
                            {o.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
 
                  {/* Stickers */}
                  <div style={{ marginBottom:20 }}>
                    <div style={S.sectionLabel}>STICKERS</div>
                    <div style={{ display:"flex", flexWrap:"wrap", gap:7 }}>
                      {STICKERS.map(s => (
                        <button key={s.id} onClick={() => toggleSticker(s.id)} style={{
                          width:40, height:40, borderRadius:9, fontSize:18,
                          background: stickerList.includes(s.id) ? "rgba(255,215,0,.12)" : "rgba(255,255,255,.04)",
                          border:`1.5px solid ${stickerList.includes(s.id) ? "rgba(255,215,0,.45)" : "rgba(255,255,255,.08)"}`,
                          cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s",
                        }}>
                          {s.e}
                        </button>
                      ))}
                    </div>
                  </div>
 
                  {/* Corners */}
                  <div style={{ marginBottom:8 }}>
                    <div style={S.sectionLabel}>CORNER STYLE</div>
                    <div style={{ display:"flex", gap:6 }}>
                      {CORNERS.map(c => (
                        <button key={c.id} onClick={() => setCornerStyle(c.id)} style={{
                          flex:1, background: cornerStyle === c.id ? "rgba(255,215,0,.09)" : "rgba(255,255,255,.04)",
                          border:`1px solid ${cornerStyle === c.id ? "rgba(255,215,0,.4)" : "rgba(255,255,255,.07)"}`,
                          borderRadius:8, padding:"8px 4px", cursor:"pointer", fontFamily:"Inter", fontSize:11,
                          color: cornerStyle === c.id ? "#FFD700" : "rgba(255,255,255,.42)", transition:"all .15s",
                        }}>
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>
 
                </div>
              )}
 
              {/* ─── REWRITE TAB ─── */}
              {activeTab === "rewrite" && (
                <div className="pv-fade-in">
                  <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:15, fontStyle:"italic", color:"rgba(255,255,255,.42)", marginBottom:16, lineHeight:1.6 }}>
                    Tap any style to have AI instantly reshape your card's voice while keeping the soul intact.
                  </p>
                  <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:8 }}>
                    {REWRITE_ACTIONS.map(a => (
                      <button key={a.id} onClick={() => rewrite(a.id as RewriteAction)} disabled={!!rewriteAction} style={{
                        background: rewriteAction === a.id ? `${a.clr}18` : "rgba(255,255,255,.03)",
                        border:`1px solid ${rewriteAction === a.id ? `${a.clr}55` : "rgba(255,255,255,.07)"}`,
                        borderRadius:11, padding:"13px 10px", cursor: rewriteAction ? "wait" : "pointer",
                        opacity: rewriteAction && rewriteAction !== a.id ? 0.45 : 1,
                        textAlign:"left", transition:"all .2s",
                      }}>
                        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                          {rewriteAction === a.id ? (
                            <div style={{
                              width:18, height:18, borderRadius:"50%", flexShrink:0,
                              border:`2px solid ${a.clr}`, borderTopColor:"transparent",
                              animation:"pvSpin .8s linear infinite",
                            }} />
                          ) : (
                            <span style={{ fontSize:18, flexShrink:0 }}>{a.icon}</span>
                          )}
                          <span style={{ fontFamily:"Inter", fontSize:12, fontWeight:500, color: rewriteAction === a.id ? a.clr : "#ddd8f0" }}>
                            {a.label}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
 
              {/* ─── EXPORT TAB ─── */}
              {activeTab === "export" && (
                <div className="pv-fade-in" style={{ display:"flex", flexDirection:"column", gap:18 }}>
 
                  <div>
                    <div style={S.sectionLabel}>EXPORT QUALITY</div>
                    <div style={{ display:"flex", gap:6 }}>
                      {[2,3,4,5].map(q => (
                        <button key={q} onClick={() => setExportQ(q)} style={{
                          flex:1, background: exportQ === q ? "rgba(255,215,0,.1)" : "rgba(255,255,255,.04)",
                          border:`1px solid ${exportQ === q ? "rgba(255,215,0,.4)" : "rgba(255,255,255,.07)"}`,
                          borderRadius:8, padding:"9px 4px", cursor:"pointer", fontFamily:"Inter", fontSize:13,
                          fontWeight: exportQ === q ? 600 : 400,
                          color: exportQ === q ? "#FFD700" : "rgba(255,255,255,.45)", transition:"all .15s",
                        }}>
                          {q}×
                        </button>
                      ))}
                    </div>
                    <p style={{ fontFamily:"Inter", fontSize:11, color:"rgba(255,255,255,.22)", marginTop:6 }}>
                      Higher quality = sharper image, larger file size
                    </p>
                  </div>
 
                  <div>
                    <div style={S.sectionLabel}>DOWNLOAD</div>
                    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                      {["png","jpeg","webp"].map(fmt => (
                        <button key={fmt} onClick={() => exportCard(fmt)} disabled={isExporting} className="pv-btn-gold" style={{
                          padding:"13px 18px", borderRadius:10, fontSize:13,
                          display:"flex", alignItems:"center", justifyContent:"space-between",
                        }}>
                          <span>{isExporting ? "Exporting…" : `Download ${fmt.toUpperCase()}`}</span>
                          <Download size={15} />
                        </button>
                      ))}
                    </div>
                  </div>
 
                  <div>
                    <div style={S.sectionLabel}>SHARE</div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                      {[
                        { label:"Copy Text",  icon:<Copy size={13}/>,   bg:"rgba(255,255,255,.06)", bdr:"rgba(255,255,255,.1)",  clr:"rgba(255,255,255,.7)",  fn:copyText },
                        { label:"WhatsApp",   icon:"💬",                bg:"rgba(37,211,102,.08)", bdr:"rgba(37,211,102,.25)", clr:"#25D366",               fn:() => window.open(`https://wa.me/?text=${encodeURIComponent(`${dTitle}\n\n${dContent}\n\n${dSig}`)}`, "_blank") },
                        { label:"Telegram",   icon:"✈️",                 bg:"rgba(0,136,204,.08)", bdr:"rgba(0,136,204,.25)",  clr:"#0088cc",               fn:() => window.open(`https://t.me/share/url?text=${encodeURIComponent(`${dTitle}\n\n${dContent}\n\n${dSig}`)}`, "_blank") },
                        { label:"Share",      icon:<Share2 size={13}/>,  bg:"rgba(255,255,255,.04)", bdr:"rgba(255,255,255,.08)", clr:"rgba(255,255,255,.58)", fn:() => { if(navigator.share) navigator.share({ title:dTitle, text:dContent }); else copyText(); } },
                      ].map(item => (
                        <button key={item.label} onClick={item.fn} style={{
                          background:item.bg, border:`1px solid ${item.bdr}`, borderRadius:10,
                          padding:"12px 8px", cursor:"pointer",
                          display:"flex", alignItems:"center", justifyContent:"center", gap:7,
                          fontFamily:"Inter", fontSize:12, color:item.clr, transition:"opacity .15s",
                        }}>
                          {typeof item.icon === "string" ? item.icon : item.icon} {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
 
            {/* ── RIGHT: LIVE CARD PREVIEW ── */}
            <div className="prev-col">
              <div className="pv-sticky">
                <div style={{ fontFamily:"Inter", fontSize:10, color:"rgba(255,255,255,.28)", letterSpacing:"0.14em", marginBottom:12, textAlign:"center" }}>
                  LIVE PREVIEW
                </div>
 
                {/* THE CARD */}
                <div
                  ref={cardRef}
                  style={{
                    aspectRatio: arStr,
                    background: T.cardBg,
                    border: T.border,
                    borderRadius: 16,
                    padding: "clamp(18px,4%,32px)",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: T.shadow,
                    backdropFilter: T.backdrop || undefined,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "all .4s ease",
                    maxHeight: "72vh",
                  }}
                >
                  {/* Corner decorations */}
                  {cSz > 0 && [
                    { top:10, left:10,  borderTop:`1.5px solid ${accent}`, borderLeft:`1.5px solid ${accent}` },
                    { top:10, right:10, borderTop:`1.5px solid ${accent}`, borderRight:`1.5px solid ${accent}` },
                    { bottom:10, left:10,  borderBottom:`1.5px solid ${accent}`, borderLeft:`1.5px solid ${accent}` },
                    { bottom:10, right:10, borderBottom:`1.5px solid ${accent}`, borderRight:`1.5px solid ${accent}` },
                  ].map((s, i) => (
                    <div key={i} style={{ position:"absolute", width:cSz, height:cSz, opacity:.72, ...s }} />
                  ))}
 
                  {/* Stickers */}
                  {stickerList.length > 0 && (
                    <div style={{ position:"absolute", top:14, right:14, display:"flex", flexDirection:"column", gap:2, zIndex:2 }}>
                      {stickerList.slice(0, 5).map(id => {
                        const s = STICKERS.find(x => x.id === id);
                        return s ? <span key={id} style={{ fontSize:"clamp(12px,3vw,18px)", lineHeight:1.3 }}>{s.e}</span> : null;
                      })}
                    </div>
                  )}
 
                  {/* Top */}
                  <div style={{ textAlign:"center", flexShrink:0 }}>
                    {recipient?.emoji && (
                      <div style={{ fontSize:"clamp(16px,4vw,24px)", marginBottom:6, opacity:.82 }}>
                        {recipient.emoji}
                      </div>
                    )}
                    <h2 style={{
                      fontFamily: `${ttFont},serif`,
                      color: T.titleColor,
                      fontSize: "clamp(12px,2.8vw,20px)",
                      fontWeight: 600, lineHeight:1.3,
                    }}>
                      {dTitle || "Your Beautiful Letter"}
                    </h2>
                    <div style={{ width:34, height:1, margin:"8px auto", background:`linear-gradient(90deg,transparent,${accent},transparent)` }} />
                  </div>
 
                  {/* Content */}
                  <div style={{ flex:1, overflow:"hidden", padding:"2px 0" }}>
                    <p style={{
                      fontFamily: `${bodyFont},serif`,
                      color: T.contentColor,
                      fontSize: "clamp(9px,1.9vw,12.5px)",
                      lineHeight: 1.82,
                      whiteSpace: "pre-wrap",
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: orientation === "story" ? 22 : orientation === "landscape" ? 8 : 15,
                      WebkitBoxOrient: "vertical",
                    }}>
                      {dContent || "Your heartfelt letter will appear here…"}
                    </p>
                  </div>
 
                  {/* Signature */}
                  <div style={{ textAlign:"right", flexShrink:0, marginTop:8 }}>
                    <div style={{ width:26, height:1, marginLeft:"auto", marginBottom:5, background:accent, opacity:.5 }} />
                    <span style={{
                      fontFamily:"Dancing Script,cursive",
                      color: T.signatureColor,
                      fontSize: "clamp(12px,2.8vw,17px)",
                      fontStyle: "italic",
                    }}>
                      {dSig || "With Love"}
                    </span>
                  </div>
 
                  {/* Branding */}
                  <div style={{ position:"absolute", bottom:5, left:0, right:0, textAlign:"center", opacity:.18, pointerEvents:"none" }}>
                    <span style={{ fontFamily:"Cinzel,serif", fontSize:"7px", letterSpacing:"0.22em", color:accent }}>
                      ✦ POETVERSE ✦
                    </span>
                  </div>
                </div>
 
                {/* Card meta */}
                <div style={{ marginTop:12, display:"flex", justifyContent:"space-between",
                  alignItems:"center", padding:"0 2px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <span style={{ fontSize:14 }}>{T.emoji}</span>
                    <span style={{ fontFamily:"Inter", fontSize:11, color:"rgba(255,255,255,.35)" }}>
                      {T.name} · {ORIENTATIONS.find(o => o.id === orientation)?.label}
                    </span>
                  </div>
                  <div style={{ display:"flex", gap:3 }}>
                    {stickerList.slice(0, 4).map(id => {
                      const s = STICKERS.find(x => x.id === id);
                      return s ? <span key={id} style={{ fontSize:12 }}>{s.e}</span> : null;
                    })}
                  </div>
                </div>

              </div>{/* /pv-sticky */}
            </div>{/* /prev-col */}

          </div>
        )} {/* /studio-grid */}

      </main>

      {/* ══════════════════════════════════
          SAVED CARDS MODAL
      ══════════════════════════════════ */}
      {showSaved && (
        <div className="pv-fade-in" style={{
          position:"fixed", inset:0, zIndex:9990,
          background:"rgba(4,3,11,.97)", backdropFilter:"blur(8px)",
          display:"flex", flexDirection:"column",
          padding:"20px 16px", overflowY:"auto",
        }}>
          <div style={{ maxWidth:860, margin:"0 auto", width:"100%" }}>

            <div style={{ display:"flex", justifyContent:"space-between",
              alignItems:"center", marginBottom:28 }}>
              <h2 style={{ fontFamily:"Cinzel,serif",
                fontSize:"clamp(20px,4vw,28px)", fontWeight:700,
                color:"#FFD700", margin:0 }}>
                My Saved Cards
              </h2>
              <button onClick={() => setShowSaved(false)} className="pv-ghost" style={{
                width:36, height:36, borderRadius:8,
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>
                <X size={16} />
              </button>
            </div>

            {savedCards.length === 0 ? (
              <div style={{ textAlign:"center", padding:"60px 20px" }}>
                <div style={{ fontSize:52, marginBottom:16, opacity:.4 }}>📭</div>
                <p style={{ fontFamily:"Cormorant Garamond,serif", fontSize:20,
                  color:"rgba(255,255,255,.3)", fontStyle:"italic" }}>
                  No saved cards yet. Create your first masterpiece!
                </p>
              </div>
            ) : (
              <div style={{ display:"grid",
                gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:16 }}>
                {savedCards.map(card => {
                  const ct = THEMES.find(x => x.id === card.theme) || THEMES[0];
                  return (
                    <div key={card.id} style={{
                      background:"rgba(255,255,255,.03)",
                      border:"1px solid rgba(255,255,255,.07)",
                      borderRadius:14, overflow:"hidden",
                    }}>
                      {/* Card preview thumbnail */}
                      <div style={{
                        background:ct.cardBg, padding:"16px 18px",
                        borderBottom:"1px solid rgba(255,255,255,.05)", minHeight:100,
                      }}>
                        <div style={{ fontFamily:ct.titleFont+",serif",
                          color:ct.titleColor, fontSize:14,
                          fontWeight:600, marginBottom:7 }}>
                          {card.title}
                        </div>
                        <p style={{
                          fontFamily:ct.contentFont+",serif", color:ct.contentColor,
                          fontSize:11, lineHeight:1.65, overflow:"hidden",
                          display:"-webkit-box", WebkitLineClamp:3,
                          WebkitBoxOrient:"vertical", margin:0,
                        }}>
                          {card.content}
                        </p>
                      </div>

                      {/* Card footer */}
                      <div style={{ padding:"10px 14px", display:"flex",
                        justifyContent:"space-between", alignItems:"center" }}>
                        <div>
                          <div style={{ fontFamily:"Inter", fontSize:12,
                            color:"rgba(255,255,255,.65)", marginBottom:2 }}>
                            {card.recEmoji} {card.recTitle}
                          </div>
                          <div style={{ fontFamily:"Inter", fontSize:10,
                            color:"rgba(255,255,255,.28)" }}>
                            {new Date(card.ts).toLocaleDateString("en-IN", {
                              day:"numeric", month:"short", year:"numeric"
                            })}
                          </div>
                        </div>
                        <button
                          onClick={async () => {
                            try {
                              await (window as any).storage.delete(`pvc:${card.id}`);
                              await loadCards();
                              showToast("Deleted.", "err");
                            } catch {}
                          }}
                          style={{
                            background:"rgba(239,68,68,.08)",
                            border:"1px solid rgba(239,68,68,.2)",
                            borderRadius:7, padding:"6px 12px", cursor:"pointer",
                            color:"#ef4444", fontFamily:"Inter", fontSize:11,
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        </div>
      )}

    </div> // root
  ); // return
} // CardStudioPage