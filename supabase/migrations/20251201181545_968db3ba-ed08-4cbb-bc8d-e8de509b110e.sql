-- Remove the foreign key constraint on alumni_profiles.user_id
-- This allows alumni profiles to exist without requiring auth accounts
ALTER TABLE public.alumni_profiles 
DROP CONSTRAINT IF EXISTS alumni_profiles_user_id_fkey;