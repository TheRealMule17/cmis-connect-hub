-- Add unique constraint to allow ON CONFLICT upserts from n8n
ALTER TABLE mentor_match_results 
ADD CONSTRAINT unique_match_pair UNIQUE (student_name, mentor_name);