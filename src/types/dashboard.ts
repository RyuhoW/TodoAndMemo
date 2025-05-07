import { Todo } from './todo';
import { Note } from './note';

export interface DashboardStats {
  totalTodos: number;
  completedTodos: number;
  pendingTodos: number;
  totalNotes: number;
  recentActivity: {
    type: 'todo' | 'note';
    id: number;
    text: string;
    timestamp: Date;
  }[];
}

export interface DashboardProps {
  todos: Todo[];
  notes: Note[];
}

export interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

export interface ActivityItemProps {
  type: 'todo' | 'note';
  text: string;
  timestamp: Date;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
} 