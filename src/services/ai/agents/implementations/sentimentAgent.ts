/**
 * Sentiment Agent Implementation.
 * Classifies sentiment as Positive, Negative, Neutral, or Mixed.
 */

import { z } from 'zod';
import { BaseAgent } from '../base/baseAgent';
import { AgentInput, AgentCategory } from '@/types/ai/agent';

const SentimentInputSchema = z.object({
  requestId: z.string(),
  content: z.string(),
  context: z.any().optional(),
  parameters: z.any().optional(),
  metadata: z.record(z.unknown()).optional(),
});

const SentimentOutputSchema = z.object({
  overall_sentiment: z.enum(['POSITIVE', 'NEGATIVE', 'NEUTRAL', 'MIXED']),
  overall_score: z.number().min(-1).max(1),
  segments: z.array(
    z.object({
      text: z.string(),
      sentiment: z.enum(['POSITIVE', 'NEGATIVE', 'NEUTRAL']),
      score: z.number(),
      indicators: z.array(z.string()),
    }),
  ),
  distribution: z.record(z.number()),
});

/**
 * Sentiment Agent: Classifies sentiment of content.
 */
export class SentimentAgent extends BaseAgent {
  id = 'sentiment-agent';
  name = 'Sentiment Agent';
  description = 'Classifies sentiment as positive, negative, neutral, or mixed.';
  category: AgentCategory = 'analysis';
  icon = '😊';
  version = '1.0.0';

  inputSchema = SentimentInputSchema;
  outputSchema = SentimentOutputSchema;

  private positiveWords = [
    'love',
    'great',
    'excellent',
    'perfect',
    'amazing',
    'awesome',
    'good',
    'best',
    'impressed',
    'thank',
    'appreciate',
    'enjoy',
    'delighted',
    'happy',
    'satisfied',
    'easy',
    'simple',
    'elegant',
    'efficient',
    'fantastic',
  ];

  private negativeWords = [
    'hate',
    'terrible',
    'awful',
    'horrible',
    'bad',
    'worst',
    'annoying',
    'frustrating',
    'frustrat',
    'annoyed',
    'angry',
    'disappointed',
    'difficult',
    'confusing',
    'broken',
    'crash',
    'bug',
    'fail',
    'issue',
    'problem',
    'doesn\'t work',
    'can\'t',
    'unable',
    'waste',
    'useless',
    'mess',
  ];

  protected async executeAgent(
    input: AgentInput,
  ): Promise<{ result: unknown; structured?: Record<string, unknown> }> {
    const segments = this.analyzeSentiment(input.content);

    // Calculate overall sentiment
    const scores = segments.map((s) => this.sentimentToScore(s.sentiment));
    const overallScore =
      scores.length > 0 ? scores.reduce((a, b) => a + b) / scores.length : 0;

    const overallSentiment = this.classifyOverallSentiment(segments, overallScore);

    // Calculate distribution
    const distribution = this.calculateDistribution(segments);

    const structured = {
      overall_sentiment: overallSentiment,
      overall_score: overallScore,
      segments,
      distribution,
    };

    return this.createOutput(structured, structured);
  }

  /**
   * Analyze sentiment of content by segments.
   */
  private analyzeSentiment(
    text: string,
  ): Array<{
    text: string;
    sentiment: string;
    score: number;
    indicators: string[];
  }> {
    const sentences = this.splitSentences(text);

    return sentences.map((sentence) => {
      const { sentiment, score, indicators } =
        this.classifySentence(sentence);

      return {
        text: sentence,
        sentiment,
        score,
        indicators,
      };
    });
  }

  /**
   * Classify sentiment of a single sentence.
   */
  private classifySentence(
    sentence: string,
  ): { sentiment: string; score: number; indicators: string[] } {
    const lowerSentence = sentence.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;
    const indicators: string[] = [];

    // Count positive words
    this.positiveWords.forEach((word) => {
      if (lowerSentence.includes(word)) {
        positiveCount++;
        indicators.push(word);
      }
    });

    // Count negative words
    this.negativeWords.forEach((word) => {
      if (lowerSentence.includes(word)) {
        negativeCount++;
        indicators.push(word);
      }
    });

    // Check for negations (not good = negative)
    if (lowerSentence.includes('not ') || lowerSentence.includes('no ')) {
      const afterNot = lowerSentence.split(/not |no /)[1] || '';
      if (
        this.positiveWords.some((word) => afterNot.includes(word))
      ) {
        negativeCount += 0.5;
      }
    }

    // Determine sentiment
    let sentiment = 'NEUTRAL';
    let score = 0;

    if (positiveCount > negativeCount) {
      sentiment = 'POSITIVE';
      score = Math.min(1, 0.5 + positiveCount * 0.2);
    } else if (negativeCount > positiveCount) {
      sentiment = 'NEGATIVE';
      score = Math.max(-1, -0.5 - negativeCount * 0.2);
    } else if (positiveCount > 0 || negativeCount > 0) {
      sentiment = 'NEUTRAL';
      score = 0;
    }

    return { sentiment, score, indicators };
  }

  /**
   * Convert sentiment to numerical score.
   */
  private sentimentToScore(sentiment: string): number {
    switch (sentiment) {
      case 'POSITIVE':
        return 1;
      case 'NEGATIVE':
        return -1;
      case 'NEUTRAL':
      default:
        return 0;
    }
  }

  /**
   * Classify overall sentiment based on segments.
   */
  private classifyOverallSentiment(
    segments: Array<{ sentiment: string }>,
    score: number,
  ): string {
    const positives = segments.filter((s) => s.sentiment === 'POSITIVE').length;
    const negatives = segments.filter((s) => s.sentiment === 'NEGATIVE').length;
    const total = segments.length;

    if (total === 0) return 'NEUTRAL';

    const posRatio = positives / total;
    const negRatio = negatives / total;

    if (posRatio > 0.6) return 'POSITIVE';
    if (negRatio > 0.6) return 'NEGATIVE';
    if (Math.abs(posRatio - negRatio) < 0.2) return 'MIXED';

    return score > 0 ? 'POSITIVE' : score < 0 ? 'NEGATIVE' : 'NEUTRAL';
  }

  /**
   * Calculate sentiment distribution.
   */
  private calculateDistribution(
    segments: Array<{ sentiment: string }>,
  ): Record<string, number> {
    const distribution: Record<string, number> = {
      POSITIVE: 0,
      NEGATIVE: 0,
      NEUTRAL: 0,
    };

    segments.forEach((segment) => {
      if (segment.sentiment in distribution) {
        distribution[segment.sentiment]++;
      }
    });

    // Convert to percentages
    const total = segments.length;
    if (total > 0) {
      Object.keys(distribution).forEach((key) => {
        distribution[key] = distribution[key] / total;
      });
    }

    return distribution;
  }

  /**
   * Split text into sentences.
   */
  private splitSentences(text: string): string[] {
    return text
      .split(/[.!?]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 5);
  }

  async computeConfidence(input: AgentInput): Promise<number> {
    let confidence = 0.7;
    if (input.content.length > 500) confidence += 0.15;
    if (input.content.split(/[.!?]+/).length > 5) confidence += 0.1;
    return Math.min(confidence, 1.0);
  }
}

export const sentimentAgent = new SentimentAgent();
