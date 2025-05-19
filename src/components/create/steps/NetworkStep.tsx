import React from 'react';
import { useTranslation } from 'next-i18next';
import { useChainId, useSwitchChain } from 'wagmi';
import { SUPPORTED_NETWORKS } from '../../../config/networks';
import { NetworkSelect } from '../../dao/NetworkSelect';
import { VersionSelect } from '../../dao/VersionSelect';
import { FeatureCard, InfoTooltip } from '../ui';
import Image from 'next/image';

interface NetworkStepProps {
  selectedVersion: string;
  setSelectedVersion: (version: string) => void;
  handleNetworkSwitchError: (error: Error | null) => void; // Allow null for clearing
  networkSwitchError: string | null;
  isSwitchingNetwork: boolean;
  noContractsForNetwork: boolean;
  goToNextStep: () => void;
  canProceedToNextStep: () => boolean;
}

const NetworkStep: React.FC<NetworkStepProps> = ({
  selectedVersion,
  setSelectedVersion,
  handleNetworkSwitchError,
  networkSwitchError,
  isSwitchingNetwork,
  noContractsForNetwork,
  goToNextStep,
  canProceedToNextStep
}) => {
  const { t } = useTranslation('create');
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const isWrongNetwork = chainId && !SUPPORTED_NETWORKS.find(n => n.id === chainId);


  // Clear error when user dismisses it
  const clearNetworkError = () => {
    handleNetworkSwitchError(null); // Pass null to clear the error
  };

  return (
    <div className="space-y-6">
      <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-primary-800 dark:text-primary-300 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          {t('steps.network.title')}
        </h3>
        <p className="text-primary-700 dark:text-primary-400 mb-4">
          {t('steps.network.description')}
        </p>
        <ul className="list-disc pl-5 space-y-2 text-primary-700 dark:text-primary-400">
          <li>{t('steps.networkTypes.ethereumMainnet')}</li>
          <li>{t('steps.networkTypes.layer2Networks')}</li>
          <li>{t('steps.networkTypes.alternativeL1s')}</li>
          <li>{t('steps.networkTypes.testnets')}</li>
        </ul>
      </div>

      {isWrongNetwork ? (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
            <svg className="w-6 h-6 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {t('network.wrongNetwork', 'Wrong Network')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {t('network.switchToSupported', 'Please switch to a supported network to create your DAO')}
          </p>

          {/* Network status notification - always rendered, content changes */}
          {(isSwitchingNetwork || networkSwitchError) && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
              <div className="flex">
                {isSwitchingNetwork ? (
                  <>
                    <div className="animate-spin h-5 w-5 mr-3 border-2 border-yellow-500 border-t-transparent rounded-full"></div>
                    <p className="text-yellow-700 dark:text-yellow-300">
                      {t('network.switchingNetwork', 'Switching network... Please confirm in your wallet.')}
                    </p>
                  </>
                ) : networkSwitchError ? (
                  <>
                    <p className="text-yellow-700 dark:text-yellow-300 flex-1">
                      {t('network.switchFailed', 'Failed to switch network. Please check your wallet and try again.')}
                      <span className="block text-xs mt-1 opacity-70">{networkSwitchError}</span>
                    </p>
                    <button
                      onClick={clearNetworkError}
                      className="text-yellow-700 dark:text-yellow-300 hover:text-yellow-900 dark:hover:text-yellow-100"
                      aria-label="Dismiss error"
                    >
                      ✕
                    </button>

                  </>

                ) : null}
              </div>
            </div>

          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {SUPPORTED_NETWORKS.map((network) => (
              <button
                key={network.id}
                onClick={() => {
                  switchChain?.({ chainId: network.id });
                }}
                className="flex items-center justify-center space-x-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-3 px-4 hover:border-primary-500 dark:hover:border-primary-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSwitchingNetwork}
              >
                {network.icon && (
                  <Image src={network.icon} alt={network.name} width={20} height={20} className="h-5 w-5" />
                )}
                <span>{isSwitchingNetwork ? t('network.switching', 'Switching...') : t('network.switchTo', 'Switch to {{name}}', { name: network.name })}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="network" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('steps.network.networkLabel')}
                <InfoTooltip text={t('network.tooltip', 'The blockchain network where your DAO will be deployed. Each network has different characteristics and fees.')} />
              </label>
              <NetworkSelect onSwitchError={handleNetworkSwitchError} />
            </div>
            <div>
              <label htmlFor="version" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('steps.network.versionLabel')}
                <InfoTooltip text={t('version.tooltip', 'The version of the DAO contracts to deploy. Newer versions may include additional features or improvements.')} />
              </label>
              <VersionSelect
                value={selectedVersion}
                onChange={setSelectedVersion}
              />
            </div>
          </div>

          {/* Network Features */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">{t('network.features', 'Network Features')}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FeatureCard
                title={t('features.governance.title')}
                description={t('features.governance.description')}
                icon={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                  </svg>
                }
              />

              <FeatureCard
                title={t('features.treasury.title')}
                description={t('features.treasury.description')}
                icon={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                }
              />

              <FeatureCard
                title={t('features.token.title')}
                description={t('features.token.description')}
                icon={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                  </svg>
                }
              />

              <FeatureCard
                title={t('features.multiSig.title')}
                description={t('features.multiSig.description')}
                icon={
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                  </svg>
                }
              />
            </div>
          </div>

          {/* Network status notification - always rendered, content changes */}
          {(isSwitchingNetwork || networkSwitchError || noContractsForNetwork) && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <div className="flex">
                {isSwitchingNetwork ? (
                  <>
                    <div className="animate-spin h-5 w-5 mr-3 border-2 border-yellow-500 border-t-transparent rounded-full"></div>
                    <p className="text-yellow-700 dark:text-yellow-300">
                      {t('network.switchingNetwork', 'Switching network... Please confirm in your wallet.')}
                    </p>
                  </>
                ) : networkSwitchError ? (
                  <>
                    <p className="text-yellow-700 dark:text-yellow-300 flex-1">
                      {t('network.switchFailed', 'Failed to switch network. Please check your wallet and try again.')}
                      <span className="block text-xs mt-1 opacity-70">{networkSwitchError}</span>
                    </p>
                    <button
                      onClick={clearNetworkError}
                      className="text-yellow-700 dark:text-yellow-300 hover:text-yellow-900 dark:hover:text-yellow-100"
                      aria-label="Dismiss error"
                    >
                      ✕
                    </button>
                  </>
                ) : noContractsForNetwork ? (
                  <p className="text-yellow-700 dark:text-yellow-300">
                    {t('network.notSupported', 'Your current network is not supported. Please switch to a supported network.')}
                  </p>
                ) : null}
              </div>
            </div>
          )}

          {/* Sepolia-specific notification */}
          {chainId === 11155111 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                <strong>{t('network.note', 'Note')}:</strong> {t('network.sepoliaNote', 'For fast testing, Sepolia DAOs are deployed with a 5-minute voting period.')}
              </p>
            </div>
          )}

          {/* DAO Architecture Visualization */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mt-6 shadow-md">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
              {t('architecture.title', 'Your DAO Architecture')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                  <div className="w-4 h-4 bg-indigo-500 bg-opacity-20 border border-indigo-500 rounded-full mr-2"></div>
                  {t('architecture.daoCore', 'DAO Core')}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t('architecture.daoCoreDescription', 'Central governance hub for proposals, voting, and execution of community decisions')}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                  <div className="w-4 h-4 bg-green-500 bg-opacity-20 border border-green-500 rounded-full mr-2"></div>
                  {t('architecture.daoToken', 'DAO Token')}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t('architecture.daoTokenDescription', 'ERC20 governance token with customizable tax mechanisms and distribution controls')}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                  <div className="w-4 h-4 bg-yellow-500 bg-opacity-20 border border-yellow-500 rounded-full mr-2"></div>
                  {t('architecture.treasury', 'Treasury')}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t('architecture.treasuryDescription', 'Secure vault for managing DAO assets, controlled by governance proposals')}
                </p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2 flex items-center">
                  <div className="w-4 h-4 bg-pink-500 bg-opacity-20 border border-pink-500 rounded-full mr-2"></div>
                  {t('architecture.staking', 'Staking')}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t('architecture.stakingDescription', 'Time-based staking with voting power multipliers for long-term holders')}
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-6">
              {t('architecture.upgradeableProxies', 'All contracts are deployed as upgradeable proxies with the latest implementations')}
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-end mt-8">
            <button
              type="button"
              onClick={goToNextStep}
              disabled={!canProceedToNextStep()}
              className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t('navigation.continueToDetails', 'Continue to DAO Details')}
              <svg className="inline-block ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NetworkStep;
