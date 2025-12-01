import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message }: ContactRequest = await req.json();

    console.log("Processing contact form submission from:", email);

    // Validate inputs
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Store message in database
    const { error: dbError } = await supabase
      .from("contact_messages")
      .insert({
        name,
        email,
        subject,
        message,
        status: "new",
      });

    if (dbError) {
      console.error("Database error:", dbError);
      throw new Error("Failed to store contact message");
    }

    // Send email using Resend API
    const resendApiKey = Deno.env.get("RESEND_API_KEY")!;
    
    // Send email notification to CMIS
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "CMIS Contact <onboarding@resend.dev>",
        to: ["cmis@mays.tamu.edu"],
        reply_to: email,
        subject: `Contact Form: ${subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr />
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
      }),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("Email send error:", errorText);
      throw new Error("Failed to send email");
    }

    console.log("Email sent successfully");

    // Send confirmation email to user
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "CMIS <onboarding@resend.dev>",
        to: [email],
        subject: "We received your message",
        html: `
          <h2>Thank you for contacting CMIS, ${name}!</h2>
          <p>We have received your message and will get back to you as soon as possible.</p>
          <hr />
          <p><strong>Your message:</strong></p>
          <p><em>${subject}</em></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
          <hr />
          <p>Best regards,<br>The CMIS Team</p>
        `,
      }),
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Your message has been sent successfully!" 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to send message. Please try again." 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
