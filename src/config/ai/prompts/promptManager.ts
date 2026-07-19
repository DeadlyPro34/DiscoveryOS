/**
 * Prompt manager for loading, rendering, and managing prompt templates.
 * Handles template substitution and provides a central registry for all prompts.
 */

import { PromptTemplate, RenderedPrompt, PromptVariable } from './promptTypes';

/**
 * Manages prompt templates and rendering.
 * Provides centralized access to all agent prompts.
 */
export class PromptManager {
  private templates: Map<string, PromptTemplate> = new Map();
  private agentPrompts: Map<string, PromptTemplate[]> = new Map();

  /**
   * Initialize the prompt manager with a set of templates.
   */
  constructor(templates: PromptTemplate[] = []) {
    templates.forEach((template) => {
      this.registerTemplate(template);
    });
  }

  /**
   * Register a new prompt template.
   */
  registerTemplate(template: PromptTemplate): void {
    this.templates.set(template.id, template);

    // Index by agent ID for quick lookup
    const agentTemplates = this.agentPrompts.get(template.agentId) || [];
    agentTemplates.push(template);
    this.agentPrompts.set(template.agentId, agentTemplates);
  }

  /**
   * Get a template by ID.
   */
  getTemplate(templateId: string): PromptTemplate | undefined {
    return this.templates.get(templateId);
  }

  /**
   * Get all templates for an agent.
   */
  getAgentTemplates(agentId: string): PromptTemplate[] {
    return this.agentPrompts.get(agentId) || [];
  }

  /**
   * Render a template with variables.
   * Performs variable substitution and returns a ready-to-use prompt.
   */
  renderTemplate(
    templateId: string,
    variables: Record<string, unknown>,
  ): RenderedPrompt {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    // Validate required variables
    const missingVars: string[] = [];
    template.variables.forEach((variable: PromptVariable) => {
      if (variable.required && !(variable.name in variables)) {
        if (variable.defaultValue === undefined) {
          missingVars.push(variable.name);
        }
      }
    });

    if (missingVars.length > 0) {
      throw new Error(
        `Missing required variables for template ${templateId}: ${missingVars.join(', ')}`,
      );
    }

    // Build substitution map with defaults
    const substitutedVariables: Record<string, unknown> = {};
    template.variables.forEach((variable: PromptVariable) => {
      substitutedVariables[variable.name] =
        variables[variable.name] ?? variable.defaultValue;
    });

    // Render system prompt
    const systemPrompt = this.substituteVariables(
      template.systemInstructions || '',
      substitutedVariables,
    );

    // Render user prompt
    const userPrompt = this.substituteVariables(
      template.template,
      substitutedVariables,
    );

    return {
      templateId,
      systemPrompt,
      userPrompt,
      substitutedVariables,
      renderedAt: new Date(),
    };
  }

  /**
   * Substitute variables in a template string.
   * Replaces {{variableName}} with actual values.
   */
  private substituteVariables(
    template: string,
    variables: Record<string, unknown>,
  ): string {
    let result = template;

    // Replace all {{variable}} patterns
    Object.entries(variables).forEach(([key, value]) => {
      const pattern = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      const replacement = this.formatValue(value);
      result = result.replace(pattern, replacement);
    });

    return result;
  }

  /**
   * Format a value for template substitution.
   */
  private formatValue(value: unknown): string {
    if (value === null || value === undefined) {
      return '';
    }

    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.formatValue(item)).join(', ');
    }

    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }

    return String(value);
  }

  /**
   * List all registered templates.
   */
  listTemplates(): PromptTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Clear all templates.
   */
  clearTemplates(): void {
    this.templates.clear();
    this.agentPrompts.clear();
  }
}

// Export singleton instance
export const promptManager = new PromptManager();
