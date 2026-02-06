import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import ethereumIcon from '../../assets/networks/ethereum.png';


const Networks: React.FC = () => {
  const { t } = useTranslation('home');

  return (
    <section id="networks" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('networks.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('networks.subtitle')}
          </p>
        </div>

        {/* Network Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Sepolia Testnet */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 dark:from-yellow-600/10 dark:to-orange-600/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              {/* Badge */}
              <div className="absolute -top-3 left-6">
                <span className="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 text-xs font-semibold px-3 py-1 rounded-full">
                  {t('networks.testnet.badge')}
                </span>
              </div>

              <div className="flex items-start gap-4 mb-6 mt-2">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center p-2">
                  <Image
                    src={ethereumIcon}
                    alt="Sepolia"
                    width={48}
                    height={48}
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {t('networks.testnet.title')}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">{t('networks.testnet.tag')}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('networks.testnet.description')}
              </p>

              <Link
                href="/create?network=sepolia"
                className="inline-flex items-center justify-center w-full gap-2 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                {t('networks.testnet.deployButton')}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Ethereum Mainnet */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-primary-400/20 dark:from-blue-600/10 dark:to-primary-600/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
            <div className="relative bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              {/* Badge */}
              <div className="absolute -top-3 left-6">
                <span className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-xs font-semibold px-3 py-1 rounded-full">
                  {t('networks.mainnet.badge')}
                </span>
              </div>

              <div className="flex items-start gap-4 mb-6 mt-2">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center p-2">
                  <Image
                    src={ethereumIcon}
                    alt="Ethereum"
                    width={48}
                    height={48}
                    className="rounded-lg"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {t('networks.mainnet.title')}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">{t('networks.mainnet.tag')}</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('networks.mainnet.description')}
              </p>

              <Link
                href="/create?network=ethereum"
                className="inline-flex items-center justify-center w-full gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              >
                {t('networks.mainnet.deployButton')}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Coming soon note */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {t('networks.comingSoon')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Networks;
