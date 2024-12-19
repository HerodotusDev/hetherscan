console.log("✅ diamond.content.ts");

const address = window.location.pathname.split("/")[2];
console.log("✅ address", address);

function getCurrentTab() {
  // Check hash first
  const hash = window.location.hash.slice(1);
  if (hash) return hash;

  // Check URL for tab indicators
  const url = window.location.href;
  if (url.includes("readContract")) return "readContract";
  if (url.includes("writeContract")) return "writeContract";
  if (url.includes("#code")) return "code";

  return "code"; // default tab
}

// ✅ Function to handle different routes
let routeChangeTimer: NodeJS.Timeout | null = null;

function handleRouteChange() {
  if (routeChangeTimer) {
    clearTimeout(routeChangeTimer);
  }

  routeChangeTimer = setTimeout(() => {
    const currentTab = getCurrentTab();
    console.log("🎯 Tab Changed:", currentTab);
  }, 100);
}

function initializeListeners() {
  const observer = new MutationObserver(() => {
    console.log("🔍 DOM Mutation Event");
    handleRouteChange();
  });

  observer.observe(document, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true,
  });

  window.routeObserver = observer;

  handleRouteChange();
}

initializeListeners();

declare global {
  interface Window {
    routeObserver?: MutationObserver & { lastUrl?: string };
  }
}
