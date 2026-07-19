/**
 * Frequency Agent Implementation.
 * Analyzes occurrence patterns and frequencies.
 */

import { z } from 'zod';
import { BaseAgent } from '../base/baseAgent';
import { AgentInput, AgentCategory } from '@/types/ai/agent';

const FrequencyInputSchema = z.object({
  requestId: z.string(),
  content: z.string(),
  context: z.any().optional(),
  parameters: z.any().optional(),
  metadata: z.record(z.unknown()).optional(),
});

const FrequencyOutputSchema = z.object({
  frequency_analysis: z.record(z.number()),
  top_topics: z.array(z.object({ term: z.string(), count: z.number() })),
  statistics: z.record(z.unknown()),
});

/**
 * Frequency Agent: Analyzes frequency and patterns in content.
 */
export class FrequencyAgent extends BaseAgent {
  id = 'frequency-agent';
  name = 'Frequency Agent';
  description = 'Analyzes occurrence patterns and frequencies in content.';
  category: AgentCategory = 'analysis';
  icon = '📈';
  version = '1.0.0';

  inputSchema = FrequencyInputSchema;
  outputSchema = FrequencyOutputSchema;

  protected async executeAgent(
    input: AgentInput,
  ): Promise<{ result: unknown; structured?: Record<string, unknown> }> {
    const frequencies = this.analyzeFrequencies(input.content);
    const topTopics = this.getTopTopics(frequencies, 10);

    const statistics = {
      total_mentions: Object.values(frequencies).reduce((a, b) => a + b, 0),
      unique_terms: Object.keys(frequencies).length,
      average_frequency:
        Object.keys(frequencies).length > 0
          ? Object.values(frequencies).reduce((a, b) => a + b, 0) /
            Object.keys(frequencies).length
          : 0,
    };

    const structured = {
      frequency_analysis: frequencies,
      top_topics: topTopics,
      statistics,
    };

    return this.createOutput(structured, structured);
  }

  /**
   * Analyze frequencies of key terms.
   */
  private analyzeFrequencies(text: string): Record<string, number> {
    const frequencies: Record<string, number> = {};

    // Extract key terms/phrases
    const terms = this.extractKeyTerms(text);

    // Count frequencies
    terms.forEach((term) => {
      frequencies[term] = (frequencies[term] || 0) + 1;
    });

    return frequencies;
  }

  /**
   * Extract key terms and phrases from text.
   */
  private extractKeyTerms(text: string): string[] {
    const terms: string[] = [];

    // Extract single important words (nouns, verbs)
    const words = text.toLowerCase().match(/\b[\w']{3,}\b/g) || [];

    // Common stop words to exclude
    const stopWords = new Set([
      'the',
      'and',
      'or',
      'but',
      'is',
      'are',
      'was',
      'were',
      'be',
      'to',
      'of',
      'in',
      'for',
      'on',
      'it',
      'at',
      'by',
      'with',
      'from',
      'this',
      'that',
      'a',
      'an',
      'as',
      'has',
      'have',
      'if',
      'you',
      'i',
      'we',
      'they',
      'he',
      'she',
      'me',
      'him',
      'her',
    ]);

    words.forEach((word) => {
      if (!stopWords.has(word) && word.length > 2) {
        terms.push(word);
      }
    });

    // Extract 2-3 word phrases
    const phrases = this.extractPhrases(text);
    terms.push(...phrases);

    return terms;
  }

  /**
   * Extract multi-word phrases.
   */
  private extractPhrases(text: string): string[] {
    const phrases: string[] = [];

    // Extract capitalized phrases (proper nouns, product names)
    const capitalizedPattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/g;
    const matches = text.match(capitalizedPattern) || [];
    phrases.push(
      ...matches.filter((m) => m.split(/\s+/).length <= 3),
    );

    // Extract quoted phrases
    const quotedPattern = /"([^"]+)"/g;
    const quoted = text.match(quotedPattern) || [];
    phrases.push(...quoted.map((q) => q.replace(/"/g, '')));

    return phrases;
  }

  /**
   * Get top topics by frequency.
   */
  private getTopTopics(
    frequencies: Record<string, number>,
    limit: number,
  ): Array<{ term: string; count: number }> {
    return Object.entries(frequencies)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([term, count]) => ({ term, count }));
  }

  async computeConfidence(input: AgentInput): Promise<number> {
    let confidence = 0.75;
    if (input.content.length > 1000) confidence += 0.15;
    return Math.min(confidence, 1.0);
  }
}

export const frequencyAgent = new FrequencyAgent();
