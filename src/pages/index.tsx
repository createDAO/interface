import React from 'react';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import nextI18NextConfig from '../../next-i18next.config.js';
import Layout from '../components/layout/Layout';
import Hero from '../components/sections/Hero';
import Steps from '../components/sections/Steps';
import Features from '../components/sections/Features';
import Networks from '../components/sections/Networks';
import ManagementPlatforms from '../components/sections/ManagementPlatforms';
import CTA from '../components/sections/CTA';
import FAQ from '../components/sections/FAQ';

const Home: React.FC = () => {
  const { t } = useTranslation(['common', 'home']);
  return (
    <Layout>
      <Head>
        <title>{t('metadata.title')}</title>
        <meta name="description" content={t('metadata.description')} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" />
        
        {/* Open Graph / Social Media Meta Tags */}
        <meta property="og:title" content={t('metadata.title')} />
        <meta property="og:description" content={t('metadata.description')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://createdao.org" />
        <meta property="og:image" content="https://createdao.org/og-image.jpg" />
        
        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('metadata.title')} />
        <meta name="twitter:description" content={t('metadata.description')} />
        <meta name="twitter:image" content="https://createdao.org/twitter-image.jpg" />
      </Head>

      <Hero />
      <Steps />
      <Features />
      <Networks />
      <ManagementPlatforms />
      <CTA />
      <FAQ />
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', [
        'common',
        'navigation',
        'home',
        'faq',
      ], nextI18NextConfig)),
    },
  };
};

export default Home;
