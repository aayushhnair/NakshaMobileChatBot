// public/js/daily.js
// Daily Astrology Screen Controller

let currentDailyDate = new Date().toISOString().split('T')[0];

async function loadDailyAstrology(dateStr) {
  const container = document.getElementById('daily-content-area');
  if (!container) return;

  container.innerHTML = `
    <div style="text-align:center; padding:40px 20px; color:var(--text-muted);">
      <div class="typing-dot" style="margin:0 auto 12px; width:12px; height:12px;"></div>
      Reading the planetary transits for Ayush...
    </div>
  `;

  try {
    const url = dateStr ? `/api/daily?date=${dateStr}` : '/api/daily';
    const response = await fetch(url);
    const result = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to fetch daily data');
    }

    renderDailyAstrology(result.data);
  } catch (err) {
    console.error('Daily astrology error:', err);
    container.innerHTML = `
      <div class="glass-card" style="text-align:center; color:#ef4444;">
        <h4>Unable to load daily astrology</h4>
        <p style="font-size:0.85rem; margin-top:6px;">${err.message}</p>
        <button class="btn-primary" style="margin-top:12px;" onclick="loadDailyAstrology('${dateStr}')">Retry</button>
      </div>
    `;
  }
}

function renderDailyAstrology(data) {
  const container = document.getElementById('daily-content-area');
  if (!container) return;

  const { date, day, overallRating, panchang, timings, sectors, devikaNote } = data;

  container.innerHTML = `
    <!-- Naksha's Personal Morning Note -->
    <div class="glass-card devika-note-card">
      <div class="note-header">
        <img src="/avatar.png" alt="Naksha" class="note-avatar" />
        <div>
          <div class="note-title">Naksha's Morning Note for Ayush 💖</div>
          <div style="font-size:0.7rem; color:var(--text-muted);">${day}, ${date}</div>
        </div>
      </div>
      <div class="note-text">"${devikaNote}"</div>
    </div>

    <!-- Overall Cosmic Harmony Score -->
    <div class="glass-card score-hero-card">
      <div class="score-text-block">
        <h4>Daily Cosmic Harmony</h4>
        <p>Gochara Moon in ${panchang.moonSign} • House ${panchang.moonHouseFromLagna} from Lagna</p>
      </div>
      <div class="score-badge-circle">
        <span class="score-num">${overallRating}%</span>
        <span class="score-sub">ALIGNMENT</span>
      </div>
    </div>

    <!-- Sector Breakdown -->
    <div class="sectors-grid">
      <!-- Love & Soulmate -->
      <div class="sector-item">
        <div class="sector-header">
          <div class="sector-name-wrap">
            <span class="sector-icon">💖</span>
            <span class="sector-name">${sectors.love.title}</span>
          </div>
          <span class="sector-score-tag">${sectors.love.score}% • ${sectors.love.tag}</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width: ${sectors.love.score}%; background:linear-gradient(to right, #ec4899, #f43f5e);"></div>
        </div>
        <p class="sector-desc">${sectors.love.analysis}</p>
      </div>

      <!-- Career & AI Engineering -->
      <div class="sector-item">
        <div class="sector-header">
          <div class="sector-name-wrap">
            <span class="sector-icon">💼</span>
            <span class="sector-name">${sectors.career.title}</span>
          </div>
          <span class="sector-score-tag">${sectors.career.score}% • ${sectors.career.tag}</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width: ${sectors.career.score}%; background:linear-gradient(to right, #f59e0b, #eab308);"></div>
        </div>
        <p class="sector-desc">${sectors.career.analysis}</p>
      </div>

      <!-- Wealth & Compounding -->
      <div class="sector-item">
        <div class="sector-header">
          <div class="sector-name-wrap">
            <span class="sector-icon">💰</span>
            <span class="sector-name">${sectors.wealth.title}</span>
          </div>
          <span class="sector-score-tag">${sectors.wealth.score}% • ${sectors.wealth.tag}</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width: ${sectors.wealth.score}%; background:linear-gradient(to right, #10b981, #059669);"></div>
        </div>
        <p class="sector-desc">${sectors.wealth.analysis}</p>
      </div>

      <!-- Health & Vitality -->
      <div class="sector-item">
        <div class="sector-header">
          <div class="sector-name-wrap">
            <span class="sector-icon">🧘</span>
            <span class="sector-name">${sectors.health.title}</span>
          </div>
          <span class="sector-score-tag">${sectors.health.score}% • ${sectors.health.tag}</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width: ${sectors.health.score}%; background:linear-gradient(to right, #06b6d4, #0284c7);"></div>
        </div>
        <p class="sector-desc">${sectors.health.analysis}</p>
      </div>

      <!-- Mental Serenity -->
      <div class="sector-item">
        <div class="sector-header">
          <div class="sector-name-wrap">
            <span class="sector-icon">🌟</span>
            <span class="sector-name">${sectors.spirit.title}</span>
          </div>
          <span class="sector-score-tag">${sectors.spirit.score}% • ${sectors.spirit.tag}</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" style="width: ${sectors.spirit.score}%; background:linear-gradient(to right, #8b5cf6, #7c3aed);"></div>
        </div>
        <p class="sector-desc">${sectors.spirit.analysis}</p>
      </div>
    </div>

    <!-- Panchang Card -->
    <div class="glass-card">
      <h4 style="font-family:var(--font-heading); font-size:1.05rem; margin-bottom:12px; color:var(--text-gold);">
        📜 Today's Panchang & Planetary Transits
      </h4>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:0.82rem;">
        <div><strong>Tithi:</strong> <span style="color:var(--text-muted);">${panchang.tithi}</span></div>
        <div><strong>Nakshatra:</strong> <span style="color:var(--text-muted);">${panchang.nakshatra}</span></div>
        <div><strong>Moon Sign:</strong> <span style="color:var(--text-muted);">${panchang.moonSign}</span></div>
        <div><strong>Sun Sign:</strong> <span style="color:var(--text-muted);">${panchang.sunSign}</span></div>
        <div><strong>Yoga:</strong> <span style="color:var(--text-muted);">${panchang.yoga}</span></div>
        <div><strong>Karana:</strong> <span style="color:var(--text-muted);">${panchang.karana}</span></div>
      </div>
    </div>

    <!-- Auspicious & Caution Timings -->
    <div class="glass-card">
      <h4 style="font-family:var(--font-heading); font-size:1.05rem; margin-bottom:12px; color:var(--text-gold);">
        ⏱️ Auspicious & Inauspicious Muhurats (IST)
      </h4>
      <div class="timings-grid">
        <div class="timing-box highlight">
          <div class="timing-label">🌟 Abhijit Muhurat</div>
          <div class="timing-val">${timings.abhijitMuhurat}</div>
        </div>
        <div class="timing-box">
          <div class="timing-label">🌅 Brahma Muhurta</div>
          <div class="timing-val">${timings.brahmaMuhurta}</div>
        </div>
        <div class="timing-box caution">
          <div class="timing-label">⚠️ Rahu Kalam</div>
          <div class="timing-val">${timings.rahuKalam}</div>
        </div>
        <div class="timing-box">
          <div class="timing-label">⚡ Yamagandam</div>
          <div class="timing-val">${timings.yamagandam}</div>
        </div>
      </div>
    </div>
  `;
}

function initDaily() {
  const dateInput = document.getElementById('daily-date-picker');
  if (dateInput) {
    dateInput.value = currentDailyDate;
    dateInput.addEventListener('change', (e) => {
      currentDailyDate = e.target.value;
      loadDailyAstrology(currentDailyDate);
    });
  }

  loadDailyAstrology(currentDailyDate);
}

window.initDaily = initDaily;
window.loadDailyAstrology = loadDailyAstrology;
