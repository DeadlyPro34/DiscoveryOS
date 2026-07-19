/**
 * Executive Intelligence Center Types
 */

/**
 * KPI Data for Executive Summary cards
 */
export interface KPIData {
  id: string;
  title: string;
  value: number;
  formattedValue: string;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'pink';
  period: 'today' | 'week' | 'month';
}

/**
 * Product Opportunity for Executive view
 */
export interface OpportunityCard {
  id: string;
  title: string;
  description: string;
  opportunityScore: number; // 0-100
  riceScore: number; // 0-100 (Reach, Impact, Confidence, Effort)
  confidence: number; // 0-100
  businessImpact: 'high' | 'medium' | 'low';
  estimatedEffort: 'low' | 'medium' | 'high' | 'very-high';
  priority: 'critical' | 'high' | 'medium' | 'low';
  evidenceCount: number;
  primaryPersona: string;
  relatedThemes: string[];
  recommendation: string;
  customersSaying: string[];
}

/**
 * Executive Insight for insights feed
 */
export interface ExecutiveInsight {
  id: string;
  title: string;
  description: string;
  type: 'pain_point' | 'feature_request' | 'trend' | 'opportunity' | 'risk';
  confidence: number; // 0-100
  priority: 'critical' | 'high' | 'medium' | 'low';
  evidenceCount: number;
  relatedPersonas: string[];
  timestamp: Date;
  sentiment: 'positive' | 'neutral' | 'negative' | 'mixed';
  theme: string;
}

/**
 * AI Agent Activity for monitoring
 */
export interface AIActivityLog {
  id: string;
  agentName:
    | 'Collector'
    | 'Insight'
    | 'Theme'
    | 'Persona'
    | 'Sentiment'
    | 'Impact'
    | 'Opportunity'
    | 'PRD';
  status: 'success' | 'processing' | 'error' | 'pending';
  executionTime: number; // milliseconds
  documentsProcessed: number;
  confidence: number; // 0-100
  timestamp: Date;
  message?: string;
}

/**
 * Report metadata
 */
export interface ReportData {
  id: string;
  title: string;
  type: 'executive' | 'discovery' | 'roadmap' | 'prd' | 'research' | 'custom';
  createdDate: Date;
  lastModified: Date;
  createdBy: string;
  confidence: number; // 0-100
  status: 'draft' | 'final' | 'archived';
  sections?: string[];
  pageCount?: number;
}

/**
 * PRD (Product Requirements Document) structure
 */
export interface PRDStructure {
  id: string;
  title: string;
  problemStatement: string;
  background: string;
  researchSummary: string;
  customerQuotes: Array<{
    quote: string;
    author: string;
    date: Date;
  }>;
  supportingEvidence: Array<{
    title: string;
    count: number;
    type: string;
  }>;
  businessImpact: {
    revenue?: string;
    retention?: string;
    adoption?: string;
    nps?: string;
  };
  userStories: Array<{
    id: string;
    story: string;
    acceptanceCriteria: string[];
  }>;
  acceptanceCriteria: string[];
  successMetrics: Array<{
    metric: string;
    target: string;
  }>;
  dependencies: string[];
  risks: Array<{
    risk: string;
    mitigation: string;
  }>;
  timeline: {
    estimatedDuration: string;
    phases: Array<{
      name: string;
      duration: string;
    }>;
  };
  priority: 'critical' | 'high' | 'medium' | 'low';
}

/**
 * Roadmap Item for Kanban board
 */
export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: 'now' | 'next' | 'later' | 'backlog';
  priority: 'critical' | 'high' | 'medium' | 'low';
  riceScore: number; // 0-100
  confidence: number; // 0-100
  businessImpact: 'high' | 'medium' | 'low';
  estimatedEffort: 'low' | 'medium' | 'high' | 'very-high';
  evidenceCount: number;
  relatedThemes: string[];
  dependencies: string[];
  owner?: string;
  dueDate?: Date;
}

/**
 * Search result
 */
export interface SearchResult {
  id: string;
  type: 'insight' | 'opportunity' | 'report' | 'roadmap_item' | 'persona';
  title: string;
  description: string;
  relevance: number; // 0-100
}

/**
 * Notification
 */
export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

/**
 * Chart data for analytics
 */
export interface ChartDataPoint {
  name: string;
  value: number;
  percentage?: number;
}

/**
 * Executive Summary Analytics
 */
export interface ExecutiveAnalytics {
  kpis: KPIData[];
  topOpportunities: OpportunityCard[];
  insights: ExecutiveInsight[];
  aiActivity: AIActivityLog[];
  chartData: {
    painPointsByTheme: ChartDataPoint[];
    featureRequestsByCategory: ChartDataPoint[];
    personaDistribution: ChartDataPoint[];
    sentimentDistribution: ChartDataPoint[];
    priorityDistribution: ChartDataPoint[];
    monthlyTrend: Array<{ month: string; value: number }>;
  };
}
