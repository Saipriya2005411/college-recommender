// Auth state management
const Auth = {
  getToken: () => localStorage.getItem('token'),
  getUser: () => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  },
  isLoggedIn: () => !!localStorage.getItem('token'),
  isAdmin: () => {
    const u = Auth.getUser();
    return u && u.role === 'admin';
  },
  login: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/index.html';
  }
};

// Update navbar based on login state
function updateNavbar() {
  const navAuth = document.getElementById('navAuth');
  if (!navAuth) return;
  const user = Auth.getUser();
  if (Auth.isLoggedIn() && user) {
    navAuth.innerHTML = `
      <a href="pages/dashboard.html" class="btn-outline">Dashboard</a>
      <button onclick="Auth.logout()" class="btn-primary">Logout</button>
    `;
  }
}

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
});

// Mobile menu
document.addEventListener('DOMContentLoaded', () => {
  updateNavbar();

  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
  }
});

// Protect dashboard pages
function requireAuth() {
  if (!Auth.isLoggedIn()) {
    window.location.href = '/pages/login.html';
  }
}

function requireAdmin() {
  if (!Auth.isLoggedIn() || !Auth.isAdmin()) {
    window.location.href = '/pages/login.html';
  }
}
