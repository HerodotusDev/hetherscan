console.log("✅ diamond.content.ts");

const address = window.location.pathname.split("/")[2];
console.log("✅ address", address);

function updateCurrentTab() {
  const currentTab = window.location.hash.slice(1);
  if (currentTab !== window.herodotus.routeObserver?.currentTab) {
    window.herodotus.routeObserver!.currentTab = currentTab;
    console.log("🎯 Tab Changed:", currentTab);
  }
}

function initializeListeners() {
  const observer = new MutationObserver(updateCurrentTab);

  observer.observe(document, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true,
  });

  window.herodotus = window.herodotus || {};
  window.herodotus.routeObserver = observer;
  updateCurrentTab();
}

initializeListeners();
