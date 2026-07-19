/**
 * Retrieval service types for DiscoveryOS AI Framework.
 * Handles search, similarity, and retrieval strategies.
 */

/**
 * Strategy for retrieval operations.
 */
export type RetrievalStrategy = 'semantic' | 'keyword' | 'hybrid' | 'bm25';

/**
 * A single search result.
 */
export interface SearchResult {
  /** Chunk ID */
  chunkId: string;

  /** Chunk content */
  content: string;

  /** Document ID chunk belongs to */
  documentId: string;

  /** Relevance score (0-1) */
  relevanceScore: number;

  /** Retrieval strategy that found this */
  strategy: RetrievalStrategy;

  /** Semantic similarity if applicable */
  similarityScore?: number;

  /** BM25 score if applicable */
  bm25Score?: number;

  /** Chunk metadata */
  metadata?: Record<string, unknown>;

  /** Position in results */
  rank: number;
}

/**
 * Request for retrieval/search operation.
 */
export interface RetrievalRequest {
  /** Query text */
  query: string;

  /** Number of results to return */
  topK: number;

  /** Retrieval strategy to use */
  strategy: RetrievalStrategy;

  /** Minimum relevance threshold (0-1) */
  minRelevance?: number;

  /** Filter by project ID */
  projectId?: string;

  /** Filter by workspace ID */
  workspaceId?: string;

  /** Filter by document IDs */
  documentIds?: string[];

  /** Additional parameters for specific strategies */
  parameters?: Record<string, unknown>;
}

/**
 * Response from retrieval operation.
 */
export interface RetrievalResponse {
  /** Search query */
  query: string;

  /** Results found */
  results: SearchResult[];

  /** Total results available */
  totalResults: number;

  /** Strategy used */
  strategy: RetrievalStrategy;

  /** Retrieval time in milliseconds */
  retrievalTimeMs: number;

  /** Whether results are complete or truncated */
  isComplete: boolean;
}

/**
 * Configuration for retrieval service.
 */
export interface RetrievalConfig {
  /** Default number of results to return */
  defaultTopK: number;

  /** Default strategy to use */
  defaultStrategy: RetrievalStrategy;

  /** Default minimum relevance threshold */
  defaultMinRelevance: number;

  /** Enable semantic search */
  enableSemantic: boolean;

  /** Enable keyword search */
  enableKeyword: boolean;

  /** Enable hybrid search */
  enableHybrid: boolean;

  /** BM25 parameters */
  bm25: {
    k1: number;
    b: number;
  };

  /** Semantic search weight in hybrid (0-1) */
  hybridSemanticWeight: number;
}
