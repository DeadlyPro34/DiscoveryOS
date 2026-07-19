/**
 * AI Product Manager Service
 * Generates AI responses based on user queries
 */

import type { AIResponse } from '@/types/ai-workspace';
import { getMockAIResponse, getRelatedEvidence } from '@/lib/mock-data/aiWorkspaceData';
import { extractTopicFromQuery } from '@/lib/utils/aiResponseFormatter';

/**
 * Simulate character-by-character typing for response
 * Returns async generator that yields chunks of text
 */
export async function* generateStreamingResponse(prompt: string) {
  const response = generateResponse(prompt);

  // Simulate streaming by yielding character by character
  for (let i = 0; i < response.summary.length; i++) {
    yield response.summary.charAt(i);
    // Random delay 10-50ms to simulate realistic typing
    await new Promise(resolve => setTimeout(resolve, Math.random() * 40 + 10));
  }
}

/**
 * Generate AI response based on user query
 * Uses mock data mapped to query topics
 */
export function generateResponse(prompt: string): AIResponse {
  const topic = extractTopicFromQuery(prompt);
  const mockResponses = {
    'pain-point': 'pain-point',
    'feature-priority': 'feature-priority',
    'retention-risks': 'retention-risks',
    'market-opportunity': 'market-opportunity',
    'dark-mode-prd': 'dark-mode-prd',
  } as const;

  const responseKey = (mockResponses[topic as keyof typeof mockResponses] ||
    'pain-point') as keyof typeof import('@/lib/mock-data/aiWorkspaceData').mockAIResponses;
  const response = getMockAIResponse(responseKey);

  // Enhance with theme-specific evidence
  const evidence = getRelatedEvidence(response.relatedThemes[0]?.name);

  return {
    ...response,
    supportingEvidence: evidence.quotes,
    id: `resp-${Date.now()}`,
  };
}

/**
 * Generate suggested follow-up questions based on response
 */
export function generateFollowUpQuestions(response: AIResponse): string[] {
  return response.suggestedFollowUps || [];
}

/**
 * Validate prompt and check for quality
 */
export function validatePrompt(prompt: string): { valid: boolean; reason?: string } {
  if (!prompt || prompt.trim().length === 0) {
    return { valid: false, reason: 'Prompt cannot be empty' };
  }

  if (prompt.trim().length < 3) {
    return { valid: false, reason: 'Prompt too short' };
  }

  if (prompt.length > 1000) {
    return { valid: false, reason: 'Prompt too long' };
  }

  return { valid: true };
}

/**
 * Get AI agent status simulation
 */
export function getAgentStatus() {
  return {
    isActive: false,
    currentAgent: undefined as any,
    progress: 0,
    agents: [
      { name: 'Collector Agent', status: 'complete' as const, progress: 100 },
      { name: 'Frequency Agent', status: 'complete' as const, progress: 100 },
      { name: 'Sentiment Agent', status: 'complete' as const, progress: 100 },
      { name: 'Theme Agent', status: 'complete' as const, progress: 100 },
      { name: 'Impact Agent', status: 'complete' as const, progress: 100 },
    ],
  };
}

/**
 * Simulate agent processing with updates
 * Returns observable updates of agent progress
 */
export async function* simulateAgentProcessing() {
  const agents = [
    'Collector Agent',
    'Frequency Agent',
    'Sentiment Agent',
    'Theme Agent',
    'Impact Agent',
  ];

  for (const agent of agents) {
    yield { agent, status: 'running' as const, progress: 0 };

    // Simulate gradual progress (0-100%)
    for (let i = 0; i <= 100; i += Math.random() * 25 + 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      yield { agent, status: 'running' as const, progress: Math.min(i, 100) };
    }

    yield { agent, status: 'complete' as const, progress: 100 };
    await new Promise(resolve => setTimeout(resolve, 200));
  }
}

/**
 * Extract key entities from prompt
 */
export function extractEntities(prompt: string) {
  const lower = prompt.toLowerCase();

  const intents = {
    'analyze-pain': [
      'pain point',
      'problem',
      'issue',
      'complaint',
      'frustration',
    ],
    'recommend-feature': [
      'feature',
      'build',
      'next',
      'implement',
      'develop',
    ],
    'assess-risk': ['churn', 'retention', 'risk', 'at-risk', 'leaving'],
    'find-opportunity': ['opportunity', 'market', 'expansion', 'growth'],
    'generate-doc': ['prd', 'requirement', 'document', 'spec'],
  };

  let matchedIntent = 'general';
  for (const [intent, keywords] of Object.entries(intents)) {
    if (keywords.some(keyword => lower.includes(keyword))) {
      matchedIntent = intent;
      break;
    }
  }

  return {
    intent: matchedIntent,
    entities: extractKeyTerms(prompt),
  };
}

/**
 * Extract key terms from prompt
 */
function extractKeyTerms(prompt: string): string[] {
  // Very simple extraction - in production, use NLP library
  const terms = prompt
    .split(/[\s,;.!?]+/)
    .filter(term => term.length > 3)
    .filter(term => !/^(what|which|how|when|where|why|our|for|and|the|that|this|from)$/i.test(term));

  return Array.from(new Set(terms)).slice(0, 5);
}
