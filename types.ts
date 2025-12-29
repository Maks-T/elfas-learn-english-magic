
export type DifficultyLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  audioUrl?: string;
  timestamp: number;
}

export interface Correction {
  original: string;
  corrected: string;
  explanation: string;
  nativeAlternative: string;
}

export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  example: string;
  dateAdded: number;
}

export interface Topic {
  id: string;
  title: string;
  icon: string;
  description: string;
  systemPrompt: string;
  initialMessage: string;
  difficulty: DifficultyLevel;
}

export type ViewType = 'FREE_CHAT' | 'TOPICS' | 'LEVEL_TEST';

export interface LevelResult {
  level: string; // e.g., 'A2'
  score: number;
  feedback: string;
  timestamp: number;
  skills: {
    grammar: number;
    vocabulary: number;
    fluency: number;
  };
}
