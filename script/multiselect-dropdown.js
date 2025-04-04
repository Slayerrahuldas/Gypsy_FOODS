document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("select[multiple]").forEach(makeMultiSelect);
});

function makeMultiSelect(select) {
    const wrapper = document.createElement("div");
    wrapper.className = "multiselect-wrapper";
    select.style.display = "none";
    select.parentNode.insertBefore(wrapper, select);
    wrapper.appendChild(select);

    const display = document.createElement("div");
    display.className = "multiselect-display";
    display.textContent = "Select options";
    wrapper.appendChild(display);

    const dropdown = document.createElement("div");
    dropdown.className = "multiselect-dropdown";
    wrapper.appendChild(dropdown);

    // Create checkboxes for each option
    Array.from(select.options).forEach(option => {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.value = option.value;
        checkbox.checked = option.selected;

        checkbox.addEventListener("change", () => {
            option.selected = checkbox.checked;
            updateDisplay();
            select.dispatchEvent(new Event("change")); // for external listeners
        });

        label.appendChild(checkbox);
        label.append(` ${option.text}`);
        dropdown.appendChild(label);
    });

    function updateDisplay() {
        const selected = Array.from(select.selectedOptions).map(opt => opt.text);
        display.textContent = selected.length ? selected.join(", ") : "Select options";
    }

    updateDisplay();

    display.addEventListener("click", () => {
        dropdown.classList.toggle("show");
    });

    document.addEventListener("click", (e) => {
        if (!wrapper.contains(e.target)) {
            dropdown.classList.remove("show");
        }
    });
}