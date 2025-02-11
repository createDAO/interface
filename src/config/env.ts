// Environment variables configuration
export const env = {
  defaultChain: import.meta.env.VITE_DEFAULT_CHAIN_ID,
  wallet: {
    projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
    appName: import.meta.env.VITE_APP_NAME || 'createDAO'
  },
  dao: {
    factoryAddress: import.meta.env.VITE_DAO_FACTORY_ADDRESS as `0x${string}`,
    version: import.meta.env.VITE_DAO_VERSION || '1.0.0'
  },
  rpc: {
    ethereum: import.meta.env.VITE_ETHEREUM_RPC_URL,
    sepolia: import.meta.env.VITE_SEPOLIA_RPC_URL,
    bsc: import.meta.env.VITE_BSC_RPC_URL,
    base: import.meta.env.VITE_BASE_RPC_URL,
    arbitrum: import.meta.env.VITE_ARBITRUM_RPC_URL,
    avalanche: import.meta.env.VITE_AVALANCHE_RPC_URL,
    polygon: import.meta.env.VITE_POLYGON_RPC_URL,
    optimism: import.meta.env.VITE_OPTIMISM_RPC_URL,
    gnosis: import.meta.env.VITE_GNOSIS_RPC_URL,
    blast: import.meta.env.VITE_BLAST_RPC_URL,
    scroll: import.meta.env.VITE_SCROLL_RPC_URL
  }
}

// Wallet metadata for WalletConnect
export const getWalletMetadata = () => ({
  name: env.wallet.appName,
  description: 'createDAO - Create and manage DAOs',
  url: window.location.origin,
  icons: ['https://avatars.githubusercontent.com/u/37784886']
})
