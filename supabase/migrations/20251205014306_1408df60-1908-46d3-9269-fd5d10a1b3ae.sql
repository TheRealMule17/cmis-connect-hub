-- Disable RLS on mentor matching tables for n8n workflow access
ALTER TABLE public.student_form_responses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_form_responses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_match_results DISABLE ROW LEVEL SECURITY;