/**
 * Centralized export for all agent implementations.
 */

import { CollectorAgent, collectorAgent } from './collectorAgent';
import { InsightAgent, insightAgent } from './insightAgent';
import { ThemeAgent, themeAgent } from './themeAgent';
import { PersonaAgent, personaAgent } from './personaAgent';
import { SentimentAgent, sentimentAgent } from './sentimentAgent';
import { FrequencyAgent, frequencyAgent } from './frequencyAgent';
import { ImpactAgent, impactAgent } from './impactAgent';
import { OpportunityAgent, opportunityAgent } from './opportunityAgent';
import { PrioritizationAgent, prioritizationAgent } from './prioritizationAgent';
import { PRDAgent, prdAgent } from './prdAgent';

export {
  CollectorAgent,
  collectorAgent,
  InsightAgent,
  insightAgent,
  ThemeAgent,
  themeAgent,
  PersonaAgent,
  personaAgent,
  SentimentAgent,
  sentimentAgent,
  FrequencyAgent,
  frequencyAgent,
  ImpactAgent,
  impactAgent,
  OpportunityAgent,
  opportunityAgent,
  PrioritizationAgent,
  prioritizationAgent,
  PRDAgent,
  prdAgent,
};

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
