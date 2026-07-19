/**
 * Document processing types and interfaces for DiscoveryOS AI Framework.
 * Handles document metadata, processing stages, and normalized document representations.
 */

/**
 * Represents processing stages in the AI pipeline.
 */
export enum ProcessingStage {
  UPLOADED = 'uploaded',
  PARSING = 'parsing',
  NORMALIZING = 'normalizing',
  CHUNKING = 'chunking',
  EMBEDDING = 'embedding',
  INDEXING = 'indexing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

/**
 * Metadata extracted from a document during processing.
 */
export interface DocumentMetadata {
  /** Original filename */
  filename: string;

  /** MIME type of the document */
  mimeType: string;

  /** Original file size in bytes */
  fileSize: number;

  /** Detected language (ISO 639-1 code, e.g., 'en', 'es') */
  language: string;

  /** Total character count */
  characterCount: number;

  /** Estimated word count */
  wordCount: number;

  /** Estimated token count (approximate) */
  tokenCount: number;

  /** Estimated reading time in minutes */
  readingTimeMinutes: number;

  /** Extracted title (if present) */
  title?: string;

  /** Extracted author (if present) */
  author?: string;

  /** Document creation date */
  createdAt: Date;

  /** When metadata was extracted */
  extractedAt: Date;

  /** Any warnings or issues during parsing */
  warnings: string[];
}

/**
 * Normalized text content of a document with metadata.
 */
export interface ProcessedDocument {
  /** Unique document identifier */
  id: string;

  /** Original upload ID */
  uploadId: string;

  /** Project ID this document belongs to */
  projectId: string;

  /** Workspace ID */
  workspaceId: string;

  /** Current processing stage */
  stage: ProcessingStage;

  /** Extracted and normalized text */
  content: string;

  /** Document metadata */
  metadata: DocumentMetadata;

  /** Number of chunks created from this document */
  chunkCount: number;

  /** Timestamp when processing started */
  startedAt: Date;

  /** Timestamp when processing completed */
  completedAt?: Date;

  /** Total processing time in milliseconds */
  processingTimeMs?: number;

  /** Error message if processing failed */
  error?: string;

  /** Processing history showing stage progression */
  stageHistory: Array<{
    stage: ProcessingStage;
    timestamp: Date;
    durationMs: number;
  }>;
}

/**
 * Pipeline processing status with timing information.
 */
export interface PipelineStatus {
  /** Current processing stage */
  stage: ProcessingStage;

  /** Percentage complete (0-100) */
  progress: number;

  /** Human-readable status message */
  message: string;

  /** Stage-specific details */
  details?: Record<string, unknown>;

  /** Estimated time remaining in milliseconds */
  estimatedRemainingMs?: number;
}

/**
 * Individual log entry for processing pipeline.
 */
export interface PipelineLog {
  /** Unique log entry ID */
  id: string;

  /** Document being processed */
  documentId: string;

  /** Processing stage when this log was created */
  stage: ProcessingStage;

  /** Log level (debug, info, warning, error) */
  level: 'debug' | 'info' | 'warning' | 'error';

  /** Log message */
  message: string;

  /** Additional structured data */
  metadata?: Record<string, unknown>;

  /** When this log entry was created */
  timestamp: Date;
}

/**
 * Timeline view of processing stages with metrics.
 */
export interface ProcessingTimeline {
  /** Document ID */
  documentId: string;

  /** Array of stage entries with timing */
  stages: Array<{
    stage: ProcessingStage;
    startTime: Date;
    endTime: Date;
    durationMs: number;
    status: 'pending' | 'in-progress' | 'completed' | 'failed';
  }>;

  /** Total processing time */
  totalDurationMs: number;

  /** When the timeline was created */
  createdAt: Date;
}
