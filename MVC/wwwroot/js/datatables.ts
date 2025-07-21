namespace DataScreen {
    export class Table {
        private $context: JQuery;

        constructor($ctx: JQuery) {
            this.$context = $ctx;
            this.loadData();
        }

        private loadData(): void {
            fetch("/Home/RetrieveCSV")  
                .then(res => res.json())
                .then(data => this.renderTable(data))
                .catch(err => console.error("CSV Fetch Failed", err));
        }


        private renderTable(data: any[]): void {
            if (data.length == 0) return;

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

    $(function () {
        new DataScreen.Table($("#myTable"));
    });
}