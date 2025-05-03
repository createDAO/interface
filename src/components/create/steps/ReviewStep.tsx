import React, { useState } from 'react';
import { useAccount, useEstimateFeesPerGas, useDisconnect, useEnsName, useBalance } from 'wagmi';
import Image from 'next/image';
import { formatEther } from 'viem';
import { DAOFormData } from '../../../types/dao';
import { SUPPORTED_NETWORKS } from '../../../config/networks';
import { ConnectWallet } from '../../dao/ConnectWallet';

// Wallet Connected Section Component
const WalletConnectedSection = () => {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: ensName } = useEnsName({ address });
  const { data: balance } = useBalance({ address });

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Copy address to clipboard
  const copyToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      // Could add a toast notification here
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-green-100 dark:bg-green-800/30 p-2 rounded-full">
            <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-green-800 dark:text-green-300">Wallet Connected</h3>
            <p className="text-sm text-green-700 dark:text-green-400">
              Your wallet is connected and ready to deploy the DAO
            </p>
          </div>
        </div>
        <button
          onClick={() => disconnect()}
          className="flex items-center space-x-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-200 cursor-pointer"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="text-sm font-medium">Disconnect</span>
        </button>
      </div>

      {/* Wallet Info Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-green-100 dark:border-green-800/30">
        {/* Wallet Address Section */}
        <div className="p-4 border-b border-green-100 dark:border-green-800/30">
          <div className="flex items-start">
            <div className="p-2 bg-green-50 dark:bg-green-900/10 rounded-lg mr-3">
              <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Wallet Address</h4>
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 text-xs cursor-pointer"
                >
                  <svg className="h-3.5 w-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                  Copy
                </button>
              </div>
              <div className="mt-1">
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {address ? (ensName || formatAddress(address)) : 'Loading...'}
                </p>
                {ensName && address && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{address}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Balance Section */}
        <div className="p-4">
          <div className="flex items-start">
            <div className="p-2 bg-green-50 dark:bg-green-900/10 rounded-lg mr-3">
              <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Balance</h4>
              <p className="text-lg font-medium text-gray-900 dark:text-white mt-1">
                {balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : 'Loading...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ReviewStepProps {
  formData: DAOFormData;
  selectedVersion: string;
  handleSubmit: (e: React.FormEvent) => void;
  goToPreviousStep: () => void;
  isLoading: boolean;
  hasWallet: boolean;
  selectedNetworkId: number;
  onEstimateCalculated: (cost: { cost: string; symbol: string } | null) => void; // Add the callback prop
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  formData,
  selectedVersion,
  handleSubmit,
  goToPreviousStep,
  isLoading,
  hasWallet,
  selectedNetworkId,
  onEstimateCalculated // Destructure the callback prop
}) => {
  // const chainId = useChainId();
  const [showWalletPopup, setShowWalletPopup] = useState(false);
  const [isInitiatingWallet, setIsInitiatingWallet] = useState(false);
  // If you want to estimate gas for the selected network, you could use selectedNetworkId here.
  // For now, keep using chainId for estimation, but use selectedNetworkId for display.
  const { data: feesData } = useEstimateFeesPerGas({
    chainId: selectedNetworkId,
    formatUnits: 'wei'
  });

  // Estimated gas for DAO deployment (1.4 million gas units)
  const ESTIMATED_GAS_UNITS = 1400000;

  // Calculate estimated cost in native token
  const calculateGasCost = () => {
    // Use maxFeePerGas for EIP-1559 networks, or gasPrice for legacy networks
    const feePerGas = feesData?.maxFeePerGas || feesData?.gasPrice;
    if (!feePerGas) return null;

    const estimatedCostInWei = BigInt(ESTIMATED_GAS_UNITS) * feePerGas;
    const estimatedCostInEth = formatEther(estimatedCostInWei);

    const network = SUPPORTED_NETWORKS.find(n => n.id === selectedNetworkId);
    const symbol = network?.nativeCurrency?.symbol || 'ETH';

    return {
      cost: parseFloat(estimatedCostInEth).toFixed(6),
      symbol
    };
  };

  const estimatedCost = calculateGasCost();

  // Call the callback whenever the estimated cost changes
  React.useEffect(() => {
    onEstimateCalculated(estimatedCost);
  }, [estimatedCost, onEstimateCalculated]);
  
  const toggleWalletPopup = () => {
    setShowWalletPopup(!showWalletPopup);
  };
  
  // Wrap the original handleSubmit to add wallet initiation state
  const handleSubmitWithWalletState = (e: React.FormEvent) => {
    setIsInitiatingWallet(true);
    e.preventDefault();
    // Call the original handleSubmit
    handleSubmit(e);
    
    // Reset the state after a short delay to account for wallet popup
    // This will be overridden by isLoading once the transaction is submitted
    setTimeout(() => {
      setIsInitiatingWallet(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-primary-800 dark:text-primary-300 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Review Your DAO
        </h3>
        <p className="text-primary-700 dark:text-primary-400 mb-4">
          Please review your DAO configuration before deployment. Once deployed, some settings cannot be changed.
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12zm-1-5a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zm1-4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
          </svg>
          DAO Configuration Summary
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 className="font-medium text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Organization Details</h4>
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Network</h5>
                <p className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  {SUPPORTED_NETWORKS.find(n => n.id === selectedNetworkId)?.name || 'Unknown Network'}
                  {SUPPORTED_NETWORKS.find(n => n.id === selectedNetworkId)?.icon && (
                    <Image
                      src={SUPPORTED_NETWORKS.find(n => n.id === selectedNetworkId)?.icon || '/images/networks/ethereum.png'}
                      alt={SUPPORTED_NETWORKS.find(n => n.id === selectedNetworkId)?.name || 'Network icon'}
                      width={20}
                      height={20}
                      className="h-5 w-5 ml-2"
                    />
                  )}
                </p>
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">DAO Name</h5>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{formData.daoName}</p>
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Version</h5>
                <p className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                  {selectedVersion}
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Latest
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-lg border border-gray-200 dark:border-gray-700">
            <h4 className="font-medium text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Token Details</h4>
            <div className="space-y-4">
              <div>
                <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Token Name</h5>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{formData.tokenName}</p>
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Token Symbol</h5>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{formData.symbol}</p>
              </div>
              
              <div>
                <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Supply</h5>
                <p className="text-lg font-medium text-gray-900 dark:text-white">{Number(formData.totalSupply).toLocaleString()} {formData.symbol}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Gas Cost Estimation */}
        <div className="mt-6 p-5 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Estimated Deployment Cost
          </h4>
          <div className="text-blue-700 dark:text-blue-400 space-y-2">
            <p>Deploying your DAO will cost approximately:</p>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-blue-100 dark:border-blue-800 flex items-center justify-between">
              {!estimatedCost ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="font-medium text-lg">Calculating...</span>
                </div>
              ) : (
                <span className="font-medium text-lg">{estimatedCost.cost} {estimatedCost.symbol}</span>
              )}
              <span className="text-sm text-gray-500 dark:text-gray-400">≈ {ESTIMATED_GAS_UNITS.toLocaleString()} gas units</span>
            </div>
            <p className="text-sm">
              Note: Actual cost may vary based on network conditions at the time of deployment.
            </p>
          </div>
        </div>
      
      <div className="mt-6 p-5 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg">
          <h4 className="font-medium text-primary-800 dark:text-primary-300 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            What Happens Next
          </h4>
          <div className="text-primary-700 dark:text-primary-400 space-y-2">
            <p>When you click &#34;Continue to Pre-Deployment&#34;, the following will happen:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>We&#39;ll check your wallet balance to ensure you have enough funds</li>
              <li>We&#39;ll simulate the transaction to verify it will succeed</li>
              <li>Your wallet will prompt you to confirm the transaction</li>
              <li>The DAO contracts will be deployed to the {SUPPORTED_NETWORKS.find(n => n.id === selectedNetworkId)?.name} network</li>
              <li>You&#39;ll receive 1 {formData.symbol} token to start participating in governance</li>
              <li>The remaining {(Number(formData.totalSupply) - 1).toLocaleString()} {formData.symbol} will be stored in the treasury</li>
            </ol>
          </div>
        </div>
      </div>
      
      {/* Wallet Section */}
      <div className="mt-6 shadow-md rounded-lg">
        {hasWallet ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <WalletConnectedSection />
          </div>
        ) : (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-0.5">
                <svg className="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-lg font-medium text-yellow-800 dark:text-yellow-300">Wallet Connection Required</h3>
                <div className="mt-2 text-yellow-700 dark:text-yellow-400">
                  <p>You need to connect a Web3 wallet to deploy your DAO. This allows you to:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Sign the deployment transaction</li>
                    <li>Become the initial DAO admin</li>
                    <li>Receive your governance token</li>
                  </ul>
                </div>
                <div className="mt-4">
                  <button
                    onClick={toggleWalletPopup}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer"
                  >
                    Connect Wallet
                    <svg className="ml-2 -mr-0.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Wallet Connection Popup */}
      {showWalletPopup && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50" onClick={toggleWalletPopup}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
            <ConnectWallet onClose={toggleWalletPopup} />
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
          Back to DAO Details
        </button>
        
        <button
          type="button"
          onClick={handleSubmitWithWalletState}
          disabled={!hasWallet || isLoading || isInitiatingWallet}
          className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading || isInitiatingWallet ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              Continue to Pre-Deployment
              <svg className="inline-block ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ReviewStep;
