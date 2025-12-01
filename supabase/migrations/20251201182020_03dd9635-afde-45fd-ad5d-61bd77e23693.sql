-- Allow faculty to create generated emails
CREATE POLICY "Faculty can create generated emails" 
ON public.generated_emails 
FOR INSERT 
TO authenticated
WITH CHECK (has_role(auth.uid(), 'faculty'::app_role));

-- Allow faculty to view all generated emails
CREATE POLICY "Faculty can view all generated emails" 
ON public.generated_emails 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'faculty'::app_role));

-- Allow faculty to update all generated emails
CREATE POLICY "Faculty can update all generated emails" 
ON public.generated_emails 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'faculty'::app_role));

-- Allow faculty to delete generated emails
CREATE POLICY "Faculty can delete generated emails" 
ON public.generated_emails 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'faculty'::app_role));