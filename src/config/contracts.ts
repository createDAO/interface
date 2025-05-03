import { getFactoryAddress } from './dao';

// Contract ABIs
const DAO_FACTORY_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "versionId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "tokenName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "tokenSymbol",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "initialSupply",
        "type": "uint256"
      }
    ],
    "name": "createDAO",
    "outputs": [
      {
        "internalType": "address",
        "name": "daoAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "treasuryAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "stakingAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "daoAddress",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "treasuryAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "stakingAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "versionId",
        "type": "string"
      }
    ],
    "name": "DAOCreated",
    "type": "event"
  }
];

// Contract ABIs by name
const CONTRACT_ABIS = {
  daoFactory: DAO_FACTORY_ABI
};

// Get contract ABI by name
export function getContractABI(contractName: keyof typeof CONTRACT_ABIS) {
  return CONTRACT_ABIS[contractName];
}

// Get contract addresses for a specific chain
export function getContractAddresses(chainId: number) {
  const factoryConfig = getFactoryAddress(chainId);
  
  if (!factoryConfig.isAvailable || !factoryConfig.address) {
    return null;
  }
  
  return {
    daoFactory: factoryConfig.address
  };
}
