let jsonData = [];

// Fetch and initialize data
async function fetchData() {
    try {
        const response = await fetch("json/channel.json");
        if (!response.ok) throw new Error("Failed to fetch data.");
        jsonData = await response.json();
        initialize();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Populate the table with data
function populateTable(data) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";

    data.forEach((item, index) => {
        const row = document.createElement("tr");

        const serialCell = document.createElement("td");
        serialCell.textContent = data.length - index;
        row.appendChild(serialCell);

        const columns = [
            "HUL Code",
            "HUL Outlet Name",
            "TGT",
            "ACH",
            "BTD",
            "Beat"
        ];

        columns.forEach((key) => {
            const cell = document.createElement("td");
            cell.textContent = item[key] !== undefined ? item[key] : "";
            row.appendChild(cell);
        });

        tableBody.appendChild(row);
    });
}

// Apply all filters and update the table and dropdowns
function applyFilters() {
    const searchValue = document.getElementById("search-bar").value.toLowerCase();
    const meName = document.getElementById("filter-me-name").value;
    const day = document.getElementById("filter-day").value;

    const filteredData = jsonData.filter((row) => {
        const matchesSearch =
            searchValue === "" ||
            (row["HUL Code"] && row["HUL Code"].toLowerCase().includes(searchValue)) ||
            (row["HUL Outlet Name"] && row["HUL Outlet Name"].toLowerCase().includes(searchValue));

        const matchesFilters =
            (!meName || row["ME Name"] === meName) &&
            (!day || row["Day"] === day);

        return matchesSearch && matchesFilters;
    });

    populateTable(filteredData);
    updateDropdowns(filteredData);
}

// Update dropdowns based on filtered data
function updateDropdowns(data) {
    const sets = {
        "filter-me-name": new Set(),
        "filter-day": new Set()
    };

    data.forEach((row) => {
        if (row["ME Name"]) sets["filter-me-name"].add(row["ME Name"]);
        if (row["Day"]) sets["filter-day"].add(row["Day"]);
    });

    for (const [id, values] of Object.entries(sets)) {
        populateDropdown(id, values, document.getElementById(id).options[0]?.text || id);
    }
}

// Populate individual dropdown
function populateDropdown(id, optionsSet, defaultText) {
    const dropdown = document.getElementById(id);
    const selectedValue = dropdown.value;
    dropdown.innerHTML = `<option value="">${defaultText}</option>`;

    Array.from(optionsSet)
        .sort()
        .forEach((option) => {
            const selected = option === selectedValue ? "selected" : "";
            dropdown.innerHTML += `<option value="${option}" ${selected}>${option}</option>`;
        });
}

// Reset filters
function resetFilters() {
    document.getElementById("search-bar").value = "";
    document.querySelectorAll("select").forEach((dropdown) => {
        dropdown.value = "";
    });
    applyFilters();
}

// Debounce function to optimize search
function debounce(func, delay = 300) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), delay);
    };
}

// Initialize page interactions
function initialize() {
    document.getElementById("search-bar").addEventListener("input", debounce(applyFilters));
    document.querySelectorAll("select").forEach((dropdown) => {
        dropdown.addEventListener("change", applyFilters);
    });
    document.getElementById("reset-button").addEventListener("click", resetFilters);

    updateDropdowns(jsonData);
    applyFilters();
}

// Kickstart everything
fetchData();
