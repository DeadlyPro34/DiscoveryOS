/**
 * Pipeline orchestration types for DiscoveryOS AI Framework.
 * Handles pipeline status, logging, and execution tracking.
 */

import { ProcessingStage } from './document';

/**
 * Job in the processing queue.
 */
export interface ProcessingJob {
  /** Unique job ID */
  id: string;

  /** Document being processed */
  documentId: string;

  /** Document name */
  documentName: string;

  /** Project ID */
  projectId: string;

  /** Workspace ID */
  workspaceId: string;

  /** Current job status */
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

  /** Current stage */
  currentStage: ProcessingStage;

  /** Completed stages */
  completedStages: ProcessingStage[];

  /** Remaining stages */
  remainingStages: ProcessingStage[];

  /** Progress percentage (0-100) */
  progress: number;

  /** When job was created */
  createdAt: Date;

  /** When job started processing */
  startedAt?: Date;

  /** When job completed */
  completedAt?: Date;

  /** Estimated completion time */
  estimatedCompletionTime?: Date;

  /** Error message if failed */
  error?: string;

  /** Total processing time in milliseconds */
  totalProcessingTimeMs?: number;

  /** Retry count */
  retryCount: number;

  /** Maximum retries allowed */
  maxRetries: number;

  /** Job result metadata */
  result?: {
    chunksCreated: number;
    embeddingsGenerated: number;
    tokensProcessed: number;
  };
}

/**
 * Event in the processing pipeline log.
 */
export interface PipelineEvent {
  /** Unique event ID */
  id: string;

  /** Job this event belongs to */
  jobId: string;

  /** Document ID */
  documentId: string;

  /** Event type */
  type:
    | 'stage-started'
    | 'stage-completed'
    | 'stage-failed'
    | 'error'
    | 'warning'
    | 'info'
    | 'metric';

  /** Processing stage at time of event */
  stage: ProcessingStage;

  /** Event message */
  message: string;

  /** Event severity */
  severity: 'debug' | 'info' | 'warning' | 'error';

  /** Event-specific data */
  data?: Record<string, unknown>;

  /** Duration of stage if applicable */
  durationMs?: number;

  /** When event occurred */
  timestamp: Date;
}

/**
 * Pipeline execution metrics.
 */
export interface PipelineMetrics {
  /** Total jobs processed */
  totalJobs: number;

  /** Successful completions */
  successfulJobs: number;

  /** Failed jobs */
  failedJobs: number;

  /** Average processing time */
  averageProcessingTimeMs: number;

  /** Median processing time */
  medianProcessingTimeMs: number;

  /** Fastest processing time */
  minProcessingTimeMs: number;

  /** Slowest processing time */
  maxProcessingTimeMs: number;

  /** Total documents processed */
  totalDocuments: number;

  /** Total chunks created */
  totalChunks: number;

  /** Total tokens processed */
  totalTokens: number;

  /** Success rate percentage */
  successRate: number;

  /** Average retry count */
  averageRetries: number;

  /** Calculation timestamp */
  calculatedAt: Date;
}

/**
 * Orchestration execution context.
 */
export interface OrchestrationContext {
  /** Execution ID */
  executionId: string;

  /** Execution status */
  status: 'running' | 'completed' | 'failed' | 'cancelled';

  /** Start time */
  startTime: Date;

  /** End time */
  endTime?: Date;

  /** Total execution time in milliseconds */
  totalTimeMs?: number;

  /** Agent execution order */
  executionPlan: string[];

  /** Agent results by ID */
  results: Record<string, unknown>;

  /** Errors encountered */
  errors: Array<{
    agentId: string;
    error: string;
    timestamp: Date;
  }>;

  /** Execution mode */
  mode: 'sequential' | 'parallel' | 'conditional';

  /** Context variables */
  variables: Record<string, unknown>;
}
