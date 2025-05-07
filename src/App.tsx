import React, { useState, useCallback } from 'react';
import TodoList from './components/TodoList';
import Note from './components/Note';
import { Todo, TodoList as TodoListType, Note as NoteType } from './types/todo';
import './styles/main.scss';

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
      <div className="container">
        <div className="header">
          <h1>Todo & Notes</h1>
          <p>タスク管理とメモを一つのアプリで</p>
        </div>

        <div className="content">
          {/* Todo Section */}
          <div className="section">
            <h2>タスク</h2>
            <div className="input-group">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="新しいタスクを入力"
                onKeyPress={(e) => e.key === 'Enter' && handleAddTodo()}
              />
              <button
                onClick={handleAddTodo}
                className="button"
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
          <div className="section">
            <h2>メモ</h2>
            <div className="input-group">
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="新しいメモを入力"
              />
              <button
                onClick={handleAddNote}
                className="button"
              >
                追加
              </button>
            </div>
            <div className="notes-list">
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
