import { Note } from '../types/note';

export class NoteRepository {
    public async getAllNotes(): Promise<Note[]> {
        console.log('Getting all notes...');
        try {
            const notes = await window.electron.getAllNotes();
            console.log('Notes retrieved:', notes);
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
        console.log('Creating note:', note);
        try {
            const now = new Date().toISOString();
            const noteWithTimestamps = {
                ...note,
                createdAt: now,
                updatedAt: now
            };
            console.log('Note with timestamps:', noteWithTimestamps);
            const createdNote = await window.electron.createNote(noteWithTimestamps);
            console.log('Note created:', createdNote);
            return {
                id: createdNote.id,
                title: createdNote.title,
                content: createdNote.content,
                createdAt: createdNote.createdAt,
                updatedAt: createdNote.updatedAt
            };
        } catch (error) {
            console.error('Error creating note:', error);
            throw error;
        }
    }

    public async updateNote(note: Note): Promise<Note> {
        console.log('Updating note:', note);
        try {
            const noteWithTimestamp = {
                ...note,
                updated_at: new Date().toISOString()
            };
            const updatedNote = await window.electron.updateNote(noteWithTimestamp);
            console.log('Note updated:', updatedNote);
            return updatedNote;
        } catch (error) {
            console.error('Error updating note:', error);
            throw error;
        }
    }

    public async deleteNote(id: number): Promise<number> {
        console.log('Deleting note:', id);
        try {
            const deletedId = await window.electron.deleteNote(id);
            console.log('Note deleted:', deletedId);
            return deletedId;
        } catch (error) {
            console.error('Error deleting note:', error);
            throw error;
        }
    }
} 