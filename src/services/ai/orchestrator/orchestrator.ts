/**
 * Multi-Agent Orchestrator for DiscoveryOS V2.
 * Executes the pipeline in parallel stages based on a DAG structure.
 * Manages state, error handling, and monitoring.
 */

import { AgentInput, AgentExecutionResult } from '@/types/ai/agent';
import { agentRegistry } from '../agents';
import { SupabaseService } from '../database/supabaseClient';

/**
 * Workflow pipeline configuration.
 */
export interface PipelineConfig {
  name: string;
  description: string;
  stages: string[][]; // Agent IDs grouped by parallel execution stages
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
 * Standard V2 Analysis Pipeline.
 * Stops before PRD generation to allow for Human Review.
 */
export const STANDARD_PIPELINE_CONFIG: PipelineConfig = {
  name: 'Multi-Agent Intelligence Pipeline (V2)',
  description: 'Parallel execution of specialized agents for comprehensive research analysis',
  stages: [
    ['collector-agent'],
    ['cleaning-agent'],
    ['insight-agent', 'theme-agent', 'persona-agent', 'sentiment-agent', 'frequency-agent'],
    ['impact-agent'],
    ['opportunity-agent'],
    ['prioritization-agent'],
  ],
  passOutputToNext: true,
};

/**
 * Generation Pipeline.
 * Executes after Human Review to generate final artifacts.
 */
export const GENERATION_PIPELINE_CONFIG: PipelineConfig = {
  name: 'Multi-Agent Generation Pipeline',
  description: 'Generates PRDs and Roadmaps after human review',
  stages: [
    ['prd-agent']
  ],
  passOutputToNext: true,
};

/**
 * Multi-Agent Orchestrator: Executes the pipeline in stages.
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
   * Runs stages sequentially, but agents within a stage in parallel.
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
      let currentInput: AgentInput = input;
      let previousStageResults: AgentExecutionResult[] = [];

      for (const stage of this.pipelineConfig.stages) {
        const stagePromises = stage.map(async (agentId) => {
          try {
            const agent = agentRegistry.getAgent(agentId);
            if (!agent) {
              throw new Error(`Agent not found: ${agentId}`);
            }

            const agentInput: AgentInput = {
              ...currentInput,
              requestId: `${pipelineId}-${agentId}-${Date.now()}`,
            };

            // If passing output to next, add previous stage results to context
            if (this.pipelineConfig.passOutputToNext && previousStageResults.length > 0) {
              const previousOutputs = previousStageResults
                .map(r => r.output?.result)
                .filter(Boolean);
              
              if (previousOutputs.length > 0) {
                agentInput.context = {
                  ...agentInput.context,
                  // @ts-ignore
                  previousStageOutputs: previousOutputs,
                  pipelineResults: context.results.map((r) => ({
                    agent: r.agentId,
                    status: r.status,
                    confidence: r.confidenceScore,
                  })),
                };
              }
            }

            const result = await agent.execute(agentInput);
            
            // Persist output to database based on agent type
            await this.persistAgentOutput(agentId, result, currentInput.metadata);

            console.log(
              `✓ ${agent.name} completed (confidence: ${(result.confidenceScore * 100).toFixed(1)}%, time: ${result.executionTimeMs}ms)`,
            );
            return result;
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            context.errors.push({
              agentId,
              error: errorMessage,
              timestamp: new Date(),
            });

            console.error(`✗ Agent ${agentId} failed:`, errorMessage);
            return null; // Return null on failure so Promise.all doesn't reject
          }
        });

        // Execute all agents in the current stage in parallel
        const results = await Promise.all(stagePromises);
        
        // Filter out failures and add to context
        const successfulResults = results.filter((r): r is AgentExecutionResult => r !== null);
        context.results.push(...successfulResults);
        
        // Prepare input for the next stage
        previousStageResults = successfulResults;
        
        if (this.pipelineConfig.passOutputToNext && previousStageResults.length > 0) {
          // Merge all structured outputs from the stage into the currentInput content
          const mergedOutputs = previousStageResults
            .map(r => typeof r.output?.result === 'string' ? r.output.result : JSON.stringify(r.output?.result))
            .join('\n\n--- [Merged Stage Context] ---\n\n');
            
          currentInput = {
            ...currentInput,
            content: mergedOutputs || currentInput.content, // Fallback to previous if empty
          };
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
   * Persists agent outputs to Supabase DB based on agent type
   */
  private async persistAgentOutput(agentId: string, result: AgentExecutionResult, metadata?: Record<string, unknown>) {
    if (!metadata?.projectId || !metadata?.workspaceId) return;
    
    try {
      // @ts-ignore - SupabaseService will safely fail if not initialized
      const db = SupabaseService.getInstance();
      const output = result.output?.structured || result.output?.result;
      if (!output) return;

      const baseRecord = {
        project_id: metadata.projectId as string,
        workspace_id: metadata.workspaceId as string,
      };

      switch (agentId) {
        case 'theme-agent':
          // @ts-ignore
          if (Array.isArray(output.themes)) {
            // @ts-ignore
            for (const theme of output.themes) {
              await db.saveTheme({ ...baseRecord, name: theme, description: 'Discovered theme' });
            }
          }
          break;
        case 'persona-agent':
          // @ts-ignore
          if (Array.isArray(output.personas)) {
            // @ts-ignore
            for (const persona of output.personas) {
              await db.savePersona({ ...baseRecord, role: persona, description: 'Discovered persona' });
            }
          }
          break;
        case 'insight-agent':
          await db.saveInsight({
            ...baseRecord,
            type: 'pain_point',
            // @ts-ignore
            title: typeof output === 'string' ? output.substring(0, 50) : 'Discovered Insight',
            description: typeof output === 'string' ? output : JSON.stringify(output),
            confidence_score: result.confidenceScore
          });
          break;
        case 'sentiment-agent':
          // @ts-ignore
          if (output.sentiment) {
            // @ts-ignore
            await db.saveInsight({ ...baseRecord, type: 'sentiment', title: output.sentiment, description: JSON.stringify(output) });
          }
          break;
        case 'prd-agent':
          await db.saveArtifact({
            ...baseRecord,
            type: 'prd',
            title: 'Generated PRD',
            content: typeof output === 'string' ? output : JSON.stringify(output),
            status: 'draft'
          });
          break;
      }
    } catch (err) {
      console.warn(`[Orchestrator] Persistence failed for ${agentId}. (Is Supabase connected?)`);
    }
  }

  /**
   * Execute generation phase (e.g., PRD, Roadmap) specifically for V2 workflow.
   */
  async executeGenerationPhase(
    reviewedInput: AgentInput,
    workflowId: string,
  ): Promise<PipelineContext> {
    const originalConfig = this.pipelineConfig;
    this.pipelineConfig = GENERATION_PIPELINE_CONFIG;
    
    try {
      return await this.executePipeline(reviewedInput, workflowId);
    } finally {
      this.pipelineConfig = originalConfig;
    }
  }

  /**
   * Execute pipeline with error recovery.
   * Retries failed stages up to maxRetries.
   */
  async executePipelineWithRetry(
    input: AgentInput,
    workflowId: string,
    maxRetries: number = 1,
  ): Promise<PipelineContext> {
    let lastContext: PipelineContext | null = null;
    const totalAgents = this.pipelineConfig.stages.flat().length;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        lastContext = await this.executePipeline(input, workflowId);

        if (lastContext.errors.length === 0) {
          return lastContext;
        }

        if (lastContext.results.length / totalAgents >= 0.8) {
          console.warn(
            `Pipeline partially successful (${lastContext.results.length}/${totalAgents} agents)`,
          );
          return lastContext;
        }

        if (attempt < maxRetries) {
          console.log(`Pipeline execution attempt ${attempt + 1} failed, retrying...`);
        }
      } catch (error) {
        console.error(`Pipeline execution attempt ${attempt + 1} error:`, error);
      }
    }

    return (
      lastContext || {
        pipelineId: `pipeline-${Date.now()}`,
        workflowId,
        startedAt: new Date(),
        results: [],
        errors: [{ agentId: 'orchestrator', error: 'Pipeline execution failed', timestamp: new Date() }],
        totalExecutionTime: 0,
      }
    );
  }

  getPipelineConfig(): PipelineConfig {
    return this.pipelineConfig;
  }

  getPipelineAgents(): string[] {
    return this.pipelineConfig.stages.flat();
  }

  updatePipelineConfig(config: PipelineConfig): void {
    this.pipelineConfig = config;
  }
}

export const multiAgentOrchestrator = new MultiAgentOrchestrator();

export function createOrchestrator(
  config?: PipelineConfig,
): MultiAgentOrchestrator {
  return new MultiAgentOrchestrator(config);
}
