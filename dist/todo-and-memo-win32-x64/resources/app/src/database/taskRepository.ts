import { Todo } from '../types/todo';

export class TaskRepository {
    public async getAllTasks(): Promise<Todo[]> {
        console.log('Getting all tasks...');
        try {
            const tasks = await window.electron.getAllTasks();
            console.log('Tasks retrieved:', tasks);
            return tasks.map((task: any) => ({
                id: task.id,
                title: task.title,
                description: task.description,
                status: task.status,
                created_at: task.created_at,
                updated_at: task.updated_at,
                memo: task.memo
            }));
        } catch (error) {
            console.error('Error getting tasks:', error);
            throw error;
        }
    }

    public async createTask(todo: Omit<Todo, 'id'>): Promise<Todo> {
        console.log('Creating task:', todo);
        try {
            const createdTask = await window.electron.createTask(todo);
            console.log('Task created:', createdTask);
            return createdTask;
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    }

    public async updateTask(todo: Todo): Promise<Todo> {
        console.log('Updating task:', todo);
        try {
            const updatedTask = await window.electron.updateTask(todo);
            console.log('Task updated:', updatedTask);
            return updatedTask;
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    }

    public async deleteTask(id: number): Promise<number> {
        console.log('Deleting task:', id);
        try {
            const deletedId = await window.electron.deleteTask(id);
            console.log('Task deleted:', deletedId);
            return deletedId;
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    }

    public async saveDatabase(): Promise<void> {
        // Electronのメインプロセスで自動的にデータベースが保存されるため、
        // このメソッドは空の実装とします
        return;
    }
} 