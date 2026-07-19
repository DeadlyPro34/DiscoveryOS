/**
 * Vector Store Service
 * Manages vector storage and semantic search operations.
 */

import {
  EmbeddingRecord,
  DocumentRecord,
  ChunkRecord,
  DatabaseOperationResult,
  BatchOperationResult,
} from '@/types/database';

interface VectorSearchResult {
  chunkId: string;
  documentId: string;
  similarity: number;
  content: string;
  metadata: Record<string, unknown>;
}

interface VectorStoreConfig {
  maxVectorDimension: number;
  similarityThreshold: number;
  maxSearchResults: number;
}

const logger = {
  debug: (msg: string, data?: unknown) => console.debug(`[VectorStore:DEBUG] ${msg}`, data),
  info: (msg: string, data?: unknown) => console.info(`[VectorStore:INFO] ${msg}`, data),
  warn: (msg: string, data?: unknown) => console.warn(`[VectorStore:WARN] ${msg}`, data),
  error: (msg: string, data?: unknown) => console.error(`[VectorStore:ERROR] ${msg}`, data),
};

/**
 * Default vector store configuration
 */
const DEFAULT_CONFIG: VectorStoreConfig = {
  maxVectorDimension: 384,
  similarityThreshold: 0.5,
  maxSearchResults: 10,
};

/**
 * Vector store for semantic search
 */
export class VectorStore {
  private config: VectorStoreConfig;
  private memoryStore: Map<string, EmbeddingRecord> = new Map();
  private vectorIndex: Map<string, number[][]> = new Map(); // workspace -> vectors

  constructor(config?: Partial<VectorStoreConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    logger.info('VectorStore initialized', this.config);
  }

  /**
   * Add embedding to store
   */
  async addEmbedding(embedding: EmbeddingRecord): Promise<void> {
    try {
      // Validate embedding
      if (!embedding.embedding || embedding.embedding.length === 0) {
        throw new Error('Invalid embedding vector');
      }

      if (embedding.embedding.length > this.config.maxVectorDimension) {
        throw new Error(
          `Embedding dimension (${embedding.embedding.length}) exceeds maximum (${this.config.maxVectorDimension})`,
        );
      }

      // Store in memory
      this.memoryStore.set(embedding.id, embedding);

      // Update vector index
      if (!this.vectorIndex.has(embedding.workspace_id)) {
        this.vectorIndex.set(embedding.workspace_id, []);
      }

      const workspaceVectors = this.vectorIndex.get(embedding.workspace_id);
      if (workspaceVectors) {
        workspaceVectors.push(embedding.embedding);
      }

      logger.debug('Embedding added to store', { embeddingId: embedding.id });
    } catch (error) {
      logger.error('Failed to add embedding', error);
      throw error;
    }
  }

  /**
   * Add multiple embeddings (batch)
   */
  async addEmbeddingsBatch(embeddings: EmbeddingRecord[]): Promise<void> {
    try {
      logger.info('Adding batch of embeddings', { count: embeddings.length });

      for (const embedding of embeddings) {
        await this.addEmbedding(embedding);
      }

      logger.info('Batch embeddings added', { count: embeddings.length });
    } catch (error) {
      logger.error('Failed to add batch embeddings', error);
      throw error;
    }
  }

  /**
   * Search for similar embeddings
   */
  async search(
    workspaceId: string,
    projectId: string,
    queryEmbedding: number[],
    limit: number = 5,
  ): Promise<VectorSearchResult[]> {
    try {
      logger.debug('Starting vector search', {
        workspaceId,
        projectId,
        limit,
      });

      // Validate query embedding
      if (!queryEmbedding || queryEmbedding.length === 0) {
        throw new Error('Invalid query embedding');
      }

      // Get all embeddings for workspace
      const workspaceEmbeddings = Array.from(this.memoryStore.values()).filter(
        e => e.workspace_id === workspaceId && e.project_id === projectId,
      );

      if (workspaceEmbeddings.length === 0) {
        logger.debug('No embeddings found for workspace', { workspaceId });
        return [];
      }

      // Calculate similarities
      const similarities = workspaceEmbeddings.map(embedding => ({
        embeddingId: embedding.id,
        chunkId: embedding.chunk_id,
        documentId: embedding.document_id,
        similarity: this.cosineSimilarity(queryEmbedding, embedding.embedding),
      }));

      // Filter by threshold and sort
      const results = similarities
        .filter(s => s.similarity >= this.config.similarityThreshold)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit);

      logger.info('Vector search completed', { resultCount: results.length });

      return results.map(r => ({
        chunkId: r.chunkId,
        documentId: r.documentId,
        similarity: r.similarity,
        content: '', // Will be populated from database
        metadata: {},
      }));
    } catch (error) {
      logger.error('Vector search failed', error);
      throw error;
    }
  }

  /**
   * Search with pagination
   */
  async searchWithPagination(
    workspaceId: string,
    projectId: string,
    queryEmbedding: number[],
    limit: number = 5,
    offset: number = 0,
  ): Promise<{ results: VectorSearchResult[]; total: number }> {
    try {
      // Get all matching results
      const allResults = await this.search(workspaceId, projectId, queryEmbedding, 1000);

      // Apply pagination
      const paginatedResults = allResults.slice(offset, offset + limit);

      return {
        results: paginatedResults,
        total: allResults.length,
      };
    } catch (error) {
      logger.error('Paginated vector search failed', error);
      throw error;
    }
  }

  /**
   * Search for similar embeddings (multi-query)
   */
  async multiSearch(
    workspaceId: string,
    projectId: string,
    queryEmbeddings: number[][],
    limit: number = 5,
  ): Promise<VectorSearchResult[][]> {
    try {
      logger.debug('Starting multi-query vector search', {
        queryCount: queryEmbeddings.length,
        limit,
      });

      const results: VectorSearchResult[][] = [];

      for (const queryEmbedding of queryEmbeddings) {
        const searchResults = await this.search(
          workspaceId,
          projectId,
          queryEmbedding,
          limit,
        );
        results.push(searchResults);
      }

      return results;
    } catch (error) {
      logger.error('Multi-query vector search failed', error);
      throw error;
    }
  }

  /**
   * Delete embedding from store
   */
  async deleteEmbedding(embeddingId: string): Promise<void> {
    try {
      this.memoryStore.delete(embeddingId);
      logger.debug('Embedding deleted from store', { embeddingId });
    } catch (error) {
      logger.error('Failed to delete embedding', error);
      throw error;
    }
  }

  /**
   * Clear all embeddings for a workspace
   */
  async clearWorkspaceEmbeddings(workspaceId: string): Promise<void> {
    try {
      const toDelete: string[] = [];

      for (const [key, embedding] of this.memoryStore.entries()) {
        if (embedding.workspace_id === workspaceId) {
          toDelete.push(key);
        }
      }

      for (const key of toDelete) {
        this.memoryStore.delete(key);
      }

      this.vectorIndex.delete(workspaceId);

      logger.info('Workspace embeddings cleared', {
        workspaceId,
        count: toDelete.length,
      });
    } catch (error) {
      logger.error('Failed to clear workspace embeddings', error);
      throw error;
    }
  }

  /**
   * Get vector statistics
   */
  getStatistics(): {
    totalEmbeddings: number;
    workspaceCount: number;
    averageVectorDimension: number;
  } {
    let totalDimension = 0;
    let count = 0;

    for (const embedding of this.memoryStore.values()) {
      totalDimension += embedding.embedding.length;
      count++;
    }

    return {
      totalEmbeddings: this.memoryStore.size,
      workspaceCount: this.vectorIndex.size,
      averageVectorDimension: count > 0 ? Math.round(totalDimension / count) : 0,
    };
  }

  /**
   * Cosine similarity calculation
   */
  private cosineSimilarity(vec1: number[], vec2: number[]): number {
    if (vec1.length !== vec2.length) {
      throw new Error('Vectors must have the same dimension');
    }

    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      magnitude1 += vec1[i] * vec1[i];
      magnitude2 += vec2[i] * vec2[i];
    }

    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);

    if (magnitude1 === 0 || magnitude2 === 0) {
      return 0;
    }

    return dotProduct / (magnitude1 * magnitude2);
  }

  /**
   * Euclidean distance calculation (for comparison)
   */
  private euclideanDistance(vec1: number[], vec2: number[]): number {
    if (vec1.length !== vec2.length) {
      throw new Error('Vectors must have the same dimension');
    }

    let sum = 0;

    for (let i = 0; i < vec1.length; i++) {
      const diff = vec1[i] - vec2[i];
      sum += diff * diff;
    }

    return Math.sqrt(sum);
  }
}

/**
 * Factory function to create a vector store
 */
export function createVectorStore(config?: Partial<VectorStoreConfig>): VectorStore {
  return new VectorStore(config);
}
