import React from 'react';
import { useChainId, useWriteContract, useAccount } from 'wagmi';
import { parseEther, decodeEventLog, type Hex } from 'viem';
import { getContractAddresses, getContractABI } from '../config/contracts';
import { DAOFormData, DeploymentResult } from '../types/dao';
import { useTransaction, formatTransactionError } from './useTransaction';
import type { TransactionReceipt, TransactionError } from '../types/transaction';
import type { BaseError } from 'viem';

// Configuration for transaction monitoring
const TRANSACTION_TIMEOUT_MS = 180000; // 3 minutes

// Helper to parse receipt for deployed addresses
function parseReceipt(receipt: TransactionReceipt | undefined): DeploymentResult | null {
  if (!receipt) return null;

  // Find the DAOCreated event
  const event = receipt.logs.find((log) => {
    try {
      const decodedLog = decodeEventLog({
        abi: getContractABI('daoFactory'),
        data: log.data as Hex,
        topics: log.topics as [Hex, ...Hex[]],
      });
      return decodedLog.eventName === 'DAOCreated';
    } catch {
      return false;
    }
  });

  if (!event) return null;

  // Decode the event data
  const decodedEvent = decodeEventLog({
    abi: getContractABI('daoFactory'),
    data: event.data as Hex,
    topics: event.topics as [Hex, ...Hex[]],
  });

  // Type assertion for the new event structure
  // Indexed: creator, token, governor
  // Non-indexed: timelock, daoName, tokenName, tokenSymbol, totalSupply
  const args = decodedEvent.args as unknown as {
    creator: string;
    token: string;
    governor: string;
    timelock: string;
    daoName: string;
    tokenName: string;
    tokenSymbol: string;
    totalSupply: bigint;
  };

  return {
    governorAddress: args.governor,
    tokenAddress: args.token,
    timelockAddress: args.timelock,
    daoName: args.daoName,
    transactionHash: receipt.transactionHash,
  };
}

export function useDaoDeployment() {
  const chainId = useChainId();
  const { isConnected } = useAccount();
  const addresses = chainId ? getContractAddresses(chainId) : null;
  const { 
    data: hash, 
    writeContract, 
    isPending, 
    isError, 
    error,
    status
  } = useWriteContract();
  const transaction = useTransaction();
  
  // Track previous values to prevent unnecessary updates
  const prevHashRef = React.useRef<string | null>(null);
  const prevIsPendingRef = React.useRef<boolean>(false);
  const prevIsErrorRef = React.useRef<boolean>(false);
  const prevStatusRef = React.useRef<string | null>(null);
  const prevIsConnectedRef = React.useRef<boolean>(false);
  
  // Timeout reference for detecting stuck transactions
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  
  // Track connection state changes
  React.useEffect(() => {
    if (prevIsConnectedRef.current && !isConnected && !transaction.state.isError) {
      console.warn('Wallet disconnected during transaction flow');
      transaction.setError({
        code: -1,
        name: 'ConnectorNotConnectedError',
        shortMessage: 'Wallet disconnected',
        details: 'Your wallet was disconnected. Please reconnect your wallet and try again.'
      });
    } 
    else if (!prevIsConnectedRef.current && isConnected && transaction.state.isError && transaction.state.error?.name === 'ConnectorNotConnectedError') {
      console.log('Wallet reconnected, clearing disconnect error.');
      transaction.reset();
    }
    
    prevIsConnectedRef.current = isConnected;
  }, [isConnected, transaction]);

  // Single effect to handle all state transitions
  React.useEffect(() => {
    // Handle hash changes (transaction submitted)
    if (hash && hash !== prevHashRef.current && !transaction.state.isWaitingForConfirmation) {
      console.log('Transaction submitted with hash:', hash);
      prevHashRef.current = hash;
      transaction.setWaitingForConfirmation(hash);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        if (transaction.state.isWaitingForConfirmation) {
          console.warn('Transaction confirmation timeout:', hash);
          transaction.setError({
            code: -1,
            name: 'TransactionTimeoutError',
            shortMessage: 'Transaction confirmation timeout',
            details: 'The transaction was submitted but confirmation timed out. Check the explorer for status.'
          });
        }
      }, TRANSACTION_TIMEOUT_MS);
    }
    
    // Handle pending state (waiting for signature)
    if (isPending !== prevIsPendingRef.current) {
      prevIsPendingRef.current = isPending;
      if (isPending && !transaction.state.isWaitingForSignature) {
        console.log('Waiting for signature...');
        transaction.setWaitingForSignature();
      } else if (!isPending && transaction.state.isWaitingForSignature && !hash) {
        if (!transaction.state.isError && error) {
          console.warn('Transaction signature failed without explicit error flag');
          transaction.setError(formatTransactionError(error as BaseError));
        } else if (!transaction.state.isError && !error) {
          console.warn('Transaction signature failed without error object');
          transaction.setError({
            code: 4001,
            name: 'UserRejectedError',
            shortMessage: 'Transaction rejected',
            details: 'The transaction was rejected or failed during signature.'
          });
        }
      }
    }
    
    // Handle error state
    if (isError !== prevIsErrorRef.current) {
      prevIsErrorRef.current = isError;
      if (isError && error && !transaction.state.isError) {
        console.error('Transaction error:', error);
        transaction.setError(formatTransactionError(error as BaseError));
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    }
    
    // Additional check for status changes
    if (status && status !== prevStatusRef.current) {
      prevStatusRef.current = status;
      console.log('Transaction status changed:', status);
      
      if (status === 'error' && !transaction.state.isError && error) {
        console.error('Transaction error detected from status:', error);
        transaction.setError(formatTransactionError(error as BaseError));
        
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [hash, isPending, isError, error, status, transaction]);

  // Enhanced error handler for contract errors
  const handleContractError = (error: Error | unknown): TransactionError => {
    if (!isConnected) {
      return {
        code: -1,
        name: 'ConnectorNotConnectedError',
        shortMessage: 'Wallet not connected',
        details: 'Your wallet is not connected. Please connect your wallet and try again.'
      };
    }
    
    const isErrorWithMessage = (err: unknown): err is { message: string } => 
      typeof err === 'object' && err !== null && 'message' in err;
    
    const isErrorWithName = (err: unknown): err is { name: string } => 
      typeof err === 'object' && err !== null && 'name' in err;
    
    if (isErrorWithName(error) && 
        error.name === 'ContractFunctionExecutionError' && 
        isErrorWithMessage(error) && 
        (error.message?.includes('not been authorized') || 
         error.message?.includes('not been authorized by the user'))) {
      return {
        code: 4100,
        name: 'WalletAuthorizationError',
        shortMessage: 'Wallet authorization required',
        details: 'Your wallet needs permission to interact with this contract. Please check your wallet and grant the necessary permissions.'
      };
    }
    
    if (isErrorWithMessage(error) && 
        (error.message?.includes('timeout') || error.message?.includes('timed out'))) {
      return {
        code: -1,
        name: 'TransactionTimeoutError',
        shortMessage: 'Transaction timed out',
        details: 'The transaction request timed out. The network might be congested.'
      };
    }
    
    if (isErrorWithMessage(error) && 
        (error.message?.includes('user rejected') || 
         error.message?.includes('rejected transaction') ||
         error.message?.includes('User rejected the request') ||
         error.message?.includes('User denied transaction'))) {
      return {
        code: 4001,
        name: 'UserRejectedError',
        shortMessage: 'Transaction rejected',
        details: 'You rejected the transaction in your wallet.'
      };
    }
    
    if (isErrorWithMessage(error) && 
        (error.message?.includes('insufficient funds') || error.message?.includes('not enough funds'))) {
      return {
        code: -32000,
        name: 'InsufficientFundsError',
        shortMessage: 'Insufficient funds',
        details: 'Your wallet does not have enough funds to complete this transaction.'
      };
    }
    
    return formatTransactionError(error as BaseError);
  };

  const deploy = async (formData: DAOFormData): Promise<DeploymentResult> => {
    if (!isConnected) {
      const error = {
        code: -1,
        name: 'ConnectorNotConnectedError',
        shortMessage: 'Wallet not connected',
        details: 'Your wallet is not connected. Please connect your wallet and try again.'
      };
      transaction.setError(error);
      throw new Error('Wallet not connected');
    }
    
    if (!addresses) {
      throw new Error('No contract addresses found for current network');
    }

    if (!addresses.daoFactory || addresses.daoFactory === '0x') {
      throw new Error('DAO Factory contract address is not configured');
    }

    try {
      // Reset state and refs
      transaction.reset();
      prevHashRef.current = null;
      prevIsPendingRef.current = false;
      prevIsErrorRef.current = false;
      prevStatusRef.current = null;
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // Convert total supply to wei
      const totalSupplyWei = parseEther(formData.totalSupply);
      
      console.log('Deploying DAO with params:', {
        daoName: formData.daoName,
        tokenName: formData.tokenName,
        tokenSymbol: formData.symbol,
        totalSupply: formData.totalSupply,
        totalSupplyWei: totalSupplyWei.toString(),
        votingDelay: formData.votingDelay,
        votingPeriod: formData.votingPeriod
      });

      // Call the contract with CreateDAOParams struct
      writeContract({
        address: addresses.daoFactory as `0x${string}`,
        abi: getContractABI('daoFactory'),
        functionName: 'createDAO',
        args: [{
          daoName: formData.daoName,
          tokenName: formData.tokenName,
          tokenSymbol: formData.symbol,
          totalSupply: totalSupplyWei,
          votingDelay: formData.votingDelay,
          votingPeriod: formData.votingPeriod
        }],
      });

      return {
        transactionHash: hash || '0x',
      } as DeploymentResult;
    } catch (error) {
      console.error('Error deploying DAO:', error);
      const formattedError = handleContractError(error);
      transaction.setError(formattedError);
      throw error;
    }
  };

  // Parse deployment data from receipt
  const deploymentData = React.useMemo(() => {
    return transaction.state.receipt ? parseReceipt(transaction.state.receipt) : null;
  }, [transaction.state.receipt]);

  // Pre-deployment check methods
  const checkBalance = async (): Promise<void> => {
    try {
      transaction.setCheckingBalance();
    } catch (error) {
      console.error('Error checking balance:', error);
      transaction.setError(formatTransactionError(error as BaseError));
    }
  };

  const simulateTransaction = async (): Promise<void> => {
    try {
      transaction.setSimulating();
    } catch (error) {
      console.error('Error simulating transaction:', error);
      transaction.setError(formatTransactionError(error as BaseError));
    }
  };

  return {
    deploy,
    checkBalance,
    simulateTransaction,
    state: transaction.state,
    deploymentData,
    setBalanceChecked: transaction.setBalanceChecked,
    setSimulated: transaction.setSimulated,
    reset: transaction.reset,
  };
}
