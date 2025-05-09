const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    getAllTasks: () => ipcRenderer.invoke('get-all-tasks'),
    createTask: (task) => ipcRenderer.invoke('create-task', task),
    updateTask: (task) => ipcRenderer.invoke('update-task', task),
    deleteTask: (id) => ipcRenderer.invoke('delete-task', id),
    getAllNotes: () => ipcRenderer.invoke('get-all-notes'),
    createNote: (note) => ipcRenderer.invoke('create-note', note),
    updateNote: (note) => ipcRenderer.invoke('update-note', note),
    deleteNote: (id) => ipcRenderer.invoke('delete-note', id)
}); 