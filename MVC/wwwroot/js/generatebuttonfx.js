let isClicked = false;
$(() => {
    const $generateBtn = $("#GenerateButton");
    const $para = $("#para");
    const $authorlist = $("#authorList");
    $generateBtn.on("click", () => {
        if (!isClicked) {
            isClicked = true;
            $para.html("<p>List Generated!</p>");
            $authorlist.slideDown(2000, "linear");
        }
        else {
            $para.html("<p>It's already Generated! >:(");
        }
    });
    $generateBtn.on("mouseenter", () => {
        if (isClicked)
            return;
        $para.html("<p>Yes, Click it!</p>");
    });
    $generateBtn.on("mouseleave", () => {
        if (isClicked)
            return;
        $para.html("<p>No, Come back!</p>");
    });
});
//# sourceMappingURL=generatebuttonfx.js.map