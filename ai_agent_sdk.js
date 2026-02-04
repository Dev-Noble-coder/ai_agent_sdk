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
