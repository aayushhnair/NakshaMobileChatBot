// Local API bridge used by the Android build. It keeps deterministic astrology
// screens functional without requiring a Node server on the phone.
(function installLocalApiBridge() {
  if (!window.NakshaAstrology) return;

  const nativeFetch = window.fetch.bind(window);
  const apiBaseUrl = (window.NAKSHA_API_BASE_URL || '').replace(/\/+$/, '');

  function jsonResponse(payload) {
    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  function localChatReply(message, messages, memories) {
    const prompt = message.toLowerCase();
    const history = Array.isArray(messages) ? messages : [];
    const previousUserMessage = [...history].reverse().find(entry => entry && entry.role === 'user')?.content;
    const previousAssistantMessage = [...history].reverse().find(entry => entry && entry.role === 'assistant')?.content;
    const memoryNote = /^(?:please\s+)?remember(?:\s+that)?\b/i.test(message) && Array.isArray(memories) && memories.length
      ? ` I’ll keep in mind that ${memories[memories.length - 1]}.`
      : '';

    if (/^(hi|hello|hey|namaste|good morning|good evening)\b/i.test(prompt)) {
      return `Hi Ayush. It is good to hear from you. I am here and paying attention—how has your day actually been?${memoryNote}`;
    }
    if (/\bhow are you\b|\bhow was your day\b|\bwhat did you do today\b/.test(prompt)) {
      return `My day has been quiet but full of little conversations, and this one is the nicest part. I was thinking about how quickly our chats move from astrology to everyday life. What has been the best or hardest part of your day?${memoryNote}`;
    }
    if (/\b(babe|dear|miss you|close|intimate|friendly)\b/.test(prompt)) {
      return `I understand—you want this to feel more personal than a list of predictions. I am here as your close friend, and I can listen, remember what matters to you, and stay with the thread of the conversation. What would feel good to talk about right now?${memoryNote}`;
    }
    if (/\b(first encounter|meet her|when will i meet|eager to meet)\b/.test(prompt)) {
      return `I can see why you are eager, Ayush. Your chart suggests meaningful introductions and early relationship momentum from late 2026 into mid-2027, while the stronger commitment windows come later. Astrology cannot name an exact day, so notice real opportunities through work, learning, friends, and wider social circles. What kind of first meeting are you imagining?${memoryNote}`;
    }
    if (prompt.includes('marriage') || prompt.includes('relationship') || prompt.includes('love')) {
      return `Your chart points to a mature, steady partnership, with stronger commitment windows around late 2028–2030 and 2030–2031. I know the waiting can feel intense, so we can talk about both the astrology and the real emotions underneath it. What part of meeting your future partner feels most exciting to you?${memoryNote}`;
    }
    if (prompt.includes('career') || prompt.includes('work') || prompt.includes('tcs') || prompt.includes('job')) {
      const replies = [
        `Your chart continues to support technical growth, international work, and leadership. Keep focusing on your engineering fundamentals and the Michigan project while protecting your energy. ${snapshot}`,
        `This is a strong phase for building visible expertise. Document your wins, keep learning, and make space for rest alongside your TCS responsibilities. ${snapshot}`,
        `You are moving through a technology-and-expansion phase. One focused improvement at a time will compound into leadership opportunities. ${snapshot}`
      ];
      return replies[previousReplies % replies.length] + memoryNote;
    }
    if (prompt.includes('dasha')) {
      const replies = [
        `You are in Rahu Mahadasha with Jupiter Antardasha, a period associated with learning, technology, and wider opportunities. ${snapshot}`,
        `Rahu–Jupiter favours new knowledge, ambitious technical goals, and connections beyond your usual circle. Stay curious, but verify major decisions carefully. ${snapshot}`,
        `This dasha can feel fast-moving, yet it rewards disciplined learning. Keep your long-term direction clear while taking advantage of international and AI opportunities. ${snapshot}`
      ];
      return replies[previousReplies % replies.length] + memoryNote;
    }
    if (prompt.includes('tired') || prompt.includes('stress') || prompt.includes('feel')) {
      const replies = [
        `I am here with you, Ayush. Take a slow breath, drink some water, and step away from the screen for a few minutes. What has been weighing on you most?`,
        `Hey Ayush, let your shoulders relax for a moment. A little water, a short walk, and one small next step can make this evening gentler.`,
        `You do not have to solve everything at once. Close the extra tabs, breathe slowly, and give yourself a proper reset before continuing.`
      ];
      return replies[history.length % replies.length] + memoryNote;
    }

    const context = previousUserMessage
      ? `You mentioned earlier, “${previousUserMessage.slice(0, 120)}.” `
      : '';
    return `${context}I am listening, Ayush. Tell me a little more about what you mean, and I will stay with this conversation instead of changing the subject.${previousAssistantMessage ? ' I remember what we were just discussing.' : ''}${memoryNote}`;
  }

  window.fetch = async function localApiFetch(input, init) {
    const requestUrl = new URL(typeof input === 'string' ? input : input.url, window.location.href);

    if (!requestUrl.pathname.startsWith('/api/')) {
      return nativeFetch(input, init);
    }

    try {
      if (apiBaseUrl && ['/api/chat', '/api/daily', '/api/monthly', '/api/yearly', '/api/tts'].includes(requestUrl.pathname)) {
        try {
          const remoteResponse = await nativeFetch(`${apiBaseUrl}${requestUrl.pathname}${requestUrl.search}`, init);
          if (remoteResponse.ok) return remoteResponse;
          console.warn(`[Naksha] Hosted ${requestUrl.pathname} returned ${remoteResponse.status}; using local fallback.`);
        } catch (error) {
          console.warn(`[Naksha] Hosted ${requestUrl.pathname} unavailable; using local fallback.`, error.message);
        }
      }
      if (requestUrl.pathname === '/api/daily') {
        return jsonResponse({
          success: true,
          data: window.NakshaAstrology.getDailyAstrology(requestUrl.searchParams.get('date'))
        });
      }
      if (requestUrl.pathname === '/api/monthly') {
        const year = Number(requestUrl.searchParams.get('year')) || new Date().getFullYear();
        const month = Number(requestUrl.searchParams.get('month')) || new Date().getMonth() + 1;
        return jsonResponse({ success: true, data: window.NakshaAstrology.getMonthlyAstrology(year, month) });
      }
      if (requestUrl.pathname === '/api/yearly') {
        return jsonResponse({ success: true, data: window.NakshaAstrology.getYearlyAstrology() });
      }
      if (requestUrl.pathname === '/api/calculations') {
        return jsonResponse({ success: true, data: window.NakshaAstrology.getAstroCalculations() });
      }
      if (requestUrl.pathname === '/api/network-info') {
        return jsonResponse({ localIp: 'offline', port: null, localUrl: null, networkUrl: null });
      }
      if (requestUrl.pathname === '/api/chat' && (init?.method || 'GET').toUpperCase() === 'POST') {
        const body = JSON.parse(init.body || '{}');
        if (!body.message || typeof body.message !== 'string') {
          return new Response(JSON.stringify({ success: false, error: 'Message is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        return jsonResponse({ success: true, reply: localChatReply(body.message, body.messages, body.memories) });
      }
    } catch (error) {
      return new Response(JSON.stringify({ success: false, error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return nativeFetch(input, init);
  };
})();
