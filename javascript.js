// Theme toggle with persistence
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

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

// To-Do List API Integration
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

// Load tasks on page load
document.addEventListener('DOMContentLoaded', loadTasks);

async function loadTasks() {
  try {
    const response = await fetch('/api/tasks');
    const tasks = await response.json();
    renderTasks(tasks);
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
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
  try {
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    });
    taskInput.value = '';
    loadTasks();
  } catch (error) {
    console.error('Error adding task:', error);
  }
});

async function toggleTask(id) {
  try {
    await fetch(`/api/tasks/${id}`, { method: 'PUT' });
    loadTasks();
  } catch (error) {
    console.error('Error toggling task:', error);
  }
}

async function deleteTask(id) {
  try {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    loadTasks();
  } catch (error) {
    console.error('Error deleting task:', error);
  }
}

// News API Integration
const newsBtn = document.getElementById('get-news-btn');
const newsInput = document.getElementById('news-input');
const newsDisplay = document.getElementById('news-display');
const API_KEY = '58216d58a8794008a18f1c9be7697b38'; // Replace with your NewsAPI key

newsBtn.addEventListener('click', async () => {
  const topic = newsInput.value.trim() || 'technology'; // Default to 'technology' if empty
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
  if (articles.length === 0) {
    newsDisplay.innerHTML = '<p>No articles found for this topic.</p>';
    return;
  }
  articles.slice(0, 10).forEach(article => { // Limit to 10 articles
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