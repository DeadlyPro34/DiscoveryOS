/**
 * Database types and interfaces for DiscoveryOS Supabase integration.
 * Defines all table schemas, relationships, and database operations.
 */

import { ProcessingStage } from './ai/document';
import { ChunkingStrategy } from './ai/rag';

/**
 * Workspace database record with authentication and billing info.
 */
export interface WorkspaceRecord {
  id: string;
  name: string;
  slug: string;
  description?: string;
  logo_url?: string;
  owner_id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
  is_active: boolean;
  metadata?: Record<string, unknown>;
}

/**
 * Workspace member relationship with role-based access.
 */
export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  created_at: Date;
  updated_at: Date;
  permissions?: string[];
}

/**
 * Project database record.
 */
export interface ProjectRecord {
  id: string;
  workspace_id: string;
  name: string;
  description?: string;
  status: 'research' | 'processing' | 'completed' | 'archived';
  created_at: Date;
  updated_at: Date;
  completed_at?: Date;
  deleted_at?: Date;
  metadata?: Record<string, unknown>;
  tags?: string[];
}

/**
 * Document database record tracking uploads and processing.
 */
export interface DocumentRecord {
  id: string;
  project_id: string;
  workspace_id: string;
  filename: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  original_name: string;
  stage: ProcessingStage;
  content?: string;
  metadata?: Record<string, unknown>;
  processing_started_at?: Date;
  processing_completed_at?: Date;
  processing_duration_ms?: number;
  chunk_count: number;
  error_message?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

/**
 * Text chunk database record for RAG pipeline.
 */
export interface ChunkRecord {
  id: string;
  document_id: string;
  project_id: string;
  workspace_id: string;
  content: string;
  chunk_index: number;
  total_chunks: number;
  start_position: number;
  end_position: number;
  character_count: number;
  word_count: number;
  token_count: number;
  source_filename: string;
  source_title?: string;
  chunking_strategy: ChunkingStrategy;
  confidence_score: number;
  context_type: 'sentence' | 'paragraph' | 'custom' | 'unknown';
  is_first_chunk: boolean;
  is_last_chunk: boolean;
  previous_chunk_id?: string;
  next_chunk_id?: string;
  metadata?: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}

/**
 * Vector embedding database record for semantic search.
 */
export interface EmbeddingRecord {
  id: string;
  chunk_id: string;
  document_id: string;
  project_id: string;
  workspace_id: string;
  embedding: number[];
  embedding_model: string;
  embedding_dimension: number;
  cosine_similarity_search_enabled: boolean;
  created_at: Date;
  updated_at: Date;
  metadata?: Record<string, unknown>;
}

/**
 * Conversation record for chat history with AI.
 */
export interface ConversationRecord {
  id: string;
  project_id: string;
  workspace_id: string;
  user_id: string;
  title: string;
  started_at: Date;
  last_message_at: Date;
  ended_at?: Date;
  message_count: number;
  metadata?: Record<string, unknown>;
  is_archived: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * Conversation message record.
 */
export interface MessageRecord {
  id: string;
  conversation_id: string;
  project_id: string;
  workspace_id: string;
  role: 'user' | 'assistant';
  content: string;
  reasoning?: string;
  citations?: Array<{
    chunk_id: string;
    document_id: string;
    relevance_score: number;
    quote: string;
  }>;
  metadata?: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}

/**
 * Processing log for audit trail and debugging.
 */
export interface ProcessingLogRecord {
  id: string;
  document_id: string;
  project_id: string;
  workspace_id: string;
  stage: ProcessingStage;
  level: 'debug' | 'info' | 'warning' | 'error';
  message: string;
  metadata?: Record<string, unknown>;
  created_at: Date;
}

/**
 * RAG statistics and metrics tracking.
 */
export interface RAGMetricsRecord {
  id: string;
  workspace_id: string;
  project_id?: string;
  documents_processed: number;
  chunks_created: number;
  average_chunk_size: number;
  total_characters: number;
  total_tokens: number;
  average_processing_time_ms: number;
  total_processing_time_ms: number;
  extraction_errors: number;
  chunking_errors: number;
  embeddings_created: number;
  period_start: Date;
  period_end: Date;
  created_at: Date;
}

/**
 * Generic database operation result.
 */
export interface DatabaseOperationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

/**
 * Batch operation result.
 */
export interface BatchOperationResult<T> {
  success: boolean;
  results: DatabaseOperationResult<T>[];
  totalSuccessful: number;
  totalFailed: number;
}

/**
 * Query filter options for database operations.
 */
export interface QueryFilter {
  field: string;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'like' | 'ilike';
  value: unknown;
}

/**
 * Sort options for database queries.
 */
export interface SortOption {
  field: string;
  order: 'asc' | 'desc';
}

/**
 * Pagination options for database queries.
 */
export interface PaginationOptions {
  offset: number;
  limit: number;
}

/**
 * Query options combining filters, sorting, and pagination.
 */
export interface QueryOptions {
  filters?: QueryFilter[];
  sort?: SortOption[];
  pagination?: PaginationOptions;
}

/**
 * Database connection options.
 */
export interface DatabaseConnectionOptions {
  supabaseUrl: string;
  supabaseKey: string;
  poolSize?: number;
  connectionTimeout?: number;
  queryTimeout?: number;
  maxRetries?: number;
}

/**
 * Database transaction context for atomic operations.
 */
export interface TransactionContext {
  id: string;
  startedAt: Date;
  operations: Array<{
    type: 'insert' | 'update' | 'delete';
    table: string;
    data: unknown;
  }>;
}

/**
 * Health check result for database connectivity.
 */
export interface HealthCheckResult {
  healthy: boolean;
  connectionValid: boolean;
  responseTimeMs: number;
  timestamp: Date;
  details?: Record<string, unknown>;
}
