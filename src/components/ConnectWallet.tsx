import { useConnect, useAccount } from 'wagmi'
import { useState, useEffect } from 'react'
import styles from './ConnectWallet.module.css'
import metamaskIcon from '../assets/wallets/metamask-icon.svg'
import walletconnectIcon from '../assets/wallets/walletconnect-icon.svg'
import coinbaseIcon from '../assets/wallets/coinbase-icon.svg'
import browserWalletDark from '../assets/wallets/browser-wallet-dark.svg'
import braveIcon from '../assets/wallets/brave-icon.svg'
import ledgerIcon from '../assets/wallets/ledger-icon.svg'
import rabbyIcon from '../assets/wallets/rabby-icon.svg'
import trustwalletIcon from '../assets/wallets/trustwallet-icon.svg'
import okxIcon from '../assets/wallets/okx-icon.svg'

interface ConnectWalletProps {
  onClose?: () => void;
}

export function ConnectWallet({ onClose }: ConnectWalletProps) {
  const { connect, connectors, error } = useConnect()
  const { isConnected } = useAccount()
  const [connectorStates, setConnectorStates] = useState<Record<string, boolean>>({})
  const [connecting, setConnecting] = useState<string | null>(null)
  useEffect(() => {
    if (isConnected && onClose) {
      onClose();
    }
  }, [isConnected, onClose]);

  useEffect(() => {
    connectors.forEach(async (connector) => {
      try {
        const provider = await connector.getProvider()
        setConnectorStates(prev => ({
          ...prev,
          [connector.uid]: !!provider
        }))
      } catch {
        setConnectorStates(prev => ({
          ...prev,
          [connector.uid]: false
        }))
      }
    })
  }, [connectors])

  const handleConnect = async (connector: typeof connectors[number]) => {
    if (connecting) return; // Prevent multiple clicks
    setConnecting(connector.uid)
    try {
      await connect({ connector })
    } catch (error) {
      console.error('Connection error:', error)
    }
    // Don't clear connecting state immediately for WalletConnect
    // It will be cleared when connection succeeds or fails via the isConnected/error effect
    if (connector.name !== 'WalletConnect') {
      setConnecting(null)
    }
  }

  // Clear connecting state when connection succeeds or fails
  useEffect(() => {
    if (isConnected || error) {
      setConnecting(null)
    }
  }, [isConnected, error])

  return (
    <>
      <div className={styles.buttonContainer}>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => handleConnect(connector)}
            disabled={!connectorStates[connector.uid] || connecting === connector.uid}
            className={`${styles.button} ${connecting === connector.uid ? styles.connecting : ''}`}
          >
            <img
              src={
                connector.name === 'MetaMask' ? metamaskIcon :
                  connector.name === 'WalletConnect' ? walletconnectIcon :
                    connector.name === 'Coinbase Wallet' ? coinbaseIcon :
                      connector.name === 'Brave Wallet' ? braveIcon :
                        connector.name === 'Ledger' ? ledgerIcon :
                          connector.name === 'Rabby Wallet' ? rabbyIcon :
                            connector.name === 'OKX Wallet' ? okxIcon :
                              connector.name === 'Trust Wallet' ? trustwalletIcon :
                                browserWalletDark
              }
              alt={connector.name}
              className={styles.walletIcon}
            />
            {connector.name}
            {connecting === connector.uid && ' (connecting...)'}
          </button>
        ))}
      </div>

      {error && (
        <div className={styles.error}>
          {error.message}
        </div>
      )}
    </>
  )
}
