/**
 * AI SDK - Modular Version
 * Built for React, Next.js, and Vanilla HTML
 */

const AISDK = (function() {
  // --- 1. State Management (High Cohesion: Identity & State) ---
  const state = {
    siteKey: document.currentScript?.dataset?.key || "default_key",
    sessionId: localStorage.getItem("ai_session") || crypto.randomUUID(),
    lastPath: window.location.pathname
  };

  const initStorage = () => {
    localStorage.setItem("ai_session", state.sessionId);
  };

  // --- 2. Scraper Engine (High Cohesion: Data Extraction) ---
  const Scraper = {
    getButtons: (container) => {
      return Array.from(container.querySelectorAll("button, a"))
        .map(btn => ({
          text: btn.innerText.trim(),
          id: btn.id || null,
          tag: btn.tagName
        }))
        .filter(b => b.text);
    },

    getSections: () => {
      const containers = document.querySelectorAll("section, main, [role='main'], .container");
      return Array.from(containers).map(c => ({
        id: c.id || c.className || "unknown",
        text: c.innerText.substring(0, 100),
        buttons: Scraper.getButtons(c)
      }));
    },

    serializePage: () => ({
      route: window.location.pathname,
      timestamp: new Date().toISOString(),
      sections: Scraper.getSections()
    })
  };

  // --- 3. Event Orchestrator (Low Coupling: Linking Events to Scraper) ---
  const Observer = {
    debounceTimeout: null,

    handleUpdate: () => {
      clearTimeout(Observer.debounceTimeout);
      Observer.debounceTimeout = setTimeout(() => {
        const data = Scraper.serializePage();
        console.group(`🔍 SDK Scan: ${data.route}`);
        console.dir(data);
        console.groupEnd();
      }, 800);
    },

    watchMutations: () => {
      const observer = new MutationObserver((mutations) => {
        const significant = mutations.some(m => m.addedNodes.length > 0);
        if (significant) Observer.handleUpdate();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    },

    watchRoutes: () => {
      // Logic for SPAs (React/Next)
      const patch = (type) => {
        const orig = history[type];
        return function() {
          const rv = orig.apply(this, arguments);
          if (state.lastPath !== window.location.pathname) {
            state.lastPath = window.location.pathname;
            Observer.handleUpdate();
          }
          return rv;
        };
      };
      history.pushState = patch('pushState');
      history.replaceState = patch('replaceState');
      window.addEventListener("popstate", () => Observer.handleUpdate());
    }
  };

  // --- 4. Public API / Boot ---
  return {
    start: () => {
      initStorage();
      Observer.watchMutations();
      Observer.watchRoutes();
      Observer.handleUpdate(); // Initial scan
      console.log("✅ AI SDK Started");
    }
  };
})();

AISDK.start();