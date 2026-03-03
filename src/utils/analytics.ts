import { sendGAEvent } from '@next/third-parties/google';

/**
 * Google Analytics measurement ID.
 * Hardcoded as a single source of truth for the GA tracking ID.
 */
export const GA_MEASUREMENT_ID = 'G-72BWS21HBP';

/**
 * Track a wallet connection event.
 * Fired when a user successfully connects their wallet.
 */
export function trackWalletConnected(walletName: string): void {
  sendGAEvent('event', 'wallet_connected', {
    wallet_name: walletName,
  });
}

/**
 * Track a DAO creation event.
 * Fired when a DAO is successfully deployed on-chain.
 */
export function trackDaoCreated(params: {
  daoName: string;
  network: string;
  chainId: number;
}): void {
  sendGAEvent('event', 'dao_created', {
    dao_name: params.daoName,
    network: params.network,
    chain_id: params.chainId,
  });
}
