const {app, BrowserWindow} = require('electron');

if (require('electron-squirrel-startup')) {
    app.quit();
}

function createWindow() {
     let win = new BrowserWindow({
        width: 800,
        height: 600,
        // webPreferences: {
        //     preload: path.join(__dirname, 'preload.js'),
        //     contextIsolation: true,
        //     enableRemoteModule: false,
        // }
    });

    win.loadFile("dist/ux/browser/index.html");
    win.on('closed', () => {
        win = null;
    })
}

app.whenReady().then(() => {
    createWindow();
});