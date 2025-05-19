import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import nextI18NextConfig from '../../next-i18next.config.js';
import Layout from '../components/layout/Layout';
import { getAllDAOs, getDAOsByNetwork, DAORecord } from '../services/firebase/dao';
import { SUPPORTED_NETWORKS, getExplorerUrl } from '../config/networks';

// Page size constant
const PAGE_SIZE = 10;

const DAOsPage: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation(['common', 'navigation', 'daos']);
  const { page: pageParam, network: networkParam } = router.query;
  
  // Parse query parameters
  const currentPage = Number(pageParam) || 1;
  const filterNetwork = networkParam ? Number(networkParam) : null;
  
  // State for loading indicator
  const [isPageTransitioning, setIsPageTransitioning] = useState(false);
  
  // Listen for route changes to show/hide loading state
  useEffect(() => {
    const handleStart = () => setIsPageTransitioning(true);
    const handleComplete = () => setIsPageTransitioning(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  // Helper function to deserialize Timestamps on the client
  const deserializeDaoData = (dao: DAORecord): DAORecord => {
    if (!dao) return dao;
    return {
      ...dao,
      timestamp: dao.timestamp,
      createdAt: dao.createdAt,
      updatedAt: dao.updatedAt,
    } as DAORecord;
  };

  // Fetch DAOs with React Query
  const { data, error, isLoading } = useQuery({
    queryKey: ['daos', filterNetwork, currentPage],
    queryFn: async () => {
      const offset = (currentPage - 1) * PAGE_SIZE;
      let result;
      
      if (filterNetwork !== null) {
        result = await getDAOsByNetwork(filterNetwork, PAGE_SIZE, offset);
      } else {
        result = await getAllDAOs(PAGE_SIZE, offset);
      }
      
      return {
        daos: result.data.map(deserializeDaoData),
        totalCount: result.totalCount
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
  
  // Extract data from query result
  const daos = data?.daos || [];
  const totalCount = data?.totalCount || 0;

  // Handle page change using router
  const handlePageChange = useCallback((page: number) => {
    const query: { page: string; network?: string } = { ...router.query, page: String(page) };
    
    if (filterNetwork !== null) {
      query.network = String(filterNetwork);
    } else {
      delete query.network;
    }
    
    router.push({ pathname: router.pathname, query }, undefined, { shallow: true });
  }, [router, filterNetwork]);

  // Handle network filter change using router
  const handleFilterChange = useCallback((network: number | null) => {
    const query: { page: string; network?: string } = { page: '1' }; // Reset to page 1 on filter change
    
    if (network !== null) {
      query.network = String(network);
    }
    
    router.push({ pathname: router.pathname, query }, undefined, { shallow: true });
  }, [router]);

  // Calculate total pages
  const totalPages = useMemo(() => Math.ceil(totalCount / PAGE_SIZE), [totalCount]);

  // Generate pagination range
  const paginationRange = useMemo(() => {
    const range = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      // Always show first page
      range.push(1);

      // Calculate start and end of visible range
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Adjust range to always show 3 pages in the middle
      if (start === 2) end = Math.min(totalPages - 1, start + 2);
      if (end === totalPages - 1) start = Math.max(2, end - 2);

      // Add ellipsis if needed
      if (start > 2) range.push('...');

      // Add middle pages
      for (let i = start; i <= end; i++) {
        range.push(i);
      }

      // Add ellipsis if needed
      if (end < totalPages - 1) range.push('...');

      // Always show last page
      range.push(totalPages);
    }

    return range;
  }, [currentPage, totalPages]);

  // Format date from Firestore timestamp
  // Define a type for Firestore timestamp
  interface FirestoreTimestamp {
    toDate?: () => Date;
    seconds?: number;
    nanoseconds?: number;
  }
  
  const formatDate = (timestamp: FirestoreTimestamp | Date | number | null) => {
    if (!timestamp) return t('daos:dates.unknown');

    try {
      // Convert Firestore timestamp to JS Date
      let date: Date;
      
      if (timestamp instanceof Date) {
        date = timestamp;
      } else if (typeof timestamp === 'number') {
        date = new Date(timestamp);
      } else if (timestamp && typeof timestamp === 'object') {
        if ('toDate' in timestamp && typeof timestamp.toDate === 'function') {
          // Standard Firestore timestamp with toDate method
          date = timestamp.toDate();
        } else if ('seconds' in timestamp && 'nanoseconds' in timestamp) {
          // Firestore timestamp serialized as object with seconds and nanoseconds
          const seconds = Number(timestamp.seconds);
          const nanoseconds = Number(timestamp.nanoseconds) / 1000000; // Convert to milliseconds
          date = new Date(seconds * 1000 + nanoseconds);
        } else {
          // Fallback for any other case
          date = new Date();
          console.warn('Unknown timestamp format:', timestamp);
        }
      } else {
        // Fallback for any other case
        date = new Date();
        console.warn('Unknown timestamp format:', timestamp);
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      console.error('Error formatting date:', err);
      return t('daos:dates.invalid');
    }
  };

  // Get network name from ID
  const getNetworkName = (networkId: number) => {
    const network = SUPPORTED_NETWORKS.find(n => n.id === networkId);
    return network ? network.name : `Network ${networkId}`;
  };

  // Get network icon from ID
  const getNetworkIcon = (networkId: number) => {
    const network = SUPPORTED_NETWORKS.find(n => n.id === networkId);
    return network?.icon;
  };

  // Format address for display (truncate)
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <Layout>
      <Head>
        <title>{t('daos:meta.title')}</title>
        <meta name="description" content={t('daos:meta.description')} />
      </Head>

      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Page transition loading indicator */}
        {isPageTransitioning && (
          <div className="fixed inset-0 bg-white/70 dark:bg-gray-900/70 flex items-center justify-center z-50">
            <div className="animate-spin h-12 w-12 border-4 border-primary-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      
        {/* Display error if present */}
        {error && (
           <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
             <p className="text-red-700 dark:text-red-400">{error instanceof Error ? error.message : t('daos:errors.loadFailed')}</p>
           </div>
         )}

        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('daos:header.title')}</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {t('daos:header.subtitle')}
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <label htmlFor="network-filter" className="sr-only">{t('daos:filters.network.label')}</label>
            <select
              id="network-filter"
              value={filterNetwork || ''}
              onChange={(e) => {
                // Stop propagation and prevent default
                e.stopPropagation();
                e.preventDefault();

                // Get the selected value
                const value = e.target.value ? Number(e.target.value) : null;
                // Use the new handler
                handleFilterChange(value);
              }}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">{t('daos:filters.network.all')}</option>
              {SUPPORTED_NETWORKS.map((network) => (
                <option 
                  key={network.id} 
                  value={network.id}
                  disabled={network.isAvailable === false}
                  className={network.isAvailable === false ? "text-gray-400 italic" : ""}
                >
                  {network.name} {network.isAvailable === false ? t('daos:filters.network.comingSoon') : ""}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Show loading state */}
        {isLoading ? (
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">{t('daos:status.loading')}</p>
          </div>
        ) : totalCount === 0 && !error ? (
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('daos:status.noResults.title')}</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
                {filterNetwork
                  ? t('daos:status.noResults.specificNetwork', { network: getNetworkName(filterNetwork) })
                  : t('daos:status.noResults.allNetworks')}
            </p>
            <div className="mt-6">
              <Link href="/create" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                {t('daos:actions.createDao')}
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('daos:table.headers.name')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('daos:table.headers.network')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('daos:table.headers.token')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('daos:table.headers.address')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('daos:table.headers.created')}
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('daos:table.headers.actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {daos.map((dao) => (
                    <tr key={dao.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {dao.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {t('daos:table.content.version')}: {dao.versionId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getNetworkIcon(dao.networkId) && (
                            <div className="relative">
                              <Image
                                src={getNetworkIcon(dao.networkId) || '/images/networks/ethereum.png'} 
                                alt={dao.networkName}
                                width={20}
                                height={20}
                                className={`mr-2 ${
                                  SUPPORTED_NETWORKS.find(n => n.id === dao.networkId)?.isAvailable === false 
                                    ? "opacity-50" 
                                    : ""
                                }`}
                              />
                              {SUPPORTED_NETWORKS.find(n => n.id === dao.networkId)?.isAvailable === false && (
                                <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full w-3 h-3 flex items-center justify-center">
                                  <span className="text-white text-xs">!</span>
                                </div>
                              )}
                            </div>
                          )}
                          <span className={`text-sm ${
                            SUPPORTED_NETWORKS.find(n => n.id === dao.networkId)?.isAvailable === false
                              ? "text-gray-500 dark:text-gray-400"
                              : "text-gray-900 dark:text-white"
                          }`}>
                            {dao.networkName}
                            {SUPPORTED_NETWORKS.find(n => n.id === dao.networkId)?.isAvailable === false && (
                              <span className="ml-1 text-xs text-yellow-600 dark:text-yellow-400">(Coming Soon)</span>
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {dao.symbol}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {dao.tokenName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white font-mono">
                          {formatAddress(dao.daoAddress)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {t('daos:table.content.creator')}: {formatAddress(dao.creatorAddress)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(dao.timestamp)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <a
                          href={`${getExplorerUrl(dao.networkId)}/address/${dao.daoAddress}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300 mr-4"
                        >
                          {t('daos:actions.viewExplorer')}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination controls */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t('daos:pagination.previous')}
                    </button>
                    <button
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('daos:pagination.next')}
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {t('daos:pagination.showing')} <span className="font-medium">{Math.min((currentPage - 1) * PAGE_SIZE + 1, totalCount)}</span> {t('daos:pagination.to')}{' '}
                      <span className="font-medium">{Math.min(currentPage * PAGE_SIZE, totalCount)}</span> {t('daos:pagination.of')}{' '}
                      <span className="font-medium">{totalCount}</span> {t('daos:pagination.results')}
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <span className="sr-only cursor-pointer">{t('daos:pagination.previous')}</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>

                      {paginationRange.map((page, index) => (
                        page === '...' ? (
                          <span
                            key={`ellipsis-${index}`}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            ...
                          </span>
                        ) : (
                          <button
                            key={`page-${page}`}
                            onClick={() => handlePageChange(page as number)}
                            aria-current={currentPage === page ? 'page' : undefined}
                            className={`relative inline-flex items-center px-4 py-2 border cursor-pointer ${currentPage === page
                                ? 'z-10 bg-primary-50 dark:bg-primary-900 border-primary-500 dark:border-primary-500 text-primary-600 dark:text-primary-300'
                                : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                              } text-sm font-medium`}
                          >
                            {page}
                          </button>
                        )
                      ))}

                      <button
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="sr-only">{t('daos:pagination.next')}</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', [
        'common',
        'navigation',
        'daos'
      ], nextI18NextConfig)),
    },
  };
};

export default DAOsPage;
