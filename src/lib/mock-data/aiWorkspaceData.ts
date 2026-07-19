/**
 * AI Workspace Mock Data
 * Realistic AI responses and conversations for testing
 */

import type { AIResponse, Message, Conversation, AIWorkspaceProject, EvidenceQuote, EvidencePanelData } from '@/types/ai-workspace';

/**
 * Mock projects for sidebar
 */
export const mockAIWorkspaceProjects: AIWorkspaceProject[] = [
  {
    id: 'proj-001',
    name: 'Q1 2024 Product Planning',
    description: 'Analyzing customer feedback for Q1 roadmap',
    uploadCount: 12,
    evidenceCount: 487,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-02-15'),
  },
  {
    id: 'proj-002',
    name: 'Authentication System Redesign',
    description: 'Customer research for auth UX improvements',
    uploadCount: 8,
    evidenceCount: 234,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-02-10'),
  },
  {
    id: 'proj-003',
    name: 'API Rate Limiting Review',
    description: 'Enterprise customer needs analysis',
    uploadCount: 5,
    evidenceCount: 142,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-18'),
  },
];

/**
 * Mock evidence quotes for right panel
 */
export const mockEvidenceQuotes: EvidenceQuote[] = [
  {
    id: 'quote-1',
    quote: 'Our team spends 3 hours every morning manually syncing data. It\'s killing our productivity.',
    source: 'Customer Interview',
    customerName: 'Sarah Chen',
    date: new Date('2024-01-15'),
    sentiment: 'negative',
    confidence: 95,
    theme: 'Integration',
    persona: 'Technical Lead',
  },
  {
    id: 'quote-2',
    quote: 'The API documentation is so outdated. We spent a week on a feature that was already built.',
    source: 'Support Ticket',
    customerName: 'Mike Johnson',
    date: new Date('2024-01-20'),
    sentiment: 'negative',
    confidence: 88,
    theme: 'Usability',
    persona: 'Developer',
  },
  {
    id: 'quote-3',
    quote: 'We\'re getting throttled by rate limits. We need 10x the current limits for our workflows.',
    source: 'Customer Interview',
    customerName: 'Elena Rodriguez',
    date: new Date('2024-01-18'),
    sentiment: 'negative',
    confidence: 92,
    theme: 'Performance',
    persona: 'Enterprise Ops',
  },
  {
    id: 'quote-4',
    quote: 'Real-time collaboration would be a game-changer for our distributed team.',
    source: 'Survey',
    customerName: 'David Park',
    date: new Date('2024-01-22'),
    sentiment: 'neutral',
    confidence: 85,
    theme: 'Collaboration',
    persona: 'Product Manager',
  },
  {
    id: 'quote-5',
    quote: 'The authentication system crashes when we have 1000+ concurrent users. Major blocker.',
    source: 'Customer Interview',
    customerName: 'Sophie Martin',
    date: new Date('2024-01-21'),
    sentiment: 'negative',
    confidence: 90,
    theme: 'Reliability',
    persona: 'DevOps Engineer',
  },
];

/**
 * Mock AI Responses - realistic structured answers with evidence
 */
export const mockAIResponses: Record<string, AIResponse> = {
  'pain-point': {
    id: 'resp-001',
    summary:
      'Based on 89 customer interactions across 12 projects, the top three pain points are: (1) manual data synchronization between tools consuming 3+ hours daily, (2) outdated API documentation causing implementation delays, and (3) rate limiting constraints blocking enterprise workflows.',
    keyFindings: [
      'Manual data syncing affects 23 customers (68% of enterprise segment)',
      'API documentation causes avg 5.2 days delay per integration',
      'Rate limits create blockers for 34% of high-value customers',
      'Authentication scalability is critical for 15 enterprise accounts',
    ],
    supportingEvidence: mockEvidenceQuotes,
    confidence: 92,
    affectedPersonas: [
      {
        id: 'p-001',
        name: 'Enterprise DevOps Lead',
        title: 'Director of Engineering',
        industry: 'SaaS',
        confidence: 94,
        evidenceCount: 23,
        description: 'Manages large-scale deployments with integration needs',
        painPoints: [],
      },
      {
        id: 'p-002',
        name: 'API Integration Developer',
        title: 'Senior Software Engineer',
        industry: 'Enterprise',
        confidence: 88,
        evidenceCount: 18,
        description: 'Implements third-party API integrations',
        painPoints: [],
      },
    ],
    relatedThemes: [
      {
        id: 't-001',
        name: 'Integration',
        description: 'Third-party system connectivity',
        category: 'integration',
        confidence: 95,
        evidenceCount: 34,
        relatedThemes: [],
      },
      {
        id: 't-002',
        name: 'Scalability',
        description: 'System performance under load',
        category: 'scalability',
        confidence: 92,
        evidenceCount: 28,
        relatedThemes: [],
      },
    ],
    businessImpact: 'Addressing these pain points could unlock $2.3M ARR from enterprise segment and improve retention by 15%.',
    priority: 'critical',
    recommendation: 'Launch "Integration Sprint" focusing on: (1) Native Salesforce connector MVP, (2) Revamp API docs with interactive playground, (3) Increase rate limits for enterprise tier.',
    suggestedFollowUps: [
      'Which integration should we prioritize first?',
      'What would justify enterprise customers staying with us?',
      'How should we price the higher rate limit tiers?',
    ],
  },

  'feature-priority': {
    id: 'resp-002',
    summary:
      'Analyzing revenue impact, adoption potential, and customer demand across 47 feature requests. Real-time collaboration features show strongest signal (67% request rate, high willingness to pay), followed by enhanced API rate limits and native database connectors.',
    keyFindings: [
      'Real-time collaboration: 67% request rate, $800K+ potential ARR impact',
      'Native integrations: 56% request, 8.2x faster implementation for customers',
      'Enhanced rate limits: 52% request, directly blocks 34 high-value deals',
      'Analytics dashboard: 41% request, high advocacy value but lower revenue impact',
    ],
    supportingEvidence: mockEvidenceQuotes.slice(0, 3),
    confidence: 85,
    affectedPersonas: [
      {
        id: 'p-003',
        name: 'Product Manager',
        title: 'Senior PM',
        industry: 'Tech',
        confidence: 91,
        evidenceCount: 31,
        description: 'Makes strategic product decisions',
        painPoints: [],
      },
    ],
    relatedThemes: [
      {
        id: 't-003',
        name: 'Collaboration',
        description: 'Team features and real-time sync',
        category: 'usability',
        confidence: 88,
        evidenceCount: 22,
        relatedThemes: [],
      },
    ],
    businessImpact: 'Top 3 features have combined revenue impact of $3.1M and could improve NPS by 18 points.',
    priority: 'high',
    recommendation: 'Recommend: (1) Build real-time collaboration MVP in Q2, (2) Launch native Salesforce connector, (3) Introduce tiered rate limit plan.',
    suggestedFollowUps: [
      'What would be the minimum viable product for real-time collaboration?',
      'Should we prioritize Salesforce or Hubspot integration first?',
      'How would you position the premium rate limit tier?',
    ],
  },

  'retention-risks': {
    id: 'resp-003',
    summary:
      'Churn risk analysis across 156 customer interactions reveals three key patterns: (1) integration friction causing 23% of downgrade decisions, (2) unmet scalability needs driving 19% of churns, (3) support response time impacting 12% of at-risk customers.',
    keyFindings: [
      '23% of churn linked to integration complexity and poor documentation',
      '19% churn caused by hitting rate limits and performance ceilings',
      '12% churn from slow support response times (avg 48+ hours)',
      '8% churn due to competitive product features (real-time collab)',
      'At-risk segment: $890K ARR from 12 accounts with escalated issues',
    ],
    supportingEvidence: mockEvidenceQuotes.slice(2, 5),
    confidence: 88,
    affectedPersonas: [
      {
        id: 'p-004',
        name: 'Enterprise Operations Manager',
        title: 'VP Operations',
        industry: 'Enterprise',
        confidence: 93,
        evidenceCount: 29,
        description: 'Evaluates ROI and operational efficiency',
        painPoints: [],
      },
    ],
    relatedThemes: [
      {
        id: 't-004',
        name: 'Support Quality',
        description: 'Customer service responsiveness',
        category: 'other',
        confidence: 84,
        evidenceCount: 18,
        relatedThemes: [],
      },
    ],
    businessImpact: 'Reducing churn in at-risk segment by 50% would preserve $445K ARR and improve account expansion potential by $200K.',
    priority: 'critical',
    recommendation: 'Implement: (1) 24/7 enterprise support tier, (2) Dedicate solutions engineer to top 12 accounts, (3) Create integration templates library, (4) Fast-track real-time collab beta for enterprise users.',
    suggestedFollowUps: [
      'What support SLA would be required to keep enterprise accounts?',
      'Should we offer migration assistance for churning competitors?',
      'How should we weight retention initiatives vs. new features?',
    ],
  },

  'market-opportunity': {
    id: 'resp-004',
    summary:
      'Total addressable market analysis based on 234 customer conversations and competitive research. Three expansion vectors identified: (1) mid-market segment showing 3.2x growth potential, (2) vertical SaaS expansion into healthcare and finance, (3) international expansion with localization.',
    keyFindings: [
      'Mid-market TAM expansion: $12M ARR potential (currently $2.3M from enterprise)',
      'Healthcare vertical: 89% feature parity request rate, high compliance requirements',
      'Financial services: 76% feature parity rate, regulatory compliance critical',
      'APAC expansion opportunity: 12 qualified leads in Singapore, Sydney, Tokyo',
      'Competitive differentiation: Real-time collab, industry-specific templates',
    ],
    supportingEvidence: mockEvidenceQuotes.slice(0, 4),
    confidence: 79,
    affectedPersonas: [
      {
        id: 'p-005',
        name: 'Mid-Market IT Director',
        title: 'IT Operations Director',
        industry: 'Mid-Market SaaS',
        confidence: 86,
        evidenceCount: 24,
        description: 'Budget-conscious with integration needs',
        painPoints: [],
      },
    ],
    relatedThemes: [
      {
        id: 't-005',
        name: 'Compliance',
        description: 'Regulatory and security requirements',
        category: 'security',
        confidence: 81,
        evidenceCount: 16,
        relatedThemes: [],
      },
    ],
    businessImpact: 'Pursuing mid-market and vertical expansion could increase TAM by 5.4x over 18 months.',
    priority: 'high',
    recommendation: 'Launch: (1) Mid-market GTM program with simplified pricing, (2) Healthcare compliance module, (3) Financial services security audit, (4) APAC sales pilot.',
    suggestedFollowUps: [
      'Which vertical market should we enter first?',
      'What compliance features are critical for healthcare?',
      'Should we hire regional teams or use channel partners?',
    ],
  },

  'dark-mode-prd': {
    id: 'resp-005',
    summary:
      'Dark mode PRD synthesized from 34 customer requests and design best practices. Implementation would improve accessibility (67% adoption rate), reduce eye strain for heavy users (82% satisfaction with dark mode products), and create competitive differentiation.',
    keyFindings: [
      '34 customers requested dark mode (8% of base, 18% of power users)',
      '67% of B2B SaaS products now offer dark mode',
      '82% user satisfaction increase when dark mode implemented well',
      'Eye strain reduction: 45% improvement for 6+ hour daily users',
      'Battery efficiency: 15-20% improvement on OLED devices',
    ],
    supportingEvidence: mockEvidenceQuotes.slice(1, 4),
    confidence: 81,
    affectedPersonas: [
      {
        id: 'p-006',
        name: 'Power User',
        title: 'Full-time Analyst',
        industry: 'All Segments',
        confidence: 89,
        evidenceCount: 34,
        description: '6+ hours daily in product',
        painPoints: [],
      },
    ],
    relatedThemes: [
      {
        id: 't-006',
        name: 'Usability',
        description: 'User interface accessibility',
        category: 'usability',
        confidence: 87,
        evidenceCount: 20,
        relatedThemes: [],
      },
    ],
    businessImpact: 'Dark mode implementation estimated to improve NPS by 4-6 points and reduce support tickets for accessibility by 12%.',
    priority: 'medium',
    recommendation: 'Implement dark mode: (1) Use CSS custom properties for theme switching, (2) Default to system preference, (3) Add manual toggle in settings, (4) QA all 47 pages for contrast compliance.',
    suggestedFollowUps: [
      'Should we implement system-level theme preference detection?',
      'How do we handle charts and data visualizations in dark mode?',
      'What WCAG accessibility standards should we target?',
    ],
  },
};

/**
 * Mock suggested follow-up questions
 */
export const mockFollowUpQuestions = [
  'What is our biggest customer pain point?',
  'Which feature should we build next?',
  'Generate a PRD for Dark Mode',
  'Show enterprise user complaints',
  'Summarize authentication issues',
  'What are the highest revenue opportunities?',
  'What problems affect retention?',
  'Generate sprint recommendations',
  'Which integration would have the most impact?',
  'What\'s blocking our top 10 customers?',
  'How should we improve support quality?',
  'What pricing changes would increase ARR?',
];

/**
 * Mock conversations for sidebar
 */
export const mockConversations: Conversation[] = [
  {
    id: 'conv-001',
    title: 'Q1 Product Planning Session',
    projectId: 'proj-001',
    messages: [
      {
        id: 'msg-001',
        role: 'user',
        content: 'What is our biggest customer pain point?',
        timestamp: new Date(Date.now() - 86400000 * 5),
      },
      {
        id: 'msg-002',
        role: 'assistant',
        content: mockAIResponses['pain-point'].summary,
        timestamp: new Date(Date.now() - 86400000 * 5),
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 5),
    updatedAt: new Date(Date.now() - 86400000 * 5),
    isPinned: true,
  },
  {
    id: 'conv-002',
    title: 'Feature Priority Discussion',
    projectId: 'proj-001',
    messages: [
      {
        id: 'msg-003',
        role: 'user',
        content: 'Which feature should we build next based on customer demand?',
        timestamp: new Date(Date.now() - 86400000 * 3),
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 3),
    updatedAt: new Date(Date.now() - 86400000 * 3),
    isPinned: false,
  },
  {
    id: 'conv-003',
    title: 'Retention Risk Analysis',
    projectId: 'proj-002',
    messages: [
      {
        id: 'msg-005',
        role: 'user',
        content: 'What problems are affecting our retention?',
        timestamp: new Date(Date.now() - 86400000 * 1),
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 1),
    updatedAt: new Date(Date.now() - 86400000 * 1),
    isPinned: false,
  },
];

/**
 * Get mock AI response by query type
 */
export function getMockAIResponse(queryType: keyof typeof mockAIResponses): AIResponse {
  return mockAIResponses[queryType] || mockAIResponses['pain-point'];
}

/**
 * Get related evidence for a query
 */
export function getRelatedEvidence(theme?: string): EvidencePanelData {
  const filtered = theme ? mockEvidenceQuotes.filter(q => q.theme === theme) : mockEvidenceQuotes;

  return {
    quotes: filtered,
    totalFrequency: 'frequent',
    relatedPersonas: ['Enterprise DevOps Lead', 'API Integration Developer', 'Product Manager'],
    relatedThemes: ['Integration', 'Scalability', 'Performance'],
    sentimentBreakdown: {
      positive: 15,
      neutral: 20,
      negative: 50,
      mixed: 15,
    },
    averageConfidence: 89,
  };
}
