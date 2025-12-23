import React, { useState, useCallback } from 'react';
import Head from 'next/head';
import { useChainId, useAccount } from 'wagmi';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import nextI18NextConfig from '../../next-i18next.config.js';
import Layout from '../components/layout/Layout';
import { NetworkSelect } from '../components/dao/NetworkSelect';
import {
  WalletConnectSection,
  FormInput,
  AdvancedSettings,
  LivePreview,
  DeploymentStatus,
  SuccessPanel
} from '../components/create';
import { useDaoDeployment } from '../hooks/useDaoDeployment';
import {
  DAOFormData,
  DEFAULT_VOTING_DELAY,
  DEFAULT_VOTING_PERIOD
} from '../types/dao';
import { SUPPORTED_NETWORKS } from '../config/networks';
import { hasDeployedContracts } from '../utils/contracts';

const CreateDAO: React.FC = () => {
  const { t } = useTranslation(['create']);
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { deploy, state: txState, deploymentData, reset } = useDaoDeployment();

  // Form state
  const [formData, setFormData] = useState<DAOFormData>({
    daoName: '',
    tokenName: '',
    symbol: '',
    totalSupply: '',
    votingDelay: DEFAULT_VOTING_DELAY,
    votingPeriod: DEFAULT_VOTING_PERIOD,
  });

  // Error and network state
  const [errors, setErrors] = useState<Partial<Record<keyof DAOFormData, string>>>({});
  const [networkSwitchError, setNetworkSwitchError] = useState<string | null>(null);

  // Network checks
  const currentNetwork = SUPPORTED_NETWORKS.find(n => n.id === chainId);
  const isWrongNetwork = !!chainId && !currentNetwork;
  const noContractsForNetwork = !!chainId && !hasDeployedContracts(chainId);
  const canDeploy = isConnected && !isWrongNetwork && !noContractsForNetwork;

  // Validation
  const validateField = useCallback((name: keyof DAOFormData, value: string | number): string | undefined => {
    const strValue = String(value);
    switch (name) {
      case 'daoName':
        return !strValue ? 'DAO name is required' : undefined;
      case 'tokenName':
        return !strValue ? 'Token name is required' : undefined;
      case 'symbol':
        if (!strValue) return 'Symbol is required';
        if (strValue.length > 6) return 'Symbol must be 6 characters or less';
        return undefined;
      case 'totalSupply':
        if (!strValue) return 'Total supply is required';
        if (isNaN(Number(strValue)) || Number(strValue) <= 0) return 'Must be a positive number';
        if (Number(strValue) >= 999999999999) return 'Must be less than 999,999,999,999';
        return undefined;
      default:
        return undefined;
    }
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<Record<keyof DAOFormData, string>> = {};
    const fieldsToValidate: (keyof DAOFormData)[] = ['daoName', 'tokenName', 'symbol', 'totalSupply'];

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

  // Handlers
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error on change
    if (errors[name as keyof DAOFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [errors]);

  const handleNetworkSwitchError = useCallback((error: Error | null) => {
    setNetworkSwitchError(error ? error.message : null);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !canDeploy) return;

    try {
      await deploy(formData);
    } catch (error) {
      console.error('Deployment error:', error);
    }
  };

  const handleCreateAnother = () => {
    reset();
    setFormData({
      daoName: '',
      tokenName: '',
      symbol: '',
      totalSupply: '',
      votingDelay: DEFAULT_VOTING_DELAY,
      votingPeriod: DEFAULT_VOTING_PERIOD,
    });
    setErrors({});
  };

  // Check if form is valid for button state
  const isFormValid = formData.daoName && formData.tokenName && formData.symbol &&
    formData.totalSupply && Number(formData.totalSupply) > 0 &&
    formData.symbol.length <= 6 && Object.keys(errors).filter(k => errors[k as keyof DAOFormData]).length === 0;

  const isDeploying = txState.isWaitingForSignature || txState.isWaitingForConfirmation;

  // Show success panel
  if (txState.isSuccess && deploymentData) {
    return (
      <Layout>
        <Head>
          <title>DAO Created | CreateDAO</title>
        </Head>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <SuccessPanel
            deploymentData={deploymentData}
            formData={formData}
            onCreateAnother={handleCreateAnother}
          />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>{t('page.metaTitle')}</title>
        <meta name="description" content={t('page.metaDescription')} />
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('page.heading')}</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">{t('page.subheading')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Column */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Wallet Connection */}
              <WalletConnectSection />

              {/* Step 2: Network Selection */}
              <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 transition-opacity ${!isConnected ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="flex items-center mb-4">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 text-sm font-bold ${
                    isConnected && currentNetwork && !noContractsForNetwork
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {isConnected && currentNetwork && !noContractsForNetwork ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : '2'}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t('page.selectNetworkTitle')}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('page.selectNetworkSubtitle')}
                    </p>
                  </div>
                </div>

                {(isWrongNetwork || noContractsForNetwork) && (
                  <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                    <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                      {isWrongNetwork ? t('page.wrongNetwork') : t('page.noContractsForNetwork')}
                    </p>
                  </div>
                )}

                {networkSwitchError && (
                  <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-red-700 dark:text-red-300 text-sm">{networkSwitchError}</p>
                  </div>
                )}

                <NetworkSelect onSwitchError={handleNetworkSwitchError} />

                {currentNetwork && !noContractsForNetwork && (
                  <p className="mt-2 text-sm text-green-600 dark:text-green-400 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {t('page.readyToDeployOn', { name: currentNetwork.name })}
                  </p>
                )}
              </div>

              {/* Step 3: DAO Details */}
              <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 transition-opacity ${!isConnected ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="flex items-center mb-4">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full mr-3 text-sm font-bold ${
                    isFormValid
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {isFormValid ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : '3'}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t('page.daoDetailsTitle')}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('page.daoDetailsSubtitle')}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormInput
                    id="daoName"
                    name="daoName"
                    label={t('steps.details.daoName.label')}
                    value={formData.daoName}
                    onChange={handleInputChange}
                    placeholder={t('steps.details.daoName.placeholder')}
                    error={errors.daoName}
                    helperText={t('steps.details.daoName.helper')}
                    isValid={!!formData.daoName && !errors.daoName}
                  />

                  <FormInput
                    id="tokenName"
                    name="tokenName"
                    label={t('steps.details.tokenName.label')}
                    value={formData.tokenName}
                    onChange={handleInputChange}
                    placeholder={t('steps.details.tokenName.placeholder')}
                    error={errors.tokenName}
                    helperText={t('steps.details.tokenName.helper')}
                    isValid={!!formData.tokenName && !errors.tokenName}
                  />

                  <FormInput
                    id="symbol"
                    name="symbol"
                    label={t('steps.details.tokenSymbol.label')}
                    value={formData.symbol}
                    onChange={handleInputChange}
                    placeholder={t('steps.details.tokenSymbol.placeholder')}
                    error={errors.symbol}
                    helperText={t('steps.details.tokenSymbol.helper')}
                    isValid={!!formData.symbol && formData.symbol.length <= 6 && !errors.symbol}
                  />

                  <FormInput
                    id="totalSupply"
                    name="totalSupply"
                    label={t('steps.details.tokenSupply.label')}
                    value={formData.totalSupply}
                    onChange={handleInputChange}
                    placeholder={t('steps.details.tokenSupply.placeholder')}
                    error={errors.totalSupply}
                    helperText={t('steps.details.tokenSupply.helper')}
                    isValid={!!formData.totalSupply && Number(formData.totalSupply) > 0 && !errors.totalSupply}
                  />
                </div>
              </div>

              {/* Advanced Settings */}
              <AdvancedSettings
                votingDelay={formData.votingDelay}
                votingPeriod={formData.votingPeriod}
                onVotingDelayChange={(value) => setFormData(prev => ({ ...prev, votingDelay: value }))}
                onVotingPeriodChange={(value) => setFormData(prev => ({ ...prev, votingPeriod: value }))}
              />

              {/* Deployment Status */}
              {(isDeploying || txState.isError) && (
                <DeploymentStatus
                  isWaitingForSignature={txState.isWaitingForSignature}
                  isWaitingForConfirmation={txState.isWaitingForConfirmation}
                  isError={txState.isError}
                  error={txState.error}
                  onRetry={() => reset()}
                />
              )}

              {/* Submit Button */}
              {!isDeploying && !txState.isError && (
                <button
                  type="submit"
                  disabled={!canDeploy || !isFormValid || isDeploying}
                  className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 px-6 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center"
                >
                  {!isConnected ? (
                    t('page.connectWalletToContinue')
                  ) : !canDeploy ? (
                    t('page.switchToSupportedNetwork')
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {t('page.createDaoButton')}
                    </>
                  )}
                </button>
              )}
            </form>
          </div>

          {/* Preview Column */}
          <div className="lg:col-span-1">
            <LivePreview
              formData={formData}
              networkName={currentNetwork?.name || 'Unknown Network'}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', [
        'common',
        'navigation',
        'create'
      ], nextI18NextConfig)),
    },
  };
};

export default CreateDAO;
