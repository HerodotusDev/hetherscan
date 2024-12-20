export const HEDODOTUS_URL = "https://staging.api.herodotus.cloud";

export const DASHBOARD_URL = "https://staging.dashboard.herodotus.dev/explorer/query";
export const getDashboardUrl = (internalId: string) => {
  return `${DASHBOARD_URL}/${internalId}`;
};

export const apiRequestBuilder = {
  getAccountProperties: (ctx: { originChainId: string; destinationChainId: string; blockNumber: number; account: string; properties: string[] }) => {
    return {
      destinationChainId: ctx.destinationChainId,
      fee: "0",
      data: {
        [ctx.originChainId]: {
          [`block:${ctx.blockNumber}`]: {
            accounts: {
              [ctx.account]: {
                props: ctx.properties,
                slots: [],
              },
            },
          },
        },
      },
    };
  },
  getBlockHeaderProperties: (ctx: { originChainId: string; destinationChainId: string; blockNumber: string; properties: string[] }) => {
    return {
      destinationChainId: ctx.destinationChainId,
      fee: "0",
      data: {
        [ctx.originChainId]: {
          [`block:${ctx.blockNumber}`]: {
            header: ctx.properties,
          },
        },
      },
    };
  },
};

export const accountProperties = ["BALANCE", "NONCE", "CODE_HASH", "STORAGE_ROOT"];

// FIXME: this comes from backend
// https://staging.api.herodotus.cloud/chain-connections
const connections = [
  {
    originChainId: "11155111",
    destinationChainId: "300",
  },
  {
    originChainId: "11155111",
    destinationChainId: "11155111",
  },
  {
    originChainId: "11155111",
    destinationChainId: "11155420",
  },
  {
    originChainId: "11155111",
    destinationChainId: "SN_SEPOLIA",
  },
  {
    originChainId: "11155111",
    destinationChainId: "421614",
  },
  {
    originChainId: "11155111",
    destinationChainId: "4801",
  },
  {
    originChainId: "11155111",
    destinationChainId: "33111",
  },
];

export const getDestinationForOriginChainId = (originChainId: string) => {
  return connections.filter((c) => c.originChainId === originChainId).map((c) => c.destinationChainId);
};

export const headerProperties = [
  "PARENT_HASH",
  "UNCLES_HASH",
  "COINBASE",
  "PROPOSER",
  "STATE_ROOT",
  "TRANSACTIONS_ROOT",
  "RECEIPTS_ROOT",
  "LOGS_BLOOM",
  "DIFFICULTY",
  "BLOCK_NUMBER",
  "GAS_LIMIT",
  "GAS_USED",
  "TIMESTAMP",
  "EXTRA_DATA",
  "MIX_HASH",
  "NONCE",
  "BASE_FEE_PER_GAS",
  "WITHDRAWALS_ROOT",
  "BLOB_GAS_USED",
  "EXCESS_BLOB_GAS",
  "PARENT_BEACON_BLOCK_ROOT",
  "PROPOSER",
];
