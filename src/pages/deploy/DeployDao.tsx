import React, { useState } from 'react'
import { useChainId, useSwitchChain, useAccount } from 'wagmi'
import { useDaoDeployment } from '@hooks/useDaoDeployment'
import { DAOFormData } from '../../types/dao'
import { SUPPORTED_NETWORKS } from '@config/networks'
import { TransactionStatus } from '@components/TransactionStatus'
import { NetworkSelect } from '@components/NetworkSelect'
import { VersionSelect } from '@components/VersionSelect'
import { getCurrentVersion } from '@config/dao'
import styles from './DeployDao.module.css'
import { ConnectWallet } from '@components/ConnectWallet'
import { WalletButton } from '@components/WalletButton/WalletButton'

function DeployDao() {
  const [showWalletPopup, setShowWalletPopup] = useState(false)
  const { address } = useAccount()
  const chainId = useChainId()
  const { switchChain } = useSwitchChain()
  const { deploy, state: txState, deploymentData } = useDaoDeployment()

  const [selectedVersion, setSelectedVersion] = useState(getCurrentVersion().id)
  const [formData, setFormData] = useState<DAOFormData>({
    daoName: '',
    tokenName: '',
    symbol: '',
    totalSupply: '',
  })

  const [errors, setErrors] = useState<Partial<DAOFormData>>({})

  const validateForm = (): boolean => {
    const newErrors: Partial<DAOFormData> = {}

    if (!formData.daoName) {
      newErrors.daoName = 'DAO name is required'
    }

    if (!formData.tokenName) {
      newErrors.tokenName = 'Token name is required'
    }

    if (!formData.symbol) {
      newErrors.symbol = 'Symbol is required'
    } else if (formData.symbol.length > 6) {
      newErrors.symbol = 'Symbol must be 6 characters or less'
    }

    if (!formData.totalSupply) {
      newErrors.totalSupply = 'Total supply is required'
    } else if (isNaN(Number(formData.totalSupply)) || Number(formData.totalSupply) <= 0) {
      newErrors.totalSupply = 'Total supply must be a positive number'
    } else if (Number(formData.totalSupply) >= 999999999999) {
      newErrors.totalSupply = 'Total supply must be less than 999,999,999,999'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name as keyof DAOFormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      await deploy({ ...formData, versionId: selectedVersion })
    } catch (error) {
      console.error('Deployment error:', error)
    }
  }

  const isWrongNetwork = chainId && !SUPPORTED_NETWORKS.find(n => n.id === chainId)

  if (isWrongNetwork) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>Wrong Network</h2>
          <p className={styles.description}>
            Please switch to a supported network to create your DAO
          </p>
          <div className={styles.networkButtons}>
            {SUPPORTED_NETWORKS.map((network) => (
              <button
                key={network.id}
                onClick={() => switchChain?.({ chainId: network.id })}
                className={styles.networkButton}
              >
                Switch to {network.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {showWalletPopup && (
        <div className={styles.walletOverlay} onClick={() => setShowWalletPopup(false)}>
          <div className={styles.walletPopup} onClick={e => e.stopPropagation()}>
            <h2>Connect Your Wallet</h2>
            <p>Please connect your wallet to create a DAO</p>
            <ConnectWallet onClose={() => setShowWalletPopup(false)} />
          </div>
        </div>
      )}
      <div className={styles.card}>
        <div className={styles.walletSection}>
          {address ? (
            <WalletButton />
          ) : (
            <button 
              onClick={() => setShowWalletPopup(true)}
              className={styles.connectButton}
            >
              Connect Wallet
            </button>
          )}
        </div>

        <h1 className={styles.title}>Create DAO</h1>
        <p className={styles.description}>
          Create your DAO with a governance token
        </p>

        <div className={styles.selectors}>
          <div className={styles.formGroup}>
            <label htmlFor="network" className={styles.label}>Network</label>
            <NetworkSelect />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="version" className={styles.label}>Version</label>
            <VersionSelect 
              value={selectedVersion}
              onChange={setSelectedVersion}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="daoName" className={styles.label}>DAO Name</label>
            <input
              id="daoName"
              name="daoName"
              type="text"
              value={formData.daoName}
              onChange={handleInputChange}
              placeholder="e.g., My Awesome DAO"
              className={styles.input}
            />
            {errors.daoName && <span className={styles.error}>{errors.daoName}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tokenName" className={styles.label}>Token Name</label>
            <input
              id="tokenName"
              name="tokenName"
              type="text"
              value={formData.tokenName}
              onChange={handleInputChange}
              placeholder="e.g., My DAO Token"
              className={styles.input}
            />
            {errors.tokenName && <span className={styles.error}>{errors.tokenName}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="symbol" className={styles.label}>Token Symbol</label>
            <input
              id="symbol"
              name="symbol"
              type="text"
              value={formData.symbol}
              onChange={handleInputChange}
              placeholder="e.g., MDT"
              className={styles.input}
            />
            {errors.symbol && <span className={styles.error}>{errors.symbol}</span>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="totalSupply" className={styles.label}>Total Supply</label>
            <input
              id="totalSupply"
              name="totalSupply"
              type="text"
              value={formData.totalSupply}
              onChange={handleInputChange}
              placeholder="e.g., 1000000"
              className={styles.input}
            />
            {errors.totalSupply && <span className={styles.error}>{errors.totalSupply}</span>}
          </div>

          <button
            type="submit"
            disabled={!txState.isIdle || !address}
            className={styles.submitButton}
          >
            Create DAO
          </button>
        </form>

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
        />

        {deploymentData && txState.isSuccess && (
          <div className={styles.success}>
            <h3>DAO Deployed Successfully!</h3>
            <div className={styles.deploymentInfo}>
              <h4>Deployment Details</h4>
              <div className={styles.addresses}>
                <p>Version: <code>{deploymentData.versionId}</code></p>
                <p>DAO Address: <code>{deploymentData.daoAddress}</code></p>
                <p>Token Address: <code>{deploymentData.tokenAddress}</code></p>
                <p>Treasury Address: <code>{deploymentData.treasuryAddress}</code></p>
                <p>Staking Address: <code>{deploymentData.stakingAddress}</code></p>
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
                  className={styles.copyButton}
                >
                  Copy All (Important)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DeployDao;
