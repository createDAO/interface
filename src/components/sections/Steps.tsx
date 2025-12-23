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
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      color: 'blue',
    },
    {
      number: 2,
      title: t('steps.step2.title'),
      description: t('steps.step2.description'),
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      color: 'purple',
    },
    {
      number: 3,
      title: t('steps.step3.title'),
      description: t('steps.step3.description'),
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      color: 'green',
    },
  ];

  const colorClasses: Record<string, { bg: string; border: string }> = {
    blue: {
      bg: 'bg-blue-500',
      border: 'border-blue-200 dark:border-blue-800',
    },
    purple: {
      bg: 'bg-purple-500',
      border: 'border-purple-200 dark:border-purple-800',
    },
    green: {
      bg: 'bg-green-500',
      border: 'border-green-200 dark:border-green-800',
    },
  };

  return (
    <section id="how-it-works" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('steps.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('steps.subtitle')}
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 -translate-x-1/2" />

            <div className="space-y-8 md:space-y-0">
              {steps.map((step, index) => {
                const colors = colorClasses[step.color];
                const isEven = index % 2 === 1;
                
                return (
                  <div 
                    key={index}
                    className={`relative flex flex-col md:flex-row items-center ${isEven ? 'md:flex-row-reverse' : ''}`}
                  >
                    {/* Content */}
                    <div className={`w-full md:w-5/12 ${isEven ? 'md:text-left md:pl-8' : 'md:text-right md:pr-8'}`}>
                      <div className={`bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border ${colors.border} transition-all duration-300 hover:shadow-lg`}>
                        <div className={`md:hidden w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center mb-4`}>
                          {step.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                          {step.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Center icon (desktop only) */}
                    <div className="hidden md:flex w-2/12 justify-center">
                      <div className={`w-14 h-14 ${colors.bg} rounded-full flex items-center justify-center shadow-lg z-10`}>
                        {step.icon}
                      </div>
                    </div>

                    {/* Spacer */}
                    <div className="hidden md:block w-5/12" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-700" />
            <span className="text-gray-500 dark:text-gray-400">{t('steps.readyToStart')}</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gray-300 dark:to-gray-700" />
          </div>
          <div>
            <Link 
              href="/create" 
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {t('steps.createButton')}
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Steps;
