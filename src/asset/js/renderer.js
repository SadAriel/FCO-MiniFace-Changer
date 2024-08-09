// src/asset/js/renderer.js

$(document).ready(() => {
    // getVersion() - 버전 확인 및 버전 출력 - return string;
    window.electron.getVersion().then((version) => {
        $("#versionText").html(version);
    });

    // getTheme() - 기본 테마 확인 및 변경 - return string;
    window.electron.getTheme().then((theme) => {
        changeTheme(theme);
    });

    // getFcoPath() - 기본 FCO 폴더 경로 확인 및 출력 - return string;
    window.electron.getFcoPath().then((path) => {
        changePath(path);
    });

    // getPlayerList() - 선수 목록 불러오기 - return array;
    window.electron.getPlayerList().then((playerList) => {
        playerFirstLoading(playerList);
    });
});