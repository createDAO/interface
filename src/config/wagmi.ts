import * as wagmiChains from "wagmi/chains";
import { createConfig, http, cookieStorage, createStorage } from "wagmi";
import {
  metaMask,
  coinbaseWallet,
  walletConnect,
  injected,
} from "wagmi/connectors";

// Create a singleton instance of WalletConnect to prevent multiple initializations
let walletConnectInstance: ReturnType<typeof walletConnect> | null = null;
const getWalletConnectConnector = () => {
  if (!walletConnectInstance) {
    const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;
    
    if (!projectId) {
      throw new Error("WalletConnect Project ID is required. Please set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in your environment variables.");
    }

    walletConnectInstance = walletConnect({
      projectId,
      metadata: {
        name: "CreateDAO",
        description: "Create a decentralized organization on any supported blockchain in minutes.",
        url: "https://createdao.org",
        icons: "https://createdao.org/favicon.png"
      },
      qrModalOptions: {
        themeMode: 'dark',
      },
    });
  }
  return walletConnectInstance;
};

import type { Chain } from "wagmi/chains";

// Map of chain IDs to wagmi chain objects
const chainMap: Record<number, Chain> = {
  // Testnet
  11155111: wagmiChains.sepolia,
  31337: wagmiChains.hardhat,
  // Mainnets
  1: wagmiChains.mainnet,
  56: wagmiChains.bsc,
  137: wagmiChains.polygon,
  42161: wagmiChains.arbitrum,
  10: wagmiChains.optimism,
  8453: wagmiChains.base,
  43114: wagmiChains.avalanche,
  100: wagmiChains.gnosis,
  5000: wagmiChains.mantle,
  42220: wagmiChains.celo,
  81457: wagmiChains.blast,
  534352: wagmiChains.scroll,
  130: wagmiChains.unichain,
  480: wagmiChains.worldchain,
};

// DRPC network name mapping
const getDrpcNetworkName = (chainId: number): string => {
  switch (chainId) {
    case 11155111: return "sepolia";
    case 31337: return "hardhat";
    case 1: return "ethereum";
    case 56: return "bsc";
    case 137: return "polygon";
    case 42161: return "arbitrum";
    case 10: return "optimism";
    case 8453: return "base";
    case 43114: return "avalanche";
    case 100: return "gnosis";
    case 5000: return "mantle";
    case 42220: return "celo";
    case 81457: return "blast";
    case 534352: return "scroll";
    case 130: return "unichain";
    case 480: return "worldchain";
    default: return "ethereum";
  }
};

// Create DRPC URL for a given chain
const getDrpcUrl = (chainId: number): string => {
  const network = getDrpcNetworkName(chainId);
  return `https://lb.drpc.org/ogrpc?network=${network}&dkey=${process.env.NEXT_PUBLIC_DRPC_API_KEY}`;
};

// Create an array of all supported chains
// Make sure the first chain is sepolia (as the default)
const defaultChain = wagmiChains.sepolia;
const otherChains = Object.values(chainMap).filter(chain => chain.id !== defaultChain.id);
const chains: [Chain, ...Chain[]] = [defaultChain, ...otherChains];

// Create transports for all chains
const transports: Record<number, ReturnType<typeof http>> = {};

// Add transport for each chain
for (const chain of chains) {
  if (chain.id === 31337 && process.env.NODE_ENV === 'development') {
    transports[chain.id] = http("http://127.0.0.1:8545/");
  } else {
    transports[chain.id] = http(getDrpcUrl(chain.id));
  }
}

// Create wagmi config with all chains
const config = createConfig({
  chains,
  connectors: [
    metaMask({
      dappMetadata: {
        name: "CreateDAO",
        url: typeof window !== 'undefined' ? window.location.origin : "https://createdao.org",
        iconUrl: typeof window !== 'undefined' ? `${window.location.origin}/favicon.png` : "https://createdao.org/favicon.png"
      }
    }),
    coinbaseWallet({
      appName: "CreateDAO",
    }),
    getWalletConnectConnector(),
    injected({
      shimDisconnect: true,
    }),
  ],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports,
});

export default config;
