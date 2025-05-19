import React from 'react';
import { useTranslation } from 'next-i18next';
import { DAOFormData } from '../../../types/dao';
import { InfoTooltip } from '../ui';

interface DAODetailsStepProps {
  formData: DAOFormData;
  errors: Partial<DAOFormData>;
  touchedFields: Record<keyof DAOFormData, boolean>;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  goToPreviousStep: () => void;
  goToNextStep: () => void;
  canProceedToNextStep: () => boolean;
}

const DAODetailsStep: React.FC<DAODetailsStepProps> = ({
  formData,
  errors,
  touchedFields,
  handleInputChange,
  goToPreviousStep,
  goToNextStep,
  canProceedToNextStep
}) => {
  const { t } = useTranslation('create');
  return (
    <div className="space-y-6">
      <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-primary-800 dark:text-primary-300 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          {t('steps.details.title')}
        </h3>
        <p className="text-primary-700 dark:text-primary-400 mb-4">
          {t('steps.details.description')}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
        <div>
          <label htmlFor="daoName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('steps.details.daoName.label')}
            <InfoTooltip text={t('steps.details.daoName.helper')} />
          </label>
          <div className="relative">
            <input
              id="daoName"
              name="daoName"
              type="text"
              value={formData.daoName}
              onChange={handleInputChange}
              placeholder={t('steps.details.daoName.placeholder')}
              className={`w-full bg-white dark:bg-gray-800 border ${touchedFields.daoName && errors.daoName ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-10`}
            />
            {formData.daoName && !errors.daoName && (
              <svg className="absolute right-3 top-2.5 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          {touchedFields.daoName && errors.daoName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.daoName}</p>}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {t('steps.details.daoName.helper')}
          </p>
        </div>

        <div>
          <label htmlFor="tokenName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('steps.details.tokenName.label')}
            <InfoTooltip text={t('steps.details.tokenName.helper')} />
          </label>
          <div className="relative">
            <input
              id="tokenName"
              name="tokenName"
              type="text"
              value={formData.tokenName}
              onChange={handleInputChange}
              placeholder={t('steps.details.tokenName.placeholder')}
              className={`w-full bg-white dark:bg-gray-800 border ${touchedFields.tokenName && errors.tokenName ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-10`}
            />
            {formData.tokenName && !errors.tokenName && (
              <svg className="absolute right-3 top-2.5 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          {touchedFields.tokenName && errors.tokenName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tokenName}</p>}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {t('steps.details.tokenName.helper')}
          </p>
        </div>

        <div>
          <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('steps.details.tokenSymbol.label')}
            <InfoTooltip text={t('steps.details.tokenSymbol.helper')} />
          </label>
          <div className="relative">
            <input
              id="symbol"
              name="symbol"
              type="text"
              value={formData.symbol}
              onChange={handleInputChange}
              placeholder={t('steps.details.tokenSymbol.placeholder')}
              className={`w-full bg-white dark:bg-gray-800 border ${touchedFields.symbol && errors.symbol ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-10`}
            />
            {formData.symbol && !errors.symbol && (
              <svg className="absolute right-3 top-2.5 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          {touchedFields.symbol && errors.symbol && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.symbol}</p>}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {t('steps.details.tokenSymbol.helper')}
          </p>
        </div>

        <div>
          <label htmlFor="totalSupply" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t('steps.details.tokenSupply.label')}
            <InfoTooltip text={t('steps.details.tokenSupply.helper')} />
          </label>
          <div className="relative">
            <input
              id="totalSupply"
              name="totalSupply"
              type="text"
              value={formData.totalSupply}
              onChange={handleInputChange}
              placeholder={t('steps.details.tokenSupply.placeholder')}
              className={`w-full bg-white dark:bg-gray-800 border ${touchedFields.totalSupply && errors.totalSupply ? 'border-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-700'} rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent pr-10`}
            />
            {formData.totalSupply && !errors.totalSupply && (
              <svg className="absolute right-3 top-2.5 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          {touchedFields.totalSupply && errors.totalSupply && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.totalSupply}</p>}
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {t('steps.details.tokenSupply.helper')}
          </p>
        </div>
      </div>
      
      {/* Token Distribution Visualization */}
      {formData.totalSupply && !errors.totalSupply && (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mt-6 shadow-md">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
            {t('tokenDistribution.title', 'Token Distribution')}
          </h3>
          
          <div className="flex flex-col md:flex-row items-center justify-center mb-6">
            <div className="w-64 h-64 relative mb-6 md:mb-0">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Treasury Portion (almost full circle) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="#f59e0b"
                  fillOpacity="0.2"
                  stroke="#f59e0b"
                  strokeWidth="1"
                />
                
                {/* Creator Portion (tiny slice) */}
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="#4f46e5"
                  fillOpacity="0.2"
                  stroke="#4f46e5"
                  strokeWidth="1"
                  strokeDasharray="1.256 250"
                  strokeDashoffset="0"
                  transform="rotate(-90 50 50)"
                />
              </svg>
              
              {/* Labels */}
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <p className="text-lg font-bold text-gray-900 dark:text-white">{Number(formData.totalSupply).toLocaleString()}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{t('tokenDistribution.totalSupply', 'Total Supply')}</p>
              </div>
            </div>
            
            <div className="md:ml-8 w-full md:w-auto">
              <div className="bg-white dark:bg-gray-900 p-5 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">{t('tokenDistribution.details', 'Token Distribution Details')}</h4>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="w-4 h-4 bg-indigo-500 bg-opacity-20 border border-indigo-500 rounded-full mt-1 mr-2 flex-shrink-0"></div>
                    <div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{t('tokenDistribution.creator', 'Creator (You)')}</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">1 {formData.symbol} ({t('tokenDistribution.initialToken', 'initial governance token')})</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="w-4 h-4 bg-yellow-500 bg-opacity-20 border border-yellow-500 rounded-full mt-1 mr-2 flex-shrink-0"></div>
                    <div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{t('tokenDistribution.treasury', 'Treasury')}</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{(Number(formData.totalSupply) - 1).toLocaleString()} {formData.symbol} ({t('tokenDistribution.controlledByDao', 'controlled by DAO')})</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-500 bg-opacity-20 border border-blue-500 rounded-full mr-2"></div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">{t('tokenDistribution.creator', 'Creator (You)')}</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">1 {formData.symbol}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('tokenDistribution.initialTokenForGovernance', 'Initial token for governance')}</p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-500 bg-opacity-20 border border-yellow-500 rounded-full mr-2"></div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">{t('tokenDistribution.treasury', 'Treasury')}</span>
              </div>
              <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{(Number(formData.totalSupply) - 1).toLocaleString()} {formData.symbol}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('tokenDistribution.controlledByDaoGovernance', 'Controlled by DAO governance')}</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              {t('tokenDistribution.howItWorks.title', 'How Token Distribution Works')}
            </h4>
            <p className="text-blue-700 dark:text-blue-400 text-sm">
              {t('tokenDistribution.howItWorks.description', 'After deployment, you\'ll receive 1 token to start participating in governance. The remaining tokens will be stored in the treasury and can be distributed through governance proposals approved by the community.')}
            </p>
          </div>
        </div>
      )}
      
      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={goToPreviousStep}
          className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg font-medium transition-colors duration-200 cursor-pointer"
        >
          <svg className="inline-block mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          {t('navigation.backToNetwork', 'Back to Network')}
        </button>
        
        <button
          type="button"
          onClick={goToNextStep}
          disabled={!canProceedToNextStep()}
          className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('navigation.continueToReview', 'Continue to Review')}
          <svg className="inline-block ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default DAODetailsStep;
