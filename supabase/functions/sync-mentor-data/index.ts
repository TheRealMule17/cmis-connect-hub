import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body = await req.json();
    const { action, data } = body;

    console.log("Received action:", action);
    console.log("Data:", JSON.stringify(data, null, 2));

    let result;

    switch (action) {
      case "sync_students": {
        // Expects array of student objects from Google Sheets
        // Fields: "First and Last Name", "TAMU Email", "Career/Job Choice #1", "Career/Job Choice #2", "Career/Job Choice #3", "Why are you interested in these career paths?"
        const students = data.map((s: any) => ({
          full_name: s["First and Last Name"] || s.full_name,
          tamu_email: s["TAMU Email"] || s.tamu_email,
          career_choice_1: s["Career/Job Choice #1"] || s.career_choice_1,
          career_choice_2: s["Career/Job Choice #2"] || s.career_choice_2,
          career_choice_3: s["Career/Job Choice #3"] || s.career_choice_3,
          career_interest_reason: s["Why are you interested in these career paths?"] || s.career_interest_reason,
        }));

        // Clear existing and insert new (full sync)
        await supabase.from("student_form_responses").delete().neq("id", "00000000-0000-0000-0000-000000000000");
        const { data: insertedStudents, error: studentError } = await supabase
          .from("student_form_responses")
          .insert(students)
          .select();

        if (studentError) throw studentError;
        result = { students_synced: insertedStudents?.length || 0 };
        break;
      }

      case "sync_mentors": {
        // Expects array of mentor objects from Google Sheets
        // Fields: "First and Last Name", "Email", "Bio/Expertise", "Student Capacity"
        const mentors = data.map((m: any) => ({
          full_name: m["First and Last Name"] || m.full_name,
          email: m["Email"] || m.email,
          bio_expertise: m["Bio/Expertise"] || m.bio_expertise,
          student_capacity: parseInt(m["Student Capacity"] || m.student_capacity) || null,
        }));

        // Clear existing and insert new (full sync)
        await supabase.from("mentor_form_responses").delete().neq("id", "00000000-0000-0000-0000-000000000000");
        const { data: insertedMentors, error: mentorError } = await supabase
          .from("mentor_form_responses")
          .insert(mentors)
          .select();

        if (mentorError) throw mentorError;
        result = { mentors_synced: insertedMentors?.length || 0 };
        break;
      }

      case "sync_matches": {
        // Expects array of match objects from Google Sheets
        // Fields: "Student Name", "Mentor Name"
        const matches = data.map((m: any) => ({
          student_name: m["Student Name"] || m.student_name,
          mentor_name: m["Mentor Name"] || m.mentor_name,
        }));

        // Clear existing and insert new (full sync)
        await supabase.from("mentor_match_results").delete().neq("id", "00000000-0000-0000-0000-000000000000");
        const { data: insertedMatches, error: matchError } = await supabase
          .from("mentor_match_results")
          .insert(matches)
          .select();

        if (matchError) throw matchError;
        result = { matches_synced: insertedMatches?.length || 0 };
        break;
      }

      case "trigger_n8n": {
        // Proxy request to n8n webhook to avoid CORS
        const webhookUrl = body.webhookUrl || "https://mitchpeif.app.n8n.cloud/webhook/sync-matching";
        const httpMethod = body.method || "GET";
        console.log("Triggering n8n webhook:", webhookUrl, "method:", httpMethod);
        
        const fetchOptions: RequestInit = {
          method: httpMethod,
          headers: { "Content-Type": "application/json" },
        };
        
        // Include body for POST requests (send empty object if no data)
        if (httpMethod === "POST") {
          fetchOptions.body = JSON.stringify(data || { timestamp: new Date().toISOString() });
        }
        
        const n8nResponse = await fetch(webhookUrl, fetchOptions);

        if (!n8nResponse.ok) {
          throw new Error(`n8n webhook returned ${n8nResponse.status}`);
        }

        let n8nData;
        try {
          n8nData = await n8nResponse.json();
        } catch {
          n8nData = { success: true };
        }

        console.log("n8n response:", JSON.stringify(n8nData, null, 2));
        result = n8nData;
        break;
      }

      case "reset_data": {
        // Call the reset_sync_data function to truncate all sync tables
        console.log("Resetting all sync data...");
        const { error: resetError } = await supabase.rpc("reset_sync_data");
        
        if (resetError) throw resetError;
        result = { reset: true, message: "All sync data cleared successfully" };
        break;
      }

      case "sync_all": {
        // Sync all three at once
        const { students, mentors, matches } = data;
        const results: any = {};

        if (students && students.length > 0) {
          const studentData = students.map((s: any) => ({
            full_name: s["First and Last Name"] || s.full_name,
            tamu_email: s["TAMU Email"] || s.tamu_email,
            career_choice_1: s["Career/Job Choice #1"] || s.career_choice_1,
            career_choice_2: s["Career/Job Choice #2"] || s.career_choice_2,
            career_choice_3: s["Career/Job Choice #3"] || s.career_choice_3,
            career_interest_reason: s["Why are you interested in these career paths?"] || s.career_interest_reason,
          }));
          await supabase.from("student_form_responses").delete().neq("id", "00000000-0000-0000-0000-000000000000");
          const { data: inserted } = await supabase.from("student_form_responses").insert(studentData).select();
          results.students_synced = inserted?.length || 0;
        }

        if (mentors && mentors.length > 0) {
          const mentorData = mentors.map((m: any) => ({
            full_name: m["First and Last Name"] || m.full_name,
            email: m["Email"] || m.email,
            bio_expertise: m["Bio/Expertise"] || m.bio_expertise,
            student_capacity: parseInt(m["Student Capacity"] || m.student_capacity) || null,
          }));
          await supabase.from("mentor_form_responses").delete().neq("id", "00000000-0000-0000-0000-000000000000");
          const { data: inserted } = await supabase.from("mentor_form_responses").insert(mentorData).select();
          results.mentors_synced = inserted?.length || 0;
        }

        if (matches && matches.length > 0) {
          const matchData = matches.map((m: any) => ({
            student_name: m["Student Name"] || m.student_name,
            mentor_name: m["Mentor Name"] || m.mentor_name,
          }));
          await supabase.from("mentor_match_results").delete().neq("id", "00000000-0000-0000-0000-000000000000");
          const { data: inserted } = await supabase.from("mentor_match_results").insert(matchData).select();
          results.matches_synced = inserted?.length || 0;
        }

        result = results;
        break;
      }

      default:
        return new Response(
          JSON.stringify({ error: "Invalid action. Use: sync_students, sync_mentors, sync_matches, sync_all, reset_data, or trigger_n8n" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }

    console.log("Sync result:", result);
    return new Response(
      JSON.stringify({ success: true, ...result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
