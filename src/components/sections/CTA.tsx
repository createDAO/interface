import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

const CTA: React.FC = () => {
  const { t } = useTranslation('home');
  
  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 dark:from-primary-800 dark:via-primary-900 dark:to-gray-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-2xl max-h-2xl bg-primary-500/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl mb-8">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            {t('cta.title')}
          </h2>
          
          {/* Description */}
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            {t('cta.description')}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Link 
              href="/create"
              className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-primary-700 font-bold px-8 py-4 rounded-xl shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              {t('cta.createButton')}
            </Link>
            <Link 
              href="#features"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border-2 border-white/30 font-bold px-8 py-4 rounded-xl transition-all duration-200"
            >
              {t('cta.learnMoreButton')}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
          </div>

          {/* Note */}
          <p className="text-sm text-white/60">
            {t('cta.gasFeeNote')}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-white/10">
            <div>
              <p className="text-3xl font-bold text-white">3</p>
              <p className="text-white/60 text-sm">Contracts Deployed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">~90%</p>
              <p className="text-white/60 text-sm">Gas Saved</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">1</p>
              <p className="text-white/60 text-sm">Transaction</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
