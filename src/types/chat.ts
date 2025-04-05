export interface Source {
  title?: string;
  url?: string;
  text?: string;
  image?: string;
  type?: 'webpage' | 'video' | 'image' | 'document';
}

export interface CodeBlock {
  language: string;
  code: string;
}

export interface Message {
  text: string;
  isAi: boolean;
  sources?: Source[];
  timestamp: string;
  codeBlocks?: CodeBlock[];
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  timestamp: string;
}
