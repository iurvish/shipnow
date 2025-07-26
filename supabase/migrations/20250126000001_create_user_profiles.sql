-- Create comprehensive user profile schema for recommendations
-- This extends Supabase auth.users with detailed profile information

-- Create enum types for better data consistency
CREATE TYPE degree_level AS ENUM ('associate', 'bachelor', 'master', 'doctorate', 'bootcamp', 'self_taught');
CREATE TYPE experience_level AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');

-- Main user profiles table (extends auth.users)
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  image TEXT DEFAULT '',
  first_name TEXT DEFAULT '',
  last_name TEXT DEFAULT '',
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  bio TEXT,
  date_of_birth DATE,
  profile_picture_url TEXT,
  onboarded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Personal details table
CREATE TABLE personal_details (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  university TEXT NOT NULL,
  department TEXT NOT NULL,
  degree_level degree_level NOT NULL,
  phone TEXT,
  profile_picture TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Technical profile table
CREATE TABLE technical_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  primary_skills TEXT[] DEFAULT '{}',
  experience_level experience_level NOT NULL,
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
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_username ON user_profiles(username);
CREATE INDEX idx_user_profiles_onboarded ON user_profiles(onboarded);
CREATE INDEX idx_personal_details_user_id ON personal_details(user_id);
CREATE INDEX idx_technical_profiles_user_id ON technical_profiles(user_id);
CREATE INDEX idx_technical_profiles_experience_level ON technical_profiles(experience_level);
CREATE INDEX idx_technical_profiles_primary_skills ON technical_profiles USING GIN(primary_skills);
CREATE INDEX idx_technical_profiles_interests ON technical_profiles USING GIN(interests);

-- Enable RLS (Row Level Security)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE technical_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- User profiles policies
CREATE POLICY "Users can view their own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

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

-- Create functions for automatic profile creation
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_profiles (id, email, username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile when auth user is created
CREATE TRIGGER create_user_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_profile();

-- Update function for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_personal_details_updated_at 
  BEFORE UPDATE ON personal_details 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_technical_profiles_updated_at 
  BEFORE UPDATE ON technical_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a view for complete user profiles (useful for recommendations)
CREATE VIEW complete_user_profiles AS
SELECT 
  up.id,
  up.image,
  up.first_name,
  up.last_name,
  up.email,
  up.username,
  up.bio,
  up.date_of_birth,
  up.profile_picture_url,
  up.onboarded,
  up.created_at,
  up.updated_at,
  pd.university,
  pd.department,
  pd.degree_level,
  pd.phone,
  tp.primary_skills,
  tp.experience_level,
  tp.interests,
  tp.preferred_roles,
  tp.github_url,
  tp.linkedin_url,
  tp.portfolio_url,
  tp.tools_proficiency
FROM user_profiles up
LEFT JOIN personal_details pd ON up.id = pd.user_id
LEFT JOIN technical_profiles tp ON up.id = tp.user_id;

-- Grant permissions on the view
GRANT SELECT ON complete_user_profiles TO authenticated;
