import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CloudRain,
  Sprout,
  Lightbulb,
  ShieldAlert,
  Droplets,
  Wind,
  Thermometer,
  TrendingUp,
  ArrowRight,
  MessageSquare,
  GitCompare,
  Landmark,
} from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { generateDemoWeather, weatherRiskScore, getLocalizedCondition } from '@/services/weather';
import { analyzeRisk, getLocalizedReasons, getLocalizedRecommendation } from '@/services/riskEngine';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNetwork } from '@/contexts/NetworkContext';

export default function DashboardPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { profile } = useProfile();
  const { language } = useLanguage();
  const { alerts } = useNotifications();
  const { simulatedOffline } = useNetwork();

  const weather = useMemo(() => generateDemoWeather(profile?.location || 'Tamil Nadu'), [profile?.location]);
  const weatherRisk = weatherRiskScore(weather);

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

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return t('dashboard.greetingMorning');
    if (h < 17) return t('dashboard.greetingAfternoon');
    return t('dashboard.greetingEvening');
  })();

  const riskColor = (cat: string) => {
    if (cat === 'high') return 'text-red-600 bg-red-50';
    if (cat === 'moderate') return 'text-amber-600 bg-amber-50';
    return 'text-green-600 bg-green-50';
  };

  const riskLabel = (cat: string) => {
    if (cat === 'high') return t('dashboard.riskHigh');
    if (cat === 'moderate') return t('dashboard.riskModerate');
    return t('dashboard.riskLow');
  };

  const quickActions = [
    { icon: MessageSquare, label: t('dashboard.askAssistant'), to: '/app/assistant' },
    { icon: CloudRain, label: t('dashboard.checkWeather'), to: '/app/weather' },
    { icon: GitCompare, label: t('dashboard.simulateDecision'), to: '/app/what-if' },
    { icon: Landmark, label: t('dashboard.findSchemes'), to: '/app/schemes' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {greeting}, {profile?.full_name || 'Farmer'}!
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {new Date().toLocaleDateString(language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : 'en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      {simulatedOffline && (
        <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          {t('common.demoData')}
        </div>
      )}

      {/* Main cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <CloudRain className="w-5 h-5 text-blue-500" />
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${riskColor(weatherRisk >= 70 ? 'high' : weatherRisk >= 40 ? 'moderate' : 'low')}`}>
              {riskLabel(weatherRisk >= 70 ? 'high' : weatherRisk >= 40 ? 'moderate' : 'low')}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{weatherRisk}/100</p>
          <p className="text-sm text-gray-500 mt-1">{t('dashboard.weatherRisk')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <Sprout className="w-5 h-5 text-green-500" />
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${riskColor(risk?.category || 'low')}`}>
              {risk?.category === 'high' ? t('dashboard.critical') : risk?.category === 'moderate' ? t('dashboard.needsAttention') : t('dashboard.good')}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900 capitalize">{profile?.crop || '—'}</p>
          <p className="text-sm text-gray-500 mt-1">{t('dashboard.cropHealth')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-amber-500" />
            </div>
          </div>
          <p className="text-sm font-medium text-gray-700 line-clamp-2">
            {risk ? getLocalizedRecommendation(risk.recommendation, language) : t('dashboard.noRecommendations')}
          </p>
          <p className="text-sm text-gray-500 mt-1">{t('dashboard.todayRecommendation')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-red-500" />
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${riskColor(risk?.category || 'low')}`}>
              {riskLabel(risk?.category || 'low')}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{risk?.score ?? 0}/100</p>
          <p className="text-sm text-gray-500 mt-1">{t('dashboard.farmRiskScore')}</p>
        </motion.div>
      </div>

      {/* Weather details */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-4">{t('dashboard.currentWeather')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <Thermometer className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-lg font-bold text-gray-900">{weather.temperature_c}°C</p>
              <p className="text-xs text-gray-500">{t('dashboard.temperature')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CloudRain className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-lg font-bold text-gray-900">{weather.rain_probability}%</p>
              <p className="text-xs text-gray-500">{t('dashboard.rainProbability')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Droplets className="w-5 h-5 text-cyan-500" />
            <div>
              <p className="text-lg font-bold text-gray-900">{weather.humidity}%</p>
              <p className="text-xs text-gray-500">{t('dashboard.humidity')}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Wind className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-lg font-bold text-gray-900">{weather.wind_speed} km/h</p>
              <p className="text-xs text-gray-500">{t('dashboard.wind')}</p>
            </div>
          </div>
        </div>
        <p className="text-xs text-amber-600 mt-3">{t('weather.demoNotice')}</p>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-semibold text-gray-800 mb-3">{t('dashboard.quickActions')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => navigate(action.to)}
              className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mb-2 group-hover:bg-green-100 transition-colors">
                <action.icon className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm font-medium text-gray-700 flex items-center gap-1">
                {action.label}
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Alerts + Risk reasons */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-3">{t('dashboard.recentAlerts')}</h2>
          {alerts.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center">{t('dashboard.noAlerts')}</p>
          ) : (
            <div className="space-y-2">
              {alerts.slice(0, 4).map((alert) => (
                <div key={alert.id} className="flex items-start gap-2 p-2 rounded-lg bg-gray-50">
                  <ShieldAlert className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">{alert.title}</p>
                    <p className="text-xs text-gray-500">{alert.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-3">{t('dashboard.recommendedActions')}</h2>
          {risk && risk.reasons.length > 0 ? (
            <div className="space-y-2">
              {getLocalizedReasons(risk.reasons, language).map((reason, i) => (
                <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-gray-50">
                  <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">{reason}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 py-4 text-center">{t('dashboard.noRecommendations')}</p>
          )}
        </div>
      </div>
    </div>
  );
}
