import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import daocafeIcon from '../../assets/daocafe.png';

// Reusable platform card component
interface PlatformCardProps {
  href: string;
  isPrimary?: boolean;
  isDashed?: boolean;
  children: React.ReactNode;
}

const PlatformCard: React.FC<PlatformCardProps> = ({ href, isPrimary, isDashed, children }) => {
  const baseClasses = "group bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 md:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1";
  const borderClasses = isPrimary
    ? "border-2 border-primary-200 dark:border-primary-700 relative overflow-hidden"
    : isDashed
    ? "border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500"
    : "border border-gray-100 dark:border-gray-700";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${baseClasses} ${borderClasses}`}
    >
      {isPrimary && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-transparent dark:from-primary-900/20 dark:to-transparent opacity-50" />
      )}
      <div className={isPrimary ? "relative" : ""}>
        {children}
      </div>
    </a>
  );
};

const ManagementPlatforms: React.FC = () => {
  const { t } = useTranslation('home');

  return (
    <section id="management-platforms" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('platforms.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('platforms.subtitle')}
          </p>
        </div>

        {/* OpenBook Featured Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <a
            href="https://openbook.to"
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-gradient-to-br from-primary-600 to-primary-800 dark:from-primary-700 dark:to-primary-900 rounded-3xl shadow-xl p-8 md:p-10 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative grid md:grid-cols-2 gap-8 items-center">
              {/* Left side - Main info */}
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <span className="text-4xl">📖</span>
                  </div>
                  <div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white">
                      {t('platforms.openbook.name')}
                    </h3>
                    <span className="text-sm text-primary-200 font-medium">
                      {t('platforms.openbook.badge')}
                    </span>
                  </div>
                </div>

                <p className="text-primary-100 text-lg leading-relaxed mb-6">
                  {t('platforms.openbook.description')}
                </p>

                <div className="flex items-center text-white font-semibold text-lg">
                  {t('platforms.openbook.visitButton')}
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>

              {/* Right side - USP Features */}
              <div className="space-y-4">
                {[
                  { icon: '🏢', text: t('platforms.openbook.usp.multiEntity') },
                  { icon: '💰', text: t('platforms.openbook.usp.expenseTracking') },
                  { icon: '🔐', text: t('platforms.openbook.usp.walletAuth') },
                  { icon: '👥', text: t('platforms.openbook.usp.permissions') },
                ].map((usp, index) => (
                  <div key={index} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3">
                    <span className="text-xl">{usp.icon}</span>
                    <span className="text-white text-sm font-medium">{usp.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Compatibility note */}
            <div className="mt-8 pt-6 border-t border-white/20">
              <p className="text-primary-200 text-sm text-center">
                {t('platforms.openbook.compatibility')}
              </p>
            </div>
          </a>
        </div>

        {/* Other Platform Cards - 2x2 on mobile, 4 columns on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
          {/* DAO Café - API/SDK */}
          <PlatformCard href="https://dao.cafe" isPrimary>
            <div className="flex flex-col items-center md:items-start gap-3 mb-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center p-2">
                <Image 
                  src={daocafeIcon} 
                  alt="DAO Café" 
                  width={40} 
                  height={40} 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {t('platforms.daocafe.name')}
                </h3>
                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                  {t('platforms.daocafe.badge')}
                </span>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mb-4 leading-relaxed text-center md:text-left line-clamp-3 md:line-clamp-none">
              {t('platforms.daocafe.description')}
            </p>

            <div className="flex items-center justify-center md:justify-start text-primary-600 dark:text-primary-400 text-sm font-medium">
              {t('platforms.daocafe.visitButton')}
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </PlatformCard>

          {/* Snapshot */}
          <a
            href="https://snapshot.org"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 md:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="flex flex-col items-center md:items-start gap-3 mb-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center p-2">
                <Image 
                  src="/images/snapshot_logo.svg" 
                  alt="Snapshot logo" 
                  width={40} 
                  height={40} 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {t('platforms.snapshot.name')}
                </h3>
                <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                  {t('platforms.snapshot.badge')}
                </span>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mb-4 leading-relaxed text-center md:text-left line-clamp-3 md:line-clamp-none">
              {t('platforms.snapshot.description')}
            </p>

            <div className="flex items-center justify-center md:justify-start text-primary-600 dark:text-primary-400 text-sm font-medium">
              {t('platforms.snapshot.visitButton')}
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </a>

          {/* Tally */}
          <a
            href="https://tally.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 md:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="flex flex-col items-center md:items-start gap-3 mb-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700 flex items-center justify-center p-2">
                <Image 
                  src="/images/tally_logo.svg" 
                  alt="Tally logo" 
                  width={40} 
                  height={40} 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {t('platforms.tally.name')}
                </h3>
                <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">
                  {t('platforms.tally.badge')}
                </span>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mb-4 leading-relaxed text-center md:text-left line-clamp-3 md:line-clamp-none">
              {t('platforms.tally.description')}
            </p>

            <div className="flex items-center justify-center md:justify-start text-primary-600 dark:text-primary-400 text-sm font-medium">
              {t('platforms.tally.visitButton')}
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </a>

          {/* Build Your Own */}
          <a
            href="https://github.com/createdao"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white dark:bg-gray-900 rounded-2xl shadow-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-4 md:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary-400 dark:hover:border-primary-500"
          >
            <div className="flex flex-col items-center md:items-start gap-3 mb-4">
              <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-gray-400 group-hover:text-primary-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-base md:text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {t('platforms.addYourPlatform.title')}
                </h3>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Open Source</span>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 text-xs md:text-sm mb-4 leading-relaxed text-center md:text-left line-clamp-3 md:line-clamp-none">
              {t('platforms.addYourPlatform.description')}
            </p>

            <div className="flex items-center justify-center md:justify-start text-primary-600 dark:text-primary-400 text-sm font-medium">
              {t('platforms.addYourPlatform.readDocsButton')}
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
          </a>
        </div>

        {/* Integration note */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            {t('platforms.integration.text')}{' '}
            <a 
              href="https://github.com/createdao" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              {t('platforms.integration.linkText')}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ManagementPlatforms;
