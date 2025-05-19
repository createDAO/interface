import React from 'react';
import { useTranslation } from 'next-i18next';
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
    checkingBalance?: string;
    balanceError?: string;
    simulating?: string;
    simulationError?: string;
  };
  className?: string;
}

export function TransactionStatus({
  state,
  chainId,
  messages = {},
  className = ''
}: TransactionStatusProps) {
  const { t } = useTranslation('create');
  
  const defaultMessages = {
    waitingForSignature: t('transaction.waitingForSignature'),
    submitting: t('transaction.submitting'),
    waitingForConfirmation: t('transaction.waitingForConfirmation'),
    success: t('transaction.success'),
    error: t('transaction.error'),
    checkingBalance: t('transaction.checkingBalance'),
    balanceError: t('transaction.balanceError'),
    simulating: t('transaction.simulating'),
    simulationError: t('transaction.simulationError'),
    ...messages
  };


  // Helper to determine if we should show a retry button
  const canRetry = React.useMemo(() => {
    if (!state.isError) return false;

    // Don't show retry for user rejections or insufficient funds
    if (state.error?.name === 'UserRejectedError' ||
      state.error?.name === 'InsufficientFundsError') {
      return false;
    }

    // Show retry for network errors, timeouts, and some other errors
    return ['NetworkError', 'TimeoutError', 'TransactionTimeoutError',
      'ChainDisconnectedError', 'TransactionUnderpricedError'].includes(state.error?.name || '');
  }, [state.isError, state.error?.name]);

  if (state.isIdle) return null;

  return (
    <div className={`rounded-lg p-4 my-4 ${className}`}>
      {/* Balance check status */}
      {state.isCheckingBalance && (
        <div className="flex items-center">
          <div className="animate-spin h-5 w-5 mr-3 border-2 border-primary-500 border-t-transparent rounded-full"></div>
          <p className="text-gray-700 dark:text-gray-300">{defaultMessages.checkingBalance}</p>
        </div>
      )}

      {state.isBalanceChecked && state.balanceCheckResult && !state.balanceCheckResult.sufficient && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
          <div className="flex items-center mb-2">
            <div className="bg-red-500 dark:bg-red-400 rounded-full p-1 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-red-700 dark:text-red-300 font-medium">{defaultMessages.balanceError}</p>
          </div>

          <div className="bg-red-100 dark:bg-red-900/30 rounded-md p-3 mt-2">
            <p className="text-red-600 dark:text-red-400 text-sm">
              <div dangerouslySetInnerHTML={{
                __html: t('transaction.insufficientBalanceDetails', {
                  amount: ((Number(state.balanceCheckResult.required) - Number(state.balanceCheckResult.balance)) / 1e18).toFixed(6),
                  symbol: state.balanceCheckResult.symbol
                })
              }} />
            </p>
          </div>

        </div>
      )}

      {/* Simulation status */}
      {state.isSimulating && (
        <div className="flex items-center">
          <div className="animate-spin h-5 w-5 mr-3 border-2 border-primary-500 border-t-transparent rounded-full"></div>
          <p className="text-gray-700 dark:text-gray-300">{defaultMessages.simulating}</p>
        </div>
      )}

      {state.isSimulated && state.simulationResult && !state.simulationResult.success && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
          <div className="flex items-center mb-2">
            <div className="bg-red-500 dark:bg-red-400 rounded-full p-1 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-red-700 dark:text-red-300 font-medium">{defaultMessages.simulationError}</p>
          </div>
          {state.simulationResult.error && (
            <div className="bg-red-100 dark:bg-red-900/30 rounded-md p-3 mt-2">
              <p className="text-red-600 dark:text-red-400 text-sm">
                {(() => {
                  const error = state.simulationResult.error || '';

                  // Extract only the relevant part for contract function errors
                  if (error.includes('The contract function')) {
                    // Split the error message at "Contract Call:" and take only the first part
                    const parts = error.split('Contract Call:');
                    if (parts.length > 1) {
                      // Further extract the function name and reason from the first part
                      const firstPart = parts[0];
                      const match = firstPart.match(/The contract function "([^"]+)" reverted with the following reason: (.+)/);
                      if (match) {
                        return `${match[1]}: ${match[2].trim()}`;
                      }
                      return firstPart.trim(); // Fallback to just returning the first part
                    }
                    
                    // If "Contract Call:" isn't found, try the regex approach as a fallback
                    const match = error.match(/The contract function "([^"]+)" reverted with the following reason: (.+)/);
                    if (match) {
                      return `${match[1]}: ${match[2].trim()}`;
                    }
                  }

                  // Return the original error if no pattern match
                  return error;
                })()}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Transaction signature status */}
      {state.isWaitingForSignature && (
        <div className="flex items-center">
          <div className="animate-spin h-5 w-5 mr-3 border-2 border-primary-500 border-t-transparent rounded-full"></div>
          <p className="text-gray-700 dark:text-gray-300">{defaultMessages.waitingForSignature}</p>
        </div>
      )}

      {/* Transaction submission status */}
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
              {t('transaction.viewOnExplorer')}
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
              {t('transaction.viewOnExplorer')}
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
            <div className="bg-red-100 dark:bg-red-900/30 rounded-md p-3 mt-2 mb-3">
              <p className="text-red-600 dark:text-red-400 text-sm">{state.error.details}</p>
            </div>
          )}

          {/* Specific error guidance based on error type */}
          {state.error?.name === 'TransactionTimeoutError' && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 mt-2 mb-3">
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                <strong>Tip:</strong> {t('transaction.tipTransactionProcessing')}
              </p>
            </div>
          )}

          {state.error?.name === 'InsufficientFundsError' && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 mt-2 mb-3">
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                <strong>Tip:</strong> {t('transaction.tipAddMoreFunds')}
              </p>
            </div>
          )}

          {state.error?.name === 'GasLimitExceededError' && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 mt-2 mb-3">
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                <strong>Tip:</strong> {t('transaction.tipIncreaseGasLimit')}
              </p>
            </div>
          )}

          {state.error?.name === 'TransactionUnderpricedError' && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 mt-2 mb-3">
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                <strong>Tip:</strong> {t('transaction.tipIncreaseGasPrice')}
              </p>
            </div>
          )}

          {state.error?.name === 'NonceError' && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 mt-2 mb-3">
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                <strong>Tip:</strong> {t('transaction.tipResetWallet')}
              </p>
            </div>
          )}

          {/* Wallet connection errors */}
          {state.error?.name === 'ConnectorNotConnectedError' && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 mt-2 mb-3">
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                <strong>Tip:</strong> {t('transaction.tipWalletDisconnected')}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {t('transaction.refreshPage')}
              </button>
            </div>
          )}

          {/* Authorization errors */}
          {state.error?.name === 'WalletAuthorizationError' && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 mt-2 mb-3">
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                <strong>Tip:</strong> {t('transaction.tipWalletPermission')}
              </p>
              <div className="mt-2 space-y-2">
                <p className="text-yellow-700 dark:text-yellow-300 text-sm font-medium">{t('transaction.stepsToFix')}:</p>
                <ol className="list-decimal list-inside text-yellow-700 dark:text-yellow-300 text-sm space-y-1 pl-2">
                  <li>{t('transaction.stepOpenWallet')}</li>
                  <li>{t('transaction.stepLookForPermissions')}</li>
                  <li>{t('transaction.stepGrantPermission')}</li>
                  <li>{t('transaction.stepTryAgain')}</li>
                </ol>
              </div>
            </div>
          )}

          {/* User rejected transaction */}
          {state.error?.name === 'UserRejectedError' && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3 mt-2 mb-3">
              <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                <strong>Note:</strong> {t('transaction.noteRejectedTransaction')}
              </p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 mt-3">
            {state.hash && (
              <a
                href={`${getExplorerUrl(chainId)}/tx/${state.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 dark:text-red-400 hover:underline text-sm flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {t('transaction.viewOnExplorer')}
              </a>
            )}

            {canRetry && (
              <button
                onClick={() => window.location.reload()}
                className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                {t('transaction.retryTransaction')}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
