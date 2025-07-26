-- Clean up users table structure
-- Remove duplicate columns and move profile_picture to main users table

-- Remove duplicate columns from users table if they exist
DO $$
BEGIN
    -- Remove image column (duplicate of profile_picture)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'image') THEN
        ALTER TABLE users DROP COLUMN image;
    END IF;
    
    -- Remove profile_picture_url column (rename to profile_picture)
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'profile_picture_url') THEN
        ALTER TABLE users DROP COLUMN profile_picture_url;
    END IF;
    
    -- Add profile_picture column to users if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'profile_picture') THEN
        ALTER TABLE users ADD COLUMN profile_picture TEXT DEFAULT '';
    END IF;
END $$;

-- Remove profile_picture from personal_details table if it exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'personal_details' AND column_name = 'profile_picture') THEN
        ALTER TABLE personal_details DROP COLUMN profile_picture;
    END IF;
END $$;
