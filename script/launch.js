let filterButtonActive = false;
let jsonData = [];

async function fetchData() {
  try {
    const response = await fetch("json/launch.json");
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

  data.forEach((item, index) => {
    const row = document.createElement("tr");
    row.appendChild(createCell(data.length - index)); // Reverse row number

    ["HUL Code", "HUL Outlet Name", "ME Name", "BEAT", "BasePack Code", "BasePack Desc", "Target (VMQ)", "Achv Qty", "Status"].forEach(key => {
      row.appendChild(createCell(item[key]));
    });

    tableBody.appendChild(row);
  });
}

function createCell(value) {
  const cell = document.createElement("td");
  cell.textContent = value === 0 ? "0" : value ?? "";
  return cell;
}

function applyFilters() {
  const meName = document.getElementById("filter-me-name").value;
  const beats = getMultiSelectValues("filter-beat");
  const basepacks = getMultiSelectValues("filter-basepack-desc");
  const search = document.getElementById("search-bar").value.toLowerCase();

  let filtered = jsonData.filter(row => {
    const matchME = !meName || row["ME Name"] === meName;
    const matchBeat = beats.length === 0 || beats.includes(row["BEAT"]);
    const matchBase = basepacks.length === 0 || basepacks.includes(row["BasePack Desc"]);
    const matchSearch =
      !search ||
      row["HUL Code"].toLowerCase().includes(search) ||
      row["HUL Outlet Name"].toLowerCase().includes(search);

    return matchME && matchBeat && matchBase && matchSearch;
  });

  if (filterButtonActive) {
    filtered = filtered.filter(row => row["Status"] === "Pending");
  }

  populateTable(filtered);
  updateDropdowns(jsonData);
}

function getMultiSelectValues(id) {
  const select = document.getElementById(id);
  return Array.from(select.selectedOptions).map(opt => opt.value);
}

function updateDropdowns(data) {
  populateDropdown("filter-me-name", getUniqueValues(data, "ME Name"), "ME Name");
  populateDropdown("filter-beat", getUniqueValues(data, "BEAT"));
  populateDropdown("filter-basepack-desc", getUniqueValues(data, "BasePack Desc"));
}

function getUniqueValues(data, key) {
  return [...new Set(data.map(item => item[key]).filter(Boolean))];
}

function populateDropdown(id, options, defaultText = null) {
  const select = document.getElementById(id);
  const current = Array.from(select.selectedOptions).map(o => o.value);
  select.innerHTML = "";

  if (!select.multiple && defaultText) {
    select.appendChild(new Option(defaultText, "", true));
  }

  options.forEach(opt => {
    const option = new Option(opt, opt);
    if (current.includes(opt)) option.selected = true;
    select.appendChild(option);
  });
}

// 🔘 Reset filters
document.getElementById("reset-button").addEventListener("click", () => {
  filterButtonActive = false;
  document.getElementById("filter-button-1").style.backgroundColor = "blue";
  document.getElementById("search-bar").value = "";

  document.getElementById("filter-me-name").selectedIndex = 0;

  ["filter-beat", "filter-basepack-desc"].forEach(id => {
    const select = document.getElementById(id);
    Array.from(select.options).forEach(option => option.selected = false);
  });

  applyFilters();
});

// 🧠 Event listeners
document.getElementById("search-bar").addEventListener("input", applyFilters);
document.getElementById("filter-me-name").addEventListener("change", applyFilters);
document.getElementById("filter-beat").addEventListener("change", applyFilters);
document.getElementById("filter-basepack-desc").addEventListener("change", applyFilters);

document.getElementById("filter-button-1").addEventListener("click", () => {
  filterButtonActive = !filterButtonActive;
  document.getElementById("filter-button-1").style.backgroundColor = filterButtonActive ? "green" : "blue";
  applyFilters();
});

function initialize() {
  populateTable(jsonData);
  updateDropdowns(jsonData);
}

fetchData();
