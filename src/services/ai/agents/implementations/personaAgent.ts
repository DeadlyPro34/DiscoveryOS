/**
 * Persona Agent Implementation.
 * Identifies user personas and types from content.
 */

import { z } from 'zod';
import { BaseAgent } from '../base/baseAgent';
import { AgentInput, AgentCategory } from '@/types/ai/agent';

const PersonaInputSchema = z.object({
  requestId: z.string(),
  content: z.string(),
  context: z.any().optional(),
  parameters: z.any().optional(),
  metadata: z.record(z.unknown()).optional(),
});

const PersonaOutputSchema = z.object({
  personas: z.array(
    z.object({
      type: z.string(),
      description: z.string(),
      characteristics: z.array(z.string()),
      goals: z.array(z.string()),
      pain_points: z.array(z.string()),
      confidence: z.number(),
    }),
  ),
});

/**
 * Persona Agent: Identifies user personas from content.
 */
export class PersonaAgent extends BaseAgent {
  id = 'persona-agent';
  name = 'Persona Agent';
  description = 'Identifies and characterizes user personas from research data.';
  category: AgentCategory = 'analysis';
  icon = '👤';
  version = '1.0.0';

  inputSchema = PersonaInputSchema;
  outputSchema = PersonaOutputSchema;

  protected async executeAgent(
    input: AgentInput,
  ): Promise<{ result: unknown; structured?: Record<string, unknown> }> {
    const personas = this.identifyPersonas(input.content);

    const structured = {
      personas,
    };

    return this.createOutput(structured, structured);
  }

  /**
   * Identify personas using keyword matching and pattern recognition.
   */
  private identifyPersonas(text: string): Array<{
    type: string;
    description: string;
    characteristics: string[];
    goals: string[];
    pain_points: string[];
    confidence: number;
  }> {
    const personas: Array<{
      type: string;
      description: string;
      characteristics: string[];
      goals: string[];
      pain_points: string[];
      confidence: number;
    }> = [];

    const lowerText = text.toLowerCase();

    // Developer persona
    if (this.hasDevKeywords(lowerText)) {
      personas.push(this.createDevPersona(lowerText));
    }

    // Enterprise persona
    if (this.hasEnterpriseKeywords(lowerText)) {
      personas.push(this.createEnterprisePersona(lowerText));
    }

    // Student persona
    if (this.hasStudentKeywords(lowerText)) {
      personas.push(this.createStudentPersona(lowerText));
    }

    // SMB owner persona
    if (this.hasSMBKeywords(lowerText)) {
      personas.push(this.createSMBPersona(lowerText));
    }

    // Product manager persona
    if (this.hasPMKeywords(lowerText)) {
      personas.push(this.createPMPersona(lowerText));
    }

    return personas;
  }

  private hasDevKeywords(text: string): boolean {
    const keywords = [
      'code',
      'api',
      'developer',
      'programming',
      'javascript',
      'python',
      'deploy',
      'github',
      'technical',
      'cli',
      'sdk',
    ];
    return keywords.some((kw) => text.includes(kw));
  }

  private hasEnterpriseKeywords(text: string): boolean {
    const keywords = [
      'enterprise',
      'scale',
      'compliance',
      'sso',
      'audit',
      'admin',
      'team management',
      'security',
      'permissions',
      'organization',
    ];
    return keywords.some((kw) => text.includes(kw));
  }

  private hasStudentKeywords(text: string): boolean {
    const keywords = [
      'student',
      'learning',
      'free',
      'budget',
      'school',
      'university',
      'educational',
      'price sensitive',
    ];
    return keywords.some((kw) => text.includes(kw));
  }

  private hasSMBKeywords(text: string): boolean {
    const keywords = [
      'small business',
      'startup',
      'smb',
      'growing',
      'limited budget',
      'efficiency',
      'automation',
      'team small',
    ];
    return keywords.some((kw) => text.includes(kw));
  }

  private hasPMKeywords(text: string): boolean {
    const keywords = [
      'product manager',
      'pm',
      'roadmap',
      'feature',
      'analytics',
      'reporting',
      'strategic',
      'metrics',
      'ux research',
    ];
    return keywords.some((kw) => text.includes(kw));
  }

  private createDevPersona(
    text: string,
  ): {
    type: string;
    description: string;
    characteristics: string[];
    goals: string[];
    pain_points: string[];
    confidence: number;
  } {
    return {
      type: 'Developer',
      description:
        'Technical users who build solutions and integrate via APIs',
      characteristics: [
        'Technical depth',
        'Integration-focused',
        'Prefer code/CLI',
        'Open source friendly',
      ],
      goals: [
        'Easy API integration',
        'Good documentation',
        'Developer tools',
        'Fast deployment',
      ],
      pain_points: [
        'Poor documentation',
        'API limitations',
        'Deployment complexity',
        'Lack of tools',
      ],
      confidence: text.includes('api') ? 0.9 : 0.7,
    };
  }

  private createEnterprisePersona(
    text: string,
  ): {
    type: string;
    description: string;
    characteristics: string[];
    goals: string[];
    pain_points: string[];
    confidence: number;
  } {
    return {
      type: 'Enterprise',
      description:
        'Large organizations with security, compliance, and team needs',
      characteristics: [
        'Security-conscious',
        'Process-driven',
        'Large teams',
        'Budget available',
      ],
      goals: [
        'Enterprise security',
        'Compliance support',
        'Team management',
        'Analytics',
      ],
      pain_points: [
        'Security concerns',
        'Compliance gaps',
        'User management',
        'Audit requirements',
      ],
      confidence: text.includes('enterprise') || text.includes('sso') ? 0.9 : 0.6,
    };
  }

  private createStudentPersona(
    text: string,
  ): {
    type: string;
    description: string;
    characteristics: string[];
    goals: string[];
    pain_points: string[];
    confidence: number;
  } {
    return {
      type: 'Student',
      description: 'Budget-conscious learners in educational settings',
      characteristics: [
        'Price-sensitive',
        'Learning-focused',
        'Experimental',
        'Collaborative',
      ],
      goals: [
        'Free/cheap access',
        'Learning resources',
        'Easy to learn',
        'Community support',
      ],
      pain_points: ['Cost', 'Complexity', 'Limited features', 'Support'],
      confidence: text.includes('student') || text.includes('free') ? 0.85 : 0.5,
    };
  }

  private createSMBPersona(
    text: string,
  ): {
    type: string;
    description: string;
    characteristics: string[];
    goals: string[];
    pain_points: string[];
    confidence: number;
  } {
    return {
      type: 'SMB Owner',
      description: 'Growing businesses with limited resources',
      characteristics: [
        'Resource-constrained',
        'Growth-focused',
        'Efficiency-driven',
        'Multi-role',
      ],
      goals: [
        'Automation',
        'Efficiency',
        'Scalability',
        'Ease of use',
      ],
      pain_points: [
        'Time constraint',
        'Limited budget',
        'Complexity',
        'Lack of support',
      ],
      confidence: text.includes('startup') || text.includes('growing') ? 0.85 : 0.6,
    };
  }

  private createPMPersona(
    text: string,
  ): {
    type: string;
    description: string;
    characteristics: string[];
    goals: string[];
    pain_points: string[];
    confidence: number;
  } {
    return {
      type: 'Product Manager',
      description: 'Strategic thinkers focused on product direction',
      characteristics: [
        'Data-driven',
        'Strategic',
        'User-focused',
        'Analytical',
      ],
      goals: [
        'User insights',
        'Feature validation',
        'Analytics',
        'Data-driven decisions',
      ],
      pain_points: [
        'User feedback gaps',
        'Analytics limitations',
        'Research data',
        'Feature validation',
      ],
      confidence: text.includes('pm') || text.includes('analytics') ? 0.85 : 0.5,
    };
  }

  async computeConfidence(input: AgentInput): Promise<number> {
    let confidence = 0.65;
    if (input.content.length > 1000) confidence += 0.15;
    return Math.min(confidence, 1.0);
  }
}

export const personaAgent = new PersonaAgent();
