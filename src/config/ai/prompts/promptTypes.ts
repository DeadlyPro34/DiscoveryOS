/**
 * Prompt template types and interfaces for the AI agent system.
 * Defines the structure for prompt templates used across all agents.
 */

/**
 * Represents a prompt template with variables that can be substituted.
 */
export interface PromptTemplate {
  /** Unique identifier for the template */
  id: string;

  /** Human-readable name */
  name: string;

  /** Agent that uses this template */
  agentId: string;

  /** The prompt template with {{variable}} placeholders */
  template: string;

  /** Variables that can be substituted in the template */
  variables: PromptVariable[];

  /** Instructions for the LLM (system prompt) */
  systemInstructions?: string;

  /** Example inputs/outputs for few-shot learning */
  examples?: PromptExample[];

  /** Version of the prompt */
  version: string;

  /** When the template was created */
  createdAt: Date;

  /** When the template was last updated */
  updatedAt: Date;
}

/**
 * Represents a variable in a prompt template.
 */
export interface PromptVariable {
  /** Variable name (used as {{name}} in template) */
  name: string;

  /** Type of the variable */
  type: 'string' | 'number' | 'array' | 'object' | 'boolean';

  /** Description for documentation */
  description: string;

  /** Default value if not provided */
  defaultValue?: string | number | boolean | unknown;

  /** Whether the variable is required */
  required: boolean;
}

/**
 * Example input/output for few-shot learning.
 */
export interface PromptExample {
  /** Input example */
  input: Record<string, unknown>;

  /** Expected output example */
  output: Record<string, unknown>;

  /** Description of what this example demonstrates */
  description?: string;
}

/**
 * Rendered prompt ready for execution.
 */
export interface RenderedPrompt {
  /** Original template ID */
  templateId: string;

  /** Rendered system instructions */
  systemPrompt: string;

  /** Rendered user prompt */
  userPrompt: string;

  /** Variables that were substituted */
  substitutedVariables: Record<string, unknown>;

  /** Timestamp of rendering */
  renderedAt: Date;
}
