import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Calendar from '../components/Calendar';
import { Todo } from '../types/todo';
import { Note } from '../types/note';

const mockTodos: Todo[] = [
  {
    id: 1,
    text: 'Test Todo',
    completed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockNotes: Note[] = [
  {
    id: 2,
    text: 'Test Note',
    timestamp: Date.now(),
  },
];

describe('Calendar Component', () => {
  it('renders calendar with controls', () => {
    render(<Calendar todos={mockTodos} notes={mockNotes} />);
    
    expect(screen.getByText('月表示')).toBeInTheDocument();
    expect(screen.getByText('週表示')).toBeInTheDocument();
    expect(screen.getByText('日表示')).toBeInTheDocument();
    expect(screen.getByText('リスト表示')).toBeInTheDocument();
  });

  it('allows switching between different views', () => {
    render(<Calendar todos={mockTodos} notes={mockNotes} />);
    
    const monthViewButton = screen.getByText('月表示');
    const weekViewButton = screen.getByText('週表示');
    const dayViewButton = screen.getByText('日表示');
    const agendaViewButton = screen.getByText('リスト表示');

    fireEvent.click(weekViewButton);
    expect(weekViewButton).toHaveClass('active');

    fireEvent.click(dayViewButton);
    expect(dayViewButton).toHaveClass('active');

    fireEvent.click(agendaViewButton);
    expect(agendaViewButton).toHaveClass('active');

    fireEvent.click(monthViewButton);
    expect(monthViewButton).toHaveClass('active');
  });

  it('displays events with correct colors based on type', () => {
    render(<Calendar todos={mockTodos} notes={mockNotes} />);
    
    const todoEvent = screen.getByText('Test Todo');
    const noteEvent = screen.getByText('Test Note');

    expect(todoEvent.closest('.rbc-event')).toHaveStyle({ backgroundColor: '#4CAF50' });
    expect(noteEvent.closest('.rbc-event')).toHaveStyle({ backgroundColor: '#2196F3' });
  });
}); 