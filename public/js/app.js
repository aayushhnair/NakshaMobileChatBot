// public/js/app.js
// Naksha Jathakam — Main App Controller
// Navigation, PWA installation prompt, and tab routing

let deferredInstallPrompt = null;
let activeTab = 'chat';

const tabConfig = {
  chat: {
    view: 'view-chat',
    init: () => window.initChat?.(),
    label: 'Chat'
  },
  daily: {
    view: 'view-daily',
    init: () => window.initDaily?.(),
    label: 'Today'
  },
  forecasts: {
    view: 'view-forecasts',
    init: () => window.initForecasts?.(),
    label: 'Forecast'
  },
  kundali: {
    view: 'view-kundali',
    init: () => window.initKundali?.(),
    label: 'Kundali'
  }
};

// Initialised tabs tracker
const initialisedTabs = new Set();

function switchTab(tabName) {
  if (!tabConfig[tabName]) return;

  // Hide all views
  document.querySelectorAll('.view-section').forEach(v => v.classList.remove('active'));

  // Show the target view
  const view = document.getElementById(tabConfig[tabName].view);
  if (view) view.classList.add('active');

  // Update nav buttons
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  activeTab = tabName;

  // Initialise tab content the first time it's visited
  if (!initialisedTabs.has(tabName)) {
    initialisedTabs.add(tabName);
    tabConfig[tabName].init?.();
  }

  // Special: chat always scrolls to bottom when revisited
  if (tabName === 'chat') {
    setTimeout(() => {
      const msgs = document.getElementById('chat-messages');
      if (msgs) msgs.scrollTop = msgs.scrollHeight;
    }, 100);
  }
}

// Setup bottom-nav click bindings
function bindNavTabs() {
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.tab;
      if (tab) switchTab(tab);
    });
  });
}

// Register PWA Service Worker
async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/sw.js');
      console.log('[SW] Registered successfully');
    } catch (e) {
      console.warn('[SW] Registration failed:', e);
    }
  }
}

// Handle Android Chrome "Add to Home Screen" install prompt
function setupInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;

    const banner = document.getElementById('install-banner');
    if (banner) {
      banner.style.display = 'flex';
      banner.classList.add('visible');
    }
  });

  const installBtn = document.getElementById('install-app-btn');
  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (!deferredInstallPrompt) return;
      deferredInstallPrompt.prompt();
      const choice = await deferredInstallPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        console.log('[PWA] User accepted installation');
      }
      deferredInstallPrompt = null;
      document.getElementById('install-banner')?.remove();
    });
  }

  const dismissBtn = document.getElementById('dismiss-install-btn');
  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      document.getElementById('install-banner')?.remove();
    });
  }

  // Already installed? hide banner
  if (window.matchMedia('(display-mode: standalone)').matches) {
    document.getElementById('install-banner')?.remove();
  }
}

// Setup Network Info Modal (for Android QR code)
function setupNetworkModal() {
  const btn = document.getElementById('qr-info-btn');
  const modal = document.getElementById('network-modal');
  const closeBtn = document.getElementById('close-network-modal');

  if (!btn || !modal) return;

  btn.addEventListener('click', async () => {
    modal.classList.add('active');
    try {
      const res = await fetch('/api/network-info');
      const data = await res.json();
      const el = document.getElementById('network-url-display');
      if (el && data) {
        el.innerHTML = `
          <p style="font-size:1.05rem; font-weight:700; color:var(--text-gold); word-break:break-all;">${data.networkUrl}</p>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">Open this URL in <strong>Chrome on your Android phone</strong> while on the same WiFi.</p>
        `;
      }
    } catch (e) {}
  });

  closeBtn?.addEventListener('click', () => modal.classList.remove('active'));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });
}

// Theme of starfield
function initStarfield() {
  const canvas = document.getElementById('starfield-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize);

  const stars = Array.from({ length: 90 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.3 + 0.2,
    speed: Math.random() * 0.18 + 0.04,
    opacity: Math.random() * 0.6 + 0.2,
    twinkleSpeed: Math.random() * 0.015 + 0.005,
    twinkleOffset: Math.random() * Math.PI * 2
  }));

  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame += 0.016;
    stars.forEach(s => {
      const twinkle = s.opacity + 0.25 * Math.sin(frame * s.twinkleSpeed * 100 + s.twinkleOffset);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 235, 180, ${Math.max(0, Math.min(1, twinkle))})`;
      ctx.fill();
      s.y += s.speed;
      if (s.y > canvas.height) {
        s.y = 0;
        s.x = Math.random() * canvas.width;
      }
    });
    requestAnimationFrame(draw);
  }
  draw();
}

// Main App Boot
async function bootApp() {
  bindNavTabs();
  setupInstallPrompt();
  setupNetworkModal();
  registerServiceWorker();
  initStarfield();

  // Start on the chat tab
  switchTab('chat');
}

document.addEventListener('DOMContentLoaded', bootApp);

// Expose globally
window.switchTab = switchTab;
