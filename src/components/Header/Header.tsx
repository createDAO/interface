import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';
import { Logo } from '../Logo/Logo';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const location = useLocation();

  const toggleMenu = () => {
    const newMenuState = !isMenuOpen;
    setIsMenuOpen(newMenuState);
    document.body.style.overflow = newMenuState ? 'hidden' : 'unset';
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setIsDarkMode(savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    const theme = newTheme ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  };

  // Reset overflow when location changes
  useEffect(() => {
    document.body.style.overflow = 'unset';
  }, [location]);

  // Reset overflow on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/verify', label: 'Verify' },
    { path: '/community', label: 'Community' },
  ];

  return (
    <header className={`${styles.header} ${isMenuOpen ? styles.menuOpen : ''}`}>
      <div className={styles.headerContent}>
        <Link to="/" className={styles.logoContainer}>
          <Logo />
        </Link>

        <div className={styles.headerRight}>
          <div className={styles.headerActions}>
            <nav className={styles.desktopNav}>
              <ul className={styles.navList}>
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`${styles.navLink} ${
                        location.pathname === item.path ? styles.active : ''
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/create-dao" className={styles.ctaButton}>
                    Create DAO
                  </Link>
                </li>
              </ul>
            </nav>
            <button
              onClick={toggleTheme}
              className={styles.themeToggle}
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <svg className={styles.themeIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="5" fill="currentColor"/>
                  <path d="M12 3V5M12 19V21M3 12H5M19 12H21M5.636 5.636L7.05 7.05M16.95 16.95L18.364 18.364M18.364 5.636L16.95 7.05M7.05 16.95L5.636 18.364" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round"
                  />
                  <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" 
                    fill="currentColor"
                  />
                </svg>
              ) : (
                <svg className={styles.themeIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" 
                    fill="currentColor"
                  />
                </svg>
              )}
            </button>

            <button 
              className={`${styles.menuButton} ${isMenuOpen ? styles.open : ''}`}
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>

          <div className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ''}`}>
            <nav>
              <ul className={styles.mobileNavList}>
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`${styles.mobileNavLink} ${
                        location.pathname === item.path ? styles.active : ''
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to="/create-dao"
                    className={styles.mobileCtaButton}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Create DAO
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
