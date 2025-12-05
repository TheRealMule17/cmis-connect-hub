-- 1. Fix Student Table
ALTER TABLE student_form_responses
ADD CONSTRAINT unique_student_email UNIQUE (tamu_email);

-- 2. Fix Mentor Table
ALTER TABLE mentor_form_responses
ADD CONSTRAINT unique_mentor_email UNIQUE (email);