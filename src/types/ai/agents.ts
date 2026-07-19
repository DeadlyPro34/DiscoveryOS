/**
 * Agent-specific type definitions.
 * Extended types for the multi-agent system.
 */

import { AgentCategory } from './agent';

/**
 * Agent execution phase.
 */
export type AgentPhase = 'validation' | 'execution' | 'confidence' | 'complete';

/**
 * Agent performance metrics.
 */
export interface AgentPerformance {
  executionTimeMs: number;
  confidenceScore: number;
  successRate: number;
  averageTimeMs: number;
  totalRuns: number;
  lastRun: Date;
}

/**
 * Agent pipeline stage.
 */
export interface PipelineStage {
  order: number;
  agentId: string;
  agentName: string;
  category: AgentCategory;
  estimatedTimeMs: number;
  isOptional: boolean;
  dependencies: string[]; // Agent IDs that must complete first
}

/**
 * Agent capability.
 */
export interface AgentCapability {
  name: string;
  description: string;
  inputs: string[];
  outputs: string[];
  version: string;
}

/**
 * Agent error with context.
 */
export interface AgentError {
  agentId: string;
  agentName: string;
  phase: AgentPhase;
  error: Error;
  context?: Record<string, unknown>;
  timestamp: Date;
  recoverable: boolean;
}

/**
 * Agent audit event.
 */
export interface AgentAuditEvent {
  timestamp: Date;
  agentId: string;
  event: string;
  level: 'info' | 'warn' | 'error';
  details?: Record<string, unknown>;
}

/**
 * Agent configuration.
 */
export interface AgentConfig {
  id: string;
  name: string;
  enabled: boolean;
  timeout: number;
  retryPolicy: {
    maxRetries: number;
    backoffMs: number;
  };
  logging: {
    enabled: boolean;
    level: 'debug' | 'info' | 'warn' | 'error';
  };
  limits: {
    maxInputSize: number;
    maxOutputSize: number;
  };
}
