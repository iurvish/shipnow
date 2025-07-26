-- Normalize users table - remove technical and personal fields
-- Move them to proper linked tables

-- First, create temporary columns to preserve data
DO $$
BEGIN
    -- Add temporary columns to store data before moving
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'university') THEN
        -- Create temporary table to preserve data
        CREATE TEMP TABLE temp_user_data AS 
        SELECT 
            id,
            university,
            department,
            degree_level,
            phone,
            primary_skills,
            experience_level,
            interests,
            preferred_roles,
            github_url,
            linkedin_url,
            portfolio_url,
            tools_proficiency
        FROM users 
        WHERE university IS NOT NULL 
           OR department IS NOT NULL 
           OR primary_skills != '{}'
           OR interests != '{}'
           OR preferred_roles != '{}'
           OR github_url IS NOT NULL
           OR linkedin_url IS NOT NULL
           OR portfolio_url IS NOT NULL
           OR tools_proficiency != '{}';

        -- Insert personal details for users who have them
        INSERT INTO personal_details (user_id, university, department, degree_level, phone)
        SELECT 
            id,
            COALESCE(university, ''),
            COALESCE(department, ''),
            COALESCE(degree_level, 'bachelor'),
            phone
        FROM temp_user_data
        WHERE university IS NOT NULL OR department IS NOT NULL OR phone IS NOT NULL
        ON CONFLICT (user_id) DO NOTHING;

        -- Insert technical profiles for users who have them
        INSERT INTO technical_profiles (
            user_id, 
            primary_skills, 
            experience_level, 
            interests, 
            preferred_roles, 
            github_url, 
            linkedin_url, 
            portfolio_url, 
            tools_proficiency
        )
        SELECT 
            id,
            COALESCE(primary_skills, '{}'),
            COALESCE(experience_level, 'beginner'),
            COALESCE(interests, '{}'),
            COALESCE(preferred_roles, '{}'),
            github_url,
            linkedin_url,
            portfolio_url,
            COALESCE(tools_proficiency, '{}')
        FROM temp_user_data
        WHERE primary_skills != '{}' 
           OR interests != '{}' 
           OR preferred_roles != '{}'
           OR github_url IS NOT NULL
           OR linkedin_url IS NOT NULL
           OR portfolio_url IS NOT NULL
           OR tools_proficiency != '{}'
        ON CONFLICT (user_id) DO NOTHING;

        -- Now remove the columns from users table
        ALTER TABLE users DROP COLUMN IF EXISTS university;
        ALTER TABLE users DROP COLUMN IF EXISTS department;
        ALTER TABLE users DROP COLUMN IF EXISTS degree_level;
        ALTER TABLE users DROP COLUMN IF EXISTS phone;
        ALTER TABLE users DROP COLUMN IF EXISTS primary_skills;
        ALTER TABLE users DROP COLUMN IF EXISTS experience_level;
        ALTER TABLE users DROP COLUMN IF EXISTS interests;
        ALTER TABLE users DROP COLUMN IF EXISTS preferred_roles;
        ALTER TABLE users DROP COLUMN IF EXISTS github_url;
        ALTER TABLE users DROP COLUMN IF EXISTS linkedin_url;
        ALTER TABLE users DROP COLUMN IF EXISTS portfolio_url;
        ALTER TABLE users DROP COLUMN IF EXISTS tools_proficiency;
    END IF;
END $$;
