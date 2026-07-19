/**
 * Centralized export for all agent implementations.
 */

export { CollectorAgent, collectorAgent } from './collectorAgent';
export { InsightAgent, insightAgent } from './insightAgent';
export { ThemeAgent, themeAgent } from './themeAgent';
export { PersonaAgent, personaAgent } from './personaAgent';
export { SentimentAgent, sentimentAgent } from './sentimentAgent';
export { FrequencyAgent, frequencyAgent } from './frequencyAgent';
export { ImpactAgent, impactAgent } from './impactAgent';
export { OpportunityAgent, opportunityAgent } from './opportunityAgent';
export {
  PrioritizationAgent,
  prioritizationAgent,
} from './prioritizationAgent';
export { PRDAgent, prdAgent } from './prdAgent';

/**
 * Array of all agent instances for easy iteration.
 */
export const allAgents = [
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
];
