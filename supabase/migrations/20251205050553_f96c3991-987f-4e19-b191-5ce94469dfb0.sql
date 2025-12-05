CREATE OR REPLACE FUNCTION reset_sync_data()
RETURNS void AS $$
BEGIN
  TRUNCATE TABLE mentor_match_results CASCADE;
  TRUNCATE TABLE mentor_form_responses CASCADE;
  TRUNCATE TABLE student_form_responses CASCADE;
END;
$$ LANGUAGE plpgsql;