import React, { memo, useCallback } from 'react';
import type { Note } from '../../types/note';

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
        <p>{note.content}</p>
        <span className="note-timestamp">{new Date(note.createdAt).toLocaleString()}</span>
      </div>
      <button
        onClick={handleDelete}
        className="note-delete-button"
        title="メモを削除"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      </button>
    </div>
  );
});

NoteComponent.displayName = 'Note';

export default NoteComponent; 