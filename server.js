// server.js
// Naksha Jathakam - Personalized Vedic Astrology & Soulmate Companion Server
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const os = require('os');
const qrcode = require('qrcode-terminal');

const { getDailyAstrology, getMonthlyAstrology, getYearlyAstrology, getAstroCalculations } = require('./services/astrologyEngine');
const { chatWithNaksha, synthesizeNakshaVoice } = require('./services/geminiService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper to get local network IP
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // skip internal and non-ipv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// API Routes
app.get('/api/daily', (req, res) => {
  try {
    const { date } = req.query;
    const dailyData = getDailyAstrology(date);
    res.json({ success: true, data: dailyData });
  } catch (err) {
    console.error('Error in /api/daily:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/monthly', (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const month = parseInt(req.query.month) || (new Date().getMonth() + 1);
    const monthlyData = getMonthlyAstrology(year, month);
    res.json({ success: true, data: monthlyData });
  } catch (err) {
    console.error('Error in /api/monthly:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/yearly', (req, res) => {
  try {
    const yearlyData = getYearlyAstrology();
    res.json({ success: true, data: yearlyData });
  } catch (err) {
    console.error('Error in /api/yearly:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/calculations', (req, res) => {
  try {
    const calculations = getAstroCalculations();
    res.json({ success: true, data: calculations });
  } catch (err) {
    console.error('Error in /api/calculations:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, messages, memories } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const reply = await chatWithNaksha(messages || [], message, memories || []);
    res.json({ success: true, reply });
  } catch (err) {
    console.error('Error in /api/chat:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Error communicating with Naksha AI'
    });
  }
});

app.post('/api/tts', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ success: false, error: 'Text is required' });
    }
    if (text.length > 4000) {
      return res.status(400).json({ success: false, error: 'Text is too long for voice playback' });
    }

    const audio = await synthesizeNakshaVoice(text);
    res.json({ success: true, ...audio });
  } catch (err) {
    console.error('Error in /api/tts:', err);
    res.status(502).json({
      success: false,
      error: err.message || 'Error generating Naksha voice'
    });
  }
});

app.get('/api/network-info', (req, res) => {
  const localIp = getLocalIpAddress();
  res.json({
    localIp,
    port: PORT,
    localUrl: `http://localhost:${PORT}`,
    networkUrl: `http://${localIp}:${PORT}`
  });
});

// Fallback to index.html for SPA routes (Express 5 compatible wildcard)
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
if (require.main === module) {
  app.listen(PORT, '0.0.0.0', () => {
  const localIp = getLocalIpAddress();
  const networkUrl = `http://${localIp}:${PORT}`;
  const localUrl = `http://localhost:${PORT}`;

  console.log('\n======================================================');
  console.log('✨ DEVIKA JATHAKAM — Cosmic Soulmate App Started! ✨');
  console.log('======================================================');
  console.log(`💻 Local Access:    ${localUrl}`);
  console.log(`📱 Android Mobile:  ${networkUrl}`);
  console.log('------------------------------------------------------');
  console.log('📲 Scan this QR code on your Android phone (same WiFi):');
  qrcode.generate(networkUrl, { small: true });
  console.log('------------------------------------------------------');
  console.log('💡 How to install as Native App on Android:');
  console.log('1. Open Chrome on Android and visit ' + networkUrl);
  console.log('2. Tap the 3-dots menu -> "Install App" or "Add to Home Screen"');
  console.log('3. Naksha will be installed with her full app icon on your phone!');
  console.log('======================================================\n');
  });
}

module.exports = app;
