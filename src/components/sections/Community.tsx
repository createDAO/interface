import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import daoforumLogo from '../../assets/daoforum.png';

const Community: React.FC = () => {
  const { t } = useTranslation('home');

  const communityLinks = [
    {
      id: 'telegram',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
      name: t('community.telegram.name'),
      description: t('community.telegram.description'),
      href: 'http://t.me/createdao_org',
      bgColor: 'bg-sky-500',
      hoverColor: 'hover:bg-sky-600',
      textColor: 'text-sky-500',
    },
    {
      id: 'daoforum',
      icon: null, // Will use image
      image: daoforumLogo,
      name: t('community.daoforum.name'),
      description: t('community.daoforum.description'),
      href: 'https://daoforum.org/threads/createdao-v2-launch-a-full-governance-suite-in-one-click-community-feedback-thread.36/',
      bgColor: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      textColor: 'text-purple-500',
    },
  ];

  const forumFeatures = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      text: t('community.daoforum.features.askQuestions'),
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      text: t('community.daoforum.features.requestFeatures'),
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      text: t('community.daoforum.features.growTogether'),
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      text: t('community.daoforum.features.safeSpace'),
    },
  ];

  return (
    <section id="community" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('community.title')}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t('community.subtitle')}
          </p>
        </div>

        {/* Community Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {communityLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex items-start gap-5">
                {/* Icon/Logo */}
                <div className={`flex-shrink-0 w-16 h-16 ${link.bgColor} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {link.image ? (
                    <Image
                      src={link.image}
                      alt={link.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 object-contain"
                    />
                  ) : (
                    link.icon
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {link.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                    {link.description}
                  </p>

                  {/* Forum-specific features */}
                  {link.id === 'daoforum' && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {forumFeatures.map((feature, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
                        >
                          <span className="text-purple-500">{feature.icon}</span>
                          {feature.text}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CTA */}
                  <div className={`mt-4 inline-flex items-center ${link.textColor} font-medium text-sm`}>
                    {t('community.joinButton')}
                    <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {t('community.bottomNote')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Community;
