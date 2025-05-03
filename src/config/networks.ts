import { NetworkInfo } from "../types/dao";

// Import network icons
import ethereumIcon from "../assets/networks/ethereum.png";
import bnbIcon from "../assets/networks/bnb.png";
import polygonIcon from "../assets/networks/polygon.png";
import arbitrumIcon from "../assets/networks/arbitrum.png";
import optimismIcon from "../assets/networks/optimism.png";
import baseIcon from "../assets/networks/base.png";
import avalancheIcon from "../assets/networks/avalanche.png";
import gnosisIcon from "../assets/networks/gnosis.png";
import mantleIcon from "../assets/networks/mantle.png";
import celoIcon from "../assets/networks/celo.png";
import blastIcon from "../assets/networks/blast.png";
import scrollIcon from "../assets/networks/scroll.png";
import unichainIcon from "../assets/networks/unichain.png";
import worldchainIcon from "../assets/networks/worldchain.png";

// Define the main networks
const mainNetworks: NetworkInfo[] = [
  {
    id: 11155111,
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
    id: 1,
    name: "Ethereum",
    isTestnet: false,
    icon: ethereumIcon,
    isAvailable: false,
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
  {
    id: 56,
    name: "BNB Chain",
    isTestnet: false,
    icon: bnbIcon,
    isAvailable: false,
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
  },
  {
    id: 137,
    name: "Polygon",
    isTestnet: false,
    icon: polygonIcon,
    isAvailable: true,
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
  },
  {
    id: 42161,
    name: "Arbitrum",
    isTestnet: false,
    icon: arbitrumIcon,
    isAvailable: true,
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
  {
    id: 10,
    name: "Optimism",
    isTestnet: false,
    icon: optimismIcon,
    isAvailable: false,
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
  {
    id: 8453,
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
  {
    id: 43114,
    name: "Avalanche",
    isTestnet: false,
    icon: avalancheIcon,
    isAvailable: false,
    nativeCurrency: {
      name: "Avalanche",
      symbol: "AVAX",
      decimals: 18,
    },
  },
  {
    id: 100,
    name: "Gnosis",
    isTestnet: false,
    icon: gnosisIcon,
    isAvailable: true,
    nativeCurrency: {
      name: "xDai",
      symbol: "XDAI",
      decimals: 18,
    },
  },
  {
    id: 5000,
    name: "Mantle",
    isTestnet: false,
    icon: mantleIcon,
    isAvailable: false,
    nativeCurrency: {
      name: "Mantle",
      symbol: "MNT",
      decimals: 18,
    },
  },
  {
    id: 42220,
    name: "Celo",
    isTestnet: false,
    icon: celoIcon,
    isAvailable: false,
    nativeCurrency: {
      name: "Celo",
      symbol: "CELO",
      decimals: 18,
    },
  },
  {
    id: 81457,
    name: "Blast",
    isTestnet: false,
    icon: blastIcon,
    isAvailable: false,
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
  {
    id: 534352,
    name: "Scroll",
    isTestnet: false,
    icon: scrollIcon,
    isAvailable: false,
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18,
    },
  },
  {
    id: 130,
    name: "Unichain",
    isTestnet: false,
    icon: unichainIcon,
    isAvailable: true,
    nativeCurrency: {
      name: "Unichain",
      symbol: "ETH",
      decimals: 18,
    },
  },
  {
    id: 480,
    name: "World Chain",
    isTestnet: false,
    icon: worldchainIcon,
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
          id: 31337,
          name: "HardHat",
          isTestnet: false,
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
    // Testnet
    case 11155111:
      return "https://sepolia.etherscan.io";

    // Mainnets
    case 1:
      return "https://etherscan.io";
    case 56:
      return "https://bscscan.com";
    case 137:
      return "https://polygonscan.com";
    case 42161:
      return "https://arbiscan.io";
    case 10:
      return "https://optimistic.etherscan.io";
    case 8453:
      return "https://basescan.org";
    case 43114:
      return "https://snowtrace.io";
    case 100:
      return "https://gnosisscan.io";
    case 5000:
      return "https://mantlescan.xyz";
    case 42220:
      return "https://celoscan.io";
    case 81457:
      return "https://blastscan.io";
    case 534352:
      return "https://scrollscan.com";
    case 130:
      return "https://uniscan.xyz";
    case 480:
      return "https://worldscan.org";
    default:
      return "https://etherscan.io";
  }
}

export function getNetworkById(chainId: number): NetworkInfo | undefined {
  return SUPPORTED_NETWORKS.find((network) => network.id === chainId);
}
