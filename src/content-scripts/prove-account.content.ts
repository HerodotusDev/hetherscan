import axios from "axios";
import { getHerodotusData } from "../misc";
import { apiRequestBuilder } from "../storage-slot-api";

const address = window.location.pathname.split("/")[2];
let proveAccountModal: HTMLDivElement;

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

function closeModal() {
  if (proveAccountModal) {
    proveAccountModal.classList.remove("show");
    proveAccountModal.style.display = "none";
    proveAccountModal.remove();
  }
}

async function onModalSubmit() {
  console.log("Submit button clicked!"); // To confirm the event triggers

  try {
    const czoto = await axios.get(
      "https://staging.api.herodotus.cloud/is-alive"
    );
    console.log("Is Alive Response:", czoto.data);
  } catch (err) {
    console.error("Failed to reach is-alive endpoint:", err);
  }

  const blockNumberInput = document.getElementById(
    "blockNumber"
  ) as HTMLInputElement;
  const blockNumber = parseInt(blockNumberInput.value, 10);

  if (isNaN(blockNumber)) {
    alert("Please enter a valid block number.");
    return;
  }

  const data = await getHerodotusData();
  if (!data || !data.destinationChain) {
    alert(
      "Please ensure you have set up your Herodotus data (destinationChain, API key)."
    );
    return;
  }

  const result = await apiRequestBuilder.getAccountProperties({
    account: address,
    blockNumber: blockNumber,
    destinationChainId: data.destinationChain,
    originChainId: "11155111",
    properties: ["BALANCE"],
  });

  console.log("Account Properties Result:", result);

  closeModal();
}

async function proveEthBalanceButtonClickHandler() {
  // Create and append the modal to the DOM before selecting elements from it
  proveAccountModal = document.createElement("div");
  proveAccountModal.classList.add("modal", "fade");
  proveAccountModal.setAttribute("tabindex", "-1");
  proveAccountModal.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Herodotus Settings</h5>
          <button type="button" class="btn-close" aria-label="Close" id="closeModal"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="blockNumber" class="form-label">Block Number:</label>
            <input type="number" id="blockNumber" name="blockNumber" class="form-control" placeholder="e.g. 100000" />
          </div>
        </div>
        <div class="modal-footer">
          <button id="submitButton" class="btn btn-primary">Submit</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(proveAccountModal);

  // Show the modal
  proveAccountModal.classList.add("show");
  proveAccountModal.style.display = "block";

  const closeModalButton = document.getElementById(
    "closeModal"
  ) as HTMLButtonElement;
  const submitButton = document.getElementById(
    "submitButton"
  ) as HTMLButtonElement;

  // Add event listeners after elements exist
  closeModalButton.onclick = closeModal;
  submitButton.onclick = onModalSubmit;

  // Close modal when clicking outside modal-dialog (optional)
  window.onclick = function (event) {
    // If the user clicks outside the .modal-dialog, close
    if (
      event.target instanceof HTMLElement &&
      event.target === proveAccountModal
    ) {
      closeModal();
    }
  };
}
