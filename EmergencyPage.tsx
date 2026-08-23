import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Siren, Phone, AlertTriangle, ShieldAlert, Info } from 'lucide-react';

export default function EmergencyPage() {
  const { t } = useTranslation();

  const contacts = [
    { label: t('emergency.contacts.ndrf'), number: '1070' },
    { label: t('emergency.contacts.disaster'), number: '108' },
    { label: t('emergency.contacts.police'), number: '100' },
    { label: t('emergency.contacts.ambulance'), number: '108' },
    { label: t('emergency.contacts.agriculture'), number: '1800 180 1551' },
  ];

  const instructions = t('emergency.instructions', { returnObjects: true }) as string[];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-red-600 flex items-center gap-2">
          <Siren className="w-6 h-6" />
          {t('emergency.title')}
        </h1>
        <p className="text-gray-500 text-sm mt-1">{t('emergency.subtitle')}</p>
      </div>

      <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 flex items-center gap-2">
        <Info className="w-4 h-4 flex-shrink-0" />
        {t('emergency.offlineNote')}
      </div>

      {/* Severe weather warning */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-50 rounded-2xl p-6 border border-red-200"
      >
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h2 className="font-semibold text-red-800">{t('emergency.severeWeather')}</h2>
        </div>
        <p className="text-sm text-red-700">
          {t('emergency.subtitle')}
        </p>
      </motion.div>

      {/* Safety instructions */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <ShieldAlert className="w-5 h-5 text-amber-600" />
          <h2 className="font-semibold text-gray-800">{t('emergency.safetyInstructions')}</h2>
        </div>
        <div className="space-y-2">
          {instructions.map((inst, i) => (
            <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-gray-50">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                {i + 1}
              </span>
              <p className="text-sm text-gray-700">{inst}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency contacts */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-3">{t('emergency.emergencyInfo')}</h2>
        <div className="space-y-2">
          {contacts.map((contact, i) => (
            <a
              key={i}
              href={`tel:${contact.number}`}
              className="flex items-center justify-between p-3 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
            >
              <span className="text-sm text-gray-700">{contact.label}</span>
              <span className="flex items-center gap-1 text-sm font-bold text-red-600">
                <Phone className="w-4 h-4" />
                {contact.number}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
