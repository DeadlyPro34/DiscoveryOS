/**
 * Central export for all prompt templates.
 */

export * from './promptTypes';
export * from './promptManager';
export { collectorPrompts } from './collectorPrompts';
export { insightPrompts } from './insightPrompts';
export {
  themePrompts,
  personaPrompts,
  sentimentPrompts,
  frequencyPrompts,
  impactPrompts,
  opportunityPrompts,
  prioritizationPrompts,
  prdPrompts,
} from './agentPrompts';

// Import and register all prompts
import { promptManager } from './promptManager';
import { collectorPrompts } from './collectorPrompts';
import { insightPrompts } from './insightPrompts';
import {
  themePrompts,
  personaPrompts,
  sentimentPrompts,
  frequencyPrompts,
  impactPrompts,
  opportunityPrompts,
  prioritizationPrompts,
  prdPrompts,
} from './agentPrompts';

/**
 * Initialize all prompts into the manager.
 * Call this during application startup.
 */
export function initializePrompts(): void {
  const allPrompts = [
    ...collectorPrompts,
    ...insightPrompts,
    ...themePrompts,
    ...personaPrompts,
    ...sentimentPrompts,
    ...frequencyPrompts,
    ...impactPrompts,
    ...opportunityPrompts,
    ...prioritizationPrompts,
    ...prdPrompts,
  ];

  allPrompts.forEach((prompt) => {
    promptManager.registerTemplate(prompt);
  });
}

export { promptManager };
