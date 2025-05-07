import React, { useState, useCallback } from 'react';
import TodoList from './components/TodoList';
import Note from './components/Note';
import Calculator from './components/Calculator';
import Calendar from './components/Calendar';
import Dashboard from './components/Dashboard';
import { Todo, TodoList as TodoListType } from './types/todo';
import type { Note as NoteType } from './types/note';
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
  const [activeTab, setActiveTab] = useState<'todo' | 'calendar' | 'dashboard'>('todo');

  const handleAddTodo = useCallback(() => {
    if (inputText.trim()) {
      const now = new Date().toISOString();
      const newTodo: Todo = {
        id: Date.now(),
        text: inputText.trim(),
        completed: false,
        createdAt: now,
        updatedAt: now,
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

  const handleEventDrop = useCallback(({ event, start }: any) => {
    if (event.type === 'todo') {
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === event.id
            ? { ...todo, id: start.getTime() }
            : todo
        )
      );
    } else {
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note.id === event.id
            ? { ...note, timestamp: start.getTime() }
            : note
        )
      );
    }
  }, []);

  const handleReorder = useCallback((result: any) => {
    if (!result.destination) return;

    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTodos(items);
  }, [todos]);

  return (
    <div className="app">
      <header>
        <h1>Todo & Notes App</h1>
        <nav className="main-nav">
          <button
            className={activeTab === 'todo' ? 'active' : ''}
            onClick={() => setActiveTab('todo')}
          >
            Todo
          </button>
          <button
            className={activeTab === 'calendar' ? 'active' : ''}
            onClick={() => setActiveTab('calendar')}
          >
            カレンダー
          </button>
          <button
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            ダッシュボード
          </button>
        </nav>
      </header>
      <main className="content">
        {activeTab === 'todo' && (
          <>
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
                onReorder={handleReorder}
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
          </>
        )}
        {activeTab === 'calendar' && (
          <section className="section">
            <h2>カレンダー</h2>
            <Calendar
              todos={todos}
              notes={notes}
              onEventDrop={handleEventDrop}
            />
          </section>
        )}
        {activeTab === 'dashboard' && (
          <section className="section">
            <Dashboard
              todos={todos}
              notes={notes}
            />
          </section>
        )}
      </main>
    </div>
  );
};

export default App;
