// src/ipcMain.js

// 모듈 선언
const { ipcMain, shell, dialog } = require("electron");
const Store = require("electron-store");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

// 상수 선언
const store = new Store();
const version = "1.0.0"

// getVersion() - 버전 확인
ipcMain.handle("get-version", () => {
    return version;
});

// getTheme() - 테마 확인
ipcMain.handle("get-theme", () => {
    return store.get("theme") ?? "light";
});

// setTheme(theme) - 테마 변경
ipcMain.handle("set-theme", (event, theme) => {
    store.set("theme", theme);
});

// getFcoPath() - FCO 폴더 경로 확인
ipcMain.handle("get-fcopath", () => {
    return store.get("fcopath") ?? "C:/Nexon/EA SPORTS(TM) FC ONLINE";
});

// setFcoPath(path) - FCO 폴더 경로 변경
ipcMain.handle("set-fcopath", (event, fcoPath) => {
    store.set("fcopath", fcoPath);
});

// openFcoPathDialog() - FCO 폴더 경로 다이얼로그
ipcMain.handle("open-fcopath-dialog", () => {
    let fcoPath = dialog.showOpenDialogSync({
        properties: ["openDirectory"]
    });

    if(fcoPath !== undefined) return fcoPath[0];
    else return false;
});

// checkFcoPath(path) - FCO 폴더 유효성 검사
ipcMain.handle("check-fcopath", (event, fcoPath) => {
    if(fs.existsSync(path.join(fcoPath, "fclauncher.exe"))) {
        if(fs.existsSync(path.join(fcoPath, "_cache"))) {
            return true;
        }
        else return false;
    }
    else return false;
});

// getPlayerList() - 선수 목록 불러오기
ipcMain.handle("get-player-list", async () => {
    try {
        let playerList = await axios("https://open.api.nexon.com/static/fconline/meta/spid.json");

        return playerList.data;
    }
    catch (e) {
        return false;
    }
});

// getPlayerImage(fcoPath, playerId) - 선수 이미지 확인
ipcMain.handle("get-player-image", async (event, fcoPath, playerId) => {
    // 변수 선언
    let fcoImagePath = path.join(fcoPath, "_cache", "live", "externalAssets", "common");
    let pid = Number(playerId.substr(3));

    // 게임 폴더 내 playersAction 에서 spid로 확인
    let fcoDirPlayersAction = path.join(fcoImagePath, "playersAction", `p${playerId}.png`);
    if(fs.existsSync(fcoDirPlayersAction)) return { imagePath: fcoDirPlayersAction, type: "playersAction"};

    // 게임 폴더 내 playersAction 에서 pid로 확인
    let fcoDirPlayersActionPid = path.join(fcoImagePath, "playersAction", `p${pid}.png`);
    if(fs.existsSync(fcoDirPlayersActionPid)) return { imagePath: fcoDirPlayersActionPid, type: "playersAction"};

    // API 내 playersAction 에서 spid로 확인
    let apiPlayersActionUrl = `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/playersAction/p${playerId}.png`;
    let apiPlayersAction = await axios.head(apiPlayersActionUrl).then(response => response.status === 200).catch(() => false);
    if(apiPlayersAction) return { imagePath: apiPlayersActionUrl, type: "playersAction"};

    // API 내 playersAction 에서 pid로 확인
    let apiPlayersActionPidUrl = `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/playersAction/p${pid}.png`;
    let apiPlayersActionPid = await axios.head(apiPlayersActionPidUrl).then(response => response.status === 200).catch(() => false);
    if(apiPlayersActionPid) return { imagePath: apiPlayersActionPidUrl, type: "playersAction"};

    // 게임 폴더 내 players 에서 spid로 확인
    let fcoDirPlayers = path.join(fcoImagePath, "players", `p${playerId}.png`);
    if(fs.existsSync(fcoDirPlayers)) return { imagePath: fcoDirPlayers, type: "players"};

    // 게임 폴더 내 players 에서 pid로 확인
    let fcoDirPlayersPid = path.join(fcoImagePath, "players", `p${pid}.png`);
    if(fs.existsSync(fcoDirPlayersPid)) return { imagePath: fcoDirPlayersPid, type: "players"};

    // API 내 players 에서 spid로 확인
    let apiPlayersUrl = `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/players/p${playerId}.png`;
    let apiPlayers = await axios.head(apiPlayersUrl).then(response => response.status === 200).catch(() => false);
    if(apiPlayers) return { imagePath: apiPlayersUrl, type: "players"};

    // API 내 players 에서 pid로 확인
    let apiPlayersPidUrl = `https://fco.dn.nexoncdn.co.kr/live/externalAssets/common/players/p${pid}.png`;
    let apiPlayersPid = await axios.head(apiPlayersPidUrl).then(response => response.status === 200).catch(() => false);
    if(apiPlayersPid) return { imagePath: apiPlayersPidUrl, type: "players"};

    // 기본 이미지 전송
    return { imagePath: "../asset/image/players/none.png", type: "players"};
});

// openImageFileDialog() - 이미지 파일 경로 다이얼로그
ipcMain.handle("open-image-file-dialog", () => {
    let imageFilePath = dialog.showOpenDialogSync({
        properties: ["openFile"],
        filters: [{ name: ".png", extensions: ["png"] }]
    });

    if(imageFilePath !== undefined) return imageFilePath[0];
    else return false;
});

// changeMiniface(fcoPath, imagePath, playerSpid, playerType)
ipcMain.handle("change-miniface",  (event, fcoPath, imagePath, playerSpid, playerType) => {
    let playerId = playerType === "players" ? Number(playerSpid.substr(3)) : playerSpid;

    fs.copyFile(imagePath, path.join(fcoPath, "_cache", "live", "externalAssets", "common", playerType, `p${playerId}.png`), (err) => {
        if(err !== null) return false;
        return true;
    });
});

// openWebpage(url) - 웹페이지 열기
ipcMain.handle("open-webpage", (event, url) => {
    shell.openExternal(url);
});

// getReport(reportMessage) - 버그 리포트 전송
ipcMain.handle("get-report", async (event, reportMessage) => {
    try {
        let result = await axios.post("http://221.163.172.198:15063/report", { reportMessage });
        return true;
    }
    catch (e) {
        return false;
    }
});