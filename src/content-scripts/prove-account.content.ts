import { getHerodotusData } from "../misc";
import { createNewModal, generateCheckboxes } from "../modal";
import { accountProperties, apiRequestBuilder, getDashboardUrl, HEDODOTUS_URL } from "../storage-slot-api";
import { apiCall } from "../utils/api";

// ░█▄█░█▀█░█▀▄░█▀█░█░░░█▀▀
// ░█░█░█░█░█░█░█▀█░█░░░▀▀█
// ░▀░▀░▀▀▀░▀▀░░▀░▀░▀▀▀░▀▀▀

const createNewModalLocal = (ctx: { id: string; inner: string; title: string }) => {
  let newModal = document.createElement("div");
  newModal = document.createElement("div");
  newModal.classList.add("modal", "fade");
  newModal.setAttribute("tabindex", "-1");
  newModal.id = ctx.id;
  newModal.setAttribute("tabindex", "-1");
  newModal.setAttribute("role", "dialog");

  newModal.innerHTML = `
<div class="modal-dialog">
  <div class="modal-content">
    <div class="modal-header">
        <h5 class="modal-title">${ctx.title}</h5>
        <button type="button" class="btn-close" aria-label="Close" id="close${ctx.id}"></button>
    </div>
      <div class="modal-body">
        ${ctx.inner}
      </div>
      <div class="modal-footer">
        <button id="submit${ctx.id}" class="btn btn-primary">Submit</button>
      </div>
      </div>
    </div>
  </div>
  `;

  return newModal;
};

// Modal creation functions
async function createProveAccountModal(): Promise<HTMLDivElement> {
  const modal = createNewModalLocal({
    id: "proveAccountModal",
    inner: `
      <form id="proveAccountForm">
        <div class="modal-body">
          <div class="form-group">
            <label for="blockNumber">Block Number:</label>
            <input type="number" id="blockNumber" name="blockNumber" class="form-control" required placeholder="e.g. 2137" />
          </div>
        </div>
      </form>
    `,
    title: "Prove Balance",
  });

  document.body.appendChild(modal);
  return modal;
}

async function createProveAllPropertiesModal(): Promise<HTMLDivElement> {
  const modal = createNewModal({
    id: "proveAllModalProperties",
    title: "Prove Account Properties",
    inner: `
      <form id="proveAccountForm">
        <div class="modal-body">
          <div class="form-group">
            <label for="blockNumberAllProperties">Block Number:</label>
            <input type="number" id="blockNumberAllProperties" name="blockNumber" class="form-control" required placeholder="e.g. 2137" />
          </div>
        </div>
        ${generateCheckboxes(accountProperties)}
      </form>
    `,
  });

  document.body.appendChild(modal);
  return modal;
}

// Setup handlers
async function setupModalHandlers(proveAccountModal: HTMLDivElement, proveAllModalProperties: HTMLDivElement) {
  // Prove Account Modal handlers
  document.getElementById(`closeproveAccountModal`)!.onclick = () => {
    proveAccountModal.classList.remove("show");
    proveAccountModal.style.display = "none";
  };

  document.getElementById(`submitproveAccountModal`)!.onclick = onProveAccountModalSubmit;

  // Prove All Properties Modal handlers
  document.getElementById(`closeproveAllModalProperties`)!.onclick = () => {
    proveAllModalProperties.classList.remove("show");
    proveAllModalProperties.style.display = "none";
  };

  document.getElementById(`submitproveAllModalProperties`)!.onclick = onProveAllAccountPropertiesSubmit;

  // Window click handlers
  window.onclick = (event) => {
    if (event.target === proveAccountModal) {
      proveAccountModal.classList.remove("show");
      proveAccountModal.style.display = "none";
    }
    if (event.target === proveAllModalProperties) {
      proveAllModalProperties.classList.remove("show");
      proveAllModalProperties.style.display = "none";
    }
  };
}

// Button creation and setup
async function setupButtons() {
  const mainAddressElement = document.querySelector("#mainaddress");
  // @ts-ignore
  // FIXME: make better selector
  const ethBalanceElement = [...document.querySelectorAll("*")].find((el) => el.textContent.trim() === "ETH Balance");

  if (mainAddressElement) {
    const newButton = createNewButton("proveAllProperties", "🛰️ Prove Account Properties");
    newButton.classList.add("ms-2");
    mainAddressElement.parentNode!.insertBefore(newButton, mainAddressElement.nextSibling);
    document.getElementById("proveAllProperties")?.addEventListener("click", proveAllPropertiesClickHandler);
  }

  if (ethBalanceElement) {
    const newButton = createNewButton("proveEthBalance");
    newButton.classList.add("ms-2");
    const balanceDiv = ethBalanceElement.closest("div")?.querySelector("div > div");
    if (balanceDiv) {
      balanceDiv.style.display = "flex";
      balanceDiv.style.alignItems = "center";
      balanceDiv.appendChild(newButton);
    }
    document.getElementById("proveEthBalance")?.addEventListener("click", proveEthBalanceClickHandler);
  }
}

// Main initialization function
async function initializeProveAccount() {
  const proveAccountModal = await createProveAccountModal();
  const proveAllModalProperties = await createProveAllPropertiesModal();

  await setupModalHandlers(proveAccountModal, proveAllModalProperties);
  await setupButtons();
}

async function onProveAccountModalSubmit() {
  const blockNumberInput = document.getElementById("blockNumber") as HTMLInputElement;
  const blockNumber = parseInt(blockNumberInput.value, 10);

  console.log("Block Number:", blockNumber);

  if (isNaN(blockNumber)) {
    alert("Please enter a valid block number.");
    return;
  }

  const localData = await getHerodotusData();
  if (!localData || !localData.destinationChain) {
    alert("Please ensure you have set up your Herodotus data (destinationChain, API key).");
    return;
  }

  const data = apiRequestBuilder.getAccountProperties({
    account: address,
    blockNumber: blockNumber,
    destinationChainId: localData.destinationChain,
    originChainId: "11155111",
    properties: ["BALANCE"],
  });

  const result = await apiCall(`${HEDODOTUS_URL}/submit-batch-query`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "api-key": localData.apiKey,
    } as HeadersInit,
  });

  alert(`Prove account request submitted. Check the status here: ${getDashboardUrl(result.internalId)}`);
}

async function proveEthBalanceClickHandler() {
  const proveAccountModal = document.getElementById("proveAccountModal") as HTMLDivElement;
  proveAccountModal.classList.add("show");
  proveAccountModal.style.display = "block";

  const blockNumberInput = document.getElementById("blockNumber") as HTMLInputElement;

  // make default block number the latest block
  const latestBlock = await getLatestBlock();
  blockNumberInput.value = (latestBlock! - 50).toString();
}

async function proveAllPropertiesClickHandler() {
  const proveAllModalProperties = document.getElementById("proveAllModalProperties") as HTMLDivElement;
  proveAllModalProperties.classList.add("show");
  proveAllModalProperties.style.display = "block";

  const blockNumberInput = document.getElementById("blockNumberAllProperties") as HTMLInputElement;

  // make default block number the latest block
  const latestBlock = await getLatestBlock();
  blockNumberInput.value = (latestBlock! - 50).toString();
}

async function onProveAllAccountPropertiesSubmit() {
  const blockNumberInput = document.getElementById("blockNumberAllProperties") as HTMLInputElement;
  const blockNumber = parseInt(blockNumberInput.value, 10);

  const checkboxes = document.querySelectorAll(`#proveAllModalProperties input[type="checkbox"]`);

  const allCheckedValues = Array.from(checkboxes)
    .filter((checkbox) => (checkbox as HTMLInputElement).checked)
    .map((checkbox) => (checkbox as HTMLInputElement).value);

  if (allCheckedValues.length === 0) {
    alert("Please select at least one property to prove.");
    return;
  }

  const localData = await getHerodotusData();
  if (!localData || !localData.destinationChain) {
    alert("Please ensure you have set up your Herodotus data (destinationChain, API key).");
    return;
  }

  const data = apiRequestBuilder.getAccountProperties({
    account: address,
    blockNumber: blockNumber,
    destinationChainId: localData.destinationChain,
    originChainId: "11155111",
    properties: allCheckedValues,
  });

  const result = await apiCall(`${HEDODOTUS_URL}/submit-batch-query`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "api-key": localData.apiKey,
    } as HeadersInit,
  });

  alert(`Prove account request submitted. Check the status here: ${getDashboardUrl(result.internalId)}`);
}

// ░█▄█░▀█▀░█▀▀░█▀▀
// ░█░█░░█░░▀▀█░█░░
// ░▀░▀░▀▀▀░▀▀▀░▀▀▀

const SEPOLIA_RPC_URL = "https://ethereum-sepolia.publicnode.com";

async function getLatestBlock() {
  try {
    const response = await apiCall(SEPOLIA_RPC_URL, {
      method: "POST",
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_blockNumber",
        params: [],
        id: 1,
      }),
    });

    const latestBlockNumber = parseInt(response.result, 16);
    return latestBlockNumber;
  } catch (error) {
    console.error("Error fetching latest block:", error);
  }
}

const address = window.location.pathname.split("/")[2];

function createNewButton(id: string, text: string = "🛰️ Prove") {
  const newButton = document.createElement("button");
  newButton.textContent = text;
  newButton.classList.add("btn", "btn-sm", "btn-primary");
  newButton.id = id;
  return newButton;
}

// Initialize
initializeProveAccount().catch(console.error);
