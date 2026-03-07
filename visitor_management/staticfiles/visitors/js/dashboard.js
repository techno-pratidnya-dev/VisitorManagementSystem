function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");

    let icon = document.getElementById("darkIcon");

    if (document.body.classList.contains("dark-mode")) {
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");
        localStorage.setItem("theme", "dark");
    } else {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");
        localStorage.setItem("theme", "light");
    }
}

// Load theme from storage
window.onload = function () {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
        document.getElementById("darkIcon").classList.remove("fa-moon");
        document.getElementById("darkIcon").classList.add("fa-sun");
    }
};
