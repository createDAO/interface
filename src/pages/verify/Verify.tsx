import { useState } from 'react'
import { useChainId } from 'wagmi'
import { isAddress } from 'viem'
import { NetworkSelect } from '@components/NetworkSelect'
import { useDAOVerification } from '@hooks/useDAOVerification'
import { getExplorerUrl } from '@config/networks'
import styles from './Verify.module.css'

function Verify() {
  const chainId = useChainId()
  const { verify, state } = useDAOVerification()
  const [daoAddress, setDaoAddress] = useState('')
  const [error, setError] = useState('')

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!daoAddress) {
      setError('Please enter a DAO address')
      return
    }

    if (!isAddress(daoAddress)) {
      setError('Please enter a valid address')
      return
    }

    try {
      await verify(daoAddress, chainId)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Verification failed')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Verify DAO</h1>
        <p className={styles.description}>
          Verify the authenticity of a DAO contract
        </p>

        <form onSubmit={handleVerify} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="network" className={styles.label}>Network</label>
            <NetworkSelect />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="daoAddress" className={styles.label}>DAO Address</label>
            <input
              id="daoAddress"
              type="text"
              value={daoAddress}
              onChange={(e) => {
                setDaoAddress(e.target.value)
                setError('')
              }}
              placeholder="Enter DAO contract address"
              className={styles.input}
            />
            {error && <span className={styles.error}>{error}</span>}
          </div>

          <button
            type="submit"
            disabled={state.isLoading}
            className={styles.verifyButton}
          >
            {state.isLoading ? 'Verifying...' : 'Verify DAO'}
          </button>
        </form>

        {state.isLoading && (
          <div className={styles.loadingMessage}>
            Verifying DAO... This may take a few moments.
          </div>
        )}

        {state.isError && (
          <div className={styles.errorMessage}>
            {state.error}
            {state.error?.includes('RPC URL') && (
              <div className={styles.errorHelp}>
                <p>Please ensure the following environment variables are set:</p>
                <ul>
                  <li>VITE_MAINNET_RPC_URL - for Ethereum Mainnet</li>
                  <li>VITE_SEPOLIA_RPC_URL - for Sepolia Testnet</li>
                  <li>VITE_POLYGON_RPC_URL - for Polygon</li>
                </ul>
              </div>
            )}
          </div>
        )}

        {state.isSuccess && state.data && (
          <div className={styles.success}>
            <h3>DAO Verified Successfully!</h3>
            <div className={styles.verificationInfo}>
              <h4>DAO Details</h4>
              <div className={styles.addresses}>
                <p>Name: <code>{state.data.name}</code></p>
                <p>Version: <code>{state.data.versionId}</code></p>
                <p>
                  DAO Address: <code>{state.data.daoAddress}</code>
                  <a
                    href={`${getExplorerUrl(chainId)}/address/${state.data.daoAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    View on Explorer
                  </a>
                </p>
                <p>
                  Token Address: <code>{state.data.tokenAddress}</code>
                  <a
                    href={`${getExplorerUrl(chainId)}/address/${state.data.tokenAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    View on Explorer
                  </a>
                </p>
                <p>
                  Treasury Address: <code>{state.data.treasuryAddress}</code>
                  <a
                    href={`${getExplorerUrl(chainId)}/address/${state.data.treasuryAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    View on Explorer
                  </a>
                </p>
                <p>
                  Staking Address: <code>{state.data.stakingAddress}</code>
                  <a
                    href={`${getExplorerUrl(chainId)}/address/${state.data.stakingAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    View on Explorer
                  </a>
                </p>
                <button
                  onClick={() => {
                    const text = state.data ? `DAO Name: ${state.data.name}\nVersion: ${state.data.versionId}\n\nContracts:\nDAO: ${state.data.daoAddress}\nToken: ${state.data.tokenAddress}\nTreasury: ${state.data.treasuryAddress}\nStaking: ${state.data.stakingAddress}` : '';
                    navigator.clipboard.writeText(text);
                    const button = event?.target as HTMLButtonElement;
                    const originalText = button.innerText;
                    button.innerText = 'Copied!';
                    setTimeout(() => {
                      button.innerText = originalText;
                    }, 2000);
                  }}
                  className={styles.copyButton}
                >
                  Copy All Details
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Verify;
