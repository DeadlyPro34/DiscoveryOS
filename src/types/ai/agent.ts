/**
 * Agent types for DiscoveryOS AI Framework.
 * Defines agent interface, execution models, and result structures.
 */

import { z } from 'zod';

/**
 * Agent category for organization and discovery.
 */
export type AgentCategory =
  | 'data-collection'
  | 'analysis'
  | 'insight'
  | 'generation'
  | 'validation';

/**
 * Input to an agent execution.
 */
export interface AgentInput {
  /** Unique request ID */
  requestId: string;

  /** Data to process */
  content: string;

  /** Optional context from retrieval system */
  context?: {
    chunks: Array<{
      id: string;
      content: string;
      similarity: number;
    }>;
    totalMatches: number;
  };

  /** Agent-specific parameters */
  parameters?: Record<string, unknown>;

  /** Metadata about the request */
  metadata?: Record<string, unknown>;
}

/**
 * Output from an agent execution.
 */
export interface AgentOutput {
  /** Result data (agent-specific) */
  result: unknown;

  /** Structured data if applicable */
  structured?: Record<string, unknown>;

  /** Metadata about the result */
  metadata?: {
    resultType: string;
    confidence?: number;
    sources?: string[];
  };
}

/**
 * Complete agent execution result with metadata.
 */
export interface AgentExecutionResult {
  /** Execution request ID */
  requestId: string;

  /** Agent that executed */
  agentName: string;

  /** Agent ID */
  agentId: string;

  /** Execution status */
  status: 'success' | 'partial' | 'failed';

  /** Input provided to agent */
  input: AgentInput;

  /** Output from agent */
  output?: AgentOutput;

  /** Error message if failed */
  error?: string;

  /** Execution time in milliseconds */
  executionTimeMs: number;

  /** Confidence score (0-1) */
  confidenceScore: number;

  /** When execution started */
  startedAt: Date;

  /** When execution completed */
  completedAt: Date;

  /** Processing tokens used */
  tokensUsed?: number;

  /** Audit trail */
  auditTrail: Array<{
    timestamp: Date;
    event: string;
    details?: Record<string, unknown>;
  }>;
}

/**
 * Agent interface that all agents must implement.
 */
export interface IAgent {
  /** Unique agent identifier */
  id: string;

  /** Display name */
  name: string;

  /** Human-readable description */
  description: string;

  /** Agent category */
  category: AgentCategory;

  /** Icon/emoji identifier */
  icon: string;

  /** Zod schema for validating input */
  inputSchema: z.ZodSchema;

  /** Zod schema for output structure */
  outputSchema: z.ZodSchema;

  /** Version of the agent */
  version: string;

  /** Execute the agent with given input */
  execute(input: AgentInput): Promise<AgentExecutionResult>;

  /** Validate input against schema */
  validate(input: unknown): Promise<boolean>;

  /** Get estimated confidence for given input */
  computeConfidence(input: AgentInput): Promise<number>;
}

/**
 * Agent metadata for registry and discovery.
 */
export interface AgentMetadata {
  /** Agent ID */
  id: string;

  /** Agent name */
  name: string;

  /** Agent description */
  description: string;

  /** Category */
  category: AgentCategory;

  /** Icon */
  icon: string;

  /** Version */
  version: string;

  /** Input schema as JSON schema */
  inputSchema: unknown;

  /** Output schema as JSON schema */
  outputSchema: unknown;

  /** Whether agent is available */
  available: boolean;

  /** Registration timestamp */
  registeredAt: Date;
}
