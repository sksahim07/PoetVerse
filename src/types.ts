export interface Poem {
  id: string;
  title: string;
  content: string;
  author: string;
  language: string;
  type: string;
  created_at: string;
}

export interface GenerationOption {
  id: string;
  label: string;
  value: string;
}