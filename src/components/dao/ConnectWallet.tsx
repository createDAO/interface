import React, { useState, useEffect } from 'react';
import { useConnect, useAccount } from 'wagmi';

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

  // Wallet icons mapping
  const getWalletIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'metamask':
        return (
          <svg className="h-6 w-6" viewBox="0 0 35 33" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32.9582 1L19.8241 10.7183L22.2665 5.09082L32.9582 1Z" fill="#E17726" stroke="#E17726" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2.04858 1L15.0707 10.809L12.7423 5.09082L2.04858 1Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M28.2295 23.5334L24.7348 28.8961L32.2695 30.9312L34.3982 23.6501L28.2295 23.5334Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M0.617676 23.6501L2.73438 30.9312L10.2571 28.8961L6.77443 23.5334L0.617676 23.6501Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9.86285 14.6033L7.77734 17.7496L15.2322 18.0952L14.9999 10.0186L9.86285 14.6033Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M25.1371 14.6033L19.9281 9.92725L19.8239 18.0952L27.2668 17.7496L25.1371 14.6033Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10.2572 28.8961L14.7807 26.7357L10.9081 23.7153L10.2572 28.8961Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M20.2192 26.7357L24.7347 28.8961L24.0838 23.7153L20.2192 26.7357Z" fill="#E27625" stroke="#E27625" strokeWidth="0.25" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'walletconnect':
        return (
          <svg className="h-6 w-6" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9.58818 11.8556C13.1293 8.31442 18.8706 8.31442 22.4117 11.8556L22.8379 12.2818C23.015 12.4589 23.015 12.7459 22.8379 12.9231L21.3801 14.3809C21.2915 14.4695 21.148 14.4695 21.0594 14.3809L20.473 13.7945C18.0026 11.3241 13.9973 11.3241 11.5269 13.7945L10.8989 14.4225C10.8103 14.5111 10.6668 14.5111 10.5782 14.4225L9.12041 12.9647C8.94331 12.7876 8.94331 12.5005 9.12041 12.3234L9.58818 11.8556ZM25.4268 14.8706L26.7243 16.1682C26.9014 16.3453 26.9014 16.6323 26.7243 16.8094L20.8737 22.66C20.6966 22.8371 20.4096 22.8371 20.2325 22.66L16.1823 18.6098C16.138 18.5655 16.0663 18.5655 16.022 18.6098L11.9718 22.66C11.7947 22.8371 11.5077 22.8371 11.3306 22.66L5.47565 16.8052C5.29855 16.6281 5.29855 16.341 5.47565 16.1639L6.77318 14.8664C6.95028 14.6893 7.23731 14.6893 7.41441 14.8664L11.4688 18.9208C11.5131 18.9651 11.5848 18.9651 11.6291 18.9208L15.6793 14.8706C15.8564 14.6935 16.1435 14.6935 16.3206 14.8706L20.3708 18.9208C20.4151 18.9651 20.4868 18.9651 20.5311 18.9208L24.5855 14.8664C24.7668 14.6893 25.0497 14.6893 25.2268 14.8664V14.8706Z" fill="#3B99FC"/>
          </svg>
        );
      case 'coinbase wallet':
        return (
          <svg className="h-6 w-6" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="28" height="28" fill="#0052FF"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M14 23.8C19.4124 23.8 23.8 19.4124 23.8 14C23.8 8.58761 19.4124 4.2 14 4.2C8.58761 4.2 4.2 8.58761 4.2 14C4.2 19.4124 8.58761 23.8 14 23.8ZM11.55 10.8C11.1358 10.8 10.8 11.1358 10.8 11.55V16.45C10.8 16.8642 11.1358 17.2 11.55 17.2H16.45C16.8642 17.2 17.2 16.8642 17.2 16.45V11.55C17.2 11.1358 16.8642 10.8 16.45 10.8H11.55Z" fill="white"/>
          </svg>
        );
      default:
        return (
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2"/>
            <path d="M15.5 9.5L11.5 13.5L8.5 10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
    }
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 gap-3">
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => handleConnect(connector)}
            disabled={!connectorStates[connector.uid] || connecting === connector.uid}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              connecting === connector.uid 
                ? 'bg-gray-100 dark:bg-gray-800 border-primary-500 dark:border-primary-400' 
                : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-400'
            } transition-colors duration-200`}
          >
            <div className="flex items-center">
              <div className="mr-3">
                {getWalletIcon(connector.name)}
              </div>
              <span className="font-medium">{connector.name}</span>
            </div>
            {connecting === connector.uid && (
              <div className="animate-spin h-5 w-5 border-2 border-primary-500 border-t-transparent rounded-full"></div>
            )}
          </button>
        ))}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
          {error.message}
        </div>
      )}
    </div>
  );
}
