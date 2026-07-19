/**
 * Base Agent abstract class.
 * Provides common functionality for all agent implementations.
 * Supports both mock (keyword-based) and real (LLM-powered) execution.
 */

import { z } from 'zod';
import {
  IAgent,
  AgentInput,
  AgentExecutionResult,
  AgentCategory,
} from '@/types/ai/agent';

/**
 * LLM Provider interface for agent execution.
 * Agents can optionally use an LLM provider for real AI processing.
 */
export interface AgentLLMProvider {
  generateJSON(
    systemPrompt: string,
    userPrompt: string,
  ): Promise<Record<string, unknown>>;
}

/**
 * Abstract base class for all agents.
 * Provides common execution flow, validation, error handling, and audit trails.
 */
export abstract class BaseAgent implements IAgent {
  abstract id: string;
  abstract name: string;
  abstract description: string;
  abstract category: AgentCategory;
  abstract icon: string;
  abstract inputSchema: z.ZodSchema;
  abstract outputSchema: z.ZodSchema;
  abstract version: string;

  /** Optional LLM provider for real AI execution */
  protected llmProvider: AgentLLMProvider | null = null;

  /**
   * Set the LLM provider for this agent.
   * When set, agents will use real AI instead of mock keyword matching.
   */
  setLLMProvider(provider: AgentLLMProvider): void {
    this.llmProvider = provider;
  }

  /**
   * Check if this agent has an LLM provider configured.
   */
  hasLLMProvider(): boolean {
    return this.llmProvider !== null;
  }

  /**
   * Execute the agent with given input.
   * Implements common flow: validation -> execution -> confidence -> audit trail.
   */
  async execute(input: AgentInput): Promise<AgentExecutionResult> {
    const startTime = Date.now();
    const auditTrail: Array<{
      timestamp: Date;
      event: string;
      details?: Record<string, unknown>;
    }> = [];

    try {
      // Record execution start
      auditTrail.push({
        timestamp: new Date(),
        event: 'execution_started',
        details: { agentId: this.id, useLLM: this.hasLLMProvider() },
      });

      // Validate input
      auditTrail.push({
        timestamp: new Date(),
        event: 'input_validation_start',
      });

      const isValid = await this.validate(input);
      if (!isValid) {
        throw new Error('Input validation failed');
      }

      auditTrail.push({
        timestamp: new Date(),
        event: 'input_validation_complete',
        details: { valid: true },
      });

      // Execute agent logic (LLM or mock)
      auditTrail.push({
        timestamp: new Date(),
        event: 'agent_execution_start',
        details: { mode: this.hasLLMProvider() ? 'llm' : 'mock' },
      });

      let output;
      if (this.llmProvider) {
        try {
          output = await this.executeWithLLM(input, this.llmProvider);
        } catch (llmError) {
          // Fallback to mock if LLM fails
          console.warn(
            `${this.name}: LLM execution failed, falling back to mock:`,
            llmError instanceof Error ? llmError.message : String(llmError),
          );
          auditTrail.push({
            timestamp: new Date(),
            event: 'llm_fallback_to_mock',
            details: {
              error:
                llmError instanceof Error
                  ? llmError.message
                  : String(llmError),
            },
          });
          output = await this.executeAgent(input);
        }
      } else {
        output = await this.executeAgent(input);
      }

      auditTrail.push({
        timestamp: new Date(),
        event: 'agent_execution_complete',
        details: {
          resultType: output.structured ? 'structured' : 'unstructured',
        },
      });

      // Compute confidence
      const confidenceScore = await this.computeConfidence(input);

      auditTrail.push({
        timestamp: new Date(),
        event: 'confidence_computed',
        details: { score: confidenceScore },
      });

      // Record completion
      const endTime = Date.now();
      auditTrail.push({
        timestamp: new Date(),
        event: 'execution_completed',
        details: { durationMs: endTime - startTime },
      });

      return {
        requestId: input.requestId,
        agentName: this.name,
        agentId: this.id,
        status: 'success',
        input,
        output,
        executionTimeMs: endTime - startTime,
        confidenceScore,
        startedAt: new Date(startTime),
        completedAt: new Date(endTime),
        auditTrail,
      };
    } catch (error) {
      const endTime = Date.now();
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      auditTrail.push({
        timestamp: new Date(),
        event: 'execution_failed',
        details: { error: errorMessage },
      });

      return {
        requestId: input.requestId,
        agentName: this.name,
        agentId: this.id,
        status: 'failed',
        input,
        error: errorMessage,
        executionTimeMs: endTime - startTime,
        confidenceScore: 0,
        startedAt: new Date(startTime),
        completedAt: new Date(endTime),
        auditTrail,
      };
    }
  }

  /**
   * Execute the agent logic using mock/keyword-based approach.
   * Implemented by subclasses. This is the fallback when no LLM is available.
   */
  protected abstract executeAgent(
    input: AgentInput,
  ): Promise<{ result: unknown; structured?: Record<string, unknown> }>;

  /**
   * Execute the agent logic using a real LLM provider.
   * Override in subclasses to provide LLM-powered execution.
   * Default implementation calls the mock executeAgent as fallback.
   */
  protected async executeWithLLM(
    input: AgentInput,
    provider: AgentLLMProvider,
  ): Promise<{
    result: unknown;
    structured?: Record<string, unknown>;
    metadata?: { resultType: string; confidence?: number; sources?: string[] };
  }> {
    // Default: get the agent's prompt and call the LLM
    const prompt = this.getAgentPrompt();
    if (!prompt) {
      // No prompt defined, fall back to mock
      return this.executeAgent(input);
    }

    const llmResult = await provider.generateJSON(
      prompt.systemPrompt,
      `${prompt.userPromptPrefix}\n\nContent to analyze:\n${input.content}`,
    );

    return this.createOutput(llmResult, llmResult as Record<string, unknown>);
  }

  /**
   * Get the prompt template for this agent.
   * Override in subclasses to provide specific prompts.
   */
  protected getAgentPrompt(): {
    systemPrompt: string;
    userPromptPrefix: string;
  } | null {
    return null;
  }

  /**
   * Validate input against the input schema.
   */
  async validate(input: unknown): Promise<boolean> {
    try {
      if (input instanceof Object && 'content' in input) {
        this.inputSchema.parse(input);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Compute confidence score for the input.
   * Override in subclasses for specific logic.
   */
  async computeConfidence(input: AgentInput): Promise<number> {
    // Default: check if we have content and context
    let confidence = 0.5; // Base confidence

    if (input.content && input.content.length > 0) {
      confidence += 0.2;
    }

    if (
      input.context &&
      input.context.chunks &&
      input.context.chunks.length > 0
    ) {
      confidence += 0.2;
    }

    if (input.metadata) {
      confidence += 0.1;
    }

    // Higher confidence when using LLM
    if (this.hasLLMProvider()) {
      confidence += 0.1;
    }

    return Math.min(confidence, 1.0);
  }

  /**
   * Helper to create a structured output object.
   */
  protected createOutput(
    result: unknown,
    structured?: Record<string, unknown>,
  ) {
    return {
      result,
      structured,
      metadata: {
        resultType: 'agent-output',
        confidence: 0.8,
        sources: [] as string[],
      },
    };
  }

  /**
   * Helper to log events to audit trail in subclasses.
   */
  protected createAuditEvent(
    event: string,
    details?: Record<string, unknown>,
  ) {
    return {
      timestamp: new Date(),
      event,
      details,
    };
  }
}
