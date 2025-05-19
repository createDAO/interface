import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';

const LanguageSwitcher: React.FC = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Define all supported languages
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'zh', name: '简体中文' },
    { code: 'ru', name: 'Русский' },
    // { code: 'es', name: 'Español' },
    { code: 'ko', name: '한국어' },
    { code: 'ja', name: '日本語' },
    // { code: 'pt', name: 'Português' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'vi', name: 'Tiếng Việt' },
    // { code: 'de', name: 'Deutsch' },
    // { code: 'fr', name: 'Français' },
    // { code: 'hi', name: 'हिन्दी' },
    { code: 'id', name: 'Bahasa Indonesia' }
  ];

  // Ensure hydration completes before rendering translated content
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get current language
  const currentLanguage = languages.find(lang => lang.code === router.locale) || languages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Change language
  const changeLanguage = (locale: string) => {
    setIsOpen(false);
    // Manually change the language in i18n
    i18n.changeLanguage(locale);
    // Router will handle the URL change
  };

  // If not mounted yet, render a placeholder to avoid hydration mismatch
  if (!mounted) {
    return <div className="relative"></div>;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 cursor-pointer"
        aria-label={t('languageSelector')}
      >
        <span>{currentLanguage.name}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      <div
        className={`absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 transition-all duration-200 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="py-1">
          {languages.map((language) => (
            <Link
              href={router.asPath}
              locale={language.code}
              key={language.code}
              onClick={() => changeLanguage(language.code)}
              className={`block px-4 py-2 text-sm ${
                router.locale === language.code
                  ? 'bg-gray-100 dark:bg-gray-700 text-primary-600 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {language.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
