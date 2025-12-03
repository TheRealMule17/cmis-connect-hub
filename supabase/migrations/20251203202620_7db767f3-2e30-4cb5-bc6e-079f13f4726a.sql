-- Allow faculty to view all student profiles (for analytics)
CREATE POLICY "Faculty can view all student profiles"
ON public.student_profiles
FOR SELECT
USING (public.has_role(auth.uid(), 'faculty'::app_role));