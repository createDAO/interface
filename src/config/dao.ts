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
    address: "0xc852E5Cb44C50614a82050163aB7170cB88EB5F9",
  },
  [SUPPORTED_CHAIN_IDS.HARDHAT]: {
    isAvailable: true,
    address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  },
  // Mainnets
  [SUPPORTED_CHAIN_IDS.ETHEREUM]: {
    isAvailable: true,
    address: "0xc852E5Cb44C50614a82050163aB7170cB88EB5F9",
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
