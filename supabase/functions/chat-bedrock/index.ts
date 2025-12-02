import { BedrockAgentRuntimeClient, InvokeAgentCommand } from "https://esm.sh/@aws-sdk/client-bedrock-agent-runtime@3.744.0";

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

    const client = new BedrockAgentRuntimeClient({
      region: Deno.env.get("AWS_REGION"),
      credentials: {
        accessKeyId: Deno.env.get("AWS_ACCESS_KEY_ID") ?? "",
        secretAccessKey: Deno.env.get("AWS_SECRET_ACCESS_KEY") ?? "",
      },
    });

    const command = new InvokeAgentCommand({
      agentId: Deno.env.get("AGENT_ID"),
      agentAliasId: Deno.env.get("AGENT_ALIAS_ID"),
      sessionId: sessionId,
      inputText: message,
    });

    const response = await client.send(command);

    let completion = "";
    if (response.completion) {
      for await (const event of response.completion) {
        if (event.chunk && event.chunk.bytes) {
          const chunk = new TextDecoder("utf-8").decode(event.chunk.bytes);
          completion += chunk;
        }
      }
    }

    return new Response(JSON.stringify({ reply: completion }), {
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
