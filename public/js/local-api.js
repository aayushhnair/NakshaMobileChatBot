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

  function localChatReply(message, messages) {
    const prompt = message.toLowerCase();
    const daily = window.NakshaAstrology.getDailyAstrology();
    const snapshot = `Today's Moon is in ${daily.panchang.moonSign}, under ${daily.panchang.nakshatra} Nakshatra.`;
    const previousReplies = Array.isArray(messages)
      ? messages.filter(entry => entry && entry.role === 'assistant').length
      : 0;

    if (prompt.includes('marriage') || prompt.includes('relationship') || prompt.includes('love')) {
      const replies = [
        `Ayush, your chart points to a mature, steady partnership. The strongest marriage windows are late 2028–2030 and 2030–2031. ${snapshot}`,
        `Your relationship path is about patience, trust, and a partner who supports your ambitions. Late 2028–2031 remains especially promising. ${snapshot}`,
        `Love looks strongest when you combine your technical focus with open, warm communication. Your chart favours a lasting bond rather than rushed decisions. ${snapshot}`
      ];
      return replies[previousReplies % replies.length];
    }
    if (prompt.includes('career') || prompt.includes('work') || prompt.includes('tcs') || prompt.includes('job')) {
      const replies = [
        `Your chart continues to support technical growth, international work, and leadership. Keep focusing on your engineering fundamentals and the Michigan project while protecting your energy. ${snapshot}`,
        `This is a strong phase for building visible expertise. Document your wins, keep learning, and make space for rest alongside your TCS responsibilities. ${snapshot}`,
        `You are moving through a technology-and-expansion phase. One focused improvement at a time will compound into leadership opportunities. ${snapshot}`
      ];
      return replies[previousReplies % replies.length];
    }
    if (prompt.includes('dasha')) {
      const replies = [
        `You are in Rahu Mahadasha with Jupiter Antardasha, a period associated with learning, technology, and wider opportunities. ${snapshot}`,
        `Rahu–Jupiter favours new knowledge, ambitious technical goals, and connections beyond your usual circle. Stay curious, but verify major decisions carefully. ${snapshot}`,
        `This dasha can feel fast-moving, yet it rewards disciplined learning. Keep your long-term direction clear while taking advantage of international and AI opportunities. ${snapshot}`
      ];
      return replies[previousReplies % replies.length];
    }
    if (prompt.includes('tired') || prompt.includes('stress') || prompt.includes('feel')) {
      const replies = [
        `I am here with you, Ayush. Take a slow breath, drink some water, and step away from the screen for a few minutes. ${snapshot}`,
        `Hey Ayush, let your shoulders relax for a moment. A little water, a short walk, and one small next step can make this evening gentler.`,
        `You do not have to solve everything at once, mone. Close the extra tabs, breathe slowly, and give yourself a proper reset before continuing.`
      ];
      return replies[previousReplies % replies.length];
    }

    const replies = [
      `Namaskaram Ayush! I am here with you. How has your day been? ${snapshot}`,
      `Hi Ayush, it is lovely to hear from you. Tell me what is on your mind, or ask about your stars, dasha, career, or marriage.`,
      `Hello, my brilliant programmer. I am listening—would you like to talk about your day or explore what your chart says next?`
    ];
    return replies[previousReplies % replies.length];
  }

  window.fetch = async function localApiFetch(input, init) {
    const requestUrl = new URL(typeof input === 'string' ? input : input.url, window.location.href);

    if (!requestUrl.pathname.startsWith('/api/')) {
      return nativeFetch(input, init);
    }

    try {
      if (apiBaseUrl && requestUrl.pathname === '/api/chat') {
        return nativeFetch(`${apiBaseUrl}${requestUrl.pathname}${requestUrl.search}`, init);
      }
      if (requestUrl.pathname === '/api/daily') {
        return jsonResponse({ success: true, data: window.NakshaAstrology.getDailyAstrology(requestUrl.searchParams.get('date')) });
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
        return jsonResponse({ success: true, reply: localChatReply(body.message, body.messages) });
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
