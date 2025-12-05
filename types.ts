export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  text: string;
  imageUrl?: string; // If the message includes a generated image
  isThinking?: boolean; // For UI loading states
}

export interface Module {
  id: string;
  title: string;
  icon: string;
  description: string;
  initialPrompt: string; // The hidden prompt sent to AI to start the module
}

export interface GlossaryItem {
  term: string;
  definition: string;
  category: string;
}

export enum AppState {
  SELECTION = 'SELECTION',
  SESSION = 'SESSION',
  GUIDE = 'GUIDE',
}