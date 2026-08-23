import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { GitCompare, Play, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useProfile } from '@/contexts/ProfileContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { generateDemoWeather } from '@/services/weather';
import { simulateWhatIf, type WhatIfResult } from '@/services/whatIfEngine';

export default function WhatIfPage() {
  const { t } = useTranslation();
  const { profile } = useProfile();
  const { language } = useLanguage();
  const [scenario, setScenario] = useState(t('whatIf.scenarios.fertilizer'));
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [result, setResult] = useState<WhatIfResult | null>(null);
  const [loading, setLoading] = useState(false);

  const weather = useMemo(() => generateDemoWeather(profile?.location || 'Tamil Nadu'), [profile?.location]);

  const scenarios = [
    t('whatIf.scenarios.fertilizer'),
    t('whatIf.scenarios.irrigate'),
    t('whatIf.scenarios.harvest'),
    t('whatIf.scenarios.pesticide'),
  ];

  const handleSimulate = () => {
    setLoading(true);
    setTimeout(() => {
      const res = simulateWhatIf({
        scenario,
        optionALabel: optionA || (language === 'ta' ? 'விருப்பம் A' : language === 'hi' ? 'विकल्प A' : 'Option A'),
        optionBLabel: optionB || (language === 'ta' ? 'விருப்பம் B' : language === 'hi' ? 'विकल्प B' : 'Option B'),
        weather,
        profile: profile || {
          id: '', user_id: '', full_name: '', phone: '', preferred_language: language,
          location: '', state: '', farmer_type: 'small', farm_size_acres: 0,
          crop: '', crop_variety: '', crop_stage: '', soil_type: '', irrigation_type: '',
          budget_inr: 0, farming_objective: '', created_at: '', updated_at: '',
        },
        language,
      });
      setResult(res);
      setLoading(false);
    }, 500);
  };

  const chartData = result
    ? [
        { name: result.option_a.label, risk: result.option_a.risk_score, color: '#ef4444' },
        { name: result.option_b.label, risk: result.option_b.risk_score, color: '#10b981' },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('whatIf.title')}</h1>
        <p className="text-gray-500 text-sm mt-1">{t('whatIf.subtitle')}</p>
      </div>

      {/* Input form */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('whatIf.scenarioLabel')}</label>
          <select
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {scenarios.map((s, i) => (
              <option key={i} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('whatIf.optionA')}</label>
            <input
              type="text"
              value={optionA}
              onChange={(e) => setOptionA(e.target.value)}
              placeholder={t('whatIf.optionALabel')}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('whatIf.optionB')}</label>
            <input
              type="text"
              value={optionB}
              onChange={(e) => setOptionB(e.target.value)}
              placeholder={t('whatIf.optionBLabel')}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <button
          onClick={handleSimulate}
          disabled={loading}
          className="w-full py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4" />
          {loading ? t('common.loading') : t('whatIf.simulate')}
        </button>
      </div>

      {/* Results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Chart */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="font-semibold text-gray-800 mb-4">{t('whatIf.riskScore')}</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="risk" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Comparison cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[result.option_a, result.option_b].map((opt, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-3">{opt.label}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t('whatIf.riskScore')}</span>
                    <span className={`font-medium ${opt.risk_score >= 60 ? 'text-red-600' : opt.risk_score >= 40 ? 'text-amber-600' : 'text-green-600'}`}>
                      {opt.risk_score}/100
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t('whatIf.weatherImpact')}</span>
                    <span className="text-gray-700 text-right">{opt.weather_impact}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t('whatIf.costImpact')}</span>
                    <span className="text-gray-700">{opt.cost_impact}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t('whatIf.potentialBenefit')}</span>
                    <span className="text-gray-700">{opt.potential_benefit}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-100">
                    <span className="text-gray-500">{t('whatIf.recommendation')}</span>
                    <span className={`font-medium ${opt.recommendation.includes('Avoid') || opt.recommendation.includes('தவிர்') || opt.recommendation.includes('टालें') ? 'text-red-600' : 'text-green-600'}`}>
                      {opt.recommendation}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Overall recommendation */}
          <div className="bg-green-50 rounded-2xl p-5 border border-green-200">
            <div className="flex items-start gap-2">
              <GitCompare className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-800">{t('whatIf.betterOption')}</p>
                <p className="text-sm text-green-700 mt-1">{result.recommendation}</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 px-4 py-3 bg-amber-50 rounded-lg text-sm text-amber-800">
            <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{t('whatIf.disclaimer')}</span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
