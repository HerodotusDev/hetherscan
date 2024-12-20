// ░█▄█░█▀█░█▀▄░█▀█░█░░░█▀▀
// ░█░█░█░█░█░█░█▀█░█░░░▀▀█
// ░▀░▀░▀▀▀░▀▀░░▀░▀░▀▀▀░▀▀▀

import axios from "axios";
import { getHerodotusData, setHerodotusData } from "../misc";
import {
  apiRequestBuilder,
  getDashboardUrl,
  headerProperties,
  HEDODOTUS_URL,
} from "../storage-slot-api";
import { createNewModal, generateCheckboxes } from "../modal";

async function onProveBlockModalSubmit() {
  const checkboxes = document.querySelectorAll(
    `#${proveBlockModalId} input[type="checkbox"]`
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

  const data = apiRequestBuilder.getBlockHeaderProperties({
    blockNumber: block,
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

let proveBlockModalId = "proveBlockModal";

// <div class="d-flex gap-2 mb-3">
// <button type="button" class="btn btn-secondary btn-sm" id="selectAllBtn">Select All</button>
// <button type="button" class="btn btn-secondary btn-sm" id="deselectAllBtn">Deselect All</button>
// </div>

// const selectAllBtn = document.getElementById("selectAllBtn");
// const deselectAllBtn = document.getElementById("deselectAllBtn");
// const checkboxes = proveAccountModal.querySelectorAll(
//   ".form-check-input"
// ) as NodeListOf<HTMLInputElement>;

// selectAllBtn?.addEventListener("click", () => {
//   checkboxes.forEach((checkbox) => (checkbox.checked = true));
// });

// deselectAllBtn?.addEventListener("click", () => {
//   checkboxes.forEach((checkbox) => (checkbox.checked = false));
// });

let proveAccountModal: HTMLDivElement = createNewModal({
  id: proveBlockModalId,
  inner: `
      <form id="proveAccountForm">
          <div class="modal-body">
              ${generateCheckboxes(headerProperties)}
          </div>
      </form>
    `,
  title: "Prove Headers",
});

//
document.body.appendChild(proveAccountModal);

document.getElementById(`close${proveBlockModalId}`)!.onclick = function () {
  proveAccountModal.classList.remove("show");
  proveAccountModal.style.display = "none";
};

document.getElementById(`submit${proveBlockModalId}`)!.onclick =
  onProveBlockModalSubmit;

window.onclick = function (event) {
  if (event.target === proveAccountModal) {
    proveAccountModal.classList.remove("show");
    proveAccountModal.style.display = "none";
  }
};

// ░█▄█░▀█▀░█▀▀░█▀▀
// ░█░█░░█░░▀▀█░█░░
// ░▀░▀░▀▀▀░▀▀▀░▀▀▀

const block = window.location.pathname.split("/")[2];

// FIXME: make better selector
// get the element with text ETH Balance
// @ts-ignore
const blockNumberElement = [...document.querySelectorAll("*")].find(
  (el) => el.textContent.trim() === `#${block}`
);

function createNewButton(id: string) {
  const newButton = document.createElement("button");
  newButton.textContent = "🛰️ Prove header properties";
  newButton.classList.add("btn", "btn-sm", "btn-primary");
  newButton.id = id;
  return newButton;
}
if (blockNumberElement) {
  const newButton = createNewButton("proveBlock");
  newButton.classList.add("ms-2");
  blockNumberElement.parentNode!.insertBefore(
    newButton,
    blockNumberElement.nextSibling
  );

  newButton.onclick = function () {
    proveAccountModal.classList.add("show");
    proveAccountModal.style.display = "block";
  };
}
