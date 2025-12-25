import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'next-i18next';
import { useConnect, useAccount, useConnection, Connector } from 'wagmi';
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

// ============================================================================
// Types
// ============================================================================

interface ConnectWalletProps {
  onClose?: () => void;
}

interface SponsoredWalletConfig {
  id: string;
  names: string[];
  description: string;
  benefit: string;
}

interface WalletCardProps {
  connector: Connector;
  isConnecting: boolean;
  isAvailable: boolean;
  onConnect: (connector: Connector) => void;
  variant: 'sponsored' | 'default';
  sponsorInfo?: { description: string; benefit: string };
  sponsoredBadgeLabel?: string;
}

// ============================================================================
// Constants
// ============================================================================

const SPONSORED_WALLETS: SponsoredWalletConfig[] = [
  {
    id: 'nyknyc',
    names: ['NYKNYC', 'NYKNYC Wallet'],
    description: 'Free DAO Deployment',
    benefit: 'Sponsored by CreateDAO',
  },
];

const WALLET_ICONS: Record<string, string> = {
  'MetaMask': metamaskIcon.src,
  'WalletConnect': walletconnectIcon.src,
  'Coinbase Wallet': coinbaseIcon.src,
  'Brave Wallet': braveIcon.src,
  'Ledger': ledgerIcon.src,
  'Rabby Wallet': rabbyIcon.src,
  'OKX Wallet': okxIcon.src,
  'Trust Wallet': trustwalletIcon.src,
  'NYKNYC': nyknycIcon.src,
  'NYKNYC Wallet': nyknycIcon.src,
};

// ============================================================================
// Helper Functions
// ============================================================================

const getWalletIcon = (connectorName: string): string => {
  return WALLET_ICONS[connectorName] || browserWalletDark.src;
};

const isSponsoredWallet = (connector: Connector): SponsoredWalletConfig | undefined => {
  return SPONSORED_WALLETS.find(
    (w) => w.names.includes(connector.name) || w.id === connector.id
  );
};

// ============================================================================
// Components
// ============================================================================

const SectionDivider: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center mb-3">
    <div className="h-px bg-gray-200 dark:bg-gray-700 flex-grow"></div>
    <span className="px-3 text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
      {label}
    </span>
    <div className="h-px bg-gray-200 dark:bg-gray-700 flex-grow"></div>
  </div>
);

const LoadingSpinner: React.FC<{ size?: 'sm' | 'md'; variant?: 'sponsored' | 'default' }> = ({
  size = 'sm',
  variant = 'default'
}) => {
  const sizeClasses = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const colorClasses = variant === 'sponsored'
    ? 'border-emerald-500 dark:border-emerald-400'
    : 'border-blue-500 dark:border-cyan-400';

  return (
    <div className={`animate-spin ${sizeClasses} border-2 ${colorClasses} border-t-transparent rounded-full ml-2 flex-shrink-0`} />
  );
};

const SponsoredBadge: React.FC<{ label: string }> = ({ label }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
    <svg className="w-2.5 h-2.5 mr-1" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
    {label}
  </span>
);

const WalletCard: React.FC<WalletCardProps> = ({
  connector,
  isConnecting,
  isAvailable,
  onConnect,
  variant,
  sponsorInfo,
  sponsoredBadgeLabel,
}) => {
  const isSponsored = variant === 'sponsored';

  const baseStyles = `
    flex items-center w-full rounded-xl border transition-all duration-200 
    disabled:opacity-50 disabled:cursor-not-allowed
    hover:shadow-md hover:scale-[1.01] active:scale-[0.99]
  `;

  const variantStyles = isSponsored
    ? `
        py-3 px-4
        bg-gradient-to-r from-white to-emerald-50/50 
        dark:from-gray-900 dark:to-emerald-950/20
        border-emerald-200 dark:border-emerald-800/60
        hover:border-emerald-300 dark:hover:border-emerald-700
        ${isConnecting ? 'ring-2 ring-emerald-400/50 dark:ring-emerald-500/30' : ''}
      `
    : `
        py-2.5 px-3
        bg-white dark:bg-gray-900 
        border-gray-200 dark:border-gray-700
        hover:border-blue-400 dark:hover:border-cyan-500
        ${isConnecting ? 'ring-2 ring-blue-400/50 dark:ring-cyan-500/30' : ''}
      `;

  const iconContainerStyles = isSponsored
    ? 'bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700'
    : 'bg-gray-50 dark:bg-gray-800 p-1.5 rounded-lg';

  const iconSize = isSponsored ? 24 : 18;

  return (
    <button
      onClick={() => onConnect(connector)}
      disabled={!isAvailable || isConnecting}
      className={`${baseStyles} ${variantStyles}`}
    >
      <div className={`${iconContainerStyles} flex-shrink-0`}>
        <Image
          src={getWalletIcon(connector.name)}
          alt={connector.name}
          width={iconSize}
          height={iconSize}
          className={isSponsored ? 'h-6 w-6' : 'h-[18px] w-[18px]'}
        />
      </div>

      <div className={`flex-1 min-w-0 ${isSponsored ? 'ml-3' : 'ml-2'} text-left`}>
        <div className="flex items-center gap-2">
          <span className={`font-semibold text-gray-900 dark:text-gray-100 truncate ${isSponsored ? 'text-base' : 'text-sm'}`}>
            {connector.name}
          </span>
          {isSponsored && sponsoredBadgeLabel && (
            <SponsoredBadge label={sponsoredBadgeLabel} />
          )}
        </div>

        {isSponsored && sponsorInfo && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
            {sponsorInfo.description} • {sponsorInfo.benefit}
          </p>
        )}
      </div>

      {isConnecting && <LoadingSpinner size={isSponsored ? 'md' : 'sm'} variant={variant} />}
    </button>
  );
};

const ErrorMessage: React.FC<{ message: string; prefixLabel: string }> = ({ message, prefixLabel }) => (
  <div className="mt-3 p-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-xs">
    <div className="flex items-center">
      <svg className="h-3.5 w-3.5 mr-1.5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="font-medium">{prefixLabel}</span>
      <span className="ml-1 truncate">{message}</span>
    </div>
  </div>
);

// ============================================================================
// Main Component
// ============================================================================

export function ConnectWallet({ onClose }: ConnectWalletProps) {
  const { t } = useTranslation('create');
  const connection = useConnection();
  const { connect, connectors, error } = useConnect();
  const { isConnected } = useAccount();
  const [connectorStates, setConnectorStates] = useState<Record<string, boolean>>({});
  const [connecting, setConnecting] = useState<string | null>(null);

  const isPendingConnection =
    connection.status === 'connecting' || connection.status === 'reconnecting';

  // Close modal on successful connection
  useEffect(() => {
    if (isConnected && onClose) {
      onClose();
    }
  }, [isConnected, onClose]);

  // Check connector availability
  useEffect(() => {
    connectors.forEach(async (connector) => {
      try {
        const provider = await connector.getProvider();
        setConnectorStates((prev) => ({ ...prev, [connector.uid]: !!provider }));
      } catch {
        setConnectorStates((prev) => ({ ...prev, [connector.uid]: false }));
      }
    });
  }, [connectors]);

  // Clear connecting state on connection result
  useEffect(() => {
    if (isConnected || error) {
      setConnecting(null);
    }
  }, [isConnected, error]);

  const handleConnect = useCallback(
    async (connector: Connector) => {
      // Protect against races while Wagmi is reconnecting/connecting.
      // If we call connect() in these states, Wagmi can throw
      // "connector already connected".
      if (isPendingConnection || connection.status !== 'disconnected') return;
      if (connecting) return;

      setConnecting(connector.uid);
      try {
        await connect({ connector });
      } catch (err) {
        console.error('Connection error:', err);
      }
    },
    [isPendingConnection, connection.status, connecting, connect],
  );

  // Separate sponsored and regular wallets
  const sponsoredBadgeLabel = t('connectWallet.sponsoredBadge');
  const errorPrefixLabel = t('connectWallet.errorPrefix');

  const { sponsoredConnectors, regularConnectors } = useMemo(() => {
    const sponsored: Array<{ connector: Connector; config: SponsoredWalletConfig }> = [];
    const regular: Connector[] = [];

    connectors.forEach((connector) => {
      const sponsorConfig = isSponsoredWallet(connector);
      if (sponsorConfig) {
        sponsored.push({ connector, config: sponsorConfig });
      } else {
        regular.push(connector);
      }
    });

    return { sponsoredConnectors: sponsored, regularConnectors: regular };
  }, [connectors]);


  return (
    <div className="p-4 max-w-md mx-auto">
      {/* Header */}
      <div className="mb-5 text-center">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          {t('connectWallet.title')}
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {t('connectWallet.subtitle')}
        </p>
      </div>

      {/* Sponsored Wallets Section */}
      {sponsoredConnectors.length > 0 && (
        <div className="mb-5">
          <SectionDivider
            label={
              sponsoredConnectors.length === 1
                ? t('connectWallet.sections.sponsored.one')
                : t('connectWallet.sections.sponsored.many')
            }
          />

          <div className="space-y-2">
            {sponsoredConnectors.map(({ connector, config }) => (
              <WalletCard
                key={connector.uid}
                connector={connector}
                isConnecting={connecting === connector.uid}
                isAvailable={
                  !!connectorStates[connector.uid] && connection.status === 'disconnected'
                }
                onConnect={handleConnect}
                variant="sponsored"
                sponsorInfo={{
                  description: config.description,
                  benefit: config.benefit,
                }}
                sponsoredBadgeLabel={sponsoredBadgeLabel}
              />
            ))}
          </div>
        </div>
      )}

      {/* Other Wallets Section */}
      {regularConnectors.length > 0 && (
        <div>
          <SectionDivider label={t('connectWallet.sections.other')} />

          <div className="grid grid-cols-2 gap-2">
            {regularConnectors.map((connector) => (
              <WalletCard
                key={connector.uid}
                connector={connector}
                isConnecting={connecting === connector.uid}
                isAvailable={
                  !!connectorStates[connector.uid] && connection.status === 'disconnected'
                }
                onConnect={handleConnect}
                variant="default"
              />
            ))}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && <ErrorMessage message={error.message} prefixLabel={errorPrefixLabel} />}
    </div>
  );
}
