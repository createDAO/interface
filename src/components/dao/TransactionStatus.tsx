import React from 'react';
import { TransactionState } from '../../types/transaction';
import { getExplorerUrl } from '../../config/networks';

interface TransactionStatusProps {
  state: TransactionState;
  chainId: number;
  messages?: {
    waitingForSignature?: string;
    submitting?: string;
    waitingForConfirmation?: string;
    success?: string;
    error?: string;
  };
  className?: string;
}

export function TransactionStatus({ 
  state, 
  chainId,
  messages = {},
  className = ''
}: TransactionStatusProps) {
  const defaultMessages = {
    waitingForSignature: 'Please sign the transaction...',
    submitting: 'Submitting transaction...',
    waitingForConfirmation: 'Waiting for confirmation...',
    success: 'Transaction successful!',
    error: 'Transaction failed',
    ...messages
  };

  if (state.isIdle) return null;

  return (
    <div className={`rounded-lg p-4 my-4 ${className}`}>
      {state.isWaitingForSignature && (
        <div className="flex items-center">
          <div className="animate-spin h-5 w-5 mr-3 border-2 border-primary-500 border-t-transparent rounded-full"></div>
          <p className="text-gray-700 dark:text-gray-300">{defaultMessages.waitingForSignature}</p>
        </div>
      )}

      {state.isSubmitting && !state.isWaitingForConfirmation && (
        <div className="flex items-center">
          <div className="animate-spin h-5 w-5 mr-3 border-2 border-primary-500 border-t-transparent rounded-full"></div>
          <p className="text-gray-700 dark:text-gray-300">{defaultMessages.submitting}</p>
        </div>
      )}

      {state.isWaitingForConfirmation && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <div className="animate-spin h-5 w-5 mr-3 border-2 border-blue-500 border-t-transparent rounded-full"></div>
            <p className="text-blue-700 dark:text-blue-300 font-medium">{defaultMessages.waitingForConfirmation}</p>
          </div>
          {state.hash && (
            <a 
              href={`${getExplorerUrl(chainId)}/tx/${state.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center mt-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View on Explorer
            </a>
          )}
        </div>
      )}

      {state.isSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <div className="bg-green-500 dark:bg-green-400 rounded-full p-1 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-green-700 dark:text-green-300 font-medium">{defaultMessages.success}</p>
          </div>
          {state.hash && (
            <a 
              href={`${getExplorerUrl(chainId)}/tx/${state.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 dark:text-green-400 hover:underline text-sm flex items-center mt-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View on Explorer
            </a>
          )}
        </div>
      )}

      {state.isError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <div className="bg-red-500 dark:bg-red-400 rounded-full p-1 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-red-700 dark:text-red-300 font-medium">{state.error?.shortMessage || defaultMessages.error}</p>
          </div>
          {state.error?.details && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-2 ml-8">{state.error.details}</p>
          )}
          {state.hash && (
            <a 
              href={`${getExplorerUrl(chainId)}/tx/${state.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-600 dark:text-red-400 hover:underline text-sm flex items-center mt-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View on Explorer
            </a>
          )}
        </div>
      )}
    </div>
  );
}
