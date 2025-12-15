// ---------------- Theme Toggle ----------------
document.addEventListener("DOMContentLoaded", () => {

  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.body.classList.add("dark-theme");
    themeIcon.classList.replace("bx-moon", "bx-sun");
  }

  themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-theme");
    themeIcon.classList.toggle("bx-sun", isDark);
    themeIcon.classList.toggle("bx-moon", !isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  });

  // ---------------- SECRET ADMIN ACCESS ----------------
  let logoClicks = 0;
  let logoTimer;
  const adminLogo = document.getElementById("admin-logo");

  if (adminLogo) {
    adminLogo.style.cursor = "pointer";

    adminLogo.addEventListener("click", () => {
      logoClicks++;
      clearTimeout(logoTimer);

      logoTimer = setTimeout(() => {
        logoClicks = 0;
      }, 1000);

      if (logoClicks === 3) {
        window.location.href = "admin-login.html";
      }
    });
  }

  // ---------------- Projects ----------------
  loadProjects();
  loadTasks();
});

// ---------------- Projects ----------------
async function loadProjects() {
  try {
    const container = document.getElementById("projects-container");
    const res = await fetch("/api/projects");
    const projects = await res.json();

    container.innerHTML = "";
    projects.forEach(p => {
      container.innerHTML += `
        <div class="box">
          <div class="box-img">
            <img src="${p.img}" alt="${p.title}">
          </div>
          <h2>${p.title}</h2>
          <h3>${p.desc || ""}</h3>
        </div>
      `;
    });
  } catch (err) {
    console.error("Projects error:", err);
  }
}

// ---------------- To-Do ----------------
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");

async function loadTasks() {
  try {
    const res = await fetch("/api/tasks");
    const tasks = await res.json();
    renderTasks(tasks);
  } catch (err) {
    console.error("Tasks error:", err);
  }
}

function renderTasks(tasks) {
  taskList.innerHTML = "";
  tasks.forEach(task => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="${task.completed ? "completed" : ""}">${task.title}</span>
      <button onclick="toggleTask(${task.id})">Toggle</button>
      <button onclick="deleteTask(${task.id})">Delete</button>
    `;
    taskList.appendChild(li);
  });
}

addTaskBtn.addEventListener("click", async () => {
  if (!taskInput.value.trim()) return;

  await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: taskInput.value })
  });

  taskInput.value = "";
  loadTasks();
});

async function toggleTask(id) {
  await fetch(`/api/tasks/${id}`, { method: "PUT" });
  loadTasks();
}

async function deleteTask(id) {
  await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  loadTasks();
}

// ---------------- News ----------------
const newsBtn = document.getElementById("get-news-btn");
const newsInput = document.getElementById("news-input");
const newsDisplay = document.getElementById("news-display");
const API_KEY = "58216d58a8794008a18f1c9be7697b38";

newsBtn.addEventListener("click", async () => {
  const topic = newsInput.value || "technology";

  try {
    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?q=${topic}&apiKey=${API_KEY}`
    );
    const data = await res.json();
    displayNews(data.articles);
  } catch (err) {
    newsDisplay.innerHTML = "<p>Failed to load news.</p>";
  }
});

function displayNews(articles = []) {
  newsDisplay.innerHTML = "";

  if (!articles.length) {
    newsDisplay.innerHTML = "<p>No news found.</p>";
    return;
  }

  articles.slice(0, 10).forEach(a => {
    newsDisplay.innerHTML += `
      <div class="news-article">
        <h3>${a.title}</h3>
        <p>${a.description || "No description available."}</p>
        <a href="${a.url}" target="_blank">Read more</a>
      </div>
    `;
  });
}

// ---------------- Contact (FIXED) ----------------
const sendBtn = document.getElementById("send-message-btn");
const feedback = document.getElementById("contact-feedback");

sendBtn.addEventListener("click", async () => {
  const name = document.getElementById("contact-name").value.trim();
  const email = document.getElementById("contact-email").value.trim();
  const message = document.getElementById("contact-message").value.trim();

  if (!name || !email || !message) {
    feedback.textContent = "Please fill in all fields.";
    feedback.style.color = "red";
    return;
  }

  try {
    await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message })
    });

    feedback.textContent = "Message sent successfully!";
    feedback.style.color = "green";

    document.getElementById("contact-name").value = "";
    document.getElementById("contact-email").value = "";
    document.getElementById("contact-message").value = "";
  } catch (err) {
    feedback.textContent = "Failed to send message.";
    feedback.style.color = "red";
  }
});
