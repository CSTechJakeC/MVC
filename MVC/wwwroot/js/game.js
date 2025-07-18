let index = 0;
function getRandomPosition() {
    const maxWidth = window.innerWidth - 100;
    const maxHeight = window.innerHeight - 50;
    const left = Math.floor(Math.random() * maxWidth);
    const top = Math.floor(Math.random() * maxHeight);
    return { top, left };
}
$("#gamebtn").on("mouseenter", () => {
    const { top, left } = getRandomPosition();
    $("#gamebtn").css({
        top: `${top}px`,
        left: `${left}px`
    });
    Changetext();
});
$("#gamebtn").on("mouseenter", () => {
    const { top, left } = getRandomPosition();
    $("#gamebtn").css({
        top: `${top}px`,
        left: `${left}px`
    });
    Changetext();
});
$("#gamebtn").on("click", () => {
    $("#title").text("Nice job");
});
function Changetext() {
    const $button = $("#gamebtn");
    index += 1;
    if (index == 1) {
        $button.text("You Can't Catch Me!");
    }
    if (index == 2) {
        $button.text("Nice Try");
    }
    if (index == 3) {
        $button.text("Nuh uh");
        index = 0;
    }
}
//# sourceMappingURL=game.js.map