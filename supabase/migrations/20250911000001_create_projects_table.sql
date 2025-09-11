-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  
  -- Basic project information
  project_name VARCHAR(255) NOT NULL,
  project_image TEXT, -- URL to project screenshot/image
  
  -- Project links
  live_site_url TEXT,
  github_link TEXT,
  video_url TEXT, -- Demo video or presentation
  
  -- Project details
  tags TEXT[] DEFAULT '{}', -- Array of technology tags
  case_summary TEXT, -- Brief project description
  build_journey TEXT, -- Development process and challenges
  key_features TEXT[], -- Array of key features
  results TEXT, -- Outcomes, metrics, learnings
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT projects_project_name_check CHECK (char_length(project_name) > 0)
);

-- Add foreign key constraint only if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'projects_user_id_fkey' 
    AND table_name = 'projects'
  ) THEN
    ALTER TABLE projects ADD CONSTRAINT projects_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create indexes for better query performance
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_projects_user_id') THEN
    CREATE INDEX idx_projects_user_id ON projects(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_projects_created_at') THEN
    CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_projects_tags') THEN
    CREATE INDEX idx_projects_tags ON projects USING GIN(tags);
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (only if they don't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can view their own projects' AND tablename = 'projects'
  ) THEN
    CREATE POLICY "Users can view their own projects" ON projects
      FOR SELECT USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own projects' AND tablename = 'projects'
  ) THEN
    CREATE POLICY "Users can insert their own projects" ON projects
      FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own projects' AND tablename = 'projects'
  ) THEN
    CREATE POLICY "Users can update their own projects" ON projects
      FOR UPDATE USING (auth.uid() = user_id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can delete their own projects' AND tablename = 'projects'
  ) THEN
    CREATE POLICY "Users can delete their own projects" ON projects
      FOR DELETE USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger only if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'update_projects_updated_at' 
    AND event_object_table = 'projects'
  ) THEN
    CREATE TRIGGER update_projects_updated_at
      BEFORE UPDATE ON projects
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- Remove experience column from technical_profiles table (if it exists)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'technical_profiles' 
    AND column_name = 'experience'
  ) THEN
    ALTER TABLE technical_profiles DROP COLUMN experience;
  END IF;
END $$;

-- Add comment to document the schema
COMMENT ON TABLE projects IS 'User projects with detailed information including links, features, and development journey';
COMMENT ON COLUMN projects.tags IS 'Array of technology/skill tags used in the project';
COMMENT ON COLUMN projects.key_features IS 'Array of key features or accomplishments of the project';
COMMENT ON COLUMN projects.case_summary IS 'Brief summary or description of the project';
COMMENT ON COLUMN projects.build_journey IS 'Development process, challenges faced, and solutions implemented';
COMMENT ON COLUMN projects.results IS 'Project outcomes, metrics, user feedback, or personal learnings';
