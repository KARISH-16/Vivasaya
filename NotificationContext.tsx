import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Alert } from '@/types';

interface NotificationContextValue {
  alerts: Alert[];
  unreadCount: number;
  addAlert: (alert: Omit<Alert, 'id' | 'created_at' | 'is_read' | 'user_id'>) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const addAlert = useCallback((alert: Omit<Alert, 'id' | 'created_at' | 'is_read' | 'user_id'>) => {
    const newAlert: Alert = {
      ...alert,
      id: crypto.randomUUID(),
      user_id: '',
      is_read: false,
      created_at: new Date().toISOString(),
    };
    setAlerts((prev) => [newAlert, ...prev].slice(0, 20));
  }, []);

  const markAllRead = useCallback(() => {
    setAlerts((prev) => prev.map((a) => ({ ...a, is_read: true })));
  }, []);

  const markRead = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, is_read: true } : a)));
  }, []);

  const clearAll = useCallback(() => setAlerts([]), []);

  const unreadCount = alerts.filter((a) => !a.is_read).length;

  return (
    <NotificationContext.Provider value={{ alerts, unreadCount, addAlert, markAllRead, markRead, clearAll }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
