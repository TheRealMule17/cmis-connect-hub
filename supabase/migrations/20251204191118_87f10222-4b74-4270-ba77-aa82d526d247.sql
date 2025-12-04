-- Add columns to store individual recipient and event info
ALTER TABLE public.faculty_communications 
ADD COLUMN recipient_id uuid DEFAULT NULL,
ADD COLUMN recipient_name text DEFAULT NULL,
ADD COLUMN event_id uuid DEFAULT NULL,
ADD COLUMN event_name text DEFAULT NULL;

-- Add foreign key for event_id (optional reference)
ALTER TABLE public.faculty_communications 
ADD CONSTRAINT faculty_communications_event_id_fkey 
FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE SET NULL;