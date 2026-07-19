/**
 * Agent Registry for discovering and managing agents.
 * Provides centralized registration, discovery, and lifecycle management.
 */

import { IAgent, AgentMetadata } from '@/types/ai/agent';
import { allAgents } from '../implementations';

/**
 * Agent Registry: Manages agent registration and discovery.
 */
export class AgentRegistry {
  private agents: Map<string, IAgent> = new Map();
  private metadata: Map<string, AgentMetadata> = new Map();

  /**
   * Initialize the registry with agents.
   */
  constructor(agents: IAgent[] = allAgents) {
    agents.forEach((agent) => {
      this.registerAgent(agent);
    });
  }

  /**
   * Register an agent in the registry.
   */
  registerAgent(agent: IAgent): void {
    this.agents.set(agent.id, agent);

    // Create metadata
    const metadata: AgentMetadata = {
      id: agent.id,
      name: agent.name,
      description: agent.description,
      category: agent.category,
      icon: agent.icon,
      version: agent.version,
      inputSchema: this.schemaToJSON(agent.inputSchema),
      outputSchema: this.schemaToJSON(agent.outputSchema),
      available: true,
      registeredAt: new Date(),
    };

    this.metadata.set(agent.id, metadata);
  }

  /**
   * Get agent by ID.
   */
  getAgent(agentId: string): IAgent | undefined {
    return this.agents.get(agentId);
  }

  /**
   * Get all registered agents.
   */
  getAllAgents(): IAgent[] {
    return Array.from(this.agents.values());
  }

  /**
   * Get agents by category.
   */
  getAgentsByCategory(category: string): IAgent[] {
    return Array.from(this.agents.values()).filter(
      (agent) => agent.category === category,
    );
  }

  /**
   * Get agent metadata.
   */
  getMetadata(agentId: string): AgentMetadata | undefined {
    return this.metadata.get(agentId);
  }

  /**
   * Get all metadata.
   */
  getAllMetadata(): AgentMetadata[] {
    return Array.from(this.metadata.values());
  }

  /**
   * Check if agent is registered.
   */
  hasAgent(agentId: string): boolean {
    return this.agents.has(agentId);
  }

  /**
   * Get agent count.
   */
  getAgentCount(): number {
    return this.agents.size;
  }

  /**
   * List all agent IDs.
   */
  listAgentIds(): string[] {
    return Array.from(this.agents.keys());
  }

  /**
   * Convert Zod schema to JSON schema (simplified).
   */
  private schemaToJSON(schema: unknown): unknown {
    if (!schema) return null;

    // This is a simplified version - in production, use a proper Zod to JSON Schema converter
    return {
      type: 'object',
      description: 'Agent schema',
    };
  }
}

/**
 * Export singleton registry instance.
 */
export const agentRegistry = new AgentRegistry();

/**
 * Utility function to get the registry.
 */
export function getAgentRegistry(): AgentRegistry {
  return agentRegistry;
}
