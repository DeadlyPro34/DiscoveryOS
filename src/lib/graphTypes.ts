/**
 * Product Evidence Graph - Type Definitions
 * Defines all TypeScript interfaces for the graph structure
 */

import type { Node as FlowNode, Edge as FlowEdge } from 'react-flow-renderer';

/**
 * Sentiment levels for customer quotes
 */
export type SentimentLevel = 'positive' | 'neutral' | 'negative' | 'mixed';

/**
 * Priority levels for roadmap items
 */
export type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';

/**
 * Frequency assessment
 */
export type FrequencyLevel = 'rare' | 'occasional' | 'frequent' | 'universal';

/**
 * Status indicators for various nodes
 */
export type StatusType = 'backlog' | 'in_progress' | 'delivered' | 'archived';

/**
 * Node type identifiers for the graph
 */
export type GraphNodeType =
  | 'customerQuote'
  | 'painPoint'
  | 'theme'
  | 'persona'
  | 'sentiment'
  | 'featureRequest'
  | 'businessImpact'
  | 'frequency'
  | 'opportunity'
  | 'priority'
  | 'prd'
  | 'roadmap';

/**
 * Customer Quote node data
 * Entry point: Raw customer feedback
 */
export interface CustomerQuoteData {
  id: string;
  quote: string;
  customerId: string;
  customerName: string;
  date: Date;
  sourceType: 'interview' | 'survey' | 'support' | 'feedback';
  confidence: number; // 0-100
  evidenceCount: number; // Number of similar quotes
}

/**
 * Pain Point node data
 * What problem is the customer facing?
 */
export interface PainPointData {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  confidence: number; // 0-100
  evidenceCount: number;
  affectedCustomers: number;
  quotes: string[]; // IDs of related quotes
}

/**
 * Theme node data
 * Category/grouping of the pain point
 */
export interface ThemeData {
  id: string;
  name: string;
  description: string;
  category:
    | 'performance'
    | 'usability'
    | 'integration'
    | 'reliability'
    | 'cost'
    | 'security'
    | 'scalability'
    | 'other';
  confidence: number; // 0-100
  evidenceCount: number;
  relatedThemes: string[]; // IDs of other themes
}

/**
 * Persona node data
 * Which user segment experiences this?
 */
export interface PersonaData {
  id: string;
  name: string;
  title: string;
  industry?: string;
  company?: string;
  confidence: number; // 0-100
  evidenceCount: number;
  description: string;
  painPoints: string[]; // IDs of pain points
}

/**
 * Sentiment node data
 * Emotional tone of the feedback
 */
export interface SentimentData {
  id: string;
  sentiment: SentimentLevel;
  score: number; // -1 to 1
  confidence: number; // 0-100
  evidenceCount: number;
  reasoning: string;
  emotionalDrivers: string[]; // e.g., "frustration", "excitement"
}

/**
 * Feature Request node data
 * What feature would solve this?
 */
export interface FeatureRequestData {
  id: string;
  title: string;
  description: string;
  proposedSolution: string;
  confidence: number; // 0-100
  evidenceCount: number;
  implementationEffort: 'low' | 'medium' | 'high' | 'very-high';
}

/**
 * Business Impact node data
 * What is the business value?
 */
export interface BusinessImpactData {
  id: string;
  impactAreas: Array<{
    area: 'revenue' | 'retention' | 'adoption' | 'nps' | 'cost-reduction';
    estimatedValue: number;
    confidence: number;
  }>;
  totalImpactScore: number; // 0-100
  estimatedImplementationCost: number; // Relative score
  roiScore: number; // Impact / Cost
  confidence: number; // 0-100
  evidenceCount: number;
}

/**
 * Frequency node data
 * How often does this occur?
 */
export interface FrequencyData {
  id: string;
  frequency: FrequencyLevel;
  mentionCount: number;
  percentageOfCustomers: number; // 0-100
  trend: 'increasing' | 'stable' | 'decreasing';
  confidence: number; // 0-100
  evidenceCount: number;
}

/**
 * Opportunity node data
 * Market/strategic opportunity
 */
export interface OpportunityData {
  id: string;
  title: string;
  description: string;
  opportunityType: 'differentiation' | 'retention' | 'revenue' | 'efficiency';
  marketSize?: string;
  competitiveAdvantage: string;
  confidence: number; // 0-100
  evidenceCount: number;
}

/**
 * Priority node data
 * How should this be prioritized?
 */
export interface PriorityData {
  id: string;
  priority: PriorityLevel;
  priorityScore: number; // 0-100
  justification: string;
  dependsOn: string[]; // IDs of other priority nodes
  blockedBy: string[]; // IDs of blockers
  confidence: number; // 0-100
  evidenceCount: number;
}

/**
 * PRD (Product Requirements Document) node data
 * Structured requirements
 */
export interface PRDData {
  id: string;
  title: string;
  userStory: string;
  acceptanceCriteria: string[];
  technicalNotes?: string;
  designNotes?: string;
  estimatedEffort: 'low' | 'medium' | 'high' | 'very-high';
  confidence: number; // 0-100
  evidenceCount: number;
}

/**
 * Roadmap Item node data
 * Final committed feature for roadmap
 */
export interface RoadmapData {
  id: string;
  title: string;
  description: string;
  status: StatusType;
  quarter?: string; // e.g., "Q1 2024"
  owner?: string;
  confidence: number; // 0-100
  evidenceCount: number;
  relatedFeatures: string[]; // IDs of related roadmap items
}

/**
 * Union type for all node data types
 */
export type NodeData =
  | CustomerQuoteData
  | PainPointData
  | ThemeData
  | PersonaData
  | SentimentData
  | FeatureRequestData
  | BusinessImpactData
  | FrequencyData
  | OpportunityData
  | PriorityData
  | PRDData
  | RoadmapData;

/**
 * Extended React Flow Node with our custom data
 */
export interface GraphNode extends FlowNode {
  type: GraphNodeType;
  data: NodeData;
  style?: React.CSSProperties;
}

/**
 * Confidence edge type with indicators
 */
export interface ConfidenceEdge extends FlowEdge {
  data?: {
    confidence: number; // 0-100
    label?: string;
    strength: 'weak' | 'moderate' | 'strong';
  };
}

/**
 * Complete graph state
 */
export interface GraphState {
  nodes: GraphNode[];
  edges: ConfidenceEdge[];
  selectedNodeId: string | null;
  filteredNodeIds: Set<string>;
  searchTerm: string;
  filterCriteria: FilterCriteria;
}

/**
 * Filter criteria for the graph
 */
export interface FilterCriteria {
  nodeTypes?: GraphNodeType[];
  personaIds?: string[];
  themeIds?: string[];
  priorityLevels?: PriorityLevel[];
  sentimentLevels?: SentimentLevel[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  minConfidence?: number; // 0-100
}

/**
 * Node statistics for analytics
 */
export interface NodeStatistics {
  nodeId: string;
  nodeType: GraphNodeType;
  connections: number;
  downstreamNodes: number;
  upstreamNodes: number;
  confidence: number;
  evidenceCount: number;
  lastUpdated: Date;
}

/**
 * Graph path (chain from quote to roadmap)
 */
export interface GraphPath {
  pathId: string;
  nodes: string[]; // Array of node IDs in order
  edges: string[]; // Array of edge IDs
  confidence: number; // Average confidence along path
  evidenceCount: number;
}

/**
 * Timeline event for inspector
 */
export interface TimelineEvent {
  timestamp: Date;
  eventType: 'created' | 'updated' | 'referenced' | 'prioritized';
  nodeId: string;
  description: string;
  actor?: string;
}

/**
 * AI explanation for a recommendation
 */
export interface AIExplanation {
  nodeId: string;
  explanation: string;
  reasoning: string[];
  confidence: number;
  relatedNodes: string[];
  suggestedActions: string[];
  timestamp: Date;
}

/**
 * Recommendation based on graph analysis
 */
export interface Recommendation {
  id: string;
  type:
    | 'prioritize'
    | 'investigate'
    | 'implement'
    | 'remove'
    | 'combine'
    | 'defer';
  title: string;
  description: string;
  affectedNodes: string[];
  confidence: number;
  rationale: string;
  action?: () => void;
}
