-- Add building and room_number columns to events table
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS building TEXT,
ADD COLUMN IF NOT EXISTS room_number TEXT;

-- Create faculty communications table
CREATE TABLE IF NOT EXISTS public.faculty_communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL,
  message_type TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  target_tier TEXT DEFAULT 'all',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS on faculty communications
ALTER TABLE public.faculty_communications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for faculty_communications
CREATE POLICY "Anyone can view communications" ON public.faculty_communications FOR SELECT USING (true);
CREATE POLICY "Faculty can create communications" ON public.faculty_communications FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'faculty'));
CREATE POLICY "Faculty can manage their communications" ON public.faculty_communications FOR ALL USING (public.has_role(auth.uid(), 'faculty'));

-- Trigger for updated_at
CREATE TRIGGER update_faculty_communications_updated_at 
BEFORE UPDATE ON public.faculty_communications 
FOR EACH ROW 
EXECUTE FUNCTION public.update_updated_at_column();