import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { useTranslation } from 'react-i18next';
import type { LanguageCode } from './index';

const LANGUAGES = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
  },
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
  },
] as const;

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
    const savedLanguage = localStorage.getItem('vivasaya-lang');

    if (
      savedLanguage === 'en' ||
      savedLanguage === 'ta' ||
      savedLanguage === 'hi'
    ) {
      return savedLanguage as LanguageCode;
    }

    return 'en' as LanguageCode;
  });

  useEffect(() => {
    const updateLanguage = async () => {
      try {
        await i18n.changeLanguage(language);
      } catch (error) {
        console.error('Failed to change language:', error);
      }

      localStorage.setItem('vivasaya-lang', language);
      document.documentElement.lang = language;
    };

    updateLanguage();
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
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      'useLanguage must be used within LanguageProvider'
    );
  }

  return context;
}
