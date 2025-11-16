// Google Gemini API Integration for Boss Battle

const GEMINI_API_KEY = 'NOT_A_REAL_API_KEY'; // Replace with your actual Gemini API key
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;

interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[];
      role: string;
    };
    finishReason: string;
    index: number;
    safetyRatings: any[];
  }[];
}

export async function sendGeminiMessage(
  conversationHistory: { role: string; content: string }[],
  systemPrompt: string
): Promise<string> {
  try {
    // Convert conversation history to Gemini format
    const contents: GeminiMessage[] = conversationHistory.map((msg) => ({
      role: msg.role === 'boss' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // Add system prompt as the first user message if conversation is empty
    if (contents.length === 0) {
      contents.push({
        role: 'user',
        parts: [{ text: systemPrompt }],
      });
    } else {
      // Prepend system instructions to the first message
      contents[0].parts[0].text = `${systemPrompt}\n\n${contents[0].parts[0].text}`;
    }

    const requestBody = {
      contents: contents,
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 500,
      },
      safetySettings: [
        {
          category: 'HARM_CATEGORY_HARASSMENT',
          threshold: 'BLOCK_NONE',
        },
        {
          category: 'HARM_CATEGORY_HATE_SPEECH',
          threshold: 'BLOCK_NONE',
        },
        {
          category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
          threshold: 'BLOCK_NONE',
        },
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_NONE',
        },
      ],
    };

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      throw new Error(`Gemini API request failed: ${response.status}`);
    }

    const data: GeminiResponse = await response.json();

    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response from Gemini API');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    return generatedText;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
}

export function isGeminiAvailable(): boolean {
  return !!GEMINI_API_KEY && GEMINI_API_KEY.length > 0;
}
