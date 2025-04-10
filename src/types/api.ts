export interface APISource {
  title: string;
  url: string;
  text: string;
  type: 'webpage' | 'document' | 'image' | 'video';
  image?: string;
}

export interface APIResponse {
  response?: string;
  error?: string;
  sources?: APISource[];
}

export interface APIRequest {
  message: string;
  userId?: string;
}

export interface LanguagePreference {
  userId: string;
  language: string;
}

export type ValidLanguage = 
  | 'English' | 'Hindi' | 'Urdu' | 'Marathi' | 'Tamil' | 'Bengali'
  | 'French' | 'Spanish' | 'German' | 'Italian' | 'Portuguese' | 'Russian'
  | 'Japanese' | 'Korean' | 'Chinese' | 'Arabic' | 'Turkish' | 'Vietnamese'
  | 'Thai' | 'Dutch' | 'Polish' | 'Ukrainian' | 'Greek' | 'Hebrew'
  | 'Indonesian' | 'Malay' | 'Filipino';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  sources?: APISource[];
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  userId: string;
  folderId?: string;
  isFavorite?: boolean;
}