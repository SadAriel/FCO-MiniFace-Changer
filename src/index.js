// src/index.js

// 모듈 선언
const { app, BrowserWindow } = require("electron");
const path = require("path");

// ipcMain 불러오기
require("./ipcMain");

// 윈도우 생성
const createWindow = () => {
    global.mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        resizable: false,
        autoHideMenuBar: true,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });

    mainWindow.setMenu(null);
    mainWindow.loadFile(path.join(__dirname, "views", "index.html"));

    //mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if(BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    if(process.platform !== "darwin") app.quit();
});