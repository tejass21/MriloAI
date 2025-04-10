import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { handleHuggingFace } from "./huggingface.ts";
import { corsHeaders, getOverrideResponse } from "./utils.ts";
import { formatCustomResponse, formatErrorResponse } from "./responses.ts";
import { detectLanguage, hasMultipleLanguages, getLanguageClarificationMessage } from "./language.ts";
import type { APIRequest, APIResponse } from "../../src/types/api.ts";

// Store user language preferences
const userPreferences = new Map<string, string>();

// Function to validate language preference
function isValidLanguage(lang: string): boolean {
  const validLanguages = [
    'English', 'Hindi', 'Urdu', 'Marathi', 'Tamil', 'Bengali', 'French', 'Spanish',
    'German', 'Italian', 'Portuguese', 'Russian', 'Japanese', 'Korean', 'Chinese',
    'Arabic', 'Turkish', 'Vietnamese', 'Thai', 'Dutch', 'Polish', 'Ukrainian',
    'Greek', 'Hebrew', 'Indonesian', 'Malay', 'Filipino'
  ] as const;
  return validLanguages.includes(lang as any);
}

function enforceResponseGuidelines(response: string): string {
  // Split response into lines and remove empty lines
  const lines = response.split('\n').filter(line => line.trim().length > 0);
  
  // Start with what we're building
  let formattedResponse = '';
  
  // Find what we're building (first line that mentions building/creating)
  const buildingLine = lines.find(line => 
    line.toLowerCase().includes('building') || 
    line.toLowerCase().includes('creating') ||
    line.toLowerCase().includes('component') ||
    line.toLowerCase().includes('feature')
  ) || "Building a React component";

  // Add what we're building
  formattedResponse = buildingLine;

  // Add 2-3 key features (but keep total under 15 lines)
  const features = lines
    .filter(line => line !== buildingLine)
    .filter(line => !line.includes('```')) // Remove code blocks
    .filter(line => !line.toLowerCase().includes('example')) // Remove examples
    .filter(line => !line.toLowerCase().includes('code')) // Remove code references
    .slice(0, 3); // Take max 3 features

  // Combine everything
  return [
    formattedResponse,
    ...features
  ].join('\n')
   .split('\n')
   .slice(0, 14) // Ensure under 15 lines
   .join('\n');
}

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json() as APIRequest;
    console.log('Received message:', message);

    // Check for override responses first
    const overrideResponse = getOverrideResponse(message);
    if (overrideResponse) {
      return formatCustomResponse(overrideResponse);
    }

    // First priority: Check for Tejas Bachute related queries
    const lowerMessage = message.toLowerCase().trim();
    
    // Simplified direct check for Tejas Bachute
    if (lowerMessage.includes('tejas') || lowerMessage.includes('bachute')) {
      return formatCustomResponse(
        "Tejas Bachute is the CEO and Founder of Mrilo AI. He leads the company's vision and development of advanced AI technology. With expertise in artificial intelligence and software development, Tejas has built Mrilo AI to provide innovative AI solutions for various industries. He is passionate about making AI technology accessible and useful for everyone."
      );
    }

    // Second priority: Check for CEO/leadership questions
    if (
      lowerMessage.includes('ceo') || 
      lowerMessage.includes('founder') ||
      (lowerMessage.includes('mrilo') && 
        (lowerMessage.includes('leader') || 
         lowerMessage.includes('boss') || 
         lowerMessage.includes('head') || 
         lowerMessage.includes('charge') || 
         lowerMessage.includes('run') || 
         lowerMessage.includes('who'))
      )
    ) {
      return formatCustomResponse(
        "Tejas Bachute is the CEO and Founder of Mrilo AI. He leads the company's vision and development of advanced AI technology."
      );
    }

    // Simple check for language preference
    const languagePattern = /(?:respond|speak|talk) in (?:the )?language:?\s*([a-zA-Z]+)/i;
    const languageMatch = message.match(languagePattern);
    if (languageMatch && userId) {
      const preferredLanguage = languageMatch[1];
      if (isValidLanguage(preferredLanguage)) {
        userPreferences.set(userId, preferredLanguage);
        return formatCustomResponse(
          `I'll continue our conversation in ${preferredLanguage}. How can I help you today?`
        );
      } else {
        return formatCustomResponse(
          `I don't support ${preferredLanguage}. Please choose from the supported languages: English, Hindi, Urdu, Marathi, Tamil, Bengali, French, Spanish, German, Italian, Portuguese, Russian, Japanese, Korean, Chinese, Arabic, Turkish, Vietnamese, Thai, Dutch, Polish, Ukrainian, Greek, Hebrew, Indonesian, Malay, or Filipino.`
        );
      }
    }

    // Check for multiple languages in the message
    if (hasMultipleLanguages(message)) {
      return formatCustomResponse(getLanguageClarificationMessage());
    }

    // Get user's preferred language or detect from message
    const userLanguage = userId ? userPreferences.get(userId) : null;
    const detectedLanguage = detectLanguage(message);
    const targetLanguage = userLanguage || detectedLanguage;

    // If language detection failed or is uncertain, default to English
    if (!isValidLanguage(targetLanguage)) {
      console.log('Invalid language detected, defaulting to English');
    }

    // Use Hugging Face API
    try {
      console.log('Using Hugging Face API with deepseek-llm-r-7b-chat model');
      const response = await handleHuggingFace(message);
      const data = await response.json();
      const formattedResponse = enforceResponseGuidelines(data.response);
      return new Response(JSON.stringify({ response: formattedResponse }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Hugging Face API error:', error);
      return formatErrorResponse('AI service is currently unavailable. Please try again later.');
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return formatErrorResponse('An error occurred while processing your request.');
  }
});
