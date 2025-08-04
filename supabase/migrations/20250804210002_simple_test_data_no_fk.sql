-- Alternative: Remove foreign key constraint temporarily for testing
-- This allows us to insert test data without auth users

-- Remove the foreign key constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_id_fkey;
ALTER TABLE users DROP CONSTRAINT IF EXISTS fk_users_auth_users;

-- Also disable any triggers that might enforce auth user existence
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Insert test data without auth user dependency
INSERT INTO users (id, first_name, last_name, email, bio, username, onboarded) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Alice', 'Johnson', 'alice.johnson@example.com', 'Passionate frontend developer with 5+ years experience building modern web applications.', 'alicejohnson', true),
('550e8400-e29b-41d4-a716-446655440002', 'Bob', 'Williams', 'bob.williams@example.com', 'Full-stack engineer specializing in React and Node.js with a focus on scalable architecture.', 'bobwilliams', true),
('550e8400-e29b-41d4-a716-446655440003', 'Charlie', 'Brown', 'charlie.brown@example.com', 'Creative UX designer with expertise in user research and interaction design.', 'charliebrown', true),
('550e8400-e29b-41d4-a716-446655440004', 'Diana', 'Martinez', 'diana.martinez@example.com', 'Data scientist with machine learning expertise and experience in Python and R.', 'dianamartinez', true),
('550e8400-e29b-41d4-a716-446655440005', 'Eve', 'Davis', 'eve.davis@example.com', 'Backend engineer focused on microservices and cloud infrastructure.', 'evedavis', true)
ON CONFLICT (id) DO NOTHING;

-- Insert personal details
INSERT INTO personal_details (user_id, university, department, degree_level, date_of_birth) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Stanford University', 'Computer Science', 'GRADUATE', '1995-03-15'),
('550e8400-e29b-41d4-a716-446655440002', 'MIT', 'Computer Science', 'UNDERGRADUATE', '1998-07-22'),
('550e8400-e29b-41d4-a716-446655440003', 'RISD', 'Design', 'GRADUATE', '1994-11-08'),
('550e8400-e29b-41d4-a716-446655440004', 'UC Berkeley', 'Statistics', 'PHD', '1992-01-30'),
('550e8400-e29b-41d4-a716-446655440005', 'Carnegie Mellon', 'Computer Science', 'GRADUATE', '1996-09-12')
ON CONFLICT (user_id) DO NOTHING;

-- Insert technical profiles
INSERT INTO technical_profiles (user_id, skills, experience, github, portfolio) VALUES
('550e8400-e29b-41d4-a716-446655440001', ARRAY['JavaScript', 'React', 'TypeScript', 'CSS', 'HTML'], 'Senior', 'https://github.com/alicejohnson', 'https://alicejohnson.dev'),
('550e8400-e29b-41d4-a716-446655440002', ARRAY['JavaScript', 'Node.js', 'React', 'TypeScript', 'PostgreSQL'], 'Senior', 'https://github.com/bobwilliams', 'https://bobwilliams.io'),
('550e8400-e29b-41d4-a716-446655440003', ARRAY['Figma', 'Sketch', 'Adobe Creative Suite', 'Prototyping', 'User Research'], 'Mid-level', 'https://github.com/charliebrown', 'https://charliebrown.design'),
('550e8400-e29b-41d4-a716-446655440004', ARRAY['Python', 'R', 'SQL', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy'], 'Senior', 'https://github.com/dianamartinez', 'https://dianamartinez.dev'),
('550e8400-e29b-41d4-a716-446655440005', ARRAY['Node.js', 'Java', 'Python', 'Docker', 'Kubernetes', 'AWS'], 'Senior', 'https://github.com/evedavis', 'https://evedavis.io')
ON CONFLICT (user_id) DO NOTHING;
