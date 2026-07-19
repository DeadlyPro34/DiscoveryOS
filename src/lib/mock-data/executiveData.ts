/**
 * Executive Intelligence Center - Mock Data
 * Realistic data aligned with Evidence Graph
 */

import type {
  KPIData,
  OpportunityCard,
  ExecutiveInsight,
  AIActivityLog,
  ReportData,
  RoadmapItem,
  ChartDataPoint,
} from '@/types/executive';

/**
 * KPI Data for Executive Summary
 */
export const mockKPIs: KPIData[] = [
  {
    id: 'kpi-1',
    title: 'Customer Conversations',
    value: 1247,
    formattedValue: '1.2K',
    trend: 'up',
    trendPercentage: 12.5,
    icon: 'MessageSquare',
    color: 'blue',
    period: 'month',
  },
  {
    id: 'kpi-2',
    title: 'Insights Extracted',
    value: 856,
    formattedValue: '856',
    trend: 'up',
    trendPercentage: 23.4,
    icon: 'Lightbulb',
    color: 'green',
    period: 'month',
  },
  {
    id: 'kpi-3',
    title: 'High Priority Issues',
    value: 34,
    formattedValue: '34',
    trend: 'down',
    trendPercentage: -8.2,
    icon: 'AlertTriangle',
    color: 'red',
    period: 'month',
  },
  {
    id: 'kpi-4',
    title: 'Feature Requests',
    value: 428,
    formattedValue: '428',
    trend: 'up',
    trendPercentage: 15.8,
    icon: 'Zap',
    color: 'purple',
    period: 'month',
  },
  {
    id: 'kpi-5',
    title: 'Active Personas',
    value: 12,
    formattedValue: '12',
    trend: 'stable',
    trendPercentage: 0,
    icon: 'Users',
    color: 'orange',
    period: 'month',
  },
  {
    id: 'kpi-6',
    title: 'AI Confidence',
    value: 87,
    formattedValue: '87%',
    trend: 'up',
    trendPercentage: 4.2,
    icon: 'Brain',
    color: 'pink',
    period: 'month',
  },
  {
    id: 'kpi-7',
    title: 'Customer Satisfaction',
    value: 8.7,
    formattedValue: '8.7/10',
    trend: 'up',
    trendPercentage: 5.3,
    icon: 'Smile',
    color: 'green',
    period: 'month',
  },
  {
    id: 'kpi-8',
    title: 'Processing Success Rate',
    value: 98,
    formattedValue: '98%',
    trend: 'stable',
    trendPercentage: 0.5,
    icon: 'CheckCircle',
    color: 'green',
    period: 'month',
  },
];

/**
 * Top Product Opportunities
 */
export const mockOpportunities: OpportunityCard[] = [
  {
    id: 'opp-1',
    title: 'Enterprise SSO Integration',
    description:
      'Implement Single Sign-On for enterprise customers. 54 requests from enterprise segment. Critical for landing deals worth $2M+ ARR.',
    opportunityScore: 94,
    riceScore: 92,
    confidence: 94,
    businessImpact: 'high',
    estimatedEffort: 'high',
    priority: 'critical',
    evidenceCount: 54,
    primaryPersona: 'Enterprise Security Officer',
    relatedThemes: ['security', 'integration', 'scalability'],
    recommendation:
      'High priority. Strong market demand signals and clear ROI. Recommend for Q1 2024 roadmap.',
    customersSaying: [
      'We need SSO for compliance requirements',
      'SSO is a blocker for adoption across our organization',
      'All our enterprise tools support SSO, yours should too',
    ],
  },
  {
    id: 'opp-2',
    title: 'API Rate Limit Increase',
    description:
      'Increase default rate limits from 100 to 1000 req/min. Elena Rodriguez and 23 other power users throttled. Blocking workflow automation.',
    opportunityScore: 87,
    riceScore: 89,
    confidence: 92,
    businessImpact: 'high',
    estimatedEffort: 'medium',
    priority: 'high',
    evidenceCount: 24,
    primaryPersona: 'API Developer',
    relatedThemes: ['scalability', 'integration'],
    recommendation:
      'Quick win. Low effort, high impact. Implement in current sprint.',
    customersSaying: [
      'We need at least 10x the current limits',
      'Rate limiting is killing our productivity',
      'This is the main thing preventing us from building on your API',
    ],
  },
  {
    id: 'opp-3',
    title: 'Real-time Collaboration Features',
    description:
      'Live cursor tracking, shared workspaces, and real-time updates. David Park reports distributed team collaboration pain. 18 mentions in surveys.',
    opportunityScore: 79,
    riceScore: 81,
    confidence: 85,
    businessImpact: 'medium',
    estimatedEffort: 'very-high',
    priority: 'high',
    evidenceCount: 18,
    primaryPersona: 'Product Manager (Distributed Team)',
    relatedThemes: ['usability', 'integration'],
    recommendation:
      'Strategic feature for product differentiation. Plan for Q2 2024.',
    customersSaying: [
      'Real-time collaboration would be a game-changer',
      'We currently use Slack threads for collaboration',
      'Live updates would save us hours each week',
    ],
  },
  {
    id: 'opp-4',
    title: 'Advanced Export Options',
    description:
      'Support Parquet and JSON exports in addition to CSV. James Wilson and team need Parquet for data warehouse. 7 customers affected.',
    opportunityScore: 72,
    riceScore: 76,
    confidence: 82,
    businessImpact: 'medium',
    estimatedEffort: 'medium',
    priority: 'medium',
    evidenceCount: 7,
    primaryPersona: 'Data Engineer',
    relatedThemes: ['integration'],
    recommendation:
      'Straightforward feature. Good for customer retention. Schedule for Q1 roadmap.',
    customersSaying: [
      'We need Parquet format for our data pipeline',
      'JSON export would save us a data transformation step',
      'CSV is too limited for our use case',
    ],
  },
  {
    id: 'opp-5',
    title: 'API Documentation Update',
    description:
      'Overhaul API docs with current endpoints and examples. Mike Johnson spent a week on undocumented features. 12 similar support tickets.',
    opportunityScore: 68,
    riceScore: 74,
    confidence: 88,
    businessImpact: 'medium',
    estimatedEffort: 'low',
    priority: 'high',
    evidenceCount: 12,
    primaryPersona: 'API Developer',
    relatedThemes: ['usability'],
    recommendation:
      'Quick improvement for developer experience. Assign to tech writer in current sprint.',
    customersSaying: [
      'The documentation is so outdated',
      'We spent a week implementing something that already existed',
      'Missing examples for common use cases',
    ],
  },
];

/**
 * Executive Insights Feed
 */
export const mockInsights: ExecutiveInsight[] = [
  {
    id: 'ins-1',
    title: 'Enterprise SSO Urgency Rising',
    description:
      'Enterprise segment requesting SSO integration 54 times. Frequency increasing 23% month-over-month. Critical for enterprise deals.',
    type: 'opportunity',
    confidence: 94,
    priority: 'critical',
    evidenceCount: 54,
    relatedPersonas: ['Enterprise Security Officer', 'IT Administrator'],
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    sentiment: 'negative',
    theme: 'Security',
  },
  {
    id: 'ins-2',
    title: 'Authentication System Scalability Issue',
    description:
      'Sophie Martin reports crashes at 1000+ concurrent users. Blocker for enterprise adoption. Affects 3 major prospects.',
    type: 'pain_point',
    confidence: 92,
    priority: 'critical',
    evidenceCount: 15,
    relatedPersonas: ['Enterprise Architect', 'DevOps Engineer'],
    timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    sentiment: 'negative',
    theme: 'Reliability',
  },
  {
    id: 'ins-3',
    title: 'API Developer Satisfaction High',
    description:
      'Analytics dashboard praised for performance insights. 40% latency reduction achieved by customers. Positive sentiment trend.',
    type: 'trend',
    confidence: 90,
    priority: 'medium',
    evidenceCount: 10,
    relatedPersonas: ['API Developer', 'Platform Engineer'],
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    sentiment: 'positive',
    theme: 'Performance',
  },
  {
    id: 'ins-4',
    title: 'Data Export Format Gap',
    description:
      'Multiple data engineers requesting Parquet and JSON formats. Current CSV export blocking integration workflows.',
    type: 'feature_request',
    confidence: 82,
    priority: 'high',
    evidenceCount: 7,
    relatedPersonas: ['Data Engineer', 'Data Scientist'],
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), // 4 days ago
    sentiment: 'neutral',
    theme: 'Integration',
  },
  {
    id: 'ins-5',
    title: 'Documentation Gaps Impacting Adoption',
    description:
      'Developers spending extra time due to outdated API documentation. 12 support tickets directly caused by documentation issues.',
    type: 'pain_point',
    confidence: 88,
    priority: 'high',
    evidenceCount: 12,
    relatedPersonas: ['API Developer'],
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    sentiment: 'negative',
    theme: 'Usability',
  },
  {
    id: 'ins-6',
    title: 'Distributed Team Collaboration Gap',
    description:
      'Product teams in distributed environments lack real-time collaboration. 18 teams requesting live features.',
    type: 'feature_request',
    confidence: 85,
    priority: 'medium',
    evidenceCount: 18,
    relatedPersonas: ['Product Manager (Distributed Team)', 'Team Lead'],
    timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 6 days ago
    sentiment: 'neutral',
    theme: 'Usability',
  },
];

/**
 * AI Agent Activity Log
 */
export const mockAIActivity: AIActivityLog[] = [
  {
    id: 'ai-1',
    agentName: 'Collector',
    status: 'success',
    executionTime: 2340,
    documentsProcessed: 156,
    confidence: 94,
    timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    message: 'Successfully collected 156 documents from 3 sources',
  },
  {
    id: 'ai-2',
    agentName: 'Insight',
    status: 'success',
    executionTime: 4120,
    documentsProcessed: 156,
    confidence: 89,
    timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    message: 'Extracted 76 unique insights from documents',
  },
  {
    id: 'ai-3',
    agentName: 'Theme',
    status: 'success',
    executionTime: 3450,
    documentsProcessed: 76,
    confidence: 91,
    timestamp: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
    message: 'Categorized insights into 8 themes',
  },
  {
    id: 'ai-4',
    agentName: 'Persona',
    status: 'success',
    executionTime: 2890,
    documentsProcessed: 156,
    confidence: 87,
    timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    message: 'Identified 12 distinct personas',
  },
  {
    id: 'ai-5',
    agentName: 'Sentiment',
    status: 'processing',
    executionTime: 0,
    documentsProcessed: 0,
    confidence: 0,
    timestamp: new Date(),
    message: 'Analyzing sentiment across all insights...',
  },
  {
    id: 'ai-6',
    agentName: 'Impact',
    status: 'pending',
    executionTime: 0,
    documentsProcessed: 0,
    confidence: 0,
    timestamp: new Date(Date.now() + 60 * 1000), // Pending
  },
  {
    id: 'ai-7',
    agentName: 'Opportunity',
    status: 'pending',
    executionTime: 0,
    documentsProcessed: 0,
    confidence: 0,
    timestamp: new Date(Date.now() + 120 * 1000), // Pending
  },
  {
    id: 'ai-8',
    agentName: 'PRD',
    status: 'pending',
    executionTime: 0,
    documentsProcessed: 0,
    confidence: 0,
    timestamp: new Date(Date.now() + 180 * 1000), // Pending
  },
];

/**
 * Chart Data - Pain Points by Theme
 */
export const painPointsByTheme: ChartDataPoint[] = [
  { name: 'Scalability', value: 156, percentage: 28 },
  { name: 'Performance', value: 134, percentage: 24 },
  { name: 'Integration', value: 98, percentage: 18 },
  { name: 'Security', value: 87, percentage: 16 },
  { name: 'Usability', value: 54, percentage: 10 },
  { name: 'Reliability', value: 43, percentage: 8 },
];

/**
 * Chart Data - Feature Requests by Category
 */
export const featureRequestsByCategory: ChartDataPoint[] = [
  { name: 'API Enhancements', value: 134 },
  { name: 'Export Options', value: 98 },
  { name: 'Auth & SSO', value: 87 },
  { name: 'Real-time Features', value: 76 },
  { name: 'Reporting', value: 65 },
  { name: 'Mobile', value: 43 },
];

/**
 * Chart Data - Persona Distribution
 */
export const personaDistribution: ChartDataPoint[] = [
  { name: 'Enterprise Architect', value: 234, percentage: 20 },
  { name: 'API Developer', value: 198, percentage: 17 },
  { name: 'Product Manager', value: 187, percentage: 16 },
  { name: 'Data Engineer', value: 156, percentage: 13 },
  { name: 'Security Officer', value: 145, percentage: 12 },
  { name: 'DevOps Engineer', value: 134, percentage: 12 },
  { name: 'Other', value: 110, percentage: 10 },
];

/**
 * Chart Data - Sentiment Distribution
 */
export const sentimentDistribution: ChartDataPoint[] = [
  { name: 'Positive', value: 387, percentage: 45 },
  { name: 'Neutral', value: 276, percentage: 32 },
  { name: 'Negative', value: 187, percentage: 22 },
  { name: 'Mixed', value: 34, percentage: 4 },
];

/**
 * Chart Data - Priority Distribution
 */
export const priorityDistribution: ChartDataPoint[] = [
  { name: 'Critical', value: 87, percentage: 15 },
  { name: 'High', value: 234, percentage: 41 },
  { name: 'Medium', value: 187, percentage: 33 },
  { name: 'Low', value: 65, percentage: 11 },
];

/**
 * Chart Data - Monthly Research Trend
 */
export const monthlyResearchTrend: Array<{ month: string; value: number }> = [
  { month: 'Jan', value: 240 },
  { month: 'Feb', value: 321 },
  { month: 'Mar', value: 287 },
  { month: 'Apr', value: 412 },
  { month: 'May', value: 489 },
  { month: 'Jun', value: 567 },
  { month: 'Jul', value: 645 },
  { month: 'Aug', value: 734 },
  { month: 'Sep', value: 821 },
  { month: 'Oct', value: 912 },
  { month: 'Nov', value: 856 },
  { month: 'Dec', value: 1024 },
];

/**
 * Reports metadata
 */
export const mockReports: ReportData[] = [
  {
    id: 'report-1',
    title: 'Q4 2024 Executive Summary',
    type: 'executive',
    createdDate: new Date('2024-11-15'),
    lastModified: new Date('2024-12-01'),
    createdBy: 'Sarah Chen',
    confidence: 94,
    status: 'final',
    pageCount: 24,
  },
  {
    id: 'report-2',
    title: 'Enterprise Market Discovery Report',
    type: 'discovery',
    createdDate: new Date('2024-11-20'),
    lastModified: new Date('2024-11-28'),
    createdBy: 'Mike Johnson',
    confidence: 91,
    status: 'final',
    pageCount: 18,
  },
  {
    id: 'report-3',
    title: '2025 Product Roadmap',
    type: 'roadmap',
    createdDate: new Date('2024-11-10'),
    lastModified: new Date('2024-12-02'),
    createdBy: 'Elena Rodriguez',
    confidence: 87,
    status: 'draft',
    pageCount: 12,
  },
  {
    id: 'report-4',
    title: 'SSO Integration - Product Requirements',
    type: 'prd',
    createdDate: new Date('2024-12-01'),
    lastModified: new Date('2024-12-02'),
    createdBy: 'David Park',
    confidence: 92,
    status: 'draft',
    pageCount: 8,
  },
  {
    id: 'report-5',
    title: 'API Rate Limiting Research',
    type: 'research',
    createdDate: new Date('2024-11-25'),
    lastModified: new Date('2024-11-30'),
    createdBy: 'Lisa Chen',
    confidence: 88,
    status: 'final',
    pageCount: 6,
  },
];

/**
 * Roadmap Items
 */
export const mockRoadmapItems: RoadmapItem[] = [
  {
    id: 'rm-1',
    title: 'Enterprise SSO Integration',
    description: 'Implement Single Sign-On support for enterprise customers',
    status: 'now',
    priority: 'critical',
    riceScore: 92,
    confidence: 94,
    businessImpact: 'high',
    estimatedEffort: 'high',
    evidenceCount: 54,
    relatedThemes: ['security', 'integration'],
    dependencies: [],
    owner: 'Alice Johnson',
    dueDate: new Date('2024-12-31'),
  },
  {
    id: 'rm-2',
    title: 'API Rate Limit Scaling',
    description: 'Increase default rate limits from 100 to 1000 req/min',
    status: 'now',
    priority: 'high',
    riceScore: 89,
    confidence: 92,
    businessImpact: 'high',
    estimatedEffort: 'medium',
    evidenceCount: 24,
    relatedThemes: ['scalability', 'integration'],
    dependencies: [],
    owner: 'Bob Smith',
    dueDate: new Date('2024-12-15'),
  },
  {
    id: 'rm-3',
    title: 'API Documentation Overhaul',
    description: 'Update API documentation with current endpoints and examples',
    status: 'now',
    priority: 'high',
    riceScore: 74,
    confidence: 88,
    businessImpact: 'medium',
    estimatedEffort: 'low',
    evidenceCount: 12,
    relatedThemes: ['usability'],
    dependencies: [],
    owner: 'Charlie Brown',
  },
  {
    id: 'rm-4',
    title: 'Real-time Collaboration',
    description: 'Live cursor tracking, shared workspaces, real-time updates',
    status: 'next',
    priority: 'high',
    riceScore: 81,
    confidence: 85,
    businessImpact: 'medium',
    estimatedEffort: 'very-high',
    evidenceCount: 18,
    relatedThemes: ['usability', 'integration'],
    dependencies: ['rm-2'],
    owner: 'Diana Ross',
    dueDate: new Date('2025-02-28'),
  },
  {
    id: 'rm-5',
    title: 'Advanced Export Formats',
    description: 'Support Parquet and JSON exports in addition to CSV',
    status: 'next',
    priority: 'medium',
    riceScore: 76,
    confidence: 82,
    businessImpact: 'medium',
    estimatedEffort: 'medium',
    evidenceCount: 7,
    relatedThemes: ['integration'],
    dependencies: [],
    owner: 'Eve Adams',
    dueDate: new Date('2025-01-31'),
  },
  {
    id: 'rm-6',
    title: 'Advanced Analytics Dashboard',
    description: 'New dashboard with custom metrics and real-time analytics',
    status: 'later',
    priority: 'medium',
    riceScore: 68,
    confidence: 78,
    businessImpact: 'medium',
    estimatedEffort: 'high',
    evidenceCount: 15,
    relatedThemes: ['usability', 'performance'],
    dependencies: ['rm-4'],
    owner: 'Frank Wilson',
  },
  {
    id: 'rm-7',
    title: 'Mobile App MVP',
    description: 'Native mobile app for iOS and Android',
    status: 'backlog',
    priority: 'low',
    riceScore: 45,
    confidence: 65,
    businessImpact: 'low',
    estimatedEffort: 'very-high',
    evidenceCount: 8,
    relatedThemes: ['usability'],
    dependencies: ['rm-4', 'rm-6'],
  },
];
