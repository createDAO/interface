import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

const CTA: React.FC = () => {
  const { t } = useTranslation('home');
  
  return (
    <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-800 dark:from-primary-800 dark:to-primary-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-xl text-white/80 mb-8">
            {t('cta.description')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/create"
              className="inline-block bg-white hover:bg-gray-100 text-primary-600 font-bold px-8 py-4 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
            >
              {t('cta.createButton')}
            </Link>
            <Link 
              href="#how-it-works"
              className="inline-block bg-transparent hover:bg-primary-700 text-white border-2 border-white font-bold px-8 py-4 rounded-lg transition-all duration-200"
            >
              {t('cta.learnMoreButton')}
            </Link>
          </div>
          <p className="text-sm text-white/70 mt-4">
            {t('cta.gasFeeNote')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTA;
