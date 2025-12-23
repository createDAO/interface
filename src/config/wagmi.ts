import * as wagmiChains from "wagmi/chains";
import { createConfig, http, cookieStorage, createStorage, fallback, type Transport } from "wagmi";
import { metaMask, coinbaseWallet, walletConnect, injected } from "wagmi/connectors";
import { nyknyc } from "@nyknyc/wagmi-connector";

// Create a singleton instance of WalletConnect to prevent multiple initializations
let walletConnectInstance: ReturnType<typeof walletConnect> | null = null;
const getWalletConnectConnector = () => {
  if (!walletConnectInstance) {
    const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

    if (!projectId) {
      throw new Error(
        "WalletConnect Project ID is required. Please set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in your environment variables."
      );
    }

    walletConnectInstance = walletConnect({
      projectId,
      metadata: {
        name: "CreateDAO",
        description:
          "Create a decentralized organization on any supported blockchain in minutes.",
        url: "https://createdao.org",
        icons: ["https://createdao.org/favicon.png"],
      },
      qrModalOptions: {
        themeMode: "dark",
      },
    });
  }
  return walletConnectInstance;
};

// Create a function to get and validate NYKNYC App ID
const getNyknycAppId = (): string => {
  const appId = process.env.NEXT_PUBLIC_NYKNYC_APP_ID;

  if (!appId) {
    throw new Error(
      "NYKNYC App ID is required. Please set NEXT_PUBLIC_NYKNYC_APP_ID in your environment variables."
    );
  }

  return appId;
};

import type { Chain } from "wagmi/chains";

// Supported network chain IDs
export const SUPPORTED_CHAIN_IDS = {
  SEPOLIA: 11155111,
  BASE: 8453,
  HARDHAT: 31337,
} as const;

// Map of supported chain IDs to wagmi chain objects
const chainMap: Record<number, Chain> = {
  [SUPPORTED_CHAIN_IDS.SEPOLIA]: wagmiChains.sepolia,
  [SUPPORTED_CHAIN_IDS.BASE]: wagmiChains.base,
  [SUPPORTED_CHAIN_IDS.HARDHAT]: wagmiChains.hardhat,
};

// DRPC network name mapping for supported chains
const DRPC_NETWORK_NAMES: Record<number, string> = {
  [SUPPORTED_CHAIN_IDS.SEPOLIA]: "sepolia",
  [SUPPORTED_CHAIN_IDS.BASE]: "base",
};

// Public fallback RPC URLs for supported chains
const PUBLIC_RPC_URLS: Record<number, string[]> = {
  [SUPPORTED_CHAIN_IDS.SEPOLIA]: [
    "https://rpc.sepolia.org",
    "https://ethereum-sepolia-rpc.publicnode.com",
  ],
  [SUPPORTED_CHAIN_IDS.BASE]: [
    "https://mainnet.base.org",
    "https://base.publicnode.com",
  ],
};

// Create DRPC URL for a given chain
const getDrpcUrl = (chainId: number): string | null => {
  const network = DRPC_NETWORK_NAMES[chainId];
  if (!network) return null;
  
  const apiKey = process.env.NEXT_PUBLIC_DRPC_API_KEY;
  if (!apiKey) {
    console.warn("DRPC API key not configured, using public RPCs only");
    return null;
  }
  
  return `https://lb.drpc.org/ogrpc?network=${network}&dkey=${apiKey}`;
};

// Create transport with fallbacks for a chain
const createChainTransport = (chainId: number) => {
  // Special case for local development
  if (chainId === SUPPORTED_CHAIN_IDS.HARDHAT && process.env.NODE_ENV === "development") {
    return http("http://127.0.0.1:8545/");
  }

  const transports: ReturnType<typeof http>[] = [];
  
  // Add DRPC as primary if available
  const drpcUrl = getDrpcUrl(chainId);
  if (drpcUrl) {
    transports.push(http(drpcUrl));
  }
  
  // Add public fallback RPCs
  const publicUrls = PUBLIC_RPC_URLS[chainId] || [];
  for (const url of publicUrls) {
    transports.push(http(url));
  }
  
  // If we have multiple transports, use fallback; otherwise use single transport
  if (transports.length > 1) {
    return fallback(transports);
  }
  
  return transports[0] || http();
};

// Get supported chains based on environment
const getSupportedChains = (): [Chain, ...Chain[]] => {
  const chains: Chain[] = [
    chainMap[SUPPORTED_CHAIN_IDS.SEPOLIA],
    chainMap[SUPPORTED_CHAIN_IDS.BASE],
  ];
  
  // Add Hardhat only in development
  if (process.env.NODE_ENV === "development") {
    chains.push(chainMap[SUPPORTED_CHAIN_IDS.HARDHAT]);
  }
  
  return chains as [Chain, ...Chain[]];
};

// Create transports for supported chains
const createTransports = (chains: Chain[]): Record<number, Transport> => {
  const transports: Record<number, Transport> = {};
  
  for (const chain of chains) {
    transports[chain.id] = createChainTransport(chain.id);
  }
  
  return transports;
};

// Create wagmi config with supported chains - exported as factory function
export function getWagmiConfig() {
  const chains = getSupportedChains();
  const transports = createTransports(chains);
  
  return createConfig({
    chains,
    connectors: [
      // Only load these connectors on the client side (when indexedDB is available)
      // This prevents "ReferenceError: indexedDB is not defined" during SSR
      ...(typeof indexedDB !== "undefined"
        ? [
            metaMask({
              dappMetadata: {
                name: "CreateDAO",
                url:
                  typeof window !== "undefined"
                    ? window.location.origin
                    : "https://createdao.org",
                iconUrl:
                  typeof window !== "undefined"
                    ? `${window.location.origin}/favicon.png`
                    : "https://createdao.org/favicon.png",
              },
            }),
            coinbaseWallet({
              appName: "CreateDAO",
            }),
            getWalletConnectConnector(),
          ]
        : []
      ),
      // These connectors work on both server and client
      nyknyc({
        appId: getNyknycAppId(),
      }),
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
}
