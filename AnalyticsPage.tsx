import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, AlertTriangle, Mic, GitCompare, WifiOff, Languages } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';

const DEMO_METRICS = {
  totalRecommendations: 1247,
  riskAlerts: 389,
  highRiskCases: 42,
  languagesUsed: 3,
  voiceInteractions: 856,
  whatIfSimulations: 173,
  offlineSessions: 94,
};

const TREND_DATA = [
  { month: 'Jan', recommendations: 45, alerts: 12 },
  { month: 'Feb', recommendations: 78, alerts: 23 },
  { month: 'Mar', recommendations: 112, alerts: 34 },
  { month: 'Apr', recommendations: 156, alerts: 45 },
  { month: 'May', recommendations: 198, alerts: 56 },
  { month: 'Jun', recommendations: 234, alerts: 67 },
  { month: 'Jul', recommendations: 267, alerts: 78 },
];

const RISK_DIST = [
  { name: 'Low', value: 62, color: '#10b981' },
  { name: 'Moderate', value: 28, color: '#f59e0b' },
  { name: 'High', value: 10, color: '#ef4444' },
];

const LANG_DIST = [
  { name: 'Tamil', value: 45, color: '#10b981' },
  { name: 'English', value: 35, color: '#3b82f6' },
  { name: 'Hindi', value: 20, color: '#f59e0b' },
];

export default function AnalyticsPage() {
  const { t } = useTranslation();

  const cards = [
    { icon: TrendingUp, label: t('analytics.totalRecommendations'), value: DEMO_METRICS.totalRecommendations, color: 'bg-green-50 text-green-600' },
    { icon: AlertTriangle, label: t('analytics.riskAlerts'), value: DEMO_METRICS.riskAlerts, color: 'bg-amber-50 text-amber-600' },
    { icon: AlertTriangle, label: t('analytics.highRiskCases'), value: DEMO_METRICS.highRiskCases, color: 'bg-red-50 text-red-600' },
    { icon: Languages, label: t('analytics.languagesUsed'), value: DEMO_METRICS.languagesUsed, color: 'bg-blue-50 text-blue-600' },
    { icon: Mic, label: t('analytics.voiceInteractions'), value: DEMO_METRICS.voiceInteractions, color: 'bg-purple-50 text-purple-600' },
    { icon: GitCompare, label: t('analytics.whatIfSimulations'), value: DEMO_METRICS.whatIfSimulations, color: 'bg-cyan-50 text-cyan-600' },
    { icon: WifiOff, label: t('analytics.offlineSessions'), value: DEMO_METRICS.offlineSessions, color: 'bg-gray-50 text-gray-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('analytics.title')}</h1>
        <p className="text-gray-500 text-sm mt-1">{t('analytics.subtitle')}</p>
      </div>

      <div className="px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
        {t('analytics.demoLabel')}
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Trend chart */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="font-semibold text-gray-800 mb-4">{t('analytics.recommendationsOverTime')}</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={TREND_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="recommendations" stroke="#10b981" strokeWidth={2} />
            <Line type="monotone" dataKey="alerts" stroke="#f59e0b" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Distribution charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">{t('analytics.riskDistribution')}</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={RISK_DIST} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                {RISK_DIST.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-semibold text-gray-800 mb-4">{t('analytics.languageDistribution')}</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={LANG_DIST}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {LANG_DIST.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
