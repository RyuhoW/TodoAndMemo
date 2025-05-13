import { Todo } from './todo';
import { Note } from './note';

interface ElectronAPI {
    ipcRenderer: {
        invoke(channel: string, ...args: any[]): Promise<any>;
    };
    getAllTasks(): Promise<any[]>;
    createTask(task: any): Promise<any>;
    updateTask(task: any): Promise<any>;
    deleteTask(id: number): Promise<number>;
    getAllNotes(): Promise<any[]>;
    createNote(note: any): Promise<any>;
    updateNote(note: any): Promise<any>;
    deleteNote(id: number): Promise<number>;
}

declare global {
    interface Window {
        electron: ElectronAPI;
    }
} 