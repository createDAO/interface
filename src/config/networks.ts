import { NetworkInfo } from '../types/dao';

export const SUPPORTED_NETWORKS: NetworkInfo[] = [
  {
    id: 11155111,
    name: 'Sepolia',
    isTestnet: true,
    icon: '/images/networks/ethereum.svg'
  },
  {
    id: 1,
    name: 'Ethereum',
    isTestnet: false,
    icon: '/images/networks/ethereum.svg'
  },
  {
    id: 56,
    name: 'BNB Chain',
    isTestnet: false,
    icon: '/images/networks/bnb.svg'
  },
  {
    id: 137,
    name: 'Polygon',
    isTestnet: false,
    icon: '/images/networks/polygon.svg'
  },
  {
    id: 42161,
    name: 'Arbitrum',
    isTestnet: false,
    icon: '/images/networks/arbitrum.svg'
  },
  {
    id: 10,
    name: 'Optimism',
    isTestnet: false,
    icon: '/images/networks/optimism.svg'
  },
  {
    id: 8453,
    name: 'Base',
    isTestnet: false,
    icon: '/images/networks/base.svg'
  },
  {
    id: 43114,
    name: 'Avalanche',
    isTestnet: false,
    icon: '/images/networks/avalanche.svg'
  }
];

export function getExplorerUrl(chainId: number): string {
  switch (chainId) {
    case 1:
      return 'https://etherscan.io';
    case 11155111:
      return 'https://sepolia.etherscan.io';
    case 56:
      return 'https://bscscan.com';
    case 137:
      return 'https://polygonscan.com';
    case 42161:
      return 'https://arbiscan.io';
    case 10:
      return 'https://optimistic.etherscan.io';
    case 8453:
      return 'https://basescan.org';
    case 43114:
      return 'https://snowtrace.io';
    default:
      return 'https://etherscan.io';
  }
}

export function getNetworkById(chainId: number): NetworkInfo | undefined {
  return SUPPORTED_NETWORKS.find(network => network.id === chainId);
}
