import React, { useState, useCallback } from 'react';
import TodoList from './components/TodoList';
import Note from './components/Note';
import { Todo, TodoList as TodoListType, Note as NoteType } from './types/todo';

function App() {
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
        createdAt: new Date(),
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 animate-bounce-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Todo & Notes</h1>
          <p className="text-gray-600">タスク管理とメモを一つのアプリで</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Todo Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 animate-fade-in">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">タスク</h2>
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="新しいタスクを入力"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
              />
              <button
                onClick={handleAddTodo}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                追加
              </button>
            </div>
            <TodoList
              todos={todos}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onUpdateMemo={handleUpdateMemo}
            />
          </div>

          {/* Notes Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 animate-fade-in">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">メモ</h2>
            <div className="flex gap-4 mb-6">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="新しいメモを入力"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                rows={3}
              />
              <button
                onClick={handleAddNote}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 transform hover:-translate-y-0.5"
              >
                追加
              </button>
            </div>
            <div className="space-y-4">
              {notes.map((note) => (
                <Note key={note.id} note={note} onDelete={handleDeleteNote} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
