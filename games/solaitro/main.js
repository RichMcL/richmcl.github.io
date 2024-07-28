const { app, BrowserWindow, ipcRenderer } = require('electron');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1280,
        height: 800
    });

    win.loadFile('index.html');

    win.setAspectRatio(16 / 10);
};

app.whenReady().then(() => {
    createWindow();
});
