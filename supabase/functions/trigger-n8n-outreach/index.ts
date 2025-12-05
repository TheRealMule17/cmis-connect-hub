import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const N8N_BATCH_OUTREACH_URL = "https://mule17.app.n8n.cloud/webhook/516303a6-03fc-40b8-bb4e-1b9e661c2be9";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('Triggering n8n batch outreach workflow...');

  try {
    const response = await fetch(N8N_BATCH_OUTREACH_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    console.log('N8N response status:', response.status);

    const responseText = await response.text();
    console.log('N8N response body:', responseText);

    if (!response.ok) {
      throw new Error(`N8N workflow failed with status ${response.status}: ${responseText}`);
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Batch outreach workflow triggered successfully',
      n8nResponse: responseText 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error triggering n8n batch outreach:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ 
      success: false, 
      error: errorMessage 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
