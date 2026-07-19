/**
 * Supabase Database Client Service
 * Production-ready database client with authentication, CRUD operations, and error handling.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  WorkspaceRecord,
  ProjectRecord,
  DocumentRecord,
  ChunkRecord,
  EmbeddingRecord,
  ConversationRecord,
  MessageRecord,
  ProcessingLogRecord,
  RAGMetricsRecord,
  DatabaseOperationResult,
  BatchOperationResult,
  QueryFilter,
  SortOption,
  PaginationOptions,
  QueryOptions,
  DatabaseConnectionOptions,
  HealthCheckResult,
} from '@/types/database';
import { ProcessingStage } from '@/types/ai/document';

const logger = {
  debug: (msg: string, data?: unknown) => console.debug(`[DB:DEBUG] ${msg}`, data),
  info: (msg: string, data?: unknown) => console.info(`[DB:INFO] ${msg}`, data),
  warn: (msg: string, data?: unknown) => console.warn(`[DB:WARN] ${msg}`, data),
  error: (msg: string, data?: unknown) => console.error(`[DB:ERROR] ${msg}`, data),
};

/**
 * Singleton Supabase client service
 */
export class SupabaseService {
  private static instance: SupabaseService;
  private client: SupabaseClient | null = null;
  private options: DatabaseConnectionOptions;
  private readonly maxRetries = 3;
  private readonly retryDelay = 1000;

  private constructor(options: DatabaseConnectionOptions) {
    this.options = {
      poolSize: 10,
      connectionTimeout: 10000,
      queryTimeout: 30000,
      maxRetries: 3,
      ...options,
    };
  }

  /**
   * Get singleton instance
   */
  public static getInstance(options?: DatabaseConnectionOptions): SupabaseService {
    if (!SupabaseService.instance) {
      if (!options) {
        throw new Error('SupabaseService must be initialized with options on first call');
      }
      SupabaseService.instance = new SupabaseService(options);
    }
    return SupabaseService.instance;
  }

  /**
   * Initialize the Supabase client
   */
  public async initialize(): Promise<void> {
    try {
      if (!this.options.supabaseUrl || !this.options.supabaseKey) {
        throw new Error('SUPABASE_URL and SUPABASE_KEY are required');
      }

      this.client = createClient(this.options.supabaseUrl, this.options.supabaseKey);
      
      // Verify connection
      const health = await this.healthCheck();
      if (!health.healthy) {
        throw new Error('Failed to establish database connection');
      }

      logger.info('Supabase client initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize Supabase client', error);
      throw error;
    }
  }

  /**
   * Get the Supabase client
   */
  private getClient(): SupabaseClient {
    if (!this.client) {
      throw new Error('Supabase client not initialized. Call initialize() first.');
    }
    return this.client;
  }

  /**
   * Execute query with automatic retry logic
   */
  private async executeWithRetry<T>(
    operation: () => PromiseLike<T>,
    operationName: string,
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        logger.debug(`Executing ${operationName} (attempt ${attempt}/${this.maxRetries})`);
        return await operation();
      } catch (error) {
        lastError = error as Error;
        logger.warn(`Operation failed: ${operationName} (attempt ${attempt})`, error);

        if (attempt < this.maxRetries) {
          const delay = this.retryDelay * attempt;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error(`Operation failed after ${this.maxRetries} attempts: ${operationName}`);
  }

  /**
   * Build Supabase query with filters and sorting
   */
  private buildQuery(table: string, options?: QueryOptions) {
    let query = this.getClient().from(table).select('*');

    if (options?.filters) {
      for (const filter of options.filters) {
        switch (filter.operator) {
          case 'eq':
            query = query.eq(filter.field, filter.value);
            break;
          case 'neq':
            query = query.neq(filter.field, filter.value);
            break;
          case 'gt':
            query = query.gt(filter.field, filter.value);
            break;
          case 'gte':
            query = query.gte(filter.field, filter.value);
            break;
          case 'lt':
            query = query.lt(filter.field, filter.value);
            break;
          case 'lte':
            query = query.lte(filter.field, filter.value);
            break;
          case 'in':
            query = query.in(filter.field, filter.value as Array<unknown>);
            break;
          case 'like':
            query = query.like(filter.field, filter.value as string);
            break;
          case 'ilike':
            query = query.ilike(filter.field, filter.value as string);
            break;
        }
      }
    }

    if (options?.sort) {
      for (const sort of options.sort) {
        query = query.order(sort.field, { ascending: sort.order === 'asc' });
      }
    }

    if (options?.pagination) {
      query = query.range(
        options.pagination.offset,
        options.pagination.offset + options.pagination.limit - 1,
      );
    }

    return query;
  }

  /**
   * WORKSPACE OPERATIONS
   */

  async createWorkspace(workspace: Omit<WorkspaceRecord, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseOperationResult<WorkspaceRecord>> {
    try {
      const { data, error } = await this.executeWithRetry(
        () =>
          this.getClient()
            .from('workspaces')
            .insert([workspace])
            .select()
            .single(),
        'createWorkspace',
      );

      if (error) throw error;
      logger.info('Workspace created', { workspaceId: data?.id });
      return { success: true, data };
    } catch (error) {
      logger.error('Failed to create workspace', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getWorkspace(workspaceId: string): Promise<DatabaseOperationResult<WorkspaceRecord>> {
    try {
      const { data, error } = await this.executeWithRetry(
        () =>
          this.getClient()
            .from('workspaces')
            .select('*')
            .eq('id', workspaceId)
            .eq('deleted_at', null)
            .single(),
        'getWorkspace',
      );

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      logger.error('Failed to get workspace', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async listWorkspaces(options?: QueryOptions): Promise<DatabaseOperationResult<WorkspaceRecord[]>> {
    try {
      let query = this.buildQuery('workspaces', options);
      query = query.eq('deleted_at', null);
      
      const { data, error } = await this.executeWithRetry(
        () => query,
        'listWorkspaces',
      );

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      logger.error('Failed to list workspaces', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async updateWorkspace(
    workspaceId: string,
    updates: Partial<WorkspaceRecord>,
  ): Promise<DatabaseOperationResult<WorkspaceRecord>> {
    try {
      const { data, error } = await this.executeWithRetry(
        () =>
          this.getClient()
            .from('workspaces')
            .update({ ...updates, updated_at: new Date() })
            .eq('id', workspaceId)
            .select()
            .single(),
        'updateWorkspace',
      );

      if (error) throw error;
      logger.info('Workspace updated', { workspaceId });
      return { success: true, data };
    } catch (error) {
      logger.error('Failed to update workspace', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * PROJECT OPERATIONS
   */

  async createProject(project: Omit<ProjectRecord, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseOperationResult<ProjectRecord>> {
    try {
      const { data, error } = await this.executeWithRetry(
        () =>
          this.getClient()
            .from('projects')
            .insert([project])
            .select()
            .single(),
        'createProject',
      );

      if (error) throw error;
      logger.info('Project created', { projectId: data?.id });
      return { success: true, data };
    } catch (error) {
      logger.error('Failed to create project', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getProject(projectId: string): Promise<DatabaseOperationResult<ProjectRecord>> {
    try {
      const { data, error } = await this.executeWithRetry(
        () =>
          this.getClient()
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .eq('deleted_at', null)
            .single(),
        'getProject',
      );

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      logger.error('Failed to get project', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async listProjects(workspaceId: string, options?: QueryOptions): Promise<DatabaseOperationResult<ProjectRecord[]>> {
    try {
      let query = this.buildQuery('projects', options);
      query = query.eq('workspace_id', workspaceId).eq('deleted_at', null);
      
      const { data, error } = await this.executeWithRetry(
        () => query,
        'listProjects',
      );

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      logger.error('Failed to list projects', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * DOCUMENT OPERATIONS
   */

  async createDocument(document: Omit<DocumentRecord, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseOperationResult<DocumentRecord>> {
    try {
      const { data, error } = await this.executeWithRetry(
        () =>
          this.getClient()
            .from('documents')
            .insert([document])
            .select()
            .single(),
        'createDocument',
      );

      if (error) throw error;
      logger.info('Document created', { documentId: data?.id });
      return { success: true, data };
    } catch (error) {
      logger.error('Failed to create document', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getDocument(documentId: string): Promise<DatabaseOperationResult<DocumentRecord>> {
    try {
      const { data, error } = await this.executeWithRetry(
        () =>
          this.getClient()
            .from('documents')
            .select('*')
            .eq('id', documentId)
            .eq('deleted_at', null)
            .single(),
        'getDocument',
      );

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      logger.error('Failed to get document', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async updateDocumentStage(
    documentId: string,
    stage: ProcessingStage,
    updates?: Partial<DocumentRecord>,
  ): Promise<DatabaseOperationResult<DocumentRecord>> {
    try {
      const { data, error } = await this.executeWithRetry(
        () =>
          this.getClient()
            .from('documents')
            .update({
              stage,
              ...updates,
              updated_at: new Date(),
            })
            .eq('id', documentId)
            .select()
            .single(),
        'updateDocumentStage',
      );

      if (error) throw error;
      logger.info('Document stage updated', { documentId, stage });
      return { success: true, data };
    } catch (error) {
      logger.error('Failed to update document stage', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async listDocuments(projectId: string, options?: QueryOptions): Promise<DatabaseOperationResult<DocumentRecord[]>> {
    try {
      let query = this.buildQuery('documents', options);
      query = query.eq('project_id', projectId).eq('deleted_at', null);
      
      const { data, error } = await this.executeWithRetry(
        () => query,
        'listDocuments',
      );

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      logger.error('Failed to list documents', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * CHUNK OPERATIONS
   */

  async createChunk(chunk: Omit<ChunkRecord, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseOperationResult<ChunkRecord>> {
    try {
      const { data, error } = await this.executeWithRetry(
        () =>
          this.getClient()
            .from('chunks')
            .insert([chunk])
            .select()
            .single(),
        'createChunk',
      );

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      logger.error('Failed to create chunk', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async createChunksBatch(chunks: Omit<ChunkRecord, 'id' | 'created_at' | 'updated_at'>[]): Promise<BatchOperationResult<ChunkRecord>> {
    const results: DatabaseOperationResult<ChunkRecord>[] = [];
    let successful = 0;
    let failed = 0;

    try {
      // Batch insert in chunks of 100
      const batchSize = 100;
      for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize);
        
        try {
          const { data, error } = await this.executeWithRetry(
            () =>
              this.getClient()
                .from('chunks')
                .insert(batch)
                .select(),
            `createChunksBatch[${i / batchSize + 1}]`,
          );

          if (error) throw error;
          
          if (data) {
            successful += data.length;
            data.forEach(chunk => {
              results.push({ success: true, data: chunk });
            });
          }
        } catch (error) {
          failed += batch.length;
          batch.forEach(() => {
            results.push({
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error',
            });
          });
        }
      }

      logger.info('Batch chunk creation completed', { successful, failed, total: chunks.length });
      return { success: failed === 0, results, totalSuccessful: successful, totalFailed: failed };
    } catch (error) {
      logger.error('Batch chunk creation failed', error);
      return {
        success: false,
        results,
        totalSuccessful: successful,
        totalFailed: failed,
      };
    }
  }

  async getChunk(chunkId: string): Promise<DatabaseOperationResult<ChunkRecord>> {
    try {
      const { data, error } = await this.executeWithRetry(
        () =>
          this.getClient()
            .from('chunks')
            .select('*')
            .eq('id', chunkId)
            .single(),
        'getChunk',
      );

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      logger.error('Failed to get chunk', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async listChunks(documentId: string, options?: QueryOptions): Promise<DatabaseOperationResult<ChunkRecord[]>> {
    try {
      let query = this.buildQuery('chunks', options);
      query = query.eq('document_id', documentId);
      
      const { data, error } = await this.executeWithRetry(
        () => query,
        'listChunks',
      );

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      logger.error('Failed to list chunks', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * EMBEDDING OPERATIONS
   */

  async createEmbedding(embedding: Omit<EmbeddingRecord, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseOperationResult<EmbeddingRecord>> {
    try {
      const { data, error } = await this.executeWithRetry(
        () =>
          this.getClient()
            .from('embeddings')
            .insert([embedding])
            .select()
            .single(),
        'createEmbedding',
      );

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      logger.error('Failed to create embedding', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async createEmbeddingsBatch(embeddings: Omit<EmbeddingRecord, 'id' | 'created_at' | 'updated_at'>[]): Promise<BatchOperationResult<EmbeddingRecord>> {
    const results: DatabaseOperationResult<EmbeddingRecord>[] = [];
    let successful = 0;
    let failed = 0;

    try {
      const batchSize = 100;
      for (let i = 0; i < embeddings.length; i += batchSize) {
        const batch = embeddings.slice(i, i + batchSize);
        
        try {
          const { data, error } = await this.executeWithRetry(
            () =>
              this.getClient()
                .from('embeddings')
                .insert(batch)
                .select(),
            `createEmbeddingsBatch[${i / batchSize + 1}]`,
          );

          if (error) throw error;
          
          if (data) {
            successful += data.length;
            data.forEach(emb => {
              results.push({ success: true, data: emb });
            });
          }
        } catch (error) {
          failed += batch.length;
          batch.forEach(() => {
            results.push({
              success: false,
              error: error instanceof Error ? error.message : 'Unknown error',
            });
          });
        }
      }

      logger.info('Batch embedding creation completed', { successful, failed, total: embeddings.length });
      return { success: failed === 0, results, totalSuccessful: successful, totalFailed: failed };
    } catch (error) {
      logger.error('Batch embedding creation failed', error);
      return {
        success: false,
        results,
        totalSuccessful: successful,
        totalFailed: failed,
      };
    }
  }

  async vectorSearch(
    workspaceId: string,
    projectId: string,
    embedding: number[],
    limit: number = 5,
    threshold: number = 0.5,
  ): Promise<DatabaseOperationResult<EmbeddingRecord[]>> {
    try {
      const { data, error } = await this.executeWithRetry(
        () =>
          this.getClient()
            .rpc('match_embeddings', {
              query_embedding: embedding,
              match_count: limit,
              match_threshold: threshold,
            })
            .in('workspace_id', [workspaceId])
            .in('project_id', [projectId]),
        'vectorSearch',
      );

      if (error) throw error;
      return { success: true, data: data || [] };
    } catch (error) {
      logger.error('Failed to perform vector search', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * CONVERSATION OPERATIONS
   */

  async createConversation(
    conversation: Omit<ConversationRecord, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<DatabaseOperationResult<ConversationRecord>> {
    try {
      const { data, error } = await this.executeWithRetry<any>(
        () =>
          this.getClient()
            .from('conversations')
            .insert([conversation])
            .select()
            .single(),
        'createConversation',
      );

      if (error) throw error;
      logger.info('Conversation created', { conversationId: data?.id });
      return { success: true, data };
    } catch (error) {
      logger.error('Failed to create conversation', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async addMessage(message: Omit<MessageRecord, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseOperationResult<MessageRecord>> {
    try {
      const { data, error } = await this.executeWithRetry<any>(
        () =>
          this.getClient()
            .from('messages')
            .insert([message])
            .select()
            .single(),
        'addMessage',
      );

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      logger.error('Failed to add message', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * LOGGING OPERATIONS
   */

  async logProcessing(log: Omit<ProcessingLogRecord, 'id' | 'created_at'>): Promise<DatabaseOperationResult<ProcessingLogRecord>> {
    try {
      const { data, error } = await this.executeWithRetry<any>(
        () =>
          this.getClient()
            .from('processing_logs')
            .insert([log])
            .select()
            .single(),
        'logProcessing',
      );

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      logger.error('Failed to log processing', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * METRICS OPERATIONS
   */

  async updateRAGMetrics(metrics: Omit<RAGMetricsRecord, 'id' | 'created_at'>): Promise<DatabaseOperationResult<RAGMetricsRecord>> {
    try {
      const { data, error } = await this.executeWithRetry<any>(
        () =>
          this.getClient()
            .from('rag_metrics')
            .insert([metrics])
            .select()
            .single(),
        'updateRAGMetrics',
      );

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      logger.error('Failed to update RAG metrics', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * HEALTH CHECK
   */

  async healthCheck(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    try {
      const { error } = await this.getClient().from('workspaces').select('count', { count: 'exact' }).limit(1);
      
      if (error) throw error;

      return {
        healthy: true,
        connectionValid: true,
        responseTimeMs: Date.now() - startTime,
        timestamp: new Date(),
      };
    } catch (error) {
      logger.error('Health check failed', error);
      return {
        healthy: false,
        connectionValid: false,
        responseTimeMs: Date.now() - startTime,
        timestamp: new Date(),
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
      };
    }
  }
}

// Export factory function
export function createSupabaseService(options: DatabaseConnectionOptions): SupabaseService {
  return SupabaseService.getInstance(options);
}
