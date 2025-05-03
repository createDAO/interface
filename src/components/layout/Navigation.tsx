import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface NavigationProps {
  isMobile?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ isMobile = false }) => {
  const router = useRouter();
  const isHomePage = router.pathname === '/';

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

  return (
    <>
      {isHomePage ? (
        <>
          <Link href="#features" className={isMobile ? getMobileLinkClasses('#features') : getLinkClasses('#features')}>
            Features
          </Link>
          <Link href="#how-it-works" className={isMobile ? getMobileLinkClasses('#how-it-works') : getLinkClasses('#how-it-works')}>
            How It Works
          </Link>
          <Link href="#networks" className={isMobile ? getMobileLinkClasses('#networks') : getLinkClasses('#networks')}>
            Networks
          </Link>
        </>
      ) : (
        <Link href="/" className={isMobile ? getMobileLinkClasses('/') : getLinkClasses('/')}>
          Home
        </Link>
      )}
      <Link 
        href="/daos" 
        prefetch={true}
        className={isMobile ? getMobileLinkClasses('/daos') : getLinkClasses('/daos')}
      >
        Deployed DAOs
      </Link>
      <Link 
        href="/create" 
        prefetch={true}
        className={isMobile ? getMobileLinkClasses('/create') : getLinkClasses('/create')}
      >
        Create DAO
      </Link>
      <Link 
        href="/dao-features" 
        prefetch={true}
        className={isMobile ? getMobileLinkClasses('/dao-features') : getLinkClasses('/dao-features')}
      >
        DAO Features
      </Link>
    </>
  );
};

export default Navigation;
