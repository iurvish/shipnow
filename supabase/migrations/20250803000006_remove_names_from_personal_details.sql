-- Remove first_name and last_name from personal_details table
-- These fields should be in users table only

-- First, backup any data if needed (copy names to users table if they exist)
DO $$
DECLARE
    rec RECORD;
BEGIN
    -- Copy first_name and last_name from personal_details to users if they exist
    FOR rec IN 
        SELECT pd.user_id, pd.first_name, pd.last_name
        FROM personal_details pd
        WHERE pd.first_name IS NOT NULL OR pd.last_name IS NOT NULL
    LOOP
        -- Update users table with the names from personal_details
        UPDATE users 
        SET 
            first_name = COALESCE(users.first_name, rec.first_name),
            last_name = COALESCE(users.last_name, rec.last_name)
        WHERE id = rec.user_id;
        
        RAISE NOTICE 'Copied names for user_id: %', rec.user_id;
    END LOOP;
END $$;

-- Add first_name and last_name to users table if they don't exist
DO $$
BEGIN
    -- Add first_name to users if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'first_name'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE users ADD COLUMN first_name VARCHAR(100);
        RAISE NOTICE 'Added first_name to users table';
    END IF;
    
    -- Add last_name to users if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'last_name'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE users ADD COLUMN last_name VARCHAR(100);
        RAISE NOTICE 'Added last_name to users table';
    END IF;
END $$;

-- Now remove first_name and last_name from personal_details
DO $$
BEGIN
    -- Remove first_name if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'personal_details' 
        AND column_name = 'first_name'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE personal_details DROP COLUMN first_name CASCADE;
        RAISE NOTICE 'Removed first_name from personal_details';
    END IF;
    
    -- Remove last_name if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'personal_details' 
        AND column_name = 'last_name'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE personal_details DROP COLUMN last_name CASCADE;
        RAISE NOTICE 'Removed last_name from personal_details';
    END IF;
END $$;

-- Verify final schemas
DO $$
DECLARE
    col_info RECORD;
BEGIN
    RAISE NOTICE '=== FINAL users table schema ===';
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
    
    RAISE NOTICE '=== FINAL personal_details table schema ===';
    FOR col_info IN 
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'personal_details' 
        AND table_schema = 'public'
        ORDER BY ordinal_position
    LOOP
        RAISE NOTICE 'personal_details.% | Type: % | Nullable: %', 
            col_info.column_name, 
            col_info.data_type, 
            col_info.is_nullable;
    END LOOP;
END $$;
