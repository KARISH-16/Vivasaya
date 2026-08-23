import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { NetworkProvider } from '@/contexts/NetworkContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { ProfileProvider } from '@/contexts/ProfileContext';
import AppLayout from '@/layouts/AppLayout';
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import AssistantPage from '@/pages/AssistantPage';
import WeatherPage from '@/pages/WeatherPage';
import CropPage from '@/pages/CropPage';
import WhatIfPage from '@/pages/WhatIfPage';
import SchemesPage from '@/pages/SchemesPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import ProfilePage from '@/pages/ProfilePage';
import SettingsPage from '@/pages/SettingsPage';
import EmergencyPage from '@/pages/EmergencyPage';
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

  // Allow demo profile (set via window.__setDemoProfile) to access app routes
  const hasDemoProfile = !!(window as unknown as { __setDemoProfile?: unknown }).__setDemoProfile;
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
