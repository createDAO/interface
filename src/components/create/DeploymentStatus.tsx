import React from 'react';

interface DeploymentStatusProps {
  isWaitingForSignature: boolean;
  isWaitingForConfirmation: boolean;
  isError: boolean;
  error?: {
    shortMessage?: string;
    details?: string;
  } | null;
  onRetry?: () => void;
}

export const DeploymentStatus: React.FC<DeploymentStatusProps> = ({
  isWaitingForSignature,
  isWaitingForConfirmation,
  isError,
  error,
  onRetry,
}) => {
  if (isWaitingForSignature) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <div className="flex items-center">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mr-4" />
          <div>
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">
              Waiting for Signature
            </h3>
            <p className="text-blue-700 dark:text-blue-400 text-sm mt-1">
              Please confirm the transaction in your wallet...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isWaitingForConfirmation) {
    return (
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
        <div className="flex items-center">
          <div className="animate-spin h-8 w-8 border-4 border-amber-500 border-t-transparent rounded-full mr-4" />
          <div>
            <h3 className="text-lg font-semibold text-amber-800 dark:text-amber-300">
              Transaction Submitted
            </h3>
            <p className="text-amber-700 dark:text-amber-400 text-sm mt-1">
              Waiting for blockchain confirmation. This may take a moment...
            </p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-amber-200 dark:border-amber-700">
          <p className="text-xs text-amber-600 dark:text-amber-400">
            Please don&apos;t close this window. The transaction is being processed on the blockchain.
          </p>
        </div>
      </div>
    );
  }

  if (isError && error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">
              {error.shortMessage || 'Transaction Failed'}
            </h3>
            {error.details && (
              <p className="text-red-700 dark:text-red-400 text-sm mt-1">
                {error.details}
              </p>
            )}
            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return null;
};
