import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './en';
import ta from './ta';
import hi from './hi';

export const LANGUAGES = [
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
];

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
      ta: {
        translation: ta,
      },
      hi: {
        translation: hi,
      },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
