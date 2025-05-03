import React, { useEffect } from 'react';
import { useChainId, useSwitchChain } from 'wagmi';
import { SUPPORTED_NETWORKS } from '../../config/networks';
import { getFactoryAddress } from '../../config/dao';

interface NetworkSelectProps {
  onSwitchError?: (error: Error) => void;
  className?: string;
}

export function NetworkSelect({ onSwitchError, className = '' }: NetworkSelectProps) {
  const chainId = useChainId();
  const { switchChain, isPending, error } = useSwitchChain();

  // If there's an error, pass it to the parent component
  useEffect(() => {
    if (error && onSwitchError) {
      onSwitchError(error);
    }
  }, [error, onSwitchError]);


  const handleNetworkChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newChainId = Number(e.target.value);
    const networkConfig = getFactoryAddress(newChainId);

    if (networkConfig.isAvailable) {
      try {
        // Switch to the chain
        await switchChain({ chainId: newChainId });
      } catch (err) {
        // Error will be handled by the useEffect above
        console.error('Network switch failed:', err);
      }
    }
  };

  return (
    <div className={`relative ${className}`}>
      {isPending && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 flex items-center justify-center rounded-lg z-10">
          <div className="animate-spin h-5 w-5 border-2 border-primary-500 border-t-transparent rounded-full"></div>
        </div>
      )}
      <select
        value={chainId}
        onChange={handleNetworkChange}
        className="w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-3 appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        disabled={isPending}
      >
        {SUPPORTED_NETWORKS.map((network) => {
          const networkConfig = getFactoryAddress(network.id);
          return (
            <option
              key={network.id}
              value={network.id}
              disabled={!networkConfig.isAvailable}
            >
              {network.name} {!networkConfig.isAvailable && `(${networkConfig.comingSoon})`}
            </option>
          );
        })}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  );
}
