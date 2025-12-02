import { AWSSignerV4 } from "https://deno.land/x/aws_sign_v4@1.0.2/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to parse the event stream response from Bedrock Agent
function parseBedrockResponse(responseText: string): string {
  try {
    // The response contains event stream data with JSON embedded
    // Look for the text in the attribution.citations or decode from bytes
    
    // Try to find JSON objects in the response
    const jsonMatches = responseText.match(/\{[^{}]*"text"[^{}]*\}/g);
    if (jsonMatches) {
      for (const match of jsonMatches) {
        try {
          const parsed = JSON.parse(match);
          if (parsed.text) {
            return parsed.text;
          }
        } catch {
          // Continue to next match
        }
      }
    }
    
    // Try to find and extract text from the full response
    const textMatch = responseText.match(/"text":"([^"]+)"/);
    if (textMatch && textMatch[1]) {
      return textMatch[1];
    }
    
    // Try to find bytes and decode base64
    const bytesMatch = responseText.match(/"bytes":"([A-Za-z0-9+/=]+)"/);
    if (bytesMatch && bytesMatch[1]) {
      try {
        const decoded = atob(bytesMatch[1]);
        // Clean up the decoded text (remove control characters)
        return decoded.replace(/[\x00-\x1F\x7F]/g, '').trim();
      } catch {
        // Base64 decode failed
      }
    }
    
    // If nothing worked, return cleaned version of raw response
    return responseText.replace(/[\x00-\x1F\x7F]/g, '').trim();
  } catch (error) {
    console.error("Error parsing Bedrock response:", error);
    return responseText;
  }
}

Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { message, sessionId } = await req.json();
    
    const region = Deno.env.get("AWS_REGION") ?? "us-east-1";
    const agentId = Deno.env.get("AGENT_ID");
    const agentAliasId = Deno.env.get("AGENT_ALIAS_ID") ?? "TSTALIASID";
    const accessKeyId = Deno.env.get("AWS_ACCESS_KEY_ID") ?? "";
    const secretAccessKey = Deno.env.get("AWS_SECRET_ACCESS_KEY") ?? "";
    
    const useSessionId = sessionId || crypto.randomUUID();
    
    console.log(`Invoking Bedrock Agent: ${agentId} with sessionId: ${useSessionId}`);

    // Bedrock Agent Runtime API endpoint
    const endpoint = `https://bedrock-agent-runtime.${region}.amazonaws.com/agents/${agentId}/agentAliases/${agentAliasId}/sessions/${useSessionId}/text`;
    
    const body = JSON.stringify({
      inputText: message,
    });

    // Create AWS Signature V4 signer
    const signer = new AWSSignerV4(region, {
      awsAccessKeyId: accessKeyId,
      awsSecretKey: secretAccessKey,
    });

    // Sign the request
    const signedRequest = await signer.sign("bedrock", new Request(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    }));

    // Make the request to Bedrock
    const response = await fetch(signedRequest);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Bedrock API error:", response.status, errorText);
      throw new Error(`Bedrock API error: ${response.status} - ${errorText}`);
    }

    // Parse the response
    const responseBody = await response.text();
    console.log("Raw response length:", responseBody.length);
    
    // Parse the event stream response to extract the text
    const completion = parseBedrockResponse(responseBody);
    
    console.log("Parsed completion:", completion.substring(0, 200));

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
