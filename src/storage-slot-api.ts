const HEDODOTUS_ULR = "https://staging.api.herodotus.cloud";

export const apiRequestBuilder = {
  getAccountProperties: (ctx: {
    originChainId: string;
    destinationChainId: string;
    blockNumber: string;
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
