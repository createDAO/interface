import React, { useState } from 'react';
import { AppProps } from 'next/app';
import { WagmiProvider, createConfig, http, cookieStorage, createStorage } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { mainnet, sepolia, arbitrum, optimism, base, polygon, avalancheFuji, bsc } from 'wagmi/chains';
import { metaMask, coinbaseWallet, walletConnect, injected } from 'wagmi/connectors';
import '../styles/globals.css';

// Define chains to support
const chains = [
  mainnet,
  sepolia,
  arbitrum,
  optimism,
  base,
  polygon,
  bsc,
  avalancheFuji
];

// Create wagmi config
const config = createConfig({
  chains,
  connectors: [
    metaMask(),
    coinbaseWallet({
      appName: 'CreateDAO',
    }),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
    }),
    injected({
      name: 'Browser Wallet',
      shimDisconnect: true,
    }),
  ],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [mainnet.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ? 
      `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}` : 
      'https://eth-mainnet.public.blastapi.io'),
    [sepolia.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ? 
      `https://eth-sepolia.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}` : 
      'https://eth-sepolia.public.blastapi.io'),
    [arbitrum.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ? 
      `https://arb-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}` : 
      'https://arbitrum-one.public.blastapi.io'),
    [optimism.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ? 
      `https://opt-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}` : 
      'https://optimism.publicnode.com'),
    [base.id]: http('https://mainnet.base.org'),
    [polygon.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ? 
      `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}` : 
      'https://polygon.llamarpc.com'),
    [bsc.id]: http('https://bsc-dataseed.binance.org'),
    [avalancheFuji.id]: http('https://api.avax-test.network/ext/bc/C/rpc'),
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <Component {...pageProps} />
      </WagmiProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
