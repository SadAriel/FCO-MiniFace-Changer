// src/asset/js/theme.js

$(document).ready(() => {
    // 테마 변경 버튼 클릭 시
    $("#themeButton").on("click", () => changeTheme());
});

// changeTheme([theme]) - 테마 변경 - return null;
const changeTheme = (theme = undefined) => {
    // 테마 변경 버튼 아이콘
    let themeIcon = {
        light: `<i class="fa-solid fa-moon"></i>`,
        dark: `<i class="fa-solid fa-sun"></i>`
    };

    // 반대 테마
    let themeOpp = {
        light: "dark",
        dark: "light"
    };

    // 반대 테마 변경
    if(theme === undefined)
        theme = themeOpp[$("html").attr("data-bs-theme")];

    // html 테마 변경
    $("html").attr("data-bs-theme", theme);

    // 버튼 테마 변경
    $(".btn-theme").removeClass(`btn-outline-${theme}`);
    $(".btn-theme").addClass(`btn-outline-${themeOpp[theme]}`);

    // 테마 변경 아이콘 변경
    $("#themeButton").html(themeIcon[themeOpp[theme]]);

    // 변경된 테마 저장
    window.electron.setTheme(theme);
}