const HEDODOTUS_ULR = "https://staging.api.herodotus.cloud";

export const apiRequestBuilder = {
  getAccountProperties: (ctx: {
    originChainId: string;
    destinationChainId: string;
    blockNumber: number;
    account: string;
    properties: string[];
  }) => {
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
  getBlockHeaderProperties: (ctx: {
    originChainId: string;
    destinationChainId: string;
    blockNumber: string;
    properties: string[];
  }) => {
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

// export const zProvableHeaderProperty = z.enum([
//   "PARENT_HASH",
//   "UNCLES_HASH",
//   "COINBASE",
//   "PROPOSER",
//   "STATE_ROOT",
//   "TRANSACTIONS_ROOT",
//   "RECEIPTS_ROOT",
//   "LOGS_BLOOM",
//   "DIFFICULTY",
//   "BLOCK_NUMBER",
//   "GAS_LIMIT",
//   "GAS_USED",
//   "TIMESTAMP",
//   "EXTRA_DATA",
//   "MIX_HASH",
//   "NONCE",
//   "BASE_FEE_PER_GAS",
//   "WITHDRAWALS_ROOT",
//   "BLOB_GAS_USED",
//   "EXCESS_BLOB_GAS",
//   "PARENT_BEACON_BLOCK_ROOT",
//   "PROPOSER",
// ]);
