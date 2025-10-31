-- Create enum for user roles
CREATE TYPE public.app_role AS ENUM ('faculty', 'student', 'alumni', 'admin', 'sponsor');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  capacity INTEGER,
  organizer_id UUID NOT NULL,
  event_type TEXT,
  status TEXT DEFAULT 'upcoming',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Faculty can manage events"
ON public.events
FOR ALL
USING (public.has_role(auth.uid(), 'faculty'));

CREATE POLICY "Anyone can view events"
ON public.events
FOR SELECT
USING (true);

-- Case competitions table
CREATE TABLE public.case_competitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  prize_pool TEXT,
  sponsor TEXT,
  status TEXT DEFAULT 'upcoming',
  max_team_size INTEGER,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.case_competitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Faculty can manage case competitions"
ON public.case_competitions
FOR ALL
USING (public.has_role(auth.uid(), 'faculty'));

CREATE POLICY "Anyone can view case competitions"
ON public.case_competitions
FOR SELECT
USING (true);

-- Industry speakers table
CREATE TABLE public.industry_speakers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  expertise TEXT[],
  bio TEXT,
  availability TEXT,
  speaking_topics TEXT[],
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.industry_speakers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Faculty can manage speakers"
ON public.industry_speakers
FOR ALL
USING (public.has_role(auth.uid(), 'faculty'));

CREATE POLICY "Anyone can view speakers"
ON public.industry_speakers
FOR SELECT
USING (true);

-- Mentor marketplace table
CREATE TABLE public.mentor_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  expertise_areas TEXT[],
  availability TEXT,
  max_mentees INTEGER,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.mentor_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Faculty can manage mentor listings"
ON public.mentor_listings
FOR ALL
USING (public.has_role(auth.uid(), 'faculty'));

CREATE POLICY "Anyone can view active mentor listings"
ON public.mentor_listings
FOR SELECT
USING (status = 'active');

-- Research collaborations table
CREATE TABLE public.research_collaborations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  lead_researcher_id UUID NOT NULL,
  research_area TEXT,
  collaboration_type TEXT,
  seeking_roles TEXT[],
  requirements TEXT,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.research_collaborations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Faculty can manage research collaborations"
ON public.research_collaborations
FOR ALL
USING (public.has_role(auth.uid(), 'faculty'));

CREATE POLICY "Anyone can view open collaborations"
ON public.research_collaborations
FOR SELECT
USING (status = 'open');

-- Triggers for updated_at
CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_case_competitions_updated_at
BEFORE UPDATE ON public.case_competitions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_industry_speakers_updated_at
BEFORE UPDATE ON public.industry_speakers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_mentor_listings_updated_at
BEFORE UPDATE ON public.mentor_listings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_research_collaborations_updated_at
BEFORE UPDATE ON public.research_collaborations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();