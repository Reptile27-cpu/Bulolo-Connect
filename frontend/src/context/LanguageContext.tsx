'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import enTranslations from '@shared/locales/en.json';
import tpiTranslations from '@shared/locales/tpi.json';

type Language = 'en' | 'tpi';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string, defaultValue?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: () => ''
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const saved = localStorage.getItem('bulolo_lang') as Language;
    if (saved === 'en' || saved === 'tpi') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bulolo_lang', lang);
    }
  };

  const t = (path: string, defaultValue?: string): string => {
    const dict = language === 'tpi' ? tpiTranslations : enTranslations;
    const keys = path.split('.');
    let current: any = dict;

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return defaultValue || path;
      }
    }

    return typeof current === 'string' ? current : defaultValue || path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
