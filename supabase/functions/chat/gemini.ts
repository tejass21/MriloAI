// Gemini API integration
import { corsHeaders, getSystemPrompt } from "./utils.ts";
import { formatCustomResponse, formatErrorResponse } from "./responses.ts";

export async function handleGemini(message: string, apiKey: string, targetLanguage: string) {
  const systemPrompt = getSystemPrompt();
  const languageInstruction = `Please respond in ${targetLanguage}. Maintain the same level of detail and formatting as specified in the system prompt.`;

  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: message
            }
          ]
        }
      ],
      generation_config: {
        temperature: 0.6,
        maxOutputTokens: 1200,
      },
      systemInstruction: {
        role: 'system',
        parts: [
          {
            text: `${systemPrompt}\n\n${languageInstruction}`
          }
        ]
      }
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Gemini API error: ${errorData.error || response.statusText}`);
  }

  const data = await response.json();
  console.log('Gemini response:', data);

  // Extract the response text from Gemini's response format
  const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                   "I'm sorry, I couldn't generate a response at this time.";

  return formatCustomResponse(aiResponse, []);
}
