-- Add roman_urdu to language_type enum
ALTER TYPE language_type ADD VALUE IF NOT EXISTS 'roman_urdu';

-- Add comment explaining the change
COMMENT ON TYPE language_type IS 'Supported languages: urdu, hindi, english, bengali, roman_urdu (Urdu in English pronunciation)';