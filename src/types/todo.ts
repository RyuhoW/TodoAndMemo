export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  memo?: string;
}

export type TodoList = Todo[];

export interface Note {
  id: number;
  text: string;
  timestamp: number;
}

export interface NoteType {
  id: number;
  text: string;
  timestamp: number;
} 