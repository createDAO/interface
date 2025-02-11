import { env } from './env'

export interface DAOVersion {
  id: string
  name: string
  description: string
  isAvailable: boolean
}

export interface NetworkConfig {
  factoryAddress?: `0x${string}`
  isAvailable: boolean
  comingSoon?: string
}

// Available DAO versions
export const DAO_VERSIONS: DAOVersion[] = [
  {
    id: '1.0.0',
    name: 'Version 1.0.0',
    description: 'Initial DAO version with basic governance features',
    isAvailable: true
  },
  {
    id: '1.0.1',
    name: 'Version 1.0.1 (Coming Soon)',
    description: 'Enhanced governance ',
    isAvailable: false
  }
]

// Get factory address for a specific chain
export const getFactoryAddress = (chainId: number): NetworkConfig => {
  const address = (import.meta.env[`VITE_${chainId}_DAO_FACTORY`] as string | undefined) as `0x${string}` | undefined

  // Check for networks with deployed factory
  // if (chainId === 11155111 || // Sepolia
  //     chainId === 137) { // Polygon
  if (chainId === 11155111) { 
    return {
      factoryAddress: address || env.dao.factoryAddress,
      isAvailable: true
    }
  }

  // Future networks
  const comingSoonMessages: Record<number, string> = {
    1: 'Coming to Ethereum Mainnet',
    56: 'Coming to BSC',
    8453: 'Coming to Base',
    42161: 'Coming to Arbitrum',
    43114: 'Coming to Avalanche',
    137: 'Coming to Polygon',
    10: 'Coming to Optimism',
    100: 'Coming to Gnosis',
    81457: 'Coming to Blast',
    534352: 'Coming to Scroll'
  }

  return {
    factoryAddress: address,
    isAvailable: false,
    comingSoon: comingSoonMessages[chainId] || 'Coming Soon'
  }
}

// Get current version
export const getCurrentVersion = (): DAOVersion => {
  return DAO_VERSIONS.find(v => v.id === env.dao.version) || DAO_VERSIONS[0]
}
