/**
 * Agent exports and initialization.
 */

export { BaseAgent } from './base/baseAgent';
export { AgentRegistry, agentRegistry, getAgentRegistry } from './registry/agentRegistry';
export {
  collectorAgent,
  insightAgent,
  themeAgent,
  personaAgent,
  sentimentAgent,
  frequencyAgent,
  impactAgent,
  opportunityAgent,
  prioritizationAgent,
  prdAgent,
  allAgents,
} from './implementations';
