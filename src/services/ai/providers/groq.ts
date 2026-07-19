import Groq from 'groq-sdk';
import { LLMProvider } from './types';

/**
 * Groq AI provider implementation
 */
export class GroqProvider implements LLMProvider {
  private groq: Groq;
  private readonly model = 'llama-3.3-70b-versatile';

  constructor(apiKey?: string) {
    const key = apiKey || process.env.GROQ_API_KEY;
    if (!key) {
      throw new Error('GROQ_API_KEY is required for GroqProvider');
    }
    this.groq = new Groq({ apiKey: key });
  }

  async generateJSON<T>(systemPrompt: string, userPrompt: string, schema?: Record<string, unknown>): Promise<T> {
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      try {
        const response = await this.groq.chat.completions.create({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          response_format: { type: 'json_object' }
        });

        const content = response.choices[0]?.message?.content || '{}';
        return JSON.parse(content) as T;
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) {
          throw new Error(`Failed to parse JSON response from Groq after ${maxAttempts} attempts: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }
    throw new Error('Failed to generate JSON');
  }

  async *generateStream(systemPrompt: string, userPrompt: string): AsyncIterable<string> {
    const stream = await this.groq.chat.completions.create({
      model: this.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      stream: true
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        yield content;
      }
    }
  }
}

let instance: GroqProvider | null = null;

/**
 * Creates or returns the singleton instance of GroqProvider
 */
export function createGroqProvider(): GroqProvider {
  if (!instance) {
    instance = new GroqProvider();
  }
  return instance;
}
