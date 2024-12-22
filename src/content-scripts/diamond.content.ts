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

  const functionSelector = (document.getElementById("get-all-diamond-sub-addresses-selector") as HTMLInputElement)?.value;
  const functionName = (document.getElementById("get-all-diamond-sub-addresses-name") as HTMLInputElement)?.value;

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

    // Add the tabs and content after successful module loading
    renderDiamondElements(modules as string[]);

    diamondConfig?.insertAdjacentHTML("beforeend", `<div class="diamond-status text-cap mt-2" style="font-size: 0.6rem; color: green;">Diamond loaded successfully</div>`);
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
        </details>`,
    );
  }
}

// New function to generate multiple iframes HTML
function generateIframesHtml(modules: string[], type: "read" | "write") {
  return modules
    .map(
      (moduleAddress, index) => `
    <iframe 
      width="100%" 
      id="${type}diamondcontractiframe_${index}" 
      data-address="${address}"
      data-module-address="${moduleAddress}"
      src="" 
      frameborder="0" 
      scrolling="yes" 
    ></iframe>
  `,
    )
    .join("");
}

// New function to render tabs and content
function renderDiamondElements(modules: string[]) {
  // Add the original tabs HTML
  const contractTabs = document.getElementById("nav_subtabs");
  if (contractTabs) {
    contractTabs.insertAdjacentHTML("beforeend", tabsHtml);
  }

  // Add the original content HTML
  const contracts = document.getElementById("contracts")?.firstElementChild;
  if (contracts) {
    contracts.insertAdjacentHTML("beforeend", contentHtml);

    // Add multiple iframes to the read container
    const readContainer = document.querySelector("#readDiamondContract .table-responsive");
    if (readContainer) {
      readContainer.innerHTML = generateIframesHtml(modules, "read");
      if (window.location.hash == "#readDiamond") {
        (document.querySelector('#ContentPlaceHolder1_li_readDiamond a') as HTMLAnchorElement)?.click();
      }
    }

    // Add multiple iframes to the write container
    const writeContainer = document.querySelector("#writeDiamondContract .table-responsive");
    if (writeContainer) {
      writeContainer.innerHTML = generateIframesHtml(modules, "write");
      if (window.location.hash == "#writeDiamond") {
        (document.querySelector('#ContentPlaceHolder1_li_writeDiamond a') as HTMLAnchorElement)?.click();
      }
    }
  }
}

async function renderDiamondUI() {
  const overviewSelector = "#ContentPlaceHolder1_divSummary > div.row.g-3.mb-4 > div:nth-child(1) > div > div";

  const overviewElement = document.querySelector(overviewSelector);
  if (overviewElement) {
    overviewElement.insertAdjacentHTML(
      "beforeend",
      `<details id="diamond-config">
        <summary class="text-cap mb-1">Diamond Config</summary>
        <div class="mt-2">
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
        </div>
      </details>`,
    );

    // Load saved configuration for this address
    const herodotusData = await getHerodotusData();
    const savedConfig = herodotusData?.contractConfigs?.[address];

    if (savedConfig) {
      const selectorInput = document.getElementById("get-all-diamond-sub-addresses-selector") as HTMLInputElement;
      const nameInput = document.getElementById("get-all-diamond-sub-addresses-name") as HTMLInputElement;

      if (selectorInput && nameInput) {
        selectorInput.value = savedConfig.functionSelector;
        nameInput.value = savedConfig.functionName;
      }
    }
  }

  // Add click event listener for the button
  document.getElementById("get-all-diamond-sub-addresses-button")?.addEventListener("click", getDiamondModuleAddresses);

  await getDiamondModuleAddresses();
}

document.addEventListener(
  "hdiamondloaded" as keyof DocumentEventMap,
  ((event: CustomEvent<{ modules: string[] }>) => console.log("💎 Diamond loaded:", event.detail.modules)) as EventListener,
);

window.onload = () => {
  renderDiamondUI();
};

const tabsHtml = `
    <li id="ContentPlaceHolder1_li_readDiamond" class="nav-item snap-align-start" role="presentation">
        <a class="nav-link" href="javascript:;" data-bs-toggle="pill" data-bs-target="#readDiamond" type="button" role="tab" aria-controls="readDiamond" aria-selected="false" onclick="javascript:updatehash('readDiamond');showLoader(window.readDiamondContractLoaded);loadIframeSourceDiamondRead();" tabindex="-1">Read as Diamond 🛰️<span class="d-none d-sm-inline-block"></span>
        </a>
    </li>
    <li id="ContentPlaceHolder1_li_writeDiamond" class="nav-item snap-align-start" role="presentation">
        <a class="nav-link" href="javascript:;" data-bs-toggle="pill" data-bs-target="#writeDiamond" type="button" role="tab" aria-controls="writeDiamond" aria-selected="false" onclick="javascript:updatehash('writeDiamond');showLoader(window.writeDiamondContractLoaded);loadIframeSource5();" tabindex="-1">Write as Diamond 🛰️<span class="d-none d-sm-inline-block"></span>
        </a>
    </li>
`;

const contentHtml = `
    <div class="tab-pane" id="readDiamondContract" style="display:none;">
        <div><span id="ContentPlaceHolder1_readDiamondMessage"></span></div>
        <div id="loadingReadDiamondContractframe" style="position:absolute; left:50%; margin-left:-31px">
            <!-- Spinner --><div id="overlayReadDiamondContract" class="text-center py-10 "><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><div class="small text-muted mt-1">Loading</div></div><!-- End Spinner -->
        </div>
        <div id="readdiamondcontractiframe" class="table-responsive" style=" visibility:hidden; line-height:0;">
        </div>
    </div>
    <div class="tab-pane" id="writeDiamondContract" style="display:none;">
        <div><span id="ContentPlaceHolder1_writeDiamondMessage"></span></div>
        <div id="loadingWriteDiamondContractframe" style="position:absolute; left:50%; margin-left:-31px">
            <!-- Spinner --><div id="overlayWriteDiamondContract" class="text-center py-10 "><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><div class="small text-muted mt-1">Loading</div></div><!-- End Spinner -->
        </div>
        <div id="writediamondcontractiframe" class="table-responsive" style=" visibility:hidden; line-height:0;">
        </div>
    </div>
`;
