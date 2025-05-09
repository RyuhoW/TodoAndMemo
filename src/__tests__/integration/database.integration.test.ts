import { DatabaseManager } from '../../database/dbManager';
import { TaskRepository } from '../../database/taskRepository';
import { Task } from '../../types';
import path from 'path';
import fs from 'fs';

describe('Database Integration Tests', () => {
    let dbManager: DatabaseManager;
    let taskRepository: TaskRepository;
    const testDbPath = path.join(process.cwd(), 'database', 'test');

    beforeAll(() => {
        // テスト用のデータベースディレクトリを作成
        if (!fs.existsSync(testDbPath)) {
            fs.mkdirSync(testDbPath, { recursive: true });
        }
        dbManager = DatabaseManager.getInstance();
        taskRepository = new TaskRepository();
    });

    afterAll(() => {
        // テスト用のデータベース接続を閉じる
        dbManager.closeAllConnections();
        // テスト用のデータベースファイルを削除
        const files = fs.readdirSync(testDbPath);
        files.forEach(file => {
            fs.unlinkSync(path.join(testDbPath, file));
        });
        fs.rmdirSync(testDbPath);
    });

    beforeEach(() => {
        // 各テスト前にデータベースをクリーンアップ
        const db = dbManager.getConnection();
        db.exec('DELETE FROM tasks');
    });

    it('should create a new task', () => {
        const task: Task = {
            title: 'Test Task',
            description: 'Test Description',
            status: 'pending'
        };

        const createdTask = taskRepository.createTask(task);
        expect(createdTask).toHaveProperty('id');
        expect(createdTask.title).toBe(task.title);
        expect(createdTask.description).toBe(task.description);
        expect(createdTask.status).toBe(task.status);
    });

    it('should retrieve a task by id', () => {
        const task: Task = {
            title: 'Test Task',
            description: 'Test Description',
            status: 'pending'
        };

        const createdTask = taskRepository.createTask(task);
        const retrievedTask = taskRepository.getTask(createdTask.id!);

        expect(retrievedTask).not.toBeNull();
        expect(retrievedTask?.title).toBe(task.title);
    });

    it('should update a task', () => {
        const task: Task = {
            title: 'Test Task',
            description: 'Test Description',
            status: 'pending'
        };

        const createdTask = taskRepository.createTask(task);
        const updateResult = taskRepository.updateTask(createdTask.id!, {
            status: 'completed'
        });

        expect(updateResult).toBe(true);

        const updatedTask = taskRepository.getTask(createdTask.id!);
        expect(updatedTask?.status).toBe('completed');
    });

    it('should delete a task', () => {
        const task: Task = {
            title: 'Test Task',
            description: 'Test Description',
            status: 'pending'
        };

        const createdTask = taskRepository.createTask(task);
        const deleteResult = taskRepository.deleteTask(createdTask.id!);

        expect(deleteResult).toBe(true);

        const deletedTask = taskRepository.getTask(createdTask.id!);
        expect(deletedTask).toBeNull();
    });

    it('should list all tasks', () => {
        const tasks: Task[] = [
            { title: 'Task 1', status: 'pending' },
            { title: 'Task 2', status: 'completed' },
            { title: 'Task 3', status: 'pending' }
        ];

        tasks.forEach(task => taskRepository.createTask(task));
        const allTasks = taskRepository.getAllTasks();

        expect(allTasks).toHaveLength(tasks.length);
        expect(allTasks[0].title).toBe('Task 3'); // 作成日時の降順でソートされていることを確認
    });
}); 