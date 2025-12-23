import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import nextI18NextConfig from '../../next-i18next.config.js';
import Layout from '../components/layout/Layout';

// Icons
const TokenIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const GovernorIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const TreasuryIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const ArrowIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

// Section Header Component
const SectionHeader: React.FC<{
  title: string;
  subtitle?: string;
  centered?: boolean;
}> = ({ title, subtitle, centered = false }) => (
  <div className={`mb-10 ${centered ? 'text-center' : ''}`}>
    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
      {title}
    </h2>
    {subtitle && (
      <p className={`text-lg text-gray-600 dark:text-gray-400 ${centered ? 'max-w-2xl mx-auto' : ''}`}>
        {subtitle}
      </p>
    )}
  </div>
);

// Benefit Card Component
const BenefitCard: React.FC<{
  title: string;
  description: string;
  index: number;
}> = ({ title, description, index }) => {
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-amber-500'];
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow">
      <div className={`w-10 h-10 ${colors[index % colors.length]} rounded-lg flex items-center justify-center mb-4`}>
        <CheckIcon className="w-5 h-5 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
};

// Architecture Card Component
const ArchitectureCard: React.FC<{
  icon: React.ReactNode;
  name: string;
  tagline: string;
  description: string;
  color: 'blue' | 'purple' | 'green';
}> = ({ icon, name, tagline, description, color }) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      iconBg: 'bg-blue-500',
      text: 'text-blue-600 dark:text-blue-400',
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-200 dark:border-purple-800',
      iconBg: 'bg-purple-500',
      text: 'text-purple-600 dark:text-purple-400',
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      iconBg: 'bg-green-500',
      text: 'text-green-600 dark:text-green-400',
    },
  };

  const classes = colorClasses[color];

  return (
    <div className={`${classes.bg} ${classes.border} border rounded-xl p-6 text-center`}>
      <div className={`w-14 h-14 ${classes.iconBg} rounded-xl flex items-center justify-center mx-auto mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{name}</h3>
      <p className={`text-sm font-medium ${classes.text} mb-2`}>{tagline}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
};

// Component Detail Card
const ComponentDetailCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  color: 'blue' | 'purple' | 'green';
}> = ({ icon, title, description, features, color }) => {
  const colorClasses = {
    blue: {
      gradient: 'from-blue-500 to-blue-600',
      check: 'text-blue-500',
    },
    purple: {
      gradient: 'from-purple-500 to-purple-600',
      check: 'text-purple-500',
    },
    green: {
      gradient: 'from-green-500 to-green-600',
      check: 'text-green-500',
    },
  };

  const classes = colorClasses[color];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className={`bg-gradient-to-r ${classes.gradient} p-6`}>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            {icon}
          </div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
      </div>
      <div className="p-6">
        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">{description}</p>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckIcon className={`w-5 h-5 ${classes.check} flex-shrink-0 mt-0.5`} />
              <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Parameter Row Component
interface ParameterItem {
  label: string;
  value: string;
  description: string;
}

const ParameterRow: React.FC<{ item: ParameterItem }> = ({ item }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
    <div className="flex-1">
      <span className="font-medium text-gray-900 dark:text-white">{item.label}</span>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{item.description}</p>
    </div>
    <div className="mt-2 sm:mt-0 sm:ml-4">
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
        {item.value}
      </span>
    </div>
  </div>
);

// Governance Step Component
interface GovernanceStep {
  number: string;
  title: string;
  description: string;
  duration: string;
}

const GovernanceStepCard: React.FC<{ step: GovernanceStep; isLast: boolean }> = ({ step, isLast }) => (
  <div className="flex items-start">
    <div className="flex flex-col items-center mr-4">
      <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
        {step.number}
      </div>
      {!isLast && <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 mt-2 min-h-[40px]" />}
    </div>
    <div className="flex-1 pb-8">
      <div className="flex items-center gap-3 mb-1">
        <h4 className="font-semibold text-gray-900 dark:text-white">{step.title}</h4>
        {step.duration && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
            {step.duration}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">{step.description}</p>
    </div>
  </div>
);

// Security Feature Card
const SecurityFeatureCard: React.FC<{
  title: string;
  description: string;
}> = ({ title, description }) => (
  <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700">
    <div className="flex items-center gap-3 mb-2">
      <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
        <CheckIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
      </div>
      <h4 className="font-semibold text-gray-900 dark:text-white">{title}</h4>
    </div>
    <p className="text-sm text-gray-600 dark:text-gray-400 ml-11">{description}</p>
  </div>
);

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', ['common', 'dao-features', 'navigation'], nextI18NextConfig)),
    },
  };
};

const DAOFeaturesPage: React.FC = () => {
  const { t } = useTranslation('dao-features');

  // Defensive parsing: if a translation is missing or has the wrong shape,
  // ensure we always get arrays to avoid `.map is not a function` runtime crashes.
  const asArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

  const benefits = asArray<{ title: string; description: string }>(
    t('whatIsDao.benefits.items', { returnObjects: true })
  );
  const parameters = asArray<ParameterItem>(t('parameters.items', { returnObjects: true }));
  const governanceSteps = asArray<GovernanceStep>(t('governance.steps', { returnObjects: true }));
  const managerUseCases = asArray<string>(t('manager.useCases.items', { returnObjects: true }));
  const securityFeatures = asArray<{ title: string; description: string }>(
    t('security.features', { returnObjects: true })
  );
  const tokenFeatures = asArray<string>(t('components.token.features', { returnObjects: true }));
  const governorFeatures = asArray<string>(t('components.governor.features', { returnObjects: true }));
  const treasuryFeatures = asArray<string>(t('components.treasury.features', { returnObjects: true }));

  return (
    <Layout>
      <Head>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
      </Head>

      <div className="py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('header.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            {t('header.subtitle')}
          </p>
        </div>

        {/* What is a DAO Section */}
        <section className="max-w-5xl mx-auto mb-20">
          <SectionHeader title={t('whatIsDao.title')} />
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-10">
            {t('whatIsDao.description')}
          </p>
          
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            {t('whatIsDao.benefits.title')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <BenefitCard
                key={index}
                title={benefit.title}
                description={benefit.description}
                index={index}
              />
            ))}
          </div>
        </section>

        {/* Architecture Section */}
        <section className="bg-gray-50 dark:bg-gray-800/50 py-16 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 mb-20">
          <div className="max-w-5xl mx-auto">
            <SectionHeader
              title={t('architecture.title')}
              subtitle={t('architecture.subtitle')}
              centered
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <ArchitectureCard
                icon={<TokenIcon className="w-7 h-7 text-white" />}
                name={t('architecture.contracts.token.name')}
                tagline={t('architecture.contracts.token.tagline')}
                description={t('architecture.contracts.token.description')}
                color="blue"
              />
              <ArchitectureCard
                icon={<GovernorIcon className="w-7 h-7 text-white" />}
                name={t('architecture.contracts.governor.name')}
                tagline={t('architecture.contracts.governor.tagline')}
                description={t('architecture.contracts.governor.description')}
                color="purple"
              />
              <ArchitectureCard
                icon={<TreasuryIcon className="w-7 h-7 text-white" />}
                name={t('architecture.contracts.treasury.name')}
                tagline={t('architecture.contracts.treasury.tagline')}
                description={t('architecture.contracts.treasury.description')}
                color="green"
              />
            </div>

            {/* Connection flow */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-3 bg-white dark:bg-gray-800 rounded-full px-6 py-3 shadow-md border border-gray-200 dark:border-gray-700">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <ArrowIcon className="w-4 h-4 text-gray-400" />
                <div className="w-3 h-3 bg-purple-500 rounded-full" />
                <ArrowIcon className="w-4 h-4 text-gray-400" />
                <div className="w-3 h-3 bg-green-500 rounded-full" />
              </div>
            </div>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
              {t('architecture.flowDescription')}
            </p>
          </div>
        </section>

        {/* Core Components Section */}
        <section className="max-w-5xl mx-auto mb-20">
          <SectionHeader
            title={t('components.title')}
            subtitle={t('components.subtitle')}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ComponentDetailCard
              icon={<TokenIcon className="w-6 h-6 text-white" />}
              title={t('components.token.title')}
              description={t('components.token.description')}
              features={tokenFeatures}
              color="blue"
            />
            <ComponentDetailCard
              icon={<GovernorIcon className="w-6 h-6 text-white" />}
              title={t('components.governor.title')}
              description={t('components.governor.description')}
              features={governorFeatures}
              color="purple"
            />
            <ComponentDetailCard
              icon={<TreasuryIcon className="w-6 h-6 text-white" />}
              title={t('components.treasury.title')}
              description={t('components.treasury.description')}
              features={treasuryFeatures}
              color="green"
            />
          </div>
        </section>

        {/* Governance Parameters Section */}
        <section className="max-w-3xl mx-auto mb-20">
          <SectionHeader
            title={t('parameters.title')}
            subtitle={t('parameters.subtitle')}
          />

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            {parameters.map((item, index) => (
              <ParameterRow key={index} item={item} />
            ))}
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
            {t('parameters.note')}
          </p>
        </section>

        {/* How Governance Works Section */}
        <section className="bg-gray-50 dark:bg-gray-800/50 py-16 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 mb-20">
          <div className="max-w-3xl mx-auto">
            <SectionHeader
              title={t('governance.title')}
              subtitle={t('governance.subtitle')}
              centered
            />

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
              {governanceSteps.map((step, index) => (
                <GovernanceStepCard
                  key={index}
                  step={step}
                  isLast={index === governanceSteps.length - 1}
                />
              ))}
            </div>

            {/* Voting Options */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
                <div className="font-semibold text-green-700 dark:text-green-400 mb-1">For</div>
                <div className="text-sm text-green-600 dark:text-green-500">Support the proposal</div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
                <div className="font-semibold text-red-700 dark:text-red-400 mb-1">Against</div>
                <div className="text-sm text-red-600 dark:text-red-500">Oppose the proposal</div>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-4 text-center">
                <div className="font-semibold text-gray-700 dark:text-gray-300 mb-1">Abstain</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Count toward quorum only</div>
              </div>
            </div>
          </div>
        </section>

        {/* DAO Manager Section */}
        <section className="max-w-4xl mx-auto mb-20">
          <div className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 rounded-2xl border border-primary-200 dark:border-primary-800 p-8">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="w-14 h-14 bg-primary-500 rounded-xl flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('manager.title')}
                </h2>
                <p className="text-primary-700 dark:text-primary-300 font-medium mb-4">
                  {t('manager.subtitle')}
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {t('manager.description')}
                </p>

                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  {t('manager.useCases.title')}
                </h4>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                  {managerUseCases.map((useCase, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckIcon className="w-4 h-4 text-primary-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{useCase}</span>
                    </li>
                  ))}
                </ul>

                <p className="text-sm text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 rounded-lg p-3">
                  {t('manager.note')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Security Section */}
        <section className="max-w-5xl mx-auto mb-20">
          <SectionHeader
            title={t('security.title')}
            subtitle={t('security.subtitle')}
            centered
          />

          <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
            {t('security.description')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityFeatures.map((feature, index) => (
              <SecurityFeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-10">
            <h2 className="text-3xl font-bold text-white mb-3">
              {t('cta.title')}
            </h2>
            <p className="text-primary-100 mb-8">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/create"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
              >
                {t('cta.createButton')}
              </Link>
              <a
                href="https://docs.createdao.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20"
              >
                {t('cta.docsButton')}
                <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default DAOFeaturesPage;
