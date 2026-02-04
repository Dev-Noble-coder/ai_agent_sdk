(function() {
  const siteKey = document.currentScript.dataset.key;
  let sessionId = localStorage.getItem("ai_session");
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("ai_session", sessionId);
  }

  console.log("AI Agent SDK loaded");
  console.log("Site Key:", siteKey);
  console.log("Session ID:", sessionId);

})();

(function() {
  // Track if we've already logged
  let hasLogged = false;

  // Get current route
  const route = window.location.pathname;

  // Helper to get buttons inside a container
  function getButtons(container) {
    const buttons = container.querySelectorAll("button, a");
    const btnList = [];
    buttons.forEach(btn => {
      const text = btn.innerText.trim();
      if (text) {
        btnList.push({
          text,
          id: btn.id || null,
          className: btn.className || null,
          tag: btn.tagName
        });
      }
    });
    return btnList;
  }

  // Helper to get sections
  function getSections() {
    const containers = document.querySelectorAll("div");
    const result = [];
    containers.forEach(c => {
      // Ignore invisible elements
      const style = window.getComputedStyle(c);
      if (style.display === "none" || style.visibility === "hidden" || c.offsetHeight === 0) return;

      const text = c.innerText.trim();
      const buttons = getButtons(c);
      if (text || buttons.length > 0) {
        result.push({
          sectionTitle: c.id || c.className || "unknown",
          content: text ? text.substring(0, 200) : "",
          buttons
        });
      }
    });
    return result;
  }

  // Scan the page and log JSON
  function scanPage() {
    if (hasLogged) return; // only log once

    const pageStructure = {
      route: window.location.pathname,
      timestamp: new Date().toISOString(),
      sections: getSections()
    };

    console.log("Page Structure JSON:");
    console.log(JSON.stringify(pageStructure, null, 2));

    hasLogged = true;
  }

  // Use MutationObserver to wait for React rendering
  const observer = new MutationObserver(() => {
    scanPage(); // will only log once
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Initial scan in case content is already loaded
  scanPage();
})();



