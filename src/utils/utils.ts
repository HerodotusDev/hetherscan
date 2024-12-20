import { RPC_ENDPOINTS } from "./constants";

export async function queryRPC(method, params) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    jsonrpc: "2.0",
    method,
    params,
    id: 1,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  const endpoint = RPC_ENDPOINTS[window.location.hostname];

  return fetch(endpoint, requestOptions)
    .then((response) => response.json())
    .then((data) => data.result)
    .catch((error) => console.error("error", error));
}

export function trimHex(hex) {
  return hex.slice(0, 8) + "..." + hex.slice(-8);
}

export function isNumeric(input) {
  const decimalRegex = /^\d+$/;
  const hexRegex = /^(0x|0X)?[0-9a-fA-F]+$/;
  return decimalRegex.test(input) || hexRegex.test(input);
}
