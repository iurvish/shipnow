-- Remove all triggers that could be causing signup failures
-- This migration completely removes any automatic user profile creation triggers

-- Drop all existing triggers on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_new_user ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user_trigger ON auth.users;

-- Drop all related functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.create_user_profile(uuid, text) CASCADE;

-- Create a simple function for manual user profile creation
CREATE OR REPLACE FUNCTION public.create_user_profile(user_id UUID, user_email TEXT)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.users (id, email, onboarded, created_at, updated_at)
  VALUES (user_id, user_email, false, NOW(), NOW())
  ON CONFLICT (id) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.create_user_profile TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_user_profile TO anon;

-- Ensure users table has proper RLS policies for manual insertion
DROP POLICY IF EXISTS "Enable insert for all" ON public.users;
CREATE POLICY "Enable insert for authenticated users" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id OR auth.role() = 'anon');

-- Grant necessary table permissions
GRANT ALL ON public.users TO anon;
GRANT ALL ON public.users TO authenticated;

DO $$
BEGIN
  RAISE NOTICE 'All triggers removed. Signup should work without automatic profile creation.';
END
$$;
