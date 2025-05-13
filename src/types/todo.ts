export type TodoStatus = 'pending' | 'completed';

export interface Todo {
  id: number;
  title: string;
  description: string | null;
  status: TodoStatus;
  created_at: string;
  updated_at: string;
  memo?: string;
  memos: string[];
  scheduled_time?: string;
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