import React, { useState, useCallback, useMemo, useEffect } from 'react';
import TodoList from './components/todo/TodoList';
import Note from './components/notes/Note';
import Calculator from './components/calculator/Calculator';
import Calendar from './components/calendar/Calendar';
import Dashboard from './components/dashboard/Dashboard';
import TaskRecommendations from './components/TaskRecommendations';
import { Todo, TodoList as TodoListType } from './types/todo';
import { Note as NoteType } from './types/note';
import { CalendarEvent } from './components/calendar/CalendarEvent';
import { TaskRepository } from './database/taskRepository';
import { NoteRepository } from './database/noteRepository';
import TaskForm from './components/todo/TaskForm';
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
    <button onClick={onSubmit} className="button-green">
      追加
    </button>
  </div>
));

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [inputText, setInputText] = useState('');
  const [noteText, setNoteText] = useState('');
  const [activeTab, setActiveTab] = useState<'todo' | 'calendar' | 'dashboard'>('todo');
  const [showCompleted, setShowCompleted] = useState(false);
  const [completedTasksLimit, setCompletedTasksLimit] = useState(10);
  const taskRepository = useMemo(() => new TaskRepository(), []);
  const noteRepository = useMemo(() => new NoteRepository(), []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const tasks = await taskRepository.getAllTasks();
        const todoList: Todo[] = tasks.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description,
          status: task.status,
          created_at: task.created_at,
          updated_at: task.updated_at,
          memo: task.memo,
          scheduled_time: task.scheduled_time,
          memos: task.memos || []
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

  const handleAddTodo = useCallback(async (task: Omit<Todo, 'id'>) => {
    try {
      const newTodo = await taskRepository.createTask(task);
      setTodos(prevTodos => [...prevTodos, newTodo]);
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  }, [taskRepository]);

  const handleAddNote = useCallback(async () => {
    if (noteText.trim()) {
      try {
        const now = new Date().toISOString();
        const newNote: Omit<NoteType, 'id'> = {
          title: noteText.trim(),
          content: noteText.trim(),
          createdAt: now,
          updatedAt: now
      };
        
        const createdNote = await noteRepository.createNote(newNote);
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

  const handleUpdateMemo = useCallback(async (id: number, newMemo: string) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      const updatedTodo = {
        ...todo,
        memos: [...(todo.memos || []), newMemo]
      };

      await taskRepository.updateTask(updatedTodo);
      setTodos(prevTodos => prevTodos.map(t => 
        t.id === id ? updatedTodo : t
      ));
    } catch (error) {
      console.error('Failed to update memo:', error);
    }
  }, [todos, taskRepository]);

  const handleDeleteMemo = useCallback(async (id: number, memoIndex: number) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      const updatedTodo = {
        ...todo,
        memos: todo.memos.filter((_, index) => index !== memoIndex)
      };

      await taskRepository.updateTask(updatedTodo);
      setTodos(prevTodos => prevTodos.map(t => 
        t.id === id ? updatedTodo : t
      ));
    } catch (error) {
      console.error('Failed to delete memo:', error);
    }
  }, [todos, taskRepository]);

  const handleUpdateScheduledTime = useCallback(async (id: number, scheduledTime: string) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      const updatedTodo = {
        ...todo,
        scheduled_time: scheduledTime,
        updated_at: new Date().toISOString()
      };

      await taskRepository.updateTask(updatedTodo);
      setTodos(prevTodos =>
        prevTodos.map(todo =>
          todo.id === id ? updatedTodo : todo
        )
      );
    } catch (error) {
      console.error('Failed to update scheduled time:', error);
    }
  }, [todos, taskRepository]);

  const handleCarryOver = useCallback(async (id: number) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const updatedTodo: Todo = {
        ...todo,
        status: 'completed' as const,
        updated_at: new Date().toISOString(),
        scheduled_time: tomorrow.toISOString()
      };

      await taskRepository.updateTask(updatedTodo);
      setTodos(prevTodos =>
        prevTodos.map(t =>
          t.id === id ? updatedTodo : t
        )
      );
    } catch (error) {
      console.error('Failed to carry over task:', error);
    }
  }, [todos, taskRepository]);

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

  const filteredTodos = useMemo(() => {
    const filtered = todos.filter(todo => showCompleted || todo.status === 'pending');
    if (showCompleted) {
      return filtered.slice(0, completedTasksLimit);
    }
    return filtered;
  }, [todos, showCompleted, completedTasksLimit]);

  const hasMoreCompletedTasks = useMemo(() => {
    if (!showCompleted) return false;
    const completedTasks = todos.filter(todo => todo.status === 'completed');
    return completedTasks.length > completedTasksLimit;
  }, [todos, showCompleted, completedTasksLimit]);

  const handleShowMore = () => {
    setCompletedTasksLimit(prev => prev + 10);
  };

  const calculateCompletionRate = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = todos.filter(task => {
      const taskDate = task.scheduled_time ? new Date(task.scheduled_time).toISOString().split('T')[0] : null;
      return taskDate === today;
    });
    
    if (todayTasks.length === 0) return 0;
    
    const completedTasks = todayTasks.filter(task => task.status === 'completed').length;
    return (completedTasks / todayTasks.length) * 100;
  };

  const getProgressBarColor = (rate: number) => {
    if (rate < 35) return 'progress-bar__fill--red';
    if (rate < 70) return 'progress-bar__fill--yellow';
    return 'progress-bar__fill--blue';
  };

  return (
    <div className="app">
   
      <header className="app-header">
        <h1>Stoic Todo</h1>
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
      <div className="progress-bar">
        <div
          className={`progress-bar__fill ${getProgressBarColor(calculateCompletionRate())}`}
          style={{ width: `${calculateCompletionRate()}%` }}
        />
      </div>

      <div className="app-container">
        <div className="main-panel">
        {activeTab === 'todo' && (
            <div className="todo-container">
              <section className="section todo-section">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Todo List</h2>
                <div className="todo-controls space-y-6">
                  <TaskForm
                  onSubmit={handleAddTodo}
                />
                  <div className="todo-filters flex justify-end">
                  <button
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                        showCompleted
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                      }`}
                    onClick={() => {
                      setShowCompleted(!showCompleted);
                      setCompletedTasksLimit(10);
                    }}
                  >
                    {showCompleted ? '未完了のタスク' : '完了したタスク'}
                  </button>
                </div>
              </div>
                <div className="mt-6">
              <TodoList
                todos={filteredTodos}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onUpdateMemo={handleUpdateMemo}
                    onUpdateScheduledTime={handleUpdateScheduledTime}
                    onDeleteMemo={handleDeleteMemo}
                    onCarryOver={handleCarryOver}
                    showCompleted={showCompleted}
              />
                {hasMoreCompletedTasks && (
                  <div className="flex justify-center mt-4">
                    <button
                      className="show-more-button"
                      onClick={handleShowMore}
                    >
                      もっと見る
                    </button>
                  </div>
                )}
                </div>
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
        </div>

        <aside className="recommendations-panel">
          <TaskRecommendations />
        </aside>
      </div>
    </div>
  );
};

export default App;
