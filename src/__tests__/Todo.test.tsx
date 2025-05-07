import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

describe('Todo Section', () => {
  test('renders todo section with input and add button', () => {
    render(<App />);
    
    const todoHeading = screen.getByRole('heading', { name: /Todo List/i });
    expect(todoHeading).toBeInTheDocument();

    const todoInput = screen.getByPlaceholderText(/新しいタスクを入力/i);
    expect(todoInput).toBeInTheDocument();

    const todoSection = todoHeading.closest('section');
    const addButton = todoSection?.querySelector('button');
    expect(addButton).toHaveTextContent('追加');
  });

  test('can add new todo item', () => {
    render(<App />);
    
    const todoInput = screen.getByPlaceholderText(/新しいタスクを入力/i);
    const todoSection = screen.getByRole('heading', { name: /Todo List/i }).closest('section');
    const addButton = todoSection?.querySelector('button');

    fireEvent.change(todoInput, { target: { value: '新しいタスク' } });
    fireEvent.click(addButton!);

    expect(todoInput).toHaveValue('');
  });
}); 