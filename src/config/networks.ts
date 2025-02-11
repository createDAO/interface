export const SUPPORTED_NETWORKS = [
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
    id: 11155111,
    name: 'Sepolia',
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
