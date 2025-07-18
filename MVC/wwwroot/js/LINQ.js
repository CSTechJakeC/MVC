$("#Linq").on("click", function () {
    $.ajax({
        url: "/LINQ/ModifyData",
        type: "POST",
        success: function (html) {
            $("#studentList").html(html);
        },
        error: function (xhr, status, error) {
            console.error("Error fetching students:", error);
        }
    });
});
//# sourceMappingURL=LINQ.js.map