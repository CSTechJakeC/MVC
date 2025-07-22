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

            const Mapping: { [key: string]: string } = {
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
                const keyword = ($input.val() as string).toLowerCase();
                const column = $select.val();

                table.search('').columns().search('');

                if (column == "all") {
                    table.search(keyword).draw();
                } else {
                    const columnindex = table.column(`${column}:name`).index();
                    table.column(columnindex).search(keyword).draw();
                }
            });

            $select.on("change", function () {
                $input.trigger("keyup"); 
            });
        }

    }

    $(function () {
        new DataScreen.Table($("#myTable"));
    });
}