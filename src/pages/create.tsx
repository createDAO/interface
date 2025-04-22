import React, { useState, useCallback, useEffect } from 'react';
import Head from 'next/head';
import { useChainId, useSwitchChain, useAccount } from 'wagmi';
import Layout from '../components/layout/Layout';
import { useDaoDeployment } from '../hooks/useDaoDeployment';
import { getContractAddresses } from '../config/contracts';
import { DAOFormData } from '../types/dao';
import { SUPPORTED_NETWORKS } from '../config/networks';
import { TransactionStatus } from '../components/dao/TransactionStatus';
import { NetworkSelect } from '../components/dao/NetworkSelect';
import { VersionSelect } from '../components/dao/VersionSelect';
import { WalletButton } from '../components/dao/WalletButton';
import { ConnectWallet } from '../components/dao/ConnectWallet';
import { getCurrentVersion } from '../config/dao';

const CreateDAO: React.FC = () => {
  const [showWalletPopup, setShowWalletPopup] = useState(false);
  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending: isSwitchingNetwork } = useSwitchChain();
  const { deploy, state: txState, deploymentData } = useDaoDeployment();

  const [selectedVersion, setSelectedVersion] = useState(getCurrentVersion().id);
  const [formData, setFormData] = useState<DAOFormData>({
    daoName: '',
    tokenName: '',
    symbol: '',
    totalSupply: '',
  });

  const [errors, setErrors] = useState<Partial<DAOFormData>>({});
  const [networkSwitchError, setNetworkSwitchError] = useState<string | null>(null);

  // Handle network switch errors
  const handleNetworkSwitchError = (error: Error) => {
    setNetworkSwitchError(`Failed to switch network: ${error.message}`);
  };

  // Check if the current network has deployed contracts
  const hasDeployedContracts = useCallback((chainId: number | undefined): boolean => {
    if (!chainId) return false;
    const addresses = getContractAddresses(chainId);
    return !!addresses && !!addresses.daoFactory && addresses.daoFactory !== '0x';
  }, []);

  // Only clear network switch error when we successfully switch to a supported network
  useEffect(() => {
    // Check if we're on a supported network with deployed contracts
    const isOnSupportedNetwork = chainId && SUPPORTED_NETWORKS.some(n => n.id === chainId);
    const hasContracts = hasDeployedContracts(chainId);
    
    // Only clear the error if we're on a supported network with contracts
    if (networkSwitchError && isOnSupportedNetwork && hasContracts) {
      setNetworkSwitchError(null);
    }
  }, [chainId, networkSwitchError, hasDeployedContracts]);

  const validateForm = (): boolean => {
    const newErrors: Partial<DAOFormData> = {};

    if (!formData.daoName) {
      newErrors.daoName = 'DAO name is required';
    }

    if (!formData.tokenName) {
      newErrors.tokenName = 'Token name is required';
    }

    if (!formData.symbol) {
      newErrors.symbol = 'Symbol is required';
    } else if (formData.symbol.length > 6) {
      newErrors.symbol = 'Symbol must be 6 characters or less';
    }

    if (!formData.totalSupply) {
      newErrors.totalSupply = 'Total supply is required';
    } else if (isNaN(Number(formData.totalSupply)) || Number(formData.totalSupply) <= 0) {
      newErrors.totalSupply = 'Total supply must be a positive number';
    } else if (Number(formData.totalSupply) >= 999999999999) {
      newErrors.totalSupply = 'Total supply must be less than 999,999,999,999';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof DAOFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await deploy({ ...formData, versionId: selectedVersion });
    } catch (error) {
      console.error('Deployment error:', error);
    }
  };

  const isWrongNetwork = chainId && !SUPPORTED_NETWORKS.find(n => n.id === chainId);
  const noContractsForNetwork = chainId && !hasDeployedContracts(chainId);

  return (
    <Layout>
      <Head>
        <title>Create DAO | CreateDAO</title>
        <meta name="description" content="Create your DAO with a governance token in minutes" />
      </Head>

      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {showWalletPopup && (
          <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50" onClick={() => setShowWalletPopup(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Connect Your Wallet</h2>
                <p className="text-gray-600 dark:text-gray-300 mt-1">Please connect your wallet to create a DAO</p>
              </div>
              <ConnectWallet onClose={() => setShowWalletPopup(false)} />
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create DAO</h1>
            
            <div>
              {address ? (
                <WalletButton />
              ) : (
                <button
                  onClick={() => setShowWalletPopup(true)}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <p className="text-blue-700 dark:text-blue-300 text-sm">
                <strong>Note:</strong> The voting time has been changed from 3 days to 5 minutes for easier testing.
                A new factory with an extended voting time will be deployed once the initial testing phase is complete.
              </p>
            </div>
            
            {isWrongNetwork ? (
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Wrong Network</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Please switch to a supported network to create your DAO
                </p>
                
                {/* Show network errors with priority: 1. Switching 2. Error */}
                {(isSwitchingNetwork || networkSwitchError) && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                    <div className="flex">
                      {isSwitchingNetwork ? (
                        <>
                          <div className="animate-spin h-5 w-5 mr-3 border-2 border-yellow-500 border-t-transparent rounded-full"></div>
                          <p className="text-yellow-700 dark:text-yellow-300">
                            Switching network... Please confirm in your wallet.
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-yellow-700 dark:text-yellow-300 flex-1">
                            {networkSwitchError}
                          </p>
                          <button 
                            onClick={() => setNetworkSwitchError(null)} 
                            className="text-yellow-700 dark:text-yellow-300 hover:text-yellow-900 dark:hover:text-yellow-100"
                            aria-label="Dismiss error"
                          >
                            ✕
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {SUPPORTED_NETWORKS.map((network) => (
                    <button
                      key={network.id}
                      onClick={() => switchChain?.({ chainId: network.id })}
                      className="flex items-center justify-center space-x-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-3 px-4 hover:border-primary-500 dark:hover:border-primary-400 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isSwitchingNetwork}
                    >
                      {network.icon && (
                        <img src={network.icon} alt={network.name} className="h-5 w-5" />
                      )}
                      <span>{isSwitchingNetwork ? 'Switching...' : `Switch to ${network.name}`}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="network" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Network
                    </label>
                    <NetworkSelect onSwitchError={handleNetworkSwitchError} />
                  </div>
                  <div>
                    <label htmlFor="version" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Version
                    </label>
                    <VersionSelect
                      value={selectedVersion}
                      onChange={setSelectedVersion}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="daoName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    DAO Name
                  </label>
                  <input
                    id="daoName"
                    name="daoName"
                    type="text"
                    value={formData.daoName}
                    onChange={handleInputChange}
                    placeholder="e.g., My Awesome DAO"
                    className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  {errors.daoName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.daoName}</p>}
                </div>

                <div>
                  <label htmlFor="tokenName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Token Name
                  </label>
                  <input
                    id="tokenName"
                    name="tokenName"
                    type="text"
                    value={formData.tokenName}
                    onChange={handleInputChange}
                    placeholder="e.g., My DAO Token"
                    className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  {errors.tokenName && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.tokenName}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Token Symbol
                    </label>
                    <input
                      id="symbol"
                      name="symbol"
                      type="text"
                      value={formData.symbol}
                      onChange={handleInputChange}
                      placeholder="e.g., MDT"
                      className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.symbol && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.symbol}</p>}
                  </div>

                  <div>
                    <label htmlFor="totalSupply" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Total Supply
                    </label>
                    <input
                      id="totalSupply"
                      name="totalSupply"
                      type="text"
                      value={formData.totalSupply}
                      onChange={handleInputChange}
                      placeholder="e.g., 1000000"
                      className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.totalSupply && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.totalSupply}</p>}
                  </div>
                </div>

                {/* Show network errors with priority: 1. Switching 2. Error 3. Unsupported */}
                {(isSwitchingNetwork || networkSwitchError || noContractsForNetwork) && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <div className="flex">
                      {isSwitchingNetwork ? (
                        <>
                          <div className="animate-spin h-5 w-5 mr-3 border-2 border-yellow-500 border-t-transparent rounded-full"></div>
                          <p className="text-yellow-700 dark:text-yellow-300">
                            Switching network... Please confirm in your wallet.
                          </p>
                        </>
                      ) : networkSwitchError ? (
                        <>
                          <p className="text-yellow-700 dark:text-yellow-300 flex-1">
                            {networkSwitchError}
                          </p>
                          <button 
                            onClick={() => setNetworkSwitchError(null)} 
                            className="text-yellow-700 dark:text-yellow-300 hover:text-yellow-900 dark:hover:text-yellow-100"
                            aria-label="Dismiss error"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <p className="text-yellow-700 dark:text-yellow-300">
                          Your current network is not supported. Please switch to a supported network.
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!txState.isIdle || !address || noContractsForNetwork}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create DAO
                </button>
              </form>
            )}

            <TransactionStatus
              state={txState}
              chainId={chainId}
              messages={{
                waitingForSignature: 'Please sign to create your DAO...',
                submitting: 'Creating your DAO...',
                waitingForConfirmation: 'Waiting for creation confirmation...',
                success: 'DAO created successfully!',
                error: 'Failed to create DAO'
              }}
              className="mt-6"
            />

            {deploymentData && txState.isSuccess && (
              <div className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-green-700 dark:text-green-300 mb-4">DAO Deployed Successfully!</h3>
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white">Deployment Details</h4>
                  <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-2">
                    <p className="flex flex-wrap items-center">
                      <span className="font-medium mr-2">Version:</span>
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">{deploymentData.versionId}</code>
                    </p>
                    <p className="flex flex-wrap items-center">
                      <span className="font-medium mr-2">DAO Address:</span>
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm break-all">{deploymentData.daoAddress}</code>
                    </p>
                    <p className="flex flex-wrap items-center">
                      <span className="font-medium mr-2">Token Address:</span>
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm break-all">{deploymentData.tokenAddress}</code>
                    </p>
                    <p className="flex flex-wrap items-center">
                      <span className="font-medium mr-2">Treasury Address:</span>
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm break-all">{deploymentData.treasuryAddress}</code>
                    </p>
                    <p className="flex flex-wrap items-center">
                      <span className="font-medium mr-2">Staking Address:</span>
                      <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm break-all">{deploymentData.stakingAddress}</code>
                    </p>
                    <button
                      onClick={() => {
                        const text = `Your ${formData.daoName} DAO has been created successfully!\n\nHere are your 4 main contracts:\nDAO: ${deploymentData.daoAddress}\nToken: ${deploymentData.tokenAddress}\nTreasury: ${deploymentData.treasuryAddress}\nStaking: ${deploymentData.stakingAddress}\n\nYour wallet has received 1 ${formData.symbol} token, and the remaining tokens are locked in the ${formData.daoName} Treasury.\n\nTo start managing your DAO, create proposals, launch presale, or manage team allocations - please register your DAO at dao.cafe`;
                        navigator.clipboard.writeText(text);
                        const button = event?.target as HTMLButtonElement;
                        const originalText = button.innerText;
                        button.innerText = 'Copied!';
                        setTimeout(() => {
                          button.innerText = originalText;
                        }, 2000);
                      }}
                      className="mt-4 w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200"
                    >
                      Copy All Details (Important)
                    </button>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                      <strong>Important:</strong> Save these addresses! Your wallet has received 1 {formData.symbol} token, and the remaining tokens are locked in the {formData.daoName} Treasury.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateDAO;
