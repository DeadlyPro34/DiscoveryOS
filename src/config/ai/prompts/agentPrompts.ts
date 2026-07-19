/**
 * Prompt templates for remaining agents.
 * Includes Theme, Persona, Sentiment, Frequency, Impact, Opportunity, Prioritization, and PRD agents.
 */

import { PromptTemplate } from './promptTypes';

export const themePrompts: PromptTemplate[] = [
  {
    id: 'theme-cluster',
    name: 'Cluster Insights into Themes',
    agentId: 'theme-agent',
    template: `
Group insights into coherent themes representing product areas or user concerns.

Insights:
{{insightsJson}}

Suggested Theme Categories:
{{suggestionThemes}}

Create themes by:
1. Identifying natural groupings (Auth, Billing, Performance, UX, etc.)
2. Consolidating related insights
3. Assigning theme names
4. Providing theme descriptions
5. Calculating theme strength (avg confidence of contained insights)

Return JSON with themes and their constituent insights.
    `,
    variables: [
      {
        name: 'insightsJson',
        type: 'string',
        description: 'JSON array of insights to cluster',
        required: true,
      },
      {
        name: 'suggestionThemes',
        type: 'string',
        description: 'Suggested theme categories (optional)',
        defaultValue: 'Auth, Billing, Performance, UX, Onboarding, Integration',
        required: false,
      },
    ],
    systemInstructions:
      'Group insights into clear, coherent themes that represent product areas or major user concerns.',
    version: '1.0.0',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

export const personaPrompts: PromptTemplate[] = [
  {
    id: 'persona-identify',
    name: 'Identify User Personas',
    agentId: 'persona-agent',
    template: `
Identify user personas and types from the insights and content.

Content:
{{content}}

Known Personas:
{{knownPersonas}}

Identify:
1. Primary user personas (Student, Developer, Enterprise, SMB, etc.)
2. User goals and motivations
3. Pain points specific to each persona
4. Feature preferences
5. Usage patterns

For each persona provide:
- Name/type
- Description
- Key characteristics
- Goals
- Pain points
- Feature preferences
- Confidence score

Return as JSON array of identified personas.
    `,
    variables: [
      {
        name: 'content',
        type: 'string',
        description: 'User research content',
        required: true,
      },
      {
        name: 'knownPersonas',
        type: 'string',
        description: 'Predefined persona types to match against',
        defaultValue:
          'Student, Developer, Enterprise Manager, SMB Owner, Hobbyist',
        required: false,
      },
    ],
    systemInstructions:
      'Identify and characterize user personas with demographic and psychographic details.',
    version: '1.0.0',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

export const sentimentPrompts: PromptTemplate[] = [
  {
    id: 'sentiment-classify',
    name: 'Classify Sentiment',
    agentId: 'sentiment-agent',
    template: `
Classify the sentiment of user feedback and content.

Content:
{{content}}

Classify sentiment as:
- POSITIVE: User is satisfied, praising, happy
- NEGATIVE: User is frustrated, complaining, unhappy
- NEUTRAL: Factual, descriptive, neither positive nor negative
- MIXED: Contains both positive and negative elements

For each segment provide:
- Segment text (quote)
- Sentiment classification
- Sentiment score (-1 to +1)
- Key emotional indicators
- Reasoning

Return JSON with detailed sentiment analysis.
    `,
    variables: [
      {
        name: 'content',
        type: 'string',
        description: 'Content to analyze for sentiment',
        required: true,
      },
    ],
    systemInstructions:
      'Analyze sentiment with nuance, recognizing mixed sentiments and emotional context.',
    version: '1.0.0',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

export const frequencyPrompts: PromptTemplate[] = [
  {
    id: 'frequency-count',
    name: 'Analyze Frequency and Patterns',
    agentId: 'frequency-agent',
    template: `
Analyze frequency of insights, themes, and patterns.

Insights:
{{insightsJson}}

Themes:
{{themesJson}}

Calculate:
1. Insight frequency (how many times similar insights appear)
2. Theme frequency (how many insights per theme)
3. Temporal patterns (if dates available)
4. Persona distribution (which personas mention which topics)
5. Correlation patterns

Return frequency analysis with:
- Frequency distributions
- Top insights by frequency
- Top themes
- Pattern summary
- Occurrence percentages
    `,
    variables: [
      {
        name: 'insightsJson',
        type: 'string',
        description: 'JSON array of insights',
        required: true,
      },
      {
        name: 'themesJson',
        type: 'string',
        description: 'JSON array of themes',
        required: true,
      },
    ],
    systemInstructions:
      'Calculate frequency distributions and identify patterns with statistical accuracy.',
    version: '1.0.0',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

export const impactPrompts: PromptTemplate[] = [
  {
    id: 'impact-score',
    name: 'Score Business Impact',
    agentId: 'impact-agent',
    template: `
Score the business impact of insights and themes on a 0-10 scale.

Insights:
{{insightsJson}}

Themes:
{{themesJson}}

Frequency Data:
{{frequencyData}}

Score based on:
1. User frequency (how many users mention this)
2. Sentiment (negative issues higher impact)
3. Personas affected (enterprise > SMB > hobby)
4. Strategic alignment (alignment with product goals)
5. Revenue potential (for feature requests)
6. Risk level (for bugs/issues)

For each item provide:
- Impact score (0-10)
- Scoring breakdown
- Key impact factors
- Recommended action priority

Return JSON with impact scores and analysis.
    `,
    variables: [
      {
        name: 'insightsJson',
        type: 'string',
        description: 'JSON array of insights',
        required: true,
      },
      {
        name: 'themesJson',
        type: 'string',
        description: 'JSON array of themes',
        required: true,
      },
      {
        name: 'frequencyData',
        type: 'string',
        description: 'Frequency analysis data',
        required: true,
      },
    ],
    systemInstructions:
      'Score impact objectively using multi-factor analysis. Consider both quantitative and qualitative factors.',
    version: '1.0.0',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

export const opportunityPrompts: PromptTemplate[] = [
  {
    id: 'opportunity-identify',
    name: 'Identify Opportunities',
    agentId: 'opportunity-agent',
    template: `
Identify actionable opportunities from the analysis.

Themes:
{{themesJson}}

High Impact Items:
{{highImpactItems}}

Personas:
{{personasJson}}

For each opportunity identify:
1. Opportunity name/title
2. Description
3. User problems it solves
4. Personas that benefit
5. Expected impact
6. Implementation complexity
7. Key assumptions
8. Success metrics
9. Risks
10. Recommended next steps

Recommend opportunities by:
- High impact, low effort
- Strategic alignment
- Market differentiation
- Revenue potential

Return JSON with detailed opportunity analysis and recommendations.
    `,
    variables: [
      {
        name: 'themesJson',
        type: 'string',
        description: 'Analyzed themes',
        required: true,
      },
      {
        name: 'highImpactItems',
        type: 'string',
        description: 'High-impact insights and themes',
        required: true,
      },
      {
        name: 'personasJson',
        type: 'string',
        description: 'Identified personas',
        required: true,
      },
    ],
    systemInstructions:
      'Generate actionable, strategic opportunities with clear reasoning and expected outcomes.',
    version: '1.0.0',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

export const prioritizationPrompts: PromptTemplate[] = [
  {
    id: 'prioritization-rice',
    name: 'RICE Scoring and Prioritization',
    agentId: 'prioritization-agent',
    template: `
Prioritize opportunities using RICE scoring framework.

Opportunities:
{{opportunitiesJson}}

Calculate RICE for each opportunity:
- Reach: How many users affected (per quarter)
- Impact: How much each user is affected (3=massive, 2=high, 1=medium, 0.5=low, 0.25=minimal)
- Confidence: How confident are we (0-1)
- Effort: Person-months to implement

RICE Score = (Reach × Impact × Confidence) / Effort

For each opportunity:
1. Calculate RICE components
2. Compute RICE score
3. Rank by RICE score
4. Provide prioritization rationale
5. Suggest timeline

Return ranked opportunities with RICE analysis and implementation roadmap.
    `,
    variables: [
      {
        name: 'opportunitiesJson',
        type: 'string',
        description: 'JSON array of opportunities to prioritize',
        required: true,
      },
    ],
    systemInstructions:
      'Apply RICE framework consistently and transparently. Provide clear scoring rationale.',
    version: '1.0.0',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

export const prdPrompts: PromptTemplate[] = [
  {
    id: 'prd-generate',
    name: 'Generate Product Requirements Document',
    agentId: 'prd-agent',
    template: `
Generate a comprehensive Product Requirements Document.

Analysis Summary:
{{analysisSummary}}

Top Opportunities:
{{topOpportunitiesJson}}

Personas:
{{personasJson}}

Generate a PRD with sections:
1. Executive Summary
2. Problem Statement
3. User Personas & Goals
4. Requirements
   - Functional Requirements
   - Non-Functional Requirements
   - User Stories
5. Success Criteria & Metrics
6. Implementation Timeline
7. Dependencies & Risks
8. Appendix (supporting data)

Structure as proper PRD format with:
- Clear narrative
- Specific requirements (not vague)
- Acceptance criteria
- Success metrics
- User stories with acceptance criteria

Return as structured document JSON.
    `,
    variables: [
      {
        name: 'analysisSummary',
        type: 'string',
        description: 'Summary of analysis findings',
        required: true,
      },
      {
        name: 'topOpportunitiesJson',
        type: 'string',
        description: 'Top prioritized opportunities',
        required: true,
      },
      {
        name: 'personasJson',
        type: 'string',
        description: 'User personas',
        required: true,
      },
    ],
    systemInstructions:
      'Generate professional, comprehensive PRDs with clear requirements and success criteria.',
    version: '1.0.0',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];
