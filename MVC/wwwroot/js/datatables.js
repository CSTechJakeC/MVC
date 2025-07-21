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
            const columns = Object.keys(data[0]).map(key => ({
                title: key,
                data: key
            }));
            this.$context.DataTable({
                data: data,
                columns: columns
            });
        }
    }
    DataScreen.Table = Table;
})(DataScreen || (DataScreen = {}));
//# sourceMappingURL=datatables.js.map