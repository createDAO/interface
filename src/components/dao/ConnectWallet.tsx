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
import nyknycIcon from '../../assets/wallets/nyknyc-icon.svg';

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
      case 'NYKNYC': return nyknycIcon.src;
      case 'NYKNYC Wallet': return nyknycIcon.src;
      default: return browserWalletDark.src;
    }
  };

  // Find NYKNYC connector
  const nyknycConnector = connectors.find(c => 
    c.name === 'NYKNYC' || c.name === 'NYKNYC Wallet' || c.id === 'nyknyc'
  );
  
  // All other wallet connectors
  const otherWalletConnectors = connectors.filter(c => 
    c.name !== 'NYKNYC' && c.name !== 'NYKNYC Wallet' && c.id !== 'nyknyc'
  );


  return (
    <div className="p-3 max-w-md mx-auto">
      {/* Header */}
      <div className="mb-4 text-center">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Connect Your Wallet</h2>
      </div>
      
      {/* Sponsored Wallet Section - NYKNYC */}
      {nyknycConnector && (
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <div className="h-px bg-gray-200 dark:bg-gray-700 flex-grow"></div>
            <span className="px-2 text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
              Sponsored Wallet
            </span>
            <div className="h-px bg-gray-200 dark:bg-gray-700 flex-grow"></div>
          </div>
          
          <button
            onClick={() => handleConnect(nyknycConnector)}
            disabled={!connectorStates[nyknycConnector.uid] || connecting === nyknycConnector.uid}
            className={`w-full relative overflow-hidden rounded-lg border transition-all duration-200 transform hover:scale-[1.02] ${
              connecting === nyknycConnector.uid
                ? 'bg-gradient-to-r from-blue-400 to-cyan-400 dark:from-blue-500 dark:to-cyan-500 border-transparent shadow-lg'
                : 'bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600 hover:from-blue-600 hover:to-cyan-600 dark:hover:from-blue-500 dark:hover:to-cyan-500 border-transparent shadow-md hover:shadow-lg'
            }`}
          >
            {/* Sponsored Badge */}
            <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-2 py-0.5 rounded-full">
              <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wide">
                Sponsored
              </span>
            </div>
            
            <div className="py-3 px-4">
              <div className="flex items-center mb-2">
                <div className="mr-3 bg-white rounded-lg p-1.5 shadow-sm">
                  <Image
                    src={getWalletIcon(nyknycConnector.name)}
                    alt={nyknycConnector.name}
                    width={24}
                    height={24}
                    className="h-6 w-6"
                  />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-bold text-white text-base">
                    {nyknycConnector.name}
                  </div>
                  <div className="text-xs text-white/90 font-medium">
                    Free DAO Deployment
                  </div>
                </div>
                {connecting === nyknycConnector.uid && (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full ml-2"></div>
                )}
              </div>
              <div className="text-xs text-white/80 mt-1">
                Sponsored by CreateDAO - No transaction fees required
              </div>
            </div>
          </button>
        </div>
      )}
      
      {/* Other Wallets Section */}
      {otherWalletConnectors.length > 0 && (
        <div>
          <div className="flex items-center mb-3">
            <div className="h-px bg-gray-200 dark:bg-gray-700 flex-grow"></div>
            <span className="px-2 text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
              Other Wallets
            </span>
            <div className="h-px bg-gray-200 dark:bg-gray-700 flex-grow"></div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {otherWalletConnectors.map((connector) => (
              <button
                key={connector.uid}
                onClick={() => handleConnect(connector)}
                disabled={!connectorStates[connector.uid] || connecting === connector.uid}
                className={`flex items-center py-2.5 px-3 rounded-lg border transition-all duration-200 transform hover:scale-[1.02] ${
                  connecting === connector.uid
                    ? 'bg-gray-100 dark:bg-gray-800 border-blue-500 dark:border-cyan-400 shadow-md'
                    : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-cyan-500 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center flex-1 min-w-0">
                  <div className="mr-2 bg-gray-50 dark:bg-gray-800 p-1 rounded-md flex-shrink-0">
                    <Image
                      src={getWalletIcon(connector.name)}
                      alt={connector.name}
                      width={16}
                      height={16}
                      className="h-4 w-4"
                    />
                  </div>
                  <span className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                    {connector.name}
                  </span>
                </div>
                {connecting === connector.uid && (
                  <div className="animate-spin h-3.5 w-3.5 border-2 border-blue-500 dark:border-cyan-400 border-t-transparent rounded-full ml-2 flex-shrink-0"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

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
