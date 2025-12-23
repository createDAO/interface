import React from 'react';
import { useTranslation } from 'next-i18next';

interface ContractCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  color: 'blue' | 'green' | 'purple';
}

const colorClasses = {
  blue: {
    gradient: 'from-blue-500 to-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    badge: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300',
  },
  green: {
    gradient: 'from-green-500 to-green-600',
    bg: 'bg-green-50 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    badge: 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300',
  },
  purple: {
    gradient: 'from-purple-500 to-purple-600',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    border: 'border-purple-200 dark:border-purple-800',
    badge: 'bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300',
  },
};

const ContractCard: React.FC<ContractCardProps> = ({ icon, title, description, features, color }) => {
  const colors = colorClasses[color];
  
  return (
    <div className={`${colors.bg} ${colors.border} border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl`}>
      {/* Header with gradient */}
      <div className={`bg-gradient-to-r ${colors.gradient} p-6`}>
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm leading-relaxed">
          {description}
        </p>
        
        {/* Feature list */}
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <svg className={`w-4 h-4 ${color === 'blue' ? 'text-blue-500' : color === 'green' ? 'text-green-500' : 'text-purple-500'}`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const WhatYouGet: React.FC = () => {
  const { t } = useTranslation('home');

  const contracts: ContractCardProps[] = [
    {
      icon: (
        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: t('whatYouGet.token.title'),
      description: t('whatYouGet.token.description'),
      features: t('whatYouGet.token.features', { returnObjects: true }) as string[],
      color: 'blue',
    },
    {
      icon: (
        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: t('whatYouGet.treasury.title'),
      description: t('whatYouGet.treasury.description'),
      features: t('whatYouGet.treasury.features', { returnObjects: true }) as string[],
      color: 'green',
    },
    {
      icon: (
        <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: t('whatYouGet.governor.title'),
      description: t('whatYouGet.governor.description'),
      features: t('whatYouGet.governor.features', { returnObjects: true }) as string[],
      color: 'purple',
    },
  ];

  return (
    <section id="what-you-get" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('whatYouGet.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('whatYouGet.subtitle')}
          </p>
        </div>

        {/* Contracts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {contracts.map((contract, index) => (
            <ContractCard
              key={index}
              icon={contract.icon}
              title={contract.title}
              description={contract.description}
              features={contract.features}
              color={contract.color}
            />
          ))}
        </div>

        {/* Visual connection line */}
        <div className="hidden md:flex justify-center items-center mt-8">
          <div className="flex items-center gap-4 bg-white dark:bg-gray-900 rounded-full px-6 py-3 shadow-lg border border-gray-200 dark:border-gray-700">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <div className="w-3 h-3 bg-purple-500 rounded-full" />
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">All connected & ready to govern</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhatYouGet;
