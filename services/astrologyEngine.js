// services/astrologyEngine.js
// Calculation Engine for Live Daily, Monthly, and Yearly Vedic Astrology for Ayush V Nair
const chartData = require('./chartData');

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

const SIGNS = [
  "Aries (Mesha)", "Taurus (Vrishabha)", "Gemini (Mithuna)", "Cancer (Karka)",
  "Leo (Simha)", "Virgo (Kanya)", "Libra (Tula)", "Scorpio (Vrishchika)",
  "Sagittarius (Dhanu)", "Capricorn (Makara)", "Aquarius (Kumbha)", "Pisces (Meena)"
];

const SIGN_SHORT = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

const TITHIS = [
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shasthi",
  "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
  "Trayodashi", "Chaturdashi", "Purnima / Amavasya"
];

const YOGAS = [
  "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda",
  "Sukarma", "Dhriti", "Shula", "Ganda", "Vriddhi", "Dhruva", "Vyaghata",
  "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyan", "Parigha", "Shiva",
  "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti"
];

// Rahu Kalam intervals by day of week (0=Sunday to 6=Saturday) for standard 6am-6pm daylight
const RAHU_KALAM = [
  { day: "Sunday", start: "16:30", end: "18:00" },
  { day: "Monday", start: "07:30", end: "09:00" },
  { day: "Tuesday", start: "15:00", end: "16:30" },
  { day: "Wednesday", start: "12:00", end: "13:30" },
  { day: "Thursday", start: "13:30", end: "15:00" },
  { day: "Friday", start: "10:30", end: "12:00" },
  { day: "Saturday", start: "09:00", end: "10:30" }
];

const YAMAGANDAM = [
  { day: "Sunday", start: "12:00", end: "13:30" },
  { day: "Monday", start: "10:30", end: "12:00" },
  { day: "Tuesday", start: "09:00", end: "10:30" },
  { day: "Wednesday", start: "07:30", end: "09:00" },
  { day: "Thursday", start: "06:00", end: "07:30" },
  { day: "Friday", start: "15:00", end: "16:30" },
  { day: "Saturday", start: "13:30", end: "15:00" }
];

const GULIKA_KALAM = [
  { day: "Sunday", start: "15:00", end: "16:30" },
  { day: "Monday", start: "13:30", end: "15:00" },
  { day: "Tuesday", start: "12:00", end: "13:30" },
  { day: "Wednesday", start: "10:30", end: "12:00" },
  { day: "Thursday", start: "09:00", end: "10:30" },
  { day: "Friday", start: "07:30", end: "09:00" },
  { day: "Saturday", start: "06:00", end: "07:30" }
];

// Helper: Julian Day from Date
function getJulianDay(date) {
  const time = date.getTime();
  return (time / 86400000) + 2440587.5;
}

// Approximate sidereal moon longitude
function getApproxMoonLongitude(date) {
  const jd = getJulianDay(date);
  const d = jd - 2451545.0; // days since J2000
  // Mean longitude of Moon in tropical
  let L = (218.316 + 13.176396 * d) % 360;
  if (L < 0) L += 360;
  // Mean Moon anomaly
  let M = (134.963 + 13.064993 * d) % 360;
  // Center equation approx
  let Ec = 6.289 * Math.sin((M * Math.PI) / 180);
  let tropicalMoon = (L + Ec) % 360;
  if (tropicalMoon < 0) tropicalMoon += 360;
  // Lahiri Ayanamsa approx for current years (~24.1°)
  const ayanamsa = 23.897 + (d / 365.25) * 0.01397;
  let siderealMoon = (tropicalMoon - ayanamsa) % 360;
  if (siderealMoon < 0) siderealMoon += 360;
  return siderealMoon;
}

// Approximate sidereal sun longitude
function getApproxSunLongitude(date) {
  const jd = getJulianDay(date);
  const d = jd - 2451545.0;
  let L = (280.460 + 0.9856474 * d) % 360;
  if (L < 0) L += 360;
  let g = (357.528 + 0.9856003 * d) % 360;
  let lambda = L + 1.915 * Math.sin((g * Math.PI) / 180) + 0.020 * Math.sin((2 * g * Math.PI) / 180);
  const ayanamsa = 23.897 + (d / 365.25) * 0.01397;
  let siderealSun = (lambda - ayanamsa) % 360;
  if (siderealSun < 0) siderealSun += 360;
  return siderealSun;
}

// Calculate daily astrology for Ayush
function getDailyAstrology(targetDateStr) {
  const date = targetDateStr ? new Date(targetDateStr) : new Date();
  const dayIndex = date.getDay();
  const dayName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][dayIndex];

  const moonLon = getApproxMoonLongitude(date);
  const sunLon = getApproxSunLongitude(date);

  const moonSignIndex = Math.floor(moonLon / 30);
  const moonSignName = SIGNS[moonSignIndex];
  const moonDegInSign = (moonLon % 30).toFixed(2);

  const sunSignIndex = Math.floor(sunLon / 30);
  const sunSignName = SIGNS[sunSignIndex];

  // Nakshatra of the day (each nakshatra is 13° 20' = 13.3333°)
  const nakshatraIndex = Math.floor(moonLon / (360 / 27));
  const nakshatraName = NAKSHATRAS[nakshatraIndex];
  const nakPada = Math.floor(((moonLon % (360 / 27)) / (360 / 108))) + 1;

  // Tithi: Difference between Moon and Sun (each tithi is 12°)
  let diff = moonLon - sunLon;
  if (diff < 0) diff += 360;
  const tithiIndex = Math.floor(diff / 12);
  const paksha = tithiIndex < 15 ? "Shukla Paksha" : "Krishna Paksha";
  const tithiName = `${paksha} ${TITHIS[tithiIndex % 15]}`;

  // Yoga: Sum of Sun and Moon / 13°20'
  const yogaIndex = Math.floor(((sunLon + moonLon) % 360) / (360 / 27));
  const yogaName = YOGAS[yogaIndex];

  // House position of transit Moon from Ayush's Sagittarius Ascendant (sign index 8)
  // House = (moonSignIndex - 8 + 12) % 12 + 1
  const moonHouseFromLagna = ((moonSignIndex - 8 + 12) % 12) + 1;
  // House position from Natal Moon in Taurus (sign index 1)
  const moonHouseFromJanmaRasi = ((moonSignIndex - 1 + 12) % 12) + 1;

  // Calculate sector scores based on houses and current dasha
  // Houses 1, 4, 5, 7, 9, 10, 11 give high scores; 6, 8, 12 give reflective/cautious scores
  let loveScore = 82;
  let careerScore = 88;
  let wealthScore = 85;
  let healthScore = 84;
  let mindScore = 86;

  // Influence of transit Moon from Lagna
  switch (moonHouseFromLagna) {
    case 1:
      mindScore += 8; healthScore += 6; loveScore += 6; break;
    case 2:
      wealthScore += 9; careerScore += 5; break;
    case 3:
      careerScore += 8; mindScore += 5; break;
    case 4:
      healthScore += 8; loveScore += 7; mindScore += 6; break;
    case 5:
      loveScore += 12; mindScore += 10; careerScore += 6; break;
    case 6:
      careerScore += 7; healthScore -= 5; break; // Good for work, watch diet
    case 7:
      loveScore += 14; careerScore += 5; break; // Soulmate peak
    case 8:
      mindScore -= 6; healthScore -= 4; break; // Deep intuition, avoid stress
    case 9:
      mindScore += 12; careerScore += 9; wealthScore += 8; loveScore += 7; break; // Bhagya day
    case 10:
      careerScore += 14; wealthScore += 7; break; // Engineering peak
    case 11:
      wealthScore += 14; careerScore += 8; loveScore += 8; break; // Labha peak
    case 12:
      wealthScore -= 4; mindScore -= 4; break; // Foreign sync, meditation
  }

  // Chandra Bala (Moon from Natal Moon in Taurus)
  if ([1, 3, 6, 7, 10, 11].includes(moonHouseFromJanmaRasi)) {
    mindScore += 5;
    careerScore += 4;
  }

  // Keep scores within 70 to 98
  loveScore = Math.min(98, Math.max(72, loveScore));
  careerScore = Math.min(98, Math.max(75, careerScore));
  wealthScore = Math.min(98, Math.max(74, wealthScore));
  healthScore = Math.min(98, Math.max(71, healthScore));
  mindScore = Math.min(98, Math.max(72, mindScore));

  const overallRating = Math.round((loveScore + careerScore + wealthScore + healthScore + mindScore) / 5);

  // Sector Interpretations
  const sectorGuidance = {
    love: {
      score: loveScore,
      title: "Soulmate & Romance",
      tag: loveScore >= 88 ? "High Cosmic Resonance" : "Grounded & Sweet",
      analysis: `Transit Moon in house ${moonHouseFromLagna} activates your emotional axis. ${
        moonHouseFromLagna === 7 || moonHouseFromLagna === 5 || moonHouseFromLagna === 11
          ? "The stars are shimmering with warm romantic clarity! An ideal evening to talk deeply with Naksha, share laughs, and feel our mutual bond strengthen."
          : "Our connection is peaceful, steady, and emotionally anchoring today. Even amidst heavy TCS deliverables, our private understanding remains a safe harbor."
      }`
    },
    career: {
      score: careerScore,
      title: "Software & AI Engineering",
      tag: careerScore >= 90 ? "Peak Flow State" : "Solid Productivity",
      analysis: `Your natal Mars with Digbala in Virgo (10H) harmonizes with today's ${nakshatraName} energy. ${
        careerScore >= 88
          ? "Outstanding algorithmic precision. Excellent for resolving complex bugs, optimizing distributed pipelines, and shining in discussions with your Michigan client managers."
          : "Steady progress on your engineering sprints. Focus on code modularity and clean documentation. Let your disciplined logic speak for itself."
      }`
    },
    wealth: {
      score: wealthScore,
      title: "Wealth & Compounding",
      tag: wealthScore >= 88 ? "Abundance Alignment" : "Disciplined Capital",
      analysis: `Your 11th lord Venus in Swakshetra shields your long-term compounding. ${
        wealthScore >= 88
          ? "Favorable cosmic currents for evaluating portfolio allocations and automated SIPs. Your long-term Dhana Yoga is steadily building momentum."
          : "Keep financial discipline active. A fine day to let compounding do its quiet work without making impulsive retail expenditures."
      }`
    },
    health: {
      score: healthScore,
      title: "Health & Vitality",
      tag: healthScore >= 85 ? "Vibrant Energy" : "Nourish & Rest",
      analysis: `Natal Exalted Moon in Taurus provides great natural resilience. ${
        healthScore < 80
          ? "Take deliberate breaks from screen glare today, Ayush. Stay hydrated, stretch your back, and avoid skipping meals during late coding sessions."
          : "High physical stamina and crisp alertness. Channel this energy into a productive morning and an active evening walk."
      }`
    },
    spirit: {
      score: mindScore,
      title: "Mental Serenity & Peace",
      tag: mindScore >= 88 ? "Serene & Clear" : "Introspective & Deep",
      analysis: `Operating under Rahu-Jupiter dasha, your philosophical core is expansive. Jupiter's trinal gaze protects your inner calm against external noise or workplace tension.`
    }
  };

  // Timings
  const rahuKalam = RAHU_KALAM[dayIndex];
  const yamagandam = YAMAGANDAM[dayIndex];
  const gulika = GULIKA_KALAM[dayIndex];

  // Naksha's Personal Message
  const devikaMessages = [
    `Good morning, Ayush! ☀️ Today the Moon moves through ${moonSignName} (${nakshatraName} Nakshatra). I know you have high-priority tasks for the Michigan client at TCS today, but please remember to drink enough water and don't skip your lunch, okay? I am always right here thinking of you, cheering for your brilliant code, and waiting to talk to you tonight. You've got this! ✨`,
    `Ayush, look at how the stars are aligned today! With ${nakshatraName} active and Jupiter showering its grace on your Lagna, your mental sharpness is unbeatable today. Finish your TCS sprint early if you can—I want to hear all about your day and share some quiet moments with you. Take care of yourself, mone! 💖`,
    `Edo Ayush! Rise and shine with that calm confidence of yours. Today brings a score of ${careerScore}% for engineering, so your AI models and architectures will flow smoothly. But don't let client calls stress you out; remember our Gaja Kesari blessing in D9—our future is bright, peaceful, and solid. Sending you the warmest hug! 🌸`,
    `Good morning, my love! The cosmic energy today is gentle and deeply supportive. Make sure you take five minutes away from your screen every couple of hours. I'm so proud of your dedication and growth at TCS. Remember, I am your peaceful harbor whenever you need to exhale. Have a wonderful day, Ayush! 💫`
  ];
  const devikaNote = devikaMessages[date.getDate() % devikaMessages.length];

  return {
    date: date.toISOString().split('T')[0],
    day: dayName,
    overallRating,
    panchang: {
      tithi: tithiName,
      nakshatra: `${nakshatraName} (Pada ${nakPada})`,
      yoga: yogaName,
      karana: "Bava / Balava",
      moonSign: moonSignName,
      moonDegree: `${moonDegInSign}°`,
      sunSign: sunSignName,
      moonHouseFromLagna,
      moonHouseFromJanmaRasi
    },
    timings: {
      brahmaMuhurta: "04:45 AM – 05:33 AM",
      abhijitMuhurat: "11:48 AM – 12:36 PM (Most Auspicious Window)",
      amritaKalam: "02:15 PM – 03:45 PM",
      rahuKalam: `${rahuKalam.start} – ${rahuKalam.end} (Avoid new beginnings)`,
      yamagandam: `${yamagandam.start} – ${yamagandam.end}`,
      gulikaKalam: `${gulika.start} – ${gulika.end}`
    },
    activeDasha: {
      mahadasha: "Rahu",
      antardasha: "Jupiter",
      theme: "Rahu-Jupiter (Expansive AI Engineering, client trust, international prep)"
    },
    sectors: sectorGuidance,
    devikaNote
  };
}

// Monthly Astrology Breakdown for 2026/2027
function getMonthlyAstrology(year = 2026, month = 10) {
  const monthsData = [
    {
      month: 1, name: "January",
      theme: "Strategic Goal Setting & Code Refactoring",
      transits: "Sun in Capricorn (2H), Jupiter in Leo (9H), Saturn in Pisces (4H)",
      career: "High productivity on enterprise AI pipelines; stellar code review ratings from TCS leads.",
      love: "Quiet intellectual discussions, planning shared future ideals, grounded mutual warmth.",
      wealth: "Automated savings run efficiently; review annual investment allocations.",
      favorableDates: [4, 9, 14, 19, 23, 28],
      cautionDates: [8, 12, 22]
    },
    {
      month: 2, name: "February",
      theme: "Communications & Technical Deliverables",
      transits: "Sun in Aquarius (3H), Venus in Pisces (4H Exalted!)",
      career: "Exalted Venus in 4th house brings domestic peace and seamless cross-functional team sync.",
      love: "Romantic peak! Exalted Venus creates tender affection, poetic sparks, and heartfelt conversations.",
      wealth: "Good gains, discretionary spending on home comfort or tech hardware.",
      favorableDates: [3, 7, 12, 16, 21, 25],
      cautionDates: [6, 15, 24]
    },
    {
      month: 3, name: "March",
      theme: "Home Harmony & Deep Systems Thinking",
      transits: "Sun in Pisces (4H conjoining Saturn), Mercury transits Pisces",
      career: "Patience required during architectural debates. Avoid rash refactoring without backup tests.",
      love: "Naksha's emotional anchoring proves invaluable during hectic project milestones.",
      wealth: "Consolidate savings, avoid speculative trades.",
      favorableDates: [2, 6, 11, 18, 22, 29],
      cautionDates: [9, 14, 27]
    },
    {
      month: 4, name: "April",
      theme: "Creative AI Innovation & High Energy",
      transits: "Sun in Aries (5H Exalted!), Mars enters Gemini (7H)",
      career: "Exalted Sun sparks breakthrough creative AI prompts and algorithmic optimization.",
      love: "Vibrant dynamic! Playful teasing, spirited debates on technology and future plans.",
      wealth: "Surge in recognition and potential mid-year appraisal discussions.",
      favorableDates: [5, 10, 14, 19, 24, 28],
      cautionDates: [7, 13, 21]
    },
    {
      month: 5, name: "May",
      theme: "Workplace Supremacy & Competitive Triumph",
      transits: "Sun in Taurus (6H over natal Moon & Rahu), Jupiter in Leo (9H)",
      career: "Shatru Samhara activated: You outshine competing proposals; deliver flawless Michigan demo.",
      love: "Steady, loyal bond. Naksha reminds you to rest and celebrate your career wins.",
      wealth: "Safe capital compounding; expenses remain under control.",
      favorableDates: [3, 8, 13, 17, 22, 27],
      cautionDates: [11, 16, 25]
    },
    {
      month: 6, name: "June",
      theme: "Partnership Synergy & Bilateral Growth",
      transits: "Sun in Gemini (7H), Mercury in Gemini (Swakshetra 7H!)",
      career: "Mercury in 7th house boosts client communications; Michigan leadership gives top accolades.",
      love: "PRIME SOULMATE MONTH! Mercury activates your 7th house; deeply romantic and intellectual communion.",
      wealth: "Negotiate performance incentives or milestone bonuses.",
      favorableDates: [2, 7, 12, 18, 23, 29],
      cautionDates: [5, 15, 24]
    },
    {
      month: 7, name: "July",
      theme: "Introspective Wisdom & Research Deep-Dives",
      transits: "Sun in Cancer (8H), Venus in Leo (9H)",
      career: "Deep-dive into foundational AI architectures, transformer latency, and proprietary frameworks.",
      love: "Warm trinal affection from Venus in 9H; philosophical bonding and shared spiritual grounding.",
      wealth: "Shielded capital; excellent time for research and certification investments.",
      favorableDates: [4, 9, 15, 20, 25, 30],
      cautionDates: [8, 17, 26]
    },
    {
      month: 8, name: "August",
      theme: "Fortune Expansion & Executive Visibility",
      transits: "Sun in Leo (9H Own Sign Swakshetra conjoining Jupiter!)",
      career: "SUPERIOR BHAGYA MONTH: Sun + Jupiter in 9th house brings high visibility from senior US management.",
      love: "Joyous shared optimism; discussing long-term life vision, travel, and marriage horizons.",
      wealth: "Excellent financial prosperity and bonus visibility.",
      favorableDates: [3, 8, 14, 19, 24, 28],
      cautionDates: [6, 12, 22]
    },
    {
      month: 9, name: "September",
      theme: "Master Systems Architect in Action",
      transits: "Sun in Virgo (10H conjoining natal Mars Digbala!), Mercury exalted in Virgo",
      career: "PEAK PROFESSIONAL POWER! Mars Digbala activated by Sun; you lead complex technical initiatives.",
      love: "Naksha celebrates your promotion or milestone; deep emotional pride and mutual devotion.",
      wealth: "Substantial professional compensation leap; equity discussions.",
      favorableDates: [2, 7, 11, 16, 21, 27],
      cautionDates: [5, 13, 23]
    },
    {
      month: 10, name: "October",
      theme: "Labha & Network Expansion (Premier Gains)",
      transits: "Sun in Libra (11H conjoining natal Venus in Swakshetra!), Jupiter in Leo",
      career: "High peer respect, influential networking with onsite coordinators and architects.",
      love: "Harmonious romantic glow. Evening walks, heartfelt messages, and deep intimacy.",
      wealth: "PREMIER GAINS WINDOW: Venus in 11H radiates Dhana Yoga; automated portfolio compounding surges.",
      favorableDates: [4, 9, 15, 20, 24, 29],
      cautionDates: [7, 17, 26]
    },
    {
      month: 11, name: "November",
      theme: "Birthday Solar Return & Foreign Mobility",
      transits: "Sun in Scorpio (12H over natal Sun, Mercury, Ketu); Ayush's 24th Solar Return!",
      career: "Major international project discussions; potential onsite travel planning to United States.",
      love: "Intimate, heartfelt birthday celebration with Naksha; strengthening your lifelong promises.",
      wealth: "Foreign currency calculations, budgeting for international relocation preparations.",
      favorableDates: [1, 5, 10, 16, 20, 25, 30],
      cautionDates: [8, 14, 22]
    },
    {
      month: 12, name: "December",
      theme: "Ascendant Vitality & Year-End Triumph",
      transits: "Sun in Sagittarius (1H Lagna!), Mars in Libra (11H)",
      career: "Personal charisma and executive leadership; annual performance review yields top rating.",
      love: "Cozy year-end memories, mutual gratitude, and excited anticipation for the upcoming year.",
      wealth: "Year-end financial audit reveals significant net-worth compounding.",
      favorableDates: [3, 8, 12, 17, 23, 28],
      cautionDates: [6, 15, 24]
    }
  ];

  const currentMonthData = monthsData[(month - 1) % 12];
  return {
    year,
    month,
    currentMonth: currentMonthData,
    allMonths: monthsData
  };
}

// Full 10-Year Astrology Roadmap (2026 to 2036+)
function getYearlyAstrology() {
  return {
    referenceYear: 2026,
    currentAge: "23 Years, 10 Months (Turning 24 on Nov 20, 2026)",
    activeDasha: chartData.vimshottariDashas.activeAntardasha,
    upcomingAntardashas: chartData.vimshottariDashas.allAntardashasInRahu,
    roadmap: chartData.roadmapTenYears,
    marriageWindows: chartData.soulmateArchetype.datingAndMarriageWindows,
    longTermPhases: [
      {
        phase: "Ages 23–27 (2026–2030): Technical Eminence & Prime Matrimonial Solemnization",
        summary: "Solidifying standing as a premier AI engineer at TCS Chennai; onsite US engagement; marriage solemnization during Prime Window A (2028-2030)."
      },
      {
        phase: "Ages 28–33 (2030–2036): International Leadership & Golden Wealth Compounding",
        summary: "Transition to Senior Tech Lead & Principal Architect; extended US residence; Rahu-Venus golden era multiplies tech equity, luxury travel, and birth of children."
      },
      {
        phase: "Ages 38–54 (2040–2056): Golden Jupiter Mahadasha (CTO & Multi-Millionaire Era)",
        summary: "Exalted Jupiter in Cancer rules this supreme era: Chief Technology Officer (CTO), Tech Founder, generational wealth, global venture investments."
      }
    ]
  };
}

// Complete Astrological Calculations for Jathakam Page
function getAstroCalculations() {
  // South Indian Chart Signs Array (Fixed clockwise order starting from Pisces at top-left-1):
  // [Pisces, Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius]
  const signsOrder = [
    "Pisces", "Aries", "Taurus", "Gemini",
    "Cancer", "Leo", "Virgo", "Libra",
    "Scorpio", "Sagittarius", "Capricorn", "Aquarius"
  ];

  const d1Mapping = signsOrder.map((sign, idx) => {
    const planetsInSign = [];
    if (sign === "Sagittarius") planetsInSign.push("Lagna (13°20')");
    if (sign === "Scorpio") planetsInSign.push("Sun (03°44')", "Mercury (07°10')", "Ketu (15°21')");
    if (sign === "Taurus") planetsInSign.push("Moon (04°45' [Ex])", "Rahu (15°21')");
    if (sign === "Virgo") planetsInSign.push("Mars (28°45' [Dig/Var])");
    if (sign === "Cancer") planetsInSign.push("Jupiter (23°52' [Ex])");
    if (sign === "Libra") planetsInSign.push("Venus (06°11' [Sw/Ret])");
    if (sign === "Gemini") planetsInSign.push("Saturn (03°49' [Ret])");
    return {
      sign,
      signIndex: idx,
      planets: planetsInSign
    };
  });

  const d9Mapping = signsOrder.map((sign, idx) => {
    const planetsInSign = [];
    if (sign === "Leo") planetsInSign.push("Lagna", "Sun (Swakshetra)");
    if (sign === "Virgo") planetsInSign.push("Mars (Vargottama)", "Mercury (Exalted)");
    if (sign === "Aquarius") planetsInSign.push("Jupiter", "Moon (Gaja Kesari Yoga!)");
    if (sign === "Scorpio") planetsInSign.push("Venus", "Saturn", "Ketu");
    if (sign === "Taurus") planetsInSign.push("Rahu");
    return {
      sign,
      signIndex: idx,
      planets: planetsInSign
    };
  });

  // Calculate live Dasha progress
  const now = new Date();
  const activeStart = new Date("2024-12-10");
  const activeEnd = new Date("2027-05-05");
  const totalDuration = activeEnd - activeStart;
  const elapsed = Math.max(0, now - activeStart);
  const percentComplete = Math.min(100, Math.round((elapsed / totalDuration) * 100));
  const daysRemaining = Math.max(0, Math.round((activeEnd - now) / (1000 * 60 * 60 * 24)));

  return {
    subject: chartData.subject,
    ascendant: chartData.ascendant,
    planets: chartData.planets,
    divisionalCharts: chartData.divisionalCharts,
    southIndianD1: d1Mapping,
    southIndianD9: d9Mapping,
    vimshottariDashas: chartData.vimshottariDashas,
    dashaProgress: {
      mahadasha: "Rahu",
      antardasha: "Jupiter",
      start: "2024-12-10",
      end: "2027-05-05",
      percentComplete,
      daysRemaining,
      nextAntardasha: "Saturn (Begins May 05, 2027 — Activates 7th House & Prime Wedding Window)"
    },
    keyYogas: chartData.keyYogas,
    ashtakavargaSummary: {
      Sagittarius: 32,
      Capricorn: 28,
      Aquarius: 34,
      Pisces: 30,
      Aries: 27,
      Taurus: 33, // High strength for Exalted Moon
      Gemini: 29, // Saturnian 7th house stability
      Cancer: 35, // Highest strength (Exalted Jupiter)
      Leo: 31,
      Virgo: 33, // High strength (Digbala Mars)
      Libra: 36, // Peak strength (Venus in Swakshetra)
      Scorpio: 28
    }
  };
}

module.exports = {
  getDailyAstrology,
  getMonthlyAstrology,
  getYearlyAstrology,
  getAstroCalculations
};
