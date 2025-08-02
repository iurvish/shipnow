-- Create the complete onboarding schema
-- This migration sets up all tables and enums needed for the onboarding process

-- Update degree_level enum with proper capitalization
DO $$
BEGIN
    -- Check if degree_level enum exists and update it
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'degree_level') THEN
        -- Drop and recreate the enum with new values
        DROP TYPE IF EXISTS degree_level CASCADE;
    END IF;
    
    CREATE TYPE degree_level AS ENUM (
        'Bachelor',
        'Master', 
        'Self_taught',
        'Diploma',
        'Other'
    );
END $$;

-- Create experience_level enum
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'experience_level') THEN
        CREATE TYPE experience_level AS ENUM (
            'Beginner',
            'Intermediate', 
            'Advanced',
            'Expert'
        );
    END IF;
END $$;

-- Create users table (extends auth.users)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(100) UNIQUE,
    avatar_url TEXT,
    onboarded BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create personal_details table
CREATE TABLE IF NOT EXISTS personal_details (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    university VARCHAR(200),
    department VARCHAR(200),
    degree_level degree_level,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Create technical_profiles table
CREATE TABLE IF NOT EXISTS technical_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    experience_level experience_level NOT NULL,
    skills TEXT[] DEFAULT '{}',
    bio TEXT,
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    website_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Add degree_level column back to personal_details if it was dropped
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'personal_details' AND column_name = 'degree_level'
    ) THEN
        ALTER TABLE personal_details ADD COLUMN degree_level degree_level;
    END IF;
END $$;

-- Add missing columns to technical_profiles if they were dropped
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'technical_profiles' AND column_name = 'skills'
    ) THEN
        ALTER TABLE technical_profiles ADD COLUMN skills TEXT[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'technical_profiles' AND column_name = 'experience_level'
    ) THEN
        ALTER TABLE technical_profiles ADD COLUMN experience_level experience_level;
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_onboarded ON users(onboarded);
CREATE INDEX IF NOT EXISTS idx_personal_details_user_id ON personal_details(user_id);
CREATE INDEX IF NOT EXISTS idx_personal_details_university ON personal_details(university);
CREATE INDEX IF NOT EXISTS idx_personal_details_department ON personal_details(department);
CREATE INDEX IF NOT EXISTS idx_personal_details_degree_level ON personal_details(degree_level);
CREATE INDEX IF NOT EXISTS idx_technical_profiles_user_id ON technical_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_technical_profiles_experience ON technical_profiles(experience_level);
CREATE INDEX IF NOT EXISTS idx_technical_profiles_skills ON technical_profiles USING GIN(skills);

-- Create storage bucket for avatars if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
SELECT 'avatars', 'avatars', true
WHERE NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'avatars'
);

-- Create storage policies for avatars
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
    DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
    DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
    DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
    
    -- Create new policies
    CREATE POLICY "Avatar images are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'avatars');

    CREATE POLICY "Users can upload their own avatar"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

    CREATE POLICY "Users can update their own avatar"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

    CREATE POLICY "Users can delete their own avatar"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
END $$;

-- Create RLS policies for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view their own profile"
ON users FOR SELECT
USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can update their own profile"
ON users FOR UPDATE
USING (auth.uid() = id);

-- Create RLS policies for personal_details table
ALTER TABLE personal_details ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view their own personal details"
ON personal_details FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own personal details"
ON personal_details FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own personal details"
ON personal_details FOR UPDATE
USING (auth.uid() = user_id);

-- Create RLS policies for technical_profiles table
ALTER TABLE technical_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view their own technical profile"
ON technical_profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own technical profile"
ON technical_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update their own technical profile"
ON technical_profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Create function to handle user profile creation
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO users (id, email, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
DROP TRIGGER IF EXISTS create_user_profile_trigger ON auth.users;
CREATE TRIGGER create_user_profile_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_profile();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER personal_details_updated_at
    BEFORE UPDATE ON personal_details
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER technical_profiles_updated_at
    BEFORE UPDATE ON technical_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
