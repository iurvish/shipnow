-- Create comprehensive user schema
-- This extends Supabase auth.users with detailed profile information

-- Create enum types for better data consistency (only if they don't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'degree_level') THEN
        CREATE TYPE degree_level AS ENUM ('associate', 'bachelor', 'master', 'doctorate', 'bootcamp', 'self_taught');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'experience_level') THEN
        CREATE TYPE experience_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
    END IF;
END $$;

-- Main users table (extends auth.users) - clean with only basic info
CREATE TABLE IF NOT EXISTS users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT DEFAULT '',
  last_name TEXT DEFAULT '',
  email TEXT,
  username TEXT,
  bio TEXT,
  date_of_birth DATE,
  profile_picture TEXT DEFAULT '', -- moved from personal_details
  onboarded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Personal details table (linked to users)
CREATE TABLE IF NOT EXISTS personal_details (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  university TEXT DEFAULT '',
  department TEXT DEFAULT '',
  degree_level degree_level DEFAULT 'bachelor',
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Technical profile table (linked to users)
CREATE TABLE IF NOT EXISTS technical_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  primary_skills TEXT[] DEFAULT '{}',
  experience_level experience_level DEFAULT 'beginner',
  interests TEXT[] DEFAULT '{}',
  preferred_roles TEXT[] DEFAULT '{}',
  github_url TEXT,
  linkedin_url TEXT,
  portfolio_url TEXT,
  tools_proficiency TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_onboarded ON users(onboarded);
CREATE INDEX IF NOT EXISTS idx_personal_details_user_id ON personal_details(user_id);
CREATE INDEX IF NOT EXISTS idx_technical_profiles_user_id ON technical_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_technical_profiles_experience_level ON technical_profiles(experience_level);
CREATE INDEX IF NOT EXISTS idx_technical_profiles_primary_skills ON technical_profiles USING GIN(primary_skills);
CREATE INDEX IF NOT EXISTS idx_technical_profiles_interests ON technical_profiles USING GIN(interests);

-- Create unique indexes where email/username is not null
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_unique ON users(email) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username_unique ON users(username) WHERE username IS NOT NULL;

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE technical_profiles ENABLE ROW LEVEL SECURITY;

-- Users table policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own profile' AND tablename = 'users') THEN
        CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own profile' AND tablename = 'users') THEN
        CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own profile' AND tablename = 'users') THEN
        CREATE POLICY "Users can insert their own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);
    END IF;
END $$;

-- Personal details policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own personal details' AND tablename = 'personal_details') THEN
        CREATE POLICY "Users can view their own personal details" ON personal_details FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own personal details' AND tablename = 'personal_details') THEN
        CREATE POLICY "Users can update their own personal details" ON personal_details FOR UPDATE USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own personal details' AND tablename = 'personal_details') THEN
        CREATE POLICY "Users can insert their own personal details" ON personal_details FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own personal details' AND tablename = 'personal_details') THEN
        CREATE POLICY "Users can delete their own personal details" ON personal_details FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Technical profiles policies
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own technical profile' AND tablename = 'technical_profiles') THEN
        CREATE POLICY "Users can view their own technical profile" ON technical_profiles FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own technical profile' AND tablename = 'technical_profiles') THEN
        CREATE POLICY "Users can update their own technical profile" ON technical_profiles FOR UPDATE USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own technical profile' AND tablename = 'technical_profiles') THEN
        CREATE POLICY "Users can insert their own technical profile" ON technical_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own technical profile' AND tablename = 'technical_profiles') THEN
        CREATE POLICY "Users can delete their own technical profile" ON technical_profiles FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;

-- Create functions for automatic profile creation and timestamps
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO users (id, email, username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'username', 
      NEW.raw_user_meta_data->>'full_name',
      split_part(NEW.email, '@', 1)
    )
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the auth process
    RAISE WARNING 'Failed to create user profile for %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update function for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create trigger to automatically create user profile when auth user is created
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'create_user_profile_trigger') THEN
        CREATE TRIGGER create_user_profile_trigger
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE FUNCTION create_user_profile();
    END IF;
END $$;

-- Create triggers for updated_at timestamps
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
        CREATE TRIGGER update_users_updated_at 
          BEFORE UPDATE ON users 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_personal_details_updated_at') THEN
        CREATE TRIGGER update_personal_details_updated_at 
          BEFORE UPDATE ON personal_details 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_technical_profiles_updated_at') THEN
        CREATE TRIGGER update_technical_profiles_updated_at 
          BEFORE UPDATE ON technical_profiles 
          FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- Create profiles for existing auth users (if any)
INSERT INTO users (id, email, username)
SELECT 
  id, 
  email, 
  COALESCE(
    raw_user_meta_data->>'username',
    raw_user_meta_data->>'full_name', 
    split_part(email, '@', 1)
  )
FROM auth.users 
WHERE id NOT IN (SELECT id FROM users)
ON CONFLICT (id) DO NOTHING;
