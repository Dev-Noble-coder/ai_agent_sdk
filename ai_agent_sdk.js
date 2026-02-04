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
  // === Get current route ===
  const route = window.location.pathname;

  // === Helper function to get buttons and links inside a container ===
  function getButtons(container) {
    const buttons = container.querySelectorAll("button, a");
    const btnList = [];
    buttons.forEach(btn => {
      const text = btn.innerText.trim();
      if (text) {
        btnList.push({
          text: text,
          id: btn.id || null,
          className: btn.className || null,
          tag: btn.tagName
        });
      }
    });
    return btnList;
  }

  // === Helper function to get sections ===
  function getSections() {
    const sections = document.querySelectorAll("section, div"); // basic containers
    const result = [];

    sections.forEach(sec => {
      // Only include sections with visible text or buttons
      const text = sec.innerText.trim();
      const buttons = getButtons(sec);
      if (text || buttons.length > 0) {
        result.push({
          sectionTitle: sec.getAttribute("id") || sec.getAttribute("class") || "unknown",
          content: text ? text.substring(0, 200) : "", // limit content preview
          buttons: buttons
        });
      }
    });

    return result;
  }

  // === Build structured JSON ===
  const pageStructure = {
    route: route,
    timestamp: new Date().toISOString(),
    sections: getSections()
  };

  // === Log it nicely ===
  console.log("Page Structure JSON:");
  console.log(JSON.stringify(pageStructure, null, 2));
})();

