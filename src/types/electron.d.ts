import { Todo } from './todo';
import { Note } from './note';

declare global {
    interface Window {
        electron: {
            // Task operations
            getAllTasks: () => Promise<any[]>;
            createTask: (task: Omit<Todo, 'id'>) => Promise<Todo>;
            updateTask: (task: Todo) => Promise<Todo>;
            deleteTask: (id: number) => Promise<number>;
            // Note operations
            getAllNotes: () => Promise<any[]>;
            createNote: (note: Omit<Note, 'id'>) => Promise<Note>;
            updateNote: (note: Note) => Promise<Note>;
            deleteNote: (id: number) => Promise<number>;
        }
    }
} 