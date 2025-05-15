console.log('USING THIS MAIN.JS');
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const Database = require('better-sqlite3');
const fs = require('fs');
const { spawn } = require('child_process');
const isDev = process.env.NODE_ENV === 'development';

let mainWindow;
let db;

function log(message) {
    const logPath = path.join(app.getPath('userData'), 'app.log');
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(logPath, logMessage);
    console.log(logMessage);
}

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

        const isProd = !isDev;
        const preloadPath = isProd
            ? path.join(app.getAppPath(), 'electron', 'preload.js')
            : path.join(__dirname, 'preload.js');
        log('preload path (absolute): ' + preloadPath);
        mainWindow = new BrowserWindow({
            width: 1200,
            height: 800,
            webPreferences: {
                nodeIntegration: false,
                contextIsolation: true,
                webSecurity: false,
                preload: preloadPath
            }
        });

        mainWindow.webContents.on('preload-error', (event, preloadPath, error) => {
            log('PRELOAD ERROR: ' + preloadPath + ' - ' + error);
        });

        if (isDev) {
            log('Loading development URL...');
            mainWindow.loadURL('http://localhost:3000');
            mainWindow.webContents.openDevTools();
        } else {
            const appPath = app.getAppPath();
            const buildPath = path.join(appPath, 'build');
            const indexPath = path.join(buildPath, 'index.html');
            log('Loading index.html from: ' + indexPath);
            mainWindow.loadFile(indexPath);
        }

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

        db.exec(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                description TEXT,
                status TEXT DEFAULT 'pending',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                memo TEXT,
                memos TEXT DEFAULT '[]',
                scheduled_time DATETIME
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
        const now = new Date().toISOString();
        const stmt = db.prepare(`
            INSERT INTO tasks (title, description, status, created_at, updated_at, memo, memos, scheduled_time)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        const result = stmt.run(
            task.title || '',
            task.description || '',
            task.status || 'pending',
            task.created_at || now,
            task.updated_at || now,
            task.memo || null,
            JSON.stringify(task.memos || []),
            task.scheduled_time || null
        );
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
            SET title = ?, description = ?, status = ?, updated_at = ?, memo = ?, memos = ?, scheduled_time = ?
            WHERE id = ?
        `);
        const result = stmt.run(
            task.title,
            task.description,
            task.status,
            task.updated_at,
            task.memo || null,
            JSON.stringify(task.memos || []),
            task.scheduled_time || null,
            task.id
        );
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
            note.created_at,
            note.updated_at
        );
        const createdNote = {
            id: result.lastInsertRowid,
            title: note.title,
            content: note.content,
            created_at: note.created_at,
            updated_at: note.updated_at
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

// Pythonスクリプトを実行する関数
function runTaskOptimizer(taskData) {
  return new Promise((resolve, reject) => {
    const pythonPath = isDev
      ? path.join(__dirname, 'python', 'task_optimizer.py')
      : path.join(process.resourcesPath, 'electron', 'python', 'task_optimizer.py');

    log(`Running Python script from: ${pythonPath}`);
    log(`Task data: ${JSON.stringify(taskData)}`);

    const pythonProcess = spawn('python', [
      pythonPath,
      JSON.stringify(taskData)
    ]);

    let result = '';
    let error = '';

    pythonProcess.stdout.on('data', (data) => {
      result += data.toString();
      log(`Python stdout: ${data.toString()}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      error += data.toString();
      log(`Python stderr: ${data.toString()}`);
    });

    pythonProcess.on('close', (code) => {
      log(`Python process exited with code ${code}`);
      if (code !== 0) {
        reject(new Error(`Python process exited with code ${code}: ${error}`));
      } else {
        try {
          const recommendations = JSON.parse(result);
          resolve(recommendations);
        } catch (e) {
          reject(new Error(`Failed to parse Python output: ${e.message}`));
        }
      }
    });
  });
}

// IPCハンドラーの追加
ipcMain.handle('get-task-recommendations', async (event, taskData) => {
  try {
    const recommendations = await runTaskOptimizer(taskData);
    return recommendations;
  } catch (error) {
    console.error('Error getting task recommendations:', error);
    throw error;
  }
});

// タスクデータを取得するIPCハンドラー
ipcMain.handle('get-task-data', async () => {
    try {
        const taskDays = db.prepare(`
            SELECT 
                date(created_at) as date,
                COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks,
                CASE WHEN COUNT(CASE WHEN status = 'completed' THEN 1 END) = 0 THEN 1 ELSE 0 END as is_rest_day
            FROM tasks
            GROUP BY date(created_at)
            ORDER BY date(created_at) DESC
        `).all();

        const dateRange = db.prepare(`
            SELECT 
                MIN(date(created_at)) as start_date,
                MAX(date(created_at)) as end_date
            FROM tasks
        `).get();

        if (!dateRange || !dateRange.start_date || !dateRange.end_date) {
            return taskDays;
        }

        const allDays = [];
        let currentDate = new Date(dateRange.start_date);
        const endDate = new Date(dateRange.end_date);

        while (currentDate <= endDate) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const existingDay = taskDays.find(day => day.date === dateStr);

            if (existingDay) {
                allDays.push(existingDay);
            } else {
                allDays.push({
                    date: dateStr,
                    completed_tasks: 0,
                    is_rest_day: 1
                });
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return allDays;
    } catch (error) {
        log('Error getting task data: ' + error.message);
        throw error;
    }
});

process.on('uncaughtException', (error) => {
    log(`Uncaught Exception: ${error.message}`);
    log(error.stack);
});

process.on('unhandledRejection', (reason, promise) => {
    log(`Unhandled Rejection at: ${promise}`);
    log(`Reason: ${reason}`);
}); 