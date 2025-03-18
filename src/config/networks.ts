export const SUPPORTED_NETWORKS = [
  {
    id: 11155111,
    name: 'Sepolia Testnet',
    network: 'sepolia',
    nativeCurrency: {
      name: 'Sepolia Ether',
      symbol: 'SEP',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: [import.meta.env.VITE_SEPOLIA_RPC_URL],
      },
    },
    blockExplorers: {
      default: {
        name: 'Sepolia Etherscan',
        url: 'https://sepolia.etherscan.io',
      },
    },
    testnet: true,
  },
  {
    id: 1,
    name: 'Ethereum',
    network: 'mainnet',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: [import.meta.env.VITE_MAINNET_RPC_URL],
      },
    },
    blockExplorers: {
      default: {
        name: 'Etherscan',
        url: 'https://etherscan.io',
      },
    },
  },
  {
    id: 137,
    name: 'Polygon',
    network: 'polygon',
    nativeCurrency: {
      name: 'MATIC',
      symbol: 'MATIC',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: [import.meta.env.VITE_POLYGON_RPC_URL],
      },
    },
    blockExplorers: {
      default: {
        name: 'PolygonScan',
        url: 'https://polygonscan.com',
      },
    },
  },
  {
    id: 56,
    name: 'BNB Smart Chain',
    network: 'bsc',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: [import.meta.env.VITE_BSC_RPC_URL || 'https://bsc-dataseed.binance.org'],
      },
    },
    blockExplorers: {
      default: {
        name: 'BscScan',
        url: 'https://bscscan.com',
      },
    },
  },
  {
    id: 8453,
    name: 'Base',
    network: 'base',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: [import.meta.env.VITE_BASE_RPC_URL || 'https://mainnet.base.org'],
      },
    },
    blockExplorers: {
      default: {
        name: 'BaseScan',
        url: 'https://basescan.org',
      },
    },
  },
  {
    id: 42161,
    name: 'Arbitrum One',
    network: 'arbitrum',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: [import.meta.env.VITE_ARBITRUM_RPC_URL || 'https://arb1.arbitrum.io/rpc'],
      },
    },
    blockExplorers: {
      default: {
        name: 'Arbiscan',
        url: 'https://arbiscan.io',
      },
    },
  },
  {
    id: 43114,
    name: 'Avalanche',
    network: 'avalanche',
    nativeCurrency: {
      name: 'AVAX',
      symbol: 'AVAX',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: [import.meta.env.VITE_AVALANCHE_RPC_URL || 'https://api.avax.network/ext/bc/C/rpc'],
      },
    },
    blockExplorers: {
      default: {
        name: 'SnowTrace',
        url: 'https://snowtrace.io',
      },
    },
  },
  {
    id: 10,
    name: 'Optimism',
    network: 'optimism',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: [import.meta.env.VITE_OPTIMISM_RPC_URL || 'https://mainnet.optimism.io'],
      },
    },
    blockExplorers: {
      default: {
        name: 'Optimism Explorer',
        url: 'https://optimistic.etherscan.io',
      },
    },
  },
  {
    id: 100,
    name: 'Gnosis Chain',
    network: 'gnosis',
    nativeCurrency: {
      name: 'xDAI',
      symbol: 'xDAI',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: [import.meta.env.VITE_GNOSIS_RPC_URL || 'https://rpc.gnosischain.com'],
      },
    },
    blockExplorers: {
      default: {
        name: 'Gnosis Chain Explorer',
        url: 'https://gnosisscan.io',
      },
    },
  },
  {
    id: 81457,
    name: 'Blast',
    network: 'blast',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: [import.meta.env.VITE_BLAST_RPC_URL || 'https://rpc.blast.io'],
      },
    },
    blockExplorers: {
      default: {
        name: 'Blastscan',
        url: 'https://blastscan.io',
      },
    },
  },
  {
    id: 534352,
    name: 'Scroll',
    network: 'scroll',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: [import.meta.env.VITE_SCROLL_RPC_URL || 'https://rpc.scroll.io'],
      },
    },
    blockExplorers: {
      default: {
        name: 'Scrollscan',
        url: 'https://scrollscan.com',
      },
    },
  },
] as const

export const getDefaultChainId = (): number => {
  const defaultChainId = import.meta.env.VITE_DEFAULT_CHAIN_ID
  return defaultChainId ? parseInt(defaultChainId) : SUPPORTED_NETWORKS[0].id
}

export const isTestnet = (chainId: number): boolean => {
  const network = SUPPORTED_NETWORKS.find(n => n.id === chainId)
  return network && 'testnet' in network ? network.testnet : false
}

export const getNetworkName = (chainId: number): string => {
  const network = SUPPORTED_NETWORKS.find(n => n.id === chainId)
  return network?.name || 'Unknown Network'
}

export const getExplorerUrl = (chainId: number): string => {
  const network = SUPPORTED_NETWORKS.find(n => n.id === chainId)
  return network?.blockExplorers?.default?.url || ''
}
