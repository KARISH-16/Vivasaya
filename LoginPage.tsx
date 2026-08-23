import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { DEMO_PROFILE } from '@/contexts/ProfileContext';
import LanguageSelector from '@/components/LanguageSelector';
import type { LanguageCode } from '@/types';

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { setLanguage } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error: err } = await signIn(email, password);
    setLoading(false);
    if (err) {
      setError(err);
    } else {
      navigate('/app/dashboard');
    }
  };

  const handleDemoLogin = () => {
    (window as unknown as { __setDemoProfile?: (p: typeof DEMO_PROFILE) => void }).__setDemoProfile?.(DEMO_PROFILE);
    setLanguage(DEMO_PROFILE.preferred_language as LanguageCode);
    navigate('/app/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
      <div className="flex justify-end p-4">
        <LanguageSelector compact />
      </div>
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-green-600 flex items-center justify-center mx-auto mb-3">
              <Sprout className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{t('auth.loginTitle')}</h1>
            <p className="text-gray-500 mt-1">{t('auth.loginSubtitle')}</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            {error && (
              <div className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-700 rounded-lg text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.phoneEmail')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.phoneEmailPlaceholder')}
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.password')}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth.passwordPlaceholder')}
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? t('auth.validating') : t('auth.signIn')}
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-2 text-gray-400">or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full py-2.5 bg-green-50 text-green-700 rounded-lg font-semibold hover:bg-green-100 transition-colors border border-green-200"
            >
              {t('auth.demoLogin')}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-4">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="text-green-600 font-medium hover:underline">
              {t('auth.signUp')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
