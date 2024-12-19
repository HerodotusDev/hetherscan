import { setHerodotusData, getHerodotusData } from "../misc";

const ethPriceElement = document.querySelector("#ethPrice > span");
let loginButton: HTMLButtonElement;
let modal: HTMLDivElement;

if (ethPriceElement) {
  loginButton = document.createElement("button");
  loginButton.innerHTML = "🛰️ <strong>Herodotus</strong>";
  loginButton.style.backgroundColor = "blue";
  loginButton.style.color = "white";
  loginButton.style.border = "none";
  loginButton.style.padding = "10px 20px";
  loginButton.style.cursor = "pointer";
  loginButton.onclick = function () {
    modal.style.display = "block";
  };
  ethPriceElement.parentNode!.insertBefore(
    loginButton,
    ethPriceElement.nextSibling
  );
}

// Create the modal
modal = document.createElement("div");
modal.style.display = "none";
modal.style.position = "fixed";
modal.style.zIndex = "1";
modal.style.left = "0";
modal.style.top = "0";
modal.style.width = "100%";
modal.style.height = "100%";
modal.style.overflow = "auto";
modal.style.backgroundColor = "rgba(0,0,0,0.4)";
modal.innerHTML = `
    <div style="background-color: #333333; color: #ffffff; margin: 15% auto; padding: 20px; border: 1px solid #888; width: 80%;">
        <span style="color: #ffffff; float: right; font-size: 28px; font-weight: bold; cursor: pointer;" id="closeModal">&times;</span>
        <label for="destinationChain">Destination Chain:</label>
        <select id="destinationChain" name="destinationChain" style="background-color: #555555; color: #ffffff;">
            <option value="11155111">11155111</option>
            <option value="SN_Sepolia">SN_Sepolia</option>
        </select>
        <br><br>
        <label for="apiKey">API Key:</label>
        <input type="text" id="apiKey" name="apiKey" style="background-color: #555555; color: #ffffff;">
        <br><br>
        <button id="submitButton" style="background-color: blue; color: white; border: none; padding: 10px 20px; cursor: pointer;">Submit</button>
    </div>
`;
document.body.appendChild(modal);

// Retrieve stored data on load and update the UI
getHerodotusData().then((data) => {
  if (data) {
    // Data found, update button and fields
    loginButton.innerHTML = "🛰️ <strong>Herodotus (Logged In)</strong>";

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
(document.getElementById("submitButton") as HTMLButtonElement).onclick =
  function () {
    const destinationChain = (
      document.getElementById("destinationChain") as HTMLSelectElement
    ).value;
    const apiKey = (document.getElementById("apiKey") as HTMLInputElement)
      .value;

    setHerodotusData({ destinationChain, apiKey });

    loginButton.innerHTML = "🛰️ <strong>Herodotus (Logged In)</strong>";
    modal.style.display = "none";
  };

// Close the modal when the user clicks on <span> (x)
document.getElementById("closeModal")!.onclick = function () {
  modal.style.display = "none";
};

// Close the modal when the user clicks anywhere outside of the modal
window.onclick = function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};
