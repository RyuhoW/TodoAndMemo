export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  memo?: string;
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