import React, { useState, useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import { 
  VOTING_DELAY_PRESETS, 
  VOTING_PERIOD_PRESETS, 
  TIMELOCK_DELAY_PRESETS,
  CUSTOM_VALUE 
} from '../../types/dao';

interface AdvancedSettingsProps {
  votingDelay: number;
  votingPeriod: number;
  timelockDelay: number;
  onVotingDelayChange: (value: number) => void;
  onVotingPeriodChange: (value: number) => void;
  onTimelockDelayChange: (value: number) => void;
}

// Helper function to convert seconds to human-readable format
const formatSecondsToHumanReadable = (seconds: number): string => {
  if (seconds <= 0) return '';
  
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  const parts: string[] = [];
  
  if (days > 0) {
    parts.push(`${days} day${days !== 1 ? 's' : ''}`);
  }
  if (hours > 0) {
    parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
  }
  if (remainingSeconds > 0 && days === 0) {
    parts.push(`${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`);
  }
  
  return parts.length > 0 ? `= ${parts.join(' ')}` : '';
};

// Check if value is a preset value
const isPresetValue = (value: number, presets: readonly { label: string; value: number }[]): boolean => {
  return presets.some(preset => preset.value === value);
};

interface TimeSelectWithCustomProps {
  id: string;
  label: string;
  helper: string;
  value: number;
  presets: readonly { label: string; value: number }[];
  onChange: (value: number) => void;
  formatPresetLabel: (label: string) => string;
  t: (key: string) => string;
}

const TimeSelectWithCustom: React.FC<TimeSelectWithCustomProps> = ({
  id,
  label,
  helper,
  value,
  presets,
  onChange,
  formatPresetLabel,
  t,
}) => {
  const isCustom = !isPresetValue(value, presets);
  const [showCustomInput, setShowCustomInput] = useState(isCustom);
  const [customValue, setCustomValue] = useState(isCustom ? value.toString() : '');
  
  // Determine select value: if custom input is shown and has a value, show CUSTOM_VALUE; otherwise show actual value
  const selectValue = showCustomInput ? CUSTOM_VALUE : value;
  
  const humanReadableTime = useMemo(() => {
    if (showCustomInput && customValue) {
      const numValue = parseInt(customValue, 10);
      if (!isNaN(numValue) && numValue > 0) {
        return formatSecondsToHumanReadable(numValue);
      }
    }
    return '';
  }, [showCustomInput, customValue]);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = Number(e.target.value);
    
    if (selectedValue === CUSTOM_VALUE) {
      setShowCustomInput(true);
      setCustomValue(value.toString());
    } else {
      setShowCustomInput(false);
      setCustomValue('');
      onChange(selectedValue);
    }
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setCustomValue(inputValue);
    
    const numValue = parseInt(inputValue, 10);
    if (!isNaN(numValue) && numValue > 0) {
      onChange(numValue);
    }
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <select
        id={id}
        value={selectValue}
        onChange={handleSelectChange}
        className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        {presets.map((preset) => (
          <option key={preset.value} value={preset.value}>
            {formatPresetLabel(preset.label)}
          </option>
        ))}
        <option value={CUSTOM_VALUE}>{t('advanced.custom')}</option>
      </select>
      
      {showCustomInput && (
        <div className="mt-2">
          <div className="relative">
            <input
              type="number"
              min="1"
              value={customValue}
              onChange={handleCustomInputChange}
              placeholder={t('advanced.customPlaceholder')}
              className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-4 pr-20 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500 dark:text-gray-400">
              {t('advanced.seconds')}
            </span>
          </div>
          {humanReadableTime && (
            <p className="mt-1 text-xs text-primary-600 dark:text-primary-400 font-medium">
              {humanReadableTime}
            </p>
          )}
        </div>
      )}
      
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        {helper}
      </p>
    </div>
  );
};

export const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  votingDelay,
  votingPeriod,
  timelockDelay,
  onVotingDelayChange,
  onVotingPeriodChange,
  onTimelockDelayChange,
}) => {
  const { t } = useTranslation('create');
  const [isExpanded, setIsExpanded] = useState(false);

  const formatPresetLabel = (label: string) => {
    const match = label.match(/^\s*(\d+)\s+(day|days)\s*$/i);
    if (!match) return label;
    const count = Number(match[1]);
    return t('time.days', { count });
  };

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
          <span className="font-medium text-gray-700 dark:text-gray-300">{t('advanced.title')}</span>
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
            {t('advanced.description')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Voting Delay */}
            <TimeSelectWithCustom
              id="votingDelay"
              label={t('advanced.votingDelay.label')}
              helper={t('advanced.votingDelay.helper')}
              value={votingDelay}
              presets={VOTING_DELAY_PRESETS}
              onChange={onVotingDelayChange}
              formatPresetLabel={formatPresetLabel}
              t={t}
            />

            {/* Voting Period */}
            <TimeSelectWithCustom
              id="votingPeriod"
              label={t('advanced.votingPeriod.label')}
              helper={t('advanced.votingPeriod.helper')}
              value={votingPeriod}
              presets={VOTING_PERIOD_PRESETS}
              onChange={onVotingPeriodChange}
              formatPresetLabel={formatPresetLabel}
              t={t}
            />

            {/* Timelock Delay */}
            <TimeSelectWithCustom
              id="timelockDelay"
              label={t('advanced.timelockDelay.label')}
              helper={t('advanced.timelockDelay.helper')}
              value={timelockDelay}
              presets={TIMELOCK_DELAY_PRESETS}
              onChange={onTimelockDelayChange}
              formatPresetLabel={formatPresetLabel}
              t={t}
            />
          </div>

          {/* Fixed Settings Info */}
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              <strong>{t('advanced.fixedSettings.title')}:</strong> {t('advanced.fixedSettings.text')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
