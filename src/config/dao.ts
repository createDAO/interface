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
    1: 'Coming Soon',
    56: 'Coming Soon',
    8453: 'Coming Soon',
    42161: 'Coming Soon',
    43114: 'Coming Soon',
    137: 'Coming Soon',
    10: 'Coming Soon',
    100: 'Coming Soon',
    81457: 'Coming Soon',
    534352: 'Coming Soon'
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
