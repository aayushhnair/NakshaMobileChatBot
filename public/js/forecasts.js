// public/js/forecasts.js
// Monthly & Yearly Astrology Forecasts Controller

let currentForecastTab = 'monthly'; // 'monthly' or 'yearly'
let selectedMonth = new Date().getMonth() + 1; // 1 to 12
let selectedYear = new Date().getFullYear();
let monthlyDataCache = null;
let yearlyDataCache = null;

async function initForecasts() {
  const tabMonthlyBtn = document.getElementById('tab-monthly-btn');
  const tabYearlyBtn = document.getElementById('tab-yearly-btn');

  if (tabMonthlyBtn && tabYearlyBtn) {
    tabMonthlyBtn.addEventListener('click', () => switchForecastTab('monthly'));
    tabYearlyBtn.addEventListener('click', () => switchForecastTab('yearly'));
  }

  loadForecastData();
}

function switchForecastTab(tab) {
  currentForecastTab = tab;
  document.getElementById('tab-monthly-btn')?.classList.toggle('active', tab === 'monthly');
  document.getElementById('tab-yearly-btn')?.classList.toggle('active', tab === 'yearly');

  const monthlyArea = document.getElementById('forecast-monthly-area');
  const yearlyArea = document.getElementById('forecast-yearly-area');

  if (monthlyArea) monthlyArea.style.display = tab === 'monthly' ? 'block' : 'none';
  if (yearlyArea) yearlyArea.style.display = tab === 'yearly' ? 'block' : 'none';

  if (tab === 'monthly' && monthlyDataCache) {
    renderMonthlyView(monthlyDataCache);
  } else if (tab === 'yearly' && yearlyDataCache) {
    renderYearlyView(yearlyDataCache);
  }
}

async function loadForecastData() {
  const container = document.getElementById('forecasts-content-wrapper');
  if (!container) return;

  try {
    const [monthlyRes, yearlyRes] = await Promise.all([
      fetch(`/api/monthly?year=${selectedYear}&month=${selectedMonth}`).then(r => r.json()),
      fetch('/api/yearly').then(r => r.json())
    ]);

    if (monthlyRes.success) monthlyDataCache = monthlyRes.data;
    if (yearlyRes.success) yearlyDataCache = yearlyRes.data;

    switchForecastTab(currentForecastTab);
  } catch (err) {
    console.error('Forecasts load error:', err);
  }
}

function renderMonthlyView(data) {
  const container = document.getElementById('forecast-monthly-area');
  if (!container) return;

  const { allMonths, currentMonth } = data;
  const activeMonth = allMonths.find(m => m.month === selectedMonth) || currentMonth;

  // Month selector buttons
  let monthPillsHtml = '<div class="chips-container" style="background:transparent; padding:0 0 14px 0;">';
  allMonths.forEach(m => {
    const isSel = m.month === selectedMonth;
    monthPillsHtml += `
      <button class="chip-btn ${isSel ? 'active' : ''}" style="${isSel ? 'background:rgba(245, 158, 11, 0.2); border-color:var(--accent-gold); color:var(--text-gold);' : ''}" onclick="selectMonth(${m.month})">
        ${m.name}
      </button>
    `;
  });
  monthPillsHtml += '</div>';

  container.innerHTML = `
    ${monthPillsHtml}

    <!-- Month Hero Card -->
    <div class="glass-card" style="border-color:var(--border-glow); margin-bottom:14px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
        <h3 style="font-family:var(--font-heading); font-size:1.35rem; color:var(--text-gold);">
          ${activeMonth.name} ${data.year}
        </h3>
        <span class="welcome-badge">Monthly Gochara</span>
      </div>
      <h4 style="font-size:0.95rem; font-weight:600; color:var(--text-main); margin-bottom:6px;">
        ✨ ${activeMonth.theme}
      </h4>
      <p style="font-size:0.82rem; color:var(--text-muted); line-height:1.45;">
        <strong>Active Transits:</strong> ${activeMonth.transits}
      </p>
    </div>

    <!-- Monthly Pillars -->
    <div class="sectors-grid" style="margin-bottom:14px;">
      <!-- Career -->
      <div class="sector-item">
        <div class="sector-header">
          <div class="sector-name-wrap">
            <span class="sector-icon">💼</span>
            <span class="sector-name">Career & TCS AI Deliverables</span>
          </div>
        </div>
        <p class="sector-desc">${activeMonth.career}</p>
      </div>

      <!-- Love -->
      <div class="sector-item">
        <div class="sector-header">
          <div class="sector-name-wrap">
            <span class="sector-icon">💖</span>
            <span class="sector-name">Soulmate & Naksha Connection</span>
          </div>
        </div>
        <p class="sector-desc">${activeMonth.love}</p>
      </div>

      <!-- Wealth -->
      <div class="sector-item">
        <div class="sector-header">
          <div class="sector-name-wrap">
            <span class="sector-icon">💰</span>
            <span class="sector-name">Wealth & Compounding</span>
          </div>
        </div>
        <p class="sector-desc">${activeMonth.wealth}</p>
      </div>
    </div>

    <!-- Favorable & Caution Dates -->
    <div class="glass-card">
      <h4 style="font-family:var(--font-heading); font-size:1rem; margin-bottom:10px; color:var(--text-gold);">
        📅 High-Energy Dates in ${activeMonth.name}
      </h4>
      <div style="margin-bottom:8px;">
        <span style="font-size:0.8rem; color:#34d399; font-weight:700;">🟢 Auspicious & Favorable Days:</span>
        <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:4px;">
          ${activeMonth.favorableDates.map(d => `<span class="badge-tag badge-exalted">${activeMonth.name.substring(0,3)} ${d}</span>`).join('')}
        </div>
      </div>
      <div>
        <span style="font-size:0.8rem; color:#f87171; font-weight:700;">⚠️ Introspective & Caution Days:</span>
        <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:4px;">
          ${activeMonth.cautionDates.map(d => `<span class="badge-tag" style="background:rgba(239, 68, 68, 0.15); color:#fca5a5;">${activeMonth.name.substring(0,3)} ${d}</span>`).join('')}
        </div>
      </div>
    </div>
  `;
}

function selectMonth(mIndex) {
  selectedMonth = mIndex;
  if (monthlyDataCache) {
    renderMonthlyView(monthlyDataCache);
  }
}

function renderYearlyView(data) {
  const container = document.getElementById('forecast-yearly-area');
  if (!container) return;

  const { currentAge, activeDasha, roadmap, marriageWindows, longTermPhases } = data;

  container.innerHTML = `
    <!-- Current Status Header -->
    <div class="glass-card" style="border-color:var(--border-glow); margin-bottom:16px;">
      <h3 style="font-family:var(--font-heading); font-size:1.25rem; color:var(--text-gold); margin-bottom:4px;">
        Ayush's 10-Year Astrological Arc (2026–2036)
      </h3>
      <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:10px;">
        Current Age: <strong>${currentAge}</strong>
      </div>
      <div style="background:rgba(245, 158, 11, 0.1); border:1px solid rgba(245, 158, 11, 0.25); border-radius:12px; padding:10px 12px; font-size:0.82rem; color:var(--text-gold);">
        <strong>Active Dasha:</strong> ${activeDasha.theme}
      </div>
    </div>

    <!-- Prime Marriage Windows Banner -->
    <div class="glass-card" style="background:linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%); border-color:rgba(236, 72, 153, 0.35); margin-bottom:16px;">
      <h4 style="font-family:var(--font-heading); font-size:1.1rem; color:#f472b6; margin-bottom:6px;">
        💍 Soulmate & Marriage Timing Windows
      </h4>
      <p style="font-size:0.82rem; color:var(--text-muted); line-height:1.45; margin-bottom:10px;">
        Calculated through Rahu-Saturn & Rahu-Mercury dashas, activated by Jupiter's transits over Venus and 7th house:
      </p>
      <div style="display:flex; flex-direction:column; gap:8px;">
        ${marriageWindows.map(w => `
          <div style="background:rgba(0, 0, 0, 0.3); border-radius:10px; padding:8px 10px; font-size:0.8rem;">
            <div style="display:flex; justify-content:space-between; font-weight:700; color:var(--text-gold);">
              <span>${w.window} (Age ${w.age})</span>
              <span style="color:#f472b6; font-size:0.75rem;">${w.dasha.split('(')[0]}</span>
            </div>
            <div style="color:var(--text-muted); font-size:0.76rem; margin-top:2px;">${w.theme}</div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Year by Year Timeline -->
    <h4 style="font-family:var(--font-heading); font-size:1.15rem; color:var(--text-main); margin-bottom:12px;">
      📍 Granular Year-by-Year Progression
    </h4>
    <div style="padding-left:4px;">
      ${roadmap.map(item => `
        <div class="timeline-card">
          <div class="timeline-year">${item.year}</div>
          <div class="timeline-age">Age ${item.age} • Dasha: ${item.dasha}</div>
          <div class="timeline-body">
            <p style="margin-bottom:6px;">${item.focus}</p>
            <div style="font-size:0.75rem; color:var(--text-dim);">
              <strong>Transits:</strong> ${item.transits}
            </div>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Long-term Golden Eras -->
    <div class="glass-card" style="margin-top:10px;">
      <h4 style="font-family:var(--font-heading); font-size:1.05rem; color:var(--text-gold); margin-bottom:10px;">
        🌟 Grand Master Life Horizons
      </h4>
      ${longTermPhases.map(p => `
        <div style="margin-bottom:12px; font-size:0.82rem;">
          <strong style="color:var(--text-main);">${p.phase}</strong>
          <p style="color:var(--text-muted); margin-top:3px; line-height:1.4;">${p.summary}</p>
        </div>
      `).join('')}
    </div>
  `;
}

window.initForecasts = initForecasts;
window.selectMonth = selectMonth;
