import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Thermometer, CloudRain, Droplets, Wind, RefreshCw, Sun, Cloud, CloudDrizzle, CloudLightning } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { generateDemoWeather, weatherRiskScore, getLocalizedCondition } from '@/services/weather';
import { riskCategoryFromScore } from '@/services/riskEngine';

export default function WeatherPage() {
  const { t } = useTranslation();
  const { profile } = useProfile();
  const { language } = useLanguage();

  const weather = useMemo(() => generateDemoWeather(profile?.location || 'Tamil Nadu'), [profile?.location]);
  const riskScore = weatherRiskScore(weather);
  const riskCat = riskCategoryFromScore(riskScore);

  const conditionIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="w-8 h-8 text-yellow-500" />;
      case 'cloudy': return <Cloud className="w-8 h-8 text-gray-400" />;
      case 'rainy': return <CloudDrizzle className="w-8 h-8 text-blue-500" />;
      case 'thunderstorm': return <CloudLightning className="w-8 h-8 text-purple-500" />;
      case 'partlyCloudy': return <Cloud className="w-8 h-8 text-gray-400" />;
      default: return <Sun className="w-8 h-8 text-yellow-500" />;
    }
  };

  const riskColor = (cat: string) => {
    if (cat === 'high') return 'bg-red-50 text-red-700 border-red-200';
    if (cat === 'moderate') return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-green-50 text-green-700 border-green-200';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('weather.title')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('weather.subtitle')}</p>
        </div>
        <button className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50">
          <RefreshCw className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
        {t('weather.demoNotice')}
      </div>

      {/* Current conditions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-semibold text-gray-800">{t('weather.currentConditions')}</h2>
            <p className="text-sm text-gray-500">{weather.location}</p>
          </div>
          {conditionIcon(weather.condition)}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
              <Thermometer className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{weather.temperature_c}°C</p>
              <p className="text-xs text-gray-500">{t('weather.condition')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <CloudRain className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{weather.rain_probability}%</p>
              <p className="text-xs text-gray-500">{t('dashboard.rainProbability')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center">
              <Droplets className="w-5 h-5 text-cyan-500" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{weather.humidity}%</p>
              <p className="text-xs text-gray-500">{t('dashboard.humidity')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
              <Wind className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{weather.wind_speed}</p>
              <p className="text-xs text-gray-500">{t('weather.windSpeed')}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {getLocalizedCondition(weather.condition, language)}
          </p>
          <div className={`px-3 py-1.5 rounded-lg border text-sm font-medium ${riskColor(riskCat)}`}>
            {t('weather.weatherRisk')}: {riskScore}/100
          </div>
        </div>
      </motion.div>

      {/* Forecast */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-4">{t('weather.forecast')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
          {weather.forecast.map((day, i) => (
            <div key={i} className="text-center p-3 rounded-xl bg-gray-50">
              <p className="text-xs font-medium text-gray-600 mb-2">{day.day}</p>
              <div className="flex justify-center mb-2">{conditionIcon(day.condition)}</div>
              <p className="text-sm font-bold text-gray-900">{day.temp_max}°</p>
              <p className="text-xs text-gray-400">{day.temp_min}°</p>
              <p className="text-xs text-blue-500 mt-1">{day.rain_probability}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
