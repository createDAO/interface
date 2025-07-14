import React, { useState, useEffect } from 'react';
import { AppProps } from 'next/app';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { appWithTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import wagmiConfig from '../config/wagmi';
import ErrorBoundaryWrapper from '../components/ui/ErrorBoundaryWrapper';
import nextI18NextConfig from '../../next-i18next.config.js';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
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

  // Handle hydration mismatch by ensuring the component only renders fully on the client
  const content = (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <ErrorBoundaryWrapper>
          <Component {...pageProps} key={router.locale} />
        </ErrorBoundaryWrapper>
      </WagmiProvider>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );

  // Only render the full app after client-side hydration is complete
  return mounted ? content : (
    <div style={{ visibility: 'hidden' }}>
      {content}
    </div>
  );
}

export default appWithTranslation(MyApp, nextI18NextConfig);
