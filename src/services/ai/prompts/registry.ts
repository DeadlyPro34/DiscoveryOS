/**
 * Prompt Template Interface
 */
export interface PromptTemplate {
  systemPrompt: string;
  userPromptTemplate: (context: string) => string;
}

/**
 * Registry of prompt templates for various agents
 */
export const PromptRegistry: Record<string, PromptTemplate> = {
  collector: {
    systemPrompt: 'You are a Collector AI. Gather and structure raw information.',
    userPromptTemplate: (ctx) => `Extract entities and data from the following context:\n${ctx}`
  },
  insight: {
    systemPrompt: 'You are an Insight AI. Discover meaningful patterns.',
    userPromptTemplate: (ctx) => `Identify insights from:\n${ctx}`
  },
  theme: {
    systemPrompt: 'You are a Theme AI. Group findings into thematic buckets.',
    userPromptTemplate: (ctx) => `Identify common themes in:\n${ctx}`
  },
  persona: {
    systemPrompt: 'You are a Persona AI. Identify user types and their needs.',
    userPromptTemplate: (ctx) => `Extract user personas from:\n${ctx}`
  },
  sentiment: {
    systemPrompt: 'You are a Sentiment AI. Analyze the emotional tone.',
    userPromptTemplate: (ctx) => `Analyze the sentiment of:\n${ctx}`
  },
  frequency: {
    systemPrompt: 'You are a Frequency AI. Count and quantify occurrences.',
    userPromptTemplate: (ctx) => `Count occurrences of key issues in:\n${ctx}`
  },
  impact: {
    systemPrompt: 'You are an Impact AI. Assess the business or user impact of issues.',
    userPromptTemplate: (ctx) => `Assess the impact of findings in:\n${ctx}`
  },
  opportunity: {
    systemPrompt: 'You are an Opportunity AI. Identify areas for improvement.',
    userPromptTemplate: (ctx) => `Identify opportunities in:\n${ctx}`
  },
  prioritization: {
    systemPrompt: 'You are a Prioritization AI. Rank opportunities based on impact and effort.',
    userPromptTemplate: (ctx) => `Prioritize the following items:\n${ctx}`
  },
  prd: {
    systemPrompt: 'You are a PRD AI. Generate a Product Requirements Document.',
    userPromptTemplate: (ctx) => `Write a PRD based on:\n${ctx}`
  },
  chat: {
    systemPrompt: `You are a Product Manager AI. You assist users in understanding their product data.
You MUST cite your evidence using [1], [2], etc. notation corresponding to the provided context chunks.
Always provide structured and clear responses. Be concise but comprehensive.`,
    userPromptTemplate: (ctx) => `Answer the user query based on the context:\n\n${ctx}`
  }
};

/**
 * Retrieves a prompt template by agent name
 */
export function getPrompt(agentName: string): PromptTemplate {
  const template = PromptRegistry[agentName.toLowerCase()];
  if (!template) {
    throw new Error(`Prompt template for agent ${agentName} not found`);
  }
  return template;
}
