import { isNumeric, queryRPC } from "../utils/utils";

function onDocumentReady() {
  const txHash = extractTxFromURL();

  const xpathLast = '//*[@id="ContentPlaceHolder1_collapseContent"]/div/div[last()]';
  const lastElement = document.evaluate(xpathLast, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue as Element;

  showLoadingIndicator(lastElement);

  fetchAdditionalData(txHash).then((data) => {
    document.getElementById("loading-indicator")?.remove();
    displayDataOnPage(data, lastElement);
  });
}

function extractTxFromURL() {
  return window.location.pathname.split("/")[2];
}

async function fetchAdditionalData(txHash: string) {
  return queryRPC("eth_getTransactionByHash", [txHash]);
}

function insertElement(afterElement: Element, dataContent: string, dataTitle: string) {
  const newElement = document.createElement("div");
  newElement.classList.add("row", "mb-4");

  if (!isNumeric(dataContent)) {
    console.error(dataTitle + " is not numeric");
    return;
  }

  newElement.innerHTML = `
        <div class="col-md-3 text-dt mb-2 mb-md-0">
            <!-- <i class="far fa-question-circle me-1" data-bs-container="body" data-bs-toggle="popover" data-bs-trigger="hover" data-bs-placement="top" data-original-title="" title="" data-bs-content="The root of the transactions trie"></i> -->
            <i class="far fa-wrench me-1"></i>
            ${dataTitle}:
        </div>
        <div class="col-md-9">
            ${dataContent}
        </div>
    `;
  afterElement.parentNode?.insertBefore(newElement, afterElement.nextSibling);
}

function displayDataOnPage(data: any, lastElement: Element) {
  insertElement(lastElement, data.s, "Signature s");
  insertElement(lastElement, data.r, "Signature r");
  insertElement(lastElement, data.v, "Siganture v");
}

function showLoadingIndicator(lastElement: Element) {
  const loadingIndicator = document.createElement("div");
  loadingIndicator.setAttribute("id", "loading-indicator");

  loadingIndicator.innerHTML = `
        <div class="d-flex justify-content-center">
            <div class="spinner-border" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    `;

  lastElement.parentNode?.insertBefore(loadingIndicator, lastElement.nextSibling);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", onDocumentReady);
} else {
  onDocumentReady();
}
