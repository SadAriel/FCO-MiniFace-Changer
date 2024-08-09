// src/preload.js

// 모듈 선언
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
    getVersion: () => ipcRenderer.invoke("get-version"),
    getTheme: () => ipcRenderer.invoke("get-theme"),
    setTheme: (theme) => ipcRenderer.invoke("set-theme", theme),
    getFcoPath: () => ipcRenderer.invoke("get-fcopath"),
    setFcoPath: (path) => ipcRenderer.invoke("set-fcopath", path),
    openFcoPathDialog: () => ipcRenderer.invoke("open-fcopath-dialog"),
    checkFcoPath: (path) => ipcRenderer.invoke("check-fcopath", path),
    getPlayerList: () => ipcRenderer.invoke("get-player-list"),
    getPlayerImage: (path, playerId) => ipcRenderer.invoke("get-player-image", path, playerId),
    openImageFileDialog: () => ipcRenderer.invoke("open-image-file-dialog"),
    changeMiniface: (fcoPath, imagePath, playerSpid, playerType) => ipcRenderer.invoke("change-miniface", fcoPath, imagePath, playerSpid, playerType),
    openWebpage: (url) => ipcRenderer.invoke("open-webpage", url),
    getReport: (reportMessage) => ipcRenderer.invoke("get-report", reportMessage)
});