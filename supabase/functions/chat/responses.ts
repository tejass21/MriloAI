
// Response formatting utilities
import { corsHeaders } from "./utils.ts";

// Format a custom response with no sources
export const formatCustomResponse = (text: string, sources: any[] = []) => {
  return new Response(
    JSON.stringify({ 
      response: text,
      sources: sources
    }), 
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
};

// Format error response
export const formatErrorResponse = (errorMessage: string, status = 500) => {
  return new Response(
    JSON.stringify({ 
      error: errorMessage
    }), 
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    }
  );
};
