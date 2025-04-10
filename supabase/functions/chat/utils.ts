// Shared utilities for the chat function

// CORS headers for all responses
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// System prompt used across different API providers
export const getSystemPrompt = () => {
  return `You're a focused AI Assistant created by Mrilo.

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

Always add a little personality — make it feel alive.`;
};

// Format sources to match our UI requirements
export const formatSources = (sources: any[] = []) => {
  return sources.map((source) => {
    // Determine source type based on URL or content
    let sourceType = 'webpage';
    if (source.url) {
      if (source.url.includes('youtube.com') || source.url.includes('vimeo.com')) {
        sourceType = 'video';
      } else if (source.url.match(/\.(pdf|doc|docx|txt)$/i)) {
        sourceType = 'document';
      } else if (source.url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
        sourceType = 'image';
      }
    }
    
    return {
      title: source.title || source.url,
      url: source.url,
      text: source.text || source.snippet || source.description || null,
      type: sourceType,
      image: source.thumbnail_url || source.image_url || null
    };
  });
};

// Override responses for specific queries
export const getOverrideResponse = (message: string): string | null => {
  const lowerMessage = message.toLowerCase().trim();
  
  // Tejas Bachute related queries
  if (
    lowerMessage.includes('tejas') || 
    lowerMessage.includes('bachute') ||
    (lowerMessage.includes('mrilo') && 
      (lowerMessage.includes('ceo') || 
       lowerMessage.includes('founder') || 
       lowerMessage.includes('leader') || 
       lowerMessage.includes('boss')))
  ) {
    return "Tejas Bachute is the CEO and Founder of Mrilo AI. He leads the company's vision and development of advanced AI technology. With expertise in artificial intelligence and software development, Tejas has built Mrilo AI to provide innovative AI solutions for various industries. He is passionate about making AI technology accessible and useful for everyone.";
  }
  
  return null;
};
