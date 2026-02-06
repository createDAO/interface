import React from 'react';
import Image from 'next/image';
import { useTranslation } from 'next-i18next';
import nyknycIcon from '../../assets/wallets/nyknyc-icon.svg';

const NYKNYCWallet: React.FC = () => {
  const { t } = useTranslation('home');

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: t('nyknyc.features.sponsored.title'),
      description: t('nyknyc.features.sponsored.description'),
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: t('nyknyc.features.erc4337.title'),
      description: t('nyknyc.features.erc4337.description'),
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: t('nyknyc.features.seamless.title'),
      description: t('nyknyc.features.seamless.description'),
    },
  ];

  return (
    <section id="nyknyc-wallet" className="py-20 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-400/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Main content grid */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Text content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-primary-200 text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                {t('nyknyc.badge')}
              </div>

              {/* Heading */}
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                {t('nyknyc.title')}
                <span className="block text-primary-300 mt-2">
                  {t('nyknyc.titleHighlight')}
                </span>
              </h2>

              {/* Description */}
              <p className="text-lg text-primary-100 mb-8 leading-relaxed">
                {t('nyknyc.description')}
              </p>

              {/* CTA Button */}
              <a
                href="https://nyknyc.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-primary-900 font-semibold rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <Image
                  src={nyknycIcon.src}
                  alt="NYKNYC"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
                {t('nyknyc.cta')}
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>

              {/* Trust note */}
              <p className="mt-6 text-primary-300 text-sm">
                {t('nyknyc.trustNote')}
              </p>
            </div>

            {/* Right side - Features */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/15 transition-colors duration-300"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-500/30 rounded-xl flex items-center justify-center text-primary-200">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-primary-200 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}

              {/* Highlight box */}
              <div className="p-6 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl border border-green-400/30">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-500/30 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {t('nyknyc.freeRegistration.title')}
                    </h3>
                    <p className="text-green-200 text-sm leading-relaxed">
                      {t('nyknyc.freeRegistration.description')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NYKNYCWallet;
