/**
 * PRD Agent Implementation.
 * Generates comprehensive Product Requirements Documents.
 */

import { z } from 'zod';
import { BaseAgent } from '../base/baseAgent';
import { AgentInput, AgentCategory } from '@/types/ai/agent';

const PRDInputSchema = z.object({
  requestId: z.string(),
  content: z.string(),
  context: z.any().optional(),
  parameters: z.any().optional(),
  metadata: z.record(z.unknown()).optional(),
});

const PRDOutputSchema = z.object({
  prd: z.object({
    title: z.string(),
    version: z.string(),
    executive_summary: z.string(),
    problem_statement: z.string(),
    goals: z.array(z.string()),
    personas: z.array(z.string()),
    requirements: z.object({
      functional: z.array(z.string()),
      non_functional: z.array(z.string()),
      user_stories: z.array(
        z.object({
          title: z.string(),
          description: z.string(),
          acceptance_criteria: z.array(z.string()),
        }),
      ),
    }),
    success_criteria: z.array(z.string()),
    timeline_estimate: z.string(),
    risks: z.array(z.string()),
    dependencies: z.array(z.string()),
  }),
});

/**
 * PRD Agent: Generates Product Requirements Documents.
 */
export class PRDAgent extends BaseAgent {
  id = 'prd-agent';
  name = 'PRD Agent';
  description = 'Generates structured Product Requirements Documents.';
  category: AgentCategory = 'generation';
  icon = '📄';
  version = '1.0.0';

  inputSchema = PRDInputSchema;
  outputSchema = PRDOutputSchema;

  protected async executeAgent(
    input: AgentInput,
  ): Promise<{ result: unknown; structured?: Record<string, unknown> }> {
    const prd = this.generatePRD(input.content);

    const structured = {
      prd,
    };

    return this.createOutput(structured, structured);
  }

  /**
   * Generate a comprehensive PRD from content.
   */
  private generatePRD(text: string): {
    title: string;
    version: string;
    executive_summary: string;
    problem_statement: string;
    goals: string[];
    personas: string[];
    requirements: {
      functional: string[];
      non_functional: string[];
      user_stories: Array<{
        title: string;
        description: string;
        acceptance_criteria: string[];
      }>;
    };
    success_criteria: string[];
    timeline_estimate: string;
    risks: string[];
    dependencies: string[];
  } {
    const title = this.generateTitle(text);
    const executive_summary = this.generateExecutiveSummary(text);
    const problem_statement = this.generateProblemStatement(text);
    const goals = this.extractGoals(text);
    const personas = this.identifyPersonas(text);

    const requirements = {
      functional: this.extractFunctionalRequirements(text),
      non_functional: this.extractNonFunctionalRequirements(text),
      user_stories: this.generateUserStories(text),
    };

    const success_criteria = this.generateSuccessCriteria(text);
    const timeline_estimate = this.estimateTimeline(requirements);
    const risks = this.identifyRisks(text);
    const dependencies = this.identifyDependencies(text);

    return {
      title,
      version: '1.0.0',
      executive_summary,
      problem_statement,
      goals,
      personas,
      requirements,
      success_criteria,
      timeline_estimate,
      risks,
      dependencies,
    };
  }

  /**
   * Generate PRD title from content.
   */
  private generateTitle(text: string): string {
    // Look for feature name or use first capitalized phrase
    const capitalizedPhrase = text.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/);
    if (capitalizedPhrase) {
      return `PRD: ${capitalizedPhrase[0]}`;
    }
    return 'Product Requirements Document';
  }

  /**
   * Generate executive summary.
   */
  private generateExecutiveSummary(text: string): string {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 20);
    const summary = sentences
      .slice(0, 2)
      .map((s) => s.trim())
      .join(' ');
    return summary || 'This feature improves user experience based on research findings.';
  }

  /**
   * Generate problem statement.
   */
  private generateProblemStatement(text: string): string {
    const lowerText = text.toLowerCase();

    // Extract pain points
    if (lowerText.includes('problem') || lowerText.includes('pain')) {
      const match = text.match(/(?:problem|pain)[^.!?]{10,200}/i);
      if (match) return match[0];
    }

    // Look for common pain point keywords
    const painPoints = [
      'frustrat',
      'difficult',
      'slow',
      'doesn\'t work',
      'confusing',
    ];
    for (const keyword of painPoints) {
      if (lowerText.includes(keyword)) {
        return `Users experience issues related to ${keyword.replace(/[^\w]/g, '')} based on research feedback.`;
      }
    }

    return 'Based on user research, we identified key areas for improvement to enhance user satisfaction and efficiency.';
  }

  /**
   * Extract goals from text.
   */
  private extractGoals(text: string): string[] {
    const goals: string[] = [];

    // Common goal patterns
    const goalPatterns = [
      /improve\s+([^.!?]{10,50})/gi,
      /increase\s+([^.!?]{10,50})/gi,
      /reduce\s+([^.!?]{10,50})/gi,
      /enable\s+([^.!?]{10,50})/gi,
      /provide\s+([^.!?]{10,50})/gi,
    ];

    goalPatterns.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        goals.push(`${pattern.source.split('\\s+')[0]}: ${match[1].trim()}`);
      }
    });

    // Ensure at least some default goals
    if (goals.length === 0) {
      goals.push('Improve user experience');
      goals.push('Address identified pain points');
      goals.push('Increase user satisfaction');
    }

    return goals.slice(0, 5);
  }

  /**
   * Identify target personas.
   */
  private identifyPersonas(text: string): string[] {
    const personas: string[] = [];
    const lowerText = text.toLowerCase();

    if (
      lowerText.includes('developer') ||
      lowerText.includes('api') ||
      lowerText.includes('code')
    ) {
      personas.push('Developer');
    }
    if (
      lowerText.includes('enterprise') ||
      lowerText.includes('admin')
    ) {
      personas.push('Enterprise Admin');
    }
    if (
      lowerText.includes('student') ||
      lowerText.includes('learning')
    ) {
      personas.push('Student');
    }
    if (
      lowerText.includes('business') ||
      lowerText.includes('manager')
    ) {
      personas.push('Business User');
    }

    return personas.length > 0
      ? personas
      : ['End User'];
  }

  /**
   * Extract functional requirements.
   */
  private extractFunctionalRequirements(text: string): string[] {
    const requirements: string[] = [];

    const patterns = [
      /(?:must|should|need to)\s+([^.!?]{10,80})/gi,
      /feature.*?([^.!?]{10,80})/gi,
      /capability.*?([^.!?]{10,80})/gi,
    ];

    patterns.forEach((pattern) => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        const req = match[1].trim();
        if (req.length > 10) {
          requirements.push(req);
        }
      }
    });

    if (requirements.length === 0) {
      requirements.push('System shall provide core functionality');
      requirements.push('System shall handle user interactions');
      requirements.push('System shall store relevant data');
    }

    return requirements.slice(0, 10);
  }

  /**
   * Extract non-functional requirements.
   */
  private extractNonFunctionalRequirements(text: string): string[] {
    const requirements: string[] = [];
    const lowerText = text.toLowerCase();

    if (
      lowerText.includes('performance') ||
      lowerText.includes('speed') ||
      lowerText.includes('fast')
    ) {
      requirements.push('System shall respond to requests within 2 seconds');
    }

    if (
      lowerText.includes('security') ||
      lowerText.includes('encrypt') ||
      lowerText.includes('safe')
    ) {
      requirements.push('System shall encrypt sensitive data');
      requirements.push('System shall support SSO authentication');
    }

    if (
      lowerText.includes('scalab') ||
      lowerText.includes('load') ||
      lowerText.includes('capacity')
    ) {
      requirements.push('System shall handle 10,000 concurrent users');
    }

    if (lowerText.includes('availab') || lowerText.includes('uptime')) {
      requirements.push('System shall maintain 99.9% uptime');
    }

    // Default non-functional requirements
    if (requirements.length === 0) {
      requirements.push('System shall be responsive and performant');
      requirements.push('System shall be secure and reliable');
    }

    return requirements;
  }

  /**
   * Generate user stories.
   */
  private generateUserStories(
    text: string,
  ): Array<{
    title: string;
    description: string;
    acceptance_criteria: string[];
  }> {
    const stories: Array<{
      title: string;
      description: string;
      acceptance_criteria: string[];
    }> = [];

    // Generate generic user stories based on content
    const personas = this.identifyPersonas(text);
    const requirements =
      this.extractFunctionalRequirements(text).slice(0, 3);

    personas.forEach((persona, pIdx) => {
      requirements.forEach((req, rIdx) => {
        stories.push({
          title: `${persona} - ${req.substring(0, 40)}`,
          description: `As a ${persona}, I want to ${req} so that I can achieve my goals.`,
          acceptance_criteria: [
            `The system successfully ${req}`,
            `The feature is intuitive for ${persona}s`,
            `Performance is acceptable`,
          ],
        });
      });
    });

    return stories.slice(0, 5);
  }

  /**
   * Generate success criteria.
   */
  private generateSuccessCriteria(text: string): string[] {
    return [
      'Feature is implemented per specifications',
      'User testing shows positive feedback',
      'Performance metrics are within targets',
      'Zero critical bugs at launch',
      'User adoption exceeds 50% within first month',
    ];
  }

  /**
   * Estimate implementation timeline.
   */
  private estimateTimeline(requirements: {
    functional: string[];
    non_functional: string[];
    user_stories: Array<{ title: string }>;
  }): string {
    const totalItems =
      requirements.functional.length +
      requirements.non_functional.length +
      requirements.user_stories.length;

    if (totalItems > 15) return '3-4 months';
    if (totalItems > 10) return '2-3 months';
    if (totalItems > 5) return '4-6 weeks';
    return '2-3 weeks';
  }

  /**
   * Identify risks.
   */
  private identifyRisks(text: string): string[] {
    const risks: string[] = [];
    const lowerText = text.toLowerCase();

    if (lowerText.includes('integration') || lowerText.includes('api')) {
      risks.push('Third-party API integration delays');
    }

    if (lowerText.includes('security') || lowerText.includes('encrypt')) {
      risks.push('Security implementation complexity');
    }

    if (lowerText.includes('scale') || lowerText.includes('performance')) {
      risks.push('Performance under high load');
    }

    if (risks.length === 0) {
      risks.push('Schedule delays');
      risks.push('Scope creep');
    }

    return risks;
  }

  /**
   * Identify dependencies.
   */
  private identifyDependencies(text: string): string[] {
    const deps: string[] = [];
    const lowerText = text.toLowerCase();

    if (lowerText.includes('api')) {
      deps.push('Third-party API availability');
    }

    if (lowerText.includes('database') || lowerText.includes('storage')) {
      deps.push('Database infrastructure');
    }

    if (lowerText.includes('design') || lowerText.includes('ui')) {
      deps.push('UI/UX design completion');
    }

    return deps.length > 0 ? deps : [];
  }

  async computeConfidence(input: AgentInput): Promise<number> {
    return 0.75;
  }
}

export const prdAgent = new PRDAgent();
