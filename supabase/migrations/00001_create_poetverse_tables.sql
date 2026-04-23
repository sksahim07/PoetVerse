-- 1. Create Enums for fixed values
CREATE TYPE language_type AS ENUM ('urdu', 'hindi', 'english', 'bengali', 'roman_urdu');
CREATE TYPE poetry_type_enum AS ENUM ('shayari', 'ghazal', 'nazm', 'song', 'poem', 'couplet');

-- 2. Create Poems Table (With all advanced features)
CREATE TABLE poems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  language language_type NOT NULL,
  emotion TEXT NOT NULL,
  poetry_type poetry_type_enum NOT NULL,
  is_featured BOOLEAN DEFAULT false,
  is_daily BOOLEAN DEFAULT false,
  line_length TEXT,
  rhyme_style TEXT,
  word_difficulty TEXT,
  tone_filter TEXT,
  emotion_level TEXT,
  flow_style TEXT,
  musical_notes JSONB,
  conversation_language TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Favorites Table
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  poem_id UUID NOT NULL REFERENCES poems(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, poem_id)
);

-- 4. Create Indexes for faster loading
CREATE INDEX idx_poems_user_id ON poems(user_id);
CREATE INDEX idx_poems_emotion ON poems(emotion);
CREATE INDEX idx_poems_language ON poems(language);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);