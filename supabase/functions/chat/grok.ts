// Grok API integration
import { corsHeaders, getSystemPrompt } from "./utils.ts";
import { formatCustomResponse, formatErrorResponse } from "./responses.ts";

export async function handleGrok(message: string, apiKey: string, targetLanguage: string) {
  const systemPrompt = getSystemPrompt();
  const languageInstruction = `Please respond in ${targetLanguage}. Maintain the same level of detail and formatting as specified in the system prompt.`;

  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'grok-2-latest',
      messages: [
        {
          role: 'system',
          content: `${systemPrompt}\n\n${languageInstruction}`
        },
        {
          role: 'user',
          content: message
        }
      ],
      stream: false,
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Grok API error: ${errorData.error || response.statusText}`);
  }

  const data = await response.json();
  console.log('Grok response:', data);

  // Extract the response text from Grok's response format
  const aiResponse = data.choices?.[0]?.message?.content || 
                   "I'm sorry, I couldn't generate a response at this time.";

  return formatCustomResponse(aiResponse, []);
}
