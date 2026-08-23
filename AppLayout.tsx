import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  CloudSun,
  Sprout,
  GitCompare,
  Landmark,
  BarChart3,
  User,
  Settings,
  Siren,
  LogOut,
  Menu,
  X,
  Wifi,
  WifiOff,
  Sprout as SproutIcon,
} from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';
import NotificationBell from '@/components/NotificationBell';
import NetworkBanner from '@/components/NetworkBanner';
import { useAuth } from '@/contexts/AuthContext';
import { useNetwork } from '@/contexts/NetworkContext';
import { useProfile } from '@/contexts/ProfileContext';

export default function AppLayout({ children }: { children: ReactNode }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { status, simulatedOffline, setSimulatedOffline } = useNetwork();
  const { profile } = useProfile();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { to: '/app/dashboard', icon: LayoutDashboard, label: t('nav.dashboard') },
    { to: '/app/assistant', icon: MessageSquare, label: t('nav.assistant') },
    { to: '/app/weather', icon: CloudSun, label: t('nav.weather') },
    { to: '/app/crop', icon: Sprout, label: t('nav.crop') },
    { to: '/app/what-if', icon: GitCompare, label: t('nav.whatIf') },
    { to: '/app/schemes', icon: Landmark, label: t('nav.schemes') },
    { to: '/app/analytics', icon: BarChart3, label: t('nav.analytics') },
    { to: '/app/profile', icon: User, label: t('nav.profile') },
    { to: '/app/settings', icon: Settings, label: t('nav.settings') },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const toggleOffline = () => setSimulatedOffline(!simulatedOffline);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-100">
        <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center">
          <SproutIcon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-gray-800 leading-tight">VivasayaMitra</h1>
          <p className="text-xs text-green-600 font-medium">AI</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}

        <NavLink
          to="/app/emergency"
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mt-2 ${
              isActive
                ? 'bg-red-50 text-red-700'
                : 'text-red-600 hover:bg-red-50'
            }`
          }
        >
          <Siren className="w-5 h-5 flex-shrink-0" />
          <span className="truncate">{t('nav.emergency')}</span>
        </NavLink>
      </nav>

      <div className="px-3 py-3 border-t border-gray-100 space-y-1">
        <button
          onClick={toggleOffline}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 w-full"
        >
          {simulatedOffline ? <WifiOff className="w-5 h-5 text-amber-500" /> : <Wifi className="w-5 h-5 text-green-500" />}
          <span>
            {simulatedOffline ? t('network.offline') : t('network.online')}
          </span>
        </button>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 w-full"
        >
          <LogOut className="w-5 h-5" />
          <span>{t('nav.logout')}</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <NetworkBanner />

      {/* Desktop layout */}
      <div className="flex flex-1">
        <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 flex-shrink-0">
          <SidebarContent />
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                aria-label="Menu"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {profile?.full_name || 'Farmer'}
                </p>
                <p className="text-xs text-gray-500">
                  {profile?.location || ''} {profile?.crop ? `· ${profile.crop}` : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:block">
                <LanguageSelector compact />
              </div>
              <NotificationBell />
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto p-4 lg:p-6">
            {children}
          </main>

          {/* Mobile bottom nav */}
          <nav className="lg:hidden bg-white border-t border-gray-200 flex items-center justify-around px-2 py-1.5">
            {navItems.slice(0, 5).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-xs ${
                    isActive ? 'text-green-600' : 'text-gray-500'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="truncate max-w-[60px] text-[10px]">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-72 bg-white shadow-xl">
            <div className="flex justify-end p-2">
              <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <SidebarContent />
          </div>
          <div className="flex-1 bg-black/30" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </div>
  );
}
