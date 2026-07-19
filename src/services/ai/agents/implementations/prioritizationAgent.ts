/**
 * Prioritization Agent Implementation.
 * Implements RICE scoring and prioritization framework.
 */

import { z } from 'zod';
import { BaseAgent } from '../base/baseAgent';
import { AgentInput, AgentCategory } from '@/types/ai/agent';

const PrioritizationInputSchema = z.object({
  requestId: z.string(),
  content: z.string(),
  context: z.any().optional(),
  parameters: z.any().optional(),
  metadata: z.record(z.unknown()).optional(),
});

const PrioritizationOutputSchema = z.object({
  prioritized_items: z.array(
    z.object({
      item: z.string(),
      rice_score: z.number(),
      rank: z.number(),
      reach: z.number(),
      impact: z.number(),
      confidence: z.number(),
      effort: z.number(),
    }),
  ),
});

/**
 * Prioritization Agent: RICE scoring and prioritization.
 */
export class PrioritizationAgent extends BaseAgent {
  id = 'prioritization-agent';
  name = 'Prioritization Agent';
  description = 'Prioritizes items using RICE scoring framework.';
  category: AgentCategory = 'generation';
  icon = '⭐';
  version = '1.0.0';

  inputSchema = PrioritizationInputSchema;
  outputSchema = PrioritizationOutputSchema;

  protected async executeAgent(
    input: AgentInput,
  ): Promise<{ result: unknown; structured?: Record<string, unknown> }> {
    const items = this.extractItems(input.content);
    const scoredItems = items.map((item) =>
      this.computeRICEScore(item, input.content),
    );

    // Sort by RICE score descending
    const prioritizedItems = scoredItems
      .sort((a, b) => b.rice_score - a.rice_score)
      .map((item, index) => ({
        ...item,
        rank: index + 1,
      }));

    const structured = {
      prioritized_items: prioritizedItems,
    };

    return this.createOutput(structured, structured);
  }

  /**
   * Extract items to prioritize.
   */
  private extractItems(text: string): string[] {
    const items: Set<string> = new Set();

    // Extract from various patterns
    const patterns = [
      /^[\s]*[-•*]\s+(.+)$/gm,
      /^\s*\d+\.\s+(.+)$/gm,
      /(?:should|need to|want to|feature|improvement).*?([^.!?]{20,100})/gi,
    ];

    patterns.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const item = match[1].trim();
        if (item.length > 10) {
          items.add(item);
        }
      }
    });

    return Array.from(items).slice(0, 20);
  }

  /**
   * Compute RICE score for an item.
   * RICE = (Reach × Impact × Confidence) / Effort
   */
  private computeRICEScore(
    item: string,
    fullText: string,
  ): {
    item: string;
    rice_score: number;
    reach: number;
    impact: number;
    confidence: number;
    effort: number;
  } {
    const reach = this.estimateReach(item, fullText);
    const impact = this.estimateImpact(item);
    const confidence = this.estimateConfidence(item, fullText);
    const effort = this.estimateEffort(item);

    // RICE = (R × I × C) / E
    const rice_score = (reach * impact * confidence) / Math.max(1, effort);

    return {
      item,
      rice_score,
      reach,
      impact,
      confidence,
      effort,
    };
  }

  /**
   * Estimate Reach (how many users affected per quarter).
   */
  private estimateReach(item: string, fullText: string): number {
    const lowerItem = item.toLowerCase();

    // Check if mentioned multiple times (proxy for reach)
    const words = item.split(/\s+/).slice(0, 3).join('.*?');
    const mentionCount = (fullText.match(new RegExp(words, 'gi')) || [])
      .length;

    if (
      lowerItem.includes('everyone') ||
      lowerItem.includes('all users')
    ) {
      return 5000; // Very high reach
    }

    if (
      lowerItem.includes('enterprise') ||
      lowerItem.includes('team') ||
      mentionCount > 5
    ) {
      return 2000; // High reach
    }

    if (
      lowerItem.includes('many') ||
      lowerItem.includes('often') ||
      mentionCount > 2
    ) {
      return 500; // Medium reach
    }

    if (lowerItem.includes('some') || lowerItem.includes('occasionally')) {
      return 100; // Low reach
    }

    return 50; // Minimal reach
  }

  /**
   * Estimate Impact (3=massive, 2=high, 1=medium, 0.5=low, 0.25=minimal).
   */
  private estimateImpact(item: string): number {
    const lowerItem = item.toLowerCase();

    if (
      lowerItem.includes('churn') ||
      lowerItem.includes('revenue') ||
      lowerItem.includes('retention') ||
      lowerItem.includes('critical')
    ) {
      return 3; // Massive impact
    }

    if (
      lowerItem.includes('important') ||
      lowerItem.includes('blocking') ||
      lowerItem.includes('broken')
    ) {
      return 2; // High impact
    }

    if (
      lowerItem.includes('good') ||
      lowerItem.includes('nice') ||
      lowerItem.includes('improve')
    ) {
      return 1; // Medium impact
    }

    if (lowerItem.includes('minor') || lowerItem.includes('small')) {
      return 0.5; // Low impact
    }

    return 1; // Default medium
  }

  /**
   * Estimate Confidence (0-1, how confident are we?).
   */
  private estimateConfidence(item: string, fullText: string): number {
    const lowerItem = item.toLowerCase();

    // High confidence if mentioned multiple times or is specific
    const words = item.split(/\s+/).slice(0, 3).join('.*?');
    const mentionCount = (fullText.match(new RegExp(words, 'gi')) || [])
      .length;

    if (mentionCount > 3) return 1.0; // Very confident
    if (mentionCount > 1) return 0.8; // Confident
    if (
      lowerItem.includes('definitely') ||
      lowerItem.includes('must') ||
      lowerItem.includes('critical')
    ) {
      return 0.9; // High confidence
    }
    if (
      lowerItem.includes('maybe') ||
      lowerItem.includes('might') ||
      lowerItem.includes('could')
    ) {
      return 0.5; // Low confidence
    }

    return 0.7; // Default moderate confidence
  }

  /**
   * Estimate Effort (person-months to implement).
   */
  private estimateEffort(item: string): number {
    const lowerItem = item.toLowerCase();

    if (
      lowerItem.includes('simple') ||
      lowerItem.includes('just add') ||
      lowerItem.includes('button') ||
      lowerItem.includes('label')
    ) {
      return 0.5; // Half a month
    }

    if (
      lowerItem.includes('complex') ||
      lowerItem.includes('new system') ||
      lowerItem.includes('overhaul') ||
      lowerItem.includes('integration')
    ) {
      return 6; // 6 months
    }

    if (
      lowerItem.includes('api') ||
      lowerItem.includes('backend') ||
      lowerItem.includes('database')
    ) {
      return 3; // 3 months
    }

    if (
      lowerItem.includes('ui') ||
      lowerItem.includes('redesign') ||
      lowerItem.includes('frontend')
    ) {
      return 2; // 2 months
    }

    return 1.5; // Default 1.5 months
  }

  async computeConfidence(input: AgentInput): Promise<number> {
    return 0.8;
  }
}

export const prioritizationAgent = new PrioritizationAgent();
