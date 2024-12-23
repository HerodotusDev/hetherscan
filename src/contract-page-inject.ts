declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
    };
    readDiamondContractLoaded: boolean;
    writeDiamondContractLoaded: boolean;
    loadIframeSourceDiamondRead: (fLine?: string) => void;
    loadIframeSourceDiamondWrite: (fLine?: string) => void;
    activaTab: (tab: string) => void;
    cards_loaded?: boolean;
    loaddisqus: () => void;
    loadIframeSource: (fNumber?: string) => void;
    loadIframeSource5: (fNumber?: string) => void;
    loadIframeSourceProxyRead: (fNumber?: string) => void;
    loadIframeSourceProxyWrite: (fNumber?: string) => void;
    loadIframeSourceMultipleReadProxy: (fNumber?: string) => void;
    loadIframeSourceCustomRead: (fNumber?: string) => void;
    loadIframeSourceCustomWrite: (fNumber?: string) => void;
    loadIframeSourceNftTransfer: () => void;
    loadIframeSource7: (tab: string) => void;
    loadIframeSource2: () => void;
    loadIframeSource8: () => void;
    loadCardsIframe: () => void;
    showLoader: (loaded?: boolean) => void;
    loadIframeEvents: () => void;
    myTocSelect: (text: string) => void;
    contractframe?: string;
    openModal: (iframeId: string) => void;
    readNumberOfIframes?: number;
    writeNumberOfIframes?: number;
    resizeIframe: (obj: HTMLIFrameElement | HTMLDivElement, addwidth: number) => void;
    openProxyModal: (iframeId: string) => void;
  }
  var $: any;
  var bootstrap: any;
  var mode: string;
  var strNetwork: string;
}

declare let tempI: number;

(window as any).readDiamondContractLoaded = false;
(window as any).loadIframeSourceDiamondRead = function (fLine: string) {
  if (window.readDiamondContractLoaded == false) {
    window.readDiamondContractLoaded = true;
    const iframes = document.getElementById("readdiamondcontractiframe")!.children!;
    window.readNumberOfIframes = iframes.length;

    for (let i = 0; i < iframes.length; i++) {
      const iframe = iframes?.item(i)! as HTMLIFrameElement;
      const address = iframe.getAttribute("data-address");
      const moduleAddress = iframe.getAttribute("data-module-address");
      let link = `/readContract?m=${window.mode}&a=${address}&n=${strNetwork}&v=${moduleAddress}&diamond=read&iframeId=${i}`;
      if (fLine) link += "&F=" + fLine;
      iframe.src = link;
    }
  }
};
(window as any).writeDiamondContractLoaded = false;
(window as any).loadIframeSourceDiamondWrite = function (fLine: string) {
  if (window.writeDiamondContractLoaded == false) {
    window.writeDiamondContractLoaded = true;
    const iframes = document.getElementById("writediamondcontractiframe")!.children!;
    window.writeNumberOfIframes = iframes.length;

    for (let i = 0; i < iframes.length; i++) {
      const iframe = iframes?.item(i)! as HTMLIFrameElement;
      const address = iframe.getAttribute("data-address");
      const moduleAddress = iframe.getAttribute("data-module-address");
      let link = `/writecontract/index?m=${window.mode}&v=21.10.1.1&a=${address}&p=${moduleAddress}&n=${strNetwork}&diamond=write&iframeId=${i}`;
      if (fLine) link += "&F=" + fLine;
      iframe.src = link;
    }
  }
};

// In original script obj is assumed to be an iframe.
// However, in diamond view, it can also be a div containing multiple iframes.
// So we handle that case in else block.
window.resizeIframe = function (obj, addwidth) {
  setTimeout(function () {
    if (obj.tagName === "IFRAME") {
      const iframe = obj as HTMLIFrameElement;
      iframe.style.height = iframe.contentWindow!.document.body.scrollHeight + addwidth + 20 + "px";
      const id = iframe.id;
      if (id != "readdiamondcontractiframe" && id != "writediamondcontractiframe") iframe.parentElement!.style.visibility = "visible";
    } else {
      const div = obj as HTMLDivElement;
      if (div.id == "readdiamondcontractiframe") {
        if (window.readNumberOfIframes && window.readNumberOfIframes > 0) {
          window.readNumberOfIframes--;
          if (window.readNumberOfIframes > 0) return;
        }
      } else {
        if (window.writeNumberOfIframes && window.writeNumberOfIframes > 0) {
          window.writeNumberOfIframes--;
          if (window.writeNumberOfIframes > 0) return;
        }
      }
      // TODO: fix - if page is not visible during loading, it will calculate incorrect height.
      for (const sub of Array.from(div.children) as HTMLIFrameElement[]) {
        let content_height = sub.contentWindow!.document.getElementById("readContractAccordion")?.getBoundingClientRect()?.bottom;
        if (!content_height) {
          const sel = sub.contentWindow!.document.querySelectorAll("body > .card");
          content_height = sel[sel.length - 1]?.getBoundingClientRect()?.bottom;
        }
        if (!content_height) {
          content_height = sub.contentWindow!.document.body.scrollHeight;
        }
        sub.style.height = Math.ceil(content_height) + 50 + "px";
      }
      for (const sub of Array.from(obj.children)) {
        sub.parentElement!.style.visibility = "visible";
      }
      const capital = div.id == "readdiamondcontractiframe" ? "Read" : "Write";
      window.parent.document.getElementById("loading" + capital + "DiamondContractframe")!.style.display = "none";
    }
  }, 300);
};

(window as any).activaTab = function (tab: string): void {
  var subtab: string = "0";
  let fNumber: string | undefined;
  if (tab.lastIndexOf("#") > -1) {
    fNumber = tab.substring(tab.lastIndexOf("#"), tab.length);
    fNumber = fNumber.replace("#F", "");
  }
  if (tab.indexOf("comment") >= 0) {
    tab = "comments";
    window.loaddisqus();
  } else if (tab.indexOf("code") >= 0) {
    subtab = "1";
  } else if (tab.indexOf("readContract") >= 0) {
    subtab = "1";
    window.loadIframeSource(fNumber);
  } else if (tab.indexOf("writeContract") >= 0) {
    subtab = "1";
    window.loadIframeSource5(fNumber);
  } else if (tab.indexOf("readProxyContract") >= 0) {
    subtab = "1";
    window.loadIframeSourceProxyRead(fNumber);
  } else if (tab.indexOf("writeProxyContract") >= 0) {
    subtab = "1";
    window.loadIframeSourceProxyWrite(fNumber);
  } else if (tab.indexOf("multipleProxyContract") >= 0) {
    subtab = "1";
    window.loadIframeSourceMultipleReadProxy(fNumber);
  } else if (tab.indexOf("readCustomContract") >= 0) {
    subtab = "1";
    window.loadIframeSourceCustomRead(fNumber);
  } else if (tab.indexOf("writeCustomContract") >= 0) {
    subtab = "1";
    window.loadIframeSourceCustomWrite(fNumber);
  } else if (tab.indexOf("readDiamond") >= 0) {
    subtab = "1";
    window.loadIframeSourceDiamondRead(fNumber);
  } else if (tab.indexOf("writeDiamond") >= 0) {
    subtab = "1";
    window.loadIframeSourceDiamondWrite(fNumber);
  }
  //else if (tab.indexOf('tokentxnsErc721') >= 0) {
  //    loadIframeSource6();
  //}
  //else if (tab.indexOf('tokentxnsErc1155') >= 0) {
  //    loadIframeSourceErc1155();
  //}
  else if (tab.indexOf("nfttransfers") >= 0) {
    window.loadIframeSourceNftTransfer();
  } else if (tab.indexOf("analytics") >= 0) {
    bootstrap.Tab.getInstance(document.querySelector('.nav_tabs1 a[data-bs-target="#analytics"]')).show();
    window.loadIframeSource7(tab);
  } else if (tab.indexOf("tokentxns") >= 0) {
    window.loadIframeSource2();
  }
  //else if (tab.indexOf('loansAddress') >= 0) {
  //    loadIframeSource9();
  //}
  else if (tab.indexOf("cards") >= 0) {
    window.loadCardsIframe();
    window.showLoader(window.cards_loaded);
  } else if (tab.indexOf("loans") >= 0) {
    window.loadIframeSource8();
  } else if (tab.indexOf("events") >= 0) {
    window.loadIframeEvents();
  } else if (tab.indexOf("beaconchain") >= 0 || tab.indexOf("deposits") >= 0 || tab.indexOf("withdrawals") >= 0) {
    let beaconChainTab = document.querySelector('.nav_tabs1 a[data-bs-target="#beaconchain"]');
    if (beaconChainTab) {
      bootstrap.Tab.getInstance(beaconChainTab).show();
    }
    let depositsTab = document.querySelector('.nav_tabs1 a[data-bs-target="#deposits"]');
    let withdrawalsTab = document.querySelector('.nav_tabs1 a[data-bs-target="#withdrawals"]');
    if (!!depositsTab) {
      bootstrap.Tab.getInstance(depositsTab).show();
    } else if (!!withdrawalsTab) {
      bootstrap.Tab.getInstance(withdrawalsTab).show();
    }
  }
  var obj1 = document.getElementById("ContentPlaceHolder1_li_readContract");
  var obj2 = document.getElementById("ContentPlaceHolder1_li_writeContract");
  var obj3 = document.getElementById("ContentPlaceHolder1_li_readProxyContract");
  var obj4 = document.getElementById("ContentPlaceHolder1_li_writeProxyContract");
  var obj5 = document.getElementById("ContentPlaceHolder1_li_readCustomContract");
  var obj6 = document.getElementById("ContentPlaceHolder1_li_writeCustomContract");
  var obj7 = document.getElementById("ContentPlaceHolder1_li_multipleProxyContract");
  var obj8 = document.getElementById("ContentPlaceHolder1_li_readDiamond");
  var obj9 = document.getElementById("ContentPlaceHolder1_li_writeDiamond");
  document.getElementById("divClientMultiSearch")!.style.display = "none";
  if (subtab === "0") {
    if (tab.indexOf("analytics") >= 0) {
      //Do nothing.
    } else {
      bootstrap.Tab.getInstance(document.querySelector('.nav_tabs1 li a[data-bs-target="#' + tab + '"]')).show();
    }
    if (obj1 === null && obj2 === null && obj3 === null && obj4 === null && obj5 === null && obj6 === null && obj7 === null && obj8 === null && obj9 === null) {
      document.getElementById("nav_subtabs")!.style.display = "none";
      $("#code").attr("style", "display:visible;");
    } else {
      document.getElementById("nav_subtabs")!.style.display = "visible";
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
    bootstrap.Tab.getInstance(document.querySelector('.nav_tabs1 a[data-bs-target="#contracts"]')).show();
    if (obj1 === null && obj2 === null && obj3 === null && obj4 === null && obj5 === null && obj6 === null && obj7 === null && obj8 === null && obj9 === null) {
      document.getElementById("nav_subtabs")!.style.display = "none";
      $("#nav_subtabs").parent().removeClass("d-md-flex");
      $("#nav_subtabs").parent().hide();
    } else {
      document.getElementById("nav_subtabs")!.style.display = "visible";
      bootstrap.Tab.getInstance(document.querySelector('.nav-subtabs li a[data-bs-target="#' + tab + '"]')).show();
      tempI++;
      if (tab === "code" && tempI === 2)
        setTimeout(function () {
          var searchText = window.localStorage.getItem("searchCode");
          if (searchText) {
            window.myTocSelect("event " + searchText + "(");
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
      document.getElementById("divClientMultiSearch")!.style.display = "block";
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
