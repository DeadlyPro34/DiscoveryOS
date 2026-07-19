/**
 * Hooks for workflow execution and management.
 */

import { useCallback, useState, useEffect } from 'react';
import { useWorkflowResults, WorkflowExecution } from '@/lib/stores';
import { multiAgentOrchestrator, PipelineContext } from '@/services/ai/orchestrator';
import { AgentInput } from '@/types/ai/agent';

/**
 * Hook for executing workflows.
 */
export function useWorkflowExecution() {
  const store = useWorkflowResults();
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const executeWorkflow = useCallback(
    async (input: AgentInput) => {
      setIsExecuting(true);
      setProgress(0);
      setError(null);

      try {
        const workflowId = `workflow-${Date.now()}`;
        const startTime = Date.now();

        // Execute pipeline
        const pipelineContext = await multiAgentOrchestrator.executePipeline(
          input,
          workflowId,
        );

        setProgress(100);

        // Record execution
        const execution: WorkflowExecution = {
          workflowId,
          pipelineContext,
          input: {
            content: input.content,
            metadata: input.metadata,
          },
          createdAt: new Date(startTime),
          completedAt: new Date(),
        };

        store.addExecution(execution);
        store.setCurrentExecution(execution);

        return execution;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
        throw err;
      } finally {
        setIsExecuting(false);
      }
    },
    [store],
  );

  const resetState = useCallback(() => {
    setIsExecuting(false);
    setProgress(0);
    setError(null);
  }, []);

  return {
    executeWorkflow,
    isExecuting,
    progress,
    error,
    resetState,
  };
}

/**
 * Hook for accessing workflow results.
 */
export function useWorkflowResults_Hook() {
  const store = useWorkflowResults();

  return {
    currentExecution: store.currentExecution,
    recentExecutions: store.getRecentExecutions(10),
    totalWorkflows: store.totalWorkflows,
    successCount: store.successCount,
    failureCount: store.failureCount,
    successRate:
      store.totalWorkflows > 0
        ? store.successCount / store.totalWorkflows
        : 0,
  };
}

/**
 * Hook for workflow execution history.
 */
export function useExecutionHistory() {
  const store = useWorkflowResults();

  const getExecutionHistory = useCallback(
    (limit = 50): WorkflowExecution[] => {
      return store
        .getRecentExecutions(limit)
        .sort((a, b) => {
          const timeA = new Date(a.createdAt || 0).getTime();
          const timeB = new Date(b.createdAt || 0).getTime();
          return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
        });
    },
    [store],
  );

  const getExecutionStats = useCallback(() => {
    const executions = store.executions;

    const totalTime = executions.reduce(
      (sum, e) => sum + e.pipelineContext.totalExecutionTime,
      0,
    );
    const avgTime =
      executions.length > 0 ? totalTime / executions.length : 0;

    const agentStats: Record<string, { count: number; time: number }> = {};
    executions.forEach((e) => {
      e.pipelineContext.results.forEach((result) => {
        if (!agentStats[result.agentId]) {
          agentStats[result.agentId] = { count: 0, time: 0 };
        }
        agentStats[result.agentId].count++;
        agentStats[result.agentId].time += result.executionTimeMs;
      });
    });

    return {
      totalExecutions: executions.length,
      averageExecutionTime: avgTime,
      agentStats,
      recentError: executions
        .filter((e) => e.pipelineContext.errors.length > 0)
        .slice(-1)[0],
    };
  }, [store]);

  return {
    history: getExecutionHistory(),
    stats: getExecutionStats(),
    clearHistory: store.clearHistory,
  };
}
