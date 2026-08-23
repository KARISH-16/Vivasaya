import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { useTranslation } from 'react-i18next';
import type { LanguageCode } from '@/types';
import { LANGUAGES } from './i18n';

interface LanguageContextValue {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  languages: typeof LANGUAGES;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { i18n } = useTranslation();

  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('vivasaya-lang');

    if (saved === 'ta' || saved === 'hi' || saved === 'en') {
      return saved;
    }

    return 'en';
  });

  useEffect(() => {
    i18n.changeLanguage(language);

    localStorage.setItem('vivasaya-lang', language);

    document.documentElement.lang = language;
  }, [language, i18n]);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        languages: LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);

  if (!ctx) {
    throw new Error(
      'useLanguage must be used within LanguageProvider'
    );
  }

  return ctx;
}
