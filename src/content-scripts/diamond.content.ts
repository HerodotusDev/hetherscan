import { createPublicClient, http, parseAbi } from "viem";
import { sepolia } from "viem/chains";
import { getHerodotusData, setHerodotusData } from "../misc";

const address = window.location.pathname.split("/")[2];

async function getDiamondModuleAddresses() {
  // Remove any existing status messages (both success and error)
  const existingStatuses = document.querySelectorAll(".diamond-status");
  existingStatuses.forEach((status) => status.remove());

  const diamondConfig = document.getElementById("diamond-config");

  const client = createPublicClient({
    transport: http("https://ethereum-sepolia.publicnode.com"),
    chain: sepolia,
  });

  const functionSelector = (
    document.getElementById(
      "get-all-diamond-sub-addresses-selector"
    ) as HTMLInputElement
  )?.value;
  const functionName = (
    document.getElementById(
      "get-all-diamond-sub-addresses-name"
    ) as HTMLInputElement
  )?.value;

  try {
    const modules = await client.readContract({
      address: address as `0x${string}`,
      abi: parseAbi([functionSelector]),
      functionName: functionName,
    });

    const { contractConfigs } = await getHerodotusData();
    contractConfigs[address] = {
      functionSelector,
      functionName,
    };
    await setHerodotusData({ contractConfigs });

    window.herodotus.diamond = window.herodotus.diamond || {};
    window.herodotus.diamond.moduleAddresses = modules;

    const event = new CustomEvent("hdiamondloaded", {
      detail: { modules },
    });
    document.dispatchEvent(event);

    diamondConfig?.insertAdjacentHTML(
      "beforeend",
      `<div class="diamond-status text-cap mt-2" style="font-size: 0.6rem; color: green;">Diamond loaded successfully</div>`
    );
  } catch (error) {
    console.error("Error fetching modules:", error);
    diamondConfig?.insertAdjacentHTML(
      "beforeend",
      `
        <details class="diamond-status">
          <summary class="text-cap mt-2" style="font-size: 0.6rem; color: red;">Diamond loading failed</summary>
          <div class="diamond-status-message mt-1 opacity-75" style="font-size: 0.5rem; color: red;">Error: ${
            error instanceof Error ? error.message : "Failed to load diamond"
          }</div>
        </details>`
    );
  }
}

async function renderDiamondUI() {
  const tab = window.herodotus.routeObserver?.currentTab;

  const overviewSelector =
    "#ContentPlaceHolder1_divSummary > div.row.g-3.mb-4 > div:nth-child(1) > div > div";

  const overviewElement = document.querySelector(overviewSelector);
  if (overviewElement) {
    overviewElement.insertAdjacentHTML(
      "beforeend",
      `<div id="diamond-config">
        <h4 class="text-cap mb-1">Diamond Config</h4>
        <div class="mb-2">
          <label class="text-cap opacity-75" style="font-size: 0.6rem;">Enter function selector</label>
          <input type="text" class="form-control" id="get-all-diamond-sub-addresses-selector" 
            value="function facetAddresses() external view returns (address[] memory facetAddresses_)"
            placeholder="Enter function selector">
        </div>
        <div class="d-flex gap-2">
          <div class="flex-grow-1">
            <label class="text-cap opacity-75" style="font-size: 0.6rem;">Enter function name</label>
            <input type="text" class="form-control" id="get-all-diamond-sub-addresses-name" 
              value="facetAddresses"
              placeholder="Enter function name">
          </div>
          <div class="d-flex align-items-end">
            <button class="btn btn-primary" id="get-all-diamond-sub-addresses-button">Load</button>
          </div>
        </div>
      </div>`
    );

    // Load saved configuration for this address
    const herodotusData = await getHerodotusData();
    const savedConfig = herodotusData?.contractConfigs?.[address];

    if (savedConfig) {
      const selectorInput = document.getElementById(
        "get-all-diamond-sub-addresses-selector"
      ) as HTMLInputElement;
      const nameInput = document.getElementById(
        "get-all-diamond-sub-addresses-name"
      ) as HTMLInputElement;

      if (selectorInput && nameInput) {
        selectorInput.value = savedConfig.functionSelector;
        nameInput.value = savedConfig.functionName;
      }
    }
  }

  // Add click event listener for the button
  document
    .getElementById("get-all-diamond-sub-addresses-button")
    ?.addEventListener("click", getDiamondModuleAddresses);

  await getDiamondModuleAddresses();
}

document.addEventListener(
  "hdiamondloaded" as keyof DocumentEventMap,
  ((event: CustomEvent<{ modules: string[] }>) =>
    console.log("💎 Diamond loaded:", event.detail.modules)) as EventListener
);

document.addEventListener(
  "htabchange" as keyof DocumentEventMap,
  ((_: CustomEvent<{ currentTab: string }>) => {
    renderDiamondUI();
  }) as EventListener
);
