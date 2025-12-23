import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';

const VersionBanner: React.FC = () => {
  const { t } = useTranslation('home');
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-700 dark:to-primary-600 text-white relative">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center gap-4 text-sm">
          <div className="flex items-center gap-3">
            <span className="font-semibold">{t('versionBanner.title')}</span>
            <span className="hidden sm:inline text-white/80">
              {t('versionBanner.description')}
            </span>
          </div>
          <a 
            href="#features"
            className="hidden sm:inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full text-xs font-medium transition-colors"
          >
            {t('versionBanner.cta')}
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </div>
      
      {/* Close button */}
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
        aria-label="Close banner"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default VersionBanner;
