import { useTranslation } from 'react-i18next';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { t } = useTranslation();
  const { language, setLanguage, languages } = useLanguage();

  return (
    <div className={`flex items-center gap-2 ${compact ? '' : 'px-3 py-2'}`}>
      {!compact && <Globe className="w-4 h-4 text-gray-500" />}
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as typeof language)}
        className="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
        aria-label={t('common.language')}
      >
        {languages.map((l) => (
          <option key={l.code} value={l.code}>
            {l.nativeName}
          </option>
        ))}
      </select>
    </div>
  );
}
