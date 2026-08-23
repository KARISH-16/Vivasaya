import { useTranslation } from 'react-i18next';
import { AlertTriangle } from 'lucide-react';
import { useNetwork } from '@/contexts/NetworkContext';

export default function NetworkBanner() {
  const { t } = useTranslation();
  const { status, simulatedOffline } = useNetwork();

  if (status === 'online' && !simulatedOffline) return null;

  return (
    <div
      className={`px-4 py-2 text-sm text-center font-medium ${
        simulatedOffline
          ? 'bg-amber-50 text-amber-800 border-b border-amber-200'
          : 'bg-red-50 text-red-800 border-b border-red-200'
      }`}
      role="alert"
    >
      <AlertTriangle className="inline w-4 h-4 mr-1.5 mb-0.5" />
      {simulatedOffline ? t('network.offlineBanner') : t('network.poorBanner')}
    </div>
  );
}
