import React from 'react';
import { useChainId, useWriteContract, useAccount } from 'wagmi';
import { parseEther, decodeEventLog, type Hex } from 'viem';
import { env } from '../config/env';
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

  // Type assertion since we know the event structure
  const args = decodedEvent.args as unknown as {
    daoAddress: string;
    tokenAddress: string;
    treasuryAddress: string;
    stakingAddress: string;
    name: string;
    versionId: string;
  };

  return {
    daoAddress: args.daoAddress,
    tokenAddress: args.tokenAddress,
    treasuryAddress: args.treasuryAddress,
    stakingAddress: args.stakingAddress,
    name: args.name,
    versionId: args.versionId,
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
    status // Track status for better error detection
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
    // If connection state changed from connected to disconnected while not already in an error state
    if (prevIsConnectedRef.current && !isConnected && !transaction.state.isError) {
      console.warn('Wallet disconnected during transaction flow');
      transaction.setError({
        code: -1, // Use a specific code or name to identify this error
        name: 'ConnectorNotConnectedError',
        shortMessage: 'Wallet disconnected',
        details: 'Your wallet was disconnected. Please reconnect your wallet and try again.'
      });
    } 
    // If connection state changed from disconnected to connected AND the specific disconnect error is present
    else if (!prevIsConnectedRef.current && isConnected && transaction.state.isError && transaction.state.error?.name === 'ConnectorNotConnectedError') {
      console.log('Wallet reconnected, clearing disconnect error.');
      transaction.reset(); // Reset the transaction state to clear the error
    }
    
    prevIsConnectedRef.current = isConnected;
  }, [isConnected, transaction]); // Keep dependencies as is

  // Single effect to handle all state transitions
  React.useEffect(() => {
    // Handle hash changes (transaction submitted)
    if (hash && hash !== prevHashRef.current && !transaction.state.isWaitingForConfirmation) {
      console.log('Transaction submitted with hash:', hash);
      prevHashRef.current = hash;
      transaction.setWaitingForConfirmation(hash);
      
      // Set a timeout to detect stuck transactions
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        // Only trigger timeout if we're still waiting for confirmation
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
        // If we were waiting for signature but isPending is now false and we don't have a hash,
        // it likely means the user rejected the transaction or there was another pre-submission error
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
        
        // Clear timeout if we have an error
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
      
      // If status is error but isError flag wasn't set, handle it
      if (status === 'error' && !transaction.state.isError && error) {
        console.error('Transaction error detected from status:', error);
        transaction.setError(formatTransactionError(error as BaseError));
        
        // Clear timeout if we have an error
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
      }
    }
    
    // Cleanup timeout on unmount or when transaction completes
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [hash, isPending, isError, error, status, transaction]);

  // Enhanced error handler for contract errors
  const handleContractError = (error: Error | unknown): TransactionError => {
    // Check for wallet connection errors first
    if (!isConnected) {
      return {
        code: -1,
        name: 'ConnectorNotConnectedError',
        shortMessage: 'Wallet not connected',
        details: 'Your wallet is not connected. Please connect your wallet and try again.'
      };
    }
    
    // Type guard to check if error is an Error object
    const isErrorWithMessage = (err: unknown): err is { message: string } => 
      typeof err === 'object' && err !== null && 'message' in err;
    
    const isErrorWithName = (err: unknown): err is { name: string } => 
      typeof err === 'object' && err !== null && 'name' in err;
    
    // Check for authorization errors - common in MetaMask
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
    
    // Check for specific error types that might not be caught by the standard handler
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
    
    // For other errors, use the standard formatter
    return formatTransactionError(error as BaseError);
  };

  const deploy = async (formData: DAOFormData): Promise<DeploymentResult> => {
    // Check if wallet is connected first
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
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // Convert total supply to wei
      const totalSupplyWei = parseEther(formData.totalSupply);
      
      console.log('Deploying DAO with params:', {
        version: formData.versionId || env.dao.version,
        daoName: formData.daoName,
        tokenName: formData.tokenName,
        symbol: formData.symbol,
        totalSupply: formData.totalSupply,
        totalSupplyWei: totalSupplyWei.toString()
      });

      // Call the contract
      writeContract({
        address: addresses.daoFactory as `0x${string}`,
        abi: getContractABI('daoFactory'),
        functionName: 'createDAO',
        args: [
          formData.versionId || env.dao.version,
          formData.daoName,
          formData.tokenName,
          formData.symbol,
          totalSupplyWei
        ],
      });

      return {
        transactionHash: hash || '0x',
      } as DeploymentResult;
    } catch (error) {
      console.error('Error deploying DAO:', error);
      
      // Use enhanced error handler
      const formattedError = handleContractError(error);
      transaction.setError(formattedError);
      
      // Re-throw for component error handling
      throw error;
    }
  };

  // Parse deployment data from receipt - memoize to prevent unnecessary recalculations
  const deploymentData = React.useMemo(() => {
    return transaction.state.receipt ? parseReceipt(transaction.state.receipt) : null;
  }, [transaction.state.receipt]);

  // Pre-deployment check methods
  const checkBalance = async (): Promise<void> => {
    try {
      transaction.setCheckingBalance();
      // The actual balance check is handled in the PreDeploymentStep component
      // This is just to trigger the state change
    } catch (error) {
      console.error('Error checking balance:', error);
      transaction.setError(formatTransactionError(error as BaseError));
    }
  };

  const simulateTransaction = async (): Promise<void> => {
    try {
      transaction.setSimulating();
      // The actual simulation is handled in the PreDeploymentStep component
      // This is just to trigger the state change
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
    // Expose functions to update check status
    setBalanceChecked: transaction.setBalanceChecked,
    setSimulated: transaction.setSimulated,
    // Expose reset function to clear transaction state
    reset: transaction.reset,
  };
}
