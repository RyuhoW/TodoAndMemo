import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../components/Dashboard';
import { Todo, Note } from '../types';

const mockTodos: Todo[] = [
  {
    id: 1,
    text: 'Test Todo 1',
    completed: true,
    memo: 'Test Memo 1',
    createdAt: new Date('2024-03-20').toISOString(),
    updatedAt: new Date('2024-03-20').toISOString(),
  },
  {
    id: 2,
    text: 'Test Todo 2',
    completed: false,
    memo: 'Test Memo 2',
    createdAt: new Date('2024-03-20').toISOString(),
    updatedAt: new Date('2024-03-20').toISOString(),
  },
];

const mockNotes: Note[] = [
  {
    id: 1,
    text: 'Test Note 1',
    timestamp: new Date('2024-03-20').getTime(),
  },
  {
    id: 2,
    text: 'Test Note 2',
    timestamp: new Date('2024-03-20').getTime(),
  },
];

describe('Dashboard Component', () => {
  it('renders dashboard with correct title and sections', () => {
    render(<Dashboard todos={mockTodos} notes={mockNotes} />);
    expect(screen.getByText('ダッシュボード')).toBeInTheDocument();
    expect(screen.getByText('Todoの進捗状況')).toBeInTheDocument();
    expect(screen.getByText('週間の活動')).toBeInTheDocument();
  });

  // Rechartsコンポーネントのレンダリングをテストする代わりに、
  // コンポーネントの基本的な構造をテストします
  it('renders chart containers', () => {
    render(<Dashboard todos={mockTodos} notes={mockNotes} />);
    const chartContainers = document.querySelectorAll('.chart-container');
    expect(chartContainers).toHaveLength(2);
  });

  it('renders responsive containers', () => {
    render(<Dashboard todos={mockTodos} notes={mockNotes} />);
    const responsiveContainers = document.querySelectorAll('.recharts-responsive-container');
    expect(responsiveContainers).toHaveLength(2);
  });
}); 