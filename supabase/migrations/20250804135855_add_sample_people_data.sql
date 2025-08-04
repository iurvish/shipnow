-- Insert sample data for people finder
-- This adds test users with personal details and technical profiles

-- Insert sample users
INSERT INTO users (first_name, last_name, email, bio) VALUES
('Alice', 'Johnson', 'alice.johnson@example.com', 'Passionate frontend developer with 5+ years experience building modern web applications.'),
('Bob', 'Williams', 'bob.williams@example.com', 'Full-stack engineer specializing in React and Node.js with a focus on scalable architecture.'),
('Charlie', 'Brown', 'charlie.brown@example.com', 'Creative UX designer with expertise in user research and interaction design.'),
('Diana', 'Martinez', 'diana.martinez@example.com', 'Data scientist with machine learning expertise and experience in Python and R.'),
('Eve', 'Davis', 'eve.davis@example.com', 'Backend engineer focused on microservices and cloud infrastructure.')
ON CONFLICT (email) DO NOTHING;

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
FROM users u
WHERE u.email IN (
  'alice.johnson@example.com',
  'bob.williams@example.com', 
  'charlie.brown@example.com',
  'diana.martinez@example.com',
  'eve.davis@example.com'
)
ON CONFLICT (user_id) DO NOTHING;

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
FROM users u
WHERE u.email IN (
  'alice.johnson@example.com',
  'bob.williams@example.com', 
  'charlie.brown@example.com',
  'diana.martinez@example.com',
  'eve.davis@example.com'
)
ON CONFLICT (user_id) DO NOTHING;
