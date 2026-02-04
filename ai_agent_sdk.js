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
  const route = window.location.pathname;

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

  function getSections() {
    const containers = document.querySelectorAll("div"); // React usually uses divs
    const result = [];
    containers.forEach(c => {
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

  function scanPage() {
    const pageStructure = {
      route: window.location.pathname,
      timestamp: new Date().toISOString(),
      sections: getSections()
    };
    console.log("Page Structure JSON:");
    console.log(JSON.stringify(pageStructure, null, 2));
  }

  // === Observe DOM changes ===
  const observer = new MutationObserver(() => {
    scanPage();
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Initial scan in case some content is already loaded
  scanPage();
})();


