import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { supabase } from '@/services/supabase';
import { useAuth } from './AuthContext';
import type { FarmerProfile, LanguageCode, FarmerType } from '@/types';

const DEMO_PROFILE: FarmerProfile = {
  id: 'demo',
  user_id: 'demo',
  full_name: 'Demo Farmer',
  phone: '9876543210',
  preferred_language: 'ta',
  location: 'Tamil Nadu',
  state: 'Tamil Nadu',
  farmer_type: 'small',
  farm_size_acres: 2.5,
  crop: 'paddy',
  crop_variety: 'IR 64',
  crop_stage: 'flowering',
  soil_type: 'clay',
  irrigation_type: 'canal',
  budget_inr: 50000,
  farming_objective: 'yield',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

interface ProfileContextValue {
  profile: FarmerProfile | null;
  loading: boolean;
  isDemo: boolean;
  saveProfile: (profile: Partial<FarmerProfile>) => Promise<{ error: string | null }>;
  updateCropStage: (stage: string) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [profile, setProfile] = useState<FarmerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!session?.user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('farmer_profiles')
      .select('*')
      .eq('user_id', session.user.id)
      .maybeSingle();

    if (error || !data) {
      setProfile(null);
    } else {
      setProfile(data as FarmerProfile);
    }
    setLoading(false);
  }, [session]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const saveProfile = useCallback(async (partial: Partial<FarmerProfile>) => {
    if (!session?.user) return { error: 'Not authenticated' };

    const payload = {
      ...partial,
      user_id: session.user.id,
      updated_at: new Date().toISOString(),
    };

    const { data: existing } = await supabase
      .from('farmer_profiles')
      .select('id')
      .eq('user_id', session.user.id)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from('farmer_profiles')
        .update(payload)
        .eq('user_id', session.user.id)
        .select('*')
        .maybeSingle();
      if (error) return { error: error.message };
      if (data) setProfile(data as FarmerProfile);
    } else {
      const { data, error } = await supabase
        .from('farmer_profiles')
        .insert(payload)
        .select('*')
        .maybeSingle();
      if (error) return { error: error.message };
      if (data) setProfile(data as FarmerProfile);
    }
    return { error: null };
  }, [session]);

  const updateCropStage = useCallback(async (stage: string) => {
    if (!profile || !session?.user) return;
    await saveProfile({ crop_stage: stage });
  }, [profile, session, saveProfile]);

  // Expose demo profile setter for demo login
  useEffect(() => {
    (window as unknown as { __setDemoProfile?: (p: FarmerProfile) => void }).__setDemoProfile = (p: FarmerProfile) => {
      setProfile(p);
      setIsDemo(true);
      setLoading(false);
    };
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, loading, isDemo, saveProfile, updateCropStage }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfile must be used within ProfileProvider');
  return ctx;
}

export { DEMO_PROFILE };
export type { FarmerType, LanguageCode };
