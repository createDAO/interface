import { DAOVersion } from '../types/dao';

export const DAO_VERSIONS: DAOVersion[] = [
  {
    id: 'v1',
    name: 'Standard DAO v1',
    description: 'Basic DAO with governance token, treasury, and voting',
    isAvailable: true
  },
  {
    id: 'v2',
    name: 'Enhanced DAO v2',
    description: 'Advanced DAO with staking, delegation, and timelocks',
    isAvailable: true
  },
  {
    id: 'v3',
    name: 'Enterprise DAO v3',
    description: 'Enterprise-grade DAO with advanced security features',
    isAvailable: false
  }
];

interface FactoryAddressConfig {
  isAvailable: boolean;
  address?: string;
  comingSoon?: string;
}

// Map of chainId to factory address
const FACTORY_ADDRESSES: Record<number, FactoryAddressConfig> = {
  1: {
    isAvailable: false,
    comingSoon: 'Coming Soon'
  },
  11155111: {
    isAvailable: true,
    address: '0x1234567890123456789012345678901234567890'
  },
  56: {
    isAvailable: false,
    comingSoon: 'Coming Soon'
  },
  137: {
    isAvailable: false,
    comingSoon: 'Coming Soon'
  },
  42161: {
    isAvailable: false,
    comingSoon: 'Coming Soon'
  },
  10: {
    isAvailable: false,
    comingSoon: 'Coming Soon'
  },
  8453: {
    isAvailable: false,
    comingSoon: 'Coming Soon'
  },
  43114: {
    isAvailable: false,
    comingSoon: 'Coming Soon'
  }
};

export function getFactoryAddress(chainId: number): FactoryAddressConfig {
  return FACTORY_ADDRESSES[chainId] || { isAvailable: false, comingSoon: 'Not Supported' };
}

export function getCurrentVersion(): DAOVersion {
  return DAO_VERSIONS.find(v => v.isAvailable) || DAO_VERSIONS[0];
}

export const DEFAULT_DAO_VERSION = 'v2';
