import { ipcRenderer } from 'electron';

export class DatabaseManager {
    private static instance: DatabaseManager;

    private constructor() {}

    public static getInstance(): DatabaseManager {
        if (!DatabaseManager.instance) {
            DatabaseManager.instance = new DatabaseManager();
        }
        return DatabaseManager.instance;
    }

    public async getConnection(): Promise<void> {
        // ElectronのIPC通信を使用するため、このメソッドは不要になりました
        return;
    }

    public async closeAllConnections(): Promise<void> {
        // ElectronのIPC通信を使用するため、このメソッドは不要になりました
        return;
    }

    public async saveDatabase(): Promise<void> {
        // ElectronのIPC通信を使用するため、このメソッドは不要になりました
        return;
    }

    public async loadDatabase(): Promise<void> {
        // ElectronのIPC通信を使用するため、このメソッドは不要になりました
        return;
    }
} 