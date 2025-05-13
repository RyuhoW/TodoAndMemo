import React, { useState } from 'react';
import { Todo } from '../../types/todo';

interface TaskFormProps {
    onSubmit: (task: Omit<Todo, 'id'>) => void;
    initialValues?: Partial<Todo>;
}

const TaskForm: React.FC<TaskFormProps> = ({ onSubmit, initialValues }) => {
    const [title, setTitle] = useState(initialValues?.title || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        onSubmit({
            title: title.trim(),
            description: null,
            status: 'pending',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            scheduled_time: null,
            memo: null
        });

        setTitle('');
    };

    return (
        <form onSubmit={handleSubmit} className="task-form">
            <div className="form-group">
                <label htmlFor="title">タスク</label>
                <div className="input-group">
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="新しいタスクを入力"
                        required
                    />
                    <button type="submit">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        追加
                    </button>
                </div>
            </div>
        </form>
    );
};

export default TaskForm; 