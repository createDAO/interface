import React, { useState, useCallback, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useChainId, useSwitchChain, useAccount } from 'wagmi';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import nextI18NextConfig from '../../next-i18next.config.js';
import Layout from '../components/layout/Layout';
import { useDaoDeployment } from '../hooks/useDaoDeployment';
import { DAOFormData } from '../types/dao';
import { SUPPORTED_NETWORKS } from '../config/networks';
import { getCurrentVersion } from '../config/dao';
import { saveDAO, daoExists } from '../services/firebase/dao';
import { StepIndicator } from '../components/create/ui';
import { NetworkStep, DAODetailsStep, ReviewStep, PreDeploymentStep, DeploymentStep } from '../components/create/steps';
import { hasDeployedContracts } from '../utils/contracts';
import { BalanceCheckResult, SimulationResult } from '../types/transaction';

const CreateDAO: React.FC = () => {
  const { address } = useAccount();
  const chainId = useChainId();
  const { isPending: isSwitchingNetwork } = useSwitchChain();
  const {
    deploy,
    checkBalance,
    simulateTransaction,
    state: txState,
    deploymentData,
    setBalanceChecked, // Get the state update function
    setSimulated,      // Get the state update function
    reset              // Get the reset function
  } = useDaoDeployment();

  const [selectedVersion, setSelectedVersion] = useState(getCurrentVersion().id);
  const [selectedNetworkId, setSelectedNetworkId] = useState<number | null>(null);
  const [formData, setFormData] = useState<DAOFormData>({
    daoName: '',
    tokenName: '',
    symbol: '',
    totalSupply: '',
  });

  const [errors, setErrors] = useState<Partial<DAOFormData>>({});
  const [networkSwitchError, setNetworkSwitchError] = useState<string | null>(null);

  // Handle network switch errors (memoized to prevent re-renders)
  const handleNetworkSwitchError = useCallback((error: Error | null) => {
    if (error) {
      console.log(error);

      setNetworkSwitchError(`Failed to switch network: ${error.message}`);
    } else {
      setNetworkSwitchError(null); // Allow clearing the error
    }
  }, []); // Empty dependency array ensures the function reference is stable

  // Track which fields have been touched by the user
  const [touchedFields, setTouchedFields] = useState<Record<keyof DAOFormData, boolean>>({
    daoName: false,
    tokenName: false,
    symbol: false,
    totalSupply: false,
    versionId: false,
  });


  // State for multi-step form
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 5;

  // Track form validation state
  const [isFormValid, setIsFormValid] = useState(false);

  // Define network status variables
  const isWrongNetwork = !!chainId && !SUPPORTED_NETWORKS.find(n => n.id === chainId);
  const noContractsForNetwork = !!chainId && !hasDeployedContracts(chainId);

  // Store the selected network ID when the user selects a network
  useEffect(() => {
    if (chainId && currentStep === 0 && !isWrongNetwork && !noContractsForNetwork) {
      setSelectedNetworkId(chainId);
    }
  }, [chainId, currentStep, isWrongNetwork, noContractsForNetwork]);

  // Handle step navigation
  const goToNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);

      // Reset touched fields when changing steps
      setTouchedFields({
        daoName: false,
        tokenName: false,
        symbol: false,
        totalSupply: false,
        versionId: false,
      });
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      // Reset transaction state when navigating back from Pre-deployment step
      if (currentStep === 3) {
        // Reset transaction state to ensure checks run again when returning to this step
        reset();
        console.log('Transaction state reset when navigating back from Pre-deployment step');
      }

      setCurrentStep(currentStep - 1);

      // Reset touched fields when changing steps
      setTouchedFields({
        daoName: false,
        tokenName: false,
        symbol: false,
        totalSupply: false,
        versionId: false,
      });
    }
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps) {
      setCurrentStep(step);

      // Reset touched fields when changing steps
      setTouchedFields({
        daoName: false,
        tokenName: false,
        symbol: false,
        totalSupply: false,
        versionId: false,
      });
    }
  };

  // Only clear network switch error when we successfully switch to a supported network
  useEffect(() => {
    // Check if we're on a supported network with deployed contracts
    const isOnSupportedNetwork = chainId && SUPPORTED_NETWORKS.some(n => n.id === chainId);
    const hasContracts = hasDeployedContracts(chainId);

    // Only clear the error if we're on a supported network with contracts
    if (networkSwitchError && isOnSupportedNetwork && hasContracts) {
      setNetworkSwitchError(null);
    }
  }, [chainId, networkSwitchError]);

  // Ref to track if we've attempted to save this transaction
  const savedTransactionHashRef = useRef<string | null>(null);

  // Silently save DAO to Firestore when deployment is successful - only once per transaction
  useEffect(() => {
    const saveDeployedDAO = async () => {
      // Only proceed if we have deployment data, transaction was successful, and we haven't saved this transaction yet
      if (deploymentData &&
        txState.isSuccess &&
        address &&
        chainId &&
        deploymentData.transactionHash &&
        savedTransactionHashRef.current !== deploymentData.transactionHash) {

        // Mark this transaction hash as saved to prevent duplicate saves
        savedTransactionHashRef.current = deploymentData.transactionHash;

        try {
          // Check if this DAO already exists in Firestore (additional safeguard against duplicates)
          const exists = await daoExists(deploymentData.transactionHash, chainId);

          if (!exists) {
            // Find the current network info
            const network = SUPPORTED_NETWORKS.find(n => n.id === chainId) || {
              id: chainId,
              name: `Network ${chainId}`,
              isTestnet: true,
            };

            // Save to Firestore
            await saveDAO(
              deploymentData,
              formData,
              network,
              address
            );
          }
        } catch (error) {
          // Silently log error but don't show to user
          console.error('Error saving DAO to Firestore:', error);
        }
      }
    };

    saveDeployedDAO();
  }, [deploymentData, txState.isSuccess, address, chainId, formData]);

  // Reset the saved transaction hash when starting a new transaction
  useEffect(() => {
    if (txState.isIdle) {
      savedTransactionHashRef.current = null;
    }
  }, [txState.isIdle]);

  // Estimated gas cost for deployment - This will be set by ReviewStep via callback
  const [estimatedGasCost, setEstimatedGasCost] = useState<{
    cost: string;
    symbol: string;
  } | null>(null);

  // Auto-advance to success step when transaction is successful
  useEffect(() => {
    if (txState.isSuccess && currentStep < 4) {
      setCurrentStep(4);
    }
  }, [txState.isSuccess, currentStep]);

  // Function to validate a single field
  const validateField = (name: keyof DAOFormData, value: string | undefined): string | undefined => {
    switch (name) {
      case 'daoName':
        return !value ? 'DAO name is required' : undefined;

      case 'tokenName':
        return !value ? 'Token name is required' : undefined;

      case 'symbol':
        if (!value) return 'Symbol is required';
        if (value.length > 6) return 'Symbol must be 6 characters or less';
        return undefined;

      case 'totalSupply':
        if (!value) return 'Total supply is required';
        if (isNaN(Number(value)) || Number(value) <= 0) return 'Total supply must be a positive number';
        if (Number(value) >= 999999999999) return 'Total supply must be less than 999,999,999,999';
        return undefined;

      default:
        return undefined;
    }
  };

  // Update form validation when data changes
  useEffect(() => {
    if (currentStep === 1) {
      // Create a new errors object
      const newErrors: Partial<DAOFormData> = {};
      let hasErrors = false;

      // Only validate fields that have been touched
      Object.keys(formData).forEach((key) => {
        const fieldName = key as keyof DAOFormData;
        if (touchedFields[fieldName]) {
          const error = validateField(fieldName, formData[fieldName]);
          if (error) {
            newErrors[fieldName] = error;
            hasErrors = true;
          }
        }
      });

      // Update errors state
      setErrors(newErrors);

      // Check if all required fields are filled and valid
      const allFieldsValid = !hasErrors &&
        !!formData.daoName &&
        !!formData.tokenName &&
        !!formData.symbol &&
        !!formData.totalSupply &&
        Number(formData.totalSupply) > 0 &&
        Number(formData.totalSupply) < 999999999999 &&
        formData.symbol.length <= 6;

      setIsFormValid(!!allFieldsValid);
    }
  }, [formData, touchedFields, currentStep]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update form data
    setFormData(prev => ({ ...prev, [name]: value }));

    // Mark this field as touched
    setTouchedFields(prev => ({
      ...prev,
      [name]: true
    }));
  };

  // Function to validate all form fields
  const validateForm = (): boolean => {
    // Mark all fields as touched
    setTouchedFields({
      daoName: true,
      tokenName: true,
      symbol: true,
      totalSupply: true,
      versionId: true,
    });

    // Validate all fields
    const newErrors: Partial<DAOFormData> = {};

    Object.keys(formData).forEach((key) => {
      const fieldName = key as keyof DAOFormData;
      const error = validateField(fieldName, formData[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    // Update errors state
    setErrors(newErrors);

    // Check if form is valid
    const valid = Object.keys(newErrors).length === 0;
    setIsFormValid(valid);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.warn('Form onSubmit triggered, but deployment should be handled by step buttons.');
    // Intentionally do nothing here. Deployment is triggered by handleStartDeployment
    // in the PreDeploymentStep. We might want validation based on currentStep here
    // in the future, but for now, let's prevent accidental deployment.
    // validateForm(); // Optionally re-validate current step's inputs if needed
  };


  // Check if we can proceed to the next step
  const canProceedToNextStep = () => {
    if (currentStep === 0) {
      // Can proceed from network step if we're on a supported network with contracts
      return !isWrongNetwork && !noContractsForNetwork;
    } else if (currentStep === 1) {
      // Can proceed from DAO details step if form is valid
      return isFormValid;
    } else if (currentStep === 2) {
      // Can proceed from review step if we're ready to deploy
      return true;
    }
    return false;
  };

  // Function to handle "Continue to Review" button click
  const handleContinue = () => {
    if (validateForm()) {
      goToNextStep();
    }
  };

  // Handlers for pre-deployment checks
  const handleCheckBalance = async (result: unknown) => {
    console.log('Balance check result:', result);
    // Update transaction state with balance check result
    setBalanceChecked(result as BalanceCheckResult); // Call the state update function with the result
  };

  const handleSimulate = async (result: unknown) => {
    console.log('Simulation result 2:', result);
    // Update transaction state with simulation result
    const simulationResult = result as SimulationResult;
    console.log('Handling simulation result in create.tsx:', simulationResult);
    setSimulated(simulationResult); // Call the state update function with the result
  };

  const handlePreDeploymentError = (error: unknown) => {
    console.error('Pre-deployment error:', error);
  };

  const handleStartDeployment = async () => {
    try {
      await deploy({ ...formData, versionId: selectedVersion });
    } catch (error) {
      console.error('Deployment error:', error);
    }
  };

  // Render the appropriate step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <NetworkStep
            selectedVersion={selectedVersion}
            setSelectedVersion={setSelectedVersion}
            handleNetworkSwitchError={handleNetworkSwitchError}
            networkSwitchError={networkSwitchError}
            isSwitchingNetwork={isSwitchingNetwork}
            noContractsForNetwork={noContractsForNetwork}
            goToNextStep={goToNextStep}
            canProceedToNextStep={canProceedToNextStep}
          />
        );
      case 1:
        return (
          <DAODetailsStep
            formData={formData}
            errors={errors}
            touchedFields={touchedFields}
            handleInputChange={handleInputChange}
            goToPreviousStep={goToPreviousStep}
            goToNextStep={handleContinue}
            canProceedToNextStep={canProceedToNextStep}
          />
        );
      case 2:
        return (
          <ReviewStep
            formData={formData}
            selectedVersion={selectedVersion}
            handleSubmit={() => goToNextStep()} // Go to pre-deployment step instead of submitting
            goToPreviousStep={goToPreviousStep}
            isLoading={txState.isSubmitting || txState.isWaitingForConfirmation}
            hasWallet={!!address}
            selectedNetworkId={selectedNetworkId || chainId}
            onEstimateCalculated={setEstimatedGasCost} // Pass the setter function
          />
        );
      case 3:
        return (
          <PreDeploymentStep
            formData={{ ...formData, versionId: selectedVersion }} // Include selectedVersion in formData
            txState={txState}
            estimatedGasCost={estimatedGasCost} // Fix variable name
            onProceed={handleStartDeployment}
            onBack={goToPreviousStep}
            startBalanceCheck={() => checkBalance()} // No arguments needed
            startSimulation={simulateTransaction}      // Pass the function to start simulation
            onCheckBalanceComplete={handleCheckBalance} // Keep existing handler for completion
            onSimulateComplete={handleSimulate}         // Keep existing handler for completion
            onError={handlePreDeploymentError}
            selectedNetworkId={selectedNetworkId || chainId}
          />
        );
      case 4:
        return (
          <DeploymentStep
            formData={formData}
            deploymentData={deploymentData}
            isSuccess={txState.isSuccess}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <Head>
        <title>Create Your DAO | CreateDAO</title>
        <meta name="description" content="Create your own DAO with customizable governance and token parameters" />
      </Head>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Create Your DAO</h1>

        {/* Step Indicator */}
        <StepIndicator
          currentStep={currentStep}
          totalSteps={totalSteps}
          onStepClick={goToStep}
        />


        {/* Step Content */}
        <form onSubmit={handleSubmit}>
          {renderStepContent()}
        </form>
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
