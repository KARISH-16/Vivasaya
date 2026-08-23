import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, X } from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { AnimatePresence, motion } from 'framer-motion';

export default function NotificationBell() {
  const { t } = useTranslation();
  const { alerts, unreadCount, markAllRead, clearAll } = useNotifications();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
        aria-label={t('common.notifications')}
      >
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-lg border border-gray-200 z-40 overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">{t('common.notifications')}</h3>
                <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-gray-100">
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {alerts.length === 0 ? (
                  <p className="px-4 py-6 text-sm text-gray-500 text-center">{t('dashboard.noAlerts')}</p>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`px-4 py-3 border-b border-gray-50 ${!alert.is_read ? 'bg-green-50' : ''}`}
                    >
                      <p className="text-sm font-medium text-gray-800">{alert.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{alert.body}</p>
                    </div>
                  ))
                )}
              </div>
              {alerts.length > 0 && (
                <div className="flex gap-2 px-4 py-2 border-t border-gray-100">
                  <button
                    onClick={markAllRead}
                    className="text-xs font-medium text-green-600 hover:text-green-700"
                  >
                    {t('common.markAllRead')}
                  </button>
                  <button
                    onClick={clearAll}
                    className="text-xs font-medium text-gray-500 hover:text-gray-700 ml-auto"
                  >
                    {t('common.clear')}
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
