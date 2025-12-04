-- Create table for student form responses
CREATE TABLE public.student_form_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  tamu_email TEXT NOT NULL,
  career_choice_1 TEXT,
  career_choice_2 TEXT,
  career_choice_3 TEXT,
  career_interest_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for mentor form responses
CREATE TABLE public.mentor_form_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  bio_expertise TEXT,
  student_capacity INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for storing matched pairs
CREATE TABLE public.mentor_match_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  mentor_name TEXT NOT NULL,
  matched_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'active'
);

-- Enable RLS
ALTER TABLE public.student_form_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_form_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_match_results ENABLE ROW LEVEL SECURITY;

-- Faculty can manage all tables
CREATE POLICY "Faculty can manage student form responses" ON public.student_form_responses FOR ALL USING (has_role(auth.uid(), 'faculty'::app_role));
CREATE POLICY "Faculty can manage mentor form responses" ON public.mentor_form_responses FOR ALL USING (has_role(auth.uid(), 'faculty'::app_role));
CREATE POLICY "Faculty can manage mentor match results" ON public.mentor_match_results FOR ALL USING (has_role(auth.uid(), 'faculty'::app_role));

-- Allow public insert for n8n webhook (no auth)
CREATE POLICY "Allow public insert for student responses" ON public.student_form_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert for mentor responses" ON public.mentor_form_responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert for match results" ON public.mentor_match_results FOR INSERT WITH CHECK (true);

-- Create triggers for updated_at
CREATE TRIGGER update_student_form_responses_updated_at BEFORE UPDATE ON public.student_form_responses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_mentor_form_responses_updated_at BEFORE UPDATE ON public.mentor_form_responses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();