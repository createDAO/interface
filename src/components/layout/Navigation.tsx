import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

interface NavigationProps {
  isMobile?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ isMobile = false }) => {
  const router = useRouter();
  const { t } = useTranslation('navigation');
  const isHomePage = router.pathname === '/';
  const [mounted, setMounted] = useState(false);

  // Ensure hydration completes before rendering translated content
  useEffect(() => {
    setMounted(true);
  }, []);

  // Function to check if a path is active
  const isActive = (path: string) => router.pathname === path;

  // Base link classes
  const baseLinkClasses = "text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400";
  const activeClasses = "text-primary-600 font-medium dark:text-primary-400";
  
  // Function to get link classes based on active state
  const getLinkClasses = (path: string) => {
    return isActive(path) ? `${baseLinkClasses} ${activeClasses}` : baseLinkClasses;
  };
  
  // Mobile link classes add padding
  const getMobileLinkClasses = (path: string) => {
    return `${getLinkClasses(path)} py-2`;
  };

  // If not mounted yet, render empty placeholders to avoid hydration mismatch
  if (!mounted) {
    return (
      <>
        {isHomePage ? (
          <>
            <span className={isMobile ? getMobileLinkClasses('#features') : getLinkClasses('#features')}></span>
            <span className={isMobile ? getMobileLinkClasses('#how-it-works') : getLinkClasses('#how-it-works')}></span>
            <span className={isMobile ? getMobileLinkClasses('#networks') : getLinkClasses('#networks')}></span>
          </>
        ) : (
          <span className={isMobile ? getMobileLinkClasses('/') : getLinkClasses('/')}></span>
        )}
        <span className={isMobile ? getMobileLinkClasses('/daos') : getLinkClasses('/daos')}></span>
        <span className={isMobile ? getMobileLinkClasses('/create') : getLinkClasses('/create')}></span>
        <span className={isMobile ? getMobileLinkClasses('/dao-features') : getLinkClasses('/dao-features')}></span>
        <span className={isMobile ? getMobileLinkClasses('/blog') : getLinkClasses('/blog')}></span>
      </>
    );
  }

  return (
    <>
      {isHomePage ? (
        <>
          <Link href="#features" className={isMobile ? getMobileLinkClasses('#features') : getLinkClasses('#features')}>
            {t('features')}
          </Link>
          <Link href="#how-it-works" className={isMobile ? getMobileLinkClasses('#how-it-works') : getLinkClasses('#how-it-works')}>
            {t('howItWorks')}
          </Link>
          <Link href="#networks" className={isMobile ? getMobileLinkClasses('#networks') : getLinkClasses('#networks')}>
            {t('networks')}
          </Link>
        </>
      ) : (
        <Link href="/" className={isMobile ? getMobileLinkClasses('/') : getLinkClasses('/')}>
          {t('home')}
        </Link>
      )}
      <Link 
        href="/daos" 
        prefetch={true}
        className={isMobile ? getMobileLinkClasses('/daos') : getLinkClasses('/daos')}
      >
        {t('deployedDAOs')}
      </Link>
      <Link 
        href="/create" 
        prefetch={true}
        className={isMobile ? getMobileLinkClasses('/create') : getLinkClasses('/create')}
      >
        {t('createDAO')}
      </Link>
      <Link
        href="/dao-features"
        prefetch={true}
        className={isMobile ? getMobileLinkClasses('/dao-features') : getLinkClasses('/dao-features')}
      >
        {t('daoFeatures')}
      </Link>
      <a
        href="/blog"
        className={isMobile ? getMobileLinkClasses('/blog') : getLinkClasses('/blog')}
      >
        {t('blog')}
      </a>
    </>
  );
};

export default Navigation;
