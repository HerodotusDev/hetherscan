// This script is attached to `/readContract` and ??? urls.
// Those pages are usually used inside an iframe.
// This script notifier iframe's parent that loading has finished.
// It is run only if query parameter `diamond` is set to `read` or `write`.

window.onload = function () {
  const param = new URLSearchParams(window.location.search).get("diamond");
  if (param != "read" && param != "write") {
    return;
  }
  const capital = param.charAt(0).toUpperCase() + param.slice(1);

  window.parent.document.getElementById("loading" + capital + "DiamondContractframe")!.style.display = "none";

  setTimeout(function () {
    var obj = window.parent.document.getElementById(param + "diamondcontractiframe");
    // @ts-ignore
    if (obj) parent.resizeIframe(obj, 0);
  }, 300);
};
