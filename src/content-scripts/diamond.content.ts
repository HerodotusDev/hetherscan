async function renderDiamondUI() {
  const address = window.location.pathname.split("/")[2];
  const tab = window.herodotus.routeObserver?.currentTab;

  switch (tab) {
    case "readContract":
      console.log("✅ readContract", address, tab);
      break;
    case "writeContract":
      console.log("✅ writeContract", address, tab);
      break;
    default:
      break;
  }
}

document.addEventListener(
  "htabchange" as keyof DocumentEventMap,
  ((_: CustomEvent<{ currentTab: string }>) => {
    renderDiamondUI();
  }) as EventListener
);
