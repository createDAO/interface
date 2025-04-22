export interface DAOFormData {
  daoName: string;
  tokenName: string;
  symbol: string;
  totalSupply: string;
  versionId?: string;
}

export interface DeploymentResult {
  daoAddress: string;
  tokenAddress: string;
  treasuryAddress: string;
  stakingAddress: string;
  transactionHash: string;
  name?: string;
  versionId?: string;
}

export interface DeploymentError {
  code: string;
  message: string;
  details?: string;
}

export interface NetworkInfo {
  id: number;
  name: string;
  isTestnet: boolean;
  icon?: string;
}

export interface DAOVersion {
  id: string;
  name: string;
  description: string;
  isAvailable: boolean;
}
