export interface DAOFormData {
  daoName: string;
  tokenName: string;
  symbol: string;
  totalSupply: string;
  votingDelay: number; // in seconds
  votingPeriod: number; // in seconds
}

export interface DeploymentResult {
  governorAddress: string;
  tokenAddress: string;
  timelockAddress: string;
  transactionHash: string;
  daoName?: string;
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
  icon?: string | import('next/image').StaticImageData;
  isAvailable?: boolean;
  nativeCurrency?: {
    name: string;
    symbol: string;
    decimals: number;
  };
}

// Voting time presets in seconds
export const VOTING_DELAY_PRESETS = [
  { label: '1 day', value: 86400 },
  { label: '2 days', value: 172800 },
  { label: '3 days', value: 259200 },
] as const;

export const VOTING_PERIOD_PRESETS = [
  { label: '3 days', value: 259200 },
  { label: '5 days', value: 432000 },
  { label: '7 days', value: 604800 },
  { label: '14 days', value: 1209600 },
] as const;

// Default values
export const DEFAULT_VOTING_DELAY = 86400; // 1 day
export const DEFAULT_VOTING_PERIOD = 604800; // 7 days
