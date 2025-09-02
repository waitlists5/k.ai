const OPENROUTER_API_KEY = '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';
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// Using Llama 3.1 70B Instruct - one of the best free models available
const DEFAULT_MODEL = 'meta-llama/llama-3.1-70b-instruct:free';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class OpenRouterAPI {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string = OPENROUTER_API_KEY) {
    this.apiKey = apiKey;
    this.baseUrl = OPENROUTER_BASE_URL;
  }

  async *streamChat(
    messages: ChatMessage[],
    options: {
      model?: string;
      temperature?: number;
      maxTokens?: number;
    } = {}
  ): AsyncGenerator<string> {
    const {
      model = DEFAULT_MODEL,
      temperature = 0.7,
      maxTokens = 4000
    } = options;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AI Chat Website'
        },
        body: JSON.stringify({
          model,
          messages,
          temperature,
          max_tokens: maxTokens,
          stream: true
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response stream available');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                yield content;
              }
            } catch (e) {
              // Skip invalid JSON lines
              continue;
            }
          }
        }
      }
    } catch (error) {
      console.error('Stream chat error:', error);
      throw error;
    }
  }

  async enhancePrompt(prompt: string): Promise<string> {
    const enhancementMessages: ChatMessage[] = [
      {
        role: 'system',
        content: `You are a prompt enhancement specialist. Your job is to take user prompts and make them more effective, clear, and detailed while preserving the original intent. 

Guidelines:
- Keep the core request intact
- Add helpful context and specificity
- Make the prompt more actionable
- Improve clarity and structure
- Don't change the fundamental ask
- Return only the enhanced prompt, no explanations

Original prompt: "${prompt}"`
      },
      {
        role: 'user',
        content: `Please enhance this prompt to be more effective: "${prompt}"`
      }
    ];

    try {
      let enhancedPrompt = '';
      for await (const chunk of this.streamChat(enhancementMessages, {
        temperature: 0.3,
        maxTokens: 500
      })) {
        enhancedPrompt += chunk;
      }
      return enhancedPrompt.trim();
    } catch (error) {
      console.error('Prompt enhancement error:', error);
      return prompt; // Return original if enhancement fails
    }
  }
}

export const openRouterAPI = new OpenRouterAPI();