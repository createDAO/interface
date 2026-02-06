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
    address: "0xDcB4dB872798487b737D2dBf6bEfE5187299c3bc",
  },
  [SUPPORTED_CHAIN_IDS.HARDHAT]: {
    isAvailable: true,
    address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  },
  // Mainnets
  [SUPPORTED_CHAIN_IDS.ETHEREUM]: {
    isAvailable: true,
    address: "0x742236f55a5e43B1AAec404527cE6986E02cD700",
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
