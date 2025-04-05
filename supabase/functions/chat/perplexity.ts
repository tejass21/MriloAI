// Perplexity API integration
import { corsHeaders, getSystemPrompt, formatSources } from "./utils.ts";
import { formatCustomResponse, formatErrorResponse } from "./responses.ts";

export async function handlePerplexity(message: string, apiKey: string, targetLanguage: string) {
  const systemPrompt = getSystemPrompt();
  const languageInstruction = `CRITICAL LANGUAGE REQUIREMENT:
You MUST respond in ${targetLanguage} ONLY. This is a strict requirement.

Rules for ${targetLanguage} response:
1. EVERY SINGLE WORD must be in ${targetLanguage}
2. Use proper grammar, spelling, and sentence structure specific to ${targetLanguage}
3. Use natural, conversational tone appropriate for ${targetLanguage}
4. Include culturally appropriate expressions and references
5. Maintain the same level of detail and formatting as specified in the system prompt
6. DO NOT mix languages or provide translations
7. DO NOT apologize for language limitations
8. If you cannot provide a proper response in ${targetLanguage}, respond with:
   "I apologize, but I need to respond in English for technical reasons. Would you like me to continue in English?"

Remember: Your response must be ENTIRELY in ${targetLanguage}. No exceptions.`;

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'sonar-pro',
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
      temperature: 0.7, // Increased for more natural responses
      top_p: 0.9,
      max_tokens: 2000,
      return_sources: true,
      search_domain_filter: [],
      search_recency_filter: 'day',
      frequency_penalty: 0.5,
      presence_penalty: 0.1,
      stop: null,
      stream: false,
      response_format: { type: "text" },
      tools: null,
      tool_choice: null,
      user: null,
      functions: null,
      function_call: null,
      metadata: {
        language: targetLanguage,
        intent: "conversational",
        context: "general"
      }
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Perplexity API error: ${errorData.error || response.statusText}`);
  }

  const data = await response.json();
  console.log('Perplexity response:', data);

  // Extract the response text and sources from Perplexity's response format
  const aiResponse = data.choices?.[0]?.message?.content || 
                    "I'm sorry, I couldn't generate a response at this time.";

  // Extract and enhance sources from Perplexity response
  const sources = data.choices?.[0]?.message?.sources || [];
  const formattedSources = formatSources(sources);

  // Format the response with better structure
  const formattedResponse = formatResponse(aiResponse, targetLanguage);

  return formatCustomResponse(formattedResponse, formattedSources);
}

// Helper function to format the response
function formatResponse(response: string, language: string): string {
  // Add language-specific formatting
  const formattedResponse = response
    // Format code blocks with syntax highlighting
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
      const formattedCode = code.trim()
        .replace(/^(import|const|let|var|function|class|return|if|else|for|while|switch|case|break|continue|try|catch|finally|throw|new|this|super|extends|implements|interface|type|enum|namespace|module|export|default|public|private|protected|static|readonly|abstract|async|await|yield|from|as|of|in|instanceof|typeof|void|null|undefined|true|false|NaN|Infinity)/gm, '**$1**')
        .replace(/\/\/.*$/gm, '<span class="text-gray-500">$&</span>')
        .replace(/\/\*[\s\S]*?\*\//g, '<span class="text-gray-500">$&</span>');
      return `\`\`\`${lang || ''}\n${formattedCode}\n\`\`\``;
    })
    // Format code explanations
    .replace(/^(Let's break down how this code works|Code Explanation|How it works):/gm, match => 
      `💡 ${match}`
    )
    // Format code sections
    .replace(/^(Step|Part|Section)\s+(\d+):/gm, (_, type, num) => 
      `🔍 ${type} ${num}:`
    )
    // Format important code notes
    .replace(/^(Note|Important|Remember|Tip):/gm, match => 
      `⚠️ ${match}`
    )
    // Format code examples
    .replace(/^(Example|Sample|Demo):/gm, match => 
      `📝 ${match}`
    )
    // Format code output
    .replace(/^(Output|Result|Console):/gm, match => 
      `🖥️ ${match}`
    )
    // Format code errors
    .replace(/^(Error|Exception|Warning):/gm, match => 
      `❌ ${match}`
    )
    // Format code success
    .replace(/^(Success|Working|Correct):/gm, match => 
      `✅ ${match}`
    )
    // Format headings with emojis
    .replace(/^(#+)\s+(.*?)$/gm, (_, hashes, text) => {
      const headingLevel = hashes.length;
      const emoji = headingLevel === 1 ? '🚀' : headingLevel === 2 ? '🤔' : '✅';
      return `<h${headingLevel} class="font-bold text-${headingLevel + 1}">${emoji} ${text}</h${headingLevel}>`;
    })
    // Format lists with bullet points
    .replace(/^\s*[-*]\s+(.*?)$/gm, '• $1')
    // Format numbered lists
    .replace(/^\s*(\d+)\.\s+(.*?)$/gm, '$1. $2')
    // Format emphasis
    .replace(/\*\*(.*?)\*\*/g, '**$1**')
    .replace(/\*(.*?)\*/g, '*$1*')
    // Format rhetorical questions
    .replace(/\?/g, (match, offset, string) => {
      const prevChar = string[offset - 1];
      if (prevChar && !prevChar.match(/[.!]/)) {
        return '🤔?';
      }
      return match;
    })
    // Format emojis with proper spacing
    .replace(/([^\s])([\u{1F300}-\u{1F9FF}])/gu, '$1 $2')
    .replace(/([\u{1F300}-\u{1F9FF}])([^\s])/gu, '$1 $2')
    // Add proper spacing between sections
    .replace(/\n{3,}/g, '\n\n')
    // Add language-specific formatting
    .replace(/\n/g, language === 'Hindi' ? '\n' : '\n')
    // Format follow-up questions
    .replace(/(क्या|Would you like to|Do you want to).*?\?/g, match => 
      `\n\n💡 ${match}`
    )
    // Format engaging hooks
    .replace(/^(Imagine|Think of|What if|Consider|Picture this)/gm, match => 
      `🚀 ${match}`
    )
    // Format key points
    .replace(/^(Key point|Important|Note|Remember):/gm, match => 
      `✅ ${match}`
    )
    // Format tables
    .replace(/\|([^|]+)\|/g, (_, content) => {
      const cells = content.split('|').map(cell => cell.trim());
      return `<table class="min-w-full divide-y divide-gray-200">
        <tr>${cells.map(cell => `<td class="px-4 py-2">${cell}</td>`).join('')}</tr>
      </table>`;
    });

  return formattedResponse;
}

💡 Would you like me to explain any part in more detail?
