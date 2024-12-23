interface ChainConnection {
  originChainId: string;
  destinationChainId: string;
}

interface ConnectionsResponse {
  connections: ChainConnection[];
}

export const HEDODOTUS_URL = "https://api.herodotus.cloud";
export const DASHBOARD_URL = "https://dashboard.herodotus.dev/explorer/query";

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

export const fetchConnections = async (): Promise<ChainConnection[]> => {
  const response = await fetch(`${HEDODOTUS_URL}/chain-connections`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const data: ConnectionsResponse = await response.json();
  return data.connections;
};

export const getDestinationForOriginChainId = async (originChainId: string) => {
  const connections = await fetchConnections();
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
