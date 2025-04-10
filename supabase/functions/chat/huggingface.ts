import { corsHeaders } from "./utils.ts";

const API_URL = "https://api-inference.huggingface.co/models/deepseek-ai/deepseek-llm-r-7b-chat";
const API_KEY = Deno.env.get("HUGGINGFACE_API_KEY") || "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";

export async function handleHuggingFace(message: string): Promise<Response> {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: message,
      }),
    });

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    return new Response(JSON.stringify({ response: data[0].generated_text }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error calling Hugging Face API:", error);
    return new Response(
      JSON.stringify({ error: "Failed to get response from Hugging Face API" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
} 