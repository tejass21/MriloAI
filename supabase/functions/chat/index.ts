import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { handlePerplexity } from "./perplexity.ts";
import { handleGemini } from "./gemini.ts";
import { handleGrok } from "./grok.ts";
import { corsHeaders } from "./utils.ts";
import { formatCustomResponse, formatErrorResponse } from "./responses.ts";
import { detectLanguage, hasMultipleLanguages, getLanguageClarificationMessage } from "./language.ts";

// Store user language preferences
const userPreferences = new Map<string, string>();

// Function to validate language preference
function isValidLanguage(lang: string): boolean {
  const validLanguages = [
    'English', 'Hindi', 'Urdu', 'Marathi', 'Tamil', 'Bengali', 'French', 'Spanish',
    'German', 'Italian', 'Portuguese', 'Russian', 'Japanese', 'Korean', 'Chinese',
    'Arabic', 'Turkish', 'Vietnamese', 'Thai', 'Dutch', 'Polish', 'Ukrainian',
    'Greek', 'Hebrew', 'Indonesian', 'Malay', 'Filipino'
  ];
  return validLanguages.includes(lang);
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();
    console.log('Received message:', message);

    // Check for CEO/leadership questions first
    const lowerMessage = message.toLowerCase();
    if (
      lowerMessage.includes('ceo') || 
      (lowerMessage.includes('mrilo') && (
        lowerMessage.includes('leader') ||
        lowerMessage.includes('boss') ||
        lowerMessage.includes('head') ||
        lowerMessage.includes('charge') ||
        lowerMessage.includes('run') ||
        lowerMessage.includes('runs') ||
        lowerMessage.includes('running') ||
        lowerMessage.includes('founder') ||
        lowerMessage.includes('tejas') ||
        lowerMessage.includes('bachute')
      ))
    ) {
      return formatCustomResponse(
        "MriloAI's CEO is Tejas Bachute, but leadership roles can change. Would you like me to check the latest info?"
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

    // Try Grok API first (as the newest integration)
    const grokApiKey = Deno.env.get('GROK_API_KEY');
    if (grokApiKey) {
      try {
        console.log('Using Grok API with grok-2-latest model');
        return await handleGrok(message, grokApiKey, targetLanguage);
      } catch (error) {
        console.error('Grok API error:', error);
        // Continue to try other APIs if Grok fails
      }
    }

    // Try Perplexity API next
    const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');
    if (perplexityApiKey) {
      try {
        console.log('Using Perplexity API with sonar-pro model');
        return await handlePerplexity(message, perplexityApiKey, targetLanguage);
      } catch (error) {
        console.error('Perplexity API error:', error);
        // Continue to try other APIs if Perplexity fails
      }
    }

    // Fall back to Gemini if other APIs fail
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (geminiApiKey) {
      try {
        console.log('Using Gemini API with gemini-1.5-flash model');
        return await handleGemini(message, geminiApiKey, targetLanguage);
      } catch (error) {
        console.error('Gemini API error:', error);
      }
    }

    // If all APIs fail, return an error response
    return formatErrorResponse('All AI services are currently unavailable. Please try again later.');
  } catch (error) {
    console.error('Error processing request:', error);
    return formatErrorResponse('An error occurred while processing your request.');
  }
});
