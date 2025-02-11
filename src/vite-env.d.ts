/// <reference types="vite/client" />

declare module '*.module.css' {
  const classes: { [key: string]: string }
  export default classes
}

declare module '*.svg' {
  const content: string
  export default content
}

interface ImportMetaEnv {
  readonly VITE_DAO_FACTORY_ADDRESS: string
  readonly VITE_DEFAULT_CHAIN_ID: string
  readonly VITE_WALLET_CONNECT_PROJECT_ID: string
  readonly VITE_APP_NAME: string
  readonly VITE_DAO_VERSION: string
  readonly VITE_ETHEREUM_RPC_URL: string
  readonly VITE_SEPOLIA_RPC_URL: string
  readonly VITE_BSC_RPC_URL: string
  readonly VITE_BASE_RPC_URL: string
  readonly VITE_ARBITRUM_RPC_URL: string
  readonly VITE_AVALANCHE_RPC_URL: string
  readonly VITE_POLYGON_RPC_URL: string
  readonly VITE_OPTIMISM_RPC_URL: string
  readonly VITE_GNOSIS_RPC_URL: string
  readonly VITE_BLAST_RPC_URL: string
  readonly VITE_SCROLL_RPC_URL: string
  readonly VITE_MAINNET_RPC_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
