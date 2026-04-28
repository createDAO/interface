import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { serverSideTranslations } from 'next-i18next/pages/serverSideTranslations';
import { GetStaticProps } from 'next';
import nextI18NextConfig from '../../next-i18next.config.js';
import Layout from '../components/layout/Layout';

const CANONICAL_URL = 'https://createdao.org/how-to-create-a-dao';
const OG_IMAGE = 'https://createdao.org/og/how-to-create-a-dao.jpg';

// ────────────────────────────────────────────────────────────
// Icons
// ────────────────────────────────────────────────────────────

const TokenIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const GovernorIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const TreasuryIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const ArrowRightIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
);

const SparkleIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" />
  </svg>
);

// ────────────────────────────────────────────────────────────
// Reusable bits
// ────────────────────────────────────────────────────────────

const SectionHeader: React.FC<{ title: string; subtitle?: string; centered?: boolean }> = ({
  title,
  subtitle,
  centered = false,
}) => (
  <div className={`mb-10 ${centered ? 'text-center' : ''}`}>
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">{title}</h2>
    {subtitle && (
      <p className={`text-lg text-gray-600 dark:text-gray-400 ${centered ? 'max-w-2xl mx-auto' : ''}`}>
        {subtitle}
      </p>
    )}
  </div>
);

// Defensive parser — same pattern as dao-features page
const asArray = <T,>(value: unknown): T[] => (Array.isArray(value) ? (value as T[]) : []);

// ────────────────────────────────────────────────────────────
// Type helpers
// ────────────────────────────────────────────────────────────

type TldrStep = { number: string; title: string; description: string };
type Characteristic = { title: string; description: string };
type Distribution = { recipient: string; allocation: string; purpose: string };
type PlanItem = { label: string; example: string };
type StepItem = { number: string; title: string; description: string; tip: string };
type Parameter = { label: string; value: string; changeable: string; description: string };
type AfterAction = { title: string; description: string };
type ComparisonRow = {
  feature: string;
  createdao: string;
  aragon: string;
  colony: string;
  manual: string;
};
type FaqItem = { question: string; answer: string };
type RelatedItem = { title: string; description: string; href: string; cta: string };

// ────────────────────────────────────────────────────────────
// JSON-LD builder
// ────────────────────────────────────────────────────────────

interface JsonLdData {
  title: string;
  description: string;
  datePublished: string;
  dateModified: string;
  steps: StepItem[];
  faqItems: FaqItem[];
  breadcrumbHome: string;
  breadcrumbCurrent: string;
}

const buildJsonLd = (d: JsonLdData) => {
  // Strip HTML tags for FAQ schema (Google requires plain text answers)
  const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '');

  const article = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: d.title,
    description: d.description,
    image: OG_IMAGE,
    datePublished: d.datePublished,
    dateModified: d.dateModified,
    author: {
      '@type': 'Organization',
      name: 'CreateDAO',
      url: 'https://createdao.org',
    },
    publisher: {
      '@type': 'Organization',
      name: 'CreateDAO',
      logo: {
        '@type': 'ImageObject',
        url: 'https://createdao.org/favicon.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': CANONICAL_URL,
    },
  };

  const howTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Create a DAO',
    description: d.description,
    image: OG_IMAGE,
    totalTime: 'PT2M',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: '0',
    },
    tool: [
      { '@type': 'HowToTool', name: 'Web3 wallet (MetaMask, WalletConnect, Coinbase) or NYKNYC.app smart wallet' },
      { '@type': 'HowToTool', name: 'CreateDAO interface (createdao.org)' },
    ],
    step: d.steps.map((s, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      name: s.title,
      text: s.description,
      url: `${CANONICAL_URL}#step-${s.number}`,
    })),
  };

  const faq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: d.faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: stripHtml(item.answer),
      },
    })),
  };

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: d.breadcrumbHome,
        item: 'https://createdao.org',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: d.breadcrumbCurrent,
        item: CANONICAL_URL,
      },
    ],
  };

  return [article, howTo, faq, breadcrumb];
};

// ────────────────────────────────────────────────────────────
// Page
// ────────────────────────────────────────────────────────────

const HowToCreateDaoPage: React.FC = () => {
  const { t } = useTranslation('how-to-create-a-dao');

  const tldrSteps = asArray<TldrStep>(t('tldr.steps', { returnObjects: true }));
  const characteristics = asArray<Characteristic>(t('whatIsDao.characteristics', { returnObjects: true }));
  const distribution = asArray<Distribution>(t('whatGetsDeployed.distribution', { returnObjects: true }));
  const planItems = asArray<PlanItem>(t('whatYouNeed.planItems', { returnObjects: true }));
  const steps = asArray<StepItem>(t('stepByStep.steps', { returnObjects: true }));
  const parameters = asArray<Parameter>(t('parameters.items', { returnObjects: true }));
  const afterActions = asArray<AfterAction>(t('afterDeployment.actions', { returnObjects: true }));
  const comparisonRows = asArray<ComparisonRow>(t('comparison.rows', { returnObjects: true }));
  const faqItems = asArray<FaqItem>(t('faq.items', { returnObjects: true }));
  const relatedItems = asArray<RelatedItem>(t('related.items', { returnObjects: true }));

  const jsonLd = buildJsonLd({
    title: t('meta.title'),
    description: t('meta.description'),
    datePublished: t('meta.datePublished'),
    dateModified: t('meta.dateModified'),
    steps,
    faqItems,
    breadcrumbHome: t('breadcrumbs.home'),
    breadcrumbCurrent: t('breadcrumbs.current'),
  });

  return (
    <Layout>
      <Head>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
        <link rel="canonical" href={CANONICAL_URL} />
        <link rel="alternate" hrefLang="en" href={CANONICAL_URL} />
        <link rel="alternate" hrefLang="x-default" href={CANONICAL_URL} />

        {/* Open Graph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={t('meta.ogTitle')} />
        <meta property="og:description" content={t('meta.ogDescription')} />
        <meta property="og:url" content={CANONICAL_URL} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:site_name" content="CreateDAO" />
        <meta property="article:published_time" content={t('meta.datePublished')} />
        <meta property="article:modified_time" content={t('meta.dateModified')} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('meta.ogTitle')} />
        <meta name="twitter:description" content={t('meta.ogDescription')} />
        <meta name="twitter:image" content={OG_IMAGE} />

        {/* JSON-LD: Article + HowTo + FAQPage + BreadcrumbList */}
        {jsonLd.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </Head>

      {/* ─────── Hero ─────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-16 md:py-24">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-200/30 dark:bg-primary-900/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary-100/40 dark:bg-primary-800/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10 max-w-4xl text-center">
          {/* Breadcrumbs */}
          <nav className="mb-6 text-sm text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
            <ol className="inline-flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-primary-600 dark:hover:text-primary-400">
                  {t('breadcrumbs.home')}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-gray-700 dark:text-gray-300" aria-current="page">
                {t('breadcrumbs.current')}
              </li>
            </ol>
          </nav>

          <div className="inline-flex items-center gap-2 bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <SparkleIcon className="w-4 h-4" />
            {t('hero.eyebrow')}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {t('hero.title')}
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
            <Link
              href="/create"
              className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
            >
              {t('hero.primaryCta')}
              <ArrowRightIcon />
            </Link>
            <Link
              href="/create?network=sepolia"
              className="inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all"
            >
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              {t('hero.secondaryCta')}
            </Link>
          </div>

          <p className="text-sm text-gray-500 dark:text-gray-400">{t('hero.trustNote')}</p>
        </div>
      </section>

      {/* ─────── TL;DR ─────── */}
      <section className="py-12 md:py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-gradient-to-br from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border border-primary-200 dark:border-primary-800 rounded-2xl p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t('tldr.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {tldrSteps.map((s) => (
                <div
                  key={s.number}
                  className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700"
                >
                  <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold mb-3">
                    {s.number}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{s.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{s.description}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{t('tldr.footnote')}</p>
          </div>
        </div>
      </section>

      {/* ─────── What is a DAO? ─────── */}
      <section className="py-16 md:py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <SectionHeader title={t('whatIsDao.title')} />
          <p
            className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6"
            dangerouslySetInnerHTML={{ __html: t('whatIsDao.paragraph1') }}
          />
          <p
            className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-10"
            dangerouslySetInnerHTML={{ __html: t('whatIsDao.paragraph2') }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {characteristics.map((c, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <CheckIcon className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{c.title}</h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 ml-11">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────── What Gets Deployed ─────── */}
      <section className="py-16 md:py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-5xl">
          <SectionHeader
            title={t('whatGetsDeployed.title')}
            subtitle={t('whatGetsDeployed.subtitle')}
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Token */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
                <TokenIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                {t('whatGetsDeployed.contracts.token.name')}
              </h3>
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-3">
                {t('whatGetsDeployed.contracts.token.tagline')}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('whatGetsDeployed.contracts.token.description')}
              </p>
            </div>

            {/* Governor */}
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-2xl p-6">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4">
                <GovernorIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                {t('whatGetsDeployed.contracts.governor.name')}
              </h3>
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-3">
                {t('whatGetsDeployed.contracts.governor.tagline')}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('whatGetsDeployed.contracts.governor.description')}
              </p>
            </div>

            {/* Treasury */}
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-6">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4">
                <TreasuryIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                {t('whatGetsDeployed.contracts.treasury.name')}
              </h3>
              <p className="text-sm font-medium text-green-600 dark:text-green-400 mb-3">
                {t('whatGetsDeployed.contracts.treasury.tagline')}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {t('whatGetsDeployed.contracts.treasury.description')}
              </p>
            </div>
          </div>

          {/* Distribution table */}
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {t('whatGetsDeployed.distributionTitle')}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <tbody>
                  {distribution.map((d, i) => (
                    <tr
                      key={i}
                      className="border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                    >
                      <td className="py-3 pr-4 font-medium text-gray-900 dark:text-white">
                        {d.recipient}
                      </td>
                      <td className="py-3 pr-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                          {d.allocation}
                        </span>
                      </td>
                      <td className="py-3 text-sm text-gray-600 dark:text-gray-400">{d.purpose}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p
              className="text-sm text-gray-600 dark:text-gray-400 mt-4"
              dangerouslySetInnerHTML={{ __html: t('whatGetsDeployed.fixedSupplyNote') }}
            />
          </div>
        </div>
      </section>

      {/* ─────── What You Need ─────── */}
      <section className="py-16 md:py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4 max-w-5xl">
          <SectionHeader
            title={t('whatYouNeed.title')}
            subtitle={t('whatYouNeed.subtitle')}
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* NYKNYC option */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-primary-200 dark:border-primary-800 p-6 relative">
              <span className="absolute top-4 right-4 text-xs font-semibold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full">
                {t('whatYouNeed.options.nyknyc.badge')}
              </span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 pr-24">
                {t('whatYouNeed.options.nyknyc.title')}
              </h3>
              <p
                className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: t('whatYouNeed.options.nyknyc.description') }}
              />
              <a
                href="https://nyknyc.app?utm_source=createdao&utm_medium=guide&utm_campaign=how-to-create-a-dao"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold hover:underline"
              >
                {t('whatYouNeed.options.nyknyc.cta')}
              </a>
            </div>

            {/* Standard wallet option */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 relative">
              <span className="absolute top-4 right-4 text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full">
                {t('whatYouNeed.options.wallet.badge')}
              </span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 pr-24">
                {t('whatYouNeed.options.wallet.title')}
              </h3>
              <p
                className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: t('whatYouNeed.options.wallet.description') }}
              />
              <Link
                href="/create"
                className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-semibold hover:underline"
              >
                {t('whatYouNeed.options.wallet.cta')}
              </Link>
            </div>
          </div>

          {/* Plan checklist */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {t('whatYouNeed.planTitle')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{t('whatYouNeed.planIntro')}</p>
            <ul className="space-y-3">
              {planItems.map((p, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">{p.label}</span>
                    <span className="text-gray-500 dark:text-gray-400"> — {p.example}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ─────── Step by Step ─────── */}
      <section className="py-16 md:py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-4xl">
          <SectionHeader title={t('stepByStep.title')} subtitle={t('stepByStep.subtitle')} centered />

          <div className="space-y-6 mb-12">
            {steps.map((s) => (
              <div
                key={s.number}
                id={`step-${s.number}`}
                className="bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8"
              >
                <div className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {s.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {s.title}
                    </h3>
                    <p
                      className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4"
                      dangerouslySetInnerHTML={{ __html: s.description }}
                    />
                    <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-3 rounded-r-lg">
                      <p className="text-sm text-blue-900 dark:text-blue-200">
                        💡 <strong>Tip:</strong> {s.tip}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mid-page CTA */}
          <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-8 md:p-10 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
              {t('stepByStep.midCtaTitle')}
            </h3>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              {t('stepByStep.midCtaDescription')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/create"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
              >
                {t('stepByStep.midCtaPrimary')}
                <ArrowRightIcon />
              </Link>
              <Link
                href="/create?network=sepolia"
                className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20"
              >
                {t('stepByStep.midCtaSecondary')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────── Governance Parameters ─────── */}
      <section className="py-16 md:py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4 max-w-4xl">
          <SectionHeader title={t('parameters.title')} subtitle={t('parameters.subtitle')} centered />

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {parameters.map((p, i) => (
              <div
                key={i}
                className={`p-6 ${
                  i !== parameters.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{p.label}</h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                      {p.value}
                    </span>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        p.changeable.startsWith('No')
                          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                      }`}
                    >
                      {p.changeable}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────── After Deployment ─────── */}
      <section className="py-16 md:py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-5xl">
          <SectionHeader
            title={t('afterDeployment.title')}
            subtitle={t('afterDeployment.subtitle')}
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {afterActions.map((a, i) => (
              <div
                key={i}
                className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
              >
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-4">
                  <span className="font-bold text-primary-600 dark:text-primary-400">{i + 1}</span>
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{a.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {a.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────── Zenland Real-World Example ─────── */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-gray-50 to-primary-50 dark:from-gray-800/50 dark:to-primary-900/20">
        <div className="container mx-auto px-4 max-w-3xl">
          <SectionHeader title={t('zenland.title')} />
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {t('zenland.paragraph1')}
          </p>
          <p
            className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-4"
            dangerouslySetInnerHTML={{ __html: t('zenland.paragraph2') }}
          />
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {t('zenland.paragraph3')}
          </p>
        </div>
      </section>

      {/* ─────── Comparison Table ─────── */}
      <section className="py-16 md:py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-5xl">
          <SectionHeader title={t('comparison.title')} subtitle={t('comparison.subtitle')} centered />

          <div className="overflow-x-auto bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700">
            <table className="w-full text-left">
              <thead className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="py-4 px-4 text-sm font-semibold text-gray-900 dark:text-white">
                    {t('comparison.headers.feature')}
                  </th>
                  <th className="py-4 px-4 text-sm font-semibold text-primary-600 dark:text-primary-400">
                    {t('comparison.headers.createdao')}
                  </th>
                  <th className="py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t('comparison.headers.aragon')}
                  </th>
                  <th className="py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t('comparison.headers.colony')}
                  </th>
                  <th className="py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {t('comparison.headers.manual')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, i) => (
                  <tr
                    key={i}
                    className={`${
                      i !== comparisonRows.length - 1
                        ? 'border-b border-gray-200 dark:border-gray-700'
                        : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                      {row.feature}
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-primary-700 dark:text-primary-300">
                      {row.createdao}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {row.aragon}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {row.colony}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-400">
                      {row.manual}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p
            className="text-gray-700 dark:text-gray-300 mt-6 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: t('comparison.summary') }}
          />
        </div>
      </section>

      {/* ─────── FAQ ─────── */}
      <section className="py-16 md:py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4 max-w-3xl">
          <SectionHeader title={t('faq.title')} centered />

          <div className="space-y-4">
            {faqItems.map((item, i) => (
              <details
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 group"
              >
                <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{item.question}</h3>
                  <svg
                    className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div
                  className="px-5 pb-5 text-gray-700 dark:text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: item.answer }}
                />
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─────── Final CTA ─────── */}
      <section className="py-16 md:py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
              {t('finalCta.title')}
            </h2>
            <p className="text-primary-100 text-lg mb-8">{t('finalCta.subtitle')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
              <Link
                href="/create"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors text-lg"
              >
                {t('finalCta.primaryCta')}
                <ArrowRightIcon />
              </Link>
              <Link
                href="/create?network=sepolia"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20 text-lg"
              >
                {t('finalCta.secondaryCta')}
              </Link>
            </div>
            <p className="text-sm text-primary-100">{t('finalCta.trustNote')}</p>
          </div>
        </div>
      </section>

      {/* ─────── Related ─────── */}
      <section className="py-16 md:py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4 max-w-5xl">
          <SectionHeader title={t('related.title')} centered />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedItems.map((item, i) => {
              const isExternal = item.href.startsWith('http');
              const className =
                'block bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-700 transition-all';
              const inner = (
                <>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{item.description}</p>
                  <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                    {item.cta}
                  </span>
                </>
              );

              return isExternal ? (
                <a
                  key={i}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {inner}
                </a>
              ) : (
                <Link key={i} href={item.href} className={className}>
                  {inner}
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(
        locale || 'en',
        ['common', 'navigation', 'how-to-create-a-dao'],
        nextI18NextConfig
      )),
    },
  };
};

export default HowToCreateDaoPage;
