import React, { memo } from 'react';
import { TodoList as TodoListType } from '../types/todo';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: TodoListType;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onUpdateMemo: (id: number, memo: string) => void;
}

const TodoList: React.FC<TodoListProps> = memo(({ todos, onToggle, onDelete, onUpdateMemo }) => {
  return (
    <div className="space-y-3 animate-fade-in">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdateMemo={onUpdateMemo}
        />
      ))}
    </div>
  );
});

TodoList.displayName = 'TodoList';

export default TodoList; 