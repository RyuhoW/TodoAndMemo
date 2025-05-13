import React, { memo, useState } from 'react';
import { Todo } from '../../types/todo';

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
    if (todo.id) {
      onUpdateMemo(todo.id, memoText);
      setIsEditingMemo(false);
    }
  };

  return (
    <div className="todo-item">
      <div className="todo-content">
        <input
          type="checkbox"
          checked={todo.status === 'completed'}
          onChange={() => todo.id && onToggle(todo.id)}
          className="todo-checkbox"
        />
        <span className={`todo-text ${todo.status === 'completed' ? 'completed' : ''}`}>
          {todo.title}
        </span>
      </div>
      <div className="todo-actions">
        <button
          onClick={() => setIsEditingMemo(!isEditingMemo)}
          className="action-button memo"
          title="メモを編集"
        >
          📝
        </button>
        <button
          onClick={() => todo.id && onDelete(todo.id)}
          className="action-button delete"
          title="タスクを削除"
        >
          🗑️
        </button>
      </div>
      {isEditingMemo && (
        <div className="memo-editor">
          <textarea
            value={memoText}
            onChange={(e) => setMemoText(e.target.value)}
            placeholder="メモを入力..."
            className="memo-textarea"
          />
          <div className="memo-actions">
            <button onClick={handleMemoSubmit} className="memo-submit">
              保存
            </button>
            <button onClick={() => setIsEditingMemo(false)} className="memo-cancel">
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

TodoItem.displayName = 'TodoItem';

export default TodoItem; 