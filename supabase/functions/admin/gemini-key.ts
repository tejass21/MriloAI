import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Store API key in memory (in production, use environment variables or database)
let GEMINI_API_KEY = "AIzaSyDVQERtyIVwOSOEYgI_GFMnSSeUKyvlyCM";

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Only allow GET and POST methods
    if (req.method === 'GET') {
      // Return current API key status (without exposing the actual key)
      return new Response(JSON.stringify({
        hasKey: !!GEMINI_API_KEY,
        keyConfigured: GEMINI_API_KEY !== "",
        message: "Gemini API key status retrieved successfully"
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (req.method === 'POST') {
      const { action, apiKey } = await req.json();

      if (action === 'set') {
        if (!apiKey || typeof apiKey !== 'string') {
          return new Response(JSON.stringify({
            error: "Invalid API key provided"
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        // Validate the API key by making a test request
        try {
          const testResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': apiKey,
            },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: "Hello" }]
                }
              ],
              generation_config: {
                temperature: 0.6,
                maxOutputTokens: 10,
              }
            }),
          });

          if (testResponse.ok) {
            GEMINI_API_KEY = apiKey;
            return new Response(JSON.stringify({
              success: true,
              message: "Gemini API key validated and updated successfully"
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          } else {
            throw new Error('Invalid API key');
          }
        } catch (error) {
          return new Response(JSON.stringify({
            error: "Invalid Gemini API key. Please check and try again."
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }

      if (action === 'remove') {
        GEMINI_API_KEY = "";
        return new Response(JSON.stringify({
          success: true,
          message: "Gemini API key removed successfully"
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      if (action === 'test') {
        if (!GEMINI_API_KEY) {
          return new Response(JSON.stringify({
            error: "No API key configured"
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }

        try {
          const testResponse = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-goog-api-key': GEMINI_API_KEY,
            },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: "Test message" }]
                }
              ],
              generation_config: {
                temperature: 0.6,
                maxOutputTokens: 50,
              }
            }),
          });

          if (testResponse.ok) {
            const data = await testResponse.json();
            return new Response(JSON.stringify({
              success: true,
              message: "API key test successful",
              response: data.candidates?.[0]?.content?.parts?.[0]?.text || "Test response received"
            }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
          } else {
            throw new Error('API test failed');
          }
        } catch (error) {
          return new Response(JSON.stringify({
            error: "API key test failed. Please check your configuration."
          }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          });
        }
      }

      return new Response(JSON.stringify({
        error: "Invalid action. Use 'set', 'remove', or 'test'"
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({
      error: "Method not allowed"
    }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Admin API error:', error);
    return new Response(JSON.stringify({
      error: "Internal server error"
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
