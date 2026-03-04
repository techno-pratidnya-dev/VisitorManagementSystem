const inputs = document.querySelectorAll(".otp-box");
const finalOtp = document.getElementById("finalOtp");

// Auto focus next input
inputs.forEach((input, index) => {
    input.addEventListener("input", () => {
        if (input.value.length === 1 && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    });

    input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && input.value === "" && index > 0) {
            inputs[index - 1].focus();
        }
    });
});

// Combine OTP before submit
document.getElementById("otpForm").addEventListener("submit", function () {
    let otp = "";
    inputs.forEach(input => {
        otp += input.value;
    });
    finalOtp.value = otp;
});

// Countdown Timer
let timeLeft = 120;
const countdownElement = document.getElementById("countdown");

const timer = setInterval(() => {
    timeLeft--;
    countdownElement.textContent = timeLeft;

    if (timeLeft <= 0) {
        clearInterval(timer);
        countdownElement.textContent = "Expired";
    }
}, 1000);
// Resend 30 sec lock
let resendTime = 30;
const resendTimer = document.getElementById("resendTimer");
const resendLink = document.getElementById("resendLink");

if(resendLink){
    resendLink.style.pointerEvents = "none";
    const interval = setInterval(() => {
        resendTime--;
        resendTimer.textContent = resendTime;

        if(resendTime <= 0){
            clearInterval(interval);
            resendLink.style.pointerEvents = "auto";
            resendTimer.textContent = "0";
        }
    }, 1000);
}
