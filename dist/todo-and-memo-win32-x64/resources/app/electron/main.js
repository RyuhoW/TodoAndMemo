const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Database = require('better-sqlite3');
const fs = require('fs');

let mainWindow;
let db;

// デバッグログ用の関数
function log(message) {
    const logPath = path.join(app.getPath('userData'), 'app.log');
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(logPath, logMessage);
    console.log(logMessage);
}

// エラーハンドリング関数
function handleError(error, context) {
    const errorMessage = `Error in ${context}: ${error.message}\nStack: ${error.stack}`;
    log(errorMessage);
}

function createWindow() {
    try {
        log('Creating main window...');
        log(`Current working directory: ${process.cwd()}`);
        log(`App path: ${app.getAppPath()}`);
        log(`User data path: ${app.getPath('userData')}`);

        mainWindow = new BrowserWindow({
            width: 1200,
            height: 800,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                webSecurity: false,
                preload: path.join(__dirname, 'preload.js')
            }
        });

        if (process.env.NODE_ENV === 'development') {
            log('Loading development URL...');
            mainWindow.webContents.openDevTools();
        }

        const appPath = app.getAppPath();
        const buildPath = path.join(appPath, 'build');
        const indexPath = path.join(buildPath, 'index.html');

        log('Loading index.html from: ' + indexPath);
        mainWindow.loadFile(indexPath);

        mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
            handleError(new Error(`Failed to load: ${errorCode} - ${errorDescription}`), 'did-fail-load');
        });

        mainWindow.webContents.on('crashed', (event) => {
            handleError(new Error('Renderer process crashed'), 'renderer crash');
        });

        mainWindow.on('closed', () => {
            log('Main window closed');
            mainWindow = null;
        });
    } catch (error) {
        handleError(error, 'createWindow');
        app.quit();
    }
}

function initializeDatabase() {
    try {
        const dbPath = path.join(app.getPath('userData'), 'todo.db');
        log(`Initializing database at: ${dbPath}`);
        
        db = new Database(dbPath, { verbose: log });
        log('Database connection established');

        // テーブル作成
        db.exec(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                status TEXT DEFAULT 'pending',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                memo TEXT
            );

            CREATE TABLE IF NOT EXISTS notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                content TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `);
        log('Database schema initialized');
    } catch (error) {
        handleError(error, 'initializeDatabase');
        app.quit();
    }
}

app.whenReady().then(() => {
    log('App is ready, creating window...');
    try {
        initializeDatabase();
        createWindow();
    } catch (error) {
        log('Failed to start application: ' + error.message);
        app.quit();
    }

    app.on('activate', () => {
        log('App activated');
        if (mainWindow === null) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    log('All windows closed');
    if (db) {
        db.close();
    }
    if (process.platform !== 'darwin') app.quit();
});

// IPC通信のハンドラー
ipcMain.handle('get-all-tasks', async () => {
    try {
        const stmt = db.prepare('SELECT * FROM tasks ORDER BY created_at DESC');
        return stmt.all();
    } catch (error) {
        log('Error getting tasks: ' + error.message);
        throw error;
    }
});

ipcMain.handle('create-task', async (event, task) => {
    try {
        const stmt = db.prepare(`
            INSERT INTO tasks (title, description, status, created_at, updated_at, memo)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        const result = stmt.run(task.title, task.description, task.status, task.created_at, task.updated_at, task.memo || null);
        return { id: result.lastInsertRowid, ...task };
    } catch (error) {
        log('Error creating task: ' + error.message);
        throw error;
    }
});

ipcMain.handle('update-task', async (event, task) => {
    try {
        const stmt = db.prepare(`
            UPDATE tasks
            SET title = ?, description = ?, status = ?, updated_at = ?, memo = ?
            WHERE id = ?
        `);
        stmt.run(task.title, task.description, task.status, task.updated_at, task.memo || null, task.id);
        return task;
    } catch (error) {
        log('Error updating task: ' + error.message);
        throw error;
    }
});

ipcMain.handle('delete-task', async (event, id) => {
    try {
        const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
        stmt.run(id);
        return id;
    } catch (error) {
        log('Error deleting task: ' + error.message);
        throw error;
    }
});

// Notes関連のIPCハンドラー
ipcMain.handle('get-all-notes', async () => {
    try {
        const stmt = db.prepare('SELECT * FROM notes ORDER BY created_at DESC');
        return stmt.all();
    } catch (error) {
        log('Error getting notes: ' + error.message);
        throw error;
    }
});

ipcMain.handle('create-note', async (event, note) => {
    try {
        log(`Creating note: ${JSON.stringify(note)}`);
        const stmt = db.prepare(`
            INSERT INTO notes (title, content, created_at, updated_at)
            VALUES (?, ?, ?, ?)
        `);
        const result = stmt.run(
            note.title,
            note.content,
            note.createdAt,
            note.updatedAt
        );
        const createdNote = {
            id: result.lastInsertRowid,
            title: note.title,
            content: note.content,
            createdAt: note.createdAt,
            updatedAt: note.updatedAt
        };
        log(`Note created successfully: ${JSON.stringify(createdNote)}`);
        return createdNote;
    } catch (error) {
        log('Error creating note: ' + error.message);
        throw error;
    }
});

ipcMain.handle('update-note', async (event, note) => {
    try {
        log(`Updating note: ${JSON.stringify(note)}`);
        const stmt = db.prepare(`
            UPDATE notes
            SET title = ?, content = ?, updated_at = ?
            WHERE id = ?
        `);
        stmt.run(note.title, note.content, note.updated_at, note.id);
        return note;
    } catch (error) {
        log('Error updating note: ' + error.message);
        throw error;
    }
});

ipcMain.handle('delete-note', async (event, id) => {
    try {
        const stmt = db.prepare('DELETE FROM notes WHERE id = ?');
        stmt.run(id);
        return id;
    } catch (error) {
        log('Error deleting note: ' + error.message);
        throw error;
    }
});

// 未処理の例外をキャッチ
process.on('uncaughtException', (error) => {
    log(`Uncaught Exception: ${error.message}`);
    log(error.stack);
});

// 未処理のPromise拒否をキャッチ
process.on('unhandledRejection', (reason, promise) => {
    log(`Unhandled Rejection at: ${promise}`);
    log(`Reason: ${reason}`);
}); 