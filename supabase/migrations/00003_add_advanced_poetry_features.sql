/*
# Add Advanced Poetry Features

## 1. Plain English Explanation
This migration adds advanced customization fields to the poems table to support:
- Line length preferences
- Rhyme style options
- Word difficulty levels
- Tone filters
- Emotion intensity levels
- Flow preferences
- Musical notes/sur suggestions
- Conversational language detection

## 2. Table Modifications

### poems table - New columns:
- line_length (text): short, medium, long
- rhyme_style (text): no rhyme, soft rhyme, strong rhyme
- word_difficulty (text): simple, poetic, classical
- tone_filter (text): Sufi, Bollywood, Modern, Old-school Ghazal, Rap, Romantic
- emotion_level (text): light, deep, intense
- flow_style (text): slow, smooth, dramatic
- musical_notes (jsonb): Array of musical note suggestions for each line
- conversation_language (text): The natural language used in conversation (hindi, urdu, bengali, hinglish, english)

## 3. Security Changes
- No RLS changes - maintaining public access

## 4. Notes
- All new fields are optional (nullable) to maintain backward compatibility
- musical_notes stored as JSONB for flexibility
*/

ALTER TABLE poems ADD COLUMN IF NOT EXISTS line_length text;
ALTER TABLE poems ADD COLUMN IF NOT EXISTS rhyme_style text;
ALTER TABLE poems ADD COLUMN IF NOT EXISTS word_difficulty text;
ALTER TABLE poems ADD COLUMN IF NOT EXISTS tone_filter text;
ALTER TABLE poems ADD COLUMN IF NOT EXISTS emotion_level text;
ALTER TABLE poems ADD COLUMN IF NOT EXISTS flow_style text;
ALTER TABLE poems ADD COLUMN IF NOT EXISTS musical_notes jsonb;
ALTER TABLE poems ADD COLUMN IF NOT EXISTS conversation_language text;