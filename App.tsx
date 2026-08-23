import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { AuthProvider, useAuth } from './AuthContext';
import { LanguageProvider } from './LanguageContext';
import { NetworkProvider } from './NetworkContext';
import { NotificationProvider } from './NotificationContext';
import { ProfileProvider } from './ProfileContext';

import AppLayout from './AppLayout';

import LandingPage from './LandingPage';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import DashboardPage from './DashboardPage';
import AssistantPage from './AssistantPage';
import WeatherPage from './WeatherPage';
import CropPage from './CropPage';
import WhatIfPage from './WhatIfPage';
import SchemesPage from './SchemesPage';
import AnalyticsPage from './AnalyticsPage';
import ProfilePage from './ProfilePage';
import SettingsPage from './SettingsPage';
import EmergencyPage from './EmergencyPage';

import type { ReactNode } from 'react';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const hasDemoProfile = !!(
    window as unknown as { __setDemoProfile?: unknown }
  ).__setDemoProfile;

  if (!session && !hasDemoProfile) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Navigate to="/app/dashboard" replace />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/app/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/app/assistant"
        element={
          <ProtectedRoute>
            <AppLayout>
              <AssistantPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/app/weather"
        element={
          <ProtectedRoute>
            <AppLayout>
              <WeatherPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/app/crop"
        element={
          <ProtectedRoute>
            <AppLayout>
              <CropPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/app/what-if"
        element={
          <ProtectedRoute>
            <AppLayout>
              <WhatIfPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/app/schemes"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SchemesPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/app/analytics"
        element={
          <ProtectedRoute>
            <AppLayout>
              <AnalyticsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/app/profile"
        element={
          <ProtectedRoute>
            <AppLayout>
              <ProfilePage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/app/settings"
        element={
          <ProtectedRoute>
            <AppLayout>
              <SettingsPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/app/emergency"
        element={
          <ProtectedRoute>
            <AppLayout>
              <EmergencyPage />
            </AppLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <NetworkProvider>
          <AuthProvider>
            <NotificationProvider>
              <ProfileProvider>
                <AppRoutes />
              </ProfileProvider>
            </NotificationProvider>
          </AuthProvider>
        </NetworkProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
