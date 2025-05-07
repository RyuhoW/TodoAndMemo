import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Todo } from '../types/todo';
import { Note } from '../types/note';

interface DashboardProps {
  todos: Todo[];
  notes: Note[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const Dashboard: React.FC<DashboardProps> = ({ todos, notes }) => {
  const todoStats = useMemo(() => {
    const completed = todos.filter(todo => todo.completed).length;
    const total = todos.length;
    return [
      { name: '完了', value: completed },
      { name: '未完了', value: total - completed },
    ];
  }, [todos]);

  const weeklyStats = useMemo(() => {
    const now = new Date();
    const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
    const weekEnd = new Date(now.setDate(now.getDate() + 6));

    const days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      return date;
    });

    return days.map(date => {
      const dayTodos = todos.filter(todo => {
        const todoDate = new Date(todo.id);
        return todoDate.toDateString() === date.toDateString();
      });

      const dayNotes = notes.filter(note => {
        const noteDate = new Date(note.timestamp);
        return noteDate.toDateString() === date.toDateString();
      });

      return {
        date: date.toLocaleDateString('ja-JP', { weekday: 'short' }),
        todos: dayTodos.length,
        notes: dayNotes.length,
      };
    });
  }, [todos, notes]);

  return (
    <div className="dashboard">
      <h2>ダッシュボード</h2>
      <div className="dashboard-grid">
        <div className="chart-container">
          <h3>Todoの進捗状況</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={todoStats}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {todoStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-container">
          <h3>週間の活動</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="todos" name="Todo" fill="#8884d8" />
              <Bar dataKey="notes" name="メモ" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 