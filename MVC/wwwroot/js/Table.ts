$(() => {
    const $tableWrapper = $("#tableWrapper");

    const table = $("#DataTable").DataTable({
        data: [],
        columns: [
            { data: "id" },
            { data: "name" },
            { data: "age" }
        ]
    });

    $tableWrapper.hide();

    fetch("/Home/LoadCsv")
        .then(res => {
            if (!res.ok) throw new Error("Failed to load CSV");
            return res.json();
        })
        .then((records) => {
            table.rows.add(records).draw();
        })
        .catch(err => {
            console.error("CSV load failed:", err);
        });

    $("#tablebtn").on("click", () => {
        $tableWrapper.slideDown(500, "swing");
    });

    $("#tableform").on("submit", (e) => {
        e.preventDefault();
        $tableWrapper.slideUp(100, "swing");

        const name = $("#fname").val()?.toString().trim();
        const age = Number($("#fage").val());

        if (!name || isNaN(age)) return;

        const data = table.rows().data();
        let maxId = 0;

        for (let i = 0; i < data.length; i++) {
            if (data[i].Id > maxId) {
                maxId = data[i].Id;
            }
        }

        table.row.add({
            Id: maxId + 1,
            Name: name,
            Age: age
        }).draw();

        $tableWrapper.slideDown(500, "swing");
    });

    $("#exportbtn").on("click", () => {
        const data = table.rows().data().toArray();

        let csv = "Id,Name,Age\n";

        data.forEach(row => {
            csv += `${row.Id},${row.Name},${row.Age}\n`;
        });

        fetch("/Home/SaveCsv", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(csv)
        })
            .then(res => res.json())
            .then(data => {
                alert(`CSV saved! View it at ${data.path}`);
            })
            .catch(err => {
                console.error("Error saving CSV:", err);
            });
    });
});
