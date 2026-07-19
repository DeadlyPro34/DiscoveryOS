/**
 * Opportunity Agent Implementation.
 * Identifies and recommends actionable opportunities.
 */

import { z } from 'zod';
import { BaseAgent } from '../base/baseAgent';
import { AgentInput, AgentCategory } from '@/types/ai/agent';

const OpportunityInputSchema = z.object({
  requestId: z.string(),
  content: z.string(),
  context: z.any().optional(),
  parameters: z.any().optional(),
  metadata: z.record(z.unknown()).optional(),
});

const OpportunityOutputSchema = z.object({
  opportunities: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      problems_solved: z.array(z.string()),
      expected_impact: z.string(),
      implementation_complexity: z.enum(['low', 'medium', 'high']),
      recommended_priority: z.enum(['high', 'medium', 'low']),
      potential_personas: z.array(z.string()),
    }),
  ),
  top_opportunities: z.array(z.string()),
});

/**
 * Opportunity Agent: Identifies strategic opportunities.
 */
export class OpportunityAgent extends BaseAgent {
  id = 'opportunity-agent';
  name = 'Opportunity Agent';
  description =
    'Identifies and recommends actionable opportunities from analysis.';
  category: AgentCategory = 'generation';
  icon = '🎯';
  version = '1.0.0';

  inputSchema = OpportunityInputSchema;
  outputSchema = OpportunityOutputSchema;

  protected async executeAgent(
    input: AgentInput,
  ): Promise<{ result: unknown; structured?: Record<string, unknown> }> {
    const opportunities = this.identifyOpportunities(input.content);
    const topOpportunities = opportunities
      .slice(0, 3)
      .map((opp) => opp.name);

    const structured = {
      opportunities,
      top_opportunities: topOpportunities,
    };

    return this.createOutput(structured, structured);
  }

  /**
   * Identify opportunities from content.
   */
  private identifyOpportunities(
    text: string,
  ): Array<{
    name: string;
    description: string;
    problems_solved: string[];
    expected_impact: string;
    implementation_complexity: string;
    recommended_priority: string;
    potential_personas: string[];
  }> {
    const opportunities: Array<{
      name: string;
      description: string;
      problems_solved: string[];
      expected_impact: string;
      implementation_complexity: string;
      recommended_priority: string;
      potential_personas: string[];
    }> = [];

    // Identify features/improvements mentioned
    const improvementItems = this.extractImprovementItems(text);

    improvementItems.forEach((item) => {
      const opportunity = this.createOpportunity(item, text);
      if (opportunity) {
        opportunities.push(opportunity);
      }
    });

    return opportunities;
  }

  /**
   * Extract improvement items from text.
   */
  private extractImprovementItems(text: string): string[] {
    const items: Set<string> = new Set();

    // Extract feature requests
    const patterns = [
      /should\s+([^.!?]+)/gi,
      /need\s+(?:to\s+)?([^.!?]+)/gi,
      /want\s+(?:to\s+)?([^.!?]+)/gi,
      /(?:would|could|can)\s+([^.!?]+)/gi,
      /feature.*?([^.!?]{10,50})/gi,
      /improvement.*?([^.!?]{10,50})/gi,
    ];

    patterns.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        items.add(match[1].trim().substring(0, 100));
      }
    });

    return Array.from(items).slice(0, 10);
  }

  /**
   * Create an opportunity from an improvement item.
   */
  private createOpportunity(
    item: string,
    fullText: string,
  ): {
    name: string;
    description: string;
    problems_solved: string[];
    expected_impact: string;
    implementation_complexity: string;
    recommended_priority: string;
    potential_personas: string[];
  } | null {
    // Generate opportunity name
    const name = this.generateOpportunityName(item);
    if (!name) return null;

    // Determine complexity
    const complexity = this.estimateComplexity(item);

    // Identify personas
    const personas = this.identifyTargetPersonas(item, fullText);

    // Determine impact
    const impact = this.assessImpact(item, fullText);

    // Determine priority
    const priority = this.determinePriority(complexity, impact);

    return {
      name,
      description: item,
      problems_solved: [item],
      expected_impact: impact,
      implementation_complexity: complexity,
      recommended_priority: priority,
      potential_personas: personas,
    };
  }

  /**
   * Generate a concise opportunity name.
   */
  private generateOpportunityName(item: string): string | null {
    // Remove common prefixes
    let name = item
      .replace(/^(should|need to|want to|could|would|can)\s+/i, '')
      .replace(/^(add|implement|create|build)\s+/i, '')
      .trim();

    // Capitalize and truncate
    name = name.charAt(0).toUpperCase() + name.slice(1);
    if (name.length > 50) {
      name = name.substring(0, 47) + '...';
    }

    return name;
  }

  /**
   * Estimate implementation complexity.
   */
  private estimateComplexity(item: string): string {
    const lowerItem = item.toLowerCase();

    if (
      lowerItem.includes('simple') ||
      lowerItem.includes('easy') ||
      lowerItem.includes('just add') ||
      lowerItem.includes('button')
    ) {
      return 'low';
    }

    if (
      lowerItem.includes('complex') ||
      lowerItem.includes('integration') ||
      lowerItem.includes('api') ||
      lowerItem.includes('overhaul')
    ) {
      return 'high';
    }

    return 'medium';
  }

  /**
   * Identify target personas for an opportunity.
   */
  private identifyTargetPersonas(
    item: string,
    fullText: string,
  ): string[] {
    const personas: string[] = [];
    const lowerItem = item.toLowerCase();

    if (
      lowerItem.includes('developer') ||
      lowerItem.includes('api') ||
      lowerItem.includes('code') ||
      lowerItem.includes('integration')
    ) {
      personas.push('Developer');
    }

    if (
      lowerItem.includes('enterprise') ||
      lowerItem.includes('admin') ||
      lowerItem.includes('sso') ||
      lowerItem.includes('audit')
    ) {
      personas.push('Enterprise');
    }

    if (
      lowerItem.includes('student') ||
      lowerItem.includes('free') ||
      lowerItem.includes('learning')
    ) {
      personas.push('Student');
    }

    if (
      lowerItem.includes('business') ||
      lowerItem.includes('team') ||
      lowerItem.includes('startup')
    ) {
      personas.push('SMB Owner');
    }

    return personas.length > 0
      ? personas
      : ['General Users'];
  }

  /**
   * Assess expected impact of an opportunity.
   */
  private assessImpact(item: string, fullText: string): string {
    const lowerItem = item.toLowerCase();
    const frequency = (
      fullText.match(new RegExp(item.split(/\s+/)[0], 'gi')) || []
    ).length;

    if (
      lowerItem.includes('retention') ||
      lowerItem.includes('churn') ||
      lowerItem.includes('revenue')
    ) {
      return 'HIGH - Direct revenue impact';
    }

    if (frequency > 3) {
      return 'HIGH - Mentioned multiple times';
    }

    if (
      lowerItem.includes('competitive') ||
      lowerItem.includes('differentiation')
    ) {
      return 'MEDIUM-HIGH - Competitive advantage';
    }

    if (lowerItem.includes('ux') || lowerItem.includes('experience')) {
      return 'MEDIUM - Improves user satisfaction';
    }

    return 'MEDIUM - Incremental improvement';
  }

  /**
   * Determine recommended priority.
   */
  private determinePriority(complexity: string, impact: string): string {
    if (complexity === 'low' && impact.includes('HIGH')) {
      return 'high';
    }

    if (complexity === 'high' && !impact.includes('HIGH')) {
      return 'low';
    }

    if (impact.includes('MEDIUM')) {
      return 'medium';
    }

    return 'low';
  }

  async computeConfidence(input: AgentInput): Promise<number> {
    return 0.75;
  }
}

export const opportunityAgent = new OpportunityAgent();
