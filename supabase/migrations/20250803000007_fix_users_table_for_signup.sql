-- Fix users table to support signup and onboarding flow
-- Make all onboarding fields optional for initial signup

-- Add bio to users table if it doesn't exist and move it from technical_profiles
DO $$
DECLARE
    rec RECORD;
BEGIN
    -- Add bio to users if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'bio'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE users ADD COLUMN bio TEXT;
        RAISE NOTICE 'Added bio to users table';
        
        -- Copy existing bio data from technical_profiles to users
        FOR rec IN 
            SELECT tp.user_id, tp.bio
            FROM technical_profiles tp
            WHERE tp.bio IS NOT NULL
        LOOP
            UPDATE users 
            SET bio = rec.bio
            WHERE id = rec.user_id;
            
            RAISE NOTICE 'Copied bio for user_id: %', rec.user_id;
        END LOOP;
    END IF;
END $$;

-- Remove bio from technical_profiles since it's now in users table
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'technical_profiles' 
        AND column_name = 'bio'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE technical_profiles DROP COLUMN bio CASCADE;
        RAISE NOTICE 'Removed bio from technical_profiles';
    END IF;
END $$;

-- Make sure all onboarding fields in users table are nullable (optional for signup)
DO $$
BEGIN
    -- Make first_name nullable
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'first_name'
        AND table_schema = 'public'
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE users ALTER COLUMN first_name DROP NOT NULL;
        RAISE NOTICE 'Made first_name nullable in users table';
    END IF;
    
    -- Make last_name nullable
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'last_name'
        AND table_schema = 'public'
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE users ALTER COLUMN last_name DROP NOT NULL;
        RAISE NOTICE 'Made last_name nullable in users table';
    END IF;
    
    -- Make username nullable (optional for signup, required for onboarding)
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'username'
        AND table_schema = 'public'
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE users ALTER COLUMN username DROP NOT NULL;
        RAISE NOTICE 'Made username nullable in users table';
    END IF;
END $$;

-- Update technical_profiles to use 'experience' instead of 'experience_level' to match form
DO $$
BEGIN
    -- Add experience column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'technical_profiles' 
        AND column_name = 'experience'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE technical_profiles ADD COLUMN experience experience_level;
        RAISE NOTICE 'Added experience column to technical_profiles';
        
        -- Copy data from experience_level to experience if experience_level exists
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'technical_profiles' 
            AND column_name = 'experience_level'
            AND table_schema = 'public'
        ) THEN
            UPDATE technical_profiles SET experience = experience_level WHERE experience_level IS NOT NULL;
            RAISE NOTICE 'Copied experience_level data to experience';
        END IF;
    END IF;
    
    -- Remove experience_level column if it exists and experience column exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'technical_profiles' 
        AND column_name = 'experience_level'
        AND table_schema = 'public'
    ) AND EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'technical_profiles' 
        AND column_name = 'experience'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE technical_profiles DROP COLUMN experience_level CASCADE;
        RAISE NOTICE 'Removed experience_level from technical_profiles';
    END IF;
END $$;

-- Update personal_details to make all fields optional for onboarding flexibility
DO $$
BEGIN
    -- Make university nullable
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'personal_details' 
        AND column_name = 'university'
        AND table_schema = 'public'
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE personal_details ALTER COLUMN university DROP NOT NULL;
        RAISE NOTICE 'Made university nullable in personal_details';
    END IF;
    
    -- Make department nullable
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'personal_details' 
        AND column_name = 'department'
        AND table_schema = 'public'
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE personal_details ALTER COLUMN department DROP NOT NULL;
        RAISE NOTICE 'Made department nullable in personal_details';
    END IF;
    
    -- Make degree_level nullable
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'personal_details' 
        AND column_name = 'degree_level'
        AND table_schema = 'public'
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE personal_details ALTER COLUMN degree_level DROP NOT NULL;
        RAISE NOTICE 'Made degree_level nullable in personal_details';
    END IF;
END $$;

-- Make experience nullable in technical_profiles (not required until onboarding)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'technical_profiles' 
        AND column_name = 'experience'
        AND table_schema = 'public'
        AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE technical_profiles ALTER COLUMN experience DROP NOT NULL;
        RAISE NOTICE 'Made experience nullable in technical_profiles';
    END IF;
END $$;

-- Final schema verification
DO $$
DECLARE
    col_info RECORD;
BEGIN
    RAISE NOTICE '=== UPDATED users table schema ===';
    FOR col_info IN 
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND table_schema = 'public'
        ORDER BY ordinal_position
    LOOP
        RAISE NOTICE 'users.% | Type: % | Nullable: %', 
            col_info.column_name, 
            col_info.data_type, 
            col_info.is_nullable;
    END LOOP;
    
    RAISE NOTICE '=== UPDATED technical_profiles table schema ===';
    FOR col_info IN 
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'technical_profiles' 
        AND table_schema = 'public'
        ORDER BY ordinal_position
    LOOP
        RAISE NOTICE 'technical_profiles.% | Type: % | Nullable: %', 
            col_info.column_name, 
            col_info.data_type, 
            col_info.is_nullable;
    END LOOP;
END $$;
