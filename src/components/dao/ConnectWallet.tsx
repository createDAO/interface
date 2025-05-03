import React, { useState, useEffect } from 'react';
import { useConnect, useAccount } from 'wagmi';
import Image from 'next/image';
import metamaskIcon from '../../assets/wallets/metamask-icon.svg';
import walletconnectIcon from '../../assets/wallets/walletconnect-icon.svg';
import coinbaseIcon from '../../assets/wallets/coinbase-icon.svg';
import browserWalletDark from '../../assets/wallets/browser-wallet-dark.svg';
import braveIcon from '../../assets/wallets/brave-icon.svg';
import ledgerIcon from '../../assets/wallets/ledger-icon.svg';
import rabbyIcon from '../../assets/wallets/rabby-icon.svg';
import trustwalletIcon from '../../assets/wallets/trustwallet-icon.svg';
import okxIcon from '../../assets/wallets/okx-icon.svg';

interface ConnectWalletProps {
  onClose?: () => void;
}

export function ConnectWallet({ onClose }: ConnectWalletProps) {
  const { connect, connectors, error } = useConnect();
  const { isConnected } = useAccount();
  const [connectorStates, setConnectorStates] = useState<Record<string, boolean>>({});
  const [connecting, setConnecting] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected && onClose) {
      onClose();
    }
  }, [isConnected, onClose]);

  useEffect(() => {
    connectors.forEach(async (connector) => {
      try {
        const provider = await connector.getProvider();
        setConnectorStates(prev => ({
          ...prev,
          [connector.uid]: !!provider
        }));
      } catch {
        setConnectorStates(prev => ({
          ...prev,
          [connector.uid]: false
        }));
      }
    });
  }, [connectors]);

  const handleConnect = async (connector: typeof connectors[number]) => {
    if (connecting) return; // Prevent multiple clicks
    setConnecting(connector.uid);
    try {
      await connect({ connector });
    } catch (error) {
      console.error('Connection error:', error);
    }
    // Don't clear connecting state immediately for WalletConnect
    // It will be cleared when connection succeeds or fails via the isConnected/error effect
    if (connector.name !== 'WalletConnect') {
      setConnecting(null);
    }
  };

  // Clear connecting state when connection succeeds or fails
  useEffect(() => {
    if (isConnected || error) {
      setConnecting(null);
    }
  }, [isConnected, error]);

  // Helper function to get wallet icon
  const getWalletIcon = (connectorName: string) => {
    switch (connectorName) {
      case 'MetaMask': return metamaskIcon.src;
      case 'WalletConnect': return walletconnectIcon.src;
      case 'Coinbase Wallet': return coinbaseIcon.src;
      case 'Brave Wallet': return braveIcon.src;
      case 'Ledger': return ledgerIcon.src;
      case 'Rabby Wallet': return rabbyIcon.src;
      case 'OKX Wallet': return okxIcon.src;
      case 'Trust Wallet': return trustwalletIcon.src;
      default: return browserWalletDark.src;
    }
  };

  // Find Coinbase Wallet connector
  const coinbaseWalletConnector = connectors.find(c => c.name === 'Coinbase Wallet');
  
  // All other wallet connectors
  const otherWalletConnectors = connectors.filter(c => c.name !== 'Coinbase Wallet');


  return (
    <div className="p-3 max-w-md mx-auto">
      {/* Header */}
      <div className="mb-3 text-center">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Connect Your Wallet</h2>
      </div>
      
      {/* "I don't have a Web3 Wallet" Section */}
      <div className="mb-3">
        <div className="flex items-center mb-2">
          <div className="h-px bg-gray-200 dark:bg-gray-700 flex-grow"></div>
          <span className="px-2 text-xs text-gray-500 dark:text-gray-400 font-medium">I don&#39;t have a Web3 Wallet</span>
          <div className="h-px bg-gray-200 dark:bg-gray-700 flex-grow"></div>
        </div>
        
        {coinbaseWalletConnector && (
          <button
            onClick={() => handleConnect(coinbaseWalletConnector)}
            disabled={!connectorStates[coinbaseWalletConnector.uid] || connecting === coinbaseWalletConnector.uid}
            className={`w-full flex items-center justify-between py-2 px-3 rounded-md border transition-all duration-200 
              ${connecting === coinbaseWalletConnector.uid
                ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-400'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-transparent'
              } transform hover:scale-[1.01] cursor-pointer`}
          >
            <div className="flex items-center">
              <div className="mr-2 bg-white p-1 rounded-full">
                <Image
                  src={getWalletIcon(coinbaseWalletConnector.name)}
                  alt={coinbaseWalletConnector.name}
                  width={16}
                  height={16}
                  className="h-4 w-4"
                />
              </div>
              <span className="font-medium text-white text-sm">{coinbaseWalletConnector.name}</span>
            </div>
            {connecting === coinbaseWalletConnector.uid && (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            )}
          </button>
        )}
      </div>
      
      {/* "I have a Web3 Wallet" Section */}
      <div>
        <div className="flex items-center mb-2">
          <div className="h-px bg-gray-200 dark:bg-gray-700 flex-grow"></div>
          <span className="px-2 text-xs text-gray-500 dark:text-gray-400 font-medium">I have a Web3 Wallet</span>
          <div className="h-px bg-gray-200 dark:bg-gray-700 flex-grow"></div>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {otherWalletConnectors.map((connector) => (
            <button
              key={connector.uid}
              onClick={() => handleConnect(connector)}
              disabled={!connectorStates[connector.uid] || connecting === connector.uid}
              className={`flex items-center justify-between py-2 px-3 rounded-md border ${connecting === connector.uid
                ? 'bg-gray-100 dark:bg-gray-800 border-primary-500 dark:border-primary-400'
                : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-400'
                } transition-all duration-200 transform hover:scale-[1.01] cursor-pointer`}
            >
              <div className="flex items-center">
                <div className="mr-2 bg-gray-100 dark:bg-gray-800 p-1 rounded-full">
                  <Image
                    src={getWalletIcon(connector.name)}
                    alt={connector.name}
                    width={16}
                    height={16}
                    className="h-4 w-4"
                  />
                </div>
                <span className="font-medium text-sm">{connector.name}</span>
              </div>
              {connecting === connector.uid && (
                <div className="animate-spin h-3 w-3 border-2 border-primary-500 border-t-transparent rounded-full ml-1"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-300 text-xs">
          <div className="flex items-center">
            <svg className="h-3 w-3 mr-1 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Error: </span>
            <span className="ml-1">{error.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
