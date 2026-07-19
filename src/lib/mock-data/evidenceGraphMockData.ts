/**
 * Product Evidence Graph - Mock Data
 * Realistic customer quotes and full graph structure
 */

import type {
  GraphNode,
  ConfidenceEdge,
  CustomerQuoteData,
  PainPointData,
  ThemeData,
  PersonaData,
  SentimentData,
  FeatureRequestData,
  BusinessImpactData,
  FrequencyData,
  OpportunityData,
  PriorityData,
  PRDData,
  RoadmapData,
} from '@/lib/graphTypes';

/**
 * Mock Customer Quotes - Entry points for the graph
 */
const mockQuotes: CustomerQuoteData[] = [
  {
    id: 'quote-1',
    quote:
      'Our team spends 3 hours every morning manually syncing data between Salesforce and our internal tools. Its killing our productivity.',
    customerId: 'cust-001',
    customerName: 'Sarah Chen',
    date: new Date('2024-01-15'),
    sourceType: 'interview',
    confidence: 95,
    evidenceCount: 12,
  },
  {
    id: 'quote-2',
    quote:
      'We love the product, but the API documentation is so outdated. We spent a week trying to implement a feature that was already built in.',
    customerId: 'cust-002',
    customerName: 'Mike Johnson',
    date: new Date('2024-01-20'),
    sourceType: 'support',
    confidence: 88,
    evidenceCount: 8,
  },
  {
    id: 'quote-3',
    quote:
      'Im constantly getting throttled by the rate limits. We need at least 10x the current limits to run our workflows.',
    customerId: 'cust-003',
    customerName: 'Elena Rodriguez',
    date: new Date('2024-01-18'),
    sourceType: 'interview',
    confidence: 92,
    evidenceCount: 15,
  },
  {
    id: 'quote-4',
    quote:
      'The real-time collaboration features would be a game-changer for our distributed team. Currently, we just use Slack threads.',
    customerId: 'cust-004',
    customerName: 'David Park',
    date: new Date('2024-01-22'),
    sourceType: 'survey',
    confidence: 85,
    evidenceCount: 6,
  },
  {
    id: 'quote-5',
    quote:
      'Your analytics dashboard has everything I need. The performance insights helped us reduce latency by 40%. This is amazing.',
    customerId: 'cust-005',
    customerName: 'Lisa Chen',
    date: new Date('2024-01-17'),
    sourceType: 'feedback',
    confidence: 90,
    evidenceCount: 10,
  },
  {
    id: 'quote-6',
    quote:
      'We need better export options. Right now we can only export to CSV, but we really need Parquet and JSON formats.',
    customerId: 'cust-006',
    customerName: 'James Wilson',
    date: new Date('2024-01-19'),
    sourceType: 'support',
    confidence: 82,
    evidenceCount: 5,
  },
  {
    id: 'quote-7',
    quote:
      'The authentication system crashes regularly when we have more than 1000 concurrent users. This is a major blocker.',
    customerId: 'cust-007',
    customerName: 'Sophie Martin',
    date: new Date('2024-01-21'),
    sourceType: 'interview',
    confidence: 98,
    evidenceCount: 20,
  },
  {
    id: 'quote-8',
    quote:
      'Custom roles and permissions would let us better control data access across our organization.',
    customerId: 'cust-008',
    customerName: 'Robert Thompson',
    date: new Date('2024-01-16'),
    sourceType: 'survey',
    confidence: 78,
    evidenceCount: 4,
  },
];

/**
 * Mock Pain Points
 */
const mockPainPoints: PainPointData[] = [
  {
    id: 'pain-1',
    title: 'Manual Data Synchronization',
    description: 'Teams spend hours manually syncing data between disconnected systems',
    severity: 'critical',
    confidence: 95,
    evidenceCount: 12,
    affectedCustomers: 45,
    quotes: ['quote-1'],
  },
  {
    id: 'pain-2',
    title: 'Outdated Documentation',
    description: 'API and integration documentation is significantly out of sync with the product',
    severity: 'high',
    confidence: 88,
    evidenceCount: 8,
    affectedCustomers: 22,
    quotes: ['quote-2'],
  },
  {
    id: 'pain-3',
    title: 'Rate Limiting Constraints',
    description: 'Current API rate limits prevent enterprise-scale workflows',
    severity: 'critical',
    confidence: 92,
    evidenceCount: 15,
    affectedCustomers: 38,
    quotes: ['quote-3'],
  },
  {
    id: 'pain-4',
    title: 'Lack of Real-Time Collaboration',
    description: 'No native real-time collaboration support for distributed teams',
    severity: 'high',
    confidence: 85,
    evidenceCount: 6,
    affectedCustomers: 18,
    quotes: ['quote-4'],
  },
  {
    id: 'pain-5',
    title: 'Limited Export Formats',
    description: 'Only CSV export available; modern data workflows require Parquet, JSON, etc.',
    severity: 'medium',
    confidence: 82,
    evidenceCount: 5,
    affectedCustomers: 12,
    quotes: ['quote-6'],
  },
  {
    id: 'pain-6',
    title: 'Scalability Issues',
    description: 'System becomes unstable at high concurrent user counts',
    severity: 'critical',
    confidence: 98,
    evidenceCount: 20,
    affectedCustomers: 55,
    quotes: ['quote-7'],
  },
  {
    id: 'pain-7',
    title: 'Granular Access Control',
    description: 'Need more flexible role-based access control and custom permissions',
    severity: 'medium',
    confidence: 78,
    evidenceCount: 4,
    affectedCustomers: 9,
    quotes: ['quote-8'],
  },
];

/**
 * Mock Themes
 */
const mockThemes: ThemeData[] = [
  {
    id: 'theme-1',
    name: 'Integration & Automation',
    description: 'Seamless data flow and workflow automation',
    category: 'integration',
    confidence: 94,
    evidenceCount: 25,
    relatedThemes: [],
  },
  {
    id: 'theme-2',
    name: 'Product Documentation',
    description: 'Comprehensive, accurate, and up-to-date documentation',
    category: 'usability',
    confidence: 88,
    evidenceCount: 8,
    relatedThemes: [],
  },
  {
    id: 'theme-3',
    name: 'Performance & Scalability',
    description: 'System stability and performance at enterprise scale',
    category: 'performance',
    confidence: 95,
    evidenceCount: 35,
    relatedThemes: ['theme-5'],
  },
  {
    id: 'theme-4',
    name: 'Collaboration Features',
    description: 'Real-time and asynchronous collaboration capabilities',
    category: 'usability',
    confidence: 85,
    evidenceCount: 6,
    relatedThemes: [],
  },
  {
    id: 'theme-5',
    name: 'Data Reliability',
    description: 'System reliability and uptime assurances',
    category: 'reliability',
    confidence: 95,
    evidenceCount: 20,
    relatedThemes: ['theme-3'],
  },
  {
    id: 'theme-6',
    name: 'Data Portability',
    description: 'Export and import data in multiple formats',
    category: 'integration',
    confidence: 82,
    evidenceCount: 5,
    relatedThemes: ['theme-1'],
  },
  {
    id: 'theme-7',
    name: 'Security & Access Control',
    description: 'Fine-grained permissions and enterprise security',
    category: 'security',
    confidence: 80,
    evidenceCount: 5,
    relatedThemes: [],
  },
];

/**
 * Mock Personas
 */
const mockPersonas: PersonaData[] = [
  {
    id: 'persona-1',
    name: 'Engineering Manager',
    title: 'Engineering Manager / Tech Lead',
    industry: 'SaaS',
    company: 'Enterprise',
    confidence: 92,
    evidenceCount: 18,
    description: 'Focused on team productivity and workflow optimization',
    painPoints: ['pain-1', 'pain-3'],
  },
  {
    id: 'persona-2',
    name: 'API Developer',
    title: 'API Developer / Integration Specialist',
    industry: 'SaaS / Fintech',
    company: 'Mid-Market',
    confidence: 88,
    evidenceCount: 12,
    description: 'Needs clear documentation and robust API capabilities',
    painPoints: ['pain-2', 'pain-5'],
  },
  {
    id: 'persona-3',
    name: 'DevOps Engineer',
    title: 'DevOps / Infrastructure Engineer',
    industry: 'Enterprise',
    company: 'Enterprise',
    confidence: 95,
    evidenceCount: 25,
    description: 'Requires reliable, scalable systems with predictable performance',
    painPoints: ['pain-3', 'pain-6'],
  },
  {
    id: 'persona-4',
    name: 'Distributed Team Lead',
    title: 'Product Manager / Project Lead',
    industry: 'Consulting / Agencies',
    company: 'SMB',
    confidence: 85,
    evidenceCount: 8,
    description: 'Needs better collaboration tools for remote teams',
    painPoints: ['pain-4', 'pain-7'],
  },
  {
    id: 'persona-5',
    name: 'Data Analyst',
    title: 'Data Analyst / BI Engineer',
    industry: 'Enterprise / Tech',
    company: 'Enterprise',
    confidence: 80,
    evidenceCount: 10,
    description: 'Requires multiple data export formats for downstream processing',
    painPoints: ['pain-5'],
  },
];

/**
 * Mock Sentiment Analysis
 */
const mockSentiment: SentimentData[] = [
  {
    id: 'sentiment-1',
    sentiment: 'negative',
    score: -0.8,
    confidence: 95,
    evidenceCount: 12,
    reasoning: 'Frustration with productivity loss due to manual processes',
    emotionalDrivers: ['frustration', 'urgency', 'pain'],
  },
  {
    id: 'sentiment-2',
    sentiment: 'negative',
    score: -0.6,
    confidence: 88,
    evidenceCount: 8,
    reasoning: 'Disappointment with outdated documentation hindering development',
    emotionalDrivers: ['disappointment', 'friction'],
  },
  {
    id: 'sentiment-3',
    sentiment: 'negative',
    score: -0.9,
    confidence: 92,
    evidenceCount: 15,
    reasoning: 'Severe frustration with blocking rate limit constraints',
    emotionalDrivers: ['anger', 'blocking', 'urgency'],
  },
  {
    id: 'sentiment-4',
    sentiment: 'mixed',
    score: 0.3,
    confidence: 85,
    evidenceCount: 6,
    reasoning: 'Optimistic about potential but frustrated with current limitations',
    emotionalDrivers: ['optimism', 'interest', 'frustration'],
  },
  {
    id: 'sentiment-5',
    sentiment: 'positive',
    score: 0.95,
    confidence: 90,
    evidenceCount: 10,
    reasoning: 'High satisfaction with existing analytics capabilities',
    emotionalDrivers: ['satisfaction', 'excitement', 'value'],
  },
];

/**
 * Mock Frequency Analysis
 */
const mockFrequency: FrequencyData[] = [
  {
    id: 'freq-1',
    frequency: 'universal',
    mentionCount: 45,
    percentageOfCustomers: 92,
    trend: 'increasing',
    confidence: 95,
    evidenceCount: 12,
  },
  {
    id: 'freq-2',
    frequency: 'frequent',
    mentionCount: 22,
    percentageOfCustomers: 45,
    trend: 'stable',
    confidence: 88,
    evidenceCount: 8,
  },
  {
    id: 'freq-3',
    frequency: 'universal',
    mentionCount: 38,
    percentageOfCustomers: 78,
    trend: 'increasing',
    confidence: 92,
    evidenceCount: 15,
  },
  {
    id: 'freq-4',
    frequency: 'frequent',
    mentionCount: 18,
    percentageOfCustomers: 37,
    trend: 'stable',
    confidence: 85,
    evidenceCount: 6,
  },
];

/**
 * Mock Business Impact
 */
const mockBusinessImpact: BusinessImpactData[] = [
  {
    id: 'impact-1',
    impactAreas: [
      { area: 'retention', estimatedValue: 15, confidence: 92 },
      { area: 'adoption', estimatedValue: 20, confidence: 88 },
      { area: 'nps', estimatedValue: 12, confidence: 85 },
    ],
    totalImpactScore: 85,
    estimatedImplementationCost: 30,
    roiScore: 2.83,
    confidence: 90,
    evidenceCount: 12,
  },
  {
    id: 'impact-2',
    impactAreas: [
      { area: 'adoption', estimatedValue: 8, confidence: 80 },
      { area: 'nps', estimatedValue: 6, confidence: 78 },
    ],
    totalImpactScore: 45,
    estimatedImplementationCost: 15,
    roiScore: 3.0,
    confidence: 82,
    evidenceCount: 8,
  },
  {
    id: 'impact-3',
    impactAreas: [
      { area: 'revenue', estimatedValue: 25, confidence: 90 },
      { area: 'retention', estimatedValue: 22, confidence: 88 },
    ],
    totalImpactScore: 92,
    estimatedImplementationCost: 45,
    roiScore: 2.04,
    confidence: 95,
    evidenceCount: 35,
  },
];

/**
 * Mock Opportunities
 */
const mockOpportunities: OpportunityData[] = [
  {
    id: 'opp-1',
    title: 'Enterprise Automation Market',
    description: 'Strong market demand for seamless third-party integrations',
    opportunityType: 'revenue',
    marketSize: '$4.2B',
    competitiveAdvantage: 'Native integrations vs. third-party middleware',
    confidence: 92,
    evidenceCount: 25,
  },
  {
    id: 'opp-2',
    title: 'Developer Experience Leadership',
    description: 'Clear documentation as competitive moat in developer-first market',
    opportunityType: 'differentiation',
    marketSize: '$1.8B',
    competitiveAdvantage: 'Best-in-class docs and tutorials',
    confidence: 85,
    evidenceCount: 8,
  },
  {
    id: 'opp-3',
    title: 'Enterprise Scalability',
    description: 'Enterprise customers willing to pay premium for reliable infrastructure',
    opportunityType: 'revenue',
    marketSize: '$2.5B',
    competitiveAdvantage: '99.99% uptime SLA + performance guarantees',
    confidence: 95,
    evidenceCount: 35,
  },
];

/**
 * Mock Feature Requests
 */
const mockFeatureRequests: FeatureRequestData[] = [
  {
    id: 'feature-1',
    title: 'Native CRM Integration',
    description: 'Bi-directional sync with major CRM platforms',
    proposedSolution: 'Salesforce, HubSpot, Pipedrive native connectors',
    confidence: 94,
    evidenceCount: 25,
    implementationEffort: 'high',
  },
  {
    id: 'feature-2',
    title: 'API Documentation Portal',
    description: 'Interactive API documentation with try-it-out features',
    proposedSolution: 'Swagger/OpenAPI with embedded playground',
    confidence: 88,
    evidenceCount: 8,
    implementationEffort: 'medium',
  },
  {
    id: 'feature-3',
    title: 'Adaptive Rate Limiting',
    description: 'Dynamic rate limits based on plan and usage patterns',
    proposedSolution: 'Implement token bucket with adaptive refill rates',
    confidence: 92,
    evidenceCount: 15,
    implementationEffort: 'high',
  },
  {
    id: 'feature-4',
    title: 'Real-Time Collaborative Editing',
    description: 'Live multiplayer editing with presence and change tracking',
    proposedSolution: 'WebSocket-based CRDT implementation',
    confidence: 85,
    evidenceCount: 6,
    implementationEffort: 'very-high',
  },
  {
    id: 'feature-5',
    title: 'Multi-Format Export',
    description: 'Export data as CSV, JSON, Parquet, Avro',
    proposedSolution: 'Add export format selector to existing export modal',
    confidence: 82,
    evidenceCount: 5,
    implementationEffort: 'medium',
  },
  {
    id: 'feature-6',
    title: 'Horizontal Scaling',
    description: 'Redesign auth and session management for stateless architecture',
    proposedSolution: 'Migrate to distributed session store, implement load balancing',
    confidence: 98,
    evidenceCount: 20,
    implementationEffort: 'very-high',
  },
  {
    id: 'feature-7',
    title: 'Custom RBAC',
    description: 'User-defined roles with fine-grained permissions',
    proposedSolution: 'Permission matrix system with inheritance',
    confidence: 78,
    evidenceCount: 4,
    implementationEffort: 'medium',
  },
];

/**
 * Mock Priority Assessments
 */
const mockPriorities: PriorityData[] = [
  {
    id: 'priority-1',
    priority: 'critical',
    priorityScore: 94,
    justification: 'Affects 92% of customers, high retention impact',
    dependsOn: [],
    blockedBy: [],
    confidence: 92,
    evidenceCount: 12,
  },
  {
    id: 'priority-2',
    priority: 'high',
    priorityScore: 82,
    justification: 'Developer satisfaction and adoption',
    dependsOn: [],
    blockedBy: [],
    confidence: 85,
    evidenceCount: 8,
  },
  {
    id: 'priority-3',
    priority: 'critical',
    priorityScore: 96,
    justification: 'Revenue-critical, enterprise blocker',
    dependsOn: [],
    blockedBy: [],
    confidence: 95,
    evidenceCount: 35,
  },
  {
    id: 'priority-4',
    priority: 'medium',
    priorityScore: 68,
    justification: 'Nice-to-have for distributed teams',
    dependsOn: [],
    blockedBy: [],
    confidence: 80,
    evidenceCount: 6,
  },
  {
    id: 'priority-5',
    priority: 'medium',
    priorityScore: 65,
    justification: 'Low frequency need, straightforward implementation',
    dependsOn: [],
    blockedBy: [],
    confidence: 78,
    evidenceCount: 5,
  },
];

/**
 * Mock PRDs
 */
const mockPRDs: PRDData[] = [
  {
    id: 'prd-1',
    title: 'Native CRM Integration Platform',
    userStory: 'As an engineering manager, I want to automatically sync data with Salesforce so my team saves 3+ hours daily',
    acceptanceCriteria: [
      'Bi-directional sync with <5 minute latency',
      'Conflict resolution for concurrent edits',
      'Audit log for all synced data',
      'Rate limit aware (respects CRM API limits)',
    ],
    technicalNotes: 'Use webhook pattern with message queue for reliability',
    designNotes: 'Wizard UI for credentials, visual sync status dashboard',
    estimatedEffort: 'high',
    confidence: 90,
    evidenceCount: 25,
  },
  {
    id: 'prd-2',
    title: 'API Documentation & Developer Portal',
    userStory: 'As an API developer, I want interactive documentation so I can understand endpoints without trial-and-error',
    acceptanceCriteria: [
      'OpenAPI specification auto-generated from code',
      'Try-it-out sandbox environment',
      'Code examples in 5+ languages',
      'Searchable and well-organized',
    ],
    technicalNotes: 'Leverage Swagger/OpenAPI tooling, maintain spec in code',
    designNotes: 'Dark mode documentation site with syntax highlighting',
    estimatedEffort: 'medium',
    confidence: 85,
    evidenceCount: 8,
  },
  {
    id: 'prd-3',
    title: 'Horizontal Scaling & Reliability',
    userStory: 'As a DevOps engineer, I want the system to handle 10,000+ concurrent users without degradation',
    acceptanceCriteria: [
      'Auth system stateless',
      '<100ms p95 latency at peak load',
      'Zero downtime deployments',
      'Regional failover support',
    ],
    technicalNotes: 'Refactor session storage, implement circuit breakers, add distributed tracing',
    designNotes: 'N/A (infrastructure)',
    estimatedEffort: 'very-high',
    confidence: 94,
    evidenceCount: 35,
  },
];

/**
 * Mock Roadmap Items
 */
const mockRoadmapItems: RoadmapData[] = [
  {
    id: 'roadmap-1',
    title: 'Salesforce Native Connector',
    description: 'First-class integration with Salesforce for automatic data sync',
    status: 'in_progress',
    quarter: 'Q1 2024',
    owner: 'Integration Team',
    confidence: 90,
    evidenceCount: 25,
    relatedFeatures: [],
  },
  {
    id: 'roadmap-2',
    title: 'API Documentation Portal Launch',
    description: 'Interactive API docs with sandbox environment',
    status: 'in_progress',
    quarter: 'Q1 2024',
    owner: 'Developer Experience',
    confidence: 85,
    evidenceCount: 8,
    relatedFeatures: [],
  },
  {
    id: 'roadmap-3',
    title: 'Enterprise Scaling Initiative',
    description: 'Full infrastructure redesign for 10k+ concurrent users',
    status: 'backlog',
    quarter: 'Q2 2024',
    owner: 'Infrastructure Team',
    confidence: 94,
    evidenceCount: 35,
    relatedFeatures: [],
  },
];

/**
 * Build mock nodes array
 */
export const MOCK_NODES: GraphNode[] = [
  // Customer Quotes
  ...mockQuotes.map((data) => ({
    id: data.id,
    data,
    type: 'customerQuote' as const,
    position: { x: 0, y: 0 }, // Will be calculated by layout
  })),
  // Pain Points
  ...mockPainPoints.map((data) => ({
    id: data.id,
    data,
    type: 'painPoint' as const,
    position: { x: 0, y: 0 },
  })),
  // Themes
  ...mockThemes.map((data) => ({
    id: data.id,
    data,
    type: 'theme' as const,
    position: { x: 0, y: 0 },
  })),
  // Personas
  ...mockPersonas.map((data) => ({
    id: data.id,
    data,
    type: 'persona' as const,
    position: { x: 0, y: 0 },
  })),
  // Sentiment
  ...mockSentiment.map((data) => ({
    id: data.id,
    data,
    type: 'sentiment' as const,
    position: { x: 0, y: 0 },
  })),
  // Feature Requests
  ...mockFeatureRequests.map((data) => ({
    id: data.id,
    data,
    type: 'featureRequest' as const,
    position: { x: 0, y: 0 },
  })),
  // Business Impact
  ...mockBusinessImpact.map((data) => ({
    id: data.id,
    data,
    type: 'businessImpact' as const,
    position: { x: 0, y: 0 },
  })),
  // Frequency
  ...mockFrequency.map((data) => ({
    id: data.id,
    data,
    type: 'frequency' as const,
    position: { x: 0, y: 0 },
  })),
  // Opportunities
  ...mockOpportunities.map((data) => ({
    id: data.id,
    data,
    type: 'opportunity' as const,
    position: { x: 0, y: 0 },
  })),
  // Priorities
  ...mockPriorities.map((data) => ({
    id: data.id,
    data,
    type: 'priority' as const,
    position: { x: 0, y: 0 },
  })),
  // PRDs
  ...mockPRDs.map((data) => ({
    id: data.id,
    data,
    type: 'prd' as const,
    position: { x: 0, y: 0 },
  })),
  // Roadmap
  ...mockRoadmapItems.map((data) => ({
    id: data.id,
    data,
    type: 'roadmap' as const,
    position: { x: 0, y: 0 },
  })),
];

/**
 * Build mock edges - connections between nodes following the pipeline
 */
export const MOCK_EDGES: ConfidenceEdge[] = [
  // Quote -> Pain Points
  { id: 'e-quote-1-pain-1', source: 'quote-1', target: 'pain-1', data: { confidence: 95, strength: 'strong' } },
  { id: 'e-quote-2-pain-2', source: 'quote-2', target: 'pain-2', data: { confidence: 88, strength: 'strong' } },
  { id: 'e-quote-3-pain-3', source: 'quote-3', target: 'pain-3', data: { confidence: 92, strength: 'strong' } },
  { id: 'e-quote-4-pain-4', source: 'quote-4', target: 'pain-4', data: { confidence: 85, strength: 'strong' } },
  { id: 'e-quote-6-pain-5', source: 'quote-6', target: 'pain-5', data: { confidence: 82, strength: 'strong' } },
  { id: 'e-quote-7-pain-6', source: 'quote-7', target: 'pain-6', data: { confidence: 98, strength: 'strong' } },
  { id: 'e-quote-8-pain-7', source: 'quote-8', target: 'pain-7', data: { confidence: 78, strength: 'moderate' } },

  // Pain Points -> Themes
  { id: 'e-pain-1-theme-1', source: 'pain-1', target: 'theme-1', data: { confidence: 94, strength: 'strong' } },
  { id: 'e-pain-2-theme-2', source: 'pain-2', target: 'theme-2', data: { confidence: 88, strength: 'strong' } },
  { id: 'e-pain-3-theme-3', source: 'pain-3', target: 'theme-3', data: { confidence: 95, strength: 'strong' } },
  { id: 'e-pain-4-theme-4', source: 'pain-4', target: 'theme-4', data: { confidence: 85, strength: 'strong' } },
  { id: 'e-pain-5-theme-6', source: 'pain-5', target: 'theme-6', data: { confidence: 82, strength: 'moderate' } },
  { id: 'e-pain-6-theme-5', source: 'pain-6', target: 'theme-5', data: { confidence: 95, strength: 'strong' } },
  { id: 'e-pain-7-theme-7', source: 'pain-7', target: 'theme-7', data: { confidence: 80, strength: 'moderate' } },

  // Themes -> Personas
  { id: 'e-theme-1-persona-1', source: 'theme-1', target: 'persona-1', data: { confidence: 88, strength: 'strong' } },
  { id: 'e-theme-1-persona-3', source: 'theme-1', target: 'persona-3', data: { confidence: 82, strength: 'moderate' } },
  { id: 'e-theme-2-persona-2', source: 'theme-2', target: 'persona-2', data: { confidence: 85, strength: 'strong' } },
  { id: 'e-theme-3-persona-3', source: 'theme-3', target: 'persona-3', data: { confidence: 92, strength: 'strong' } },
  { id: 'e-theme-4-persona-4', source: 'theme-4', target: 'persona-4', data: { confidence: 82, strength: 'moderate' } },
  { id: 'e-theme-6-persona-5', source: 'theme-6', target: 'persona-5', data: { confidence: 78, strength: 'moderate' } },
  { id: 'e-theme-7-persona-4', source: 'theme-7', target: 'persona-4', data: { confidence: 75, strength: 'weak' } },

  // Pain Points -> Sentiment
  { id: 'e-pain-1-sentiment-1', source: 'pain-1', target: 'sentiment-1', data: { confidence: 95, strength: 'strong' } },
  { id: 'e-pain-2-sentiment-2', source: 'pain-2', target: 'sentiment-2', data: { confidence: 88, strength: 'strong' } },
  { id: 'e-pain-3-sentiment-3', source: 'pain-3', target: 'sentiment-3', data: { confidence: 92, strength: 'strong' } },
  { id: 'e-pain-4-sentiment-4', source: 'pain-4', target: 'sentiment-4', data: { confidence: 85, strength: 'strong' } },
  { id: 'e-quote-5-sentiment-5', source: 'quote-5', target: 'sentiment-5', data: { confidence: 90, strength: 'strong' } },

  // Pain Points -> Frequency
  { id: 'e-pain-1-freq-1', source: 'pain-1', target: 'freq-1', data: { confidence: 95, strength: 'strong' } },
  { id: 'e-pain-2-freq-2', source: 'pain-2', target: 'freq-2', data: { confidence: 88, strength: 'strong' } },
  { id: 'e-pain-3-freq-3', source: 'pain-3', target: 'freq-3', data: { confidence: 92, strength: 'strong' } },
  { id: 'e-pain-4-freq-4', source: 'pain-4', target: 'freq-4', data: { confidence: 85, strength: 'strong' } },

  // Pain Points -> Feature Requests
  { id: 'e-pain-1-feature-1', source: 'pain-1', target: 'feature-1', data: { confidence: 94, strength: 'strong' } },
  { id: 'e-pain-2-feature-2', source: 'pain-2', target: 'feature-2', data: { confidence: 88, strength: 'strong' } },
  { id: 'e-pain-3-feature-3', source: 'pain-3', target: 'feature-3', data: { confidence: 92, strength: 'strong' } },
  { id: 'e-pain-4-feature-4', source: 'pain-4', target: 'feature-4', data: { confidence: 85, strength: 'strong' } },
  { id: 'e-pain-5-feature-5', source: 'pain-5', target: 'feature-5', data: { confidence: 82, strength: 'moderate' } },
  { id: 'e-pain-6-feature-6', source: 'pain-6', target: 'feature-6', data: { confidence: 98, strength: 'strong' } },
  { id: 'e-pain-7-feature-7', source: 'pain-7', target: 'feature-7', data: { confidence: 78, strength: 'moderate' } },

  // Feature Requests -> Business Impact
  { id: 'e-feature-1-impact-1', source: 'feature-1', target: 'impact-1', data: { confidence: 90, strength: 'strong' } },
  { id: 'e-feature-2-impact-2', source: 'feature-2', target: 'impact-2', data: { confidence: 82, strength: 'moderate' } },
  { id: 'e-feature-3-impact-3', source: 'feature-3', target: 'impact-3', data: { confidence: 95, strength: 'strong' } },
  { id: 'e-feature-6-impact-3', source: 'feature-6', target: 'impact-3', data: { confidence: 94, strength: 'strong' } },

  // Business Impact -> Opportunities
  { id: 'e-impact-1-opp-1', source: 'impact-1', target: 'opp-1', data: { confidence: 92, strength: 'strong' } },
  { id: 'e-impact-2-opp-2', source: 'impact-2', target: 'opp-2', data: { confidence: 85, strength: 'strong' } },
  { id: 'e-impact-3-opp-3', source: 'impact-3', target: 'opp-3', data: { confidence: 95, strength: 'strong' } },

  // Feature Requests -> Priorities
  { id: 'e-feature-1-priority-1', source: 'feature-1', target: 'priority-1', data: { confidence: 92, strength: 'strong' } },
  { id: 'e-feature-2-priority-2', source: 'feature-2', target: 'priority-2', data: { confidence: 85, strength: 'strong' } },
  { id: 'e-feature-3-priority-3', source: 'feature-3', target: 'priority-3', data: { confidence: 95, strength: 'strong' } },
  { id: 'e-feature-4-priority-4', source: 'feature-4', target: 'priority-4', data: { confidence: 80, strength: 'moderate' } },
  { id: 'e-feature-5-priority-5', source: 'feature-5', target: 'priority-5', data: { confidence: 78, strength: 'moderate' } },

  // Priorities -> PRDs
  { id: 'e-priority-1-prd-1', source: 'priority-1', target: 'prd-1', data: { confidence: 90, strength: 'strong' } },
  { id: 'e-priority-2-prd-2', source: 'priority-2', target: 'prd-2', data: { confidence: 85, strength: 'strong' } },
  { id: 'e-priority-3-prd-3', source: 'priority-3', target: 'prd-3', data: { confidence: 94, strength: 'strong' } },

  // PRDs -> Roadmap
  { id: 'e-prd-1-roadmap-1', source: 'prd-1', target: 'roadmap-1', data: { confidence: 90, strength: 'strong' } },
  { id: 'e-prd-2-roadmap-2', source: 'prd-2', target: 'roadmap-2', data: { confidence: 85, strength: 'strong' } },
  { id: 'e-prd-3-roadmap-3', source: 'prd-3', target: 'roadmap-3', data: { confidence: 94, strength: 'strong' } },
];
