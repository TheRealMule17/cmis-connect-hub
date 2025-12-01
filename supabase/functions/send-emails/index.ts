import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    const { emailIds } = await req.json();

    if (!emailIds || !Array.isArray(emailIds) || emailIds.length === 0) {
      return new Response(JSON.stringify({ error: "Email IDs are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch emails to send
    const { data: emails, error: fetchError } = await supabaseClient
      .from("generated_emails")
      .select("*")
      .in("id", emailIds)
      .eq("status", "approved");

    if (fetchError) {
      console.error("Error fetching emails:", fetchError);
      return new Response(JSON.stringify({ error: "Failed to fetch emails" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!emails || emails.length === 0) {
      return new Response(JSON.stringify({ error: "No approved emails found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const results = [];
    const now = new Date().toISOString();

    for (const email of emails) {
      try {
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "CMIS Portal <onboarding@resend.dev>",
            to: [email.recipient_email],
            subject: email.subject,
            html: email.body.replace(/\n/g, "<br>"),
          }),
        });

        if (!emailResponse.ok) {
          const errorText = await emailResponse.text();
          throw new Error(`Resend API error: ${errorText}`);
        }

        const emailData = await emailResponse.json();
        console.log("Email sent successfully:", emailData);

        // Update email status
        await supabaseClient
          .from("generated_emails")
          .update({ status: "sent", sent_at: now })
          .eq("id", email.id);

        results.push({ id: email.id, success: true });
      } catch (error: any) {
        console.error(`Error sending email ${email.id}:`, error);
        
        // Update email status to failed
        await supabaseClient
          .from("generated_emails")
          .update({ status: "failed", notes: error.message })
          .eq("id", email.id);

        results.push({ id: email.id, success: false, error: error.message });
      }
    }

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("send-emails error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
