-- Clean up users table - remove fields that belong in personal_details
-- Users table should only have: id, email, username, avatar_url, bio, onboarded, created_at, updated_at

-- Remove columns that shouldn't be in users table
ALTER TABLE users DROP COLUMN IF EXISTS first_name CASCADE;
ALTER TABLE users DROP COLUMN IF EXISTS last_name CASCADE;
ALTER TABLE users DROP COLUMN IF EXISTS profile_picture CASCADE;

-- Rename profile_picture to avatar_url if it exists
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'profile_picture'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE users RENAME COLUMN profile_picture TO avatar_url;
        RAISE NOTICE 'Renamed profile_picture to avatar_url in users table';
    END IF;
END $$;

-- Add avatar_url column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'avatar_url'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE users ADD COLUMN avatar_url TEXT;
        RAISE NOTICE 'Added avatar_url column to users table';
    END IF;
END $$;

-- Verify the final users schema
DO $$
DECLARE
    col_info RECORD;
BEGIN
    RAISE NOTICE '=== FINAL CLEAN users schema ===';
    FOR col_info IN 
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'users' 
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
