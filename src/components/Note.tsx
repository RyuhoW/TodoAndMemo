import React, { memo } from 'react';
import { Note as NoteType } from '../types/todo';

interface NoteProps {
  note: NoteType;
  onDelete: (id: number) => void;
}

const Note: React.FC<NoteProps> = memo(({ note, onDelete }) => {
  return (
    <div className="animate-slide-in bg-gradient-to-r from-white to-purple-50/50 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-purple-100/50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-700 whitespace-pre-wrap">{note.text}</p>
          <p className="text-sm text-gray-500 mt-2">
            {new Date(note.createdAt).toLocaleString('ja-JP', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
        <button
          onClick={() => onDelete(note.id)}
          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-all duration-200 transform hover:scale-110"
          title="メモを削除"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
});

Note.displayName = 'Note';

export default Note; 