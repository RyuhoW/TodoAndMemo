import React from 'react';
import { Todo } from '../types/todo';

interface TaskListProps {
    tasks: Todo[];
    onToggleStatus: (task: Todo) => void;
    onDelete: (id: number) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onToggleStatus, onDelete }) => {
    const formatDateTime = (dateTimeStr?: string) => {
        if (!dateTimeStr) return '';
        const date = new Date(dateTimeStr);
        return date.toLocaleString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-4">
            {tasks.map((task) => (
                <div
                    key={task.id}
                    className="bg-white shadow rounded-lg p-4 flex items-start justify-between"
                >
                    <div className="flex-1">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                checked={task.status === 'completed'}
                                onChange={() => onToggleStatus(task)}
                                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                            <h3 className={`ml-3 text-lg font-medium ${task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                {task.title}
                            </h3>
                        </div>
                        {task.description && (
                            <p className="mt-1 text-sm text-gray-500">{task.description}</p>
                        )}
                        {task.scheduled_time && (
                            <p className="mt-1 text-sm text-indigo-600">
                                予定時間: {formatDateTime(task.scheduled_time)}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={() => task.id && onDelete(task.id)}
                        className="ml-4 text-red-600 hover:text-red-800"
                    >
                        削除
                    </button>
                </div>
            ))}
        </div>
    );
}; 