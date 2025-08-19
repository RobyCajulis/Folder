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
