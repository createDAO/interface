import { http, createConfig } from "wagmi";
import {
  mainnet,
  sepolia,
  bsc,
  base,
  arbitrum,
  avalanche,
  polygon,
  optimism,
  gnosis,
  blast,
  scroll,
} from "wagmi/chains";
import { walletConnect, coinbaseWallet, injected } from "wagmi/connectors";
import { env, getWalletMetadata } from "./env";

// Create wagmi config
export const config = createConfig({
  chains: [
    sepolia,
    mainnet,
    bsc,
    base,
    arbitrum,
    avalanche,
    polygon,
    optimism,
    gnosis,
    blast,
    scroll,
  ],
  connectors: [
    injected(),
    walletConnect({
      projectId: env.wallet.projectId,
      metadata: getWalletMetadata(),
      showQrModal: true,
      qrModalOptions: {
        themeMode: "dark",
        themeVariables: {
          "--wcm-z-index": "1001",
        },
      },
    }),
    coinbaseWallet({
      appName: env.wallet.appName,
    }),
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [bsc.id]: http(),
    [base.id]: http(),
    [arbitrum.id]: http(),
    [avalanche.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [gnosis.id]: http(),
    [blast.id]: http(),
    [scroll.id]: http(),
  },
});

// Helper functions
export const getChainById = (chainId: number) => {
  return config.chains.find((chain) => chain.id === chainId);
};

export const isSupportedChain = (chainId: number): boolean => {
  return config.chains.some((chain) => chain.id === chainId);
};

export const getChainRpcUrl = (chainId: number): string => {
  const chain = getChainById(chainId);
  return chain?.rpcUrls.default.http[0] || "";
};
