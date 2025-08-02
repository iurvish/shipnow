-- Fix the foreign key constraint issue causing signup failures
-- The issue is that the trigger runs before the auth.users record is fully committed

-- First, let's check and fix the foreign key constraint
DO $$
BEGIN
    -- Drop the problematic foreign key constraint if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'users_id_fkey' 
        AND table_name = 'users'
        AND table_schema = 'public'
    ) THEN
        ALTER TABLE public.users DROP CONSTRAINT users_id_fkey;
        RAISE NOTICE 'Dropped problematic foreign key constraint users_id_fkey';
    END IF;
    
    -- Add the correct foreign key constraint with proper options
    ALTER TABLE public.users 
    ADD CONSTRAINT users_id_fkey 
    FOREIGN KEY (id) REFERENCES auth.users(id) 
    ON DELETE CASCADE 
    DEFERRABLE INITIALLY DEFERRED;
    
    RAISE NOTICE 'Added proper foreign key constraint with DEFERRABLE INITIALLY DEFERRED';
END $$;

-- Update the trigger function to handle the foreign key issue
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Use a more robust approach that handles the foreign key constraint properly
  INSERT INTO public.users (id, email, onboarded, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    false,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = EXCLUDED.updated_at;
  
  RETURN NEW;
EXCEPTION
  WHEN foreign_key_violation THEN
    -- If foreign key violation, wait a bit and retry
    PERFORM pg_sleep(0.1);
    INSERT INTO public.users (id, email, onboarded, created_at, updated_at)
    VALUES (
      NEW.id,
      NEW.email,
      false,
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      email = EXCLUDED.email,
      updated_at = EXCLUDED.updated_at;
    RETURN NEW;
  WHEN OTHERS THEN
    -- Log the error but don't fail the signup
    RAISE WARNING 'Error in handle_new_user trigger: % - %', SQLSTATE, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Alternative approach: Change the trigger timing
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create the trigger to run AFTER the transaction is committed
CREATE CONSTRAINT TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Verify the changes
DO $$
DECLARE
    constraint_info RECORD;
BEGIN
    RAISE NOTICE '=== Checking users table constraints ===';
    FOR constraint_info IN 
        SELECT constraint_name, constraint_type 
        FROM information_schema.table_constraints 
        WHERE table_name = 'users' 
        AND table_schema = 'public'
    LOOP
        RAISE NOTICE 'Constraint: % | Type: %', constraint_info.constraint_name, constraint_info.constraint_type;
    END LOOP;
END $$;
