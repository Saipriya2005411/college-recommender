// API base URL — change this if your backend runs on a different port
const API_BASE = 'http://localhost:5000/api';

const api = {
  // Generic request helper
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
      const data = await res.json();
      return { ok: res.ok, status: res.status, data };
    } catch (err) {
      return { ok: false, status: 0, data: { success: false, message: 'Network error. Is the server running?' } };
    }
  },

  get: (endpoint) => api.request(endpoint, { method: 'GET' }),
  post: (endpoint, body) => api.request(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => api.request(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => api.request(endpoint, { method: 'DELETE' }),

  // Auth
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),

  // Colleges
  getColleges: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return api.get(`/colleges?${qs}`);
  },
  getFeatured: () => api.get('/colleges/featured'),
  getCollege: (id) => api.get(`/colleges/${id}`),
  addReview: (id, data) => api.post(`/colleges/${id}/review`, data),

  // Recommend
  recommend: (data) => api.post('/recommend', data),

  // User actions
  getDashboard: () => api.get('/users/dashboard'),
  saveCollege: (id) => api.post(`/users/save/${id}`, {}),
  getSaved: () => api.get('/users/saved'),
  viewCollege: (id) => api.post(`/users/view/${id}`, {}),

  // Admin
  getAdminStats: () => api.get('/admin/stats'),
  addCollege: (data) => api.post('/admin/college', data),
  updateCollege: (id, data) => api.put(`/admin/college/${id}`, data),
  deleteCollege: (id) => api.delete(`/admin/college/${id}`),
  getAdminUsers: () => api.get('/admin/users'),
};

// Toast notifications
function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type]}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(100px)'; toast.style.transition = '0.3s'; setTimeout(() => toast.remove(), 300); }, 3000);
}

// Format currency
function formatCurrency(amount) {
  if (!amount) return '—';
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

// Format percentage
function formatPercent(val) {
  return val ? `${val}%` : '—';
}

// Star rating HTML
function starsHTML(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let html = '';
  for (let i = 0; i < 5; i++) {
    if (i < full) html += '★';
    else if (i === full && half) html += '½';
    else html += '☆';
  }
  return html;
}

// College card HTML
function collegeCardHTML(col, matchPct = null, eligible = null) {
  const courses = Array.isArray(col.courses) ? col.courses.slice(0, 3) : [];
  const tierClass = col.tier === 'Tier 1' ? 'tier-1' : col.tier === 'Tier 2' ? 'tier-2' : 'tier-3';
  return `
    <div class="college-card" onclick="window.location.href='/pages/college-detail.html?id=${col._id}'">
      <div class="card-image">
        ${col.imageURL ? `<img src="${col.imageURL}" alt="${col.collegeName}" onerror="this.parentElement.innerHTML='🏛️'">` : '🏛️'}
        <div class="card-tier ${tierClass}">${col.tier || ''}</div>
      </div>
      <div class="card-body">
        ${matchPct !== null ? `<div class="match-badge">✅ ${matchPct}% Match</div>` : ''}
        <h3>${col.collegeName}</h3>
        <p class="card-location">📍 ${col.city || ''}, ${col.state || ''}</p>
        <div class="card-stats">
          <div class="card-stat"><span class="label">Placements</span><span class="value">${formatPercent(col.placements?.percentage)}</span></div>
          <div class="card-stat"><span class="label">Avg Package</span><span class="value">${formatCurrency(col.placements?.avgPackage)}</span></div>
          <div class="card-stat"><span class="label">Ranking</span><span class="value">#${col.ranking || '—'}</span></div>
        </div>
        <div class="card-courses">
          ${courses.map(c => `<span class="course-tag">${c}</span>`).join('')}
          ${col.courses && col.courses.length > 3 ? `<span class="course-tag">+${col.courses.length - 3}</span>` : ''}
        </div>
        <div class="card-actions">
          <a href="/pages/college-detail.html?id=${col._id}" class="btn-primary btn-sm">View Details</a>
          <button class="btn-outline btn-sm save-btn" data-id="${col._id}" onclick="event.stopPropagation(); toggleSave('${col._id}', this)">🔖 Save</button>
        </div>
      </div>
    </div>`;
}

async function toggleSave(id, btn) {
  if (!localStorage.getItem('token')) {
    showToast('Please login to save colleges', 'error');
    return;
  }
  const res = await api.saveCollege(id);
  if (res.ok) {
    btn.textContent = res.data.saved ? '✅ Saved' : '🔖 Save';
    showToast(res.data.message, 'success');
  } else {
    showToast(res.data.message || 'Error', 'error');
  }
}
