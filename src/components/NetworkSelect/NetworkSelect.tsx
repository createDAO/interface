import React from 'react'
import { useChainId, useSwitchChain } from 'wagmi'
import { SUPPORTED_NETWORKS } from '../../config/networks'
import { getFactoryAddress } from '../../config/dao'
import styles from './NetworkSelect.module.css'

interface NetworkSelectProps {
  onSwitchError?: (error: Error) => void;
}

export function NetworkSelect({ onSwitchError }: NetworkSelectProps = {}) {
  const chainId = useChainId()
  const { switchChain, isPending, error } = useSwitchChain()

  // If there's an error, pass it to the parent component
  React.useEffect(() => {
    if (error && onSwitchError) {
      onSwitchError(error);
    }
  }, [error, onSwitchError]);

  const handleNetworkChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newChainId = Number(e.target.value)
    const networkConfig = getFactoryAddress(newChainId)
    if (networkConfig.isAvailable) {
      try {
        await switchChain({ chainId: newChainId as 11155111 | 1 | 56 | 8453 | 42161 | 43114 | 137 | 10 | 100 | 81457 | 534352 })
      } catch (err) {
        // Error will be handled by the useEffect above
        console.error('Network switch failed:', err)
      }
    }
  }

  return (
    <div className={styles.selectContainer}>
      {isPending && (
        <div className={styles.loadingOverlay}>
          <span className={styles.loadingText}>Switching network...</span>
        </div>
      )}
      <select
        value={chainId}
        onChange={handleNetworkChange}
        className={styles.select}
        disabled={isPending}
      >
        {SUPPORTED_NETWORKS.map((network) => {
          const networkConfig = getFactoryAddress(network.id)
          return (
            <option
              key={network.id}
              value={network.id}
              disabled={!networkConfig.isAvailable}
            >
              {network.name} {!networkConfig.isAvailable && `(${networkConfig.comingSoon})`}
            </option>
          )
        })}
      </select>
    </div>
  )
}
