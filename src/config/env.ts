// Environment variables with defaults
export const env = {
  dao: {
    version: '1.0.0', // Default DAO version
    factoryAddress: {
      // Default factory addresses by chain ID
      1: '', // Ethereum Mainnet
      11155111: '0x1234567890123456789012345678901234567890', // Sepolia Testnet
    }
  },
  app: {
    name: 'CreateDAO',
    description: 'Create and Deploy DAOs on Multiple Blockchains',
    url: 'https://createdao.org',
  },
};
