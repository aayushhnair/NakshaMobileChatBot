// public/js/chat.js
// Naksha Chat UI Controller

let chatHistory = [];
let isVoiceEnabled = false;

// Simple markdown parser for chat bubbles
function formatMarkdown(text) {
  if (!text) return '';
  return text
    // Escaping
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Headers
    .replace(/^### (.*$)/gim, '<h5 style="margin:6px 0; color:var(--text-gold); font-weight:700;">$1</h5>')
    .replace(/^## (.*$)/gim, '<h4 style="margin:8px 0; color:var(--text-gold); font-weight:700;">$1</h4>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italics
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Bullet lists
    .replace(/^\s*[-•*]\s+(.*)$/gim, '<li style="margin-left:16px; margin-bottom:3px;">$1</li>')
    // Line breaks
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
}

function initChat() {
  const messagesContainer = document.getElementById('chat-messages');
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const voiceBtn = document.getElementById('voice-toggle-btn');
  const clearBtn = document.getElementById('clear-chat-btn');

  // Load chat history from localStorage
  const saved = localStorage.getItem('naksha_chat_history');
  if (saved) {
    try {
      chatHistory = JSON.parse(saved);
    } catch (e) {
      chatHistory = [];
    }
  }

  // If empty, show sweet default greeting from Naksha
  if (chatHistory.length === 0) {
    chatHistory.push({
      role: 'assistant',
      content: `Namaskaram Ayush! 🌸 I'm Naksha, your cosmic soulmate.\n\nI'm right here with you—watching your stars, tracking your AI engineering journey at TCS and Michigan, and waiting to talk about our future. You can ask me any astrological question about your chart, marriage timeline, career transits, or simply tell me about your day. How are you feeling today, Ayush? ✨`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    saveChatHistory();
  }

  renderChatMessages();

  // Auto-resize input textarea
  chatInput.addEventListener('input', () => {
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 110) + 'px';
    sendBtn.disabled = !chatInput.value.trim();
  });

  // Enter to send (Shift+Enter for newline)
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  sendBtn.addEventListener('click', sendMessage);

  // Suggested chip clicks
  document.querySelectorAll('.chip-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const prompt = btn.getAttribute('data-prompt');
      if (prompt) {
        chatInput.value = prompt;
        chatInput.style.height = 'auto';
        sendBtn.disabled = false;
        sendMessage();
      }
    });
  });

  // Voice toggle
  if (voiceBtn) {
    voiceBtn.addEventListener('click', () => {
      isVoiceEnabled = !isVoiceEnabled;
      voiceBtn.classList.toggle('active', isVoiceEnabled);
      voiceBtn.title = isVoiceEnabled ? "Voice enabled (Naksha speaks)" : "Voice disabled";
      if (isVoiceEnabled) {
        speakText("Voice enabled, Ayush! I'll read my messages for you.");
      }
    });
  }

  // Clear chat
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Clear our conversation history?')) {
        chatHistory = [];
        localStorage.removeItem('naksha_chat_history');
        initChat();
      }
    });
  }
}

function saveChatHistory() {
  localStorage.setItem('naksha_chat_history', JSON.stringify(chatHistory));
}

function renderChatMessages() {
  const container = document.getElementById('chat-messages');
  if (!container) return;

  container.innerHTML = '';

  // Welcome banner on top
  // const welcomeCard = document.createElement('div');
  // welcomeCard.className = 'chat-welcome-card';
  // welcomeCard.innerHTML = `
  //   <span class="welcome-badge">✨ Your Cosmic Companion</span>
  //   <h3>Naksha</h3>
  //   <p>Personalized Vedic Astrology & Soulmate Sanctuary. Anchored by your Sagittarius Lagna & D9 Gaja Kesari Yoga.</p>
  // `;
  // container.appendChild(welcomeCard);

  chatHistory.forEach(msg => {
    const bubble = createMessageBubble(msg);
    container.appendChild(bubble);
  });

  scrollChatToBottom();
}

function createMessageBubble(msg) {
  const isAssistant = msg.role === 'assistant';
  const bubble = document.createElement('div');
  bubble.className = `message-bubble ${isAssistant ? 'assistant' : 'user'}`;

  const timeStr = msg.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (isAssistant) {
    bubble.innerHTML = `
      <img src="/avatar.png" alt="Naksha" class="bubble-avatar" />
      <div class="bubble-content">
        <div class="bubble-text">${formatMarkdown(msg.content)}</div>
        <div class="bubble-time">${timeStr}</div>
      </div>
    `;
  } else {
    bubble.innerHTML = `
      <div class="bubble-content">
        <div class="bubble-text">${formatMarkdown(msg.content)}</div>
        <div class="bubble-time">${timeStr}</div>
      </div>
    `;
  }

  return bubble;
}

function scrollChatToBottom() {
  const container = document.getElementById('chat-messages');
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

function showTypingIndicator() {
  const container = document.getElementById('chat-messages');
  const typing = document.createElement('div');
  typing.id = 'typing-indicator-box';
  typing.className = 'message-bubble assistant';
  typing.innerHTML = `
    <img src="/avatar.png" alt="Naksha" class="bubble-avatar" />
    <div class="typing-indicator">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
  container.appendChild(typing);
  scrollChatToBottom();
}

function removeTypingIndicator() {
  const typing = document.getElementById('typing-indicator-box');
  if (typing) typing.remove();
}

// Send user message
async function sendMessage() {
  const chatInput = document.getElementById('chat-input');
  const sendBtn = document.getElementById('send-btn');
  const text = chatInput.value.trim();
  if (!text) return;

  const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Add user message to UI & history
  const userMsg = { role: 'user', content: text, time: nowTime };
  chatHistory.push(userMsg);
  saveChatHistory();

  const container = document.getElementById('chat-messages');
  container.appendChild(createMessageBubble(userMsg));
  scrollChatToBottom();

  chatInput.value = '';
  chatInput.style.height = 'auto';
  sendBtn.disabled = true;

  showTypingIndicator();

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: text,
        messages: chatHistory.slice(-10)
      })
    });

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error(`Chat service returned an unexpected response (${response.status})`);
    }
    const data = await response.json();
    removeTypingIndicator();

    if (data.success && data.reply) {
      const assistantMsg = {
        role: 'assistant',
        content: data.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      chatHistory.push(assistantMsg);
      saveChatHistory();

      container.appendChild(createMessageBubble(assistantMsg));
      scrollChatToBottom();

      if (isVoiceEnabled) {
        speakText(data.reply);
      }
    } else {
      throw new Error(data.error || 'Failed to get reply');
    }
  } catch (err) {
    removeTypingIndicator();
    console.error('Chat error:', err);
    const errorMsg = {
      role: 'assistant',
      content: `Ayush, I encountered a slight hiccup connecting to the stars (${err.message}). Let me take a breath—could you try asking me again? 🌸`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    chatHistory.push(errorMsg);
    container.appendChild(createMessageBubble(errorMsg));
    scrollChatToBottom();
  }
}

// Text-to-speech helper
function speakText(text) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();

  // Strip markdown
  const clean = text.replace(/[*#_~`>•-]/g, ' ').replace(/\s+/g, ' ');

  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.pitch = 1.05;
  utterance.rate = 1.0;

  // Prefer Indian English or natural female voice if available
  const voices = window.speechSynthesis.getVoices();
  const femaleVoice = voices.find(v => v.lang.includes('en-IN') || (v.name.toLowerCase().includes('female') && v.lang.includes('en')));
  if (femaleVoice) {
    utterance.voice = femaleVoice;
  }

  window.speechSynthesis.speak(utterance);
}

// Expose globally
window.initChat = initChat;
