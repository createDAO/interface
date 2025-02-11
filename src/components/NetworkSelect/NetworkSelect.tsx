import { useChainId, useSwitchChain } from 'wagmi'
import { SUPPORTED_NETWORKS } from '../../config/networks'
import { getFactoryAddress } from '../../config/dao'
import styles from './NetworkSelect.module.css'

export function NetworkSelect() {
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()

  return (
    <div className={styles.selectContainer}>
      <select
        value={chainId}
        onChange={(e) => {
          const newChainId = Number(e.target.value)
          const networkConfig = getFactoryAddress(newChainId)
          if (networkConfig.isAvailable) {
            switchChain?.({ chainId: newChainId as 1 | 11155111 | 56 | 8453 | 42161 | 43114 | 137 | 10 | 100 | 81457 | 534352 })
          }
        }}
        className={styles.select}
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
