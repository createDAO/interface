import { Hash } from 'viem';

export interface TransactionState {
  isIdle: boolean;
  isWaitingForSignature: boolean;
  isSubmitting: boolean;
  isWaitingForConfirmation: boolean;
  isSuccess: boolean;
  isError: boolean;
  error?: TransactionError;
  hash?: Hash;
  receipt?: TransactionReceipt;
}

export interface TransactionError {
  code: number;
  name: string;
  shortMessage: string;
  details?: string;
}

export interface TransactionReceipt {
  transactionHash: Hash;
  blockHash: Hash;
  blockNumber: bigint;
  status?: 'success' | 'reverted';
  from: string;
  to?: string;
  contractAddress?: string;
  logs: Log[];
}

export interface Log {
  address: string;
  topics: string[];
  data: string;
  blockNumber: bigint;
  transactionHash: Hash;
  blockHash: Hash;
  logIndex: number;
  transactionIndex: number;
}

export type TransactionStatus = 
  | 'idle'
  | 'waitingForSignature'
  | 'submitting'
  | 'waitingForConfirmation'
  | 'success'
  | 'error';
