import React, { memo, useCallback } from 'react';
import { TodoList as TodoListType } from '../types/todo';
import TodoItem from './TodoItem';
import { Todo } from '../types/todo';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdateMemo: (id: number, memo: string) => void;
}

const TodoList: React.FC<TodoListProps> = memo(({ todos, onToggle, onDelete, onUpdateMemo }) => {
  const handleToggle = useCallback((id: number) => {
    onToggle(id);
  }, [onToggle]);

  const handleDelete = useCallback((id: number) => {
    onDelete(id);
  }, [onDelete]);

  const handleUpdateMemo = useCallback((id: number, memo: string) => {
    onUpdateMemo(id, memo);
  }, [onUpdateMemo]);

  return (
    <div className="space-y-3 animate-fade-in">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onUpdateMemo={handleUpdateMemo}
        />
      ))}
    </div>
  );
});

TodoList.displayName = 'TodoList';

export default TodoList; 