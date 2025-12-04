-- Make the resumes bucket public so previews work
UPDATE storage.buckets 
SET public = true 
WHERE id = 'resumes';

-- Drop existing policies if they exist and recreate them
DO $$ 
BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "Users can upload their own resume" ON storage.objects;
  DROP POLICY IF EXISTS "Users can update their own resume" ON storage.objects;
  DROP POLICY IF EXISTS "Users can delete their own resume" ON storage.objects;
  DROP POLICY IF EXISTS "Anyone can view resumes" ON storage.objects;
END $$;

-- Create storage policies for resumes bucket
CREATE POLICY "Users can upload their own resume"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'resumes' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own resume"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'resumes' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own resume"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'resumes' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Anyone can view resumes"
ON storage.objects FOR SELECT
USING (bucket_id = 'resumes');