import React, { useState, useEffect } from 'react';
import type { AppProps } from 'next/app';
import { WagmiProvider, cookieToInitialState, type State } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { appWithTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { getWagmiConfig } from '../config/wagmi';
import ErrorBoundaryWrapper from '../components/ui/ErrorBoundaryWrapper';
import nextI18NextConfig from '../../next-i18next.config.js';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps & { initialWagmiState?: State }) {
  const router = useRouter();
  
  // Create wagmi config fresh on mount to ensure proper connector rehydration
  const [wagmiConfig] = useState(() => getWagmiConfig());
  
  // Get initial state from cookies for proper SSR hydration
  const [initialState] = useState(() => {
    if (typeof window !== 'undefined' && document.cookie) {
      return cookieToInitialState(wagmiConfig, document.cookie);
    }
    return pageProps.initialWagmiState;
  });
  
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 30, // 30 minutes
        refetchOnWindowFocus: false,
        retry: 1,
      },
    },
  }));
  
  // This helps ensure consistent hydration with i18n
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render until mounted to prevent double initialization of connectors
  if (!mounted) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig} initialState={initialState}>
        <ErrorBoundaryWrapper>
          <Component {...pageProps} key={router.locale} />
        </ErrorBoundaryWrapper>
      </WagmiProvider>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default appWithTranslation(MyApp, nextI18NextConfig);
