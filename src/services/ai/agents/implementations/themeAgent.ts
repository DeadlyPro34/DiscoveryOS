/**
 * Theme Agent Implementation.
 * Clusters insights into coherent themes (Auth, Billing, Performance, etc).
 */

import { z } from 'zod';
import { BaseAgent } from '../base/baseAgent';
import { AgentInput, AgentCategory } from '@/types/ai/agent';

const ThemeInputSchema = z.object({
  requestId: z.string(),
  content: z.string(),
  context: z.any().optional(),
  parameters: z.any().optional(),
  metadata: z.record(z.unknown()).optional(),
});

const ThemeOutputSchema = z.object({
  themes: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      insights: z.array(z.string()),
      strength: z.number(),
    }),
  ),
  theme_count: z.number(),
});

/**
 * Theme Agent: Clusters insights into coherent themes.
 */
export class ThemeAgent extends BaseAgent {
  id = 'theme-agent';
  name = 'Theme Agent';
  description = 'Clusters insights into coherent themes representing product areas.';
  category: AgentCategory = 'analysis';
  icon = '📊';
  version = '1.0.0';

  inputSchema = ThemeInputSchema;
  outputSchema = ThemeOutputSchema;

  private defaultThemes = [
    'Authentication',
    'Billing & Pricing',
    'Performance',
    'User Experience',
    'Onboarding',
    'Integration',
    'Documentation',
    'Support',
    'Analytics',
    'Security',
  ];

  protected async executeAgent(
    input: AgentInput,
  ): Promise<{ result: unknown; structured?: Record<string, unknown> }> {
    const themes = this.clusterIntoThemes(input.content);

    const structured = {
      themes,
      theme_count: themes.length,
    };

    return this.createOutput(structured, structured);
  }

  /**
   * Cluster content into themes using keyword matching.
   */
  private clusterIntoThemes(
    text: string,
  ): Array<{ name: string; description: string; insights: string[]; strength: number }> {
    const themes: Record<string, { description: string; insights: string[]; strength: number }> = {};

    // Initialize themes
    this.defaultThemes.forEach((theme) => {
      themes[theme] = { description: '', insights: [], strength: 0 };
    });

    // Extract sentences and assign to themes
    const sentences = this.splitSentences(text);
    sentences.forEach((sentence) => {
      const assignedTheme = this.assignTheme(sentence);
      if (assignedTheme && themes[assignedTheme]) {
        themes[assignedTheme].insights.push(sentence);
        themes[assignedTheme].strength += 0.1;
      }
    });

    // Convert to output format, filter out empty themes
    return Object.entries(themes)
      .filter(([, theme]) => theme.insights.length > 0)
      .map(([name, theme]) => ({
        name,
        description: this.generateThemeDescription(name),
        insights: theme.insights.slice(0, 5), // Top 5 insights
        strength: Math.min(1, theme.strength),
      }));
  }

  /**
   * Assign a sentence to a theme using keyword matching.
   */
  private assignTheme(sentence: string): string | null {
    const lowerSentence = sentence.toLowerCase();

    const themeKeywords: Record<string, string[]> = {
      Authentication: [
        'login',
        'password',
        'authentication',
        'auth',
        'sign in',
        'sso',
        'oauth',
      ],
      'Billing & Pricing': [
        'price',
        'cost',
        'payment',
        'billing',
        'charge',
        'subscription',
        'plan',
      ],
      Performance: [
        'slow',
        'fast',
        'speed',
        'lag',
        'latency',
        'timeout',
        'performance',
        'load time',
      ],
      'User Experience': [
        'ui',
        'interface',
        'button',
        'layout',
        'design',
        'usable',
        'intuitive',
        'confusing',
      ],
      Onboarding: [
        'onboarding',
        'setup',
        'getting started',
        'tutorial',
        'first time',
        'initial',
      ],
      Integration: [
        'api',
        'integration',
        'connect',
        'webhook',
        'third party',
        'plugin',
        'extension',
      ],
      Documentation: [
        'docs',
        'documentation',
        'guide',
        'help',
        'tutorial',
        'example',
        'readme',
      ],
      Support: [
        'support',
        'help',
        'contact',
        'email',
        'chat',
        'response time',
        'ticket',
      ],
      Analytics: [
        'analytics',
        'metrics',
        'reporting',
        'dashboard',
        'track',
        'data',
        'insights',
      ],
      Security: [
        'security',
        'encrypt',
        'password',
        'safe',
        'secure',
        'breach',
        'vulnerability',
      ],
    };

    for (const [theme, keywords] of Object.entries(themeKeywords)) {
      if (keywords.some((kw) => lowerSentence.includes(kw))) {
        return theme;
      }
    }

    return null;
  }

  /**
   * Generate description for a theme.
   */
  private generateThemeDescription(themeName: string): string {
    const descriptions: Record<string, string> = {
      Authentication: 'User authentication, login, and account security',
      'Billing & Pricing':
        'Pricing, payment processing, and subscription management',
      Performance: 'Application speed, load times, and system efficiency',
      'User Experience': 'UI/UX design, usability, and interface intuitiveness',
      Onboarding: 'User onboarding, setup, and getting started experience',
      Integration: 'API, integrations, and third-party connections',
      Documentation: 'Docs, guides, help resources, and tutorials',
      Support: 'Customer support, help channels, and responsiveness',
      Analytics: 'Analytics, reporting, metrics, and data insights',
      Security: 'Security, encryption, and data protection',
    };

    return (
      descriptions[themeName] || `${themeName} related feedback and insights`
    );
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

  async computeConfidence(input: AgentInput): Promise<number> {
    let confidence = 0.75;
    if (input.content.length > 1000) confidence += 0.15;
    return Math.min(confidence, 1.0);
  }
}

export const themeAgent = new ThemeAgent();
