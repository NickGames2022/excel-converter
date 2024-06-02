const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

ipcMain.on('saveJsonFile', (event, jsonData) => {
  const jsonDataString = JSON.stringify(jsonData, null, 2);
  const filePath = dialog.showSaveDialogSync({
    title: 'Save JSON File',
    defaultPath: app.getPath('downloads'),
    filters: [{ name: 'JSON Files', extensions: ['json'] }]
  });

  if (filePath) {
    try {
      fs.writeFileSync(filePath, jsonDataString);
      dialog.showMessageBox({
        type: 'info',
        title: 'Success',
        message: 'JSON file saved successfully!'
      });
    } catch (error) {
      dialog.showErrorBox('Error', 'Failed to save JSON file.');
    }
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});