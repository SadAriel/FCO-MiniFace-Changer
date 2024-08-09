// src/asset/js/fcopath.js

// 전역 변수 선언
window.fcoPathCheck = false;

$(document).ready(() => {
    // 폴더 변경 버튼 클릭 시
    $("#fcoPathButton").on("click", () => changePath());
});

// changePath([path]) - FCO 폴더 경로 변경 - return null;
const changePath = (path) => {
    // 폴더 경로가 없을 시
    if(path === undefined) {
        window.electron.openFcoPathDialog().then((fcoPath) => {
            if(fcoPath !== false) {
                // FCO 폴더 경로 저장
                window.electron.setFcoPath(fcoPath);

                // FCO 폴더 경로 텍스트 변경
                $("#fcoPathText").html(fcoPath);

                // FCO 폴더 유효성 검사
                checkPath(fcoPath);

                // FCO 폴더 경로 전역변수에 저장
                window.fcoPath = fcoPath;

                // 미니페이스 변경 버튼 활성화 여부 확인
                checkChangeButton();
            }
        });
    }
    else {
        // FCO 폴더 경로 저장
        window.electron.setFcoPath(path);

        // FCO 폴더 경로 텍스트 변경
        $("#fcoPathText").html(path);

        // FCO 폴더 유효성 검사
        checkPath(path);

        // FCO 폴더 경로 전역변수에 저장
        window.fcoPath = path;
    }
};

// checkPath(path) - FCO 폴더 유효성 검사 - return null;
const checkPath = (path) => {
    window.electron.checkFcoPath(path).then((result) => {
        if(result) {
            // FCO 폴더 상태 변경
            $("#fcoPathStatus").html("FCO 폴더 확인 완료.");
            $("#fcoPathStatus").css("color", "#28A745");

            // FCO 폴더 상태 전역변수 변경
            window.fcoPathCheck = true;

            // FCO 폴더 변경 버튼 비활성화
            $("#fcoPathButton").attr("disabled", true);

            // 선수 검색 버튼 활성화
            $("#playerSearchButton").attr("disabled", false);
        }
        else {
            // FCO 폴더 상태 변경
            $("#fcoPathStatus").html("FCO 폴더 확인 실패.");
            $("#fcoPathStatus").css("color", "#DC3545");

            // 선수 검색 버튼 비활성화
            $("#playerSearchButton").attr("disabled", true);

            // FCO 폴더 상태 전역변수 변경
            window.fcoPathCheck = false;
        }
    });
};