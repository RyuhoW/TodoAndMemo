import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders app header', () => {
  render(<App />);
  const headerElement = screen.getByRole('heading', { name: /Todo & Notes App/i });
  expect(headerElement).toBeInTheDocument();
});

test('renders all main sections', () => {
  render(<App />);
  const todoSection = screen.getByRole('heading', { name: /Todo List/i });
  const notesSection = screen.getByRole('heading', { name: /^Notes$/i });
  const calculatorSection = screen.getByRole('heading', { name: /Calculator/i });

  expect(todoSection).toBeInTheDocument();
  expect(notesSection).toBeInTheDocument();
  expect(calculatorSection).toBeInTheDocument();
}); 