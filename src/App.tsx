import React, { useState, useCallback } from 'react';
import TodoList from './components/TodoList';
import Note from './components/Note';
import Calculator from './components/Calculator';
import { Todo, TodoList as TodoListType, Note as NoteType } from './types/todo';
import './styles/main.scss';

const TodoInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}> = React.memo(({ value, onChange, onSubmit }) => (
  <div className="input-group">
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="新しいタスクを入力"
      onKeyPress={(e) => e.key === 'Enter' && onSubmit()}
    />
    <button onClick={onSubmit} className="button">
      追加
    </button>
  </div>
));

const NoteInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}> = React.memo(({ value, onChange, onSubmit }) => (
  <div className="input-group">
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="新しいメモを入力"
    />
    <button onClick={onSubmit} className="button">
      追加
    </button>
  </div>
));

const App: React.FC = () => {
  const [todos, setTodos] = useState<TodoListType>([]);
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [inputText, setInputText] = useState('');
  const [noteText, setNoteText] = useState('');

  const handleAddTodo = useCallback(() => {
    if (inputText.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        text: inputText.trim(),
        completed: false,
      };
      setTodos((prevTodos) => [...prevTodos, newTodo]);
      setInputText('');
    }
  }, [inputText]);

  const handleAddNote = useCallback(() => {
    if (noteText.trim()) {
      const newNote: NoteType = {
        id: Date.now(),
        text: noteText.trim(),
        timestamp: Date.now(),
      };
      setNotes((prevNotes) => [...prevNotes, newNote]);
      setNoteText('');
    }
  }, [noteText]);

  const handleToggle = useCallback((id: number) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const handleDelete = useCallback((id: number) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  }, []);

  const handleDeleteNote = useCallback((id: number) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  }, []);

  const handleUpdateMemo = useCallback((id: number, memo: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, memo } : todo
      )
    );
  }, []);

  return (
    <div className="app">
      <header>
        <h1>Todo & Notes App</h1>
      </header>
      <main className="content">
        <section className="section">
          <h2>Todo List</h2>
          <TodoInput
            value={inputText}
            onChange={setInputText}
            onSubmit={handleAddTodo}
          />
          <TodoList
            todos={todos}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onUpdateMemo={handleUpdateMemo}
          />
        </section>
        <section className="section">
          <h2>Notes</h2>
          <NoteInput
            value={noteText}
            onChange={setNoteText}
            onSubmit={handleAddNote}
          />
          <div className="notes-grid">
            {notes.map(note => (
              <Note
                key={note.id}
                note={note}
                onDelete={handleDeleteNote}
              />
            ))}
          </div>
        </section>
        <section className="section">
          <h2>Calculator</h2>
          <Calculator />
        </section>
      </main>
    </div>
  );
};

export default App;
