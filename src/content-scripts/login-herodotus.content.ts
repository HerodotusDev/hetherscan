declare global {
  interface Window {
    herodotus: {
      destinationChain?: string;
      apiKey?: string;
    };
  }
}

const ethPriceElement = document.querySelector("#ethPrice > span");
let loginButton: HTMLButtonElement;

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
const modal = document.createElement("div");
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

// Handle the submit button click
(document.getElementById("submitButton") as HTMLButtonElement).onclick =
  function () {
    const destinationChain = (
      document.getElementById("destinationChain") as HTMLSelectElement
    ).value;
    const apiKey = (document.getElementById("apiKey") as HTMLInputElement)
      .value;

    // Store the login data and destination chain in window.herodotus
    window.herodotus = window.herodotus || {};
    window.herodotus.destinationChain = destinationChain;
    window.herodotus.apiKey = apiKey;

    // Update the login button text to indicate the user is logged in
    loginButton.innerHTML = "🛰️ <strong>Herodotus (Logged In)</strong>";

    // Close the modal
    modal.style.display = "none";
  };

// Close the modal when the user clicks on <span> (x)
document.getElementById("closeModal")!.onclick = function () {
  modal.style.display = "none";
};

// Close the modal when the user clicks anywhere outside of the modal
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};
