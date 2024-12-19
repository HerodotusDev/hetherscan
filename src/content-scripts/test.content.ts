import axios from "axios";

// Add a container for our buttons and info
const container = document.createElement("div");
container.style.position = "absolute";
container.style.top = "100px";
container.style.right = "20px";
container.style.padding = "10px";
container.style.border = "1px solid #ccc";
container.style.background = "#fff";
container.style.zIndex = "99999";
document.body.appendChild(container);

// Button to fetch data via Axios
const fetchButton = document.createElement("button");
fetchButton.textContent = "Fetch Info";
fetchButton.style.marginRight = "10px";
container.appendChild(fetchButton);

// Button to connect Metamask
const metamaskButton = document.createElement("button");
metamaskButton.textContent = "Connect Metamask";
container.appendChild(metamaskButton);

// Area to display fetched info
const infoDisplay = document.createElement("div");
infoDisplay.style.marginTop = "10px";
infoDisplay.style.color = "black";
container.appendChild(infoDisplay);

// Listen for responses from the injected script (Metamask results)
window.addEventListener("message", (event) => {
  if (event.source !== window) return;

  const data = event.data;
  if (data && data.type === "METAMASK_RESPONSE") {
    infoDisplay.textContent = `Connected accounts: ${JSON.stringify(
      data.accounts
    )}`;
  }
});

// Handle fetch button click
fetchButton.addEventListener("click", async () => {
  // Example: fetch some public API
  const response = await axios.get(
    "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd"
  );
  const ethPrice = response.data.ethereum.usd;
  infoDisplay.textContent = `Current ETH price: $${ethPrice}`;
});

// Handle Metamask connect button
metamaskButton.addEventListener("click", () => {
  // Post a message to the page for the injected script to handle
  window.postMessage({ type: "METAMASK_REQUEST_ACCOUNTS" }, "*");
});
