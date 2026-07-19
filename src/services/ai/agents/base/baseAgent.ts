/**
 * Base Agent abstract class.
 * Provides common functionality for all agent implementations.
 * All agents extend this class and implement the IAgent interface.
 */

import { z } from 'zod';
import {
  IAgent,
  AgentInput,
  AgentExecutionResult,
  AgentCategory,
} from '@/types/ai/agent';

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
        details: { agentId: this.id },
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

      // Execute agent logic
      auditTrail.push({
        timestamp: new Date(),
        event: 'agent_execution_start',
      });

      const output = await this.executeAgent(input);

      auditTrail.push({
        timestamp: new Date(),
        event: 'agent_execution_complete',
        details: {
          resultType: output.metadata?.resultType || 'unknown',
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
   * Execute the agent logic. Implemented by subclasses.
   */
  protected abstract executeAgent(
    input: AgentInput,
  ): Promise<{ result: unknown; structured?: Record<string, unknown> }>;

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

    if (input.context && input.context.chunks && input.context.chunks.length > 0) {
      confidence += 0.2;
    }

    if (input.metadata) {
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
        sources: [],
      },
    };
  }

  /**
   * Helper to log events to audit trail in subclasses.
   */
  protected createAuditEvent(event: string, details?: Record<string, unknown>) {
    return {
      timestamp: new Date(),
      event,
      details,
    };
  }
}
