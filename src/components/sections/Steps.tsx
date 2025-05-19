import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

const Steps: React.FC = () => {
  const { t } = useTranslation('home');
  
  const steps = [
    {
      number: 1,
      title: t('steps.step1.title'),
      description: t('steps.step1.description'),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
          <path d="M3.5 12h4"></path>
          <path d="M20.5 12h-4"></path>
        </svg>
      ),
    },
    {
      number: 2,
      title: t('steps.step2.title'),
      description: t('steps.step2.description'),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9"></path>
          <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          <path d="m15 5 3 3"></path>
        </svg>
      ),
    },
    {
      number: 3,
      title: t('steps.step3.title'),
      description: t('steps.step3.description'),
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('steps.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            {t('steps.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400">
                  {step.icon}
                </div>
              </div>
              <div className="relative mb-6 pb-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {step.title}
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center mb-8">
            <div className="h-px w-12 bg-gray-300 dark:bg-gray-700"></div>
            <span className="mx-4 text-gray-500 dark:text-gray-400">{t('steps.readyToStart')}</span>
            <div className="h-px w-12 bg-gray-300 dark:bg-gray-700"></div>
          </div>
          <div>
            <Link href="/create" className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200 cursor-pointer">
              {t('steps.createButton')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Steps;
