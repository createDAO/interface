import React from 'react';
import Head from 'next/head';
import Layout from '../components/layout/Layout';
import Hero from '../components/sections/Hero';
import Steps from '../components/sections/Steps';
import Features from '../components/sections/Features';
import Networks from '../components/sections/Networks';
import CTA from '../components/sections/CTA';
import FAQ from '../components/sections/FAQ';

const Home: React.FC = () => {
  return (
    <Layout>
      <Head>
        <title>CreateDAO - Create and Deploy DAOs on Multiple Blockchains</title>
        <meta name="description" content="The easiest way to create and deploy DAOs on multiple blockchains. Open source, secure, and always free." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph / Social Media Meta Tags */}
        <meta property="og:title" content="CreateDAO - Create and Deploy DAOs on Multiple Blockchains" />
        <meta property="og:description" content="The easiest way to create and deploy DAOs on multiple blockchains. Open source, secure, and always free." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://createdao.org" />
        <meta property="og:image" content="https://createdao.org/og-image.jpg" />
        
        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="CreateDAO - Create and Deploy DAOs on Multiple Blockchains" />
        <meta name="twitter:description" content="The easiest way to create and deploy DAOs on multiple blockchains. Open source, secure, and always free." />
        <meta name="twitter:image" content="https://createdao.org/twitter-image.jpg" />
      </Head>

      <Hero />
      <Steps />
      <Features />
      <Networks />
      <CTA />
      <FAQ />
    </Layout>
  );
};

export default Home;
