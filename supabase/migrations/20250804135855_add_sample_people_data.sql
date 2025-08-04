-- Insert sample data for people finder
-- This adds 20 test users with personal details and technical profiles

-- First, we need to insert into auth.users (simulated with random UUIDs)
-- Note: In production, these would be actual auth.users records

-- Insert sample users
INSERT INTO users (id, first_name, last_name, email, bio, username, onboarded) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Alice', 'Johnson', 'alice.johnson@example.com', 'Passionate frontend developer with 5+ years experience building modern web applications.', 'alicejohnson', true),
('550e8400-e29b-41d4-a716-446655440002', 'Bob', 'Williams', 'bob.williams@example.com', 'Full-stack engineer specializing in React and Node.js with a focus on scalable architecture.', 'bobwilliams', true),
('550e8400-e29b-41d4-a716-446655440003', 'Charlie', 'Brown', 'charlie.brown@example.com', 'Creative UX designer with expertise in user research and interaction design.', 'charliebrown', true),
('550e8400-e29b-41d4-a716-446655440004', 'Diana', 'Martinez', 'diana.martinez@example.com', 'Data scientist with machine learning expertise and experience in Python and R.', 'dianamartinez', true),
('550e8400-e29b-41d4-a716-446655440005', 'Eve', 'Davis', 'eve.davis@example.com', 'Backend engineer focused on microservices and cloud infrastructure.', 'evedavis', true),
('550e8400-e29b-41d4-a716-446655440006', 'Frank', 'Wilson', 'frank.wilson@example.com', 'Mobile app developer with expertise in React Native and Flutter.', 'frankwilson', true),
('550e8400-e29b-41d4-a716-446655440007', 'Grace', 'Lee', 'grace.lee@example.com', 'DevOps engineer specializing in CI/CD pipelines and cloud infrastructure.', 'gracelee', true),
('550e8400-e29b-41d4-a716-446655440008', 'Henry', 'Chen', 'henry.chen@example.com', 'Product manager with technical background and experience in agile development.', 'henrychen', true),
('550e8400-e29b-41d4-a716-446655440009', 'Iris', 'Taylor', 'iris.taylor@example.com', 'AI researcher focusing on computer vision and natural language processing.', 'iristaylor', true),
('550e8400-e29b-41d4-a716-44665544000a', 'Jack', 'Anderson', 'jack.anderson@example.com', 'Security engineer with expertise in penetration testing and vulnerability assessment.', 'jackanderson', true),
('550e8400-e29b-41d4-a716-44665544000b', 'Kate', 'Thompson', 'kate.thompson@example.com', 'Frontend architect specializing in performance optimization and accessibility.', 'katethompson', true),
('550e8400-e29b-41d4-a716-44665544000c', 'Liam', 'Garcia', 'liam.garcia@example.com', 'Game developer with experience in Unity and Unreal Engine.', 'liamgarcia', true),
('550e8400-e29b-41d4-a716-44665544000d', 'Maya', 'Rodriguez', 'maya.rodriguez@example.com', 'QA engineer with automation testing expertise and quality assurance leadership.', 'mayarodriguez', true),
('550e8400-e29b-41d4-a716-44665544000e', 'Noah', 'Miller', 'noah.miller@example.com', 'Blockchain developer specializing in smart contracts and DeFi applications.', 'noahmiller', true),
('550e8400-e29b-41d4-a716-44665544000f', 'Olivia', 'Davis', 'olivia.davis@example.com', 'Technical writer and developer advocate with expertise in API documentation.', 'oliviadavis', true),
('550e8400-e29b-41d4-a716-446655440010', 'Paul', 'Wilson', 'paul.wilson@example.com', 'Database administrator with expertise in PostgreSQL and data modeling.', 'paulwilson', true),
('550e8400-e29b-41d4-a716-446655440011', 'Quinn', 'Moore', 'quinn.moore@example.com', 'Site reliability engineer focusing on system monitoring and incident response.', 'quinnmoore', true),
('550e8400-e29b-41d4-a716-446655440012', 'Ruby', 'Jackson', 'ruby.jackson@example.com', 'Machine learning engineer with experience in computer vision and deep learning.', 'rubyjackson', true),
('550e8400-e29b-41d4-a716-446655440013', 'Sam', 'White', 'sam.white@example.com', 'Cloud architect specializing in AWS and microservices architecture.', 'samwhite', true),
('550e8400-e29b-41d4-a716-446655440014', 'Tara', 'Harris', 'tara.harris@example.com', 'IoT engineer with expertise in embedded systems and sensor networks.', 'taraharris', true)
ON CONFLICT (email) DO NOTHING;

-- Insert personal details (no phone field in schema)
INSERT INTO personal_details (user_id, university, department, degree_level, date_of_birth)
VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Stanford University', 'Computer Science', 'GRADUATE', '1995-03-15'),
('550e8400-e29b-41d4-a716-446655440002', 'MIT', 'Computer Science', 'UNDERGRADUATE', '1998-07-22'),
('550e8400-e29b-41d4-a716-446655440003', 'RISD', 'Design', 'GRADUATE', '1994-11-08'),
('550e8400-e29b-41d4-a716-446655440004', 'UC Berkeley', 'Statistics', 'PHD', '1992-01-30'),
('550e8400-e29b-41d4-a716-446655440005', 'Carnegie Mellon', 'Computer Science', 'GRADUATE', '1996-09-12'),
('550e8400-e29b-41d4-a716-446655440006', 'University of Washington', 'Computer Science', 'UNDERGRADUATE', '1999-05-18'),
('550e8400-e29b-41d4-a716-446655440007', 'Georgia Tech', 'Computer Engineering', 'GRADUATE', '1993-12-03'),
('550e8400-e29b-41d4-a716-446655440008', 'Northwestern University', 'Business Administration', 'GRADUATE', '1991-08-25'),
('550e8400-e29b-41d4-a716-446655440009', 'Caltech', 'Computer Science', 'PHD', '1990-04-14'),
('550e8400-e29b-41d4-a716-44665544000a', 'Purdue University', 'Cybersecurity', 'GRADUATE', '1994-10-07'),
('550e8400-e29b-41d4-a716-44665544000b', 'UCLA', 'Computer Science', 'UNDERGRADUATE', '1997-06-20'),
('550e8400-e29b-41d4-a716-44665544000c', 'University of Southern California', 'Game Design', 'UNDERGRADUATE', '2000-02-11'),
('550e8400-e29b-41d4-a716-44665544000d', 'University of Texas at Austin', 'Computer Science', 'GRADUATE', '1995-09-28'),
('550e8400-e29b-41d4-a716-44665544000e', 'Harvard University', 'Computer Science', 'UNDERGRADUATE', '1998-12-16'),
('550e8400-e29b-41d4-a716-44665544000f', 'Columbia University', 'English Literature', 'GRADUATE', '1993-07-05'),
('550e8400-e29b-41d4-a716-446655440010', 'University of Illinois', 'Computer Science', 'GRADUATE', '1992-03-19'),
('550e8400-e29b-41d4-a716-446655440011', 'Cornell University', 'Systems Engineering', 'UNDERGRADUATE', '1996-11-23'),
('550e8400-e29b-41d4-a716-446655440012', 'Princeton University', 'Computer Science', 'PHD', '1989-08-17'),
('550e8400-e29b-41d4-a716-446655440013', 'Amazon Web Services', 'Cloud Computing', 'GRADUATE', '1994-01-09'),
('550e8400-e29b-41d4-a716-446655440014', 'MIT', 'Electrical Engineering', 'GRADUATE', '1995-05-31')
ON CONFLICT (user_id) DO NOTHING;

-- Insert technical profiles (updated field names to match schema)
INSERT INTO technical_profiles (user_id, skills, experience, github, portfolio)
VALUES
('550e8400-e29b-41d4-a716-446655440001', ARRAY['React', 'JavaScript', 'TypeScript', 'CSS', 'HTML', 'Redux'], 'INTERMEDIATE', 'https://github.com/alicejohnson', 'https://alicejohnson.dev'),
('550e8400-e29b-41d4-a716-446655440002', ARRAY['Node.js', 'React', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker'], 'ADVANCED', 'https://github.com/bobwilliams', 'https://bobwilliams.dev'),
('550e8400-e29b-41d4-a716-446655440003', ARRAY['Figma', 'Sketch', 'Adobe Creative Suite', 'Prototyping', 'User Research'], 'INTERMEDIATE', 'https://github.com/charliebrown', 'https://charliebrown.design'),
('550e8400-e29b-41d4-a716-446655440004', ARRAY['Python', 'R', 'TensorFlow', 'Pandas', 'SQL', 'Machine Learning'], 'ADVANCED', 'https://github.com/dianamartinez', 'https://dianamartinez.science'),
('550e8400-e29b-41d4-a716-446655440005', ARRAY['Java', 'Spring Boot', 'Kubernetes', 'AWS', 'PostgreSQL', 'Redis'], 'INTERMEDIATE', 'https://github.com/evedavis', 'https://evedavis.dev'),
('550e8400-e29b-41d4-a716-446655440006', ARRAY['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'API Integration'], 'INTERMEDIATE', 'https://github.com/frankwilson', 'https://frankwilson.apps'),
('550e8400-e29b-41d4-a716-446655440007', ARRAY['Docker', 'Kubernetes', 'Jenkins', 'AWS', 'Terraform', 'Monitoring'], 'ADVANCED', 'https://github.com/gracelee', 'https://gracelee.devops'),
('550e8400-e29b-41d4-a716-446655440008', ARRAY['Product Strategy', 'Agile', 'Scrum', 'Analytics', 'User Research', 'SQL'], 'SENIOR', 'https://github.com/henrychen', 'https://henrychen.pm'),
('550e8400-e29b-41d4-a716-446655440009', ARRAY['Python', 'TensorFlow', 'PyTorch', 'Computer Vision', 'NLP', 'Research'], 'SENIOR', 'https://github.com/iristaylor', 'https://iristaylor.ai'),
('550e8400-e29b-41d4-a716-44665544000a', ARRAY['Penetration Testing', 'Vulnerability Assessment', 'Network Security', 'Python', 'Bash'], 'ADVANCED', 'https://github.com/jackanderson', 'https://jackanderson.security'),
('550e8400-e29b-41d4-a716-44665544000b', ARRAY['React', 'Vue.js', 'Performance Optimization', 'Accessibility', 'Webpack', 'TypeScript'], 'SENIOR', 'https://github.com/katethompson', 'https://katethompson.frontend'),
('550e8400-e29b-41d4-a716-44665544000c', ARRAY['Unity', 'Unreal Engine', 'C#', 'C++', 'Game Design', '3D Modeling'], 'INTERMEDIATE', 'https://github.com/liamgarcia', 'https://liamgarcia.games'),
('550e8400-e29b-41d4-a716-44665544000d', ARRAY['Test Automation', 'Selenium', 'Cypress', 'API Testing', 'Performance Testing', 'Quality Assurance'], 'ADVANCED', 'https://github.com/mayarodriguez', 'https://mayarodriguez.qa'),
('550e8400-e29b-41d4-a716-44665544000e', ARRAY['Solidity', 'Web3', 'Smart Contracts', 'DeFi', 'Ethereum', 'Blockchain'], 'INTERMEDIATE', 'https://github.com/noahmiller', 'https://noahmiller.blockchain'),
('550e8400-e29b-41d4-a716-44665544000f', ARRAY['Technical Writing', 'API Documentation', 'Developer Relations', 'Content Strategy', 'Markdown'], 'ADVANCED', 'https://github.com/oliviadavis', 'https://oliviadavis.docs'),
('550e8400-e29b-41d4-a716-446655440010', ARRAY['PostgreSQL', 'Database Design', 'Performance Tuning', 'Backup & Recovery', 'SQL', 'Data Modeling'], 'SENIOR', 'https://github.com/paulwilson', 'https://paulwilson.dba'),
('550e8400-e29b-41d4-a716-446655440011', ARRAY['System Monitoring', 'Incident Response', 'Prometheus', 'Grafana', 'SRE', 'Reliability Engineering'], 'ADVANCED', 'https://github.com/quinnmoore', 'https://quinnmoore.sre'),
('550e8400-e29b-41d4-a716-446655440012', ARRAY['Machine Learning', 'Computer Vision', 'Deep Learning', 'Python', 'TensorFlow', 'Research'], 'SENIOR', 'https://github.com/rubyjackson', 'https://rubyjackson.ml'),
('550e8400-e29b-41d4-a716-446655440013', ARRAY['AWS', 'Cloud Architecture', 'Microservices', 'Serverless', 'Infrastructure as Code', 'DevOps'], 'SENIOR', 'https://github.com/samwhite', 'https://samwhite.cloud'),
('550e8400-e29b-41d4-a716-446655440014', ARRAY['IoT', 'Embedded Systems', 'Sensor Networks', 'Arduino', 'Raspberry Pi', 'C/C++'], 'INTERMEDIATE', 'https://github.com/taraharris', 'https://taraharris.iot')
ON CONFLICT (user_id) DO NOTHING;
