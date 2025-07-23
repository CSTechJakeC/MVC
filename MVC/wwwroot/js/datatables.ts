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

            (columns as any[])  .push({
                title: "Actions",
                data: null,
                defaultContent: `
                <button class="btn btn-sm btn-outline-primary me-1"><i class="fas fa-download"></i></button>
                <button class="btn btn-sm btn-outline-secondary me-1"><i class="fab fa-twitter"></i></button>
                <button class="btn btn-sm btn-outline-dark"><i class="fas fa-eye"></i></button>`
            });



             const table = this.$context.DataTable({
                data: data,
                columns: columns,
                dom: '<"top">t<"bottom custom-footer"lpi>'
            });

            setTimeout(() => {
                const $goto = $(`
                <div class="goto-page-controls" style="display: flex; align-items: center; gap: 0.25rem; margin-left: 1rem;">
                    Go to page:
                    <input type="number" id="gotoPageInput" min="1" class="form-control form-control-sm d-inline-block" style="width: 60px;" />
                    <button id="gotoPageBtn" class="btn btn-outline-secondary btn-sm">Go</button>
                </div>
            `);

                $(".custom-footer .dataTables_paginate").css("margin-left", "auto").wrap('<div class="footer-right-group" style="display: flex; align-items: center; gap: 1rem; margin-left: auto;"></div>');
                $(".custom-footer .footer-right-group").append($goto);

            }, 0);


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

            $(document).on("click", "#gotoPageBtn", function () {
                const val = Number($("#gotoPageInput").val());
                const pageCount = table.page.info().pages;

                if (isNaN(val) || val < 1 || val > pageCount) {
                    alert(`Enter a valid page number between 1 and ${pageCount}`);
                    return;
                }

                table.page(val - 1).draw("page");
            });

            $(document).on("keydown", "#gotoPageInput", function (e) {
                if (e.key === "Enter") {
                    $("#gotoPageBtn").trigger("click");
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