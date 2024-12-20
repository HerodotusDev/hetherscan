// ░█▄█░█▀█░█▀▄░█▀█░█░░░█▀▀
// ░█░█░█░█░█░█░█▀█░█░░░▀▀█
// ░▀░▀░▀▀▀░▀▀░░▀░▀░▀▀▀░▀▀▀

import axios from "axios";
import { getHerodotusData } from "../misc";
import { apiRequestBuilder } from "../storage-slot-api";

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

let proveBlockModalId = "proveBlockModal";

let proveAccountModal: HTMLDivElement = createNewModal({
  id: proveBlockModalId,
  inner: `
    <form id="proveAccountForm">
        <div class="modal-body">
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="PARENT_HASH" id="flexCheckParentHash" checked>
                <label class="form-check-label" for="flexCheckParentHash">
                    PARENT_HASH
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="UNCLES_HASH" id="flexCheckUnclesHash" checked>
                <label class="form-check-label" for="flexCheckUnclesHash">
                    UNCLES_HASH
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="COINBASE" id="flexCheckCoinbase" checked>
                <label class="form-check-label" for="flexCheckCoinbase">
                    COINBASE
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="PROPOSER" id="flexCheckProposer" checked>
                <label class="form-check-label" for="flexCheckProposer">
                    PROPOSER
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="STATE_ROOT" id="flexCheckStateRoot" checked>
                <label class="form-check-label" for="flexCheckStateRoot">
                    STATE_ROOT
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="TRANSACTIONS_ROOT" id="flexCheckTransactionsRoot" checked>
                <label class="form-check-label" for="flexCheckTransactionsRoot">
                    TRANSACTIONS_ROOT
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="RECEIPTS_ROOT" id="flexCheckReceiptsRoot" checked>
                <label class="form-check-label" for="flexCheckReceiptsRoot">
                    RECEIPTS_ROOT
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="LOGS_BLOOM" id="flexCheckLogsBloom" checked>
                <label class="form-check-label" for="flexCheckLogsBloom">
                    LOGS_BLOOM
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="DIFFICULTY" id="flexCheckDifficulty" checked>
                <label class="form-check-label" for="flexCheckDifficulty">
                    DIFFICULTY
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="BLOCK_NUMBER" id="flexCheckBlockNumber" checked>
                <label class="form-check-label" for="flexCheckBlockNumber">
                    BLOCK_NUMBER
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="GAS_LIMIT" id="flexCheckGasLimit" checked>
                <label class="form-check-label" for="flexCheckGasLimit">
                    GAS_LIMIT
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="GAS_USED" id="flexCheckGasUsed" checked>
                <label class="form-check-label" for="flexCheckGasUsed">
                    GAS_USED
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="TIMESTAMP" id="flexCheckTimestamp" checked>
                <label class="form-check-label" for="flexCheckTimestamp">
                    TIMESTAMP
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="EXTRA_DATA" id="flexCheckExtraData" checked>
                <label class="form-check-label" for="flexCheckExtraData">
                    EXTRA_DATA
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="MIX_HASH" id="flexCheckMixHash" checked>
                <label class="form-check-label" for="flexCheckMixHash">
                    MIX_HASH
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="NONCE" id="flexCheckNonce" checked>
                <label class="form-check-label" for="flexCheckNonce">
                    NONCE
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="BASE_FEE_PER_GAS" id="flexCheckBaseFeePerGas" checked>
                <label class="form-check-label" for="flexCheckBaseFeePerGas">
                    BASE_FEE_PER_GAS
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="WITHDRAWALS_ROOT" id="flexCheckWithdrawalsRoot" checked>
                <label class="form-check-label" for="flexCheckWithdrawalsRoot">
                    WITHDRAWALS_ROOT
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="BLOB_GAS_USED" id="flexCheckBlobGasUsed" checked>
                <label class="form-check-label" for="flexCheckBlobGasUsed">
                    BLOB_GAS_USED
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="EXCESS_BLOB_GAS" id="flexCheckExcessBlobGas" checked>
                <label class="form-check-label" for="flexCheckExcessBlobGas">
                    EXCESS_BLOB_GAS
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="PARENT_BEACON_BLOCK_ROOT" id="flexCheckParentBeaconBlockRoot" checked>
                <label class="form-check-label" for="flexCheckParentBeaconBlockRoot">
                    PARENT_BEACON_BLOCK_ROOT
                </label>
            </div>
            <div class="form-check">
                <input class="form-check-input" type="checkbox" value="PROPOSER" id="flexCheckProposer" checked>
                <label class="form-check-label" for="flexCheckProposer">
                    PROPOSER
                </label>
            </div>
        </div>
    </form>
    `,
  title: "Prove Headers",
});

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
