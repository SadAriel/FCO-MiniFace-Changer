// src/asset/js/miniface.js

$(document).ready(() => {
    // 이미지 파일 불러오기 버튼 클릭 시
    $("#loadImageFile").on("click", () => {
        window.electron.openImageFileDialog().then((imagePath) => {
            if(imagePath !== false) {
                // 변경 후 미니페이스 이미지 변경
                $("#playerMinifaceAfter").attr("src", imagePath);

                // 변경 후 미니페이스 이름 변경
                $("#playerDataAfter").html(imagePath);

                // 변경 후 미니페이스 정보 전역변수 저장
                window.afterMiniface = imagePath;

                // 미니페이스 변경 버튼 활성화 여부 확인
                checkChangeButton();
            }
        });
    });

    // 미니페이스 변경 버튼 클릭 시
    $("#changeImageFile").on("click", () => {
        // 미니페이스 변경 요청
        window.electron.changeMiniface(window.fcoPath, window.afterMiniface, window.activePlayerData.playerId, window.activePlayerData.type).then((result) => {
            if(result === false) {
                return Swal.fire({
                    title: "미니페이스 변경 실패",
                    text: "미니페이스 변경에 실패 했습니다.",
                    icon: "error"
                });
            }

            return Swal.fire({
                title: "미니페이스 변경 완료",
                text: "미니페이스 변경을 완료했습니다.",
                icon: "success"
            }).then(() => location.reload(true));
        });
    });
});

// checkChangeButton() - 미니페이스 변경 버튼 활성화 여부 확인 - return null;
const checkChangeButton = () => {
    // FCO 폴더 확인 완료 확인
    if(window.fcoPath !== undefined) {
        // 선수 목록 클릭 확인
        if(window.activePlayerData !== undefined) {
            // 변경 후 미니페이스 이미지 확인
            if(window.afterMiniface !== undefined) {
                // 미니페이스 변경 버튼 활성화
                $("#changeImageFile").attr("disabled", false);
            }
        }
    }
};