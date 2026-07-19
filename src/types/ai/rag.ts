/**
 * RAG (Retrieval-Augmented Generation) types and interfaces for DiscoveryOS.
 * Defines document chunks, extraction strategies, and chunking configurations.
 */

/**
 * Chunking strategy options for document processing.
 */
export enum ChunkingStrategy {
  /** Fixed-size chunks with overlap */
  FIXED_SIZE = 'fixed-size',
  /** Semantic chunking by sentences/paragraphs */
  SEMANTIC = 'semantic',
  /** Paragraph-based chunking */
  PARAGRAPH = 'paragraph',
  /** Sentence-based chunking */
  SENTENCE = 'sentence',
  /** Hierarchical chunking with multiple levels */
  HIERARCHICAL = 'hierarchical',
}

/**
 * Text extraction options for different document formats.
 */
export interface ExtractionOptions {
  /** Which file types to extract from */
  supportedFormats: string[];

  /** Whether to extract metadata */
  extractMetadata: boolean;

  /** Whether to detect encoding */
  detectEncoding: boolean;

  /** Whether to normalize whitespace */
  normalizeWhitespace: boolean;

  /** Whether to preserve formatting */
  preserveFormatting: boolean;

  /** Maximum extraction size in bytes */
  maxSizeBytes?: number;
}

/**
 * Chunking configuration options.
 */
export interface ChunkingConfig {
  /** Strategy to use for chunking */
  strategy: ChunkingStrategy;

  /** Fixed chunk size in characters (for fixed-size strategy) */
  chunkSize: number;

  /** Overlap between chunks in characters */
  overlapSize: number;

  /** Minimum chunk size to avoid tiny fragments */
  minChunkSize: number;

  /** Maximum chunk size to prevent oversized chunks */
  maxChunkSize: number;

  /** Whether to preserve sentence boundaries */
  preserveSentenceBoundaries: boolean;

  /** Whether to preserve paragraph boundaries */
  preserveParagraphBoundaries: boolean;

  /** Language for sentence tokenization */
  language: string;

  /** Maximum chunks per document */
  maxChunksPerDocument: number;
}

/**
 * Metadata for a single document chunk.
 */
export interface ChunkMetadata {
  /** Unique chunk identifier */
  id: string;

  /** Document ID this chunk belongs to */
  documentId: string;

  /** Chunk sequence number */
  chunkIndex: number;

  /** Total chunks in document */
  totalChunks: number;

  /** Start character position in source document */
  startPosition: number;

  /** End character position in source document */
  endPosition: number;

  /** Character count of chunk */
  characterCount: number;

  /** Word count of chunk */
  wordCount: number;

  /** Estimated token count */
  tokenCount: number;

  /** Source document filename */
  sourceFilename: string;

  /** Source document title */
  sourceTitle?: string;

  /** Chunking strategy used */
  strategy: ChunkingStrategy;

  /** Confidence score for chunk boundaries (0-1) */
  confidenceScore: number;

  /** Context type (sentence/paragraph/custom) */
  contextType: 'sentence' | 'paragraph' | 'custom' | 'unknown';

  /** Whether chunk is at document start */
  isFirstChunk: boolean;

  /** Whether chunk is at document end */
  isLastChunk: boolean;

  /** Previous chunk ID for context retrieval */
  previousChunkId?: string;

  /** Next chunk ID for context retrieval */
  nextChunkId?: string;

  /** Custom metadata fields */
  customMetadata?: Record<string, unknown>;
}

/**
 * A document chunk ready for embedding and retrieval.
 */
export interface DocumentChunk {
  /** Unique chunk identifier */
  id: string;

  /** The actual text content */
  content: string;

  /** Chunk metadata */
  metadata: ChunkMetadata;

  /** Whether this chunk has been processed/embedded */
  processed: boolean;

  /** Timestamp when chunk was created */
  createdAt: Date;

  /** Timestamp when chunk was processed */
  processedAt?: Date;
}

/**
 * Result of document extraction.
 */
export interface ExtractionResult {
  /** Extracted text content */
  content: string;

  /** Content encoding detected */
  encoding: string;

  /** Extracted metadata */
  metadata: {
    title?: string;
    author?: string;
    createdDate?: Date;
    modifiedDate?: Date;
    subject?: string;
    keywords?: string[];
    language?: string;
    pageCount?: number;
    characterCount: number;
    wordCount: number;
    tokenCount: number;
    warnings: string[];
  };

  /** Whether extraction was successful */
  success: boolean;

  /** Error message if extraction failed */
  error?: string;

  /** Extraction time in milliseconds */
  processingTimeMs: number;
}

/**
 * Result of document chunking.
 */
export interface ChunkingResult {
  /** Array of created chunks */
  chunks: DocumentChunk[];

  /** Total number of chunks */
  chunkCount: number;

  /** Chunking strategy used */
  strategy: ChunkingStrategy;

  /** Average chunk size in characters */
  averageChunkSize: number;

  /** Total content size across all chunks */
  totalContentSize: number;

  /** Whether chunking was successful */
  success: boolean;

  /** Error message if chunking failed */
  error?: string;

  /** Chunking time in milliseconds */
  processingTimeMs: number;

  /** Warnings during chunking */
  warnings: string[];
}

/**
 * Configuration for RAG pipeline processing.
 */
export interface RAGPipelineConfig {
  /** Extraction options */
  extraction: ExtractionOptions;

  /** Chunking configuration */
  chunking: ChunkingConfig;

  /** Whether to generate summaries for chunks */
  generateSummaries: boolean;

  /** Whether to generate chunk relationships */
  generateRelationships: boolean;

  /** Maximum concurrent processing tasks */
  maxConcurrentTasks: number;

  /** Enable verbose logging */
  verboseLogging: boolean;
}

/**
 * Statistics about RAG processing.
 */
export interface RAGProcessingStats {
  /** Total documents processed */
  documentsProcessed: number;

  /** Total chunks created */
  chunksCreated: number;

  /** Average chunk size */
  averageChunkSize: number;

  /** Total characters processed */
  totalCharacters: number;

  /** Total tokens across all chunks */
  totalTokens: number;

  /** Average processing time per document */
  averageProcessingTimeMs: number;

  /** Total processing time */
  totalProcessingTimeMs: number;

  /** Number of extraction errors */
  extractionErrors: number;

  /** Number of chunking errors */
  chunkingErrors: number;
}
