import { deleteHerodotusData, getHerodotusData, setHerodotusData } from "../misc";
import { getDestinationForOriginChainId } from "../storage-slot-api";
import { CHAIN_IDS } from "../utils/constants";

interface HerodotusElements {
  loginButton: HTMLButtonElement;
  logoutButton: HTMLButtonElement;
  loginModal: HTMLDivElement;
  ethPriceElement: HTMLElement;
}

function createLoginButton(): HTMLButtonElement {
  const button = document.createElement("button");
  button.innerHTML = "🛰️ Log in with Herodotus";
  button.classList.add("btn", "btn-primary", "btn-sm", "text-nowrap");
  return button;
}

function createLogoutButton(elements: HerodotusElements): HTMLButtonElement {
  const button = document.createElement("button");
  button.innerHTML = "Logout";
  button.classList.add("btn", "btn-outline-primary", "btn-sm");
  button.onclick = () => handleLogout(elements);
  return button;
}

function handleLogout(elements: HerodotusElements): void {
  const { loginButton, logoutButton, loginModal } = elements;
  setHerodotusData({ destinationChain: undefined, apiKey: undefined });
  loginButton.innerHTML = "🛰️ Log in with Herodotus";
  logoutButton.remove();
  hideModal(loginModal);
}

function showModal(modal: HTMLDivElement): void {
  modal.classList.add("show");
  modal.style.display = "block";
}

function hideModal(modal: HTMLDivElement): void {
  modal.classList.remove("show");
  modal.style.display = "none";
}

async function createLoginModal(elements: HerodotusElements): Promise<HTMLDivElement> {
  const chain_id = CHAIN_IDS[window.location.hostname as keyof typeof CHAIN_IDS];
  const chains = await getDestinationForOriginChainId(chain_id);
  const options = chains.map((chain) => `<option value="${chain}">${chain}</option>`).join("");

  const modal = document.createElement("div");
  modal.classList.add("modal", "fade");
  modal.setAttribute("tabindex", "-1");
  modal.innerHTML = `
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

  document.body.appendChild(modal);
  setupModalEventListeners(modal, elements);
  return modal;
}

function setupModalEventListeners(modal: HTMLDivElement, elements: HerodotusElements): void {
  const closeBtn = document.getElementById("closeLoginModal");
  const submitBtn = document.getElementById("loginSubmitButton");

  closeBtn?.addEventListener("click", () => hideModal(modal));
  submitBtn?.addEventListener("click", () => handleLoginSubmit(elements));

  window.onclick = (event) => {
    if (event.target === modal) hideModal(modal);
  };
}

function handleLoginSubmit(elements: HerodotusElements): void {
  const { loginButton, logoutButton, loginModal } = elements;
  const destinationChain = (document.getElementById("destinationChain") as HTMLSelectElement).value;
  const apiKey = (document.getElementById("apiKey") as HTMLInputElement).value;

  setHerodotusData({ destinationChain, apiKey });
  loginButton.innerHTML = "🛰️ Herodotus Settings";

  if (!logoutButton.parentNode) {
    loginButton.parentNode!.appendChild(logoutButton);
  }

  hideModal(loginModal);
}

function setupClearDataLink(elements: HerodotusElements): void {
  const footerMenu = document.querySelector(".d-flex.flex-wrap.justify-content-md-end");
  if (!footerMenu) return;

  const clearDataLink = document.createElement("a");
  clearDataLink.className = "link-dark";
  clearDataLink.href = "#";
  clearDataLink.style.cursor = "pointer";
  clearDataLink.textContent = "Clear Herodotus Data";
  clearDataLink.addEventListener("click", (e) => {
    e.preventDefault();
    deleteHerodotusData();
    elements.loginButton.innerHTML = "🛰️ Log in with Herodotus";
    elements.logoutButton.remove();
  });

  const separator = document.createElement("span");
  separator.className = "text-secondary d-none d-sm-block";
  separator.textContent = "|";

  footerMenu.insertBefore(separator, footerMenu.firstChild);
  footerMenu.insertBefore(clearDataLink, footerMenu.firstChild);
}

async function initializeHerodotus(): Promise<void> {
  const ethPriceElement = document.querySelector("#ethPrice");
  if (!ethPriceElement) throw new Error("Eth price element not found");

  const buttonContainer = document.createElement("div");
  buttonContainer.style.display = "inline-flex";
  buttonContainer.style.gap = "0.5rem";

  const elements: HerodotusElements = {
    loginButton: createLoginButton(),
    logoutButton: document.createElement("button"),
    loginModal: document.createElement("div"),
    ethPriceElement: ethPriceElement as HTMLElement,
  };

  elements.logoutButton = createLogoutButton(elements);

  elements.loginButton.onclick = () => showModal(elements.loginModal);

  buttonContainer.appendChild(elements.loginButton);
  ethPriceElement.appendChild(buttonContainer);

  elements.loginModal = await createLoginModal(elements);

  const data = await getHerodotusData();
  if (data?.apiKey) {
    elements.loginButton.innerHTML = "🛰️ Herodotus Settings";
    buttonContainer.appendChild(elements.logoutButton);

    const destinationChainSelect = document.getElementById("destinationChain") as HTMLSelectElement;
    const apiKeyInput = document.getElementById("apiKey") as HTMLInputElement;

    if (destinationChainSelect && data.destinationChain) {
      destinationChainSelect.value = data.destinationChain;
    }
    if (apiKeyInput && data.apiKey) {
      apiKeyInput.value = data.apiKey;
    }
  }

  setupClearDataLink(elements);
}

// Initialize the application
initializeHerodotus().catch(console.error);
