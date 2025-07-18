$(document).ready(function () {
    $('#ProductsTable').DataTable({
        ajax: {
            url: '/Products/ReturnFullList', 
            dataSrc: '' 
        },
        columns: [
            { data: 'id' },
            { data: 'name' },
            { data: 'category' },
            { data: 'price' }
        ]
    });
});

$("#AvgBtn").on("click", function () {
    $.post("/Products/GenerateCategoryPriceReport", function (res) {
        alert(res.message);
    });
});

$("#Submitbtn").on("click", function () {
    const selectedCat = String($("#CategoryFilter").val());
    const selectedSort = String($("#SortFilter").val());
    const selectedOrder = String($("#OrderFilter").val());

    const baseUrl = "/Products/GetProductsByCategory";
    const query = new URLSearchParams();

    query.append("Category", selectedCat || "All"); 
    if (selectedSort) query.append("sortBy", selectedSort);
    if (selectedOrder) query.append("sortOrder", selectedOrder);

    const fullUrl = `${baseUrl}?${query.toString()}`;

    const table = $('#ProductsTable').DataTable();
    table
        .order([])                
        .ajax.url(fullUrl)
        .load();
});


$("#formsubmit").on("click", function () {

    const fileInput = document.getElementById("productFile") as HTMLInputElement;
    const file = fileInput.files?.[0];

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    $.ajax({
        url: "/Products/LoadCsv",
        type: "POST",
        data: formData,
        processData: false,
        contentType: false,
        success: function (res) {
            $("#uploadStatus").text(res.message + ` Total products: ${res.totalProducts}`);
        },
        error: function () {
            $("#uploadStatus").text("❌ Upload failed.");
        }
    });

})


