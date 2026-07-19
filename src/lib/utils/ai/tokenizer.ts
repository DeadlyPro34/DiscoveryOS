/**
 * Token counting utilities for DiscoveryOS.
 * Estimates token counts using character-based approximation.
 */

/**
 * Estimates token count for given text.
 * Uses character count approximation (1 token ≈ 4 characters).
 * @param text - Text to estimate tokens for
 * @returns Estimated token count
 */
export function estimateTokenCount(text: string): number {
  // Average token length is approximately 4 characters
  // This is a conservative estimate used for OpenAI models
  return Math.ceil(text.length / 4);
}

/**
 * Estimates cost for token processing.
 * @param tokenCount - Number of tokens
 * @param costPerToken - Cost per token (default OpenAI pricing)
 * @returns Estimated cost in dollars
 */
export function estimateTokenCost(
  tokenCount: number,
  costPerToken: number = 0.0001
): number {
  return tokenCount * costPerToken;
}

/**
 * Gets word count for text.
 * @param text - Text to count words in
 * @returns Word count
 */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).length;
}

/**
 * Gets character count (excluding whitespace).
 * @param text - Text to count
 * @returns Character count
 */
export function countCharacters(text: string): number {
  return text.replace(/\s/g, '').length;
}

/**
 * Estimates reading time in minutes.
 * Assumes average reading speed of 200-250 words per minute.
 * @param text - Text to estimate reading time for
 * @param wordsPerMinute - Average reading speed (default 225)
 * @returns Reading time in minutes
 */
export function estimateReadingTime(
  text: string,
  wordsPerMinute: number = 225
): number {
  const wordCount = countWords(text);
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Tokenizes text into approximate tokens.
 * Returns array of token-sized chunks.
 * @param text - Text to tokenize
 * @param tokenSize - Target size per token in characters (default 4)
 * @returns Array of tokens
 */
export function tokenize(text: string, tokenSize: number = 4): string[] {
  const tokens: string[] = [];
  for (let i = 0; i < text.length; i += tokenSize) {
    tokens.push(text.substring(i, i + tokenSize));
  }
  return tokens;
}
