import React, { useState, useCallback, useMemo } from 'react';
import TodoList from './components/todo/TodoList';
import Note from './components/notes/Note';
import Calculator from './components/calculator/Calculator';
import Calendar from './components/calendar/Calendar';
import Dashboard from './components/dashboard/Dashboard';
import { Todo, TodoList as TodoListType } from './types/todo';
import { Note as NoteType } from './types/note';
import { DropResult } from 'react-beautiful-dnd';
import { CalendarEvent } from './components/calendar/CalendarEvent';
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
  const [showCompleted, setShowCompleted] = useState(false);

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
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
              completedAt: !todo.completed ? new Date().toISOString() : undefined,
            }
          : todo
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

  const handleEventDrop = useCallback((event: CalendarEvent, start: Date, end: Date) => {
    if (event.type === 'todo') {
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === event.id
            ? { ...todo, createdAt: start.toISOString() }
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

  const handleEventResize = useCallback((event: CalendarEvent, start: Date, end: Date) => {
    if (event.type === 'todo') {
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === event.id
            ? { ...todo, createdAt: start.toISOString() }
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

  const handleSelectSlot = useCallback(({ start, end }: { start: Date; end: Date }) => {
    console.log('Selected slot:', start, end);
  }, []);

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    console.log('Selected event:', event);
  }, []);

  const handleReorder = useCallback((result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTodos(items);
  }, [todos]);

  const filteredTodos = useMemo(() => {
    return showCompleted
      ? todos.filter((todo) => todo.completed)
      : todos.filter((todo) => !todo.completed);
  }, [todos, showCompleted]);

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
              <div className="todo-controls">
                <TodoInput
                  value={inputText}
                  onChange={setInputText}
                  onSubmit={handleAddTodo}
                />
                <div className="todo-filters">
                  <button
                    className={`filter-button ${showCompleted ? 'active' : ''}`}
                    onClick={() => setShowCompleted(!showCompleted)}
                  >
                    {showCompleted ? '未完了のタスク' : '完了したタスク'}
                  </button>
                </div>
              </div>
              <TodoList
                todos={filteredTodos}
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
              onEventResize={handleEventResize}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
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
