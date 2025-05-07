import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from '../../components/dashboard/Dashboard';
import { Todo, Note } from '../../types';

// Rechartsのモック
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  PieChart: ({ children }: { children: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ children }: { children: React.ReactNode }) => <div data-testid="pie">{children}</div>,
  Cell: ({ fill }: { fill: string }) => <div data-testid="cell" style={{ backgroundColor: fill }} />,
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

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
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders dashboard with correct title and sections', () => {
    render(<Dashboard todos={mockTodos} notes={mockNotes} />);
    expect(screen.getByRole('heading', { name: 'ダッシュボード' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Todoの進捗状況' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '週間の活動' })).toBeInTheDocument();
  });

  it('renders charts with correct structure', () => {
    render(<Dashboard todos={mockTodos} notes={mockNotes} />);
    expect(screen.getAllByTestId('responsive-container')).toHaveLength(2);
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getAllByTestId('tooltip')).toHaveLength(2);
    expect(screen.getAllByTestId('legend')).toHaveLength(2);
  });

  it('displays correct chart elements', () => {
    render(<Dashboard todos={mockTodos} notes={mockNotes} />);
    expect(screen.getByTestId('pie')).toBeInTheDocument();
    expect(screen.getAllByTestId('cell')).toHaveLength(2);
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getAllByTestId('bar')).toHaveLength(2);
  });
}); 