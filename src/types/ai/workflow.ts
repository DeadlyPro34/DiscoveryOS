/**
 * Workflow and pipeline type definitions.
 */

import { AgentExecutionResult, AgentCategory } from './agent';

/**
 * Workflow execution status.
 */
export type WorkflowStatus = 'idle' | 'running' | 'completed' | 'failed' | 'paused';

/**
 * Workflow results.
 */
export interface WorkflowResults {
  workflowId: string;
  status: WorkflowStatus;
  pipelineResults: AgentExecutionResult[];
  startedAt: Date;
  completedAt?: Date;
  duration?: number;
  summary: {
    totalAgents: number;
    completedAgents: number;
    successCount: number;
    failureCount: number;
    averageConfidence: number;
  };
  insights: {
    topThemes: Array<{ theme: string; strength: number }>;
    topPersonas: Array<{ persona: string; mentions: number }>;
    topOpportunities: Array<{ opportunity: string; impact: number }>;
    keyFindings: string[];
  };
  errors: Array<{
    agentId: string;
    message: string;
    recoverable: boolean;
  }>;
}

/**
 * Workflow configuration.
 */
export interface WorkflowConfig {
  name: string;
  description?: string;
  pipelineAgents: string[];
  maxDuration: number;
  errorHandling: 'fail-fast' | 'continue' | 'retry';
  parallelization: boolean;
  caching: boolean;
}

/**
 * Pipeline execution stats.
 */
export interface PipelineStats {
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageExecutionTime: number;
  agentStats: Record<
    string,
    {
      calls: number;
      successes: number;
      failures: number;
      averageTime: number;
      averageConfidence: number;
    }
  >;
  topErrors: Array<{
    agentId: string;
    error: string;
    count: number;
  }>;
}

/**
 * Workflow progress tracking.
 */
export interface WorkflowProgress {
  workflowId: string;
  currentAgentIndex: number;
  totalAgents: number;
  percentComplete: number;
  currentAgent?: {
    id: string;
    name: string;
    startedAt: Date;
    estimatedRemainingMs: number;
  };
  completedAgents: AgentExecutionResult[];
  failedAgents: Array<{ agentId: string; error: string }>;
}
