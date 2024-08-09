// src/asset/js/player.js

$(document).ready(() => {
    // 선수 검색 버튼 클릭 시
    $("#playerSearchButton").on("click", () => {
        // 변수 선언
        let inputText = $("#playerSearchInput").val();

        // 선수 검색 입력 값 확인
        if(inputText === "") {
            return Swal.fire({
                title: "선수 검색 실패",
                text: "선수 이름을 입력해주세요.",
                icon: "error"
            });
        }

        // 선수 검색 결과 저장
        let searchList = window.playerList.filter((element) => {
            // 검색 결과가 있는 경우
            if(element.name.indexOf(inputText) !== -1) return element;
        });

        // 선수 검색 결과가 없는 경우
        if(searchList.length === 0) {
            return Swal.fire({
                title: "선수 검색 실패",
                text: "검색하신 선수를 찾을 수 없습니다.",
                icon: "error"
            });
        }

        // 검색 선수 목록 초기화 및 추가
        setPlayer(searchList);
    });

    // 선수 검색 입력 엔터 클릭 시
    $("#playerSearchInput").on("keyup", (e) => {
        if(e.keyCode === 13) $("#playerSearchButton").click();
    });

    // 선수 목록 클릭 시
    $(document).on("click", ".player-list-item", function () {
        // 변수 선언
        let playerId = $(this).attr("data-playerid");

        // 선수 목록 아이템 active 제거
        $(".player-list-item.active").removeClass("active");

        // 클릭 한 선수 아이템 active 추가
        $(this).addClass("active");

        // 클릭 한 선수 이미지 요청
        window.electron.getPlayerImage(window.fcoPath, playerId).then((result) => {
            // 변경 전 미니페이스 이미지 변경
            $("#playerMinifaceBefore").attr("src", result.imagePath);

            // 변경 전 선수 이름 변경 및 시즌 이미지 변경
            $("#playerDataBefore").html($(this).html());

            // 클릭 한 선수 데이터 전역변수 저장
            window.activePlayerData = {
                playerId, type: result.type
            };
        });

        // 미니페이스 변경 버튼 활성화 여부 확인
        checkChangeButton();
    });
});

// setPlayer(playerList) - 선수 목록 초기화 및 추가 - return null;
const setPlayer = (playerList) => {
    // 선수 목록 초기화
    $("#playerList").empty();

    // 선수 목록 추가
    playerList.map((element) => {
        let seasonId = String(element.id).substr(0, 3);
        
        $("#playerList").append(`
            <li class="font font-12 list-group-item list-group-item-action player-list-item" data-playerid="${element.id}"><img src="../asset/image/seasonIcon/${seasonId}.png" width="15"> ${element.name}</li>
        `);
    });
};

// playerFirstLoading(playerList) - 선수 목록 로딩 - return null;
const playerFirstLoading = (playerList) => {
    // 전역 변수 선수 목록 저장
    window.playerList = playerList;

    // 선수 목록 로딩 제거
    $("#playerItemLoading").remove();

    // 선수 목록 검색 추가
    $("#playerList").append(`
        <li class="font font-12 list-group-item disabled" id="playerItemSearch"><i class="fa-regular fa-user"></i> 선수를 검색 해주세요.</li>
    `);

    // 선수 검색 버튼 활성화
    $("#playerSearchButton").attr("disabled", false);
}