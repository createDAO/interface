import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';
import { WalletButton } from '../dao/WalletButton';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showWalletPopup, setShowWalletPopup] = useState(false);
  const { address } = useAccount();
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isHomePage = router.pathname === '/';

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="h-8 w-32">
            <Logo />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {isHomePage ? (
            <>
              <Link href="#features" className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
                Features
              </Link>
              <Link href="#how-it-works" className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
                How It Works
              </Link>
              <Link href="#networks" className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
                Networks
              </Link>
              <Link href="#faq" className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
                FAQ
              </Link>
            </>
          ) : (
            <Link href="/" className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
              Home
            </Link>
          )}
          <Link href="/create" className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
            Create DAO
          </Link>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center space-x-4 md:hidden">
          <ThemeToggle />
          <button 
            onClick={toggleMenu}
            className="text-gray-700 dark:text-gray-300"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 shadow-lg">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {isHomePage ? (
              <>
                <Link href="#features" className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 py-2">
                  Features
                </Link>
                <Link href="#how-it-works" className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 py-2">
                  How It Works
                </Link>
                <Link href="#networks" className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 py-2">
                  Networks
                </Link>
                <Link href="#faq" className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 py-2">
                  FAQ
                </Link>
              </>
            ) : (
              <Link href="/" className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 py-2">
                Home
              </Link>
            )}
            <Link href="/create" className="text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 py-2">
              Create DAO
            </Link>
            {address ? (
              <div className="py-2">
                <WalletButton />
              </div>
            ) : (
              <button 
                onClick={() => router.push('/create')}
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 w-full"
              >
                Connect
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
