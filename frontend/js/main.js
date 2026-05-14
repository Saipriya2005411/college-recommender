document.addEventListener('DOMContentLoaded', async () => {
  loadFeatured();
  setupRecommendForm();
  setupChatbot();
});

// Load featured colleges
async function loadFeatured() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  const res = await api.getFeatured();
  if (res.ok && res.data.colleges.length) {
    grid.innerHTML = res.data.colleges.map(c => collegeCardHTML(c)).join('');
  } else {
    grid.innerHTML = `<div class="empty-state"><div class="empty-icon">🏛️</div><h3>No colleges loaded yet</h3><p>Make sure the backend is running and database is seeded.</p></div>`;
  }
}

// Recommendation form
function setupRecommendForm() {
  const form = document.getElementById('recommendForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('getRecoBtn');
    btn.innerHTML = '<div class="spinner" style="width:18px;height:18px;margin:0;border-width:2px"></div> Finding...';
    btn.disabled = true;

    const params = {
      tenth_percentage: parseFloat(document.getElementById('tenth').value),
      twelfth_percentage: parseFloat(document.getElementById('twelfth').value),
      entrance_score: parseFloat(document.getElementById('entranceScore').value) || undefined,
      exam_type: document.getElementById('examType').value || undefined,
      budget: parseInt(document.getElementById('budget').value) || undefined,
      category: document.getElementById('category').value,
      preferred_course: document.getElementById('course').value || undefined,
      preferred_state: document.getElementById('state').value || undefined,
    };
    Object.keys(params).forEach(k => params[k] === undefined && delete params[k]);

    sessionStorage.setItem('recoParams', JSON.stringify(params));
    window.location.href = 'pages/recommendations.html';
  });
}

// Chatbot
function setupChatbot() {
  const fab = document.getElementById('chatbotFab');
  const win = document.getElementById('chatbotWindow');
  const close = document.getElementById('closeChatbot');
  const sendBtn = document.getElementById('sendChat');
  const input = document.getElementById('chatInput');

  if (!fab) return;

  fab.addEventListener('click', () => win.classList.toggle('open'));
  close.addEventListener('click', () => win.classList.remove('open'));

  const sendMessage = async () => {
    const msg = input.value.trim();
    if (!msg) return;
    appendMsg(msg, 'user');
    input.value = '';
    appendMsg('Thinking...', 'bot', 'thinking');

    // Parse message for college search hints
    const lowerMsg = msg.toLowerCase();
    let params = {};

    // Extract state
    const states = ['odisha', 'maharashtra', 'karnataka', 'tamil nadu', 'delhi', 'rajasthan', 'gujarat', 'punjab', 'telangana', 'uttar pradesh'];
    states.forEach(s => { if (lowerMsg.includes(s)) params.preferred_state = s.charAt(0).toUpperCase() + s.slice(1); });

    // Extract course
    if (lowerMsg.includes('cse') || lowerMsg.includes('computer')) params.preferred_course = 'Computer Science';
    if (lowerMsg.includes('ai') || lowerMsg.includes('ml') || lowerMsg.includes('machine learning')) params.preferred_course = 'AI/ML';
    if (lowerMsg.includes('ece') || lowerMsg.includes('electrical')) params.preferred_course = 'ECE';
    if (lowerMsg.includes('mechanical') || lowerMsg.includes('mech')) params.preferred_course = 'Mechanical';

    // Extract budget hints
    if (lowerMsg.includes('affordable') || lowerMsg.includes('cheap') || lowerMsg.includes('low budget')) params.budget = 300000;
    if (lowerMsg.includes('government') || lowerMsg.includes('govt')) params.type = 'Government';

    const res = await api.recommend({ twelfth_percentage: 75, ...params, limit: 4 });
    removePending();

    if (res.ok && res.data.results.length) {
      const names = res.data.results.slice(0, 4).map(r => `• ${r.college.collegeName} (${r.college.state})`).join('\n');
      appendMsg(`Here are some matching colleges:\n\n${names}\n\nVisit <a href="pages/colleges.html" style="color:#60a5fa">Colleges</a> for full details!`, 'bot');
    } else {
      appendMsg('I couldn\'t find matching colleges. Try mentioning a state, course, or budget. Example: "Suggest affordable CSE colleges in Karnataka"', 'bot');
    }
  };

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });
}

function appendMsg(text, sender, id = null) {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = `chat-msg ${sender}`;
  div.innerHTML = text.replace(/\n/g, '<br>');
  if (id) div.id = id;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function removePending() {
  const el = document.getElementById('thinking');
  if (el) el.remove();
}
