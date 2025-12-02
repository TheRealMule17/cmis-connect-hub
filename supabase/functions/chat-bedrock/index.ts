import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { BedrockAgentRuntimeClient, InvokeAgentCommand } from "https://esm.sh/@aws-sdk/client-bedrock-agent-runtime@3.744.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Create the Bedrock Agent Runtime client
    const client = new BedrockAgentRuntimeClient({
      region: awsRegion,
      credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey,
      },
    });

    // Create and send the command
    const command = new InvokeAgentCommand({
      agentId: agentId,
      agentAliasId: agentAliasId,
      sessionId: useSessionId,
      inputText: message,
    });

    const response = await client.send(command);

    if (response.completion === undefined) {
      throw new Error("No completion found in response");
    }

    let completion = "";

    // CRITICAL FIX: Correctly parsing the async iterable
    for await (const event of response.completion) {
      if (event.chunk && event.chunk.bytes) {
        const chunk = new TextDecoder("utf-8").decode(event.chunk.bytes);
        completion += chunk;
      }
    }

    console.log("Final completion length:", completion.length);

    return new Response(
      JSON.stringify({ 
        response: completion || "No response text received from agent",
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
