-- Completely rebuild technical_profiles table to match form exactly
-- This migration will drop and recreate the table with only the needed columns

-- First, backup any existing data
CREATE TEMP TABLE temp_technical_profiles AS 
SELECT 
    user_id,
    COALESCE(skills, '{}') as skills,
    experience,
    github,
    portfolio,
    bio,
    created_at,
    updated_at
FROM technical_profiles;

-- Drop the existing table completely
DROP TABLE IF EXISTS technical_profiles CASCADE;

-- Recreate the table with exactly what we need
CREATE TABLE technical_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skills TEXT[] DEFAULT '{}' NOT NULL,
    experience experience_level NOT NULL,
    github VARCHAR(255),
    portfolio VARCHAR(255),
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Restore the data from backup
INSERT INTO technical_profiles (user_id, skills, experience, github, portfolio, bio, created_at, updated_at)
SELECT 
    user_id,
    skills,
    experience::experience_level,
    github,
    portfolio,
    bio,
    COALESCE(created_at, CURRENT_TIMESTAMP),
    COALESCE(updated_at, CURRENT_TIMESTAMP)
FROM temp_technical_profiles
ON CONFLICT (user_id) DO NOTHING;

-- Create proper indexes
CREATE INDEX idx_technical_profiles_user_id ON technical_profiles(user_id);
CREATE INDEX idx_technical_profiles_experience ON technical_profiles(experience);
CREATE INDEX idx_technical_profiles_skills ON technical_profiles USING GIN(skills);

-- Enable RLS
ALTER TABLE technical_profiles ENABLE ROW LEVEL SECURITY;

-- Recreate RLS policies
DROP POLICY IF EXISTS "Users can view their own technical profile" ON technical_profiles;
DROP POLICY IF EXISTS "Users can insert their own technical profile" ON technical_profiles;
DROP POLICY IF EXISTS "Users can update their own technical profile" ON technical_profiles;

CREATE POLICY "Users can view their own technical profile"
ON technical_profiles FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own technical profile"
ON technical_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own technical profile"
ON technical_profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER technical_profiles_updated_at
    BEFORE UPDATE ON technical_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Verify the final schema
DO $$
DECLARE
    col_info RECORD;
BEGIN
    RAISE NOTICE '=== REBUILT technical_profiles schema ===';
    FOR col_info IN 
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'technical_profiles' 
        AND table_schema = 'public'
        ORDER BY ordinal_position
    LOOP
        RAISE NOTICE 'Column: % | Type: % | Nullable: % | Default: %', 
            col_info.column_name, 
            col_info.data_type, 
            col_info.is_nullable,
            col_info.column_default;
    END LOOP;
END $$;
