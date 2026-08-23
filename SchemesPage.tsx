import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Landmark, ExternalLink, FileText, CheckCircle } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { matchSchemes, getLocalizedSchemeField, type SchemeMatchCriteria } from '@/services/schemes';
import type { FarmerType } from '@/types';

export default function SchemesPage() {
  const { t } = useTranslation();
  const { profile } = useProfile();
  const { language } = useLanguage();
  const [farmerType, setFarmerType] = useState<FarmerType | ''>(profile?.farmer_type || '');
  const [category, setCategory] = useState('all');

  const criteria: SchemeMatchCriteria = useMemo(() => ({
    farmerType: farmerType || undefined,
    category,
  }), [farmerType, category]);

  const schemes = useMemo(() => matchSchemes(criteria), [criteria]);
  const categories = ['all', 'income', 'insurance', 'soil', 'irrigation', 'loan', 'pension', 'equipment', 'subsidy'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('schemes.title')}</h1>
        <p className="text-gray-500 text-sm mt-1">{t('schemes.subtitle')}</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('schemes.farmerType')}</label>
            <select
              value={farmerType}
              onChange={(e) => setFarmerType(e.target.value as FarmerType | '')}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All</option>
              <option value="small">{t('profile.smallFarmer')}</option>
              <option value="marginal">{t('profile.marginalFarmer')}</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('schemes.category')}</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'all' ? t('schemes.allCategories') : t(`schemes.categories.${c}`)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      <div>
        <p className="text-sm font-medium text-gray-600 mb-3">
          {t('schemes.matchingSchemes')}: {schemes.length}
        </p>

        {schemes.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
            <Landmark className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">{t('schemes.noMatch')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {schemes.map((scheme, i) => (
              <motion.div
                key={scheme.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
                      <Landmark className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800">{getLocalizedSchemeField(scheme.name, language)}</h3>
                  </div>
                  <a
                    href={scheme.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-1 flex-shrink-0"
                  >
                    {t('schemes.officialLink')}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <p className="text-sm text-gray-600 mb-3">{getLocalizedSchemeField(scheme.purpose, language)}</p>

                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-xs font-medium text-gray-400 mb-0.5">{t('schemes.eligibility')}</p>
                    <p className="text-gray-700">{getLocalizedSchemeField(scheme.eligibility, language)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400 mb-0.5">{t('schemes.documents')}</p>
                    <p className="text-gray-700">{getLocalizedSchemeField(scheme.documents, language)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400 mb-0.5">{t('schemes.applicationSteps')}</p>
                    <div className="flex items-start gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-gray-400 mt-1 flex-shrink-0" />
                      <p className="text-gray-700 whitespace-pre-line">{getLocalizedSchemeField(scheme.steps, language)}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100">
                  {scheme.categories.map((cat) => (
                    <span key={cat} className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full">
                      {t(`schemes.categories.${cat}`)}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-start gap-2 px-4 py-3 bg-amber-50 rounded-lg text-sm text-amber-800">
        <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>{t('schemes.verifyNote')}</span>
      </div>
    </div>
  );
}
