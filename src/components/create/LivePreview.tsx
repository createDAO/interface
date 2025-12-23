import React from 'react';
import { DAOFormData } from '../../types/dao';

interface LivePreviewProps {
  formData: DAOFormData;
  networkName: string;
}

export const LivePreview: React.FC<LivePreviewProps> = ({ formData, networkName }) => {
  const totalSupply = Number(formData.totalSupply) || 0;
  const creatorAmount = totalSupply * 0.01; // 1%
  const treasuryAmount = totalSupply * 0.99; // 99%

  const formatVotingTime = (seconds: number): string => {
    const days = Math.floor(seconds / 86400);
    if (days === 1) return '1 day';
    return `${days} days`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 sticky top-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
        </svg>
        Live Preview
      </h3>

      {/* DAO Name Preview */}
      <div className="mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">DAO Name</p>
        <p className="text-xl font-bold text-gray-900 dark:text-white">
          {formData.daoName || 'Your DAO Name'}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          on {networkName}
        </p>
      </div>

      {/* Token Info */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Governance Token</p>
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            {formData.tokenName || 'Token Name'}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            ({formData.symbol || 'SYMBOL'})
          </span>
        </div>
        {totalSupply > 0 && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {totalSupply.toLocaleString()} total supply
          </p>
        )}
      </div>

      {/* Token Distribution */}
      {totalSupply > 0 && (
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Token Distribution</p>
          
          {/* Visual Bar */}
          <div className="h-4 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mb-3">
            <div className="h-full bg-gradient-to-r from-primary-500 to-primary-600" style={{ width: '1%' }} />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-primary-500 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-300">You (Creator)</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {creatorAmount.toLocaleString()} (1%)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-amber-500 mr-2" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Treasury</span>
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {treasuryAmount.toLocaleString()} (99%)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Governance Settings */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Governance Settings</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Voting Delay</span>
            <span className="text-gray-900 dark:text-white">{formatVotingTime(formData.votingDelay)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Voting Period</span>
            <span className="text-gray-900 dark:text-white">{formatVotingTime(formData.votingPeriod)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Quorum</span>
            <span className="text-gray-900 dark:text-white">1%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Timelock</span>
            <span className="text-gray-900 dark:text-white">1 day</span>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <p className="text-xs text-blue-700 dark:text-blue-300">
          <strong>Tip:</strong> You&apos;ll receive 1% of tokens to meet the proposal threshold. 
          The remaining 99% goes to the treasury for governance distribution.
        </p>
      </div>
    </div>
  );
};
