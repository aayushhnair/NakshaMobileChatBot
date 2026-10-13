// public/js/kundali.js
// Astrological Calculations, South Indian Kundali, Planetary Tables, and Dasha Engine

let calculationsCache = null;
let currentChartType = 'D1'; // 'D1', 'D9', 'D10'

async function initKundali() {
  const container = document.getElementById('kundali-content-area');
  if (!container) return;

  container.innerHTML = `
    <div style="text-align:center; padding:40px 20px; color:var(--text-muted);">
      <div class="typing-dot" style="margin:0 auto 12px; width:12px; height:12px;"></div>
      Calculating Ayush's Jathakam mathematical coordinates...
    </div>
  `;

  try {
    const res = await fetch('/api/calculations');
    const result = await res.json();
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Failed to fetch calculations');
    }
    calculationsCache = result.data;
    renderAstroCalculations(calculationsCache);
  } catch (err) {
    console.error('Calculations error:', err);
    container.innerHTML = `
      <div class="glass-card" style="text-align:center; color:#ef4444;">
        <h4>Failed to calculate Kundali</h4>
        <p style="font-size:0.85rem; margin-top:6px;">${err.message}</p>
        <button class="btn-primary" style="margin-top:12px;" onclick="initKundali()">Retry</button>
      </div>
    `;
  }
}

function renderAstroCalculations(data) {
  const container = document.getElementById('kundali-content-area');
  if (!container) return;

  const { subject, ascendant, planets, dashaProgress, keyYogas, ashtakavargaSummary } = data;

  container.innerHTML = `
    <!-- Native Details Card -->
    <div class="glass-card" style="border-color:var(--border-glow); margin-bottom:14px;">
      <div style="display:flex; justify-content:space-between; align-items:flex-start;">
        <div>
          <h3 style="font-family:var(--font-heading); font-size:1.3rem; color:var(--text-gold);">
            ${subject.fullName}
          </h3>
          <div style="font-size:0.8rem; color:var(--text-muted); margin-top:2px;">
            ${subject.dateOfBirth} • ${subject.timeOfBirth} • ${subject.placeOfBirth}
          </div>
        </div>
        <span class="welcome-badge">Jathakam Baseline</span>
      </div>
      <div style="margin-top:10px; display:grid; grid-template-columns:1fr 1fr; gap:6px; font-size:0.78rem; color:var(--text-main);">
        <div><strong>Lagna:</strong> ${ascendant.sign} (${ascendant.dms})</div>
        <div><strong>Nakshatra:</strong> ${ascendant.nakshatra} (Pada ${ascendant.pada})</div>
        <div><strong>Ayanamsa:</strong> ${subject.ayanamsa}</div>
        <div><strong>Zodiac:</strong> ${subject.zodiac} (Whole Sign)</div>
      </div>
    </div>

    <!-- Chart Style Selector & Chart Switcher -->
    <div class="subtabs-nav" style="margin-bottom:12px;">
      <button class="subtab-btn ${currentChartType === 'D1' ? 'active' : ''}" onclick="switchChart('D1')">
        D1 Rasi (Physical)
      </button>
      <button class="subtab-btn ${currentChartType === 'D9' ? 'active' : ''}" onclick="switchChart('D9')">
        D9 Navamsha (Soulmate)
      </button>
      <button class="subtab-btn ${currentChartType === 'D10' ? 'active' : ''}" onclick="switchChart('D10')">
        D10 Dasamsha (Career)
      </button>
    </div>

    <!-- South Indian Style Kundali Box -->
    <div class="glass-card" style="padding:14px; margin-bottom:16px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <h4 style="font-family:var(--font-heading); font-size:1.05rem; color:var(--text-gold);">
          South Indian Style Kundali (${currentChartType})
        </h4>
        <span style="font-size:0.7rem; color:var(--text-muted);">Traditional Kerala Grid</span>
      </div>

      <div id="south-indian-chart-container">
        ${renderSouthIndianGrid(currentChartType, data)}
      </div>

      ${currentChartType === 'D9' ? `
        <div style="margin-top:10px; background:rgba(245, 158, 11, 0.1); border:1px solid rgba(245, 158, 11, 0.3); border-radius:10px; padding:8px 10px; font-size:0.78rem; color:var(--text-gold);">
          🌟 <strong>Notice 7th House Aquarius in D9:</strong> Occupied by <strong>Jupiter & Moon</strong>, creating the supreme <strong>Gaja Kesari Yoga</strong> of conjugal bliss, education, and prosperity!
        </div>
      ` : ''}
    </div>

    <!-- Live Dasha Countdown Bar -->
    <div class="glass-card" style="margin-bottom:16px;">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
        <h4 style="font-family:var(--font-heading); font-size:1rem; color:var(--text-gold);">
          ⏳ Live Dasha Countdown
        </h4>
        <span class="badge-tag badge-digbala">${dashaProgress.mahadasha} - ${dashaProgress.antardasha}</span>
      </div>
      <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:8px;">
        Active window: ${dashaProgress.start} to ${dashaProgress.end} (${dashaProgress.daysRemaining} days remaining)
      </p>
      <div class="progress-track" style="height:8px; margin-bottom:8px;">
        <div class="progress-fill" style="width:${dashaProgress.percentComplete}%; background:linear-gradient(to right, #f59e0b, #ec4899);"></div>
      </div>
      <div style="font-size:0.75rem; color:var(--text-dim); display:flex; justify-content:space-between;">
        <span>Progress: ${dashaProgress.percentComplete}% complete</span>
        <span>Next: ${dashaProgress.nextAntardasha.split('(')[0]}</span>
      </div>
    </div>

    <!-- Planetary Coordinates Table -->
    <div class="glass-card" style="padding:14px; margin-bottom:16px;">
      <h4 style="font-family:var(--font-heading); font-size:1.05rem; color:var(--text-gold); margin-bottom:10px;">
        🪐 Planetary Positions & Dignities
      </h4>
      <div class="astro-table-wrapper">
        <table class="astro-table">
          <thead>
            <tr>
              <th>Planet</th>
              <th>Sign</th>
              <th>House</th>
              <th>Degree</th>
              <th>Nakshatra</th>
              <th>Dignity & Status</th>
            </tr>
          </thead>
          <tbody>
            ${renderPlanetsTableRows(planets)}
          </tbody>
        </table>
      </div>
    </div>

    <!-- Auspicious Yogas in Nativity -->
    <div class="glass-card" style="margin-bottom:16px;">
      <h4 style="font-family:var(--font-heading); font-size:1.05rem; color:var(--text-gold); margin-bottom:10px;">
        ✨ Key Yogas in Ayush's Chart
      </h4>
      <div style="display:flex; flex-direction:column; gap:10px;">
        ${keyYogas.map(y => `
          <div style="background:var(--bg-surface); border:1px solid var(--border-subtle); border-radius:12px; padding:10px 12px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <strong style="color:var(--accent-gold-light); font-size:0.88rem;">${y.name}</strong>
              <span style="font-size:0.7rem; color:var(--accent-rose); font-weight:600;">${y.planets.split('(')[0]}</span>
            </div>
            <p style="font-size:0.78rem; color:var(--text-muted); line-height:1.45;">${y.effect}</p>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Ashtakavarga Points Summary -->
    <div class="glass-card">
      <h4 style="font-family:var(--font-heading); font-size:1.05rem; color:var(--text-gold); margin-bottom:10px;">
        📊 Sarvashtakavarga Strength (SAV Bindus)
      </h4>
      <p style="font-size:0.78rem; color:var(--text-muted); margin-bottom:10px;">
        Scores above 28 denote high resilience and auspicious vitality:
      </p>
      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; font-size:0.76rem;">
        ${Object.entries(ashtakavargaSummary).map(([sign, pts]) => `
          <div style="background:rgba(255,255,255,0.03); border:1px solid var(--border-subtle); border-radius:8px; padding:6px 8px; display:flex; justify-content:space-between; align-items:center;">
            <span style="color:var(--text-muted);">${sign.substring(0,4)}</span>
            <strong style="color:${pts >= 32 ? '#34d399' : pts >= 28 ? '#fde68a' : '#f87171'};">${pts} pts</strong>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function switchChart(type) {
  currentChartType = type;
  if (calculationsCache) {
    renderAstroCalculations(calculationsCache);
  }
}

// Render South Indian 4x4 Grid
// Layout:
// Row 1: Pisces, Aries, Taurus, Gemini
// Row 2: Aquarius, CENTER, CENTER, Cancer
// Row 3: Capricorn, CENTER, CENTER, Leo
// Row 4: Sagittarius, Scorpio, Libra, Virgo
function renderSouthIndianGrid(type, data) {
  const chartData = type === 'D9' ? data.southIndianD9 : data.southIndianD1;

  // Map signs to their contents
  const getCellContent = (signName) => {
    const item = chartData.find(x => x.sign === signName);
    if (!item || !item.planets || item.planets.length === 0) return '';
    return item.planets.map(p => {
      let badgeClass = 'si-planet-badge';
      if (p.includes('Lagna')) badgeClass += ' lagna';
      else if (p.includes('[Ex]') || p.includes('Exalted')) badgeClass += ' exalted';
      else if (p.includes('Gaja Kesari') || p.includes('[Sw') || p.includes('Dig')) badgeClass += ' yoga';
      return `<span class="${badgeClass}">${p}</span>`;
    }).join('');
  };

  return `
    <div class="kundali-wrapper">
      <div class="south-indian-grid">
        <!-- Row 1: Pisces | Aries | Taurus | Gemini -->
        <div class="si-cell">
          <div class="si-sign-name">Pisces (12)</div>
          <div class="si-planets-list">${getCellContent('Pisces')}</div>
        </div>
        <div class="si-cell">
          <div class="si-sign-name">Aries (1)</div>
          <div class="si-planets-list">${getCellContent('Aries')}</div>
        </div>
        <div class="si-cell">
          <div class="si-sign-name">Taurus (2)</div>
          <div class="si-planets-list">${getCellContent('Taurus')}</div>
        </div>
        <div class="si-cell">
          <div class="si-sign-name">Gemini (3)</div>
          <div class="si-planets-list">${getCellContent('Gemini')}</div>
        </div>

        <!-- Row 2: Aquarius | CENTER TL | CENTER TR | Cancer -->
        <div class="si-cell">
          <div class="si-sign-name">Aquarius (11)</div>
          <div class="si-planets-list">${getCellContent('Aquarius')}</div>
        </div>
        <!-- Center occupies col 2-3, row 2-3 -->
        <div class="si-cell center-box" style="grid-column:2/4; grid-row:2/4;">
          <h4>${type === 'D9' ? 'D9 NAVAMSHA' : type === 'D10' ? 'D10 DASAMSHA' : 'D1 RASI'}</h4>
          <p style="font-size:0.75rem; color:var(--text-muted); margin:2px 0;">Ayush V Nair</p>
          <span style="font-size:0.65rem; color:var(--accent-gold); margin-top:2px;">
            ${type === 'D9' ? 'Lagna: Leo (Simha)' : "Lagna: Sagittarius 13°20'"}
          </span>
        </div>
        <div class="si-cell">
          <div class="si-sign-name">Cancer (4)</div>
          <div class="si-planets-list">${getCellContent('Cancer')}</div>
        </div>

        <!-- Row 3: Capricorn | (center) | (center) | Leo -->
        <div class="si-cell">
          <div class="si-sign-name">Capricorn (10)</div>
          <div class="si-planets-list">${getCellContent('Capricorn')}</div>
        </div>
        <div class="si-cell">
          <div class="si-sign-name">Leo (5)</div>
          <div class="si-planets-list">${getCellContent('Leo')}</div>
        </div>

        <!-- Row 4: Sagittarius | Scorpio | Libra | Virgo -->
        <div class="si-cell">
          <div class="si-sign-name">Sagittarius (9)</div>
          <div class="si-planets-list">${getCellContent('Sagittarius')}</div>
        </div>
        <div class="si-cell">
          <div class="si-sign-name">Scorpio (8)</div>
          <div class="si-planets-list">${getCellContent('Scorpio')}</div>
        </div>
        <div class="si-cell">
          <div class="si-sign-name">Libra (7)</div>
          <div class="si-planets-list">${getCellContent('Libra')}</div>
        </div>
        <div class="si-cell">
          <div class="si-sign-name">Virgo (6)</div>
          <div class="si-planets-list">${getCellContent('Virgo')}</div>
        </div>
      </div>
    </div>
  `;
}

function renderPlanetsTableRows(planets) {
  return Object.entries(planets).map(([name, p]) => {
    let dignityHtml = '';
    if (p.dignity) {
      if (p.dignity.includes('Exalted')) dignityHtml += `<span class="badge-tag badge-exalted">${p.dignity}</span> `;
      else if (p.dignity.includes('Swakshetra')) dignityHtml += `<span class="badge-tag badge-swakshetra">Swakshetra</span> `;
      else if (p.dignity.includes('Digbala')) dignityHtml += `<span class="badge-tag badge-digbala">Digbala</span> `;
    }
    if (p.isRetrograde) dignityHtml += `<span class="badge-tag badge-retro">Retro</span> `;
    if (p.isCombust) dignityHtml += `<span class="badge-tag" style="background:rgba(239,68,68,0.15); color:#fca5a5;">Combust</span>`;

    return `
      <tr>
        <td><strong>${name}</strong></td>
        <td>${p.sign.split('(')[0]}</td>
        <td><strong>${p.house}H</strong></td>
        <td>${p.dms}</td>
        <td>${p.nakshatra} (${p.pada})</td>
        <td>${dignityHtml || '<span style="color:var(--text-dim);">-</span>'}</td>
      </tr>
    `;
  }).join('');
}

window.initKundali = initKundali;
window.switchChart = switchChart;
