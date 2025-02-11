import { useState, useRef, useEffect } from 'react';
import { useAccount, useDisconnect } from 'wagmi';
import styles from './WalletButton.module.css';

export function WalletButton() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const formatAddress = (addr: string) => {
     return `${addr.slice(0, 8)}...${addr.slice(-8)}`;
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!address) return null;

  return (
    <div className={styles.walletButtonContainer} ref={dropdownRef}>
      <button
        className={styles.walletButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Wallet options"
      >
        <span className={styles.dot} />
        {formatAddress(address)}
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.addressFull}>
            <span>Connected wallet</span>
            <code>{address}</code>
          </div>
          <button
            onClick={() => {
              disconnect();
              setIsOpen(false);
            }}
            className={styles.disconnectButton}
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
