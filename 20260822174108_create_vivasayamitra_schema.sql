/*
# VivasayaMitra AI — Core Schema

Creates the full data model for the multilingual farmer decision-support platform.

1. New Tables
- `farmer_profiles` — farmer personal + farm + financial info, linked to auth.users
- `recommendations` — AI-generated recommendations for a farmer
- `risk_analyses` — proactive risk engine results for a farmer
- `conversations` — chat sessions between farmer and AI assistant
- `messages` — individual messages within a conversation
- `weather_snapshots` — cached weather data per location
- `alerts` — notifications shown to a farmer
- `what_if_simulations` — saved what-if scenario comparisons
- `analytics_events` — anonymous usage counters for the analytics dashboard

2. Security
- RLS enabled on every table.
- All tables are owner-scoped to `auth.uid()` with 4 CRUD policies each (SELECT/INSERT/UPDATE/DELETE).
- `farmer_profiles.user_id` is unique so each farmer has exactly one profile.
- Owner columns default to `auth.uid()` so inserts that omit `user_id` still satisfy WITH CHECK.
*/

CREATE TABLE IF NOT EXISTS farmer_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  preferred_language text NOT NULL DEFAULT 'en',
  location text NOT NULL DEFAULT '',
  state text NOT NULL DEFAULT '',
  farmer_type text NOT NULL DEFAULT 'small',
  farm_size_acres numeric NOT NULL DEFAULT 0,
  crop text NOT NULL DEFAULT '',
  crop_variety text NOT NULL DEFAULT '',
  crop_stage text NOT NULL DEFAULT '',
  soil_type text NOT NULL DEFAULT '',
  irrigation_type text NOT NULL DEFAULT '',
  budget_inr numeric NOT NULL DEFAULT 0,
  farming_objective text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE farmer_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON farmer_profiles;
CREATE POLICY "select_own_profile" ON farmer_profiles FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_profile" ON farmer_profiles;
CREATE POLICY "insert_own_profile" ON farmer_profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_profile" ON farmer_profiles;
CREATE POLICY "update_own_profile" ON farmer_profiles FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_profile" ON farmer_profiles;
CREATE POLICY "delete_own_profile" ON farmer_profiles FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE UNIQUE INDEX IF NOT EXISTS farmer_profiles_user_id_idx ON farmer_profiles(user_id);

CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  risk_level text NOT NULL DEFAULT 'low',
  category text NOT NULL DEFAULT 'general',
  language text NOT NULL DEFAULT 'en',
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_recs" ON recommendations;
CREATE POLICY "select_own_recs" ON recommendations FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_recs" ON recommendations;
CREATE POLICY "insert_own_recs" ON recommendations FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_recs" ON recommendations;
CREATE POLICY "update_own_recs" ON recommendations FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_recs" ON recommendations;
CREATE POLICY "delete_own_recs" ON recommendations FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS recommendations_user_id_idx ON recommendations(user_id);

CREATE TABLE IF NOT EXISTS risk_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  score integer NOT NULL DEFAULT 0,
  category text NOT NULL DEFAULT 'low',
  reasons jsonb NOT NULL DEFAULT '[]'::jsonb,
  recommendation text NOT NULL DEFAULT '',
  confidence numeric NOT NULL DEFAULT 0,
  language text NOT NULL DEFAULT 'en',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE risk_analyses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_risk" ON risk_analyses;
CREATE POLICY "select_own_risk" ON risk_analyses FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_risk" ON risk_analyses;
CREATE POLICY "insert_own_risk" ON risk_analyses FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_risk" ON risk_analyses;
CREATE POLICY "update_own_risk" ON risk_analyses FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_risk" ON risk_analyses;
CREATE POLICY "delete_own_risk" ON risk_analyses FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS risk_analyses_user_id_idx ON risk_analyses(user_id);

CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT '',
  language text NOT NULL DEFAULT 'en',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_conversations" ON conversations;
CREATE POLICY "select_own_conversations" ON conversations FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_conversations" ON conversations;
CREATE POLICY "insert_own_conversations" ON conversations FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_conversations" ON conversations;
CREATE POLICY "update_own_conversations" ON conversations FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_conversations" ON conversations;
CREATE POLICY "delete_own_conversations" ON conversations FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS conversations_user_id_idx ON conversations(user_id);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'user',
  content text NOT NULL DEFAULT '',
  language text NOT NULL DEFAULT 'en',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_messages" ON messages;
CREATE POLICY "select_own_messages" ON messages FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_messages" ON messages;
CREATE POLICY "insert_own_messages" ON messages FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_messages" ON messages;
CREATE POLICY "update_own_messages" ON messages FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_messages" ON messages;
CREATE POLICY "delete_own_messages" ON messages FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS messages_conversation_id_idx ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS messages_user_id_idx ON messages(user_id);

CREATE TABLE IF NOT EXISTS weather_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  location text NOT NULL DEFAULT '',
  temperature_c numeric NOT NULL DEFAULT 0,
  rain_probability numeric NOT NULL DEFAULT 0,
  humidity numeric NOT NULL DEFAULT 0,
  wind_speed numeric NOT NULL DEFAULT 0,
  condition text NOT NULL DEFAULT '',
  forecast jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_demo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE weather_snapshots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_weather" ON weather_snapshots;
CREATE POLICY "select_own_weather" ON weather_snapshots FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_weather" ON weather_snapshots;
CREATE POLICY "insert_own_weather" ON weather_snapshots FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_weather" ON weather_snapshots;
CREATE POLICY "update_own_weather" ON weather_snapshots FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_weather" ON weather_snapshots;
CREATE POLICY "delete_own_weather" ON weather_snapshots FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS weather_snapshots_user_id_idx ON weather_snapshots(user_id);

CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'info',
  title text NOT NULL DEFAULT '',
  body text NOT NULL DEFAULT '',
  severity text NOT NULL DEFAULT 'low',
  language text NOT NULL DEFAULT 'en',
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_alerts" ON alerts;
CREATE POLICY "select_own_alerts" ON alerts FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_alerts" ON alerts;
CREATE POLICY "insert_own_alerts" ON alerts FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_alerts" ON alerts;
CREATE POLICY "update_own_alerts" ON alerts FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_alerts" ON alerts;
CREATE POLICY "delete_own_alerts" ON alerts FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS alerts_user_id_idx ON alerts(user_id);

CREATE TABLE IF NOT EXISTS what_if_simulations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  scenario text NOT NULL DEFAULT '',
  option_a jsonb NOT NULL DEFAULT '{}'::jsonb,
  option_b jsonb NOT NULL DEFAULT '{}'::jsonb,
  recommendation text NOT NULL DEFAULT '',
  language text NOT NULL DEFAULT 'en',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE what_if_simulations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_whatif" ON what_if_simulations;
CREATE POLICY "select_own_whatif" ON what_if_simulations FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_whatif" ON what_if_simulations;
CREATE POLICY "insert_own_whatif" ON what_if_simulations FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_whatif" ON what_if_simulations;
CREATE POLICY "update_own_whatif" ON what_if_simulations FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_whatif" ON what_if_simulations;
CREATE POLICY "delete_own_whatif" ON what_if_simulations FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS what_if_simulations_user_id_idx ON what_if_simulations(user_id);

CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type text NOT NULL DEFAULT '',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_events" ON analytics_events;
CREATE POLICY "select_own_events" ON analytics_events FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_events" ON analytics_events;
CREATE POLICY "insert_own_events" ON analytics_events FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_events" ON analytics_events;
CREATE POLICY "update_own_events" ON analytics_events FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_events" ON analytics_events;
CREATE POLICY "delete_own_events" ON analytics_events FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS analytics_events_user_id_idx ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS analytics_events_type_idx ON analytics_events(event_type);