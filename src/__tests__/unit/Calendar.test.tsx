import React from 'react';
import { render, screen } from '@testing-library/react';
import Calendar from '../../components/calendar/Calendar';
import { Todo } from '../../types/todo';
import { Note } from '../../types/note';

// react-big-calendarのモック
jest.mock('react-big-calendar', () => ({
  Calendar: ({ children }: { children: React.ReactNode }) => <div data-testid="calendar">{children}</div>,
  dateFnsLocalizer: () => ({}),
  Views: {
    MONTH: 'month',
    WEEK: 'week',
    DAY: 'day',
    AGENDA: 'agenda',
  },
}));

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
    id: 1,
    text: 'Test Note',
    timestamp: Date.now(),
  },
];

const mockProps = {
  todos: mockTodos,
  notes: mockNotes,
  onEventDrop: jest.fn(),
  onEventResize: jest.fn(),
  onSelectSlot: jest.fn(),
  onSelectEvent: jest.fn(),
};

describe('Calendar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders calendar controls', () => {
    render(<Calendar {...mockProps} />);
    expect(screen.getByRole('button', { name: '月表示' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '週表示' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '日表示' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'リスト表示' })).toBeInTheDocument();
  });

  it('renders calendar container', () => {
    render(<Calendar {...mockProps} />);
    expect(screen.getByTestId('calendar')).toBeInTheDocument();
  });
}); 