


/* ================= AUTO DARK MODE (SYSTEM BASED) ================= */
(function () {
    const savedTheme = localStorage.getItem("visitor_theme");

    if (!savedTheme) {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if (prefersDark) {
            document.body.classList.add("dark-mode");
            localStorage.setItem("visitor_theme", "dark");
        }
    } else if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }
})();


/* ================= MAIN SCRIPT ================= */
document.addEventListener("DOMContentLoaded", () => {

    /* ---------- SEARCH + STATUS FILTER ---------- */
    const searchInput = document.getElementById("searchInput");
    const statusFilter = document.getElementById("statusFilter");
    const tableBody = document.querySelector("tbody");

    function filterTable() {
        if (!tableBody) return;

        const searchValue = searchInput ? searchInput.value.toLowerCase() : "";
        const statusValue = statusFilter ? statusFilter.value : "";
        const rows = tableBody.querySelectorAll("tr");

        rows.forEach(row => {
            const rowText = row.innerText.toLowerCase();
            const badge = row.querySelector(".badge");
            const rowStatus = badge ? badge.innerText.trim() : "";

            const matchSearch = rowText.includes(searchValue);
            const matchStatus = !statusValue || rowStatus === statusValue;

            row.style.display = (matchSearch && matchStatus) ? "" : "none";
        });
    }

    if (searchInput) {
        searchInput.addEventListener("keyup", filterTable);
    }

    if (statusFilter) {
        statusFilter.addEventListener("change", filterTable);
    }


    /* ---------- DARK MODE TOGGLE ---------- */
    const themeToggle = document.getElementById("themeToggle");

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark-mode");

            localStorage.setItem(
                "visitor_theme",
                document.body.classList.contains("dark-mode") ? "dark" : "light"
            );
        });
    }


    /* ---------- ACCENT COLOR PICKER ---------- */
    const accentPicker = document.getElementById("accentPicker");

    if (accentPicker) {
        const savedColor = localStorage.getItem("accent_color");

        if (savedColor) {
            document.documentElement.style.setProperty("--accent-color", savedColor);
            accentPicker.value = savedColor;
        }

        accentPicker.addEventListener("input", (e) => {
            const color = e.target.value;
            document.documentElement.style.setProperty("--accent-color", color);
            localStorage.setItem("accent_color", color);
        });
    }

});
