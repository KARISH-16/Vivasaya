import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
] as const;

const resources = {
  en: {
    translation: {
      welcome: 'Welcome',
      dashboard: 'Dashboard',
      assistant: 'AI Assistant',
      weather: 'Weather',
      crops: 'Crops',
      schemes: 'Government Schemes',
      analytics: 'Analytics',
      profile: 'Profile',
      settings: 'Settings',
      emergency: 'Emergency',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
    },
  },

  ta: {
    translation: {
      welcome: 'வரவேற்கிறோம்',
      dashboard: 'டாஷ்போர்டு',
      assistant: 'AI உதவியாளர்',
      weather: 'வானிலை',
      crops: 'பயிர்கள்',
      schemes: 'அரசு திட்டங்கள்',
      analytics: 'பகுப்பாய்வு',
      profile: 'சுயவிவரம்',
      settings: 'அமைப்புகள்',
      emergency: 'அவசரம்',
      login: 'உள்நுழைவு',
      register: 'பதிவு',
      logout: 'வெளியேறு',
    },
  },

  hi: {
    translation: {
      welcome: 'स्वागत है',
      dashboard: 'डैशबोर्ड',
      assistant: 'AI सहायक',
      weather: 'मौसम',
      crops: 'फसलें',
      schemes: 'सरकारी योजनाएं',
      analytics: 'विश्लेषण',
      profile: 'प्रोफ़ाइल',
      settings: 'सेटिंग्स',
      emergency: 'आपातकाल',
      login: 'लॉगिन',
      register: 'पंजीकरण',
      logout: 'लॉगआउट',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('vivasaya-lang') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
