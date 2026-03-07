// =======================================
// REAL-TIME IN / OUT BADGE (India Time)
// =======================================

document.addEventListener("DOMContentLoaded", function () {

    // Convert to India Time (Asia/Kolkata)
    function getIndiaTime() {
        return new Date(
            new Date().toLocaleString("en-US", {
                timeZone: "Asia/Kolkata"
            })
        );
    }

    // Format time HH:MM
    function formatTime(date) {
        let h = date.getHours().toString().padStart(2, "0");
        let m = date.getMinutes().toString().padStart(2, "0");
        return `${h}:${m}`;
    }

    // Update all employee rows
    function updateStatus() {

        const now = getIndiaTime();
        const currentTime = formatTime(now);

        document.querySelectorAll(".employee-row").forEach(row => {

            const inTime = row.dataset.intime;
            const outTime = row.dataset.outtime;

            const badge = row.querySelector(".status-badge");
            const timeBox = row.querySelector(".live-time");

            // Show live current time
            if (timeBox) {
                timeBox.innerText = currentTime;
            }

            // Status logic
            if (inTime && !outTime) {
                badge.innerText = "IN";
                badge.className = "badge bg-success status-badge";
            }
            else if (inTime && outTime) {
                badge.innerText = "OUT";
                badge.className = "badge bg-danger status-badge";
            }
            else {
                badge.innerText = "ABSENT";
                badge.className = "badge bg-secondary status-badge";
            }

        });
    }

    // First run
    updateStatus();

    // Update every 30 seconds
    setInterval(updateStatus, 30000);

});
