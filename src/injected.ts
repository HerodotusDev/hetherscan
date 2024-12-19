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
