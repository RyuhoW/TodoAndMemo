export interface Todo {
  id: number;
  title: string;
  description: string | null;
  status: 'pending' | 'completed';
  created_at: string;
  updated_at: string;
  memo?: string | null;
}

export type TodoList = Todo[];

export interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export type NoteList = Note[];

export interface NoteType {
  id: number;
  text: string;
  timestamp: number;
} 