-- Update schema to match 3-step onboarding form
-- Step 1: Personal Details, Step 2: Technical Profile, Step 3: Setup Profile

-- First, drop existing enum types and recreate with updated values
DO $$ 
BEGIN
    -- Drop existing enum types if they exist
    DROP TYPE IF EXISTS degree_level CASCADE;
    DROP TYPE IF EXISTS experience_level CASCADE;
    
    -- Create updated degree_level enum (removed doctorate, bootcamp, associate)
    CREATE TYPE degree_level AS ENUM ('bachelor', 'master', 'self_taught');
    
    -- Create updated experience_level enum (matching form options)
    CREATE TYPE experience_level AS ENUM ('Beginner', 'Intermediate', 'Advanced');
END $$;

-- Drop existing tables to recreate with proper structure
DROP TABLE IF EXISTS technical_profiles CASCADE;
DROP TABLE IF EXISTS personal_details CASCADE;

-- Update users table to match Step 3: Setup Profile
-- Keep core user info that matches the setup profile step
ALTER TABLE users 
DROP COLUMN IF EXISTS profile_picture,
ADD COLUMN IF NOT EXISTS profile_photo TEXT DEFAULT '', -- URL from Supabase storage
ALTER COLUMN username SET DEFAULT '',
ALTER COLUMN bio SET DEFAULT '';

-- Step 1: Personal Details Table (matches personalDetailsSchema)
CREATE TABLE personal_details (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  first_name TEXT NOT NULL DEFAULT '',
  last_name TEXT NOT NULL DEFAULT '', 
  date_of_birth DATE,
  university TEXT NOT NULL DEFAULT '',
  department TEXT NOT NULL DEFAULT '',
  degree_level degree_level DEFAULT 'bachelor',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Technical Profile Table (matches technicalProfileSchema)
CREATE TABLE technical_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  skills TEXT[] DEFAULT '{}', -- Flexible array for future skills (react, typescript, node, etc.)
  experience experience_level DEFAULT 'Beginner',
  github TEXT, -- GitHub/Twitter profile URL
  portfolio TEXT, -- Portfolio website URL
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 3: Setup Profile info stays in main users table
-- (profile_photo, username, bio are already in users table)

-- Create indexes for performance
CREATE INDEX idx_personal_details_user_id ON personal_details(user_id);
CREATE INDEX idx_personal_details_university ON personal_details(university);
CREATE INDEX idx_personal_details_department ON personal_details(department);
CREATE INDEX idx_personal_details_degree_level ON personal_details(degree_level);

CREATE INDEX idx_technical_profiles_user_id ON technical_profiles(user_id);
CREATE INDEX idx_technical_profiles_experience ON technical_profiles(experience);
CREATE INDEX idx_technical_profiles_skills ON technical_profiles USING GIN(skills);

-- Ensure username uniqueness when not null
DROP INDEX IF EXISTS idx_users_username_unique;
CREATE UNIQUE INDEX idx_users_username_unique ON users(username) WHERE username IS NOT NULL AND username != '';

-- Enable RLS (Row Level Security)
ALTER TABLE personal_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE technical_profiles ENABLE ROW LEVEL SECURITY;

-- Personal details policies
CREATE POLICY "Users can view their own personal details" ON personal_details 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own personal details" ON personal_details 
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own personal details" ON personal_details 
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own personal details" ON personal_details 
FOR DELETE USING (auth.uid() = user_id);

-- Technical profiles policies  
CREATE POLICY "Users can view their own technical profile" ON technical_profiles 
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own technical profile" ON technical_profiles 
FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own technical profile" ON technical_profiles 
FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own technical profile" ON technical_profiles 
FOR DELETE USING (auth.uid() = user_id);

-- Create triggers for updated_at timestamps
CREATE TRIGGER update_personal_details_updated_at 
  BEFORE UPDATE ON personal_details 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_technical_profiles_updated_at 
  BEFORE UPDATE ON technical_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for profile photos (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-photos', 'profile-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for profile photos
CREATE POLICY "Users can upload their own profile photos" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'profile-photos' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view profile photos" ON storage.objects
FOR SELECT USING (bucket_id = 'profile-photos');

CREATE POLICY "Users can update their own profile photos" ON storage.objects  
FOR UPDATE USING (
  bucket_id = 'profile-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own profile photos" ON storage.objects
FOR DELETE USING (
  bucket_id = 'profile-photos'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Add helpful comments
COMMENT ON TABLE personal_details IS 'Step 1: Personal Details from onboarding form - basic academic info';
COMMENT ON TABLE technical_profiles IS 'Step 2: Technical Profile from onboarding form - skills and portfolio';
COMMENT ON COLUMN users.profile_photo IS 'Step 3: Setup Profile - URL to profile photo in Supabase storage';
COMMENT ON COLUMN users.username IS 'Step 3: Setup Profile - unique username for the platform';
COMMENT ON COLUMN users.bio IS 'Step 3: Setup Profile - optional bio description';

COMMENT ON COLUMN technical_profiles.skills IS 'Flexible text array for skills like react, typescript, node, graphql, etc. - can be extended in future';
COMMENT ON COLUMN technical_profiles.experience IS 'Experience level: Beginner, Intermediate, or Advanced';
COMMENT ON COLUMN technical_profiles.github IS 'GitHub or Twitter profile URL';
COMMENT ON COLUMN technical_profiles.portfolio IS 'Portfolio website URL';
