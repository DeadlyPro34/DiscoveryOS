/**
 * Agent Monitor Store - Zustand state management for agent monitoring.
 * Tracks real-time agent execution metrics and status.
 */

import { create } from 'zustand';
import { AgentExecutionResult } from '@/types/ai/agent';

/**
 * Agent execution metrics.
 */
export interface AgentMetrics {
  agentId: string;
  agentName: string;
  totalExecutions: number;
  successCount: number;
  failureCount: number;
  averageExecutionTime: number;
  averageConfidence: number;
  lastExecution?: Date;
  lastResult?: AgentExecutionResult;
}

/**
 * Agent monitor state.
 */
export interface AgentMonitorState {
  // Metrics
  metrics: Map<string, AgentMetrics>;
  allResults: AgentExecutionResult[];

  // Active executions
  activeAgents: Set<string>;
  currentExecution?: {
    agentId: string;
    startedAt: Date;
    progress: number;
  };

  // Filters
  filters: {
    agentId?: string;
    status?: 'success' | 'failed' | 'partial';
    timeRange?: { from: Date; to: Date };
  };

  // Statistics
  totalExecutions: number;
  totalSuccess: number;
  totalFailures: number;

  // Actions
  recordExecution: (result: AgentExecutionResult) => void;
  setActiveAgent: (agentId: string, isActive: boolean) => void;
  setCurrentExecution: (
    data?: { agentId: string; progress: number },
  ) => void;
  setFilter: (
    filter: keyof AgentMonitorState['filters'],
    value: unknown,
  ) => void;
  getMetrics: (agentId: string) => AgentMetrics | undefined;
  getAllMetrics: () => AgentMetrics[];
  clearHistory: () => void;
}

/**
 * Create agent monitor store.
 */
export const useAgentMonitor = create<AgentMonitorState>((set, get) => ({
  metrics: new Map(),
  allResults: [],
  activeAgents: new Set(),
  filters: {},
  totalExecutions: 0,
  totalSuccess: 0,
  totalFailures: 0,

  recordExecution: (result: AgentExecutionResult) => {
    set((state) => {
      const metrics = new Map(state.metrics);
      const agentMetrics =
        metrics.get(result.agentId) || {
          agentId: result.agentId,
          agentName: result.agentName,
          totalExecutions: 0,
          successCount: 0,
          failureCount: 0,
          averageExecutionTime: 0,
          averageConfidence: 0,
        };

      // Update metrics
      const totalExecutions = agentMetrics.totalExecutions + 1;
      const isSuccess = result.status === 'success';
      const successCount = agentMetrics.successCount + (isSuccess ? 1 : 0);
      const failureCount = agentMetrics.failureCount + (isSuccess ? 0 : 1);

      agentMetrics.totalExecutions = totalExecutions;
      agentMetrics.successCount = successCount;
      agentMetrics.failureCount = failureCount;
      agentMetrics.lastExecution = result.completedAt;
      agentMetrics.lastResult = result;

      // Calculate averages
      agentMetrics.averageExecutionTime =
        (agentMetrics.averageExecutionTime * (totalExecutions - 1) +
          result.executionTimeMs) /
        totalExecutions;
      agentMetrics.averageConfidence =
        (agentMetrics.averageConfidence * (totalExecutions - 1) +
          result.confidenceScore) /
        totalExecutions;

      metrics.set(result.agentId, agentMetrics);

      // Keep only recent results (last 1000)
      const allResults = [...state.allResults, result].slice(-1000);

      return {
        metrics,
        allResults,
        totalExecutions: state.totalExecutions + 1,
        totalSuccess: state.totalSuccess + (isSuccess ? 1 : 0),
        totalFailures: state.totalFailures + (isSuccess ? 0 : 1),
      };
    });
  },

  setActiveAgent: (agentId: string, isActive: boolean) => {
    set((state) => {
      const activeAgents = new Set(state.activeAgents);
      if (isActive) {
        activeAgents.add(agentId);
      } else {
        activeAgents.delete(agentId);
      }
      return { activeAgents };
    });
  },

  setCurrentExecution: (data?) => {
    set({ currentExecution: data as any });
  },

  setFilter: (filterKey, value) => {
    set((state) => ({
      filters: {
        ...state.filters,
        [filterKey]: value,
      },
    }));
  },

  getMetrics: (agentId: string) => {
    return get().metrics.get(agentId);
  },

  getAllMetrics: () => {
    return Array.from(get().metrics.values());
  },

  clearHistory: () => {
    set({
      metrics: new Map(),
      allResults: [],
      activeAgents: new Set(),
      totalExecutions: 0,
      totalSuccess: 0,
      totalFailures: 0,
    });
  },
}));
