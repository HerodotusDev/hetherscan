// This script is attached to `/readContract` and ??? urls.
// Those pages are usually used inside an iframe.
// This script notifier iframe's parent that loading has finished.
// It is run only if query parameter `diamond` is set to `read` or `write`.

window.onload = function () {
  const searchParams = new URLSearchParams(window.location.search);
  const param = searchParams.get("diamond");
  if (param != "read" && param != "write") {
    return;
  }
  window.contractframe = param +'diamondcontractiframe_' + searchParams.get("iframeId");
  const capital = param.charAt(0).toUpperCase() + param.slice(1);

  window.parent.document.getElementById("loading" + capital + "DiamondContractframe")!.style.display = "none";

  setTimeout(function () {
    var obj = window.parent.document.getElementById(param + "diamondcontractiframe");
    // @ts-ignore
    if (obj) parent.resizeIframe(obj, 0);
  }, 300);
};

// Override openModal which is called when connecting wallet.
window.openModal = function openModal() {
  var msg =
    'Please take note that this is a beta version feature and is provided on an "as is" and "as available" basis. Etherscan does not give any warranties and will not be liable for any loss, direct or indirect through continued use of this feature.';
  if (confirm(msg)) {
    try {
      const urlParams = new URLSearchParams(window.location.search)
      const diamondAction = urlParams.get("diamond");
      if (diamondAction == "read" || diamondAction == "write") {
        const iframeId = diamondAction + "diamondcontractiframe_" + urlParams.get("iframeId");
        parent.openModal(iframeId);
        var parentIframe = window.parent.document.getElementById(iframeId);
        // parentIframe.style.minHeight = "600px";
        // TODO: what does this do?
        // window.parent.document
        //   .getElementById("readContractMessage")
        //   .classList.remove("d-flex");
      } else if (
        window.parent.document.URL.indexOf("writeProxyContract") != -1
      ) {
        window.parent.document
          .getElementById("readContractMessageProxy")
          ?.classList.remove("d-flex");
        parent.openProxyModal("writeproxycontractiframe");
      } else {
        var isInIFrame = window.location != window.parent.location;
        if (isInIFrame) {
          parent.openModal("writecontractiframe");
          var parentIframe = window.parent.document.getElementById(
            "writecontractiframe"
          );
          parentIframe!.style.minHeight = "600px";
          window.parent.document
            .getElementById("readContractMessage")
            ?.classList.remove("d-flex");
        } else {
          $("#WalletModalProxyIframeNew").modal("show");
        }
      }
    } catch (err) {}
  }
};