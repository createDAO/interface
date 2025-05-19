import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';
import Navigation from './Navigation';
import LanguageSwitcher from './LanguageSwitcher';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  // Reset menu state when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMenuOpen(false);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" prefetch={true} className="flex items-center">
          <div className="h-8 w-32">
            <Logo />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Navigation />
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center space-x-4 md:hidden">
          <LanguageSwitcher />
          <ThemeToggle />
          <button
            onClick={toggleMenu}
            className="text-gray-700 dark:text-gray-300 flex items-center justify-center w-8 h-8"
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6 flex items-center justify-center">
              <span className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out origin-center ${isMenuOpen ? 'rotate-45' : 'rotate-0 translate-y-[-4px]'}`}></span>
              <span className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ease-in-out origin-center ${isMenuOpen ? '-rotate-45' : 'rotate-0 translate-y-[4px]'}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-[500px] opacity-100 pointer-events-auto' : 'max-h-0 opacity-0 pointer-events-none'}`}>
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          <Navigation isMobile={true} />
        </div>
      </div>
    </header>
  );
};

export default Header;
