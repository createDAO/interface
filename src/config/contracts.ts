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
        "name": "daoName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "tokenName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "totalSupply",
        "type": "uint256"
      }
    ],
    "name": "createDAO",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "daoAddress",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "tokenAddress",
        "type": "address"
      },
      {
        "indexed": false,
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
