import { NetworkInfo } from "../types/dao";
import { SUPPORTED_CHAIN_IDS } from "./wagmi";

// Import network icons
import ethereumIcon from "../assets/networks/ethereum.png";
import baseIcon from "../assets/networks/base.png";

// Define the supported networks for v2.0.0
// Currently only Sepolia (testnet) and Base (mainnet) are supported
const mainNetworks: NetworkInfo[] = [
  {
    id: SUPPORTED_CHAIN_IDS.SEPOLIA,
    name: "Sepolia",
    isTestnet: true,
    icon: ethereumIcon,
    isAvailable: true,
    nativeCurrency: {
      name: "Sepolia Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
  {
    id: SUPPORTED_CHAIN_IDS.BASE,
    name: "Base",
    isTestnet: false,
    icon: baseIcon,
    isAvailable: true,
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
];

// Add Hardhat network only in development environment
export const SUPPORTED_NETWORKS: NetworkInfo[] = [
  ...mainNetworks,
  ...(process.env.NODE_ENV === "development"
    ? [
        {
          id: SUPPORTED_CHAIN_IDS.HARDHAT,
          name: "HardHat",
          isTestnet: true,
          icon: ethereumIcon,
          isAvailable: true,
          nativeCurrency: {
            name: "Ethereum",
            symbol: "eth",
            decimals: 18,
          },
        },
      ]
    : []),
];

export function getExplorerUrl(chainId: number): string {
  switch (chainId) {
    case SUPPORTED_CHAIN_IDS.SEPOLIA:
      return "https://sepolia.etherscan.io";
    case SUPPORTED_CHAIN_IDS.BASE:
      return "https://basescan.org";
    default:
      return "https://etherscan.io";
  }
}

export function getNetworkById(chainId: number): NetworkInfo | undefined {
  return SUPPORTED_NETWORKS.find((network) => network.id === chainId);
}
