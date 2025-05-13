import { Note } from '../types/note';

export class NoteRepository {
    public async getAllNotes(): Promise<Note[]> {
        try {
            const notes = await window.electron.ipcRenderer.invoke('get-all-notes');
            return notes.map((note: any) => ({
                id: note.id,
                title: note.title,
                content: note.content,
                createdAt: note.created_at,
                updatedAt: note.updated_at
            }));
        } catch (error) {
            console.error('Error getting notes:', error);
            throw error;
        }
    }

    public async createNote(note: Omit<Note, 'id'>): Promise<Note> {
        try {
            const noteWithTimestamps = {
                ...note,
                created_at: note.createdAt,
                updated_at: note.updatedAt
            };
            const createdNote = await window.electron.ipcRenderer.invoke('create-note', noteWithTimestamps);
            return {
                id: createdNote.id,
                title: createdNote.title,
                content: createdNote.content,
                createdAt: createdNote.created_at,
                updatedAt: createdNote.updated_at
            };
        } catch (error) {
            console.error('Error creating note:', error);
            throw error;
        }
    }

    public async updateNote(note: Note): Promise<Note> {
        try {
            const now = new Date().toISOString();
            const noteWithTimestamp = {
                ...note,
                updated_at: now
            };
            const updatedNote = await window.electron.ipcRenderer.invoke('update-note', noteWithTimestamp);
            return {
                id: updatedNote.id,
                title: updatedNote.title,
                content: updatedNote.content,
                createdAt: updatedNote.created_at,
                updatedAt: updatedNote.updated_at
            };
        } catch (error) {
            console.error('Error updating note:', error);
            throw error;
        }
    }

    public async deleteNote(id: number): Promise<number> {
        try {
            const deletedId = await window.electron.ipcRenderer.invoke('delete-note', id);
            return deletedId;
        } catch (error) {
            console.error('Error deleting note:', error);
            throw error;
        }
    }
} 