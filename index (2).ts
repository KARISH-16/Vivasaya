export type LanguageCode = 'en' | 'ta' | 'hi';

export type FarmerType = 'small' | 'marginal';

export type RiskCategory = 'low' | 'moderate' | 'high';

export interface FarmerProfile {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  preferred_language: LanguageCode;
  location: string;
  state: string;
  farmer_type: FarmerType;
  farm_size_acres: number;
  crop: string;
  crop_variety: string;
  crop_stage: string;
  soil_type: string;
  irrigation_type: string;
  budget_inr: number;
  farming_objective: string;
  created_at: string;
  updated_at: string;
}

export interface Recommendation {
  id: string;
  user_id: string;
  title: string;
  body: string;
  risk_level: RiskCategory;
  category: string;
  language: LanguageCode;
  is_read: boolean;
  created_at: string;
}

export interface RiskAnalysis {
  id: string;
  user_id: string;
  score: number;
  category: RiskCategory;
  reasons: string[];
  recommendation: string;
  confidence: number;
  language: LanguageCode;
  created_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  language: LanguageCode;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  language: LanguageCode;
  created_at: string;
}

export interface WeatherDay {
  day: string;
  temp_max: number;
  temp_min: number;
  rain_probability: number;
  condition: string;
}

export interface WeatherSnapshot {
  id: string;
  user_id: string;
  location: string;
  temperature_c: number;
  rain_probability: number;
  humidity: number;
  wind_speed: number;
  condition: string;
  forecast: WeatherDay[];
  is_demo: boolean;
  created_at: string;
}

export interface Alert {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  severity: RiskCategory;
  language: LanguageCode;
  is_read: boolean;
  created_at: string;
}

export interface WhatIfOption {
  label: string;
  risk_score: number;
  weather_impact: string;
  cost_impact: string;
  potential_benefit: string;
  recommendation: string;
}

export interface WhatIfSimulation {
  id: string;
  user_id: string;
  scenario: string;
  option_a: WhatIfOption;
  option_b: WhatIfOption;
  recommendation: string;
  language: LanguageCode;
  created_at: string;
}

export interface AnalyticsEvent {
  id: string;
  user_id: string;
  event_type: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface GovernmentScheme {
  id: string;
  name: { en: string; ta: string; hi: string };
  purpose: { en: string; ta: string; hi: string };
  eligibility: { en: string; ta: string; hi: string };
  documents: { en: string; ta: string; hi: string };
  steps: { en: string; ta: string; hi: string };
  link: string;
  states: string[];
  farmer_types: FarmerType[];
  categories: string[];
}

export interface AIResponse {
  answer: string;
  risk_level: RiskCategory;
  why: string;
  action: string;
  warning: string;
  sources: string[];
  is_demo: boolean;
}
