import React, { useState } from 'react';
import { Todo } from '../../types/todo';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdateMemo: (id: number, memo: string) => void;
  onUpdateScheduledTime: (id: number, time: string) => void;
  onDeleteMemo: (id: number, memoIndex: number) => void;
  onCarryOver: (id: number) => void;
  showCompleted: boolean;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  onToggle,
  onDelete,
  onUpdateMemo,
  onUpdateScheduledTime,
  onDeleteMemo,
  onCarryOver,
  showCompleted,
}) => {
  const [expandedTodo, setExpandedTodo] = useState<number | null>(null);
  const [memoText, setMemoText] = useState<string>('');
  const [scheduledTime, setScheduledTime] = useState<string>('');

  const handleExpand = (id: number) => {
    setExpandedTodo(expandedTodo === id ? null : id);
    const todo = todos.find(t => t.id === id);
    if (todo) {
      setMemoText('');
      setScheduledTime(todo.scheduled_time || '');
    }
  };

  const handleMemoSubmit = (id: number) => {
    if (memoText.trim()) {
      onUpdateMemo(id, memoText);
      setMemoText('');
    }
  };

  const handleScheduledTimeSubmit = (id: number) => {
    onUpdateScheduledTime(id, scheduledTime);
    setScheduledTime('');
  };

  const getElapsedDays = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const formatScheduledTime = (time: string) => {
    const date = new Date(time);
    return date.toLocaleString('ja-JP', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredTodos = todos
    .filter(todo => showCompleted ? todo.status === 'completed' : todo.status === 'pending')
    .sort((a, b) => {
      if (a.scheduled_time && b.scheduled_time) {
        return new Date(a.scheduled_time).getTime() - new Date(b.scheduled_time).getTime();
      }
      if (a.scheduled_time) return -1;
      if (b.scheduled_time) return 1;
      const aDays = getElapsedDays(a.created_at);
      const bDays = getElapsedDays(b.created_at);
      return bDays - aDays;
    });

  return (
    <div className="todo-list-container">
      <div className="todo-list">
        {filteredTodos.map((todo) => (
          <div
            key={todo.id}
            className={`todo-item ${todo.status === 'completed' ? 'completed' : ''}`}
          >
            <div className="todo-content">
              <div
                className={`todo-checkbox ${todo.status === 'completed' ? 'completed' : ''}`}
                onClick={() => onToggle(todo.id)}
              />
              <div className="todo-text">
                <div className="todo-title-row">
                  <div className="todo-title-wrapper">
                    <span className={todo.status === 'completed' ? 'completed' : ''}>
                      {todo.title}
                    </span>
                  </div>
                  {todo.status === 'pending' && !todo.scheduled_time && (
                    <div className="elapsed-days">
                      {getElapsedDays(todo.created_at)}日経過
                    </div>
                  )}
                </div>
                {todo.scheduled_time && (
                  <div className="scheduled-time">
                    {formatScheduledTime(todo.scheduled_time)}
                  </div>
                )}
                <div className="todo-actions">
                  {todo.status === 'pending' && (
                    <button
                      className="action-button carry-over"
                      onClick={() => onCarryOver(todo.id)}
                      title="翌日繰越（本日着手）"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" stroke="currentColor" />
                      </svg>
                    </button>
                  )}
                  <button
                    className="action-button expand"
                    onClick={() => handleExpand(todo.id)}
                    title="設定"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDelete(todo.id)}
                    className="action-button"
                    title="削除"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            {expandedTodo === todo.id && (
              <div className="todo-details">
                <div className="scheduled-time-input">
                  <div className="input-group">
                    <input
                      type="datetime-local"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="time-input"
                    />
                    <button
                      onClick={() => handleScheduledTimeSubmit(todo.id)}
                      className="save-button"
                      title="予定時間を設定"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      時間設定
                    </button>
                  </div>
                </div>
                <div className="memo-input">
                  <textarea
                    value={memoText}
                    onChange={(e) => setMemoText(e.target.value)}
                    placeholder="メモを入力..."
                    rows={3}
                  />
                  <button
                    onClick={() => handleMemoSubmit(todo.id)}
                    className="save-button"
                    title="メモを追加"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    メモ追加
                  </button>
                </div>
                {todo.memos && todo.memos.map((memo: string, memoIndex: number) => (
                  <div key={memoIndex} className="memo-display">
                    <div className="memo-header">
                      <div className="memo-title">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>メモ</span>
                      </div>
                      <button
                        className="memo-delete"
                        onClick={() => onDeleteMemo(todo.id, memoIndex)}
                        title="メモを削除"
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <div className="memo-content">{memo}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;