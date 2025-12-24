import React from 'react';
import { useTranslation } from 'next-i18next';
import { DeploymentResult, DAOFormData } from '../../types/dao';

interface SuccessPanelProps {
  deploymentData: DeploymentResult;
  formData: DAOFormData;
  onCreateAnother: () => void;
}

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const { t } = useTranslation('create');
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      title={t('success.copyToClipboard')}
    >
      {copied ? (
        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
};

const AddressRow: React.FC<{ label: string; address: string; colorClass: string }> = ({ 
  label, 
  address, 
  colorClass 
}) => (
  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
    <div className="flex items-center mb-2">
      <div className={`w-3 h-3 ${colorClass} rounded-full mr-2`} />
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
    </div>
    <div className="flex items-center">
      <code className="text-xs text-gray-900 dark:text-white break-all flex-1 font-mono">
        {address}
      </code>
      <CopyButton text={address} />
    </div>
  </div>
);

export const SuccessPanel: React.FC<SuccessPanelProps> = ({
  deploymentData,
  formData,
  onCreateAnother,
}) => {
  const { t } = useTranslation('create');

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-green-100 dark:bg-green-800 rounded-full p-3">
            <svg className="h-8 w-8 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="ml-4">
            <h2 className="text-2xl font-bold text-green-800 dark:text-green-300">
              🎉 {t('success.title')}
            </h2>
            <p className="mt-1 text-green-700 dark:text-green-400">
              <strong>{formData.daoName}</strong> {t('success.subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Contract Addresses */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          {t('success.contractAddresses.title')}
        </h3>

        <div className="space-y-3">
          <AddressRow 
            label={t('success.contractAddresses.governorContract')} 
            address={deploymentData.governorAddress} 
            colorClass="bg-indigo-500" 
          />
          <AddressRow 
            label={t('success.contractAddresses.tokenContract')} 
            address={deploymentData.tokenAddress} 
            colorClass="bg-green-500" 
          />
          <AddressRow 
            label={t('success.contractAddresses.timelockTreasury')} 
            address={deploymentData.timelockAddress} 
            colorClass="bg-amber-500" 
          />
        </div>

        {/* Transaction Hash */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{t('success.transactionHash.label')}</span>
          </div>
          <div className="flex items-center">
            <code className="text-xs text-gray-600 dark:text-gray-400 break-all flex-1 font-mono">
              {deploymentData.transactionHash}
            </code>
            <CopyButton text={deploymentData.transactionHash} />
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
          </svg>
          {t('success.nextSteps.title')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-3">
                <span className="text-primary-600 dark:text-primary-400 font-bold text-sm">1</span>
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white">{t('success.nextSteps.openOpenBook.title')}</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('success.nextSteps.openOpenBook.description')}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-3">
                <span className="text-primary-600 dark:text-primary-400 font-bold text-sm">2</span>
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white">{t('success.nextSteps.createFirstProposal.title')}</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('success.nextSteps.createFirstProposal.description')}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-3">
                <span className="text-primary-600 dark:text-primary-400 font-bold text-sm">3</span>
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white">{t('success.nextSteps.inviteMembers.title')}</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('success.nextSteps.inviteMembers.description')}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onCreateAnother}
          className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
        >
          {t('success.actions.createAnother')}
        </button>
        <a
          href="https://openbook.to"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white py-3 px-6 rounded-lg font-medium transition-colors text-center"
        >
          {t('success.actions.openOpenBook')}
        </a>
      </div>
    </div>
  );
};
