import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Settings as SettingsIcon, Globe, Bell, Volume2, Database, Info, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNetwork } from '@/contexts/NetworkContext';

export default function SettingsPage() {
  const { t } = useTranslation();
  const { language, setLanguage, languages } = useLanguage();
  const { setSimulatedOffline, simulatedOffline } = useNetwork();
  const [notifications, setNotifications] = useState(true);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [cacheCleared, setCacheCleared] = useState(false);

  const handleClearCache = () => {
    setCacheCleared(true);
    setTimeout(() => setCacheCleared(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('settings.title')}</h1>
        <p className="text-gray-500 text-sm mt-1">{t('settings.subtitle')}</p>
      </div>

      {/* Language */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-5 h-5 text-green-600" />
          <h2 className="font-semibold text-gray-800">{t('settings.language')}</h2>
        </div>
        <p className="text-sm text-gray-500 mb-3">{t('settings.languageDescription')}</p>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as typeof language)}
          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          {languages.map((l) => (
            <option key={l.code} value={l.code}>{l.nativeName}</option>
          ))}
        </select>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Bell className="w-5 h-5 text-green-600" />
          <h2 className="font-semibold text-gray-800">{t('settings.notifications')}</h2>
        </div>
        <p className="text-sm text-gray-500 mb-3">{t('settings.notificationsDescription')}</p>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
            className="w-4 h-4 rounded text-green-600 focus:ring-green-500"
          />
          <span className="text-sm text-gray-700">{t('settings.enableNotifications')}</span>
        </label>
      </div>

      {/* Voice */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Volume2 className="w-5 h-5 text-green-600" />
          <h2 className="font-semibold text-gray-800">{t('settings.voice')}</h2>
        </div>
        <p className="text-sm text-gray-500 mb-3">{t('settings.voiceDescription')}</p>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={autoSpeak}
            onChange={(e) => setAutoSpeak(e.target.checked)}
            className="w-4 h-4 rounded text-green-600 focus:ring-green-500"
          />
          <span className="text-sm text-gray-700">{t('settings.autoSpeak')}</span>
        </label>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Database className="w-5 h-5 text-green-600" />
          <h2 className="font-semibold text-gray-800">{t('settings.dataManagement')}</h2>
        </div>
        <p className="text-sm text-gray-500 mb-3">{t('settings.clearCacheDescription')}</p>
        <button
          onClick={handleClearCache}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
        >
          {t('settings.clearCache')}
        </button>
        {cacheCleared && (
          <span className="flex items-center gap-1 text-sm text-green-600 ml-3">
            <CheckCircle className="w-4 h-4" />
            {t('settings.cacheCleared')}
          </span>
        )}
      </div>

      {/* About */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Info className="w-5 h-5 text-green-600" />
          <h2 className="font-semibold text-gray-800">{t('settings.about')}</h2>
        </div>
        <p className="text-sm text-gray-600">{t('settings.aboutText')}</p>
      </div>
    </div>
  );
}
