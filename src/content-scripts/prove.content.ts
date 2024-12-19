// FIXME: make better selector
// get the element with text ETH Balance
// @ts-ignore
const ethBalanceElement = [...document.querySelectorAll("*")].find(
  (el) => el.textContent.trim() === "ETH Balance"
);

if (ethBalanceElement) {
  // create a new button element
  const newButton = document.createElement("button");
  newButton.textContent = "🛰️ Prove";
  newButton.style.backgroundColor = "blue";
  newButton.style.color = "white";

  // insert the new button right after the ethBalanceElement
  ethBalanceElement.insertAdjacentElement("afterend", newButton);
}
