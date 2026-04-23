/*
# Add Sample Poems for Display

This migration adds sample poems in different languages to showcase the platform.
These are example poems for demonstration purposes.
*/

INSERT INTO poems (user_id, content, language, emotion, poetry_type, is_featured, is_daily) VALUES
(gen_random_uuid(), E'In twilight''s gentle embrace I stand,\nWhere whispers of love touch the land,\nYour memory dances in evening''s glow,\nA tender warmth only hearts can know.', 'english'::language_type, 'love', 'poem'::poetry_type_enum, true, false),

(gen_random_uuid(), E'دل کی دھڑکن میں تیری یاد ہے\nہر سانس میں تیری فریاد ہے\nتیرے بغیر یہ زندگی اداس ہے\nتیری محبت میں میری آس ہے', 'urdu'::language_type, 'love', 'shayari'::poetry_type_enum, true, false),

(gen_random_uuid(), E'तुम्हारी यादों में खो जाता हूँ\nहर पल तुम्हें याद करता हूँ\nदिल की गहराइयों में बसे हो तुम\nहर धड़कन में महसूस करता हूँ', 'hindi'::language_type, 'love', 'shayari'::poetry_type_enum, true, false),

(gen_random_uuid(), E'Silent tears fall like autumn rain,\nEchoes of joy now turned to pain,\nMemories linger in empty rooms,\nWhere once bloomed love, now sadness looms.', 'english'::language_type, 'sad', 'poem'::poetry_type_enum, false, true),

(gen_random_uuid(), E'Rise with the sun, embrace the day,\nLet courage guide you on your way,\nEvery challenge makes you strong,\nIn your heart, you do belong.', 'english'::language_type, 'motivation', 'poem'::poetry_type_enum, false, false),

(gen_random_uuid(), E'তোমার চোখে স্বপ্নের আলো\nহৃদয়ে ভালোবাসার ছায়া\nপ্রতিটি মুহূর্তে তুমি আছো\nজীবনের প্রতিটি কথায়', 'bengali'::language_type, 'love', 'poem'::poetry_type_enum, false, false);