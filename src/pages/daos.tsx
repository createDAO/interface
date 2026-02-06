import React, { useState, useMemo } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import { useTranslation } from 'next-i18next';
import { useDAOs } from 'daocafe-sdk';
import nextI18NextConfig from '../../next-i18next.config.js';
import Layout from '../components/layout/Layout';
import { getNetworkById } from '../config/networks';
import ethereumIcon from '../assets/networks/ethereum.png';

// Chain ID to name mapping for networks not in SUPPORTED_NETWORKS
const CHAIN_NAMES: Record<number, string> = {
  1: 'Ethereum',
  11155111: 'Sepolia',
  137: 'Polygon',
  42161: 'Arbitrum',
  10: 'Optimism',
  8453: 'Base',
};

// Format large numbers with decimals (for token supplies)
const formatTokenAmount = (amount: string, decimals: number = 18): string => {
  const num = BigInt(amount);
  const divisor = BigInt(10 ** decimals);
  const wholePart = num / divisor;
  return wholePart.toLocaleString();
};

// Truncate address for display
const truncateAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Format timestamp to readable date
const formatDate = (timestamp: string): string => {
  if (!timestamp) return 'Unknown';
  const date = new Date(Number(timestamp) * 1000);
  if (isNaN(date.getTime())) return 'Invalid date';
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

// Get explorer URL for a specific chain
const getChainExplorerUrl = (chainId: number): string => {
  switch (chainId) {
    case 1:
      return 'https://etherscan.io';
    case 11155111:
      return 'https://sepolia.etherscan.io';
    case 137:
      return 'https://polygonscan.com';
    case 42161:
      return 'https://arbiscan.io';
    case 10:
      return 'https://optimistic.etherscan.io';
    case 8453:
      return 'https://basescan.org';
    default:
      return 'https://etherscan.io';
  }
};

// Get chain name
const getChainName = (chainId: number): string => {
  const network = getNetworkById(chainId);
  if (network) return network.name;
  return CHAIN_NAMES[chainId] || `Chain ${chainId}`;
};

const DAOsPage: React.FC = () => {
  const { t } = useTranslation('daos');
  const [selectedChain, setSelectedChain] = useState<number | 'all'>('all');
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  
  // Fetch DAOs using the SDK hook
  const { data, isLoading, isError, error } = useDAOs({
    limit: 20,
    after: cursor,
    orderBy: 'createdAt',
    orderDirection: 'desc',
  });

  // Filter DAOs by selected chain
  const filteredDAOs = useMemo(() => {
    if (!data?.items) return [];
    if (selectedChain === 'all') return data.items;
    return data.items.filter((dao) => dao.chainId === selectedChain);
  }, [data?.items, selectedChain]);

  // Get unique chain IDs from the data for the filter
  const availableChains = useMemo(() => {
    if (!data?.items) return [];
    const chainIds = [...new Set(data.items.map((dao) => dao.chainId))];
    return chainIds.sort((a, b) => a - b);
  }, [data?.items]);

  return (
    <Layout>
      <Head>
        <title>{t('meta.title', 'Deployed DAOs | CreateDAO')}</title>
        <meta name="description" content={t('meta.description', 'View all DAOs deployed through CreateDAO')} />
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {t('header.title', 'Deployed DAOs')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('header.subtitle', 'Browse all DAOs deployed through the CreateDAO platform')}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <label htmlFor="chain-filter" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('filters.network.label', 'Filter by Network')}:
            </label>
            <select
              id="chain-filter"
              value={selectedChain}
              onChange={(e) => setSelectedChain(e.target.value === 'all' ? 'all' : Number(e.target.value))}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">{t('filters.network.all', 'All Networks')}</option>
              {availableChains.map((chainId) => (
                <option key={chainId} value={chainId}>
                  {getChainName(chainId)}
                </option>
              ))}
            </select>
          </div>

          <Link
            href="/create"
            className="inline-flex items-center justify-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {t('actions.createDao', 'Create a DAO')}
          </Link>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">{t('status.loading', 'Loading DAOs...')}</p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
            <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
              {t('errors.loadFailed', 'Failed to load DAOs')}
            </h3>
            <p className="text-red-600 dark:text-red-300 text-sm">
              {error instanceof Error ? error.message : 'An unexpected error occurred'}
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && filteredDAOs.length === 0 && (
          <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-8 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {t('status.noResults.title', 'No DAOs Found')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {selectedChain === 'all' 
                ? t('status.noResults.allNetworks', 'No DAOs have been deployed yet.')
                : t('status.noResults.specificNetwork', 'No DAOs have been deployed on {{network}} yet.', { network: getChainName(selectedChain) })
              }
            </p>
            <Link
              href="/create"
              className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              {t('actions.createDao', 'Create a DAO')}
            </Link>
          </div>
        )}

        {/* DAO List */}
        {!isLoading && !isError && filteredDAOs.length > 0 && (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900/50">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('table.headers.name', 'DAO Name')}
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('table.headers.network', 'Network')}
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('table.headers.token', 'Token')}
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('table.headers.address', 'DAO Address')}
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('table.headers.created', 'Created')}
                    </th>
                    <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {t('table.headers.actions', 'Actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredDAOs.map((dao) => (
                    <tr key={dao.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {dao.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white">
                              {dao.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {dao.proposalCount} proposals
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Image 
                            src={ethereumIcon} 
                            alt={getChainName(dao.chainId)} 
                            width={20} 
                            height={20}
                            className="rounded-full"
                          />
                          <span className="text-sm text-gray-900 dark:text-white">
                            {getChainName(dao.chainId)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white font-medium">
                          {dao.tokenSymbol}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTokenAmount(dao.totalSupply)} supply
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-800 dark:text-gray-200">
                          {truncateAddress(dao.governor)}
                        </code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                        {formatDate(dao.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <a
                          href={`${getChainExplorerUrl(dao.chainId)}/address/${dao.governor}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
                        >
                          {t('actions.viewExplorer', 'View on Explorer')}
                          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
              {filteredDAOs.map((dao) => (
                <div 
                  key={dao.id} 
                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {dao.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {dao.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Image 
                            src={ethereumIcon} 
                            alt={getChainName(dao.chainId)} 
                            width={16} 
                            height={16}
                            className="rounded-full"
                          />
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {getChainName(dao.chainId)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300">
                      {dao.proposalCount} proposals
                    </span>
                  </div>

                  {/* Card Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {t('table.headers.token', 'Token')}
                      </span>
                      <div className="text-right">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {dao.tokenSymbol}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                          ({formatTokenAmount(dao.totalSupply)})
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {t('table.headers.address', 'DAO Address')}
                      </span>
                      <code className="text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-gray-800 dark:text-gray-200">
                        {truncateAddress(dao.governor)}
                      </code>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {t('table.headers.created', 'Created')}
                      </span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {formatDate(dao.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Card Action */}
                  <a
                    href={`${getChainExplorerUrl(dao.chainId)}/address/${dao.governor}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-medium rounded-lg transition-colors text-sm"
                  >
                    {t('actions.viewExplorer', 'View on Explorer')}
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {data?.pageInfo && (data.pageInfo.hasNextPage || data.pageInfo.hasPreviousPage) && (
              <div className="mt-6 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {t('pagination.showing', 'Showing')} <span className="font-medium">{filteredDAOs.length}</span> {t('pagination.results', 'results')}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCursor(undefined)}
                    disabled={!data.pageInfo.hasPreviousPage}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {t('pagination.previous', 'Previous')}
                  </button>
                  <button
                    onClick={() => setCursor(data.pageInfo.endCursor ?? undefined)}
                    disabled={!data.pageInfo.hasNextPage}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {t('pagination.next', 'Next')}
                  </button>
                </div>
              </div>
            )}
          </>
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
