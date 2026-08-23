import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type NetworkStatus = 'online' | 'offline' | 'poor';

interface NetworkContextValue {
  status: NetworkStatus;
  isOnline: boolean;
  setSimulatedOffline: (offline: boolean) => void;
  simulatedOffline: boolean;
}

const NetworkContext = createContext<NetworkContextValue | undefined>(undefined);

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [browserOnline, setBrowserOnline] = useState(navigator.onLine);
  const [simulatedOffline, setSimulatedOffline] = useState(false);

  useEffect(() => {
    const onOnline = () => setBrowserOnline(true);
    const onOffline = () => setBrowserOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  const isOnline = browserOnline && !simulatedOffline;
  const status: NetworkStatus = !browserOnline || simulatedOffline ? 'offline' : browserOnline ? 'online' : 'poor';

  return (
    <NetworkContext.Provider value={{ status, isOnline, setSimulatedOffline, simulatedOffline }}>
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const ctx = useContext(NetworkContext);
  if (!ctx) throw new Error('useNetwork must be used within NetworkProvider');
  return ctx;
}
