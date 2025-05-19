import React from 'react';
import Image from 'next/image';
import daocafeLogo from '../../assets/daocafe.png';
import { useTranslation } from 'next-i18next';

const ManagementPlatforms: React.FC = () => {
  const { t } = useTranslation('home');
  
  const platforms = [
    { 
      name: t('platforms.daoCafe.name'), 
      logo: daocafeLogo, 
      description: t('platforms.daoCafe.description'),
      url: 'https://dao.cafe'
    },
  ];

  return (
    <section id="management-platforms" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('platforms.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t('platforms.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {platforms.map((platform, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex flex-col md:flex-row items-center md:items-start">
                <div className="mb-6 md:mb-0 md:mr-6 flex-shrink-0">
                  <div className="w-24 h-24 relative">
                    <Image 
                      src={platform.logo} 
                      alt={`${platform.name} logo`} 
                      width={96} 
                      height={96} 
                      className="rounded-lg"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {platform.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {platform.description}
                  </p>
                  <a 
                    href={platform.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    {t('platforms.daoCafe.visitButton')}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}

          {/* Developer Placeholder Card */}
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 transition-all duration-300 hover:shadow-xl">
            <div className="flex flex-col md:flex-row items-center md:items-start">
              <div className="mb-6 md:mb-0 md:mr-6 flex-shrink-0">
                <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
              </div>
              <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {t('platforms.addYourPlatform.title')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {t('platforms.addYourPlatform.description')}
              </p>
              <a 
                href="https://docs.createdao.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline"
              >
                {t('platforms.addYourPlatform.readDocsButton')}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">
            {t('platforms.integration.text')} <a href="https://docs.createdao.org/integration/frontend-integration" className="text-primary-600 dark:text-primary-400 hover:underline">{t('platforms.integration.linkText')}</a>.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ManagementPlatforms;
