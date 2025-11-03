-- Fix: Restrict industry_speakers table to authenticated users only
-- Remove public access policy and replace with authenticated-only policy
DROP POLICY IF EXISTS "Anyone can view speakers" ON public.industry_speakers;

CREATE POLICY "Authenticated users can view speakers"
ON public.industry_speakers
FOR SELECT
USING (auth.uid() IS NOT NULL);