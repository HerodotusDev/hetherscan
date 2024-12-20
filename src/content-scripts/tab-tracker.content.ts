function updateCurrentTab() {
  const currentTab = window.location.hash.slice(1);
  if (currentTab !== window.herodotus.routeObserver?.currentTab) {
    window.herodotus.routeObserver!.currentTab = currentTab;
    const event = new CustomEvent("htabchange", {
      detail: { currentTab },
    });
    document.dispatchEvent(event);
  }
}

document.addEventListener(
  "htabchange" as keyof DocumentEventMap,
  ((event: CustomEvent<{ currentTab: string }>) => console.log("🎯 Tab Changed:", event.detail.currentTab)) as EventListener,
);

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
