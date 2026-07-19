/**
 * Prompt templates for the Insight Agent.
 * Extracts pain points, features, bugs, and other key insights.
 */

import { PromptTemplate } from './promptTypes';

export const insightPrompts: PromptTemplate[] = [
  {
    id: 'insight-extract',
    name: 'Extract Insights from Content',
    agentId: 'insight-agent',
    template: `
You are an expert at extracting actionable insights from user research data.

Content:
{{content}}

Extract all explicit and implicit insights. Categorize each insight as:
- PAIN_POINT: User frustration or problem
- FEATURE_REQUEST: Desired functionality
- BUG: Technical issue or defect
- PRAISE: Positive feedback
- WORKFLOW: Process or usage pattern
- OTHER: Other notable observations

For each insight provide:
- Category
- Direct quote from content
- Paraphrased statement
- Evidence strength (strong/medium/weak)
- Context (where in document it appeared)

Return as JSON array of insights.
    `,
    variables: [
      {
        name: 'content',
        type: 'string',
        description: 'User research content to extract insights from',
        required: true,
      },
    ],
    systemInstructions: `You are an expert insight extraction system. Your role is to:
- Identify both explicit and implicit user insights
- Categorize insights accurately
- Extract direct quotes
- Assess evidence strength
- Preserve context

Always return valid JSON. Be thorough but concise.`,
    version: '1.0.0',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },

  {
    id: 'insight-deduplicate',
    name: 'Deduplicate and Consolidate Insights',
    agentId: 'insight-agent',
    template: `
Consolidate duplicate and similar insights:

Insights:
{{insightsJson}}

Find similar insights and consolidate them. For each consolidated group:
1. Identify the core insight
2. List which insights were merged
3. Show occurrence count
4. Indicate if patterns exist
5. Provide consolidated statement

Return deduplicated insights with consolidation metadata.
    `,
    variables: [
      {
        name: 'insightsJson',
        type: 'string',
        description: 'JSON array of insights to deduplicate',
        required: true,
      },
    ],
    systemInstructions:
      'Consolidate similar insights while preserving unique perspectives. Maintain accuracy and completeness.',
    version: '1.0.0',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];
