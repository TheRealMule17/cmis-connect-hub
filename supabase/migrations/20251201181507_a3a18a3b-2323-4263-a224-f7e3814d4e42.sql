-- Allow authenticated users to view all alumni profiles
CREATE POLICY "Authenticated users can view all alumni profiles" 
ON public.alumni_profiles 
FOR SELECT 
TO authenticated
USING (true);

-- Allow public viewing of alumni profiles (for public-facing alumni directory)
CREATE POLICY "Anyone can view alumni profiles" 
ON public.alumni_profiles 
FOR SELECT 
TO anon
USING (true);