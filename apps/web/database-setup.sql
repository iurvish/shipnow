-- Sample Supabase Schema for People Finder
-- This creates the tables needed for the AI people finder system

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create personal_details table
CREATE TABLE IF NOT EXISTS personal_details (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  university TEXT NOT NULL,
  department TEXT NOT NULL,
  degree_level TEXT NOT NULL CHECK (degree_level IN ('UNDERGRADUATE', 'GRADUATE', 'PHD')),
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create technical_profiles table
CREATE TABLE IF NOT EXISTS technical_profiles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  primary_skills TEXT[] NOT NULL DEFAULT '{}',
  experience_level TEXT NOT NULL CHECK (experience_level IN ('BEGINNER', 'INTERMEDIATE', 'ADVANCED')),
  interests TEXT[] NOT NULL DEFAULT '{}',
  preferred_roles TEXT[] NOT NULL DEFAULT '{}',
  github_url TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data
INSERT INTO users (first_name, last_name, email, bio) VALUES
('Alice', 'Johnson', 'alice.johnson@example.com', 'Passionate frontend developer with 5+ years experience building modern web applications.'),
('Bob', 'Williams', 'bob.williams@example.com', 'Full-stack engineer specializing in React and Node.js with a focus on scalable architecture.'),
('Charlie', 'Brown', 'charlie.brown@example.com', 'Creative UX designer with expertise in user research and interaction design.'),
('Diana', 'Martinez', 'diana.martinez@example.com', 'Data scientist with machine learning expertise and experience in Python and R.'),
('Eve', 'Davis', 'eve.davis@example.com', 'Backend engineer focused on microservices and cloud infrastructure.');

-- Insert personal details
INSERT INTO personal_details (user_id, university, department, degree_level, phone)
SELECT 
  u.id,
  CASE 
    WHEN u.first_name = 'Alice' THEN 'Stanford University'
    WHEN u.first_name = 'Bob' THEN 'MIT'
    WHEN u.first_name = 'Charlie' THEN 'RISD'
    WHEN u.first_name = 'Diana' THEN 'UC Berkeley'
    WHEN u.first_name = 'Eve' THEN 'Carnegie Mellon'
  END as university,
  CASE 
    WHEN u.first_name = 'Alice' THEN 'Computer Science'
    WHEN u.first_name = 'Bob' THEN 'Computer Science'
    WHEN u.first_name = 'Charlie' THEN 'Design'
    WHEN u.first_name = 'Diana' THEN 'Statistics'
    WHEN u.first_name = 'Eve' THEN 'Computer Science'
  END as department,
  CASE 
    WHEN u.first_name = 'Alice' THEN 'GRADUATE'
    WHEN u.first_name = 'Bob' THEN 'UNDERGRADUATE'
    WHEN u.first_name = 'Charlie' THEN 'GRADUATE'
    WHEN u.first_name = 'Diana' THEN 'PHD'
    WHEN u.first_name = 'Eve' THEN 'GRADUATE'
  END as degree_level,
  CASE 
    WHEN u.first_name = 'Alice' THEN '+1-555-0101'
    WHEN u.first_name = 'Bob' THEN '+1-555-0102'
    WHEN u.first_name = 'Charlie' THEN '+1-555-0103'
    WHEN u.first_name = 'Diana' THEN '+1-555-0104'
    WHEN u.first_name = 'Eve' THEN '+1-555-0105'
  END as phone
FROM users u;

-- Insert technical profiles
INSERT INTO technical_profiles (user_id, primary_skills, experience_level, interests, preferred_roles, github_url, linkedin_url)
SELECT 
  u.id,
  CASE 
    WHEN u.first_name = 'Alice' THEN ARRAY['React', 'JavaScript', 'TypeScript', 'CSS', 'HTML', 'Redux']
    WHEN u.first_name = 'Bob' THEN ARRAY['Node.js', 'React', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker']
    WHEN u.first_name = 'Charlie' THEN ARRAY['Figma', 'Sketch', 'Adobe Creative Suite', 'Prototyping', 'User Research']
    WHEN u.first_name = 'Diana' THEN ARRAY['Python', 'R', 'TensorFlow', 'Pandas', 'SQL', 'Machine Learning']
    WHEN u.first_name = 'Eve' THEN ARRAY['Java', 'Spring Boot', 'Kubernetes', 'AWS', 'PostgreSQL', 'Redis']
  END as primary_skills,
  CASE 
    WHEN u.first_name = 'Alice' THEN 'INTERMEDIATE'
    WHEN u.first_name = 'Bob' THEN 'ADVANCED'
    WHEN u.first_name = 'Charlie' THEN 'INTERMEDIATE'
    WHEN u.first_name = 'Diana' THEN 'ADVANCED'
    WHEN u.first_name = 'Eve' THEN 'INTERMEDIATE'
  END as experience_level,
  CASE 
    WHEN u.first_name = 'Alice' THEN ARRAY['Frontend Development', 'UI/UX', 'Web Performance']
    WHEN u.first_name = 'Bob' THEN ARRAY['Full Stack Development', 'DevOps', 'System Architecture']
    WHEN u.first_name = 'Charlie' THEN ARRAY['User Experience', 'Design Systems', 'Accessibility']
    WHEN u.first_name = 'Diana' THEN ARRAY['Data Analysis', 'AI/ML', 'Statistical Modeling']
    WHEN u.first_name = 'Eve' THEN ARRAY['Backend Development', 'Cloud Architecture', 'Microservices']
  END as interests,
  CASE 
    WHEN u.first_name = 'Alice' THEN ARRAY['Frontend Developer', 'UI Developer', 'React Developer']
    WHEN u.first_name = 'Bob' THEN ARRAY['Full Stack Developer', 'Software Engineer', 'Technical Lead']
    WHEN u.first_name = 'Charlie' THEN ARRAY['UX Designer', 'Product Designer', 'Design Lead']
    WHEN u.first_name = 'Diana' THEN ARRAY['Data Scientist', 'ML Engineer', 'Research Scientist']
    WHEN u.first_name = 'Eve' THEN ARRAY['Backend Developer', 'DevOps Engineer', 'System Architect']
  END as preferred_roles,
  CASE 
    WHEN u.first_name = 'Alice' THEN 'https://github.com/alicejohnson'
    WHEN u.first_name = 'Bob' THEN 'https://github.com/bobwilliams'
    WHEN u.first_name = 'Charlie' THEN 'https://github.com/charliebrown'
    WHEN u.first_name = 'Diana' THEN 'https://github.com/dianamartinez'
    WHEN u.first_name = 'Eve' THEN 'https://github.com/evedavis'
  END as github_url,
  CASE 
    WHEN u.first_name = 'Alice' THEN 'https://linkedin.com/in/alicejohnson'
    WHEN u.first_name = 'Bob' THEN 'https://linkedin.com/in/bobwilliams'
    WHEN u.first_name = 'Charlie' THEN 'https://linkedin.com/in/charliebrown'
    WHEN u.first_name = 'Diana' THEN 'https://linkedin.com/in/dianamartinez'
    WHEN u.first_name = 'Eve' THEN 'https://linkedin.com/in/evedavis'
  END as linkedin_url
FROM users u;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_technical_profiles_skills ON technical_profiles USING GIN (primary_skills);
CREATE INDEX IF NOT EXISTS idx_technical_profiles_experience ON technical_profiles (experience_level);
CREATE INDEX IF NOT EXISTS idx_technical_profiles_interests ON technical_profiles USING GIN (interests);
CREATE INDEX IF NOT EXISTS idx_personal_details_degree ON personal_details (degree_level);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- Create a function for full-text search across multiple fields
CREATE OR REPLACE FUNCTION search_people(search_terms TEXT[])
RETURNS TABLE (
  id TEXT,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  bio TEXT,
  personal_details JSONB,
  technical_profile JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.email,
    u.bio,
    to_jsonb(pd.*) as personal_details,
    to_jsonb(tp.*) as technical_profile
  FROM users u
  LEFT JOIN personal_details pd ON u.id = pd.user_id
  LEFT JOIN technical_profiles tp ON u.id = tp.user_id
  WHERE tp.primary_skills && search_terms
     OR tp.interests && search_terms
     OR tp.preferred_roles && search_terms
  ORDER BY u.created_at DESC
  LIMIT 10;
END;
$$ LANGUAGE plpgsql;
