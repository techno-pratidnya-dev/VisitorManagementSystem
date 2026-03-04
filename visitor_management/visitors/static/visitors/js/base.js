// ================= NAVBAR SCROLL EFFECT =================

document.addEventListener("DOMContentLoaded", function () {

    const navbar = document.querySelector(".main-navbar");

    function handleNavbarScroll() {
        if (!navbar) return;

        if (window.scrollY > 50) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    }

    window.addEventListener("scroll", handleNavbarScroll);
});



// ================= FADE-UP ANIMATION =================

window.addEventListener("load", function () {

    const fadeElements = document.querySelectorAll(".fade-up");

    fadeElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add("show");
        }, index * 200);  // stagger animation
    });

});



// ================= SMOOTH SCROLL =================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {
            target.scrollIntoView({
                behavior: "smooth"
            });
        }
    });
});



// ================= SCROLL TO TOP BUTTON =================

const scrollBtn = document.querySelector(".scroll-top");

window.addEventListener("scroll", function () {
    if (!scrollBtn) return;

    if (window.scrollY > 300) {
        scrollBtn.style.display = "block";
    } else {
        scrollBtn.style.display = "none";
    }
});

if (scrollBtn) {
    scrollBtn.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}
// ================= DARK MODE TOGGLE =================

const toggleBtn = document.getElementById("themeToggle");

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark-mode");
}

if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("theme", "dark");
            toggleBtn.innerHTML = '<i class="bi bi-sun-fill"></i>';
        } else {
            localStorage.setItem("theme", "light");
            toggleBtn.innerHTML = '<i class="bi bi-moon-fill"></i>';
        }
    });
}
window.addEventListener("scroll", function() {
  const navbar = document.querySelector(".navbar");
  navbar.classList.toggle("scrolled", window.scrollY > 50);
});
const fadeSections = document.querySelectorAll('.fade-section');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
});

fadeSections.forEach(section => {
  observer.observe(section);
});