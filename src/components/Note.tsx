import React, { memo, useCallback } from 'react';
import type { Note } from '../types/note';

interface NoteProps {
  note: Note;
  onDelete: (id: number) => void;
}

const NoteComponent: React.FC<NoteProps> = memo(({ note, onDelete }) => {
  const handleDelete = useCallback(() => {
    onDelete(note.id);
  }, [note.id, onDelete]);

  return (
    <div className="note">
      <div className="note-content">
        <p>{note.text}</p>
        <span className="note-timestamp">{new Date(note.timestamp).toLocaleString()}</span>
      </div>
      <button
        onClick={handleDelete}
        className="action-button delete"
        title="メモを削除"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
});

NoteComponent.displayName = 'Note';

export default NoteComponent; 