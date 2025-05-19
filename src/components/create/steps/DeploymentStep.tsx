import React from 'react';
import { useTranslation } from 'next-i18next';
import { DAOFormData } from '../../../types/dao';

interface DeploymentData {
  transactionHash: string;
  daoAddress: string;
  tokenAddress: string;
}

interface DeploymentStepProps {
  formData: DAOFormData;
  deploymentData: DeploymentData | null;
  isSuccess: boolean;
}

const DeploymentStep: React.FC<DeploymentStepProps> = ({
  formData,
  deploymentData,
  isSuccess
}) => {
  const { t } = useTranslation('create');

  if (!deploymentData || !isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full mb-4"></div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('steps.deployment.processingDeployment')}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-center">
          {t('steps.deployment.waitingForDeployment')}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6 mb-6 shadow-md">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0 bg-green-100 dark:bg-green-800 rounded-full p-3">
            <svg className="h-8 w-8 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-xl font-bold text-green-800 dark:text-green-300">{t('steps.deployment.daoCreatedSuccessfully')}</h3>
            <p className="text-green-700 dark:text-green-400">
              {t('steps.deployment.daoIsLive', { daoName: formData.daoName })}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-primary-100 dark:bg-primary-900 rounded-full p-2 mr-3">
              <svg className="h-5 w-5 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-gray-700 dark:text-gray-300">
              {t('steps.deployment.daoFullyFunctional')}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
            {t('steps.deployment.contractAddresses')}
          </h3>

          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                <div className="w-3 h-3 bg-indigo-500 bg-opacity-20 border border-indigo-500 rounded-full mr-2"></div>
                {t('steps.deployment.daoCoreContract')}
              </h4>
              <div className="flex items-center">
                <p className="text-sm font-mono text-gray-900 dark:text-white break-all">
                  {deploymentData.daoAddress}
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(deploymentData.daoAddress);
                  }}
                  className="ml-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  title="Copy to clipboard"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                <div className="w-3 h-3 bg-green-500 bg-opacity-20 border border-green-500 rounded-full mr-2"></div>
                {t('steps.deployment.tokenContract')}
              </h4>
              <div className="flex items-center">
                <p className="text-sm font-mono text-gray-900 dark:text-white break-all">
                  {deploymentData.tokenAddress}
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(deploymentData.tokenAddress);
                  }}
                  className="ml-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  title="Copy to clipboard"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-md">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h8V3a1 1 0 112 0v1h1a2 2 0 012 2v10a2 2 0 01-2 2H3a2 2 0 01-2-2V6a2 2 0 012-2h1V3a1 1 0 011-1zm11 14a1 1 0 001-1V6a1 1 0 00-1-1H4a1 1 0 00-1 1v9a1 1 0 001 1h12z" clipRule="evenodd" />
            </svg>
            {t('steps.deployment.transactionDetails')}
          </h3>

          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">{t('steps.deployment.transactionHash')}</h4>
              <div className="flex items-center">
                <p className="text-sm font-mono text-gray-900 dark:text-white break-all">
                  {deploymentData.transactionHash}
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(deploymentData.transactionHash);
                  }}
                  className="ml-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                  title="Copy to clipboard"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {t('steps.deployment.viewOnBlockExplorer')}
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                {t('steps.deployment.blockExplorerDescription')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-md mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
            {t('steps.deployment.nextSteps')}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-3">
                <span className="text-primary-600 dark:text-primary-400 font-bold">1</span>
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white">{t('steps.deployment.registerYourDao')}</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t('steps.deployment.registerDescription')}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-3">
                <span className="text-primary-600 dark:text-primary-400 font-bold">2</span>
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white">{t('steps.deployment.stakeYourToken')}</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t('steps.deployment.stakeDescription')}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-3">
                <span className="text-primary-600 dark:text-primary-400 font-bold">3</span>
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white">{t('steps.deployment.createProposal')}</h4>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {t('steps.deployment.proposalDescription')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeploymentStep;
