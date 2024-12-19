(function injectScript() {
  const script = document.createElement("script");
  script.src = chrome.runtime.getURL("src/injected.js");
  script.onload = () => script.remove();
  (document.head || document.documentElement).appendChild(script);
})();
