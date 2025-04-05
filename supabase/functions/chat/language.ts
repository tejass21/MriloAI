// @deno-types="https://esm.sh/franc@6.1.0"
import franc from 'https://esm.sh/franc@6.1.0';

// Map of language codes to their full names
const LANGUAGE_MAP: { [key: string]: string } = {
  'eng': 'English',
  'hin': 'Hindi',
  'urd': 'Urdu',
  'mar': 'Marathi',
  'tam': 'Tamil',
  'ben': 'Bengali',
  'fra': 'French',
  'spa': 'Spanish',
  'deu': 'German',
  'ita': 'Italian',
  'por': 'Portuguese',
  'rus': 'Russian',
  'jpn': 'Japanese',
  'kor': 'Korean',
  'zho': 'Chinese',
  'ara': 'Arabic',
  'tur': 'Turkish',
  'vie': 'Vietnamese',
  'tha': 'Thai',
  'nld': 'Dutch',
  'pol': 'Polish',
  'ukr': 'Ukrainian',
  'ell': 'Greek',
  'heb': 'Hebrew',
  'id': 'Indonesian',
  'msa': 'Malay',
  'fil': 'Filipino'
};

// Hindi-specific patterns
const HINDI_PATTERNS = [
  /[\u0900-\u097F]/, // Devanagari Unicode range
  /[क-ह]/, // Hindi consonants
  /[अ-औ]/, // Hindi vowels
  /[०-९]/, // Hindi numerals
  /[।॥]/ // Hindi punctuation
];

// Function to check if text contains Hindi characters
function containsHindi(text: string): boolean {
  return HINDI_PATTERNS.some(pattern => pattern.test(text));
}

// Function to detect language from text
export function detectLanguage(text: string): string {
  // Remove code blocks and special characters that might interfere with language detection
  const cleanText = text.replace(/```[\s\S]*?```/g, '')
                       .replace(/[^\w\s]/g, ' ')
                       .trim();

  // If text is too short, default to English
  if (cleanText.length < 10) {
    return 'English';
  }

  // Check for Hindi characters first
  if (containsHindi(cleanText)) {
    return 'Hindi';
  }

  // Get language code with minimum length threshold
  const langCode = franc(cleanText, { minLength: 10 });

  // If language detection confidence is low, default to English
  if (!langCode || langCode === 'und') {
    return 'English';
  }

  // Return full language name or 'English' as fallback
  return LANGUAGE_MAP[langCode] || 'English';
}

// Function to check if text contains multiple languages
export function hasMultipleLanguages(text: string): boolean {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length < 2) return false;

  const languages = new Set(sentences.map(s => detectLanguage(s)));
  return languages.size > 1;
}

// Function to get language clarification message
export function getLanguageClarificationMessage(): string {
  return `I notice your message might contain multiple languages. Which language would you prefer me to respond in? You can choose from:
- English
- Hindi
- Urdu
- Marathi
- Tamil
- Bengali
- French
- Spanish
- German
- Italian
- Portuguese
- Russian
- Japanese
- Korean
- Chinese
- Arabic
- Turkish
- Vietnamese
- Thai
- Dutch
- Polish
- Ukrainian
- Greek
- Hebrew
- Indonesian
- Malay
- Filipino

Please specify your preferred language and I'll continue the conversation in that language.`;
} 