import { Address } from "viem";

export const getContractAddresses = (chainId: number) => {
  const addresses: { [key: number]: { [key: string]: Address } } = {
    // 1: {
    //   daoFactory: import.meta.env.VITE_DAO_FACTORY_ADDRESS as Address,
    // },
    11155111: {
      daoFactory: import.meta.env.VITE_DAO_FACTORY_ADDRESS as Address,
    },
    // 137: {
    //   daoFactory: import.meta.env.VITE_DAO_FACTORY_ADDRESS as Address,
    // },
  };

  return addresses[chainId] || addresses[11155111]; // Default to mainnet addresses
};

// DAO Factory ABI
export const daoFactoryABI = [
  {
    inputs: [
      { name: "versionId", type: "string" },
      { name: "name", type: "string" },
      { name: "tokenName", type: "string" },
      { name: "tokenSymbol", type: "string" },
      { name: "initialSupply", type: "uint256" },
    ],
    name: "createDAO",
    outputs: [
      { name: "daoAddress", type: "address" },
      { name: "tokenAddress", type: "address" },
      { name: "treasuryAddress", type: "address" },
      { name: "stakingAddress", type: "address" }
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "daoAddress", type: "address" },
      { indexed: true, name: "tokenAddress", type: "address" },
      { indexed: true, name: "treasuryAddress", type: "address" },
      { indexed: false, name: "stakingAddress", type: "address" },
      { indexed: false, name: "name", type: "string" },
      { indexed: false, name: "versionId", type: "string" }
    ],
    name: "DAOCreated",
    type: "event",
  },
] as const;

// Helper function to get contract ABI
export const getContractABI = (contractName: "daoFactory") => {
  const abis = {
    daoFactory: daoFactoryABI,
  };
  return abis[contractName];
};
