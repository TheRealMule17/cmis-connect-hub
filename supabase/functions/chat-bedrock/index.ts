import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// AWS Signature V4 signing
async function hmacSign(
  key: ArrayBuffer,
  message: string
): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: { name: "SHA-256" } },
    false,
    ["sign"]
  );
  return await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(message));
}

async function getSignatureKey(
  key: string,
  dateStamp: string,
  regionName: string,
  serviceName: string
): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const kDate = await hmacSign(encoder.encode(`AWS4${key}`).buffer, dateStamp);
  const kRegion = await hmacSign(kDate, regionName);
  const kService = await hmacSign(kRegion, serviceName);
  const kSigning = await hmacSign(kService, "aws4_request");
  return kSigning;
}

async function sha256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const hash = await crypto.subtle.digest("SHA-256", encoder.encode(data));
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, sessionId } = await req.json();
    
    if (!message) {
      console.error("Missing required field: message");
      return new Response(
        JSON.stringify({ error: "Missing required field: message" }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get AWS credentials and config from environment variables
    const awsAccessKeyId = Deno.env.get('AWS_ACCESS_KEY_ID');
    const awsSecretAccessKey = Deno.env.get('AWS_SECRET_ACCESS_KEY');
    const awsRegion = Deno.env.get('AWS_REGION') || 'us-east-1';
    const agentId = Deno.env.get('AGENT_ID');
    const agentAliasId = Deno.env.get('AGENT_ALIAS_ID') || 'TSTALIASID';

    if (!awsAccessKeyId || !awsSecretAccessKey || !agentId) {
      console.error("Missing required AWS environment variables");
      return new Response(
        JSON.stringify({ error: "AWS configuration is incomplete" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const useSessionId = sessionId || crypto.randomUUID();
    console.log(`Invoking Bedrock Agent: ${agentId} with sessionId: ${useSessionId}`);

    // Prepare the request
    const host = `bedrock-agent-runtime.${awsRegion}.amazonaws.com`;
    const endpoint = `https://${host}/agents/${agentId}/agentAliases/${agentAliasId}/sessions/${useSessionId}/text`;
    const service = 'bedrock';
    const method = 'POST';

    const requestBody = JSON.stringify({
      inputText: message,
      enableTrace: false,
      endSession: false
    });

    // Create AWS Signature V4
    const now = new Date();
    const amzDate = now.toISOString().replace(/[:\-]|\.\d{3}/g, '');
    const dateStamp = amzDate.substring(0, 8);

    const payloadHash = await sha256(requestBody);
    const canonicalHeaders = `host:${host}\nx-amz-date:${amzDate}\n`;
    const signedHeaders = 'host;x-amz-date';
    const canonicalRequest = `${method}\n${new URL(endpoint).pathname}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

    const algorithm = 'AWS4-HMAC-SHA256';
    const credentialScope = `${dateStamp}/${awsRegion}/${service}/aws4_request`;
    const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${await sha256(canonicalRequest)}`;

    const signingKey = await getSignatureKey(awsSecretAccessKey, dateStamp, awsRegion, service);
    const signatureBuffer = await hmacSign(signingKey, stringToSign);
    const signature = Array.from(new Uint8Array(signatureBuffer))
      .map((b: number) => b.toString(16).padStart(2, '0'))
      .join('');

    const authorizationHeader = `${algorithm} Credential=${awsAccessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    // Make the request to Bedrock
    const response = await fetch(endpoint, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-Amz-Date': amzDate,
        'Authorization': authorizationHeader,
        'Host': host
      },
      body: requestBody
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Bedrock API error (${response.status}):`, errorText);
      return new Response(
        JSON.stringify({ 
          error: `Bedrock API error: ${response.status}`,
          details: errorText
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // The response is an event stream, not JSON
    // Read the stream and extract text from events
    if (!response.body) {
      throw new Error("No response body from Bedrock");
    }

    console.log("Reading event stream from Bedrock...");
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        // Try to extract JSON events from the buffer
        // Events are typically newline-delimited
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep the last incomplete line in buffer

        for (const line of lines) {
          if (!line.trim()) continue;
          
          try {
            const event = JSON.parse(line);
            console.log("Event received:", event);
            
            // Extract text from completion events
            if (event.chunk && event.chunk.bytes) {
              // Decode base64 bytes if present
              const chunkText = new TextDecoder().decode(
                Uint8Array.from(atob(event.chunk.bytes), c => c.charCodeAt(0))
              );
              fullResponse += chunkText;
            } else if (event.output && event.output.text) {
              fullResponse += event.output.text;
            } else if (event.completion) {
              fullResponse += event.completion;
            } else if (typeof event === 'string') {
              fullResponse += event;
            }
          } catch (parseError) {
            console.log("Could not parse line as JSON:", line);
            // If it's not JSON, it might be plain text
            if (line.trim()) {
              fullResponse += line;
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    console.log("Agent response received successfully, length:", fullResponse.length);

    return new Response(
      JSON.stringify({ 
        response: fullResponse || "No response text received from agent",
        sessionId: useSessionId
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error("Error invoking Bedrock agent:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error occurred",
        stack: error instanceof Error ? error.stack : undefined
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
