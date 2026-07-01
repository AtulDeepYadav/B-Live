-- Supabase Schema for B-Live (B-School Connect)
-- Run this in your Supabase SQL Editor

-- ==============================================================================
-- PART 1: DATING SCHEMA
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS vector;

-- 1. Profiles (Dating Identity)
-- Uses auth.uid() as foreign key to Supabase Auth
CREATE TABLE dating_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name text NOT NULL,
  photo_url text,
  batch_year integer,
  bio text,
  is_verified boolean DEFAULT false,
  ghost_mode boolean DEFAULT true, -- default true so Lurkers feel safe immediately
  compatibility_vector vector(12),
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE dating_profiles ENABLE ROW LEVEL SECURITY;
-- Users can view verified dating profiles that are NOT in ghost mode
CREATE POLICY "Users can view public dating profiles" ON dating_profiles 
  FOR SELECT USING (is_verified = true AND ghost_mode = false);
-- Users can always view their own profile
CREATE POLICY "Users can view own profile" ON dating_profiles 
  FOR SELECT USING (auth.uid() = id);
-- Users can update their own profile
CREATE POLICY "Users can update their own profile" ON dating_profiles 
  FOR UPDATE USING (auth.uid() = id);

-- 2. Swipes
CREATE TABLE swipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  swiper_id uuid REFERENCES dating_profiles(id) NOT NULL,
  target_id uuid REFERENCES dating_profiles(id) NOT NULL,
  is_right_swipe boolean NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(swiper_id, target_id)
);

-- Swipe RLS: Users can only see their own swipes. Double-blind!
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert their own swipes" ON swipes FOR INSERT WITH CHECK (auth.uid() = swiper_id);
CREATE POLICY "Users can read their own swipes" ON swipes FOR SELECT USING (auth.uid() = swiper_id);


-- ==============================================================================
-- PART 2: CONFESSION SCHEMA
-- ==============================================================================
-- CRITICAL PRD CONSTRAINT: No Foreign Key to auth.users(id) or dating_profiles(id). 
-- Users are identified by a separate confession_uuid that the backend generates 
-- and manages. The tables remain cryptographically separate.

-- We create a secure mapping table that is ONLY accessible by the server/database admins
-- Not accessible via API (No RLS select policy for regular users)
CREATE TABLE auth_to_confession_map (
  auth_id uuid PRIMARY KEY REFERENCES auth.users(id),
  confession_id uuid UNIQUE NOT NULL DEFAULT gen_random_uuid()
);

ALTER TABLE auth_to_confession_map ENABLE ROW LEVEL SECURITY;
-- Deliberately no policies so no client can query it directly!

-- 3. Confessions
CREATE TABLE confessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_confession_id uuid NOT NULL, -- NO FOREIGN KEY!
  content varchar(280) NOT NULL,
  status text DEFAULT 'pending', -- 'pending', 'live', 'flagged', 'removed'
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE confessions ENABLE ROW LEVEL SECURITY;
-- Everyone can read live confessions
CREATE POLICY "Anyone can read live confessions" ON confessions FOR SELECT USING (status = 'live');
-- Note: Insert policy is complex. Usually handled via an Edge Function that looks up the confession_id
-- for the auth.uid() securely, rather than direct client inserts.

-- 4. Reactions
CREATE TABLE confession_reactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  confession_id uuid REFERENCES confessions(id),
  reactor_confession_id uuid NOT NULL, -- NO FOREIGN KEY!
  reaction_type text NOT NULL,
  UNIQUE(confession_id, reactor_confession_id)
);

-- ==============================================================================
-- HELPER: Auth Trigger
-- ==============================================================================
-- When a user signs up, automatically create their dating profile and their 
-- secure confession ID mapping.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- 1. Create dating profile (Ghost mode by default)
  INSERT INTO public.dating_profiles (id, full_name, is_verified)
  VALUES (new.id, split_part(new.email, '@', 1), false);
  
  -- 2. Create decoupled confession ID mapping
  INSERT INTO public.auth_to_confession_map (auth_id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
