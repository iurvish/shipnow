-- Create actual auth users and then our test data
-- This creates real authenticated users that can be referenced properly

-- First, let's create some actual auth users
-- Note: In Supabase, we need to insert into auth.users directly for testing

-- Insert into auth.users (this creates real authenticated users)
INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_sso_user,
  role,
  aud
) VALUES 
(
  '550e8400-e29b-41d4-a716-446655440001',
  '00000000-0000-0000-0000-000000000000',
  'alice.johnson@example.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"first_name": "Alice", "last_name": "Johnson"}',
  false,
  'authenticated',
  'authenticated'
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  '00000000-0000-0000-0000-000000000000',
  'bob.williams@example.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"first_name": "Bob", "last_name": "Williams"}',
  false,
  'authenticated',
  'authenticated'
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  '00000000-0000-0000-0000-000000000000',
  'charlie.brown@example.com',
  crypt('password123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"first_name": "Charlie", "last_name": "Brown"}',
  false,
  'authenticated',
  'authenticated'
)
ON CONFLICT (id) DO NOTHING;

-- Now insert our users table data with the same IDs
INSERT INTO users (id, first_name, last_name, email, bio, username, onboarded) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Alice', 'Johnson', 'alice.johnson@example.com', 'Passionate frontend developer with 5+ years experience building modern web applications.', 'alicejohnson', true),
('550e8400-e29b-41d4-a716-446655440002', 'Bob', 'Williams', 'bob.williams@example.com', 'Full-stack engineer specializing in React and Node.js with a focus on scalable architecture.', 'bobwilliams', true),
('550e8400-e29b-41d4-a716-446655440003', 'Charlie', 'Brown', 'charlie.brown@example.com', 'Creative UX designer with expertise in user research and interaction design.', 'charliebrown', true)
ON CONFLICT (id) DO NOTHING;

-- Insert personal details
INSERT INTO personal_details (user_id, university, department, degree_level, date_of_birth) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Stanford University', 'Computer Science', 'GRADUATE', '1995-03-15'),
('550e8400-e29b-41d4-a716-446655440002', 'MIT', 'Computer Science', 'UNDERGRADUATE', '1998-07-22'),
('550e8400-e29b-41d4-a716-446655440003', 'RISD', 'Design', 'GRADUATE', '1994-11-08')
ON CONFLICT (user_id) DO NOTHING;

-- Insert technical profiles
INSERT INTO technical_profiles (user_id, skills, experience, github, portfolio) VALUES
('550e8400-e29b-41d4-a716-446655440001', ARRAY['JavaScript', 'React', 'TypeScript', 'CSS', 'HTML'], 'Senior', 'https://github.com/alicejohnson', 'https://alicejohnson.dev'),
('550e8400-e29b-41d4-a716-446655440002', ARRAY['JavaScript', 'Node.js', 'React', 'TypeScript', 'PostgreSQL'], 'Senior', 'https://github.com/bobwilliams', 'https://bobwilliams.io'),
('550e8400-e29b-41d4-a716-446655440003', ARRAY['Figma', 'Sketch', 'Adobe Creative Suite', 'Prototyping', 'User Research'], 'Mid-level', 'https://github.com/charliebrown', 'https://charliebrown.design')
ON CONFLICT (user_id) DO NOTHING;
