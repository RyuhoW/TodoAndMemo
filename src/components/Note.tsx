import React, { memo } from 'react';
import { Note as NoteType } from '../types/todo';

interface NoteProps {
  note: NoteType;
  onDelete: (id: number) => void;
}

const Note: React.FC<NoteProps> = memo(({ note, onDelete }) => {
  return (
    <div className="animate-slide-in bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex justify-between items-start">
        <p className="text-gray-700 flex-1">{note.text}</p>
        <button
          onClick={() => onDelete(note.id)}
          className="ml-4 text-red-500 hover:text-red-700 transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {new Date(note.createdAt).toLocaleString()}
      </p>
    </div>
  );
});

Note.displayName = 'Note';

export default Note; 