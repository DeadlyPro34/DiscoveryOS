/**
 * Embedding and vector types for DiscoveryOS AI Framework.
 * Handles embedding models, vectors, and similarity calculations.
 */

/**
 * Embedding vector representation of text.
 */
export interface EmbeddingVector {
  /** Unique embedding identifier */
  id: string;

  /** The numeric vector values */
  values: number[];

  /** Dimension of the embedding space */
  dimension: number;

  /** Model used to generate this embedding */
  model: string;

  /** Text that was embedded */
  content: string;

  /** Chunk this embedding represents */
  chunkId: string;

  /** When embedding was created */
  createdAt: Date;

  /** Processing time in milliseconds */
  processingTimeMs: number;
}

/**
 * Configuration for an embedding model.
 */
export interface EmbeddingModel {
  /** Unique model identifier */
  id: string;

  /** Human-readable model name */
  name: string;

  /** Model type/provider (transformers-js, openai, voyage) */
  type: 'transformers-js' | 'openai' | 'voyage' | 'custom';

  /** Vector dimension size */
  dimension: number;

  /** Maximum tokens the model can embed */
  maxTokens: number;

  /** Model-specific configuration */
  config?: Record<string, unknown>;

  /** Whether this model is available for use */
  available: boolean;

  /** When model was registered */
  registeredAt: Date;
}

/**
 * Request to generate embeddings for text.
 */
export interface EmbeddingRequest {
  /** Text or texts to embed */
  texts: string | string[];

  /** Model to use */
  modelId: string;

  /** Optional metadata to attach */
  metadata?: Record<string, unknown>;
}

/**
 * Response from embedding service.
 */
export interface EmbeddingResponse {
  /** Generated embeddings */
  embeddings: EmbeddingVector[];

  /** Model used */
  modelId: string;

  /** Total processing time in milliseconds */
  totalProcessingTimeMs: number;

  /** Number of tokens processed */
  tokenCount: number;
}
