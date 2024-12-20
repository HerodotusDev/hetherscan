import axios from "axios";
import { getHerodotusData } from "../misc";
import { apiRequestBuilder } from "../storage-slot-api";

// ░█▄█░█▀█░█▀▄░█▀█░█░░░█▀▀
// ░█░█░█░█░█░█░█▀█░█░░░▀▀█
// ░▀░▀░▀▀▀░▀▀░░▀░▀░▀▀▀░▀▀▀

const createNewModal = (ctx: { id: string; inner: string; title: string }) => {
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

let proveAccountModal: HTMLDivElement = createNewModal({
  id: "proveAccountModal",
  inner: `
  
<form id="proveAccountForm">
      <div class="modal-body">
        <div class="form-group">
          <label for="blockNumber">Block Number:</label>
              <input type="number" id="blockNumber" name="blockNumber" class="form-control" required placeholder="e.g. 100000" />
            </div>
          </div>
        </form>

  `,
  title: "Prove Account",
});

document.body.appendChild(proveAccountModal);

document.getElementById(`closeproveAccountModal`)!.onclick = function () {
  proveAccountModal.classList.remove("show");
  proveAccountModal.style.display = "none";
};

async function onProveAccountModalSubmit() {
  const blockNumberInput = document.getElementById(
    "blockNumber"
  ) as HTMLInputElement;
  const blockNumber = parseInt(blockNumberInput.value, 10);

  console.log("Block Number:", blockNumber);

  if (isNaN(blockNumber)) {
    alert("Please enter a valid block number.");
    return;
  }

  const localData = await getHerodotusData();
  if (!localData || !localData.destinationChain) {
    alert(
      "Please ensure you have set up your Herodotus data (destinationChain, API key)."
    );
    return;
  }

  const data = apiRequestBuilder.getAccountProperties({
    account: address,
    blockNumber: blockNumber,
    destinationChainId: localData.destinationChain,
    originChainId: "11155111",
    properties: ["BALANCE"],
  });

  const result = await axios.post(
    "https://staging.api.herodotus.cloud/submit-batch-query",
    data,
    {
      headers: {
        "api-key": localData.apiKey,
        "Content-Type": "application/json",
      },
    }
  );

  alert(
    `Prove account request submitted. Check the status here: https://staging.dashboard.herodotus.dev/explorer/query/${result.data.internalId}`
  );
}

document.getElementById(`submitproveAccountModal`)!.onclick =
  onProveAccountModalSubmit;

window.onclick = function (event) {
  if (event.target === proveAccountModal) {
    proveAccountModal.classList.remove("show");
    proveAccountModal.style.display = "none";
  }
};

async function proveEthBalanceButtonClickHandler() {
  proveAccountModal.classList.add("show");
  proveAccountModal.style.display = "block";

  const blockNumberInput = document.getElementById(
    "blockNumber"
  ) as HTMLInputElement;

  // make default block number the latest block
  const latestBlock = await getLatestBlock();
  blockNumberInput.value = (latestBlock! - 50).toString();
}

// ░█▄█░▀█▀░█▀▀░█▀▀
// ░█░█░░█░░▀▀█░█░░
// ░▀░▀░▀▀▀░▀▀▀░▀▀▀

const SEPOLIA_RPC_URL = "https://ethereum-sepolia.publicnode.com";

async function getLatestBlock() {
  try {
    const response = await axios.post(SEPOLIA_RPC_URL, {
      jsonrpc: "2.0",
      method: "eth_blockNumber",
      params: [],
      id: 1,
    });

    const latestBlockNumber = parseInt(response.data.result, 16);
    return latestBlockNumber;
  } catch (error) {
    console.error("Error fetching latest block:", error.message);
  }
}

const address = window.location.pathname.split("/")[2];

// FIXME: make better selector
// get the element with text ETH Balance
// @ts-ignore
const ethBalanceElement = [...document.querySelectorAll("*")].find(
  (el) => el.textContent.trim() === "ETH Balance"
);
function createNewButton(id: string) {
  const newButton = document.createElement("button");
  newButton.textContent = "🛰️ Prove";
  newButton.classList.add("btn", "btn-sm", "btn-primary");
  newButton.id = id;
  return newButton;
}

if (ethBalanceElement) {
  const newButton = createNewButton("proveEthBalance");
  newButton.classList.add("ms-2");

  const balanceDiv = ethBalanceElement
    .closest("div")
    ?.querySelector("div > div");
  if (balanceDiv) {
    balanceDiv.style.display = "flex";
    balanceDiv.style.alignItems = "center";
    balanceDiv.appendChild(newButton);
  }

  // Add event listener to the prove button after it is created
  document
    .getElementById("proveEthBalance")
    ?.addEventListener("click", proveEthBalanceButtonClickHandler);
}
