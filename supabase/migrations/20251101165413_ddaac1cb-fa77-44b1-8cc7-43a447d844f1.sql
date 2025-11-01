-- Create sponsor profiles table
CREATE TABLE public.sponsor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_name TEXT NOT NULL,
  tier TEXT DEFAULT 'bronze',
  logo_url TEXT,
  description TEXT,
  website_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id)
);

-- Create speaker proposals table
CREATE TABLE public.speaker_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_id UUID REFERENCES public.sponsor_profiles(id) ON DELETE CASCADE NOT NULL,
  speaker_name TEXT NOT NULL,
  speaker_title TEXT NOT NULL,
  topic TEXT NOT NULL,
  description TEXT,
  preferred_date TIMESTAMPTZ,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create event registrations table for students
CREATE TABLE public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  registered_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(event_id, user_id)
);

-- Create job tracking table for students
CREATE TABLE public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  company_name TEXT NOT NULL,
  position TEXT NOT NULL,
  status TEXT DEFAULT 'searching',
  applied_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create giving opportunities table
CREATE TABLE public.giving_opportunities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  contact_email TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create case competition scoring table
CREATE TABLE public.case_competition_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id UUID REFERENCES public.case_competitions(id) ON DELETE CASCADE NOT NULL,
  judge_id UUID NOT NULL,
  team_name TEXT NOT NULL,
  room_number TEXT,
  presentation_score INTEGER,
  analysis_score INTEGER,
  creativity_score INTEGER,
  overall_score INTEGER,
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create event photos table
CREATE TABLE public.event_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT,
  uploaded_by UUID,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create mentor matches table
CREATE TABLE public.mentor_matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL,
  student_id UUID NOT NULL,
  match_score INTEGER,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(mentor_id, student_id)
);

-- Enable RLS
ALTER TABLE public.sponsor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.speaker_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.giving_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_competition_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_matches ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sponsor_profiles
CREATE POLICY "Users can view all sponsor profiles" ON public.sponsor_profiles FOR SELECT USING (true);
CREATE POLICY "Sponsors can update their own profile" ON public.sponsor_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Sponsors can create their own profile" ON public.sponsor_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for speaker_proposals
CREATE POLICY "Anyone can view speaker proposals" ON public.speaker_proposals FOR SELECT USING (true);
CREATE POLICY "Sponsors can create speaker proposals" ON public.speaker_proposals FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.sponsor_profiles WHERE sponsor_profiles.id = sponsor_id AND sponsor_profiles.user_id = auth.uid()));
CREATE POLICY "Sponsors can update their own proposals" ON public.speaker_proposals FOR UPDATE USING (EXISTS (SELECT 1 FROM public.sponsor_profiles WHERE sponsor_profiles.id = sponsor_id AND sponsor_profiles.user_id = auth.uid()));
CREATE POLICY "Faculty can manage speaker proposals" ON public.speaker_proposals FOR ALL USING (public.has_role(auth.uid(), 'faculty'));

-- RLS Policies for event_registrations
CREATE POLICY "Users can view their own registrations" ON public.event_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own registrations" ON public.event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own registrations" ON public.event_registrations FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Faculty can view all registrations" ON public.event_registrations FOR SELECT USING (public.has_role(auth.uid(), 'faculty'));

-- RLS Policies for job_applications
CREATE POLICY "Users can view their own job applications" ON public.job_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own job applications" ON public.job_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own job applications" ON public.job_applications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own job applications" ON public.job_applications FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for giving_opportunities
CREATE POLICY "Anyone can view active giving opportunities" ON public.giving_opportunities FOR SELECT USING (status = 'active');
CREATE POLICY "Faculty can manage giving opportunities" ON public.giving_opportunities FOR ALL USING (public.has_role(auth.uid(), 'faculty'));

-- RLS Policies for case_competition_scores
CREATE POLICY "Judges can view their own scores" ON public.case_competition_scores FOR SELECT USING (auth.uid() = judge_id);
CREATE POLICY "Judges can create scores" ON public.case_competition_scores FOR INSERT WITH CHECK (auth.uid() = judge_id);
CREATE POLICY "Judges can update their own scores" ON public.case_competition_scores FOR UPDATE USING (auth.uid() = judge_id);
CREATE POLICY "Faculty can view all scores" ON public.case_competition_scores FOR SELECT USING (public.has_role(auth.uid(), 'faculty'));

-- RLS Policies for event_photos
CREATE POLICY "Anyone can view event photos" ON public.event_photos FOR SELECT USING (true);
CREATE POLICY "Faculty can manage event photos" ON public.event_photos FOR ALL USING (public.has_role(auth.uid(), 'faculty'));

-- RLS Policies for mentor_matches
CREATE POLICY "Users can view their own matches" ON public.mentor_matches FOR SELECT USING (auth.uid() = mentor_id OR auth.uid() = student_id);
CREATE POLICY "Faculty can manage mentor matches" ON public.mentor_matches FOR ALL USING (public.has_role(auth.uid(), 'faculty'));

-- Triggers for updated_at
CREATE TRIGGER update_sponsor_profiles_updated_at BEFORE UPDATE ON public.sponsor_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_speaker_proposals_updated_at BEFORE UPDATE ON public.speaker_proposals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON public.job_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_giving_opportunities_updated_at BEFORE UPDATE ON public.giving_opportunities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_case_competition_scores_updated_at BEFORE UPDATE ON public.case_competition_scores FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();