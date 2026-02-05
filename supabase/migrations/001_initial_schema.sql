-- Parastar Database Schema
-- Execute this in your Supabase SQL Editor

-- Table: bookmarks
-- Stores user's saved website bookmarks
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  icon_url TEXT,
  folder TEXT DEFAULT 'default',
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: stored_cookies
-- Persists browser cookies across sessions
CREATE TABLE stored_cookies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  domain TEXT NOT NULL,
  cookie_name TEXT NOT NULL,
  cookie_value TEXT NOT NULL,
  path TEXT DEFAULT '/',
  expires_at TIMESTAMP WITH TIME ZONE,
  is_secure BOOLEAN DEFAULT false,
  is_http_only BOOLEAN DEFAULT false,
  same_site_policy TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, domain, cookie_name, path)
);

-- Table: saved_logins
-- Encrypted login credentials for websites
CREATE TABLE saved_logins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  domain TEXT NOT NULL,
  username_field TEXT NOT NULL,
  encrypted_password TEXT NOT NULL,
  last_used TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, domain, username_field)
);

-- Table: history
-- Browsing history tracker
CREATE TABLE history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  page_title TEXT,
  visit_count INTEGER DEFAULT 1,
  last_visited TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: tab_sessions
-- Active tab state for session restoration
CREATE TABLE tab_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  page_title TEXT,
  tab_position INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT false,
  session_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: user_preferences
-- User settings and preferences
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  homepage_url TEXT DEFAULT 'https://www.google.com',
  theme_mode TEXT DEFAULT 'dark',
  clear_on_exit BOOLEAN DEFAULT false,
  save_history BOOLEAN DEFAULT true,
  save_cookies BOOLEAN DEFAULT true,
  enable_javascript BOOLEAN DEFAULT true,
  block_ads BOOLEAN DEFAULT false,
  custom_settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX bookmarks_user_id_idx ON bookmarks(user_id);
CREATE INDEX bookmarks_folder_idx ON bookmarks(user_id, folder);
CREATE INDEX stored_cookies_domain_idx ON stored_cookies(user_id, domain);
CREATE INDEX saved_logins_domain_idx ON saved_logins(user_id, domain);
CREATE INDEX history_user_id_idx ON history(user_id);
CREATE INDEX history_last_visited_idx ON history(user_id, last_visited DESC);
CREATE INDEX tab_sessions_session_idx ON tab_sessions(user_id, session_id);

-- Enable Row Level Security on all tables
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE stored_cookies ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_logins ENABLE ROW LEVEL SECURITY;
ALTER TABLE history ENABLE ROW LEVEL SECURITY;
ALTER TABLE tab_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- RLS: Users can only access their own data
CREATE POLICY user_bookmarks ON bookmarks USING (auth.uid() = user_id);
CREATE POLICY user_cookies ON stored_cookies USING (auth.uid() = user_id);
CREATE POLICY user_logins ON saved_logins USING (auth.uid() = user_id);
CREATE POLICY user_history ON history USING (auth.uid() = user_id);
CREATE POLICY user_tabs ON tab_sessions USING (auth.uid() = user_id);
CREATE POLICY user_prefs ON user_preferences USING (auth.uid() = user_id);

-- Function: Auto-create preferences on user signup
CREATE OR REPLACE FUNCTION initialize_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Run preference initialization on new user
CREATE TRIGGER setup_user_preferences
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION initialize_user_preferences();
