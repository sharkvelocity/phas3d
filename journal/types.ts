// Fix: This file was empty, which caused TypeScript to not treat it as a module.
// Adding exported type definitions resolves import errors in other files.

export type Evidence = string;

export interface Ghost {
  name: string;
  evidence: Evidence[];
  description: string;
  strength: string;
  weakness: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
