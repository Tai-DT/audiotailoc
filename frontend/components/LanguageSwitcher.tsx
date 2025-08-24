"use client"

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { locales, localeConfig, defaultLocale, type Locale, addLocaleToPathname, removeLocaleFromPathname, getLocaleFromPathname } from '@/lib/i18n';

interface LanguageSwitcherProps {
  currentLocale: Locale;
  className?: string;
}

export default function LanguageSwitcher({ currentLocale, className = '' }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (newLocale: Locale) => {
    setIsOpen(false);
    
    // Remove current locale from pathname
    const pathWithoutLocale = removeLocaleFromPathname(pathname, getLocaleFromPathname(pathname));
    
    // Add new locale to pathname
    const newPath = addLocaleToPathname(pathWithoutLocale, newLocale);
    
    // Navigate to new path
    router.push(newPath);
  };

  const currentConfig = localeConfig[currentLocale] || localeConfig[defaultLocale];

  if (!currentConfig) {
    console.error('Invalid locale:', currentLocale);
    return null;
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-lg">{currentConfig.flag}</span>
        <span className="hidden sm:block">{currentConfig.name}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {locales.map((locale) => {
              const config = localeConfig[locale];
              const isActive = locale === currentLocale;
              
              return (
                <button
                  key={locale}
                  onClick={() => handleLanguageChange(locale)}
                  className={`flex items-center w-full px-4 py-2 text-sm text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100 ${
                    isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                  role="menuitem"
                  disabled={isActive}
                >
                  <span className="text-lg mr-3">{config.flag}</span>
                  <div className="flex-1">
                    <div className="font-medium">{config.name}</div>
                    <div className="text-xs text-gray-500">{config.currency}</div>
                  </div>
                  {isActive && (
                    <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Compact version for mobile
export function CompactLanguageSwitcher({ currentLocale, className = '' }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (newLocale: Locale) => {
    setIsOpen(false);
    const pathWithoutLocale = removeLocaleFromPathname(pathname, getLocaleFromPathname(pathname));
    const newPath = addLocaleToPathname(pathWithoutLocale, newLocale);
    router.push(newPath);
  };

  const currentConfig = localeConfig[currentLocale] || localeConfig[defaultLocale];

  if (!currentConfig) {
    console.error('Invalid locale:', currentLocale);
    return null;
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10 text-lg bg-white border border-gray-300 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title={currentConfig.name}
      >
        {currentConfig.flag}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 bg-white border border-gray-200 rounded-md shadow-lg">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {locales.map((locale) => {
              const config = localeConfig[locale];
              const isActive = locale === currentLocale;
              
              return (
                <button
                  key={locale}
                  onClick={() => handleLanguageChange(locale)}
                  className={`flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100 focus:outline-none focus:bg-gray-100 ${
                    isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                  role="menuitem"
                  disabled={isActive}
                >
                  <span className="text-lg mr-2">{config.flag}</span>
                  <span className="font-medium">{config.name}</span>
                  {isActive && (
                    <svg className="w-4 h-4 ml-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Hook for using translations
export function useTranslations() {
  const pathname = usePathname();
  const currentLocale = getLocaleFromPathname(pathname);
  
  return {
    locale: currentLocale,
    formatCurrency: (amount: number, currency?: string) => {
      const config = localeConfig[currentLocale];
      const currencyCode = currency || config.currency;
      
      try {
        return new Intl.NumberFormat(config.numberFormat, {
          style: 'currency',
          currency: currencyCode,
          minimumFractionDigits: currencyCode === 'VND' ? 0 : 2,
        }).format(amount);
      } catch (error) {
        const symbol = currency === 'USD' ? '$' : '₫';
        const formattedAmount = new Intl.NumberFormat(config.numberFormat).format(amount);
        return currencyCode === 'VND' ? `${formattedAmount}${symbol}` : `${symbol}${formattedAmount}`;
      }
    },
    formatNumber: (number: number) => {
      const config = localeConfig[currentLocale];
      return new Intl.NumberFormat(config.numberFormat).format(number);
    },
    formatDate: (date: Date, options?: Intl.DateTimeFormatOptions) => {
      const config = localeConfig[currentLocale];
      const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      };
      
      return new Intl.DateTimeFormat(config.numberFormat, { ...defaultOptions, ...options }).format(date);
    },
    formatRelativeTime: (date: Date) => {
      const config = localeConfig[currentLocale];
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      const rtf = new Intl.RelativeTimeFormat(config.numberFormat, { numeric: 'auto' });
      
      if (diffInSeconds < 60) {
        return rtf.format(-diffInSeconds, 'second');
      } else if (diffInSeconds < 3600) {
        return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
      } else if (diffInSeconds < 86400) {
        return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
      } else if (diffInSeconds < 2592000) {
        return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
      } else if (diffInSeconds < 31536000) {
        return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
      } else {
        return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
      }
    },
  };
}
