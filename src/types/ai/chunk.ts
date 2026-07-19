/**
 * Chunk types for semantic text segmentation in DiscoveryOS AI Framework.
 * Handles document chunking strategies and chunk metadata.
 */

/**
 * Metadata associated with a text chunk.
 */
export interface ChunkMetadata {
  /** Unique chunk identifier */
  id: string;

  /** Index of this chunk within the document */
  index: number;

  /** Total chunks from this document */
  totalChunks: number;

  /** Character count of this chunk */
  characterCount: number;

  /** Estimated token count */
  tokenCount: number;

  /** Chunking strategy used (fixed, sliding, semantic) */
  strategy: 'fixed' | 'sliding' | 'semantic';

  /** Start position in original document */
  startPosition: number;

  /** End position in original document */
  endPosition: number;

  /** Chunk extraction timestamp */
  extractedAt: Date;

  /** Confidence score for semantic chunks (0-1) */
  confidenceScore?: number;

  /** Custom metadata key-value pairs */
  custom?: Record<string, unknown>;
}

/**
 * A text chunk with associated metadata.
 */
export interface Chunk {
  /** Unique identifier for this chunk */
  id: string;

  /** Document this chunk belongs to */
  documentId: string;

  /** Extracted text content */
  content: string;

  /** Metadata about the chunk */
  metadata: ChunkMetadata;

  /** Source project ID */
  projectId: string;

  /** Source workspace ID */
  workspaceId: string;

  /** When chunk was created */
  createdAt: Date;

  /** Previous chunk ID (if part of sequence) */
  previousChunkId?: string;

  /** Next chunk ID (if part of sequence) */
  nextChunkId?: string;
}
