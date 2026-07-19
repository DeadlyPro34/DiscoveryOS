/**
 * Hook for managing agent monitoring and real-time updates.
 */

import { useCallback, useEffect, useState } from 'react';
import { useAgentMonitor, AgentMetrics } from '@/lib/stores';
import { agentRegistry } from '@/services/ai/agents';

/**
 * Hook for agent monitoring.
 */
export function useAgentMonitor_Hook() {
  const store = useAgentMonitor();
  const [allAgents, setAllAgents] = useState<AgentMetrics[]>([]);

  // Initialize with all registered agents
  useEffect(() => {
    const agents = agentRegistry.getAllAgents();
    const metrics = agents.map((agent) => ({
      agentId: agent.id,
      agentName: agent.name,
      totalExecutions: 0,
      successCount: 0,
      failureCount: 0,
      averageExecutionTime: 0,
      averageConfidence: 0,
    }));
    setAllAgents(metrics);
  }, []);

  // Combine with stored metrics
  const allMetrics = useCallback(() => {
    const storedMetrics = store.getAllMetrics();
    const map = new Map(storedMetrics.map((m) => [m.agentId, m]));

    // Fill in unexecuted agents
    allAgents.forEach((agent) => {
      if (!map.has(agent.agentId)) {
        map.set(agent.agentId, agent);
      }
    });

    return Array.from(map.values());
  }, [store, allAgents]);

  return {
    metrics: allMetrics(),
    activeAgents: Array.from(store.activeAgents),
    currentExecution: store.currentExecution,
    recordExecution: store.recordExecution,
    setActiveAgent: store.setActiveAgent,
  };
}

/**
 * Hook for agent health and status.
 */
export function useAgentHealth() {
  const metrics = useAgentMonitor().getAllMetrics();

  const healthStatus = useCallback(() => {
    const totalExecutions = metrics.reduce((sum, m) => sum + m.totalExecutions, 0);
    const totalSuccess = metrics.reduce((sum, m) => sum + m.successCount, 0);
    const totalFailures = metrics.reduce((sum, m) => sum + m.failureCount, 0);

    const successRate =
      totalExecutions > 0 ? totalSuccess / totalExecutions : 0;
    const averageConfidence =
      metrics.length > 0
        ? metrics.reduce((sum, m) => sum + m.averageConfidence, 0) /
          metrics.length
        : 0;

    return {
      successRate,
      totalExecutions,
      totalSuccess,
      totalFailures,
      averageConfidence,
      healthScore:
        successRate * 0.6 + averageConfidence * 0.4,
      isHealthy: successRate > 0.8,
    };
  }, [metrics]);

  return healthStatus();
}

/**
 * Hook for agent execution tracking.
 */
export function useAgentExecution(agentId: string) {
  const store = useAgentMonitor();
  const [isExecuting, setIsExecuting] = useState(false);

  const metrics = useCallback(() => {
    return store.getMetrics(agentId);
  }, [agentId, store]);

  const startExecution = useCallback(() => {
    setIsExecuting(true);
    store.setActiveAgent(agentId, true);
  }, [agentId, store]);

  const completeExecution = useCallback(() => {
    setIsExecuting(false);
    store.setActiveAgent(agentId, false);
  }, [agentId, store]);

  return {
    metrics: metrics(),
    isExecuting,
    startExecution,
    completeExecution,
  };
}
