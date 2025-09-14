-- Add LinkedIn field to technical_profiles table
ALTER TABLE technical_profiles 
ADD COLUMN IF NOT EXISTS linkedin VARCHAR(255);

-- Add comment to document the new column
COMMENT ON COLUMN technical_profiles.linkedin IS 'LinkedIn profile URL for professional networking';