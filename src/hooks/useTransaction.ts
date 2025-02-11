import { useState, useCallback } from 'react'
import { Hash } from 'viem'
import { useWaitForTransactionReceipt } from 'wagmi'
import { 
  TransactionState, 
  TransactionError, 
  TransactionReceipt 
} from '../types/transaction'

const initialState: TransactionState = {
  isIdle: true,
  isWaitingForSignature: false,
  isSubmitting: false,
  isWaitingForConfirmation: false,
  isSuccess: false,
  isError: false,
}

export function useTransaction() {
  const [state, setState] = useState<TransactionState>(initialState)

  // Watch transaction receipt
  const { data: receipt } = useWaitForTransactionReceipt({
    hash: state.hash,
    confirmations: 1, // Wait for 1 block confirmation
    pollingInterval: 4_000, // Poll every 4 seconds
    onReplaced: (replacement) => {
      const { reason, transaction, replacedTransaction } = replacement
      if (reason === 'repriced') {
        console.log('Transaction was sped up:', {
          oldHash: replacedTransaction.hash,
          newHash: transaction.hash,
        })
    setState(state => ({
      ...state,
          hash: transaction.hash,
        }))
      } else if (reason === 'cancelled') {
        console.log('Transaction was cancelled:', replacedTransaction.hash)
        setState({
          ...initialState,
          isError: true,
          error: {
            code: -1,
            name: 'TransactionCancelledError',
            shortMessage: 'Transaction cancelled',
            details: 'The transaction was cancelled and replaced',
          },
        })
      } else {
        console.log('Transaction was replaced:', {
          oldHash: replacedTransaction.hash,
          newHash: transaction.hash,
        })
    setState(state => ({
      ...state,
          hash: transaction.hash,
        }))
      }
    },
  })

  // Update state when receipt is available
  if (receipt && state.isWaitingForConfirmation) {
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
    }))
  }

  const reset = useCallback(() => {
    setState(initialState)
  }, [])

  const setWaitingForSignature = useCallback(() => {
    setState({
      ...initialState,
      isIdle: false,
      isWaitingForSignature: true,
    })
  }, [])

  const setWaitingForConfirmation = useCallback((hash: Hash) => {
    setState(() => ({
      ...initialState,
      isIdle: false,
      isWaitingForSignature: false,
      isSubmitting: true, // Show submitting while waiting for confirmation
      isWaitingForConfirmation: true,
      hash,
    }))
  }, [])

  const setError = useCallback((error: TransactionError) => {
    setState({
      ...initialState,
      isIdle: false,
      isError: true,
      error,
    })
  }, [])

  return {
    state,
    reset,
    setWaitingForSignature,
    setWaitingForConfirmation,
    setError,
  }
}

// Helper to format common transaction errors
export function formatTransactionError(error: any): TransactionError {
  // User rejected transaction
  if (error.code === 4001) {
    return {
      code: error.code,
      name: 'UserRejectedError',
      shortMessage: 'Transaction rejected',
      details: 'You rejected the transaction',
    }
  }

  // Chain disconnected
  if (error.name === 'ChainDisconnectedError') {
    return {
      code: -1,
      name: error.name,
      shortMessage: 'Chain disconnected',
      details: 'The chain disconnected during the transaction',
    }
  }

  // RPC errors
  if (error.name === 'HttpRequestError' || error.name === 'InternalRpcError') {
    return {
      code: error.code || -1,
      name: error.name,
      shortMessage: 'Network error',
      details: error.details || error.message,
    }
  }

  // Contract errors
  if (error.name === 'ContractFunctionExecutionError') {
    return {
      code: error.code || -1,
      name: error.name, 
      shortMessage: 'Contract error',
      details: error.details || error.message,
    }
  }

  // Fallback for unknown errors
  return {
    code: -1,
    name: 'UnknownError',
    shortMessage: 'Transaction failed',
    details: error.message || 'An unknown error occurred',
  }
}
