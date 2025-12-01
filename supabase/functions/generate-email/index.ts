import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { emailType, recipientName, purpose, details, recipients, batchMode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Build context-specific prompt based on email type
    let systemPrompt = "";
    if (emailType === "thank-you") {
      systemPrompt = "You are a professional email writer specializing in crafting warm, sincere thank you notes for academic and professional contexts. Write personalized, appreciative emails that express genuine gratitude.";
    } else if (emailType === "event-invitation") {
      systemPrompt = "You are a professional email writer specializing in event invitations for academic settings. Write engaging, clear invitations that provide all necessary details and encourage attendance.";
    } else if (emailType === "networking") {
      systemPrompt = "You are a professional email writer specializing in networking and outreach. Write professional, personable emails that build connections and encourage responses.";
    }

    // Handle batch mode
    if (batchMode && recipients && Array.isArray(recipients)) {
      const generatedEmails = [];
      
      for (const recipient of recipients) {
        const userPrompt = `Write a ${emailType} email with the following details:
        
Recipient: ${recipient.name}
${recipient.email ? `Recipient Email: ${recipient.email}` : ''}
Purpose: ${purpose}
Additional Details: ${details}

Generate a complete, professional email with subject line and body. The subject should be on the first line starting with "Subject:", followed by the email body. Format it clearly with proper spacing.`;

        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt }
            ],
          }),
        });

        if (!response.ok) {
          console.error(`Failed to generate email for ${recipient.name}`);
          continue;
        }

        const data = await response.json();
        const generatedEmail = data.choices[0].message.content;
        
        // Parse subject and body
        const subjectMatch = generatedEmail.match(/Subject:\s*(.+?)(?:\n|$)/i);
        const subject = subjectMatch ? subjectMatch[1].trim() : `${emailType} Email`;
        const body = generatedEmail.replace(/Subject:.+?(?:\n|$)/i, '').trim();

        generatedEmails.push({
          recipient_name: recipient.name,
          recipient_email: recipient.email || '',
          subject,
          body,
        });
      }

      return new Response(JSON.stringify({ emails: generatedEmails }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Single email mode
    const userPrompt = `Write a ${emailType} email with the following details:
    
Recipient: ${recipientName}
Purpose: ${purpose}
Additional Details: ${details}

Generate a complete, professional email with subject line and body. Format it clearly with proper spacing.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const generatedEmail = data.choices[0].message.content;

    return new Response(JSON.stringify({ email: generatedEmail }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-email error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
