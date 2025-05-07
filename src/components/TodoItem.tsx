import React, { memo, useState } from 'react';
import { Todo } from '../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdateMemo: (id: number, memo: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = memo(({ todo, onToggle, onDelete, onUpdateMemo }) => {
  const [isEditingMemo, setIsEditingMemo] = useState(false);
  const [memoText, setMemoText] = useState(todo.memo || '');

  const handleMemoSubmit = () => {
    onUpdateMemo(todo.id, memoText);
    setIsEditingMemo(false);
  };

  return (
    <div className="animate-slide-in bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
      <div className="flex items-center gap-4">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
          className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-colors duration-200"
        />
        <span className={`flex-1 text-gray-700 ${todo.completed ? 'line-through text-gray-400' : ''} transition-all duration-200`}>
          {todo.text}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditingMemo(true)}
            className="p-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-full transition-colors duration-200"
            title="メモを編集"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors duration-200"
            title="タスクを削除"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      {isEditingMemo ? (
        <div className="mt-3 animate-fade-in">
          <textarea
            value={memoText}
            onChange={(e) => setMemoText(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="メモを入力..."
            rows={3}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => setIsEditingMemo(false)}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200"
            >
              キャンセル
            </button>
            <button
              onClick={handleMemoSubmit}
              className="px-3 py-1 text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors duration-200"
            >
              保存
            </button>
          </div>
        </div>
      ) : todo.memo ? (
        <div className="mt-3 p-3 bg-gray-50 rounded-md animate-fade-in">
          <p className="text-sm text-gray-600">{todo.memo}</p>
        </div>
      ) : null}
    </div>
  );
});

TodoItem.displayName = 'TodoItem';

export default TodoItem; 