/**
 * Impact Agent Implementation.
 * Scores business impact of insights and themes on 0-10 scale.
 */

import { z } from 'zod';
import { BaseAgent } from '../base/baseAgent';
import { AgentInput, AgentCategory } from '@/types/ai/agent';

const ImpactInputSchema = z.object({
  requestId: z.string(),
  content: z.string(),
  context: z.any().optional(),
  parameters: z.any().optional(),
  metadata: z.record(z.unknown()).optional(),
});

const ImpactOutputSchema = z.object({
  impact_scores: z.array(
    z.object({
      item: z.string(),
      impact_score: z.number().min(0).max(10),
      factors: z.record(z.number()),
      recommendation: z.string(),
    }),
  ),
  average_impact: z.number(),
});

/**
 * Impact Agent: Scores business impact on 0-10 scale.
 */
export class ImpactAgent extends BaseAgent {
  id = 'impact-agent';
  name = 'Impact Agent';
  description =
    'Scores business impact of insights and themes on a 0-10 scale.';
  category: AgentCategory = 'analysis';
  icon = '⚡';
  version = '1.0.0';

  inputSchema = ImpactInputSchema;
  outputSchema = ImpactOutputSchema;

  protected async executeAgent(
    input: AgentInput,
  ): Promise<{ result: unknown; structured?: Record<string, unknown> }> {
    const items = this.extractItems(input.content);
    const impactScores = items.map((item) =>
      this.scoreImpact(item, input.content),
    );

    const averageImpact =
      impactScores.length > 0
        ? impactScores.reduce((sum, s) => sum + s.impact_score, 0) /
          impactScores.length
        : 0;

    const structured = {
      impact_scores: impactScores,
      average_impact: averageImpact,
    };

    return this.createOutput(structured, structured);
  }

  /**
   * Extract items to score from content.
   */
  private extractItems(text: string): string[] {
    const items: Set<string> = new Set();

    // Extract bullet points
    const bulletPattern = /^[\s]*[-•*]\s+(.+)$/gm;
    let match;
    while ((match = bulletPattern.exec(text)) !== null) {
      items.add(match[1].trim());
    }

    // Extract numbered items
    const numberedPattern = /^\s*\d+\.\s+(.+)$/gm;
    while ((match = numberedPattern.exec(text)) !== null) {
      items.add(match[1].trim());
    }

    // Extract key phrases from sentences
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 10);
    sentences.slice(0, 10).forEach((sentence) => {
      const trimmed = sentence.trim();
      if (trimmed.length > 20) {
        items.add(trimmed);
      }
    });

    return Array.from(items).slice(0, 15);
  }

  /**
   * Score impact of an item.
   */
  private scoreImpact(
    item: string,
    fullText: string,
  ): {
    item: string;
    impact_score: number;
    factors: Record<string, number>;
    recommendation: string;
  } {
    const factors: Record<string, number> = {
      urgency: this.scoreUrgency(item),
      frequency: this.scoreFrequency(item, fullText),
      user_count: this.scoreUserCount(item),
      business_value: this.scoreBusinessValue(item),
      revenue_potential: this.scoreRevenueImpact(item),
      risk_mitigation: this.scoreRiskMitigation(item),
    };

    // Calculate weighted score
    const impact_score = Math.round(
      factors.urgency * 2 +
      factors.frequency * 2 +
      factors.user_count * 1.5 +
      factors.business_value * 2 +
      factors.revenue_potential * 1 +
      factors.risk_mitigation * 1,
    ) / 10;

    const recommendation = this.getRecommendation(impact_score);

    return {
      item,
      impact_score: Math.min(10, Math.max(0, impact_score)),
      factors,
      recommendation,
    };
  }

  /**
   * Score urgency based on keywords.
   */
  private scoreUrgency(item: string): number {
    const lowerItem = item.toLowerCase();
    if (
      lowerItem.includes('urgent') ||
      lowerItem.includes('critical') ||
      lowerItem.includes('broken') ||
      lowerItem.includes('crash')
    ) {
      return 10;
    }
    if (
      lowerItem.includes('important') ||
      lowerItem.includes('blocking') ||
      lowerItem.includes('bug')
    ) {
      return 8;
    }
    if (
      lowerItem.includes('need') ||
      lowerItem.includes('must') ||
      lowerItem.includes('required')
    ) {
      return 6;
    }
    if (
      lowerItem.includes('nice') ||
      lowerItem.includes('maybe') ||
      lowerItem.includes('could')
    ) {
      return 3;
    }
    return 5;
  }

  /**
   * Score based on frequency in text.
   */
  private scoreFrequency(item: string, fullText: string): number {
    const pattern = new RegExp(
      item.split(/\s+/).slice(0, 3).join('.*?'),
      'gi',
    );
    const matches = (fullText.match(pattern) || []).length;

    if (matches > 5) return 10;
    if (matches > 3) return 8;
    if (matches > 1) return 6;
    return 3;
  }

  /**
   * Estimate affected user count.
   */
  private scoreUserCount(item: string): number {
    const lowerItem = item.toLowerCase();

    if (
      lowerItem.includes('everyone') ||
      lowerItem.includes('all users') ||
      lowerItem.includes('enterprise')
    ) {
      return 10;
    }
    if (
      lowerItem.includes('many') ||
      lowerItem.includes('team') ||
      lowerItem.includes('organization')
    ) {
      return 8;
    }
    if (
      lowerItem.includes('some') ||
      lowerItem.includes('several') ||
      lowerItem.includes('often')
    ) {
      return 6;
    }
    if (
      lowerItem.includes('few') ||
      lowerItem.includes('sometimes') ||
      lowerItem.includes('occasionally')
    ) {
      return 3;
    }
    return 5;
  }

  /**
   * Score business value.
   */
  private scoreBusinessValue(item: string): number {
    const lowerItem = item.toLowerCase();

    if (
      lowerItem.includes('revenue') ||
      lowerItem.includes('churn') ||
      lowerItem.includes('retention')
    ) {
      return 9;
    }
    if (
      lowerItem.includes('competitive') ||
      lowerItem.includes('differentiation') ||
      lowerItem.includes('market')
    ) {
      return 8;
    }
    if (
      lowerItem.includes('efficiency') ||
      lowerItem.includes('productivity') ||
      lowerItem.includes('user satisfaction')
    ) {
      return 7;
    }
    if (
      lowerItem.includes('nice to have') ||
      lowerItem.includes('enhancement')
    ) {
      return 4;
    }
    return 5;
  }

  /**
   * Score revenue impact.
   */
  private scoreRevenueImpact(item: string): number {
    const lowerItem = item.toLowerCase();

    if (
      lowerItem.includes('upsell') ||
      lowerItem.includes('monetization') ||
      lowerItem.includes('premium')
    ) {
      return 10;
    }
    if (
      lowerItem.includes('pricing') ||
      lowerItem.includes('payment') ||
      lowerItem.includes('subscription')
    ) {
      return 8;
    }
    if (
      lowerItem.includes('feature') ||
      lowerItem.includes('capability')
    ) {
      return 6;
    }
    return 3;
  }

  /**
   * Score risk mitigation value.
   */
  private scoreRiskMitigation(item: string): number {
    const lowerItem = item.toLowerCase();

    if (
      lowerItem.includes('security') ||
      lowerItem.includes('compliance') ||
      lowerItem.includes('audit')
    ) {
      return 10;
    }
    if (
      lowerItem.includes('stability') ||
      lowerItem.includes('reliability') ||
      lowerItem.includes('downtime')
    ) {
      return 8;
    }
    if (lowerItem.includes('bug') || lowerItem.includes('issue')) {
      return 7;
    }
    return 2;
  }

  /**
   * Get recommendation based on impact score.
   */
  private getRecommendation(score: number): string {
    if (score >= 8) return 'HIGH PRIORITY - Address immediately';
    if (score >= 6) return 'MEDIUM PRIORITY - Include in roadmap';
    if (score >= 4) return 'LOW PRIORITY - Consider for future';
    return 'MINIMAL - Monitor but defer';
  }

  async computeConfidence(input: AgentInput): Promise<number> {
    return 0.8;
  }
}

export const impactAgent = new ImpactAgent();
