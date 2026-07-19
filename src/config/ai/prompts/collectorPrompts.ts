/**
 * Prompt templates for the Collector Agent.
 * Normalizes and prepares context from raw documents.
 */

import { PromptTemplate } from './promptTypes';

export const collectorPrompts: PromptTemplate[] = [
  {
    id: 'collector-normalize',
    name: 'Normalize Document Content',
    agentId: 'collector-agent',
    template: `
You are a document normalization specialist. Your task is to standardize and prepare raw user research content for downstream analysis.

Document Content:
{{documentContent}}

Document Type: {{documentType}}
Language: {{language}}

Please normalize this content by:
1. Cleaning up formatting and removing artifacts
2. Standardizing timestamps and date references
3. Identifying and tagging structured data (names, emails, dates)
4. Resolving pronouns and ambiguous references
5. Flagging any sensitive information
6. Extracting key metadata

Return a JSON object with:
{
  "normalized_text": "cleaned text",
  "metadata": { key-value pairs },
  "entities": [ identified entities ],
  "sensitive_data": [ flagged sensitive info ],
  "quality_score": 0-1,
  "issues": [ any issues found ]
}
    `,
    variables: [
      {
        name: 'documentContent',
        type: 'string',
        description: 'Raw document content to normalize',
        required: true,
      },
      {
        name: 'documentType',
        type: 'string',
        description: 'Type of document (transcript, feedback, survey, etc)',
        defaultValue: 'generic',
        required: false,
      },
      {
        name: 'language',
        type: 'string',
        description: 'Language of the document',
        defaultValue: 'en',
        required: false,
      },
    ],
    systemInstructions: `You are an expert document normalization system. Your role is to:
- Standardize formatting and structure
- Extract and tag important entities
- Identify metadata
- Flag data quality issues
- Preserve all meaningful content while cleaning artifacts

Always return valid JSON. Be precise and systematic.`,
    version: '1.0.0',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },

  {
    id: 'collector-extract-context',
    name: 'Extract Research Context',
    agentId: 'collector-agent',
    template: `
Extract the research context and background from the following document:

Document:
{{documentContent}}

Project Context:
{{projectContext}}

Extract:
1. Study/research methodology (if applicable)
2. Participant information (count, demographics, roles)
3. Data collection period and location
4. Research goals or questions
5. Source and credibility indicators

Return JSON with extracted context and a confidence score (0-1).
    `,
    variables: [
      {
        name: 'documentContent',
        type: 'string',
        description: 'Document content',
        required: true,
      },
      {
        name: 'projectContext',
        type: 'string',
        description: 'Additional project context',
        defaultValue: '',
        required: false,
      },
    ],
    systemInstructions:
      'Extract contextual information with focus on research methodology and data quality indicators.',
    version: '1.0.0',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];
