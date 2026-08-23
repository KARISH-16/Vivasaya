import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Sprout, AlertTriangle, CheckCircle, ListChecks, RefreshCw } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { generateDemoWeather } from '@/services/weather';
import { analyzeRisk, getLocalizedReasons, getLocalizedRecommendation } from '@/services/riskEngine';

export default function CropPage() {
  const { t } = useTranslation();
  const { profile, updateCropStage } = useProfile();
  const { language } = useLanguage();
  const [saving, setSaving] = useState(false);

  const weather = useMemo(() => generateDemoWeather(profile?.location || 'Tamil Nadu'), [profile?.location]);

  const risk = useMemo(() => {
    if (!profile) return null;
    return analyzeRisk({
      rainProbability: weather.rain_probability,
      temperature: weather.temperature_c,
      humidity: weather.humidity,
      windSpeed: weather.wind_speed,
      crop: profile.crop,
      cropStage: profile.crop_stage,
      soilType: profile.soil_type,
      irrigationType: profile.irrigation_type,
    });
  }, [profile, weather]);

  if (!profile || !profile.crop) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('crop.title')}</h1>
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
          <Sprout className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{t('crop.noCropSelected')}</p>
        </div>
      </div>
    );
  }

  const stages = ['seeding', 'vegetative', 'flowering', 'grainFilling', 'maturity', 'harvest'];
  const checklist = [
    t('crop.stages.' + profile.crop_stage) + ' — ' + (language === 'ta' ? 'தினசரி கண்காணிப்பு' : language === 'hi' ? 'दैनिक निगरानी' : 'Daily monitoring'),
    language === 'ta' ? 'இலை நோய் சரிபார்க்கவும்' : language === 'hi' ? 'पत्ती रोग जांचें' : 'Check for leaf diseases',
    language === 'ta' ? 'ஈரப்பதம் கண்காணிக்கவும்' : language === 'hi' ? 'नमी की निगरानी' : 'Monitor soil moisture',
    language === 'ta' ? 'பூச்சி தாக்குதல் சரிபார்க்கவும்' : language === 'hi' ? 'कीट जांच' : 'Check for pest activity',
  ];

  const handleStageChange = async (stage: string) => {
    setSaving(true);
    await updateCropStage(stage);
    setSaving(false);
  };

  const riskColor = (cat: string) => {
    if (cat === 'high') return 'bg-red-50 text-red-700 border-red-200';
    if (cat === 'moderate') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-green-50 text-green-700 border-green-200';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('crop.title')}</h1>
        <p className="text-gray-500 text-sm mt-1">{t('crop.subtitle')}</p>
      </div>

      {/* Crop overview */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
            <Sprout className="w-7 h-7 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 capitalize">{profile.crop}</h2>
            <p className="text-sm text-gray-500">{profile.crop_variety || '—'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-400">{t('crop.cropStage')}</p>
            <p className="text-sm font-medium text-gray-700">{t('crop.stages.' + (profile.crop_stage || 'seeding'))}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">{t('profile.soilType')}</p>
            <p className="text-sm font-medium text-gray-700">{t('profile.soilTypes.' + (profile.soil_type || 'loam'))}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">{t('profile.irrigationType')}</p>
            <p className="text-sm font-medium text-gray-700">{t('profile.irrigationTypes.' + (profile.irrigation_type || 'rainfed'))}</p>
          </div>
        </div>
      </motion.div>

      {/* Current risk */}
      {risk && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-800">{t('crop.currentRisk')}</h2>
            <div className={`px-3 py-1.5 rounded-lg border text-sm font-medium ${riskColor(risk.category)}`}>
              {risk.score}/100
            </div>
          </div>
          <div className="space-y-2">
            {getLocalizedReasons(risk.reasons, language).map((reason, i) => (
              <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-gray-50">
                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700">{reason}</p>
              </div>
            ))}
          </div>
          <div className="mt-3 p-3 rounded-lg bg-green-50 flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-green-700">{getLocalizedRecommendation(risk.recommendation, language)}</p>
          </div>
        </div>
      )}

      {/* Update stage */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-3">{t('crop.updateStage')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {stages.map((stage) => (
            <button
              key={stage}
              onClick={() => handleStageChange(stage)}
              disabled={saving}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                profile.crop_stage === stage
                  ? 'bg-green-50 border-green-500 text-green-700'
                  : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t('crop.stages.' + stage)}
            </button>
          ))}
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <ListChecks className="w-5 h-5 text-green-600" />
          <h2 className="font-semibold text-gray-800">{t('crop.monitoringChecklist')}</h2>
        </div>
        <div className="space-y-2">
          {checklist.map((item, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              <p className="text-sm text-gray-700">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
