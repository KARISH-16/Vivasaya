import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { User, MapPin, Sprout, IndianRupee, Save, CheckCircle } from 'lucide-react';
import { useProfile } from '@/contexts/ProfileContext';
import type { LanguageCode, FarmerType } from '@/types';

export default function ProfilePage() {
  const { t } = useTranslation();
  const { profile, saveProfile, isDemo } = useProfile();

  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    preferred_language: profile?.preferred_language || 'en',
    location: profile?.location || '',
    state: profile?.state || '',
    farmer_type: profile?.farmer_type || 'small',
    farm_size_acres: profile?.farm_size_acres || 0,
    crop: profile?.crop || '',
    crop_variety: profile?.crop_variety || '',
    crop_stage: profile?.crop_stage || '',
    soil_type: profile?.soil_type || 'loam',
    irrigation_type: profile?.irrigation_type || 'rainfed',
    budget_inr: profile?.budget_inr || 0,
    farming_objective: profile?.farming_objective || 'yield',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const { error: err } = await saveProfile(form);
    setSaving(false);
    if (err) {
      setError(err);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const crops = ['paddy', 'wheat', 'cotton', 'sugarcane', 'maize', 'groundnut', 'pulses', 'vegetables'];
  const stages = ['seeding', 'vegetative', 'flowering', 'grainFilling', 'maturity', 'harvest'];
  const soils = ['clay', 'loam', 'sandy', 'black', 'red', 'alluvial'];
  const irrigations = ['drip', 'sprinkler', 'canal', 'borewell', 'rainfed', 'flood'];
  const objectives = ['yield', 'profit', 'sustainability', 'riskReduction'];

  const inputClass = 'w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('profile.title')}</h1>
        <p className="text-gray-500 text-sm mt-1">{t('profile.subtitle')}</p>
      </div>

      {isDemo && (
        <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          {t('common.demoMode')} — {t('common.demoData')}
        </div>
      )}

      {/* Personal */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-green-600" />
          <h2 className="font-semibold text-gray-800">{t('profile.personal')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t('profile.fullName')}</label>
            <input type="text" value={form.full_name} onChange={(e) => handleChange('full_name', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{t('profile.phone')}</label>
            <input type="text" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{t('profile.preferredLanguage')}</label>
            <select value={form.preferred_language} onChange={(e) => handleChange('preferred_language', e.target.value)} className={inputClass}>
              <option value="en">English</option>
              <option value="ta">தமிழ்</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>{t('profile.location')}</label>
            <input type="text" value={form.location} onChange={(e) => handleChange('location', e.target.value)} className={inputClass} />
          </div>
        </div>
      </div>

      {/* Farm */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Sprout className="w-5 h-5 text-green-600" />
          <h2 className="font-semibold text-gray-800">{t('profile.farm')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t('profile.farmerType')}</label>
            <select value={form.farmer_type} onChange={(e) => handleChange('farmer_type', e.target.value)} className={inputClass}>
              <option value="small">{t('profile.smallFarmer')}</option>
              <option value="marginal">{t('profile.marginalFarmer')}</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>{t('profile.farmSize')}</label>
            <input type="number" value={form.farm_size_acres} onChange={(e) => handleChange('farm_size_acres', parseFloat(e.target.value) || 0)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{t('profile.crop')}</label>
            <select value={form.crop} onChange={(e) => handleChange('crop', e.target.value)} className={inputClass}>
              <option value="">{t('profile.selectCrop')}</option>
              {crops.map((c) => <option key={c} value={c}>{t(`profile.crops.${c}`)}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>{t('profile.cropVariety')}</label>
            <input type="text" value={form.crop_variety} onChange={(e) => handleChange('crop_variety', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{t('profile.cropStage')}</label>
            <select value={form.crop_stage} onChange={(e) => handleChange('crop_stage', e.target.value)} className={inputClass}>
              <option value="">{t('profile.selectStage')}</option>
              {stages.map((s) => <option key={s} value={s}>{t(`crop.stages.${s}`)}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>{t('profile.soilType')}</label>
            <select value={form.soil_type} onChange={(e) => handleChange('soil_type', e.target.value)} className={inputClass}>
              {soils.map((s) => <option key={s} value={s}>{t(`profile.soilTypes.${s}`)}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>{t('profile.irrigationType')}</label>
            <select value={form.irrigation_type} onChange={(e) => handleChange('irrigation_type', e.target.value)} className={inputClass}>
              {irrigations.map((i) => <option key={i} value={i}>{t(`profile.irrigationTypes.${i}`)}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Financial */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <IndianRupee className="w-5 h-5 text-green-600" />
          <h2 className="font-semibold text-gray-800">{t('profile.financial')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{t('profile.budget')}</label>
            <input type="number" value={form.budget_inr} onChange={(e) => handleChange('budget_inr', parseInt(e.target.value) || 0)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{t('profile.farmingObjective')}</label>
            <select value={form.farming_objective} onChange={(e) => handleChange('farming_objective', e.target.value)} className={inputClass}>
              {objectives.map((o) => <option key={o} value={o}>{t(`profile.objectives.${o}`)}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving || isDemo}
          className="px-6 py-2.5 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saving ? t('common.loading') : t('profile.save')}
        </button>
        {saved && (
          <span className="flex items-center gap-1 text-sm text-green-600">
            <CheckCircle className="w-4 h-4" />
            {t('profile.saved')}
          </span>
        )}
        {error && <span className="text-sm text-red-600">{error}</span>}
        {isDemo && <span className="text-sm text-gray-400">{t('common.demoMode')}</span>}
      </div>
    </div>
  );
}
