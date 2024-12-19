declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
    };
  }
}

window.addEventListener("message", async (event) => {
  if (event.source !== window) return;

  const data = event.data;
  if (data && data.type === "METAMASK_REQUEST_ACCOUNTS") {
    if (!window.ethereum) {
      window.postMessage(
        {
          type: "METAMASK_RESPONSE",
          accounts: null,
          error: "No Ethereum provider found.",
        },
        "*"
      );
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      window.postMessage({ type: "METAMASK_RESPONSE", accounts }, "*");
    } catch (error: any) {
      window.postMessage(
        { type: "METAMASK_RESPONSE", accounts: null, error: error.message },
        "*"
      );
    }
  }
});
(window as any).readDiamondContractLoaded = false;
(window as any).loadIframeSourceDiamondRead = function (fLine) {
  if (window.readDiamondContractLoaded == false) {
    window.readDiamondContractLoaded = true;
    const link =
      "/readContract?m=light&a=0xA2981531d8d7bB7C17e1674E53F844a96BFf51b5&n=sepolia&v=0x7E9e2FBC568E64EbF45E25959fBbc9F6cc66a9ff&diamond=read";
    if (fLine) {
      document.getElementById("readdiamondcontractiframe").src =
        link + "&F=" + fLine;
    } else {
      document.getElementById("readdiamondcontractiframe").src = link;
    }
  }
};
(window as any).writeDiamondContractLoaded = false;
(window as any).loadIframeSourceDiamondWrite = function (fLine) {
  if (window.writeDiamondContractLoaded == false) {
    window.writeDiamondContractLoaded = true;
    const link =
      "/writecontract/index?m=light&v=21.10.1.1&a=0xA2981531d8d7bB7C17e1674E53F844a96BFf51b5&p=0x7E9e2FBC568E64EbF45E25959fBbc9F6cc66a9ff&n=sepolia&diamond=write";
    if (fLine) {
      document.getElementById("writediamondcontractiframe").src =
        link + "&F=" + fLine;
    } else {
      document.getElementById("writediamondcontractiframe").src = link;
    }
  }
};
function fixTabElements() {
  document.querySelectorAll(".nav-subtabs li a").forEach((tab) => {
    if (!bootstrap.Tab.getInstance(tab)) {
      new bootstrap.Tab(tab);
    }
  });
}
fixTabElements();

$(document).ready(function () {
  const hash = window.location.hash;
  setTimeout(() => {
    if (hash == "#readDiamond" || hash == "#writeDiamond") {
      activaTab(hash.slice(1));
    }
  }, 0);
});

(window as any).activaTab = function (tab) {
  var subtab = "0";
  let fNumber;
  if (tab.lastIndexOf("#") > -1) {
    fNumber = tab.substring(tab.lastIndexOf("#"), tab.length);
    fNumber = fNumber.replace("#F", "");
  }
  if (tab.indexOf("comment") >= 0) {
    tab = "comments";
    loaddisqus();
  } else if (tab.indexOf("code") >= 0) {
    subtab = "1";
  } else if (tab.indexOf("readContract") >= 0) {
    subtab = "1";
    loadIframeSource(fNumber);
  } else if (tab.indexOf("writeContract") >= 0) {
    subtab = "1";
    loadIframeSource5(fNumber);
  } else if (tab.indexOf("readProxyContract") >= 0) {
    subtab = "1";
    loadIframeSourceProxyRead(fNumber);
  } else if (tab.indexOf("writeProxyContract") >= 0) {
    subtab = "1";
    loadIframeSourceProxyWrite(fNumber);
  } else if (tab.indexOf("multipleProxyContract") >= 0) {
    subtab = "1";
    loadIframeSourceMultipleReadProxy(fNumber);
  } else if (tab.indexOf("readCustomContract") >= 0) {
    subtab = "1";
    loadIframeSourceCustomRead(fNumber);
  } else if (tab.indexOf("writeCustomContract") >= 0) {
    subtab = "1";
    loadIframeSourceCustomWrite(fNumber);
  } else if (tab.indexOf("readDiamond") >= 0) {
    subtab = "1";
    loadIframeSourceDiamondRead(fNumber);
  } else if (tab.indexOf("writeDiamond") >= 0) {
    subtab = "1";
    loadIframeSourceDiamondWrite(fNumber);
  }
  //else if (tab.indexOf('tokentxnsErc721') >= 0) {
  //    loadIframeSource6();
  //}
  //else if (tab.indexOf('tokentxnsErc1155') >= 0) {
  //    loadIframeSourceErc1155();
  //}
  else if (tab.indexOf("nfttransfers") >= 0) {
    loadIframeSourceNftTransfer();
  } else if (tab.indexOf("analytics") >= 0) {
    bootstrap.Tab.getInstance(
      document.querySelector('.nav_tabs1 a[data-bs-target="#analytics"]')
    ).show();
    loadIframeSource7(tab);
  } else if (tab.indexOf("tokentxns") >= 0) {
    loadIframeSource2();
  }
  //else if (tab.indexOf('loansAddress') >= 0) {
  //    loadIframeSource9();
  //}
  else if (tab.indexOf("cards") >= 0) {
    loadCardsIframe();
    showLoader(window.cards_loaded);
  } else if (tab.indexOf("loans") >= 0) {
    loadIframeSource8();
  } else if (tab.indexOf("events") >= 0) {
    loadIframeEvents();
  } else if (
    tab.indexOf("beaconchain") >= 0 ||
    tab.indexOf("deposits") >= 0 ||
    tab.indexOf("withdrawals") >= 0
  ) {
    let beaconChainTab = document.querySelector(
      '.nav_tabs1 a[data-bs-target="#beaconchain"]'
    );
    if (beaconChainTab) {
      bootstrap.Tab.getInstance(beaconChainTab).show();
    }
    let depositsTab = document.querySelector(
      '.nav_tabs1 a[data-bs-target="#deposits"]'
    );
    let withdrawalsTab = document.querySelector(
      '.nav_tabs1 a[data-bs-target="#withdrawals"]'
    );
    if (!!depositsTab) {
      bootstrap.Tab.getInstance(depositsTab).show();
    } else if (!!withdrawalsTab) {
      bootstrap.Tab.getInstance(withdrawalsTab).show();
    }
  }
  var obj1 = document.getElementById("ContentPlaceHolder1_li_readContract");
  var obj2 = document.getElementById("ContentPlaceHolder1_li_writeContract");
  var obj3 = document.getElementById(
    "ContentPlaceHolder1_li_readProxyContract"
  );
  var obj4 = document.getElementById(
    "ContentPlaceHolder1_li_writeProxyContract"
  );
  var obj5 = document.getElementById(
    "ContentPlaceHolder1_li_readCustomContract"
  );
  var obj6 = document.getElementById(
    "ContentPlaceHolder1_li_writeCustomContract"
  );
  var obj7 = document.getElementById(
    "ContentPlaceHolder1_li_multipleProxyContract"
  );
  var obj8 = document.getElementById("ContentPlaceHolder1_li_readDiamond");
  var obj9 = document.getElementById("ContentPlaceHolder1_li_writeDiamond");
  document.getElementById("divClientMultiSearch").style.display = "none";
  if (subtab === "0") {
    if (tab.indexOf("analytics") >= 0) {
      //Do nothing.
    } else {
      bootstrap.Tab.getInstance(
        document.querySelector('.nav_tabs1 li a[data-bs-target="#' + tab + '"]')
      ).show();
    }
    if (
      obj1 === null &&
      obj2 === null &&
      obj3 === null &&
      obj4 === null &&
      obj5 === null &&
      obj6 === null &&
      obj7 === null &&
      obj8 === null &&
      obj9 === null
    ) {
      document.getElementById("nav_subtabs").style.display = "none";
      $("#code").attr("style", "display:visible;");
    } else {
      document.getElementById("nav_subtabs").style.display = "visible";
      $("#code").attr("style", "display:visible;");
      $("#readContract").attr("style", "display:none;");
      $("#writeContract").attr("style", "display:none;");
      $("#readProxyContract").attr("style", "display:none;");
      $("#writeProxyContract").attr("style", "display:none;");
      $("#multipleProxyContract").attr("style", "display:none;");
      $("#readCustomContract").attr("style", "display:none;");
      $("#writeCustomContract").attr("style", "display:none;");
      $("#readDiamondContract").attr("style", "display:none;");
      $("#writeDiamondContract").attr("style", "display:none;");
    }
  } else if (subtab == "1") {
    //if (tab.lastIndexOf("#") > -1) {
    //    tab = tab.substring(0, tab.lastIndexOf("#"))
    //}
    if (tab.includes("#")) {
      tab = tab.split("#")[0];
    }
    bootstrap.Tab.getInstance(
      document.querySelector('.nav_tabs1 a[data-bs-target="#contracts"]')
    ).show();
    if (
      obj1 === null &&
      obj2 === null &&
      obj3 === null &&
      obj4 === null &&
      obj5 === null &&
      obj6 === null &&
      obj7 === null &&
      obj8 === null &&
      obj9 === null
    ) {
      document.getElementById("nav_subtabs").style.display = "none";
      $("#nav_subtabs").parent().removeClass("d-md-flex");
      $("#nav_subtabs").parent().hide();
    } else {
      document.getElementById("nav_subtabs").style.display = "visible";
      bootstrap.Tab.getInstance(
        document.querySelector(
          '.nav-subtabs li a[data-bs-target="#' + tab + '"]'
        )
      ).show();
      tempI++;
      if (tab === "code" && tempI === 2)
        setTimeout(function () {
          var searchText = window.localStorage.getItem("searchCode");
          if (searchText) {
            myTocSelect("event " + searchText + "(");
            window.localStorage.removeItem("searchCode");
          }
        }, 1000);
    }
    if (tab == "code") {
      $("#readContract").attr("style", "display:none;");
      $("#code").attr("style", "display:visible;");
      $("#writeContract").attr("style", "display:none;");
      $("#readProxyContract").attr("style", "display:none;");
      $("#writeProxyContract").attr("style", "display:none;");
      $("#multipleProxyContract").attr("style", "display:none;");
      $("#readCustomContract").attr("style", "display:none;");
      $("#writeCustomContract").attr("style", "display:none;");
      document.getElementById("divClientMultiSearch").style.display = "block";
    } else if (tab == "readContract") {
      $("#readContract").attr("style", "display:visible;");
      $("#code").attr("style", "display:none;");
      $("#writeContract").attr("style", "display:none;");
      $("#readProxyContract").attr("style", "display:none;");
      $("#writeProxyContract").attr("style", "display:none;");
      $("#multipleProxyContract").attr("style", "display:none;");
      $("#readCustomContract").attr("style", "display:none;");
      $("#writeCustomContract").attr("style", "display:none;");
      $("#readDiamondContract").attr("style", "display:none;");
      $("#writeDiamondContract").attr("style", "display:none;");
    } else if (tab == "writeContract") {
      $("#writeContract").attr("style", "display:visible;");
      $("#code").attr("style", "display:none;");
      $("#readContract").attr("style", "display:none;");
      $("#readProxyContract").attr("style", "display:none;");
      $("#writeProxyContract").attr("style", "display:none;");
      $("#multipleProxyContract").attr("style", "display:none;");
      $("#readCustomContract").attr("style", "display:none;");
      $("#writeCustomContract").attr("style", "display:none;");
      $("#readDiamondContract").attr("style", "display:none;");
      $("#writeDiamondContract").attr("style", "display:none;");
    } else if (tab == "readProxyContract") {
      $("#writeContract").attr("style", "display:none;");
      $("#code").attr("style", "display:none;");
      $("#readContract").attr("style", "display:none;");
      $("#readProxyContract").attr("style", "display:visible;");
      $("#writeProxyContract").attr("style", "display:none;");
      $("#multipleProxyContract").attr("style", "display:none;");
      $("#readCustomContract").attr("style", "display:none;");
      $("#writeCustomContract").attr("style", "display:none;");
      $("#readDiamondContract").attr("style", "display:none;");
      $("#writeDiamondContract").attr("style", "display:none;");
    } else if (tab == "writeProxyContract") {
      $("#writeContract").attr("style", "display:none;");
      $("#code").attr("style", "display:none;");
      $("#readContract").attr("style", "display:none;");
      $("#readProxyContract").attr("style", "display:none;");
      $("#writeProxyContract").attr("style", "display:visible;");
      $("#multipleProxyContract").attr("style", "display:none;");
      $("#readCustomContract").attr("style", "display:none;");
      $("#writeCustomContract").attr("style", "display:none;");
      $("#readDiamondContract").attr("style", "display:none;");
      $("#writeDiamondContract").attr("style", "display:none;");
    } else if (tab == "multipleProxyContract") {
      $("#writeContract").attr("style", "display:none;");
      $("#code").attr("style", "display:none;");
      $("#readContract").attr("style", "display:none;");
      $("#readProxyContract").attr("style", "display:none;");
      $("#writeProxyContract").attr("style", "display:none;");
      $("#multipleProxyContract").attr("style", "display:visible;");
      $("#readCustomContract").attr("style", "display:none;");
      $("#writeCustomContract").attr("style", "display:none;");
      $("#readDiamondContract").attr("style", "display:none;");
      $("#writeDiamondContract").attr("style", "display:none;");
    } else if (tab == "readCustomContract") {
      $("#code").attr("style", "display:none;");
      $("#readContract").attr("style", "display:none;");
      $("#writeContract").attr("style", "display:none;");
      $("#readProxyContract").attr("style", "display:none;");
      $("#writeProxyContract").attr("style", "display:none;");
      $("#multipleProxyContract").attr("style", "display:none;");
      $("#readCustomContract").attr("style", "display:visible;");
      $("#writeCustomContract").attr("style", "display:none;");
      $("#readDiamondContract").attr("style", "display:none;");
      $("#writeDiamondContract").attr("style", "display:none;");
    } else if (tab == "writeCustomContract") {
      $("#code").attr("style", "display:none;");
      $("#readContract").attr("style", "display:none;");
      $("#writeContract").attr("style", "display:none;");
      $("#readProxyContract").attr("style", "display:none;");
      $("#writeProxyContract").attr("style", "display:none;");
      $("#multipleProxyContract").attr("style", "display:none;");
      $("#readCustomContract").attr("style", "display:none;");
      $("#writeCustomContract").attr("style", "display:visible;");
      $("#readDiamondContract").attr("style", "display:none;");
      $("#writeDiamondContract").attr("style", "display:none;");
    } else if (tab == "readDiamond") {
      $("#code").attr("style", "display:none;");
      $("#readContract").attr("style", "display:none;");
      $("#writeContract").attr("style", "display:none;");
      $("#readProxyContract").attr("style", "display:none;");
      $("#writeProxyContract").attr("style", "display:none;");
      $("#multipleProxyContract").attr("style", "display:none;");
      $("#readCustomContract").attr("style", "display:none;");
      $("#writeCustomContract").attr("style", "display:none;");
      $("#readDiamondContract").attr("style", "display:visible;");
      $("#writeDiamondContract").attr("style", "display:none;");
    } else if (tab == "writeDiamond") {
      $("#code").attr("style", "display:none;");
      $("#readContract").attr("style", "display:none;");
      $("#writeContract").attr("style", "display:none;");
      $("#readProxyContract").attr("style", "display:none;");
      $("#writeProxyContract").attr("style", "display:none;");
      $("#multipleProxyContract").attr("style", "display:none;");
      $("#readCustomContract").attr("style", "display:none;");
      $("#writeCustomContract").attr("style", "display:none;");
      $("#readDiamondContract").attr("style", "display:none;");
      $("#writeDiamondContract").attr("style", "display:visible;");
    }
  }
};

// $("#ContentPlaceHolder1_li_readDiamond").on("click", function () {
//   console.log("CLICKED");
//   $("#code").attr("style", "display:none;");
//   $("#readContract").attr("style", "display:none;");
//   $("#writeContract").attr("style", "display:none;");
//   $("#readProxyContract").attr("style", "display:none;");
//   $("#writeProxyContract").attr("style", "display:none;");
//   $("#readCustomContract").attr("style", "display:none;");
//   $("#writeCustomContract").attr("style", "display:none;");
//   $("#readDiamond").attr("style", "display:visible;");

//   var obj = document.getElementById("readdiamondcontractiframe");
//   resizeIframe(obj, -20);
// });
