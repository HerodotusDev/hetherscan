export const ALL_SCANS = [
  "etherscan.io",
  "sepolia.etherscan.io",
  "holesky.etherscan.io",
  "polygonscan.com",
  "amoy.polygonscan.com",
  "bscscan.com",
  "testnet.bscscan.com",
  "ftmscan.com",
  "testnet.ftmscan.com",
  "optimistic.etherscan.io",
  "sepolia-optimism.etherscan.io",
  "gnosisscan.io",
  "zkevm.polygonscan.com",
  "cardona-zkevm.polygonscan.com",
  "lineascan.build",
  "sepolia.lineascan.build",
  "scrollscan.com",
  "sepolia.scrollscan.com",
  "fraxscan.com",
  "snowscan.xyz",
  "testnet.snowscan.xyz",
  "sepolia.arbiscan.io",
] as const;

export const RPC_ENDPOINTS: Record<(typeof ALL_SCANS)[number], string> = {
  "etherscan.io": "https://ethereum-rpc.publicnode.com",
  "sepolia.etherscan.io": "https://ethereum-sepolia-rpc.publicnode.com",
  "holesky.etherscan.io": "https://ethereum-holesky-rpc.publicnode.com",
  "polygonscan.com": "https://polygon-bor-rpc.publicnode.com",
  "amoy.polygonscan.com": "https://polygon-amoy-bor-rpc.publicnode.com",
  "bscscan.com": "https://bsc-rpc.publicnode.com",
  "testnet.bscscan.com": "https://bsc-testnet-rpc.publicnode.com",
  "ftmscan.com": "https://fantom-rpc.publicnode.com",
  "testnet.ftmscan.com": "https://fantom-testnet-rpc.publicnode.com",
  "optimistic.etherscan.io": "https://optimism-rpc.publicnode.com",
  "sepolia-optimism.etherscan.io": "https://optimism-sepolia-rpc.publicnode.com",
  "gnosisscan.io": "https://gnosis-rpc.publicnode.com",
  "zkevm.polygonscan.com": "https://zkevm-rpc.com",
  "cardona-zkevm.polygonscan.com": "https://rpc.cardona.zkevm-rpc.com",
  "lineascan.build": "https://rpc.linea.build",
  "sepolia.lineascan.build": "https://rpc.sepolia.linea.build",
  "scrollscan.com": "https://rpc.scroll.io",
  "sepolia.scrollscan.com": "https://sepolia-rpc.scroll.io",
  "fraxscan.com": "https://rpc.frax.com",
  "snowscan.xyz": "https://avalanche-c-chain-rpc.publicnode.com",
  "testnet.snowscan.xyz": "https://avalanche-fuji-c-chain-rpc.publicnode.com",
  "sepolia.arbiscan.io": "https://arbitrum-sepolia-rpc.publicnode.com",
};

export const CHAIN_IDS: Record<(typeof ALL_SCANS)[number], string> = {
  "etherscan.io": "1",
  "sepolia.etherscan.io": "11155111",
  "holesky.etherscan.io": "17000",
  "polygonscan.com": "137",
  "amoy.polygonscan.com": "80002",
  "bscscan.com": "56",
  "testnet.bscscan.com": "97",
  "ftmscan.com": "250",
  "testnet.ftmscan.com": "4002",
  "optimistic.etherscan.io": "10",
  "sepolia-optimism.etherscan.io": "11155420",
  "gnosisscan.io": "100",
  "zkevm.polygonscan.com": "1101",
  "cardona-zkevm.polygonscan.com": "1442",
  "lineascan.build": "59144",
  "sepolia.lineascan.build": "59141",
  "scrollscan.com": "534352",
  "sepolia.scrollscan.com": "534351",
  "fraxscan.com": "252",
  "snowscan.xyz": "43114",
  "testnet.snowscan.xyz": "43113",
  "sepolia.arbiscan.io": "421614",
};
