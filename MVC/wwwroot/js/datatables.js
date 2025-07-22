var DataScreen;
(function (DataScreen) {
    class Table {
        constructor($ctx) {
            this.$context = $ctx;
            this.loadData();
        }
        loadData() {
            fetch("/Home/RetrieveCSV")
                .then(res => res.json())
                .then(data => this.renderTable(data))
                .catch(err => console.error("CSV Fetch Failed", err));
        }
        renderTable(data) {
            if (data.length == 0)
                return;
            const Mapping = {
                locales_Id: "Locales",
                pageFriendlyName: "Page Name",
                labelFriendlyName: "Label Name",
                text: "Text"
            };
            const columns = Object.keys(data[0]).map(key => ({
                title: Mapping[key] || key,
                data: key,
                name: key
            }));
            const table = this.$context.DataTable({
                data: data,
                columns: columns,
                dom: '<"top">t<"bottom"lip>'
            });
            const $input = $("#customsearchinput");
            const $select = $("#customsearchcolumn");
            $input.on("keyup", function () {
                const keyword = $input.val().toLowerCase();
                const column = $select.val();
                table.search('').columns().search('');
                if (column == "all") {
                    table.search(keyword).draw();
                }
                else {
                    const columnindex = table.column(`${column}:name`).index();
                    table.column(columnindex).search(keyword).draw();
                }
            });
            $select.on("change", function () {
                $input.trigger("keyup");
            });
        }
    }
    DataScreen.Table = Table;
    $(function () {
        new DataScreen.Table($("#myTable"));
    });
})(DataScreen || (DataScreen = {}));
//# sourceMappingURL=datatables.js.map