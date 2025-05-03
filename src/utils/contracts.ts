import { getContractAddresses } from '../config/contracts';

/**
 * Check if the current network has deployed contracts
 * @param chainId The chain ID to check
 * @returns boolean indicating if the network has deployed contracts
 */
export const hasDeployedContracts = (chainId: number | undefined): boolean => {
  if (!chainId) return false;
  const addresses = getContractAddresses(chainId);
  return !!addresses && !!addresses.daoFactory && addresses.daoFactory !== '0x';
};
