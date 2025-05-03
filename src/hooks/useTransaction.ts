import { useState, useCallback, useEffect, useRef } from 'react';
import { Hash } from 'viem';
import { useWaitForTransactionReceipt } from 'wagmi';
import { 
  TransactionState, 
  TransactionError, 
  TransactionReceipt,
  BalanceCheckResult,
  SimulationResult
} from '../types/transaction';

const initialState: TransactionState = {
  isIdle: true,
  isWaitingForSignature: false,
  isSubmitting: false,
  isWaitingForConfirmation: false,
  isSuccess: false,
  isError: false,
  // Pre-deployment checks
  isCheckingBalance: false,
  isBalanceChecked: false,
  isBalanceError: false,
  isSimulating: false,
  isSimulated: false,
  isSimulationError: false,
};

export function useTransaction() {
  const [state, setState] = useState<TransactionState>(initialState);
  
  // Track if we've already processed this receipt to prevent duplicate processing
  const processedReceiptHashRef = useRef<string | null>(null);

  // Watch transaction receipt
  const { data: receipt } = useWaitForTransactionReceipt({
    hash: state.hash,
    confirmations: 1, // Wait for 1 block confirmation
    pollingInterval: 4_000, // Poll every 4 seconds
    onReplaced: (replacement) => {
      const { reason, transaction } = replacement;
      if (reason === 'repriced') {
        // Transaction was sped up
        setState(state => ({
          ...state,
          hash: transaction.hash,
        }));
      } else if (reason === 'cancelled') {
        // Transaction was cancelled
        setState({
          ...initialState,
          isIdle: false,
          isError: true,
          error: {
            code: -1,
            name: 'TransactionCancelledError',
            shortMessage: 'Transaction cancelled',
            details: 'The transaction was cancelled and replaced',
          },
        });
      } else {
        // Transaction was replaced
        setState(state => ({
          ...state,
          hash: transaction.hash,
        }));
      }
    },
  });

  // Update state when receipt is available - using useEffect to prevent infinite update loops
  useEffect(() => {
    // Only process if we have a receipt, are waiting for confirmation, and haven't processed this receipt yet
    if (receipt && 
        state.isWaitingForConfirmation && 
        (!processedReceiptHashRef.current || processedReceiptHashRef.current !== receipt.transactionHash)) {
      
      // Mark this receipt as processed
      processedReceiptHashRef.current = receipt.transactionHash;
      
      // Update state based on receipt status
      setState(state => ({
        ...state,
        isWaitingForConfirmation: false,
        isSubmitting: false,
        isSuccess: receipt.status === 'success',
        isError: receipt.status === 'reverted',
        receipt: receipt as TransactionReceipt,
        error: receipt.status === 'reverted' 
          ? {
              code: 0,
              name: 'TransactionRevertedError',
              shortMessage: 'Transaction reverted',
              details: 'The transaction was reverted by the contract',
            }
          : undefined,
      }));
    }
  }, [receipt, state.isWaitingForConfirmation]);

  const reset = useCallback(() => {
    processedReceiptHashRef.current = null;
    setState(initialState);
  }, []);

  const setWaitingForSignature = useCallback(() => {
    setState({
      ...initialState,
      isIdle: false,
      isWaitingForSignature: true,
    });
  }, []);

  const setWaitingForConfirmation = useCallback((hash: Hash) => {
    setState(() => ({
      ...initialState,
      isIdle: false,
      isWaitingForSignature: false,
      isSubmitting: true, // Show submitting while waiting for confirmation
      isWaitingForConfirmation: true,
      hash,
    }));
  }, []);

  const setError = useCallback((error: TransactionError) => {
    setState({
      ...initialState,
      isIdle: false,
      isError: true,
      error,
    });
  }, []);

  // Pre-deployment check methods
  const setCheckingBalance = useCallback(() => {
    setState(state => ({
      ...state,
      isIdle: false,
      isCheckingBalance: true,
      isBalanceChecked: false,
      isBalanceError: false,
    }));
  }, []);

  const setBalanceChecked = useCallback((result: BalanceCheckResult) => {
    setState(state => ({
      ...state,
      isCheckingBalance: false,
      isBalanceChecked: true,
      isBalanceError: !result.sufficient,
      balanceCheckResult: result,
    }));
  }, []);

  const setSimulating = useCallback(() => {
    setState(state => ({
      ...state,
      isIdle: false,
      isSimulating: true,
      isSimulated: false,
      isSimulationError: false,
    }));
  }, []);

  const setSimulated = useCallback((result: SimulationResult) => {
    console.log('Setting simulation result:', result);
    setState(state => {
      const newState = {
        ...state,
        isSimulating: false,
        isSimulated: true,
        isSimulationError: !result.success,
        simulationResult: result,
      };
      console.log('New transaction state after simulation:', newState);
      return newState;
    });
  }, []);

  return {
    state,
    reset,
    setWaitingForSignature,
    setWaitingForConfirmation,
    setError,
    // Pre-deployment check methods
    setCheckingBalance,
    setBalanceChecked,
    setSimulating,
    setSimulated,
  };
}

interface BaseError {
  code?: number;
  name?: string;
  message?: string;
  details?: string;
  cause?: unknown;
}

// Helper to format common transaction errors
export function formatTransactionError(error: BaseError): TransactionError {
  console.log('Formatting transaction error:', error);
  
  // Extract error details for better logging
  const errorDetails = {
    name: error.name,
    code: error.code,
    message: error.message,
    details: error.details,
    cause: error.cause && typeof error.cause === 'object' && 'message' in error.cause ? error.cause.message : undefined
  };
  console.log('Error details:', errorDetails);
  
  // Wagmi 2 specific connector errors
  if (error.name === 'ConnectorNotConnectedError') {
    return {
      code: -1,
      name: 'ConnectorNotConnectedError',
      shortMessage: 'Wallet not connected',
      details: 'Your wallet is not connected. Please reconnect your wallet and try again.',
    };
  }
  
  // Authorization errors - common in MetaMask when permissions aren't granted
  if (error.name === 'ContractFunctionExecutionError' && 
      (error.message?.includes('not been authorized') || 
       error.message?.includes('not been authorized by the user'))) {
    return {
      code: 4100,
      name: 'WalletAuthorizationError',
      shortMessage: 'Wallet authorization required',
      details: 'Your wallet needs permission to interact with this contract. Please check your wallet and grant the necessary permissions.',
    };
  }
  
  // User rejected transaction - specific to wagmi 2
  if (error.code === 4001 || 
      error.name === 'UserRejectedRequestError' ||
      error.message?.includes('user rejected') || 
      error.message?.includes('User denied') ||
      error.message?.includes('User rejected the request')) {
    return {
      code: 4001,
      name: 'UserRejectedError',
      shortMessage: 'Transaction rejected',
      details: 'You rejected the transaction in your wallet.',
    };
  }

  // Chain disconnected
  if (error.name === 'ChainDisconnectedError' || 
      error.message?.includes('disconnected') || 
      error.message?.includes('disconnect')) {
    return {
      code: -1,
      name: 'ChainDisconnectedError',
      shortMessage: 'Chain disconnected',
      details: 'The connection to the blockchain was lost. Please check your internet connection and wallet status.',
    };
  }

  // RPC errors
  if (error.name === 'HttpRequestError' || 
      error.name === 'InternalRpcError' || 
      error.message?.includes('request failed') ||
      error.message?.includes('network error')) {
    return {
      code: error.code || -1,
      name: error.name || 'NetworkError',
      shortMessage: 'Network error',
      details: error.details || error.message || 'A network error occurred. Please check your internet connection and try again.',
    };
  }

  // Contract errors
  if (error.name === 'ContractFunctionExecutionError' || 
      error.message?.includes('execution reverted')) {
    // Try to extract a more specific error message from the contract error
    const details = error.details || error.message || 'The contract execution failed';
    
    // Look for common revert reasons in the error message
    if (error.message?.includes('insufficient funds')) {
      return {
        code: -32000,
        name: 'InsufficientFundsError',
        shortMessage: 'Insufficient funds',
        details: 'Your wallet does not have enough funds to complete this transaction.',
      };
    }
    
    if (error.message?.includes('gas required exceeds allowance')) {
      return {
        code: -32000,
        name: 'GasLimitExceededError',
        shortMessage: 'Gas limit exceeded',
        details: 'The transaction requires more gas than the current allowance. Try increasing the gas limit in your wallet settings.',
      };
    }
    
    return {
      code: error.code || -1,
      name: error.name || 'ContractError', 
      shortMessage: 'Contract error',
      details,
    };
  }
  
  // Timeout errors
  if (error.name === 'TimeoutError' || 
      error.message?.includes('timeout') || 
      error.message?.includes('timed out')) {
    return {
      code: -1,
      name: 'TimeoutError',
      shortMessage: 'Transaction timed out',
      details: 'The transaction request timed out. The network might be congested or your wallet might be unresponsive.',
    };
  }
  
  // Transaction underpriced
  if (error.message?.includes('underpriced') || 
      error.message?.includes('gas price too low')) {
    return {
      code: -32000,
      name: 'TransactionUnderpricedError',
      shortMessage: 'Transaction underpriced',
      details: 'The gas price is too low. Try increasing the gas price in your wallet settings.',
    };
  }
  
  // Nonce errors
  if (error.message?.includes('nonce') || 
      error.message?.includes('already known')) {
    return {
      code: -32000,
      name: 'NonceError',
      shortMessage: 'Transaction nonce error',
      details: 'There was an issue with the transaction nonce. Try resetting your wallet or clearing pending transactions.',
    };
  }
  
  // Wallet connection errors
  if (error.message?.includes('wallet') && error.message?.includes('connect')) {
    return {
      code: -1,
      name: 'WalletConnectionError',
      shortMessage: 'Wallet connection error',
      details: 'There was an issue connecting to your wallet. Please try reconnecting your wallet.',
    };
  }

  // Fallback for unknown errors
  return {
    code: -1,
    name: error.name || 'UnknownError',
    shortMessage: 'Transaction failed',
    details: error.message || 'An unknown error occurred. Please try again or contact support if the issue persists.',
  };
}
