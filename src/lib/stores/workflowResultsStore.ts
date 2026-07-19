/**
 * Workflow Results Store - Zustand state management for workflow outputs.
 * Tracks workflow execution history and results.
 */

import { create } from 'zustand';
import { PipelineContext } from '@/services/ai/orchestrator';

/**
 * Workflow execution record.
 */
export interface WorkflowExecution {
  workflowId: string;
  pipelineContext: PipelineContext;
  input: {
    content: string;
    metadata?: Record<string, unknown>;
  };
  createdAt: Date;
  completedAt: Date;
}

/**
 * Workflow results state.
 */
export interface WorkflowResultsState {
  // Executions
  executions: WorkflowExecution[];
  currentExecution?: WorkflowExecution;

  // Filters
  filters: {
    status?: 'running' | 'completed' | 'failed';
    dateRange?: { from: Date; to: Date };
  };

  // Statistics
  totalWorkflows: number;
  successCount: number;
  failureCount: number;

  // Actions
  addExecution: (execution: WorkflowExecution) => void;
  setCurrentExecution: (execution?: WorkflowExecution) => void;
  getExecution: (workflowId: string) => WorkflowExecution | undefined;
  getRecentExecutions: (limit?: number) => WorkflowExecution[];
  setFilter: (
    filter: keyof WorkflowResultsState['filters'],
    value: unknown,
  ) => void;
  clearHistory: () => void;
}

/**
 * Create workflow results store.
 */
export const useWorkflowResults = create<WorkflowResultsState>((set, get) => ({
  executions: [],
  filters: {},
  totalWorkflows: 0,
  successCount: 0,
  failureCount: 0,

  addExecution: (execution: WorkflowExecution) => {
    set((state) => {
      const isSuccess = execution.pipelineContext.errors.length === 0;
      return {
        executions: [...state.executions, execution].slice(-100), // Keep last 100
        totalWorkflows: state.totalWorkflows + 1,
        successCount: state.successCount + (isSuccess ? 1 : 0),
        failureCount: state.failureCount + (isSuccess ? 0 : 1),
      };
    });
  },

  setCurrentExecution: (execution?) => {
    set({ currentExecution: execution });
  },

  getExecution: (workflowId: string) => {
    return get().executions.find((e) => e.workflowId === workflowId);
  },

  getRecentExecutions: (limit = 10) => {
    return get()
      .executions
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  },

  setFilter: (filterKey, value) => {
    set((state) => ({
      filters: {
        ...state.filters,
        [filterKey]: value,
      },
    }));
  },

  clearHistory: () => {
    set({
      executions: [],
      filters: {},
      totalWorkflows: 0,
      successCount: 0,
      failureCount: 0,
    });
  },
}));
