import { AWSSignerV4 } from "https://deno.land/x/aws_sign_v4@1.0.2/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message, sessionId } = await req.json();
    
    const region = Deno.env.get("AWS_REGION") ?? "us-east-1";
    const botId = Deno.env.get("LEX_BOT_ID");
    const botAliasId = Deno.env.get("LEX_BOT_ALIAS_ID") ?? "TSTALIASID";
    const accessKeyId = Deno.env.get("AWS_ACCESS_KEY_ID") ?? "";
    const secretAccessKey = Deno.env.get("AWS_SECRET_ACCESS_KEY") ?? "";
    
    const useSessionId = sessionId || crypto.randomUUID();
    
    console.log(`Invoking Lex Bot: ${botId} with sessionId: ${useSessionId}`);

    if (!botId) {
      throw new Error("LEX_BOT_ID is not configured");
    }

    // Amazon Lex Runtime V2 API endpoint
    const endpoint = `https://runtime-v2-lex.${region}.amazonaws.com/bots/${botId}/botAliases/${botAliasId}/botLocales/en_US/sessions/${useSessionId}/text`;
    
    const body = JSON.stringify({
      text: message,
    });

    // Create AWS Signature V4 signer
    const signer = new AWSSignerV4(region, {
      awsAccessKeyId: accessKeyId,
      awsSecretKey: secretAccessKey,
    });

    // Sign the request
    const signedRequest = await signer.sign("lex", new Request(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    }));

    // Make the request to Lex
    const response = await fetch(signedRequest);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lex API error:", response.status, errorText);
      throw new Error(`Lex API error: ${response.status} - ${errorText}`);
    }

    // Parse the response
    const responseBody = await response.json();
    console.log("Lex response:", JSON.stringify(responseBody));
    
    // Extract the message from Lex response
    let completion = "";
    
    if (responseBody.messages && responseBody.messages.length > 0) {
      // Concatenate all messages from Lex
      completion = responseBody.messages
        .map((msg: { content?: string }) => msg.content || "")
        .join("\n");
    } else {
      completion = "I'm sorry, I didn't understand that. Could you please rephrase?";
    }
    
    console.log("Parsed completion:", completion);

    return new Response(JSON.stringify({ reply: completion, sessionId: useSessionId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
