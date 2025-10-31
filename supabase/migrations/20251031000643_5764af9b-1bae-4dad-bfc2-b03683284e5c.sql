-- Create alumni profiles table
CREATE TABLE public.alumni_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  graduation_year INTEGER,
  degree TEXT,
  major TEXT,
  bio TEXT,
  current_company TEXT,
  current_position TEXT,
  is_mentor BOOLEAN DEFAULT false,
  mentor_expertise TEXT[],
  mentor_availability TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  website_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.alumni_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for alumni profiles
CREATE POLICY "Users can view their own alumni profile"
ON public.alumni_profiles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own alumni profile"
ON public.alumni_profiles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alumni profile"
ON public.alumni_profiles
FOR UPDATE
USING (auth.uid() = user_id);

-- Create career history table
CREATE TABLE public.career_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  is_current BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.career_history ENABLE ROW LEVEL SECURITY;

-- Create policies for career history
CREATE POLICY "Users can view their own career history"
ON public.career_history
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own career history"
ON public.career_history
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own career history"
ON public.career_history
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own career history"
ON public.career_history
FOR DELETE
USING (auth.uid() = user_id);

-- Create success stories table
CREATE TABLE public.success_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  story TEXT NOT NULL,
  category TEXT,
  is_published BOOLEAN DEFAULT false,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  published_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;

-- Create policies for success stories
CREATE POLICY "Users can view their own success stories"
ON public.success_stories
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own success stories"
ON public.success_stories
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own success stories"
ON public.success_stories
FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can view published success stories"
ON public.success_stories
FOR SELECT
USING (is_published = true);

-- Create trigger for automatic timestamp updates on alumni_profiles
CREATE TRIGGER update_alumni_profiles_updated_at
BEFORE UPDATE ON public.alumni_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new alumni user signup
CREATE OR REPLACE FUNCTION public.handle_new_alumni_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.alumni_profiles (user_id, name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;