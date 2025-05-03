import { DAOVersion } from "../types/dao";

export const DAO_VERSIONS: DAOVersion[] = [
  {
    id: "1.0.0",
    name: "v1.0.0",
    description: "Standard DAO with governance token, treasury, and staking",
    isAvailable: true,
  },
  {
    id: "1.0.1",
    name: "v1.0.1",
    description: "Upcoming DAO factory changes",
    isAvailable: false,
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
    comingSoon: "Coming Soon",
  },
  56: {
    isAvailable: false,
    comingSoon: "Coming Soon",
  },
  137: {
    isAvailable: true,
    address: "0x8d2D2fb9388B16a51263593323aBBDf80aee54e6",
  },
  42161: {
    isAvailable: true,
    address: "0x8d2D2fb9388B16a51263593323aBBDf80aee54e6",
  },
  10: {
    isAvailable: false,
    comingSoon: "Coming Soon",
  },
  8453: {
    isAvailable: true,
    address: "0x8d2D2fb9388B16a51263593323aBBDf80aee54e6",
  },
  43114: {
    isAvailable: false,
    comingSoon: "Coming Soon",
  },
  100: {
    isAvailable: true,
    address: "0x8d2D2fb9388B16a51263593323aBBDf80aee54e6",
  },
  5000: {
    isAvailable: false,
    comingSoon: "Coming Soon",
  },
  42220: {
    isAvailable: false,
    comingSoon: "Coming Soon",
  },
  81457: {
    isAvailable: false,
    comingSoon: "Coming Soon",
  },
  534352: {
    isAvailable: false,
    comingSoon: "Coming Soon",
  },
  130: {
    isAvailable: true,
    address: "0x8d2D2fb9388B16a51263593323aBBDf80aee54e6",
  },
  480: {
    isAvailable: true,
    address: "0x8d2D2fb9388B16a51263593323aBBDf80aee54e6",
  },

  // Testnets
  11155111: {
    isAvailable: true,
    address: "0xce1368c6b408b23b31d387eb0fb517d4485005e9",
  },
  31337: {
    isAvailable: true,
    address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  },
};

export function getFactoryAddress(chainId: number): FactoryAddressConfig {
  return (
    FACTORY_ADDRESSES[chainId] || {
      isAvailable: false,
      comingSoon: "Not Supported",
    }
  );
}

export function getCurrentVersion(): DAOVersion {
  return DAO_VERSIONS.find((v) => v.isAvailable) || DAO_VERSIONS[0];
}

export const DEFAULT_DAO_VERSION = "1.0.0";
