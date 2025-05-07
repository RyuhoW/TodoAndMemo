import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../App';

describe('Notes Section', () => {
  test('renders notes section with textarea and add button', () => {
    render(<App />);
    
    const notesHeading = screen.getByRole('heading', { name: /^Notes$/i });
    expect(notesHeading).toBeInTheDocument();

    const notesTextarea = screen.getByPlaceholderText(/新しいメモを入力/i);
    expect(notesTextarea).toBeInTheDocument();

    const notesSection = notesHeading.closest('section');
    const addButton = notesSection?.querySelector('button');
    expect(addButton).toHaveTextContent('追加');
  });

  test('can add new note', () => {
    render(<App />);
    
    const notesTextarea = screen.getByPlaceholderText(/新しいメモを入力/i);
    const notesSection = screen.getByRole('heading', { name: /^Notes$/i }).closest('section');
    const addButton = notesSection?.querySelector('button');

    fireEvent.change(notesTextarea, { target: { value: '新しいメモ' } });
    fireEvent.click(addButton!);

    expect(notesTextarea).toHaveValue('');
  });
}); 