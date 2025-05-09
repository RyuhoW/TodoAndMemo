import { DatabaseManager } from '../../database/dbManager';
import { TaskRepository } from '../../database/taskRepository';
import { Task } from '../../types';

// DatabaseManagerのモック
jest.mock('../../database/dbManager', () => {
    const mockDb = {
        prepare: jest.fn(),
        exec: jest.fn()
    };

    return {
        DatabaseManager: {
            getInstance: jest.fn().mockReturnValue({
                getConnection: jest.fn().mockReturnValue(mockDb),
                closeAllConnections: jest.fn()
            })
        }
    };
});

describe('TaskRepository Unit Tests', () => {
    let taskRepository: TaskRepository;
    let mockDb: any;

    beforeEach(() => {
        jest.clearAllMocks();
        taskRepository = new TaskRepository();
        mockDb = (DatabaseManager.getInstance() as any).getConnection();
    });

    it('should create a task', () => {
        const task: Task = {
            title: 'Test Task',
            description: 'Test Description',
            status: 'pending'
        };

        const mockResult = {
            lastInsertRowid: 1
        };

        mockDb.prepare.mockReturnValue({
            run: jest.fn().mockReturnValue(mockResult)
        });

        const result = taskRepository.createTask(task);

        expect(mockDb.prepare).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO tasks')
        );
        expect(result).toMatchObject({
            ...task,
            id: 1
        });
        expect(result).toHaveProperty('created_at');
        expect(result).toHaveProperty('updated_at');
    });

    it('should get a task by id', () => {
        const mockTask: Task = {
            id: 1,
            title: 'Test Task',
            description: 'Test Description',
            status: 'pending',
            created_at: '2024-05-09T00:00:00.000Z',
            updated_at: '2024-05-09T00:00:00.000Z'
        };

        mockDb.prepare.mockReturnValue({
            get: jest.fn().mockReturnValue(mockTask)
        });

        const result = taskRepository.getTask(1);

        expect(mockDb.prepare).toHaveBeenCalledWith(
            expect.stringContaining('SELECT * FROM tasks')
        );
        expect(result).toEqual(mockTask);
    });

    it('should get all tasks', () => {
        const mockTasks: Task[] = [
            {
                id: 1,
                title: 'Task 1',
                status: 'pending',
                created_at: '2024-05-09T00:00:00.000Z',
                updated_at: '2024-05-09T00:00:00.000Z'
            },
            {
                id: 2,
                title: 'Task 2',
                status: 'completed',
                created_at: '2024-05-09T00:00:00.000Z',
                updated_at: '2024-05-09T00:00:00.000Z'
            }
        ];

        mockDb.prepare.mockReturnValue({
            all: jest.fn().mockReturnValue(mockTasks)
        });

        const result = taskRepository.getAllTasks();

        expect(mockDb.prepare).toHaveBeenCalledWith(
            expect.stringContaining('SELECT * FROM tasks')
        );
        expect(result).toEqual(mockTasks);
    });

    it('should update a task', () => {
        const mockTask: Task = {
            id: 1,
            title: 'Test Task',
            description: 'Test Description',
            status: 'pending',
            created_at: '2024-05-09T00:00:00.000Z',
            updated_at: '2024-05-09T00:00:00.000Z'
        };

        mockDb.prepare.mockReturnValue({
            get: jest.fn().mockReturnValue(mockTask),
            run: jest.fn().mockReturnValue({ changes: 1 })
        });

        const updateData = {
            status: 'completed'
        };

        const result = taskRepository.updateTask(1, updateData);

        expect(mockDb.prepare).toHaveBeenCalledWith(
            expect.stringContaining('UPDATE tasks')
        );
        expect(result).toBe(true);
    });

    it('should delete a task', () => {
        mockDb.prepare.mockReturnValue({
            run: jest.fn().mockReturnValue({ changes: 1 })
        });

        const result = taskRepository.deleteTask(1);

        expect(mockDb.prepare).toHaveBeenCalledWith(
            expect.stringContaining('DELETE FROM tasks')
        );
        expect(result).toBe(true);
    });

    it('should return false when updating non-existent task', () => {
        mockDb.prepare.mockReturnValue({
            get: jest.fn().mockReturnValue(null)
        });

        const result = taskRepository.updateTask(999, { status: 'completed' });

        expect(result).toBe(false);
    });
}); 