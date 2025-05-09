import React, { useState, useCallback, useMemo, useEffect } from 'react';
import TodoList from './components/todo/TodoList';
import Note from './components/notes/Note';
import Calculator from './components/calculator/Calculator';
import Calendar from './components/calendar/Calendar';
import Dashboard from './components/dashboard/Dashboard';
import { Todo, TodoList as TodoListType } from './types/todo';
import { Note as NoteType } from './types/note';
import { DropResult } from 'react-beautiful-dnd';
import { CalendarEvent } from './components/calendar/CalendarEvent';
import { TaskRepository } from './database/taskRepository';
import { NoteRepository } from './database/noteRepository';
import './styles/main.scss';

const TodoInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}> = React.memo(({ value, onChange, onSubmit }) => {
  const handleSubmit = () => {
    console.log('TodoInput submit clicked');
    onSubmit();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    console.log('TodoInput key pressed:', e.key);
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="input-group">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="新しいタスクを入力"
        onKeyPress={handleKeyPress}
      />
      <button onClick={handleSubmit} className="button">
        追加
      </button>
    </div>
  );
});

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
  const taskRepository = useMemo(() => new TaskRepository(), []);
  const noteRepository = useMemo(() => new NoteRepository(), []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const tasks = await taskRepository.getAllTasks();
        const todoList: TodoListType = tasks.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          created_at: task.created_at,
          updated_at: task.updated_at,
          memo: task.memo
        }));
        setTodos(todoList);

        const loadedNotes = await noteRepository.getAllNotes();
        setNotes(loadedNotes);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };
    loadData();
  }, [taskRepository, noteRepository]);

  const saveDatabase = useCallback(async () => {
    try {
      await taskRepository.saveDatabase();
    } catch (error) {
      console.error('Failed to save database:', error);
    }
  }, [taskRepository]);

  const handleAddTodo = useCallback(async () => {
    console.log('handleAddTodo called with input:', inputText);
    if (inputText.trim()) {
      try {
        const now = new Date().toISOString();
        const todo: Omit<Todo, 'id'> = {
          title: inputText.trim(),
          status: 'pending',
          description: null,
          created_at: now,
          updated_at: now
        };
        console.log('Creating todo:', todo);
        
        const createdTodo = await taskRepository.createTask(todo);
        console.log('Created todo:', createdTodo);
        setTodos((prevTodos) => [...prevTodos, createdTodo]);
        setInputText('');
      } catch (error) {
        console.error('Failed to create task:', error);
      }
    }
  }, [inputText, taskRepository]);

  const handleAddNote = useCallback(async () => {
    console.log('handleAddNote called with input:', noteText);
    if (noteText.trim()) {
      try {
        const newNote: Omit<NoteType, 'id'> = {
          title: noteText.trim(),
          content: noteText.trim(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        console.log('Creating note:', newNote);
        
        const createdNote = await noteRepository.createNote(newNote);
        console.log('Created note:', createdNote);
        setNotes((prevNotes) => [...prevNotes, createdNote]);
        setNoteText('');
      } catch (error) {
        console.error('Failed to create note:', error);
      }
    }
  }, [noteText, noteRepository]);

  const handleToggle = useCallback(async (id: number) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (todo) {
        const newStatus = todo.status === 'pending' ? 'completed' : 'pending';
        const updatedTodo = await taskRepository.updateTask({
          ...todo,
          status: newStatus,
          updated_at: new Date().toISOString()
        });
        
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === id
              ? {
                  ...todo,
                  status: newStatus,
                  updated_at: updatedTodo.updated_at
                }
              : todo
          )
        );
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  }, [todos, taskRepository]);

  const handleDelete = useCallback(async (id: number) => {
    try {
      const deletedId = await taskRepository.deleteTask(id);
      if (deletedId === id) {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  }, [taskRepository]);

  const handleDeleteNote = useCallback(async (id: number) => {
    try {
      const deletedId = await noteRepository.deleteNote(id);
      if (deletedId === id) {
        setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  }, [noteRepository]);

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
    return todos.filter(todo => showCompleted || todo.status === 'pending');
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
          <div className="todo-container">
            <section className="section todo-section">
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
            <section className="section notes-section">
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
            <section className="section calculator-section">
              <h2>Calculator</h2>
              <Calculator />
            </section>
          </div>
        )}
        {activeTab === 'calendar' && (
          <section className="section calendar-section">
            <h2>カレンダー</h2>
            <Calendar
              todos={todos}
              onEventDrop={handleEventDrop}
              onEventResize={handleEventResize}
              onSelectSlot={handleSelectSlot}
              onSelectEvent={handleSelectEvent}
            />
          </section>
        )}
        {activeTab === 'dashboard' && (
          <section className="section dashboard-section">
            <h2>ダッシュボード</h2>
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
