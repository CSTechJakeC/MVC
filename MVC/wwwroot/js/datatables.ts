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
            if (data.length === 0) return;

            const columns = [
                { title: "Locales", data: "locales_Id", name: "locales_Id" },
                { title: "Page Name", data: "pageFriendlyName", name: "pageFriendlyName" },
                { title: "Label Name", data: "labelFriendlyName", name: "labelFriendlyName" },
                { title: "Text", data: "text", name: "text" },
            ];
            this.pushActionsColumn(columns);
            const table = this.setTable(data, columns);
            this.setNavRow();
            this.recordEventListeners();

            const $input = $("#customSearchInput");
            const $select = $("#customSearchColumn");

            $input.on("keyup", function () {
                const keyword = ($input.val() as string).toLowerCase();
                const column = $select.val();

                table.search('').columns().search('');

                if (column === "all") {
                    table.search(keyword).draw();
                } else {
                    const columnIndex = table.column(`${column}:name`).index();
                    table.column(columnIndex).search(keyword).draw();
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
            console.log("Row received by DataTable:", data[0]);
            console.log("Object.keys(data[0]):", Object.keys(data[0]));


        }

        private mapColumnNames(data: any[]) {
            const mapping: { [key: string]: string } = {
                locales_Id: "Locales",
                pageFriendlyName: "Page Name",
                labelFriendlyName: "Label Name",
                text: "Text"
            };

            return Object.keys(data[0]).map(key => ({
                title: mapping[key] || key,
                data: key,
                name: key
            }));
        }

        private pushActionsColumn(columns: any[]) {
            columns.push({
                title: "Actions",
                data: null,
                sortable: false,
                orderable: false,
                defaultContent: `
                    <div class="action-buttons">
                        <button class="btn btn-sm btn-outline-primary"><i class="fa-solid fa-download"></i></button>
                        <button class="btn btn-sm btn-outline-secondary"><i class="fa-brands fa-twitter"></i></button>
                        <button class="btn btn-sm btn-outline-dark"><i class="fa-solid fa-eye"></i></button>
                    </div>`
            });
        }

        private setTable(data: any[], columns: any[]) {
            return this.$context.DataTable({
                data: data,
                columns: columns,
                dom: '<"top">t<"bottom custom-footer"lpi>'
            });
        }

        private setNavRow() {
            setTimeout(() => {
                const $goto = $(`
                    <div class="goto-page-controls" style="display: inline-flex; align-items: center; gap: 0.25rem;">
                        Go to page:
                        <input type="number" id="gotoPageInput" min="1"
                            class="form-control form-control-sm d-inline-block"
                            style="width: 60px;" />
                        <button id="gotoPageBtn" class="btn btn-outline-secondary btn-sm">Go</button>
                    </div>
                `);

                const $pag = $(".custom-footer .dataTables_paginate").detach();
                const $len = $(".custom-footer .dataTables_length").detach();

                const $navRow = $('<div class="footer-nav-row"></div>').css({
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    marginTop: '0.5rem'
                });

                $navRow.append($('<div></div>').css('flex', '1'));
                $navRow.append($len.css({ margin: 0 }));
                $navRow.append($pag.css({ margin: '0 auto' }));
                $navRow.append(
                    $('<div></div>').css({
                        flex: '1',
                        display: 'flex',
                        justifyContent: 'flex-end'
                    }).append($goto)
                );

                $(".custom-footer .dataTables_info").before($navRow);
            }, 0);
        }
        
        private recordEventListeners() {
            const $form = $("#addRecordForm");

            const $button = $("#createRecordButton");
            $button.on("click", () => {
                ($(`#addRecordModal`) as any).modal("show");
            });

            const $Save = $("#saveNewRecord");
            $Save.on("click", () => {
                this.addNewRecord($form);
            });

            const $Cancel = $("#cancelNewRecord");
            $Cancel.on("click", () => this.closeModal($form));
            
            const $Close = $("#closeRecordModal");
            $Close.on("click", () => this.closeModal($form));
        }

        private closeModal($form: any) {
            ($("#addRecordModal") as any).modal("hide");
            ($form[0] as HTMLFormElement).reset();
        }

        private addNewRecord($form: any) {
            const formdata = {
                locales_Id: parseInt($("#addLocales").val() as string),
                pageFriendlyName: $("#addPageName").val(),
                labelFriendlyName: $("#addLabelName").val(),
                text: $("#addText").val()
            };

            $.ajax({
                url: "/Home/addNewRecord",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify(formdata),
                success: (response) => {
                    if (response.success) {
                        alert("Record Saved");
                        this.closeModal($form);
                        location.reload();
                    } else {
                        alert("Record Save Failed " + response.message);
                    }
                },
                error: (xhr, status, error) => {
                    alert("AJAX error: " + error);
                    console.error("AJAX error:", xhr.responseText);
                }
            });
        }
    }

    $(function () {
        if (!$("#myTable").hasClass("datatable-initialized")) {
            $("#myTable").addClass("datatable-initialized");
            new DataScreen.Table($("#myTable"));
        }
    });
}
