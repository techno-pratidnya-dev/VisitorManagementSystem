<script>
const canvas = document.getElementById("signaturePad");
const ctx = canvas.getContext("2d");
const input = document.getElementById("signatureData");

let drawing = false;

// 🔥 SCALE FOR MOBILE
function resizeCanvas() {
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function startDraw(e) {
    drawing = true;
    ctx.beginPath();
    draw(e);
}

function draw(e) {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
}

function stopDraw() {
    drawing = false;
    input.value = canvas.toDataURL("image/png");
}

// 🖱️ Mouse
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDraw);
canvas.addEventListener("mouseleave", stopDraw);

// 📱 Touch
canvas.addEventListener("touchstart", startDraw);
canvas.addEventListener("touchmove", draw);
canvas.addEventListener("touchend", stopDraw);

function clearSignature() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    input.value = "";
}
</script>
