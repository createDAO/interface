import React, { useState, useEffect } from 'react';
import { useChainId, useAccount, useBalance, useSwitchChain, useConfig } from 'wagmi';
import { useTranslation } from 'next-i18next';
import { parseEther } from 'viem';
import { simulateContract } from '@wagmi/core';
import { DAOFormData } from '../../../types/dao';
import { TransactionState, BalanceCheckResult, SimulationResult } from '../../../types/transaction';
import { SUPPORTED_NETWORKS } from '../../../config/networks';
import { getContractAddresses, getContractABI } from '../../../config/contracts';
import { env } from '../../../config/env';
import { TransactionStatus } from '../../dao/TransactionStatus';
import { ErrorBoundary } from '../../ui';

interface PreDeploymentStepProps {
  formData: DAOFormData;
  txState: TransactionState;
  estimatedGasCost: {
    cost: string;
    symbol: string;
  } | null;
  onProceed: () => void;
  onBack: () => void;
  startBalanceCheck: () => void; // New prop to trigger the check
  startSimulation: () => void;   // New prop to trigger the simulation
  onCheckBalanceComplete: (result: BalanceCheckResult) => void; // Renamed prop
  onSimulateComplete: (result: SimulationResult) => void;     // Renamed prop
  onError: (error: Error | { code: number; name: string; shortMessage: string; details: string }) => void;
  selectedNetworkId: number; // New prop for the selected network ID
}

const PreDeploymentStep: React.FC<PreDeploymentStepProps> = ({
  formData,
  txState,
  estimatedGasCost,
  onProceed,
  onBack,
  startBalanceCheck,
  startSimulation,
  onCheckBalanceComplete,
  onSimulateComplete,
  onError,
  selectedNetworkId
}) => {
  const { t } = useTranslation('create');
  const chainId = useChainId();
  const { address, connector } = useAccount();
  const { data: balance } = useBalance({ address });
  const { switchChain, isPending: isSwitchingNetwork, error: switchError } = useSwitchChain();
  const config = useConfig();
  
  // Check if the current connector is NYKNYC (which sponsors transactions)
  const isNyknycConnector = connector?.id === 'nyknyc';
  const [checksPassed, setChecksPassed] = useState({
    balance: false,
    simulation: false
  });

  // Local state for balance check status - independent of transaction state
  const [balanceCheckStatus, setBalanceCheckStatus] = useState({
    isChecking: false,
    isChecked: false,
    isPassed: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [networkMismatch, setNetworkMismatch] = useState(false);
  // Add refs to track if deployment has been started and if simulation has been completed
  const deploymentStartedRef = React.useRef(false);
  const simulationCompletedRef = React.useRef<'idle' | 'passed' | 'failed'>('idle');

  // Local state for simulation status - persists after transaction submission
  const [simulationStatus, setSimulationStatus] = useState<'idle' | 'passed' | 'failed'>('idle');

  // Only reset simulation status when form data or network changes, not after simulation completes
  useEffect(() => {
    // Only reset if we haven't completed a simulation or if we're explicitly changing inputs
    if (simulationCompletedRef.current === 'idle') {
      setSimulationStatus('idle');
      setChecksPassed(prev => ({ ...prev, simulation: false }));
    }
  }, [formData, selectedNetworkId]);

  // Debug logging for simulation status
  useEffect(() => {
    if (simulationStatus === 'passed' || simulationStatus === 'failed') {
      simulationCompletedRef.current = simulationStatus;
    }
  }, [simulationStatus, checksPassed]);

  // Automatically proceed to deployment when both checks pass
  useEffect(() => {
    // If both checks have passed and we're not already in a transaction process
    // and deployment hasn't been started yet
    if (
      checksPassed.balance &&
      checksPassed.simulation &&
      !txState.isWaitingForSignature &&
      !txState.isWaitingForConfirmation &&
      !txState.isSuccess &&
      !txState.isError &&
      !networkMismatch &&
      !isLoading &&
      !deploymentStartedRef.current
    ) {
      // Mark deployment as started to prevent multiple calls
      deploymentStartedRef.current = true;
      // Automatically start the deployment process
      console.log('All checks passed, automatically proceeding to deployment');
      onProceed();
    }
  }, [
    checksPassed.balance,
    checksPassed.simulation,
    txState,
    networkMismatch,
    isLoading,
    onProceed
  ]);

  // Check if the current network matches the selected network
  useEffect(() => {
    if (chainId && selectedNetworkId && chainId !== selectedNetworkId) {
      setNetworkMismatch(true);
      // Attempt to switch the network automatically
      try {
        switchChain({ chainId: selectedNetworkId });
      } catch (error) {
        console.error('Failed to switch network:', error);
        // Error will be handled by the UI based on networkMismatch state
      }
    } else {
      setNetworkMismatch(false);
    }
  }, [chainId, selectedNetworkId, switchChain]);

  // Trigger checks on mount or when network is correct
  useEffect(() => {
    // Only proceed with checks if we're on the correct network
    if (chainId === selectedNetworkId) {
      // If NYKNYC connector is active, skip balance check and mark as passed automatically
      if (isNyknycConnector && !txState.isBalanceChecked && !txState.isError) {
        const sponsoredResult: BalanceCheckResult = {
          sufficient: true,
          balance: BigInt(0), // Not relevant for sponsored transactions
          required: BigInt(0), // Not relevant for sponsored transactions
          symbol: 'Sponsored'
        };
        
        setChecksPassed(prev => ({ ...prev, balance: true }));
        setBalanceCheckStatus({
          isChecking: false,
          isChecked: true,
          isPassed: true
        });
        onCheckBalanceComplete(sponsoredResult);
      }
      // Only trigger balance check if not NYKNYC and not already checking/simulating or completed/error
      else if (!isNyknycConnector && !txState.isCheckingBalance && !txState.isBalanceChecked && !txState.isError) {
        setBalanceCheckStatus(prev => ({ ...prev, isChecking: true }));
        startBalanceCheck();
      }

      // Only start simulation if we're not already simulating, haven't simulated yet, and there's no error
      // Also check simulationStatus to avoid re-triggering if we've already set it to 'failed' or 'passed' locally
      if (!txState.isSimulating && !txState.isSimulated && !txState.isError && simulationStatus === 'idle') {
        startSimulation();
      }
    }
    // Intentionally run when chainId or selectedNetworkId changes to re-trigger checks if needed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, selectedNetworkId, simulationStatus, isNyknycConnector]);

  // Get network information
  const network = SUPPORTED_NETWORKS.find(n => n.id === chainId);
  const selectedNetwork = SUPPORTED_NETWORKS.find(n => n.id === selectedNetworkId);
  const networkName = network?.name || `Chain ${chainId}`;
  const selectedNetworkName = selectedNetwork?.name || `Chain ${selectedNetworkId}`;

  // Check wallet balance
  useEffect(() => {
    // Define a safe wrapper function to prevent unhandled promise rejections
    const safeCheckBalance = () => {
      // Create a promise that we can handle safely
      const balanceCheckPromise = new Promise<void>(async (resolve) => {
        if (!address || !balance || !estimatedGasCost) {
          resolve();
          return;
        }

        try {
          // Convert estimated cost to bigint for comparison
          const requiredAmount = parseEther(estimatedGasCost.cost);
          const userBalance = balance.value;

          // Check if user has enough balance
          const sufficient = userBalance >= requiredAmount;

          // Create balance check result
          const result: BalanceCheckResult = {
            sufficient,
            balance: userBalance,
            required: requiredAmount,
            symbol: balance.symbol
          };

          // Update states
          setChecksPassed(prev => ({ ...prev, balance: sufficient }));
          setBalanceCheckStatus({
            isChecking: false,
            isChecked: true,
            isPassed: sufficient
          });

          // Call the completion callback
          onCheckBalanceComplete(result);

          // If balance is insufficient, also call onError with a formatted message
          if (!sufficient) {
            const neededAmount = requiredAmount - userBalance;
            const neededEth = Number(neededAmount) / 1e18;
            onError({
              code: -1,
              name: 'InsufficientFundsError',
              shortMessage: t('transaction.balanceError'),
              details: t('transaction.insufficientBalanceDetailsPlain', { 
                amount: neededEth.toFixed(6), 
                symbol: balance.symbol 
              })
            });
          }
        } catch (error) {
          console.error('Error checking balance:', error);
          onError({
            code: -1,
            name: 'BalanceCheckError',
              shortMessage: t('transaction.balanceCheckError', 'Failed to check wallet balance'),
            details: error instanceof Error ? error.message : 'Unknown error occurred'
          });
        } finally {
          resolve(); // Always resolve the promise to prevent unhandled rejections
        }
      });

      // Handle the promise with a .catch to ensure no unhandled rejections
      balanceCheckPromise.catch((error) => {
        console.error('Error in balance check promise:', error);
        onError({
          code: -1,
          name: 'BalanceCheckError',
          shortMessage: t('transaction.balanceCheckError', 'Failed to check wallet balance'),
          details: t('transaction.unexpectedErrorDetails', 'An unexpected error occurred during balance check')
        });
      });
    };

    // This effect now reacts to the state change triggered by startBalanceCheck
    if (txState.isCheckingBalance) {
      safeCheckBalance();
    }
  }, [txState.isCheckingBalance, address, balance, estimatedGasCost, onCheckBalanceComplete, onError]);

  // Simulate transaction using wagmi's simulateContract
  useEffect(() => {
    // Define a safe wrapper function to prevent unhandled promise rejections
    const safeSimulateTransaction = () => {
      // Create a promise that we can handle safely
      const simulationPromise = new Promise<void>(async (resolve) => {
        if (!address || !chainId) {
          resolve();
          return;
        }

        setIsLoading(true);

        try {
          // Get contract addresses and ABI
          const addresses = getContractAddresses(chainId);
          if (!addresses || !addresses.daoFactory) {
            throw new Error('DAO Factory contract address is not configured');
          }

          // Convert total supply to wei
          const totalSupplyWei = parseEther(formData.totalSupply);

          // Get contract ABI
          const abi = getContractABI('daoFactory');

          // Prepare function arguments
          const args = [
            formData.versionId || env.dao.version,
            formData.daoName,
            formData.tokenName,
            formData.symbol,
            totalSupplyWei
          ];

          // Wrap the simulateContract call in its own try/catch to ensure errors are caught at the source
          let simulationSuccess = false;
          let simulationResult: unknown;
          let simulationError: Error | unknown;

          try {
            // First simulate the contract call to ensure it will succeed
            const simulationResponse = await simulateContract(config, {
              address: addresses.daoFactory as `0x${string}`,
              abi,
              functionName: 'createDAO',
              args,
              account: address,
            });

            simulationSuccess = true;
            simulationResult = simulationResponse.result;
            console.log('Simulation result 1:', simulationResult);
          } catch (err) {
            simulationSuccess = false;
            simulationError = err;
            console.error('Contract simulation error caught:', err);
            // Don't rethrow - we'll handle it below
          }

          if (simulationSuccess) {
            // Since the simulation was successful, we can use the gas from the simulation result
            // or fall back to a default value

            // The simulateContract function already did the gas estimation internally
            // We can just use the result directly and skip the separate estimateGas call
            // which is causing errors due to missing function selector

            // Use a default gas estimate since we know the simulation was successful
            const gasEstimate: bigint = BigInt(1400000); // Default gas estimate for DAO creation
            console.log('Using default gas estimate:', gasEstimate);

            // Create simulation result
            const result: SimulationResult = {
              success: true,
              gasUsed: gasEstimate,
            };

            // Update state - make sure to update checksPassed first
            setChecksPassed(prev => ({ ...prev, simulation: true }));
            setSimulationStatus('passed');
            simulationCompletedRef.current = 'passed'; // Mark simulation as completed

            // Call the completion callback
            onSimulateComplete(result);

          } else {
            // Handle the simulation error
            const errorMessage = simulationError instanceof Error ? simulationError.message : 'Unknown error occurred during simulation';

            // Create simulation result with error
            const result: SimulationResult = {
              success: false,
              error: errorMessage
            };

            // Ensure simulation is marked as failed - make sure this happens before onSimulateComplete
            setChecksPassed(prev => {
              return { ...prev, simulation: false };
            });
            setSimulationStatus('failed');
            simulationCompletedRef.current = 'failed'; // Mark simulation as completed

            // Call the completion callback after state updates
            onSimulateComplete(result);

            // Log the simulation failure for debugging
            console.log('Simulation failed:', errorMessage);
            console.log('checksPassed should now be:', { ...checksPassed, simulation: false });

            // Call the error callback with a formatted message for contract function errors
            let formattedDetails = errorMessage;
            if (errorMessage.includes('The contract function')) {
              const match = errorMessage.match(/The contract function "([^"]+)" reverted with the following reason: (.+?)(?= Contract Call:|$)/);
              if (match) {
                formattedDetails = `${match[1]}: ${match[2]}`;
              }
            }

            onError({
              code: -1,
              name: 'SimulationError',
              shortMessage: t('transaction.simulationError'),
              details: formattedDetails
            });
          }
        } catch (error) {
          // This is a fallback catch for any other errors in the outer try block
          console.error('Unexpected error in simulation process:', error);

          // Create simulation result with error
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred during simulation';
          const result: SimulationResult = {
            success: false,
            error: errorMessage
          };

          // Ensure simulation is marked as failed
          setChecksPassed(prev => ({ ...prev, simulation: false }));
          setSimulationStatus('failed');
          simulationCompletedRef.current = 'failed'; // Mark simulation as completed

          // Call the completion callback
          onSimulateComplete(result);

          // Log the simulation failure for debugging

          // Call the error callback
          onError({
            code: -1,
            name: 'SimulationError',
              shortMessage: t('transaction.simulationError'),
              details: errorMessage
          });
        } finally {
          setIsLoading(false);
          resolve(); // Always resolve the promise to prevent unhandled rejections
        }
      });

      // Handle the promise with a .catch to ensure no unhandled rejections
      simulationPromise.catch((error) => {
        console.error('Error in simulation promise:', error);
        setIsLoading(false);

        // Ensure simulation is marked as failed
        setChecksPassed(prev => ({ ...prev, simulation: false }));
        setSimulationStatus('failed');
        simulationCompletedRef.current = 'failed'; // Mark simulation as completed

        onSimulateComplete({
          success: false,
          error: 'Unexpected error during simulation'
        });
        onError({
          code: -1,
          name: 'UnexpectedError',
          shortMessage: t('transaction.unexpectedError', 'Unexpected error'),
          details: t('transaction.unexpectedErrorDetails', 'An unexpected error occurred during transaction simulation')
        });
      });
    };

    // This effect now reacts to the state change triggered by startSimulation
    if (txState.isSimulating) {
      safeSimulateTransaction();
    }
  }, [txState.isSimulating, address, chainId, formData, onSimulateComplete, onError]);

  return (
    <div className="space-y-6">
      <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-primary-800 dark:text-primary-300 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {t('preDeployment.title')}
        </h3>
        <p className="text-primary-700 dark:text-primary-400 mb-4">
          {t('preDeployment.description')}
        </p>
      </div>

      {/* Deployment Checklist */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
            <path d="M10 6a1 1 0 011 1v3.586l2.707 2.707a1 1 0 01-1.414 1.414l-3-3A1 1 0 019 11V7a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          {t('preDeployment.checklist')}
        </h3>

        <div className="space-y-4">
          {/* Balance Check - Using local state instead of transaction state */}
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {txState.isCheckingBalance || balanceCheckStatus.isChecking ? (
                  <div className="w-6 h-6 mr-3 flex items-center justify-center">
                    <div className="animate-spin h-4 w-4 border-2 border-primary-500 border-t-transparent rounded-full"></div>
                  </div>
                ) : balanceCheckStatus.isChecked && balanceCheckStatus.isPassed ? (
                  <div className="w-6 h-6 mr-3 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : balanceCheckStatus.isChecked ? (
                  <div className="w-6 h-6 mr-3 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-6 h-6 mr-3 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">1</span>
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {isNyknycConnector ? t('preDeployment.balanceCheck.sponsoredTitle') : t('preDeployment.balanceCheck.title')}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {isNyknycConnector 
                      ? t('preDeployment.balanceCheck.sponsoredDescription')
                      : t('preDeployment.balanceCheck.description', { symbol: network?.nativeCurrency?.symbol || 'ETH' })}
                  </p>
                </div>
              </div>
              {balanceCheckStatus.isChecked && balanceCheckStatus.isPassed && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {isNyknycConnector ? t('preDeployment.status.sponsored') : t('preDeployment.status.passed')}
                </span>
              )}
            </div>
          </div>

          {/* Transaction Simulation */}
          <ErrorBoundary
            fallback={
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center">
                  <div className="w-6 h-6 mr-3 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-red-800 dark:text-red-300">{t('transaction.simulationError')}</h4>
                    <p className="text-xs text-red-600 dark:text-red-400">
                      {t('transaction.simulationErrorMessage')}
                    </p>
                  </div>
                </div>
              </div>
            }
          >
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {txState.isSimulating ? (
                    <div className="w-6 h-6 mr-3 flex items-center justify-center">
                      <div className="animate-spin h-4 w-4 border-2 border-primary-500 border-t-transparent rounded-full"></div>
                    </div>
                  ) : simulationStatus === 'passed' ? (
                    <div className="w-6 h-6 mr-3 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ) : simulationStatus === 'failed' ? (
                    <div className="w-6 h-6 mr-3 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-6 h-6 mr-3 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">2</span>
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">{t('preDeployment.simulation.title')}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t('preDeployment.simulation.description', { network: networkName })}
                    </p>
                  </div>
                </div>
                {simulationStatus === 'passed' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {t('preDeployment.status.passed')}
                  </span>
                )}
                {simulationStatus === 'failed' && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                    {t('preDeployment.status.failed')}
                  </span>
                )}
              </div>
            </div>
          </ErrorBoundary>

          {/* Transaction Signing */}
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {txState.isWaitingForSignature ? (
                  <div className="w-6 h-6 mr-3 flex items-center justify-center">
                    <div className="animate-spin h-4 w-4 border-2 border-primary-500 border-t-transparent rounded-full"></div>
                  </div>
                ) : txState.isWaitingForConfirmation || txState.isSuccess ? (
                  <div className="w-6 h-6 mr-3 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-6 h-6 mr-3 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">3</span>
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">{t('preDeployment.signing.title')}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {txState.isWaitingForSignature ?
                      t('preDeployment.signing.inProgress') :
                      t('preDeployment.signing.description')}
                  </p>
                </div>
              </div>
              {txState.isWaitingForConfirmation || txState.isSuccess ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {t('preDeployment.status.signed')}
                </span>
              ) : null}
            </div>
          </div>

          {/* Transaction Confirmation */}
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {txState.isWaitingForConfirmation ? (
                  <div className="w-6 h-6 mr-3 flex items-center justify-center">
                    <div className="animate-spin h-4 w-4 border-2 border-primary-500 border-t-transparent rounded-full"></div>
                  </div>
                ) : txState.isSuccess ? (
                  <div className="w-6 h-6 mr-3 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-6 h-6 mr-3 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">4</span>
                  </div>
                )}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">{t('preDeployment.confirmation.title')}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {txState.isWaitingForConfirmation ?
                      t('preDeployment.confirmation.inProgress') :
                      t('preDeployment.confirmation.description')}
                  </p>
                </div>
              </div>
              {txState.isSuccess ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  {t('preDeployment.status.confirmed')}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* Transaction Status */}
      <TransactionStatus
        state={txState}
        chainId={chainId}
        messages={{
          checkingBalance: t('transaction.checkingBalance'),
          balanceError: t('transaction.balanceError'),
          simulating: t('transaction.simulating'),
          simulationError: t('transaction.simulationError')
        }}
        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md"
      />

      {/* Network Mismatch Warning */}
      {networkMismatch && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="h-5 w-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">{t('preDeployment.networkMismatch.title')}</h3>
              <div className="mt-1 text-sm text-yellow-700 dark:text-yellow-400">
                <p>{t('preDeployment.networkMismatch.description', { current: networkName, selected: selectedNetworkName })}</p>
                {isSwitchingNetwork ? (
                  <p className="mt-1">{t('preDeployment.networkMismatch.switching')}</p>
                ) : switchError ? (
                  <p className="mt-1">{t('preDeployment.networkMismatch.switchFailed')}</p>
                ) : (
                  <p className="mt-1">{t('preDeployment.networkMismatch.switchNeeded', { network: selectedNetworkName })}</p>
                )}
              </div>
              {!isSwitchingNetwork && (
                <button
                  onClick={() => switchChain({ chainId: selectedNetworkId })}
                  className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  {t('preDeployment.networkMismatch.switchTo', { network: selectedNetworkName })}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-start mt-8">
        <button
          type="button"
          onClick={onBack}
          disabled={txState.isWaitingForSignature || txState.isWaitingForConfirmation}
          className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 py-2 px-4 rounded-lg font-medium transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="inline-block mr-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          {t('preDeployment.backToReview')}
        </button>
      </div>
    </div>
  );
};

export default PreDeploymentStep;
