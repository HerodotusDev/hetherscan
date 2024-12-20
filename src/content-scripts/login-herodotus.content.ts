import {
  setHerodotusData,
  getHerodotusData,
  deleteHerodotusData,
} from "../misc";
import { getDestinationForOriginChainId } from "../storage-slot-api";

const ethPriceElement = document.querySelector("#ethPrice > span");
let loginButton: HTMLButtonElement;
let loginModal: HTMLDivElement;

if (!ethPriceElement) throw new Error("Eth price element not found");

// Create the login button
loginButton = document.createElement("button");
loginButton.innerHTML = "🛰️ Log in with Herodotus";
loginButton.classList.add("btn", "btn-primary", "btn-sm", "text-nowrap");
loginButton.onclick = function () {
  // Show modal
  loginModal.classList.add("show");
  loginModal.style.display = "block";
};

// Create the logout button
const logoutButton = document.createElement("button");
logoutButton.innerHTML = "Logout";
logoutButton.classList.add("btn", "btn-outline-primary", "btn-sm"); // margin-start for spacing
logoutButton.onclick = function () {
  setHerodotusData({ destinationChain: undefined, apiKey: undefined });
  loginButton.innerHTML = "🛰️ Log in with Herodotus";
  logoutButton.remove();
  loginModal.classList.remove("show");
  loginModal.style.display = "none";
};

// Insert login button
ethPriceElement.parentNode!.insertBefore(
  loginButton,
  ethPriceElement.nextSibling
);

// Only show logout button when logged in
getHerodotusData().then((data) => {
  if (data?.apiKey) {
    ethPriceElement.parentNode!.insertBefore(
      logoutButton,
      loginButton.nextSibling
    );
  }
});

// Create the modal structure using Bootstrap classes
loginModal = document.createElement("div");
loginModal.classList.add("modal", "fade");
const destinationChains = getDestinationForOriginChainId("11155111");
const options = destinationChains
  .map((chain) => `<option value="${chain}">${chain}</option>`)
  .join("");
loginModal.setAttribute("tabindex", "-1");
loginModal.innerHTML = `
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Herodotus Settings</h5>
        <button type="button" class="btn-close" aria-label="Close" id="closeLoginModal"></button>
      </div>
      <div class="modal-body">
        <div class="mb-3">
          <label for="destinationChain" class="form-label">Destination Chain:</label>
          <select id="destinationChain" name="destinationChain" class="form-select">
            ${options}
          </select>
        </div>
        <div class="mb-3">
          <label for="apiKey" class="form-label">API Key:</label>
          <input type="text" id="apiKey" name="apiKey" class="form-control">
        </div>
      </div>
      <div class="modal-footer">
        <button id="loginSubmitButton" class="btn btn-primary">Submit</button>
      </div>
    </div>
  </div>
`;
document.body.appendChild(loginModal);

// Retrieve stored data on load and update the UI
getHerodotusData().then((data) => {
  if (data?.apiKey) {
    // Data found, update button and fields
    loginButton.innerHTML = "🛰️ Herodotus (Logged In)";

    const destinationChainSelect = document.getElementById(
      "destinationChain"
    ) as HTMLSelectElement;
    const apiKeyInput = document.getElementById("apiKey") as HTMLInputElement;

    if (destinationChainSelect && data.destinationChain) {
      destinationChainSelect.value = data.destinationChain;
    }

    if (apiKeyInput && data.apiKey) {
      apiKeyInput.value = data.apiKey;
    }
  }
});

// Handle the submit button click
(document.getElementById("loginSubmitButton") as HTMLButtonElement).onclick =
  function () {
    const destinationChain = (
      document.getElementById("destinationChain") as HTMLSelectElement
    ).value;
    const apiKey = (document.getElementById("apiKey") as HTMLInputElement)
      .value;

    setHerodotusData({ destinationChain, apiKey });

    loginButton.innerHTML = "🛰️ Herodotus Logged In";

    // Add logout button if not present
    if (!logoutButton.parentNode) {
      ethPriceElement.parentNode!.insertBefore(
        logoutButton,
        loginButton.nextSibling
      );
    }

    loginModal.classList.remove("show");
    loginModal.style.display = "none";
  };

// Close the modal when the user clicks the close button
document.getElementById("closeLoginModal")!.onclick = function () {
  loginModal.classList.remove("show");
  loginModal.style.display = "none";
};

// Close the modal when the user clicks outside of it
window.onclick = function (event) {
  if (event.target === loginModal) {
    loginModal.classList.remove("show");
    loginModal.style.display = "none";
  }
};

// Add "Clear Herodotus Data" link to footer if present
const footerMenu = document.querySelector(
  ".d-flex.flex-wrap.justify-content-md-end.gap-2"
);
if (footerMenu) {
  const clearDataLink = document.createElement("a");
  clearDataLink.className = "link-dark";
  clearDataLink.href = "#";
  clearDataLink.style.cursor = "pointer";
  clearDataLink.textContent = "Clear Herodotus Data";
  clearDataLink.addEventListener("click", (e) => {
    e.preventDefault();
    deleteHerodotusData();
    loginButton.innerHTML = "🛰️ Log in with Herodotus";
    if (logoutButton.parentNode) {
      logoutButton.remove();
    }
  });

  const separator = document.createElement("span");
  separator.className = "text-secondary d-none d-sm-block";
  separator.textContent = "|";

  footerMenu.insertBefore(separator, footerMenu.firstChild);
  footerMenu.insertBefore(clearDataLink, footerMenu.firstChild);
}
