/**
 * Multi-Agent System Initialization.
 * Call this during application startup to initialize the entire system.
 */

import { initializePrompts } from '@/config/ai/prompts';
import { agentRegistry } from '@/services/ai/agents';
import { multiAgentOrchestrator } from '@/services/ai/orchestrator';

/**
 * Initialize the entire multi-agent system.
 * Should be called once during application startup.
 */
export async function initializeMultiAgentSystem(): Promise<void> {
  try {
    console.log('🚀 Initializing Multi-Agent Intelligence Engine...');

    // Step 1: Initialize prompts
    console.log('📝 Initializing prompt system...');
    initializePrompts();
    const promptCount = agentRegistry
      .getAgentRegistry()
      .listAgentIds().length;
    console.log(`✓ Prompts initialized (${promptCount} agents)`);

    // Step 2: Verify agent registry
    console.log('📦 Verifying agent registry...');
    const allAgents = agentRegistry.getAllAgents();
    console.log(`✓ Registry verified (${allAgents.length} agents registered)`);

    // Step 3: Log agent details
    console.log('\n📋 Registered Agents:');
    allAgents.forEach((agent, index) => {
      console.log(
        `  ${index + 1}. ${agent.icon} ${agent.name} (${agent.category})`,
      );
    });

    // Step 4: Verify orchestrator
    console.log('\n🎯 Verifying orchestrator...');
    const pipelineConfig = multiAgentOrchestrator.getPipelineConfig();
    console.log(
      `✓ Orchestrator ready (${pipelineConfig.agents.length}-agent pipeline)`,
    );

    console.log('\n✅ Multi-Agent System Initialized Successfully!\n');
  } catch (error) {
    console.error(
      '❌ Failed to initialize multi-agent system:',
      error,
    );
    throw error;
  }
}

/**
 * Get system status.
 */
export function getSystemStatus(): {
  initialized: boolean;
  agentCount: number;
  agents: Array<{ id: string; name: string; category: string }>;
  orchestratorReady: boolean;
} {
  try {
    const agents = agentRegistry.getAllAgents();
    const orchestratorReady = multiAgentOrchestrator.getPipelineConfig() !== null;

    return {
      initialized: agents.length > 0,
      agentCount: agents.length,
      agents: agents.map((a) => ({
        id: a.id,
        name: a.name,
        category: a.category,
      })),
      orchestratorReady,
    };
  } catch {
    return {
      initialized: false,
      agentCount: 0,
      agents: [],
      orchestratorReady: false,
    };
  }
}

/**
 * Reset the entire system (useful for testing).
 */
export function resetMultiAgentSystem(): void {
  // Reset all stores
  const { clearHistory: clearAgentHistory } = useAgentMonitor.getState();
  const { clearHistory: clearWorkflowHistory } = useWorkflowResults.getState();

  clearAgentHistory();
  clearWorkflowHistory();

  console.log('🔄 Multi-Agent System Reset');
}

// Import for reset function
import { useAgentMonitor, useWorkflowResults } from '@/lib/stores';
