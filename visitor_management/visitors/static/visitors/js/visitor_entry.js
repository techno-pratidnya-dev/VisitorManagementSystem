document.addEventListener("DOMContentLoaded", function () {

    // ================= PHOTO SECTION =================

    const openCameraBtn = document.getElementById("openCamera");
    const uploadGalleryBtn = document.getElementById("uploadGallery");
    const photoInput = document.getElementById("photoInput");
    const video = document.getElementById("video");
    const captureBtn = document.getElementById("captureBtn");
    const photoPreview = document.getElementById("photoPreview");

    let stream = null;

    // Open Camera
    openCameraBtn.addEventListener("click", async function () {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true });
            video.srcObject = stream;
            video.classList.remove("d-none");
            captureBtn.classList.remove("d-none");
            photoPreview.classList.add("d-none");
        } catch (err) {
            alert("Camera access denied or not supported.");
        }
    });

    // Capture Photo
    captureBtn.addEventListener("click", function () {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0);

        canvas.toBlob(function (blob) {
            const file = new File([blob], "captured_photo.jpg", { type: "image/jpeg" });

            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            photoInput.files = dataTransfer.files;

            photoPreview.src = URL.createObjectURL(blob);
            photoPreview.classList.remove("d-none");
        });

        // Stop camera
        stream.getTracks().forEach(track => track.stop());
        video.classList.add("d-none");
        captureBtn.classList.add("d-none");
    });

    // Upload From Gallery
    uploadGalleryBtn.addEventListener("click", function () {
        photoInput.click();
    });

    photoInput.addEventListener("change", function () {
        if (photoInput.files.length > 0) {
            photoPreview.src = URL.createObjectURL(photoInput.files[0]);
            photoPreview.classList.remove("d-none");
        }
    });

    // ================= SIGNATURE SECTION =================
// ================= SIGNATURE SECTION =================

const canvas = document.getElementById("signaturePad");
const ctx = canvas.getContext("2d");
const clearBtn = document.getElementById("clearSign");
const signatureDataInput = document.getElementById("signatureData");

const digitalBtn = document.getElementById("digitalBtn");
const uploadBtn = document.getElementById("uploadBtn");
const digitalSection = document.getElementById("digitalSection");
const uploadSection = document.getElementById("uploadSection");
const signatureUploadInput = document.getElementById("signatureUploadInput");

let drawing = false;

// 🔥 IMPORTANT FIX → Canvas actual width set kar
function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = 150;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function getPosition(event) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (event.touches ? event.touches[0].clientX : event.clientX) - rect.left,
        y: (event.touches ? event.touches[0].clientY : event.clientY) - rect.top
    };
}

function startDrawing(e) {
    drawing = true;
    const pos = getPosition(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

function draw(e) {
    if (!drawing) return;
    e.preventDefault();
    const pos = getPosition(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.stroke();
}

function stopDrawing() {
    if (!drawing) return;
    drawing = false;
    signatureDataInput.value = canvas.toDataURL("image/png");
}

// Mouse events
canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", stopDrawing);
canvas.addEventListener("mouseleave", stopDrawing);

// Touch events (Mobile support)
canvas.addEventListener("touchstart", startDrawing);
canvas.addEventListener("touchmove", draw);
canvas.addEventListener("touchend", stopDrawing);

// Clear button
clearBtn.addEventListener("click", function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    signatureDataInput.value = "";
});

// Toggle buttons
digitalBtn.addEventListener("click", function () {
    digitalSection.classList.remove("d-none");
    uploadSection.classList.add("d-none");
    signatureUploadInput.value = "";
});

uploadBtn.addEventListener("click", function () {
    uploadSection.classList.remove("d-none");
    digitalSection.classList.add("d-none");
    signatureDataInput.value = "";
});

    // ================= FORM VALIDATION =================

    const form = document.querySelector("form");

    form.addEventListener("submit", function (e) {

        if (photoInput.files.length === 0) {
            alert("Visitor photo is required!");
            e.preventDefault();
            return;
        }

        if (!signatureDataInput.value && signatureUploadInput.files.length === 0) {
            alert("Signature is required (Digital or Upload)!");
            e.preventDefault();
            return;
        }
    });

});
