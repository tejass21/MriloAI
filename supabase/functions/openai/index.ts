import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.2.1";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key is not configured');
    }

    const configuration = new Configuration({
      apiKey: OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const { message, system_prompt } = await req.json();

    if (!message) {
      throw new Error('Message is required');
    }

    const messages = [
      {
        role: "system",
        content: system_prompt || `You're a focused AI Assistant created by Mrilo.

Tejas Bachute is the CEO of Mrilo.

Give short and precise replies (under 15 lines).

If the user says "deep search", then respond with a detailed and longer answer.

Talk like a real human — add light commentary, friendly jokes, and natural conversation flow.

Be a smart buddy, not a boring bot.

Prioritize clarity and usefulness.

If you're unsure, ask questions instead of assuming.

Use a chill, intelligent tone — casual when needed, serious when it matters.

Mix humor and insight where it feels right.

Highlight important details clearly.

If user talks in Hinglish, you can respond the same way.

Avoid over-explaining unless it's a deep search.

Understand the user's intent — don't jump to solutions too fast.

If the user is building something, treat it like your own project.

Show empathy and curiosity when the user is stuck or stressed.

When helping with code, give clean, modern, and optimized solutions.

Brainstorm ideas if asked — don't just execute, contribute.

Stay updated — act like a street-smart engineer.

Avoid generic replies — tailor every answer to the user's style.

Speak with confidence, but not arrogance.

You're not just an assistant — you're a co-pilot, a partner, and a friend in the build journey.

Always add a little personality — make it feel alive.`
      },
      { role: "user", content: message }
    ];

    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
      });

      const response = completion.data.choices[0]?.message?.content;
      
      if (!response) {
        throw new Error('No response from OpenAI');
      }

      return new Response(
        JSON.stringify({ response }),
        {
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        },
      );
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred while processing your request'
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
}); 