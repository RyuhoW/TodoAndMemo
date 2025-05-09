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