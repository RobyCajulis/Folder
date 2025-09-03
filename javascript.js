// Theme toggle with persistence
const themeToggle = document.getElementById("theme-toggle");
const themeIcon   = document.getElementById("theme-icon");

// Apply saved theme on load
const saved = localStorage.getItem("theme");
if (saved === "dark") {
  document.body.classList.add("dark-theme");
  themeIcon.classList.replace("bx-moon", "bx-sun");
}

// Toggle on click
themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark-theme");
  if (isDark) {
    themeIcon.classList.replace("bx-moon", "bx-sun");
    localStorage.setItem("theme", "dark");
  } else {
    themeIcon.classList.replace("bx-sun", "bx-moon");
    localStorage.setItem("theme", "light");
  }
});


/*
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".navbar a");

window.addEventListener("scroll", () => {
  let current = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 80; // offset for header height
    const sectionHeight = section.offsetHeight;

    if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").includes(current)) {
      link.classList.add("active");
    }
  });
});
*/