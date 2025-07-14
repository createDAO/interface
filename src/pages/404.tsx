import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
// import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { GetStaticProps } from 'next';
import nextI18NextConfig from '../../next-i18next.config.js';
import Layout from '../components/layout/Layout';

const Custom404: React.FC = () => {
  // const { t } = useTranslation('common');

  return (
    <Layout>
      <Head>
        <title>404 - Page Not Found | CreateDAO</title>
        <meta name="description" content="The page you're looking for could not be found." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-700">404</h1>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Page Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
          </div>

          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
            >
              Go Home
            </Link>

            <div className="flex justify-center space-x-4 text-sm">
              <Link
                href="/create"
                className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Create DAO
              </Link>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <Link
                href="/daos"
                className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Browse DAOs
              </Link>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <Link
                href="/dao-features"
                className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Features
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(locale || 'en', [
        'common',
        'navigation',
      ], nextI18NextConfig)),
    },
  };
};

export default Custom404;
