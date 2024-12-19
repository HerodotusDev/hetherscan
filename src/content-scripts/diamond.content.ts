console.log("✅ diamond.content.ts");

window.location.pathname.split("/")[2];

function elementFromHtml(content: string) {
  const element = document.createElement("ul");
  element.innerHTML = content.trim();
  return element.childNodes;
}

const contract_tabs = document.getElementById("nav_subtabs");

const extraHtml = `
    <li id="ContentPlaceHolder1_li_readDiamond" class="nav-item snap-align-start" role="presentation">
        <a class="nav-link" href="javascript:;" data-bs-toggle="pill" data-bs-target="#readDiamond" type="button" role="tab" aria-controls="readDiamond" aria-selected="false" onclick="javascript:updatehash('readDiamond');showLoader(window.readDiamondContractLoaded);loadIframeSourceDiamondRead();" tabindex="-1">Read as Diamond 🛰️<span class="d-none d-sm-inline-block"></span>
        </a>
    </li>
    <li id="ContentPlaceHolder1_li_writeDiamond" class="nav-item snap-align-start" role="presentation">
        <a class="nav-link" href="javascript:;" data-bs-toggle="pill" data-bs-target="#writeDiamond" type="button" role="tab" aria-controls="writeDiamond" aria-selected="false" onclick="javascript:updatehash('writeDiamond');showLoader(window.writeDiamondContractLoaded);loadIframeSource5();" tabindex="-1">Write as Diamond 🛰️<span class="d-none d-sm-inline-block"></span>
        </a>
    </li>
`;

const extraHtml2 = `
    <div class="tab-pane" id="readDiamondContract" style="display:none;">
        <div><span id="ContentPlaceHolder1_readDiamondMessage"></span></div>
        <div id="loadingReadDiamondContractframe" style="position:absolute; left:50%; margin-left:-31px">
            <!-- Spinner --><div id="overlayReadDiamondContract" class="text-center py-10 "><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><div class="small text-muted mt-1">Loading</div></div><!-- End Spinner -->
        </div>
        <div class="table-responsive" style=" visibility:hidden; line-height:0;">
            <iframe width="100%" id="readdiamondcontractiframe" src="" frameborder="0" scrolling="yes" style="height: 600px;"></iframe>
        </div>
    </div>
    <div class="tab-pane" id="writeDiamondContract" style="display:none;">
        <div><span id="ContentPlaceHolder1_writeDiamondMessage"></span></div>
        <div id="loadingWriteDiamondContractframe" style="position:absolute; left:50%; margin-left:-31px">
            <!-- Spinner --><div id="overlayWriteDiamondContract" class="text-center py-10 "><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div><div class="small text-muted mt-1">Loading</div></div><!-- End Spinner -->
        </div>
        <div class="table-responsive" style=" visibility:hidden; line-height:0;">
            <iframe width="100%" id="writediamondcontractiframe" src="" frameborder="0" scrolling="yes" style="height: 600px;"></iframe>
        </div>
    </div>

`;

const items = elementFromHtml(extraHtml);

items.forEach((item) => contract_tabs?.appendChild(item));

// /writecontract/index?m=light&v=21.10.1.1&a=0x6729366d0b9fb1bac44928c54fac9bb68a8728d1&n=sepolia&p=
// /readcontract/index?m=light&v=21.10.1.1&a=0x6729366d0b9fb1bac44928c54fac9bb68a8728d1&n=sepolia&p=
// /readContract?m=light&a=0xaAe29B0366299461418F5324a79Afc425BE5ae21&n=sepolia&v=0x4b31d35ce007c9744e71db8fc649629f3b7c619e

const contracts = document.getElementById("contracts")?.firstElementChild;
// 0x326E204bcbC9a85152997aeB3c2B2357FF603c74, 0x1ADb0a7b9fCF0E2Aee6784fa0D565C0c904dBA76

const items2 = elementFromHtml(extraHtml2);

items2.forEach((item) => contracts?.appendChild(item));

// var s = document.createElement('script')
// s.src = chrome.runtime.getURL('test_inject.js')
// s.onload = function () {
//     this.remove()
// }
// // see also "Dynamic values in the injected code" section in this answer
// ;(document.head || document.documentElement).appendChild(s)
