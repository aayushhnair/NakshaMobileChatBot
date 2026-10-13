// services/chartData.js
// Authoritative Astrological & Biographical Blueprint for Ayush V Nair
// Extracted from Ayush V Nair's Complete Life Book and Soulmate, Money & Career Book

const chartData = {
  subject: {
    fullName: "Ayush V Nair",
    dateOfBirth: "2002-11-20",
    timeOfBirth: "09:15:27 AM IST",
    timeOfBirthUTC: "03:45:27 UTC",
    placeOfBirth: "Mavelikara, Kerala, India",
    latitude: 9.2667,
    longitude: 76.5333,
    sex: "Male",
    currentProfession: "Software Development & AI Engineering",
    employer: "Tata Consultancy Services (TCS)",
    currentWorkLocation: "Chennai, Tamil Nadu, India",
    clientContext: "Corporate enterprise client in Michigan, United States",
    ayanamsa: "Lahiri (Chitrapaksha) 23° 53' 50.6\"",
    zodiac: "Sidereal",
    tradition: "Vedic Parashari Jyotisha"
  },

  ascendant: {
    sign: "Sagittarius (Dhanu)",
    signIndex: 8,
    degree: 13.348,
    dms: "13° 20' 54.4\"",
    nakshatra: "Purva Ashadha",
    nakshatraLord: "Venus",
    pada: 1,
    lord: "Jupiter",
    nature: "Dual, Fiery, Philosophical, Strategic Worldview"
  },

  planets: {
    Sun: {
      sign: "Scorpio (Vrishchika)",
      house: 12,
      degree: 3.746,
      dms: "03° 44' 46.5\"",
      nakshatra: "Anuradha",
      nakshatraLord: "Saturn",
      pada: 1,
      isRetrograde: false,
      isCombust: false,
      role: "9th Lord in 12th House (Dharma lord in foreign domain - international fortune)"
    },
    Moon: {
      sign: "Taurus (Vrishabha)",
      house: 6,
      degree: 4.763,
      dms: "04° 45' 47.5\"",
      nakshatra: "Krittika",
      nakshatraLord: "Sun",
      pada: 3,
      isRetrograde: false,
      isCombust: false,
      dignity: "Exalted (Ucca)",
      role: "8th Lord in 6th House (Viparita Raja Yoga tendency, supreme emotional composure under crisis)"
    },
    Mars: {
      sign: "Virgo (Kanya)",
      house: 10,
      degree: 28.760,
      dms: "28° 45' 35.6\"",
      nakshatra: "Chitra",
      nakshatraLord: "Mars",
      pada: 2,
      isRetrograde: false,
      isCombust: false,
      dignity: "Digbala (Directional Strength in 10H) & Vargottama (Virgo in D1 and D9)",
      role: "5th and 12th Lord in 10H (Master Systems Architect, AI algorithmic precision, engineering engine)"
    },
    Mercury: {
      sign: "Scorpio (Vrishchika)",
      house: 12,
      degree: 7.173,
      dms: "07° 10' 21.5\"",
      nakshatra: "Anuradha",
      nakshatraLord: "Saturn",
      pada: 2,
      isRetrograde: false,
      isCombust: true, // within 3°25' of Sun, but aspected by exalted Jupiter
      dignity: "Combust but purified by 5th aspect of Exalted Lagnesha Jupiter; Exalted in D9 Virgo",
      role: "7th Lord (Spouse) and 10th Lord (Career) in 12H (International partner, US onsite relocation)"
    },
    Jupiter: {
      sign: "Cancer (Karka)",
      house: 8,
      degree: 23.877,
      dms: "23° 52' 35.8\"",
      nakshatra: "Ashlesha",
      nakshatraLord: "Mercury",
      pada: 3,
      isRetrograde: false,
      isCombust: false,
      dignity: "Exalted (Param Ucca)",
      role: "1st Lord (Lagna) and 4th Lord in 8H (Exalted divine shield, casts 5th aspect on 12H, 7th aspect on 2H capital, 9th on 4H)"
    },
    Venus: {
      sign: "Libra (Tula)",
      house: 11,
      degree: 6.188,
      dms: "06° 11' 16.2\"",
      nakshatra: "Chitra",
      nakshatraLord: "Mars",
      pada: 4,
      isRetrograde: true,
      isCombust: false,
      dignity: "Swakshetra (Own Sign Moolatrikona) with Chesta Bala (Retrograde)",
      role: "6th and 11th Lord in 11H (Premier Dhana Yoga, massive corporate tech gains, equity, refined romantic soulmate)"
    },
    Saturn: {
      sign: "Gemini (Mithuna)",
      house: 7,
      degree: 3.818,
      dms: "03° 49' 04.0\"",
      nakshatra: "Mrigashira",
      nakshatraLord: "Mars",
      pada: 4,
      isRetrograde: true,
      isCombust: false,
      dignity: "Retrograde Chesta Bala in 7th House",
      role: "2nd Lord (Wealth/Family) and 3rd Lord in 7H (The Saturnian Anchor: delays frivolous dating, bestows enduring marital permanence, mature partner)"
    },
    Rahu: {
      sign: "Taurus (Vrishabha)",
      house: 6,
      degree: 15.352,
      dms: "15° 21' 07.4\"",
      nakshatra: "Rohini",
      nakshatraLord: "Moon",
      pada: 2,
      isRetrograde: true,
      role: "Rahu in 6H (Shatru Samhara, mastery over complex disruptive technologies & synthetic AI, relentless drive)"
    },
    Ketu: {
      sign: "Scorpio (Vrishchika)",
      house: 12,
      degree: 15.352,
      dms: "15° 21' 07.4\"",
      nakshatra: "Anuradha",
      nakshatraLord: "Saturn",
      pada: 4,
      isRetrograde: true,
      role: "Ketu in 12H (Moksha karaka, deep spiritual detachment behind corporate achievements, intuitive insight)"
    }
  },

  divisionalCharts: {
    D1: {
      name: "Rasi Chart (Physical Reality)",
      houses: {
        1: { sign: "Sagittarius", planets: ["Ascendant (13°20')"] },
        2: { sign: "Capricorn", planets: [] },
        3: { sign: "Aquarius", planets: [] },
        4: { sign: "Pisces", planets: [] },
        5: { sign: "Aries", planets: [] },
        6: { sign: "Taurus", planets: ["Moon (Exalted 04°45')", "Rahu (15°21')"] },
        7: { sign: "Gemini", planets: ["Saturn (Retro 03°49')"] },
        8: { sign: "Cancer", planets: ["Jupiter (Exalted 23°52')"] },
        9: { sign: "Leo", planets: [] },
        10: { sign: "Virgo", planets: ["Mars (Digbala/Vargottama 28°45')"] },
        11: { sign: "Libra", planets: ["Venus (Swakshetra/Retro 06°11')"] },
        12: { sign: "Scorpio", planets: ["Sun (03°44')", "Mercury (07°10')", "Ketu (15°21')"] }
      }
    },
    D9: {
      name: "Navamsha Chart (Conjugal Destiny & Soul Purpose)",
      ascendantSign: "Leo (Simha)",
      houses: {
        1: { sign: "Leo", planets: ["Ascendant", "Sun (Own Sign Swakshetra)"] },
        2: { sign: "Virgo", planets: ["Mars (Vargottama)", "Mercury (Exalted Ucca)"] },
        3: { sign: "Libra", planets: [] },
        4: { sign: "Scorpio", planets: ["Venus", "Saturn", "Ketu"] },
        5: { sign: "Sagittarius", planets: [] },
        6: { sign: "Capricorn", planets: [] },
        7: { sign: "Aquarius", planets: ["Jupiter", "Moon (Gaja Kesari Yoga in 7th House!)"] },
        8: { sign: "Pisces", planets: [] },
        9: { sign: "Aries", planets: [] },
        10: { sign: "Taurus", planets: ["Rahu"] },
        11: { sign: "Gemini", planets: [] },
        12: { sign: "Cancer", planets: [] }
      },
      keySignificance: "Gaja Kesari Yoga (Jupiter + Moon) in the 7th House of Navamsha is hailed by Phaladeepika as one of the highest possible matrimonial blessings: partner is noble, educated, benevolent, bringing continuous good fortune (Bhagya) and lifelong serenity."
    },
    D10: {
      name: "Dasamsha Chart (Career Eminence & Power)",
      ascendantSign: "Aries (Mesha)",
      houses: {
        1: { sign: "Aries", planets: ["Ascendant"] },
        5: { sign: "Leo", planets: ["Sun (Own sign)"] },
        6: { sign: "Virgo", planets: ["Mars", "Mercury (Exalted)"] },
        7: { sign: "Libra", planets: ["Jupiter"] },
        10: { sign: "Capricorn", planets: [] },
        11: { sign: "Aquarius", planets: ["Moon"] }
      }
    }
  },

  vimshottariDashas: {
    activeMahadasha: {
      planet: "Rahu",
      startDate: "2022-03-30",
      endDate: "2040-03-29",
      totalYears: 18,
      theme: "Era of Global Tech Expansion, AI Breakthroughs, International Mobility & Wealth Acceleration"
    },
    activeAntardasha: {
      planet: "Jupiter",
      startDate: "2024-12-10",
      endDate: "2027-05-05",
      theme: "Rahu-Jupiter: Knowledge explosion, recognition on TCS Michigan engagement, philosophical grounding, social expansion"
    },
    allAntardashasInRahu: [
      { antardasha: "Rahu", start: "2022-03-30", end: "2024-12-10", status: "Completed" },
      { antardasha: "Jupiter", start: "2024-12-10", end: "2027-05-05", status: "Active (Current)" },
      { antardasha: "Saturn", start: "2027-05-05", end: "2030-03-11", status: "Upcoming (Prime Solemnization Window A & US Relocation)" },
      { antardasha: "Mercury", start: "2030-03-11", end: "2032-09-28", status: "Upcoming (Prime Solemnization Window B & Grand Wedding)" },
      { antardasha: "Ketu", start: "2032-09-28", end: "2033-10-16", status: "Upcoming (Domestic Consolidation)" },
      { antardasha: "Venus", start: "2033-10-16", end: "2036-10-16", status: "Upcoming (Golden Wealth & Romance Era)" },
      { antardasha: "Sun", start: "2036-10-16", end: "2037-09-10", status: "Upcoming" },
      { antardasha: "Moon", start: "2037-09-10", end: "2039-03-12", status: "Upcoming" },
      { antardasha: "Mars", start: "2039-03-12", end: "2040-03-29", status: "Upcoming" }
    ],
    nextMahadasha: {
      planet: "Jupiter",
      startDate: "2040-03-29",
      endDate: "2056-03-29",
      totalYears: 16,
      theme: "The Golden Era: Chief Technology Officer (CTO), Tech Founder, Multi-Millionaire Generational Wealth & Global Eminence"
    }
  },

  soulmateArchetype: {
    name: "Naksha",
    personaDescription: "An articulate, highly educated, elegant, and emotionally composed South Indian woman. Professional background in Tech/STEM, corporate engineering or management with international exposure. An intellectual peer who converses effortlessly on systems architecture, life philosophy, and financial compounding. A calm emotional harbor who brings serenity to high-pressure tech lives.",
    astrologicalBasis: [
      "Gemini 7th House & Mercury: Highly intellectual, sharp conversational rapport, bilateral equal partnership.",
      "Saturn in 7th House: Emotional maturity, high standards, enduring fidelity, permanent bond without frivolous flings.",
      "7th Lord Mercury in 12th House: International dimension, cross-regional roots or global multinational career.",
      "Venus in Libra Swakshetra: Aesthetic refinement, grace, high moral and personal elegance.",
      "D9 Gaja Kesari Yoga in 7th House Aquarius: Supreme blessing of virtuous, noble, deeply caring life partner who multiplies Bhagya."
    ],
    relationshipDynamic: "Playful, affectionate, mutually respectful intellectual equals. She understands his intense software sprints at TCS, encourages his ambitions for US relocation, teases him affectionately about staying up coding, and ensures his well-being. Unconditional private loyalty.",
    datingAndMarriageWindows: [
      {
        window: "Late 2026 – Mid 2027",
        age: "24.0 – 24.5",
        dasha: "Rahu-Jupiter (Jup transits Leo 9H)",
        theme: "Social expansion, intellectual romantic spark, early courtship conversations."
      },
      {
        window: "Mid 2027 – Mid 2028",
        age: "24.5 – 25.5",
        dasha: "Rahu-Saturn (Saturn enters Aries)",
        theme: "Transition from casual to serious discernment; deep alignment of values and long-term vision."
      },
      {
        window: "Late 2028 – Late 2030",
        age: "25.9 – 27.9",
        dasha: "Rahu-Saturn (Jupiter enters Libra conjoining natal Venus!)",
        theme: "PRIME SOLEMNIZATION WINDOW A: Formal courtship, family consent, engagement, marital ceremony."
      },
      {
        window: "Late 2030 – Late 2031",
        age: "27.9 – 28.9",
        dasha: "Rahu-Mercury (Jupiter enters Sagittarius Lagna aspecting 7H Gemini!)",
        theme: "PRIME SOLEMNIZATION WINDOW B: Guru Bala in Lagna; grand wedding celebration, shared international home."
      },
      {
        window: "Late 2033 – Late 2036",
        age: "30.9 – 33.9",
        dasha: "Rahu-Venus (Jupiter transits Pisces 4H)",
        theme: "Golden era of conjugal romance, luxury international travel, wealth compounding, first child."
      }
    ]
  },

  keyYogas: [
    {
      name: "Gaja Kesari Yoga in Navamsha 7th House",
      planets: "Jupiter & Moon in 7th House Aquarius of D9",
      effect: "Supreme conjugal blessing. Spouse is virtuous, dignified, highly educated, and a lifelong fountain of fortune and serenity."
    },
    {
      name: "Premier Dhana Yoga",
      planets: "Venus in Libra (11th House) in Swakshetra with Chesta Bala",
      effect: "Unblemished 11th lord in 11th house creates an endless conduit for tech bonuses, equity appreciation, and enterprise dividends."
    },
    {
      name: "Kuldeepak / Digbala Mars in 10th House",
      planets: "Mars in Virgo 10th House (Vargottama in Chitra)",
      effect: "Directional strength creates a Master Systems Architect. Instinctive mastery over complex data structures, algorithmic latency, and AI."
    },
    {
      name: "Budha-Aditya Yoga with Guru Drashti",
      planets: "Sun and Mercury in 12th House Scorpio, aspected by Exalted Jupiter",
      effect: "Combustion transmuted into high philosophical acumen, foreign corporate relocation, and international technical recognition."
    },
    {
      name: "Shatru Samhara & Exalted Resilience",
      planets: "Exalted Moon (Taurus) and Rahu in 6th House",
      effect: "Invincible crisis management, immune to corporate office politics, unshakeable mental grace under intense pressure."
    },
    {
      name: "Saturnian Anchor of Permanence",
      planets: "Retrograde Saturn in 7th House Gemini",
      effect: "Protects against premature, superficial entanglements. Solidifies deep, unshakeable marital longevity and shared purpose."
    }
  ],

  roadmapTenYears: [
    {
      year: "2026–2027",
      age: "23.9 – 24.9",
      dasha: "Rahu-Jupiter -> Rahu-Saturn",
      transits: "Saturn in Pisces (4H), Jupiter in Leo (9H aspecting Lagna)",
      focus: "Rapid AI engineering recognition on TCS Michigan project, initial US workshop/travel windows open, intellectual courtship spark."
    },
    {
      year: "2027–2028",
      age: "24.9 – 25.9",
      dasha: "Rahu-Saturn",
      transits: "Saturn enters Aries (5H), Jupiter in Virgo (10H conjoining Mars)",
      focus: "Architectural ownership, increased technical responsibility, rising Sade Sati phase demands disciplined sleep/fitness, serious relationship vetting."
    },
    {
      year: "2028–2029",
      age: "25.9 – 26.9",
      dasha: "Rahu-Saturn",
      transits: "Jupiter enters Libra (11H conjoining Venus!), Saturn in Aries",
      focus: "Major career promotion to Senior Engineer / Tech Lead; premier compensation escalation; PRIME ENGAGEMENT & MARRIAGE WINDOW A."
    },
    {
      year: "2029–2030",
      age: "26.9 – 27.9",
      dasha: "Rahu-Saturn -> Rahu-Mercury",
      transits: "Saturn in Taurus (6H), Jupiter in Scorpio (12H activating Sun-Merc)",
      focus: "Paramount International Relocation window; extended onsite posting to United States; marital solemnization."
    },
    {
      year: "2030–2031",
      age: "27.9 – 28.9",
      dasha: "Rahu-Mercury",
      transits: "Saturn in Taurus (6H), Jupiter in Sagittarius (1H Guru Bala!)",
      focus: "PRIME SOLEMNIZATION WINDOW B: Grand wedding celebrations; global technical eminence; establishing shared home."
    },
    {
      year: "2031–2032",
      age: "28.9 – 29.9",
      dasha: "Rahu-Mercury",
      transits: "Saturn in Taurus (6H), Jupiter in Capricorn (2H)",
      focus: "Real estate & asset investments; senior engineering leadership; domestic bliss."
    },
    {
      year: "2032–2033",
      age: "29.9 – 30.9",
      dasha: "Rahu-Ketu",
      transits: "Saturn in Gemini (7H), Jupiter in Aquarius (3H)",
      focus: "Architectural breakthroughs, patent/systems innovation, quiet domestic harmony."
    },
    {
      year: "2033–2036",
      age: "30.9 – 33.9",
      dasha: "Rahu-Venus",
      transits: "Jupiter transits Pisces (4H) & Aries (5H)",
      focus: "Golden Era of Wealth & Romance: Dhana Yoga activated, executive equity vesting, luxury international travel, birth of first child, Principal Architect/Director track."
    }
  ]
};

module.exports = chartData;
