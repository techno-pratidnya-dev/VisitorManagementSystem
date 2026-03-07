// ===============================
// DIGITAL SIGNATURE PAD
// Desktop + Mobile Friendly
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    const canvas = document.getElementById("signaturePad");
    const hiddenInput = document.getElementById("signatureData");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let drawing = false;

    // ---------- Resize canvas for mobile ----------
    function resizeCanvas() {
        const ratio = Math.max(window.devicePixelRatio || 1, 1);
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * ratio;
        canvas.height = rect.height * ratio;

        ctx.scale(ratio, ratio);
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.strokeStyle = "#000";
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // ---------- Get position ----------
    function getPos(e) {
        const rect = canvas.getBoundingClientRect();

        if (e.touches) {
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top
            };
        } else {
            return {
                x: e.offsetX,
                y: e.offsetY
            };
        }
    }

    // ---------- Start drawing ----------
    function startDraw(e) {
        e.preventDefault();
        drawing = true;
        const pos = getPos(e);
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
    }

    // ---------- Draw ----------
    function draw(e) {
        if (!drawing) return;
        e.preventDefault();
        const pos = getPos(e);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
    }

    // ---------- Stop drawing ----------
    function stopDraw(e) {
        if (!drawing) return;
        drawing = false;
        ctx.closePath();

        // Save signature as Base64
        hiddenInput.value = canvas.toDataURL("image/png");
    }

    // ---------- Mouse events ----------
    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDraw);
    canvas.addEventListener("mouseleave", stopDraw);

    // ---------- Touch events (Mobile) ----------
    canvas.addEventListener("touchstart", startDraw, { passive: false });
    canvas.addEventListener("touchmove", draw, { passive: false });
    canvas.addEventListener("touchend", stopDraw);

    // ---------- Clear signature ----------
    const clearBtn = document.getElementById("clearSign");
    if (clearBtn) {
        clearBtn.addEventListener("click", function () {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            hiddenInput.value = "";
        });
    }

});
