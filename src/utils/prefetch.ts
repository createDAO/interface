import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { QueryClient } from '@tanstack/react-query';

/**
 * Prefetch pages for faster navigation
 * @param paths Array of paths to prefetch
 */
export function usePrefetchPages(paths: string[]) {
  const router = useRouter();

  useEffect(() => {
    // Prefetch immediately without delay
    paths.forEach(path => {
      router.prefetch(path);
    });
  }, [router, paths]);
}

/**
 * Prefetch data for a specific page
 * @param queryKey The React Query key to prefetch
 * @param queryFn The function to fetch the data
 * @param queryClient The React Query client
 */
export function prefetchPageData<TData>(queryKey: unknown[], queryFn: () => Promise<TData>, queryClient: QueryClient) {
  return queryClient.prefetchQuery({
    queryKey,
    queryFn,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to prefetch common pages
 */
export function usePrefetchCommonPages() {
  return usePrefetchPages([
    '/',
    '/create',
    '/daos',
    '/dao-features',
  ]);
}
