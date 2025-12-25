import { SUPPORTED_CHAIN_IDS } from "./wagmi";

interface FactoryAddressConfig {
  isAvailable: boolean;
  address?: string;
  comingSoon?: string;
}

// Map of chainId to factory address - only supported networks
const FACTORY_ADDRESSES: Record<number, FactoryAddressConfig> = {
  // Testnets
  [SUPPORTED_CHAIN_IDS.SEPOLIA]: {
    isAvailable: true,
    address: "0xd141662F4b788F28B2a0769a6d3f243D046B571f",
  },
  [SUPPORTED_CHAIN_IDS.HARDHAT]: {
    isAvailable: true,
    address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  },
  // Mainnets
  [SUPPORTED_CHAIN_IDS.BASE]: {
    isAvailable: true,
    address: "0xd141662F4b788F28B2a0769a6d3f243D046B571f",
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
