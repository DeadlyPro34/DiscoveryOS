/**
 * AI Workspace Types
 * Defines all TypeScript interfaces for the AI Product Manager workspace
 */

import type { SentimentLevel, PriorityLevel, FrequencyLevel, ThemeData, PersonaData } from '@/lib/graphTypes';

/**
 * Message role in conversation
 */
export type MessageRole = 'user' | 'assistant';

/**
 * Individual message in conversation
 */
export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  streaming?: boolean;
}

/**
 * Evidence supporting an AI response
 */
export interface EvidenceQuote {
  id: string;
  quote: string;
  source: string;
  customerName: string;
  date: Date;
  sentiment: SentimentLevel;
  confidence: number; // 0-100
  theme?: string;
  persona?: string;
}

/**
 * Structured AI response with evidence backing
 */
export interface AIResponse {
  id: string;
  summary: string;
  keyFindings: string[];
  supportingEvidence: EvidenceQuote[];
  confidence: number; // 0-100
  affectedPersonas: PersonaData[];
  relatedThemes: ThemeData[];
  businessImpact: string;
  priority: PriorityLevel;
  recommendation: string;
  suggestedFollowUps: string[];
}

/**
 * Single conversation session
 */
export interface Conversation {
  id: string;
  title: string;
  projectId?: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
}

/**
 * Project context for AI Workspace
 */
export interface AIWorkspaceProject {
  id: string;
  name: string;
  description?: string;
  uploadCount: number;
  evidenceCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Evidence panel data for right sidebar
 */
export interface EvidencePanelData {
  quotes: EvidenceQuote[];
  totalFrequency: FrequencyLevel;
  relatedPersonas: string[];
  relatedThemes: string[];
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
    mixed: number;
  };
  averageConfidence: number;
}

/**
 * Suggested follow-up question
 */
export interface FollowUpQuestion {
  id: string;
  question: string;
  category?: 'clarification' | 'deeper-dive' | 'related';
}

/**
 * Agent execution status
 */
export interface AgentStatus {
  isActive: boolean;
  currentAgent?: string;
  progress: number; // 0-100
  message?: string;
  agents?: {
    name: string;
    status: 'pending' | 'running' | 'complete';
    progress: number;
  }[];
}

/**
 * AI Workspace state
 */
export interface AIWorkspaceState {
  currentConversation: Conversation | null;
  conversations: Conversation[];
  projects: AIWorkspaceProject[];
  selectedProjectId?: string;
  isLoading: boolean;
  error?: string;
  agentStatus?: AgentStatus;
}
