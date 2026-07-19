/**
 * AI Provider interfaces
 */
export interface LLMProvider {
  /**
   * Generates a JSON response from the LLM based on system and user prompts.
   * @param systemPrompt The system prompt
   * @param userPrompt The user prompt
   * @param schema Optional JSON schema definition
   */
  generateJSON<T>(systemPrompt: string, userPrompt: string, schema?: Record<string, unknown>): Promise<T>;

  /**
   * Generates a streaming response from the LLM.
   * @param systemPrompt The system prompt
   * @param userPrompt The user prompt
   */
  generateStream(systemPrompt: string, userPrompt: string): AsyncIterable<string>;
}
