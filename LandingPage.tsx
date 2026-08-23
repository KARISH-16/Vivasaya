import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sprout,
  Mic,
  Globe,
  Brain,
  GitCompare,
  WifiOff,
  BarChart3,
  ArrowRight,
  CloudSun,
  ShieldAlert,
  Landmark,
} from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';
import { useAuth } from '@/contexts/AuthContext';

export default function LandingPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { session } = useAuth();

  const features = [
    { icon: Mic, title: t('landing.feature1') },
    { icon: Brain, title: t('landing.feature2') },
    { icon: GitCompare, title: t('landing.feature3') },
    { icon: Landmark, title: t('landing.feature4') },
    { icon: WifiOff, title: t('landing.feature5') },
    { icon: BarChart3, title: t('landing.feature6') },
  ];

  const steps = [
    { num: '1', text: t('landing.howStep1') },
    { num: '2', text: t('landing.howStep2') },
    { num: '3', text: t('landing.howStep3') },
    { num: '4', text: t('landing.howStep4') },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Nav bar */}
      <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-gray-800">VivasayaMitra AI</span>
        </div>
        <div className="flex items-center gap-3">
          <LanguageSelector compact />
          <button
            onClick={() => navigate(session ? '/app/dashboard' : '/login')}
            className="text-sm font-medium text-gray-700 hover:text-green-600"
          >
            {t('nav.login')}
          </button>
          <button
            onClick={() => navigate('/register')}
            className="text-sm font-medium px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            {t('nav.getStarted')}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6"
          >
            <Sprout className="w-4 h-4" />
            AI for Public Good
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-bold text-gray-900 mb-4"
          >
            {t('landing.heroTitle')}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-green-600 font-semibold mb-4"
          >
            {t('landing.heroTagline')}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-8"
          >
            {t('landing.heroDescription')}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              {t('nav.getStarted')}
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              {t('nav.tryDemo')}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">{t('landing.problemTitle')}</h2>
          <p className="text-gray-600 text-lg text-center max-w-2xl mx-auto">{t('landing.problemText')}</p>
        </div>
      </section>

      {/* Solution */}
      <section className="py-16 px-6 bg-green-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 text-center">{t('landing.solutionTitle')}</h2>
          <p className="text-gray-600 text-lg text-center max-w-2xl mx-auto">{t('landing.solutionText')}</p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">{t('landing.howTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-full bg-green-100 text-green-700 font-bold text-lg flex items-center justify-center mx-auto mb-3">
                  {step.num}
                </div>
                <p className="text-gray-600 text-sm">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">{t('landing.featuresTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-3">
                  <f.icon className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-gray-700 font-medium text-sm">{f.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature highlights */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto space-y-12">
          {[
            { icon: Globe, title: t('landing.multilingualTitle'), text: t('landing.multilingualText') },
            { icon: Brain, title: t('landing.decisionTitle'), text: t('landing.decisionText') },
            { icon: GitCompare, title: t('landing.whatIfTitle'), text: t('landing.whatIfText') },
            { icon: WifiOff, title: t('landing.offlineTitle'), text: t('landing.offlineText') },
          ].map((item, i) => (
            <div key={i} className={`flex flex-col md:flex-row items-center gap-6 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
              <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center flex-shrink-0">
                <item.icon className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Impact */}
      <section className="py-16 px-6 bg-green-600">
        <div className="max-w-3xl mx-auto text-center">
          <ShieldAlert className="w-12 h-12 text-white mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">{t('landing.impactTitle')}</h2>
          <p className="text-green-50 text-lg">{t('landing.impactText')}</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('landing.ctaTitle')}</h2>
          <p className="text-gray-600 mb-8">{t('landing.ctaText')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
            >
              {t('nav.getStarted')}
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              {t('nav.tryDemo')}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-900 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-green-600 flex items-center justify-center">
            <Sprout className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-white">VivasayaMitra AI</span>
        </div>
        <p className="text-gray-400 text-sm">{t('app.tagline')}</p>
      </footer>
    </div>
  );
}
