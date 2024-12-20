import axios from "axios";
import { getHerodotusData, setHerodotusData } from "../misc";
import {
  accountProperties,
  apiRequestBuilder,
  getDashboardUrl,
  HEDODOTUS_URL,
} from "../storage-slot-api";
import { createNewModal, generateCheckboxes } from "../modal";

// ░█▄█░█▀█░█▀▄░█▀█░█░░░█▀▀
// ░█░█░█░█░█░█░█▀█░█░░░▀▀█
// ░▀░▀░▀▀▀░▀▀░░▀░▀░▀▀▀░▀▀▀

const createNewModalLocal = (ctx: {
  id: string;
  inner: string;
  title: string;
}) => {
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

let proveAccountModal: HTMLDivElement = createNewModalLocal({
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

  const result = await axios.post(`${HEDODOTUS_URL}/submit-batch-query`, data, {
    headers: {
      "api-key": localData.apiKey,
      "Content-Type": "application/json",
    },
  });

  alert(
    `Prove account request submitted. Check the status here: ${getDashboardUrl(
      result.data.internalId
    )}`
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

async function proveEthBalanceClickHandler() {
  proveAccountModal.classList.add("show");
  proveAccountModal.style.display = "block";

  const blockNumberInput = document.getElementById(
    "blockNumber"
  ) as HTMLInputElement;

  // make default block number the latest block
  const latestBlock = await getLatestBlock();
  blockNumberInput.value = (latestBlock! - 50).toString();
}

// MODAL FOR ALL PROPERTIES

const proveAllModalPropertiesId = "proveAllModalProperties";

let proveAllModalProperties: HTMLDivElement = createNewModal({
  id: proveAllModalPropertiesId,
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

async function proveAllPropertiesClickHandler() {
  proveAllModalProperties.classList.add("show");
  proveAllModalProperties.style.display = "block";

  const blockNumberInput = document.getElementById(
    "blockNumberAllProperties"
  ) as HTMLInputElement;

  // make default block number the latest block
  const latestBlock = await getLatestBlock();
  blockNumberInput.value = (latestBlock! - 50).toString();
}

document.body.appendChild(proveAllModalProperties);

document.getElementById(`close${proveAllModalPropertiesId}`)!.onclick =
  function () {
    proveAllModalProperties.classList.remove("show");
    proveAllModalProperties.style.display = "none";
  };

document.getElementById(`submit${proveAllModalPropertiesId}`)!.onclick =
  onProveAllAccountPropertiesSubmit;

window.onclick = function (event) {
  if (event.target === proveAllModalProperties) {
    proveAllModalProperties.classList.remove("show");
    proveAllModalProperties.style.display = "none";
  }
};

async function onProveAllAccountPropertiesSubmit() {
  const blockNumberInput = document.getElementById(
    "blockNumberAllProperties"
  ) as HTMLInputElement;
  const blockNumber = parseInt(blockNumberInput.value, 10);

  const checkboxes = document.querySelectorAll(
    `#${proveAllModalPropertiesId} input[type="checkbox"]`
  );

  const allCheckedValues = Array.from(checkboxes)
    .filter((checkbox) => (checkbox as HTMLInputElement).checked)
    .map((checkbox) => (checkbox as HTMLInputElement).value);

  if (allCheckedValues.length === 0) {
    alert("Please select at least one property to prove.");
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
    properties: allCheckedValues,
  });

  const result = await axios.post(`${HEDODOTUS_URL}/submit-batch-query`, data, {
    headers: {
      "api-key": localData.apiKey,
      "Content-Type": "application/json",
    },
  });

  alert(
    `Prove account request submitted. Check the status here: ${getDashboardUrl(
      result.data.internalId
    )}`
  );
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
    console.error("Error fetching latest block:", error);
  }
}

const address = window.location.pathname.split("/")[2];

// FIXME: make better selector
// get the element with text ETH Balance
// @ts-ignore
const ethBalanceElement = [...document.querySelectorAll("*")].find(
  (el) => el.textContent.trim() === "ETH Balance"
);

const mainAddressElement = document.querySelector("#mainaddress");

function createNewButton(id: string, text: string = "🛰️ Prove") {
  const newButton = document.createElement("button");
  newButton.textContent = text;
  newButton.classList.add("btn", "btn-sm", "btn-primary");
  newButton.id = id;
  return newButton;
}

if (mainAddressElement) {
  const newButton = createNewButton(
    "proveAllProperties",
    "🛰️ Prove Account Properties"
  );
  newButton.classList.add("ms-2");

  newButton.classList.add("ms-2");
  mainAddressElement.parentNode!.insertBefore(
    newButton,
    mainAddressElement.nextSibling
  );

  document
    .getElementById("proveAllProperties")
    ?.addEventListener("click", proveAllPropertiesClickHandler);
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
    ?.addEventListener("click", proveEthBalanceClickHandler);
}
