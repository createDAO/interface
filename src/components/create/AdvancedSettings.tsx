import React, { useState } from 'react';
import { VOTING_DELAY_PRESETS, VOTING_PERIOD_PRESETS } from '../../types/dao';

interface AdvancedSettingsProps {
  votingDelay: number;
  votingPeriod: number;
  onVotingDelayChange: (value: number) => void;
  onVotingPeriodChange: (value: number) => void;
}

export const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  votingDelay,
  votingPeriod,
  onVotingDelayChange,
  onVotingPeriodChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="font-medium text-gray-700 dark:text-gray-300">Advanced Settings</span>
        </div>
        <svg 
          className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Customize governance timing parameters. These settings affect how proposals are created and voted on.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Voting Delay */}
            <div>
              <label htmlFor="votingDelay" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Voting Delay
              </label>
              <select
                id="votingDelay"
                value={votingDelay}
                onChange={(e) => onVotingDelayChange(Number(e.target.value))}
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {VOTING_DELAY_PRESETS.map((preset) => (
                  <option key={preset.value} value={preset.value}>
                    {preset.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Time before voting starts after proposal creation
              </p>
            </div>

            {/* Voting Period */}
            <div>
              <label htmlFor="votingPeriod" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Voting Period
              </label>
              <select
                id="votingPeriod"
                value={votingPeriod}
                onChange={(e) => onVotingPeriodChange(Number(e.target.value))}
                className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {VOTING_PERIOD_PRESETS.map((preset) => (
                  <option key={preset.value} value={preset.value}>
                    {preset.label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Duration of the voting period
              </p>
            </div>
          </div>

          {/* Fixed Settings Info */}
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              <strong>Fixed settings:</strong> Quorum is 1%, Proposal Threshold is 1%, Timelock delay is 1 day. 
              These can be changed later through governance proposals.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
