// src/asset/js/index.js

$(document).ready(() => {
    // 정보 버튼 클릭 시
    $("#aboutButton").on("click", () => {
        Swal.fire({
            title: "정보",
            html: `
                <p class="font font-16 mb-0">개발자 정보</p>
                <p class="font font-12 mb-0 mt-1">SadAriel3 (<a id="openGithub" onclick="window.electron.openWebpage('https://github.com/SadAriel')"><i class="fa-brands fa-github"></i> Github</a>)</p>
                <p class="font font-12 mb-0 mt-3">Data based on NEXON Open API</p>
            `
        })
    });

    // 버그 리포트 버튼 클릭 시
    $("#reportButton").on("click", () => {
        return Swal.fire({
            title: "버그 리포트",
            input: "textarea",
            showCloseButton: true,
            confirmButtonText: "리포트"
        }).then((result) => {
            if(result.isConfirmed) {
                window.electron.getReport(result.value).then((result) => {
                    if(result) {
                        return Swal.fire({
                            title: "버그 리포트 성공",
                            html: "버그 리포트가 성공적으로 완료됬습니다.</br>감사합니다.",
                            icon: "success"
                        });
                    } 
                    else {
                        return Swal.fire({
                            title: "버그 리포트 실패",
                            text: "버그 리포트에 실패했습니다.",
                            icon: "error"
                        });
                    }
                });
            }
        });
    });
});