// ---------------- Theme Toggle ----------------
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

const saved = localStorage.getItem("theme");
if (saved === "dark") {
  document.body.classList.add("dark-theme");
  themeIcon.classList.replace("bx-moon", "bx-sun");
}

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

// ---------------- Projects Section ----------------
async function loadProjects() {
  const container = document.getElementById("projects-container");
  const res = await fetch("/api/projects");
  const projects = await res.json();
  container.innerHTML = "";
  projects.forEach(p => {
    container.innerHTML += `
      <div class="box">
        <div class="box-img"><img src="${p.img}" alt="${p.title}"></div>
        <h2>${p.title}</h2>
        <h3>${p.desc || ''}</h3>
        <span>Dynamic Project</span>
      </div>
    `;
  });
}
document.addEventListener("DOMContentLoaded", loadProjects);

// ---------------- To-Do List ----------------
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

document.addEventListener('DOMContentLoaded', loadTasks);

async function loadTasks() {
  try {
    const res = await fetch('/api/tasks');
    const tasks = await res.json();
    renderTasks(tasks);
  } catch (err) { console.error(err); }
}

function renderTasks(tasks) {
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="${task.completed ? 'completed' : ''}">${task.title}</span>
      <button onclick="toggleTask(${task.id})">Toggle</button>
      <button onclick="deleteTask(${task.id})">Delete</button>
    `;
    taskList.appendChild(li);
  });
}

addTaskBtn.addEventListener('click', async () => {
  const title = taskInput.value.trim();
  if (!title) return;
  await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title })
  });
  taskInput.value = '';
  loadTasks();
});

async function toggleTask(id) {
  await fetch(`/api/tasks/${id}`, { method: 'PUT' });
  loadTasks();
}

async function deleteTask(id) {
  await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
  loadTasks();
}

// ---------------- News API ----------------
const newsBtn = document.getElementById('get-news-btn');
const newsInput = document.getElementById('news-input');
const newsDisplay = document.getElementById('news-display');
const API_KEY = '58216d58a8794008a18f1c9be7697b38';

newsBtn.addEventListener('click', async () => {
  const topic = newsInput.value.trim() || 'technology';
  try {
    const response = await fetch(`https://newsapi.org/v2/top-headlines?q=${topic}&apiKey=${API_KEY}`);
    if (!response.ok) throw new Error('Failed to fetch news');
    const data = await response.json();
    displayNews(data.articles);
  } catch (error) {
    newsDisplay.innerHTML = `<p>Error: ${error.message}</p>`;
  }
});

function displayNews(articles) {
  newsDisplay.innerHTML = '';
  if (!articles.length) {
    newsDisplay.innerHTML = '<p>No articles found for this topic.</p>';
    return;
  }
  articles.slice(0,10).forEach(article => {
    const articleDiv = document.createElement('div');
    articleDiv.className = 'news-article';
    articleDiv.innerHTML = `
      <h3>${article.title}</h3>
      <p>${article.description || 'No description available.'}</p>
      <a href="${article.url}" target="_blank">Read more</a>
    `;
    newsDisplay.appendChild(articleDiv);
  });
}

// ---------------- Contact Form ----------------
const sendBtn = document.getElementById('send-message-btn');
const contactFeedback = document.getElementById('contact-feedback');

if (sendBtn) {
  sendBtn.addEventListener('click', async () => {
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    if (!name || !email || !message) {
      contactFeedback.innerText = "Please fill in all fields.";
      contactFeedback.style.color = 'red';
      return;
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
      const data = await res.json();
      contactFeedback.innerText = data.message;
      contactFeedback.style.color = 'green';

      // Clear inputs
      document.getElementById('contact-name').value = '';
      document.getElementById('contact-email').value = '';
      document.getElementById('contact-message').value = '';
    } catch (err) {
      contactFeedback.innerText = "Failed to send message.";
      contactFeedback.style.color = 'red';
      console.error(err);
    }
  });
}
