import { getFactoryAddress } from './dao';

// Contract ABIs - Updated for new DAOFactory with CreateDAOParams struct
const DAO_FACTORY_ABI = [
  {
    "inputs": [
      {
        "components": [
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
            "name": "tokenSymbol",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "totalSupply",
            "type": "uint256"
          },
          {
            "internalType": "uint48",
            "name": "votingDelay",
            "type": "uint48"
          },
          {
            "internalType": "uint32",
            "name": "votingPeriod",
            "type": "uint32"
          }
        ],
        "internalType": "struct DAOFactory.CreateDAOParams",
        "name": "params",
        "type": "tuple"
      }
    ],
    "name": "createDAO",
    "outputs": [
      {
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "timelock",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "governor",
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
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "token",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "governor",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "timelock",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "daoName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "tokenName",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "tokenSymbol",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "totalSupply",
        "type": "uint256"
      }
    ],
    "name": "DAOCreated",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "getDAOCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "TIMELOCK_MIN_DELAY",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "CREATOR_ALLOCATION_PERCENT",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
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
