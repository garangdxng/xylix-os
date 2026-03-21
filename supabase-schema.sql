-- Xylix OS Database Schema
-- Run this in Supabase SQL Editor

-- Tasks (Daily OS)
CREATE TABLE tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  text TEXT NOT NULL,
  done BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Characters (Model Studio)
CREATE TABLE characters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  vibe TEXT,
  style TEXT,
  images TEXT[], -- array of base64 or URLs
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Bets (Betting)
CREATE TABLE bets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  description TEXT NOT NULL,
  stake NUMERIC DEFAULT 0,
  result TEXT DEFAULT 'pending', -- win, loss, push, pending
  payout NUMERIC DEFAULT 0,
  lesson TEXT,
  auto_logged BOOLEAN DEFAULT false,
  date_label TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Settings (API keys - encrypted at rest by Supabase)
CREATE TABLE settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key_name TEXT UNIQUE NOT NULL,
  key_value TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE bets ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- For now, allow all access with anon key (single user app)
CREATE POLICY "Allow all" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON characters FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON bets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON settings FOR ALL USING (true) WITH CHECK (true);
