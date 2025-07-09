let jsonData = [];

async function fetchData() {
    try {
        const response = await fetch("json/sales.json");
        if (!response.ok) throw new Error("Failed to fetch data.");
        jsonData = await response.json();
        initialize();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function populateTable(data) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";

    const totalColumns = ["LYRR", "JQRR", "L3M", "MTD"];
    let totals = { "LYRR": 0, "JQRR": 0, "L3M": 0, "MTD": 0 };

    const selectedMeName = document.getElementById("filter-me-name").value || "ALL ME";
    const selectedDay = document.getElementById("filter-day").value || "ALL Days";

    data.forEach(item => {
        totalColumns.forEach(key => {
            totals[key] += parseFloat(item[key]) || 0;
        });
    });

    const totalRow = document.createElement("tr");
    totalRow.style.fontWeight = "bold";
    totalRow.style.backgroundColor = "#f2f2f2";

    const indexCell = document.createElement("td");
    indexCell.textContent = "Total";
    totalRow.appendChild(indexCell);

    const codeCell = document.createElement("td");
    codeCell.textContent = "-";
    totalRow.appendChild(codeCell);

    const outletCell = document.createElement("td");
    outletCell.textContent = "-";
    totalRow.appendChild(outletCell);

    const meNameCell = document.createElement("td");
    meNameCell.textContent = selectedMeName;
    totalRow.appendChild(meNameCell);

    const dayCell = document.createElement("td");
    dayCell.textContent = selectedDay;
    totalRow.appendChild(dayCell);

    const plgCell = document.createElement("td");
    plgCell.textContent = "FOODS";
    totalRow.appendChild(plgCell);

    totalColumns.forEach(key => {
        const totalCell = document.createElement("td");
        totalCell.textContent = totals[key];
        totalRow.appendChild(totalCell);
    });

    tableBody.appendChild(totalRow);

    const totalRows = data.length;
    data.forEach((item, index) => {
        const row = document.createElement("tr");

        const cellIndex = document.createElement("td");
        cellIndex.textContent = totalRows - index;
        row.appendChild(cellIndex);

        ["HUL Code", "HUL Outlet Name", "ME Name", "Day", "PLG", "LYRR", "JQRR", "L3M", "MTD"].forEach(key => {
            const cell = document.createElement("td");
            cell.textContent = item[key] || "-";
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });
}

function applyFilters() {
    let filteredData = [...jsonData];

    const filterMeName = document.getElementById("filter-me-name").value;
    const filterDay = document.getElementById("filter-day").value;
    const searchQuery = document.getElementById("search-bar").value.toLowerCase();

    if (filterMeName) {
        filteredData = filteredData.filter(row => row["ME Name"] === filterMeName);
    }
    if (filterDay) {
        filteredData = filteredData.filter(row => row["Day"] === filterDay);
    }
    if (searchQuery) {
        filteredData = filteredData.filter(row =>
            row["HUL Code"].toLowerCase().includes(searchQuery) ||
            row["HUL Outlet Name"].toLowerCase().includes(searchQuery)
        );
    }

    populateTable(filteredData);
    updateDropdowns(filteredData);
}

function updateDropdowns(filteredData) {
    const meNames = new Set(), days = new Set();

    filteredData.forEach(row => {
        if (row["ME Name"]) meNames.add(row["ME Name"]);
        if (row["Day"]) days.add(row["Day"]);
    });

    populateSelectDropdown("filter-me-name", meNames, "ME Name");
    populateSelectDropdown("filter-day", days, "Day");
}

function populateSelectDropdown(id, optionsSet, columnName) {
    const dropdown = document.getElementById(id);
    const selectedValue = dropdown.value;
    dropdown.innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.textContent = columnName;
    defaultOption.value = "";
    dropdown.appendChild(defaultOption);

    optionsSet.forEach(option => {
        const optionElement = document.createElement("option");
        optionElement.textContent = option;
        optionElement.value = option;
        if (option === selectedValue) optionElement.selected = true;
        dropdown.appendChild(optionElement);
    });
}

document.getElementById("reset-button").addEventListener("click", () => {
    document.getElementById("search-bar").value = "";
    document.getElementById("filter-me-name").selectedIndex = 0;
    document.getElementById("filter-day").selectedIndex = 0;
    applyFilters();
});

document.getElementById("search-bar").addEventListener("input", applyFilters);
document.getElementById("filter-me-name").addEventListener("change", applyFilters);
document.getElementById("filter-day").addEventListener("change", applyFilters);

function initialize() {
    populateTable(jsonData);
    applyFilters();
}

fetchData();
