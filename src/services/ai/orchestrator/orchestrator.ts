/**
 * Multi-Agent Orchestrator for DiscoveryOS.
 * Executes the 10-agent pipeline sequentially.
 * Manages state, error handling, and monitoring.
 */

import { AgentInput, AgentExecutionResult } from '@/types/ai/agent';
import { agentRegistry } from '../agents';

/**
 * Workflow pipeline configuration.
 */
export interface PipelineConfig {
  name: string;
  description: string;
  agents: string[]; // Agent IDs in execution order
  passOutputToNext: boolean; // Whether to pass previous output as context
}

/**
 * Pipeline execution context.
 */
export interface PipelineContext {
  pipelineId: string;
  workflowId: string;
  startedAt: Date;
  completedAt?: Date;
  results: AgentExecutionResult[];
  errors: Array<{ agentId: string; error: string; timestamp: Date }>;
  totalExecutionTime: number;
}

/**
 * Standard 10-agent pipeline configuration.
 */
export const STANDARD_PIPELINE_CONFIG: PipelineConfig = {
  name: 'Multi-Agent Intelligence Pipeline',
  description: 'Sequential execution of 10 specialized agents for comprehensive research analysis',
  agents: [
    'collector-agent',
    'insight-agent',
    'theme-agent',
    'persona-agent',
    'sentiment-agent',
    'frequency-agent',
    'impact-agent',
    'opportunity-agent',
    'prioritization-agent',
    'prd-agent',
  ],
  passOutputToNext: true,
};

/**
 * Multi-Agent Orchestrator: Executes the 10-agent pipeline.
 */
export class MultiAgentOrchestrator {
  private pipelineConfig: PipelineConfig;

  /**
   * Initialize with pipeline configuration.
   */
  constructor(
    pipelineConfig: PipelineConfig = STANDARD_PIPELINE_CONFIG,
  ) {
    this.pipelineConfig = pipelineConfig;
  }

  /**
   * Execute the complete pipeline.
   * Runs agents sequentially, passing output to next agent as context.
   */
  async executePipeline(
    input: AgentInput,
    workflowId: string,
  ): Promise<PipelineContext> {
    const pipelineId = `pipeline-${Date.now()}`;
    const context: PipelineContext = {
      pipelineId,
      workflowId,
      startedAt: new Date(),
      results: [],
      errors: [],
      totalExecutionTime: 0,
    };

    const startTime = Date.now();

    try {
      // Execute agents sequentially
      let currentInput: AgentInput = input;

      for (const agentId of this.pipelineConfig.agents) {
        try {
          const agent = agentRegistry.getAgent(agentId);
          if (!agent) {
            throw new Error(`Agent not found: ${agentId}`);
          }

          // Create input for this agent
          const agentInput: AgentInput = {
            ...currentInput,
            requestId: `${pipelineId}-${agentId}-${Date.now()}`,
          };

          // If passing output to next, add previous results to context
          if (
            this.pipelineConfig.passOutputToNext &&
            context.results.length > 0
          ) {
            const lastResult = context.results[context.results.length - 1];
            if (lastResult.output?.result) {
              agentInput.context = {
                ...agentInput.context,
                previousAgentOutput: lastResult.output.result,
                pipelineResults: context.results.map((r) => ({
                  agent: r.agentId,
                  status: r.status,
                  confidence: r.confidenceScore,
                })),
              };
            }
          }

          // Execute agent
          const result = await agent.execute(agentInput);
          context.results.push(result);

          // Update current input for next agent
          if (this.pipelineConfig.passOutputToNext && result.output?.result) {
            currentInput = {
              ...currentInput,
              content:
                typeof result.output.result === 'string'
                  ? result.output.result
                  : JSON.stringify(result.output.result),
            };
          }

          // Log agent completion
          console.log(
            `✓ ${agent.name} completed (confidence: ${(result.confidenceScore * 100).toFixed(1)}%, time: ${result.executionTimeMs}ms)`,
          );
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          context.errors.push({
            agentId,
            error: errorMessage,
            timestamp: new Date(),
          });

          console.error(`✗ Agent ${agentId} failed:`, errorMessage);

          // Continue with next agent instead of failing entire pipeline
          // This allows partial results even if one agent fails
        }
      }
    } finally {
      const endTime = Date.now();
      context.completedAt = new Date();
      context.totalExecutionTime = endTime - startTime;
    }

    return context;
  }

  /**
   * Execute pipeline with error recovery.
   * Retries failed agents up to maxRetries.
   */
  async executePipelineWithRetry(
    input: AgentInput,
    workflowId: string,
    maxRetries: number = 1,
  ): Promise<PipelineContext> {
    let lastContext: PipelineContext | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        lastContext = await this.executePipeline(input, workflowId);

        // If successful (no errors or all agents completed), return
        if (lastContext.errors.length === 0) {
          return lastContext;
        }

        // If we have results from most agents, consider it a success
        const agentCount = this.pipelineConfig.agents.length;
        if (
          lastContext.results.length / agentCount >= 0.8
        ) {
          console.warn(
            `Pipeline partially successful (${lastContext.results.length}/${agentCount} agents)`,
          );
          return lastContext;
        }

        if (attempt < maxRetries) {
          console.log(`Pipeline execution attempt ${attempt + 1} failed, retrying...`);
        }
      } catch (error) {
        console.error(
          `Pipeline execution attempt ${attempt + 1} error:`,
          error,
        );
      }
    }

    return (
      lastContext || {
        pipelineId: `pipeline-${Date.now()}`,
        workflowId,
        startedAt: new Date(),
        results: [],
        errors: [
          {
            agentId: 'orchestrator',
            error: 'Pipeline execution failed after retries',
            timestamp: new Date(),
          },
        ],
        totalExecutionTime: 0,
      }
    );
  }

  /**
   * Get pipeline configuration.
   */
  getPipelineConfig(): PipelineConfig {
    return this.pipelineConfig;
  }

  /**
   * Get list of agents in pipeline.
   */
  getPipelineAgents(): string[] {
    return this.pipelineConfig.agents;
  }

  /**
   * Update pipeline configuration.
   */
  updatePipelineConfig(config: PipelineConfig): void {
    this.pipelineConfig = config;
  }
}

/**
 * Export singleton orchestrator with standard pipeline.
 */
export const multiAgentOrchestrator = new MultiAgentOrchestrator();

/**
 * Utility to create orchestrator with custom pipeline.
 */
export function createOrchestrator(
  config?: PipelineConfig,
): MultiAgentOrchestrator {
  return new MultiAgentOrchestrator(config);
}
