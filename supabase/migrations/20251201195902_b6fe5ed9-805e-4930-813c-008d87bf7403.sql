-- Create contact_messages table
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert contact messages
CREATE POLICY "Anyone can submit contact messages"
ON public.contact_messages
FOR INSERT
WITH CHECK (true);

-- Faculty can view all contact messages
CREATE POLICY "Faculty can view all contact messages"
ON public.contact_messages
FOR SELECT
USING (has_role(auth.uid(), 'faculty'::app_role));

-- Faculty can update contact messages (for marking as read/responded)
CREATE POLICY "Faculty can update contact messages"
ON public.contact_messages
FOR UPDATE
USING (has_role(auth.uid(), 'faculty'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_contact_messages_updated_at
BEFORE UPDATE ON public.contact_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();