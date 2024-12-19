// FIXME: make better selector
// get the element with text ETH Balance
// @ts-ignore
const ethBalanceElement = [...document.querySelectorAll("*")].find(
  (el) => el.textContent.trim() === "ETH Balance"
);

// TODO: NONCE ELEMENT WONT WORK as it comes from extention
// FIXME: make better selector
// get the element with text ETH Balance
// @ts-ignore
const nonceElement = [...document.querySelectorAll("*")].find(
  (el) => el.textContent.trim() === "Nonce"
);

if (nonceElement) {
  // create a new button element
  const newButton = createNewButton("proveNonce");
  // insert the new button right after the nonceElement
  nonceElement.insertAdjacentElement("afterend", newButton);
}

function createNewButton(id: string) {
  const newButton = document.createElement("button");
  newButton.textContent = "🛰️ Prove";
  newButton.classList.add("btn");
  newButton.classList.add("btn-sm");
  newButton.classList.add("btn-primary");
  newButton.id = id;
  return newButton;
}

if (ethBalanceElement) {
  // create a new button element
  const newButton = createNewButton("proveEthBalance");
  newButton.classList.add("ms-2");

  // Find the balance amount div (the one with the ethereum icon)
  const balanceDiv = ethBalanceElement
    .closest("div")
    .querySelector("div > div");
  if (balanceDiv) {
    balanceDiv.style.display = "flex";
    balanceDiv.style.alignItems = "center";
    // insert the new button next to the balance amount
    balanceDiv.appendChild(newButton);
  }
}

// // Function to create and insert the prove button
// function addProveButton(targetText: string) {
//   // Find the element with the specified text
//   const targetElement = [...document.querySelectorAll("*")].find(
//     (el) => el.textContent.trim() === targetText
//   );

//   if (targetElement) {
//     // Create a new button element
//     const newButton = document.createElement("button");
//     newButton.textContent = "🛰️ Prove";
//     newButton.style.backgroundColor = "blue";
//     newButton.style.color = "white";

//     // Insert the new button right after the target element
//     targetElement.insertAdjacentElement("afterend", newButton);
//   }
// }

// addProveButton("Nonce");
// // Add prove button for ETH Balance
// // addProveButton("ETH Balance");

// // Add prove button for NONCE

// c138a7ab-372e-4556-b2ce-1bc06bb55bd0
