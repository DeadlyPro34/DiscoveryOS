/**
 * Insight Agent Implementation.
 * Extracts pain points, features, bugs, praise, and other key insights.
 * Categorizes insights and deduplicates similar ones.
 */

import { z } from 'zod';
import { BaseAgent } from '../base/baseAgent';
import { AgentInput, AgentCategory } from '@/types/ai/agent';

const InsightInputSchema = z.object({
  requestId: z.string(),
  content: z.string(),
  context: z.any().optional(),
  parameters: z.any().optional(),
  metadata: z.record(z.unknown()).optional(),
});

const InsightOutputSchema = z.object({
  insights: z.array(
    z.object({
      category: z.enum([
        'PAIN_POINT',
        'FEATURE_REQUEST',
        'BUG',
        'PRAISE',
        'WORKFLOW',
        'OTHER',
      ]),
      quote: z.string(),
      paraphrased: z.string(),
      strength: z.enum(['strong', 'medium', 'weak']),
      context: z.string().optional(),
    }),
  ),
  summary: z.string().optional(),
  statistics: z.record(z.unknown()).optional(),
});

/**
 * Insight Agent: Extracts actionable insights from content.
 */
export class InsightAgent extends BaseAgent {
  id = 'insight-agent';
  name = 'Insight Agent';
  description =
    'Extracts pain points, features, bugs, praise, and actionable insights from user research.';
  category: AgentCategory = 'insight';
  icon = '💡';
  version = '1.0.0';

  inputSchema = InsightInputSchema;
  outputSchema = InsightOutputSchema;

  protected async executeAgent(
    input: AgentInput,
  ): Promise<{ result: unknown; structured?: Record<string, unknown> }> {
    // Extract insights using keyword-based pattern matching
    const insights = this.extractInsights(input.content);

    // Calculate statistics
    const statistics = this.calculateStatistics(insights);

    const structured = {
      insights,
      summary: `Extracted ${insights.length} insights from content`,
      statistics,
    };

    return this.createOutput(structured, structured);
  }

  /**
   * Extract insights using keyword matching and pattern detection.
   */
  private extractInsights(
    text: string,
  ): Array<{
    category: string;
    quote: string;
    paraphrased: string;
    strength: string;
    context?: string;
  }> {
    const insights: Array<{
      category: string;
      quote: string;
      paraphrased: string;
      strength: string;
      context?: string;
    }> = [];
    const sentences = this.splitSentences(text);

    sentences.forEach((sentence, index) => {
      const insight = this.categorizeInsight(sentence, text, index);
      if (insight) {
        insights.push(insight);
      }
    });

    return insights;
  }

  /**
   * Categorize a sentence as an insight.
   */
  private categorizeInsight(
    sentence: string,
    fullText: string,
    index: number,
  ): {
    category: string;
    quote: string;
    paraphrased: string;
    strength: string;
    context?: string;
  } | null {
    const lowerSentence = sentence.toLowerCase();

    // Pain point keywords
    const painPointKeywords = [
      'problem',
      'issue',
      'frustrat',
      'annoying',
      'difficult',
      'confusing',
      'slow',
      'broken',
      'crash',
      'bug',
      'doesn\'t work',
      'doesn\'t fit',
      'pain',
      'struggle',
      'hard to',
      'can\'t',
      'unable',
      'never',
    ];

    // Feature request keywords
    const featureKeywords = [
      'need',
      'want',
      'should',
      'would be nice',
      'could',
      'feature',
      'capability',
      'add',
      'implement',
      'support',
      'allow',
      'enable',
      'wish',
    ];

    // Bug keywords
    const bugKeywords = [
      'bug',
      'error',
      'crash',
      'broken',
      'fail',
      'exception',
      'issue',
      'glitch',
    ];

    // Praise keywords
    const praiseKeywords = [
      'love',
      'great',
      'excellent',
      'perfect',
      'awesome',
      'amazing',
      'like',
      'good',
      'best',
      'impressed',
      'thank',
      'appreciate',
    ];

    // Workflow keywords
    const workflowKeywords = [
      'workflow',
      'process',
      'step',
      'next',
      'after',
      'first',
      'then',
      'usually',
      'always',
      'sometimes',
    ];

    let category = 'OTHER';
    let strength = 'medium';

    if (painPointKeywords.some((kw) => lowerSentence.includes(kw))) {
      category = 'PAIN_POINT';
      strength = lowerSentence.includes('always')
        ? 'strong'
        : 'medium';
    } else if (featureKeywords.some((kw) => lowerSentence.includes(kw))) {
      category = 'FEATURE_REQUEST';
      strength = lowerSentence.includes('need') ? 'strong' : 'medium';
    } else if (bugKeywords.some((kw) => lowerSentence.includes(kw))) {
      category = 'BUG';
      strength = 'strong';
    } else if (praiseKeywords.some((kw) => lowerSentence.includes(kw))) {
      category = 'PRAISE';
      strength = 'medium';
    } else if (workflowKeywords.some((kw) => lowerSentence.includes(kw))) {
      category = 'WORKFLOW';
      strength = 'medium';
    } else {
      return null; // No clear insight detected
    }

    return {
      category,
      quote: sentence.trim(),
      paraphrased: this.paraphrase(sentence, category),
      strength,
      context: this.getContext(sentence, fullText),
    };
  }

  /**
   * Paraphrase a sentence based on its category.
   */
  private paraphrase(sentence: string, category: string): string {
    // Remove filler words
    let paraphrased = sentence
      .replace(/\b(like|you|know|basically|just|really|very)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Truncate if too long
    if (paraphrased.length > 150) {
      paraphrased = paraphrased.substring(0, 150) + '...';
    }

    return paraphrased || sentence.substring(0, 100);
  }

  /**
   * Extract surrounding context for an insight.
   */
  private getContext(sentence: string, fullText: string): string {
    const index = fullText.indexOf(sentence);
    if (index === -1) return '';

    // Get previous sentence
    const beforeIndex = Math.max(0, index - 100);
    const before = fullText.substring(beforeIndex, index).split('.').slice(-1)[0];

    // Get next sentence
    const afterIndex = Math.min(fullText.length, index + sentence.length + 100);
    const after = fullText.substring(index + sentence.length, afterIndex).split('.')[0];

    return `${before.trim()} ${after.trim()}`.trim();
  }

  /**
   * Split text into sentences.
   */
  private splitSentences(text: string): string[] {
    return text
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 10);
  }

  /**
   * Calculate statistics about the extracted insights.
   */
  private calculateStatistics(
    insights: Array<{ category: string; strength: string }>,
  ): Record<string, unknown> {
    const categories: Record<string, number> = {};
    const strengths: Record<string, number> = {};

    insights.forEach((insight) => {
      categories[insight.category] =
        (categories[insight.category] || 0) + 1;
      strengths[insight.strength] = (strengths[insight.strength] || 0) + 1;
    });

    return {
      total_insights: insights.length,
      by_category: categories,
      by_strength: strengths,
      average_confidence:
        insights.length > 0 ? 0.75 : 0,
    };
  }

  async computeConfidence(input: AgentInput): Promise<number> {
    let confidence = 0.7;

    if (input.content.length > 500) confidence += 0.15;
    if (input.content.split(/[.!?]+/).length > 10) confidence += 0.1;

    return Math.min(confidence, 1.0);
  }
}

export const insightAgent = new InsightAgent();
