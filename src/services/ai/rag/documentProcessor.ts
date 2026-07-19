/**
 * Document Processor Service
 * Orchestrates the complete RAG pipeline: extraction, chunking, embedding, storage.
 * Production-ready with error handling, logging, and metrics.
 */

import { SupabaseService } from '@/services/ai/database/supabaseClient';
import { TextExtractor } from '@/services/ai/rag/textExtractor';
import { Chunker } from '@/services/ai/rag/embeddingChunker';
import { EmbeddingGenerator } from '@/services/ai/rag/embeddingGenerator';
import { VectorStore } from '@/services/ai/rag/vectorStore';
import {
  DocumentRecord,
  ChunkRecord,
  EmbeddingRecord,
  ProcessingLogRecord,
  RAGMetricsRecord,
  DatabaseOperationResult,
} from '@/types/database';
import { ProcessingStage, ProcessedDocument } from '@/types/ai/document';
import { ExtractionOptions, ChunkingConfig, RAGProcessingStats } from '@/types/ai/rag';

interface DocumentProcessorConfig {
  extractionOptions?: Partial<ExtractionOptions>;
  chunkingConfig?: Partial<ChunkingConfig>;
  enableEmbeddings: boolean;
  enableMetrics: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
}

interface ProcessingProgress {
  stage: ProcessingStage;
  progress: number; // 0-100
  message: string;
  details?: Record<string, unknown>;
}

const logger = {
  debug: (msg: string, data?: unknown) => console.debug(`[DocumentProcessor:DEBUG] ${msg}`, data),
  info: (msg: string, data?: unknown) => console.info(`[DocumentProcessor:INFO] ${msg}`, data),
  warn: (msg: string, data?: unknown) => console.warn(`[DocumentProcessor:WARN] ${msg}`, data),
  error: (msg: string, data?: unknown) => console.error(`[DocumentProcessor:ERROR] ${msg}`, data),
};

/**
 * Document processor coordinating the full RAG pipeline
 */
export class DocumentProcessor {
  private db: SupabaseService;
  private textExtractor: TextExtractor;
  private chunker: Chunker;
  private embeddingGenerator: EmbeddingGenerator;
  private vectorStore: VectorStore;
  private config: DocumentProcessorConfig;
  private stats: RAGProcessingStats = {
    documentsProcessed: 0,
    chunksCreated: 0,
    averageChunkSize: 0,
    totalCharacters: 0,
    totalTokens: 0,
    averageProcessingTimeMs: 0,
    totalProcessingTimeMs: 0,
    extractionErrors: 0,
    chunkingErrors: 0,
  };

  constructor(db: SupabaseService, config: DocumentProcessorConfig = {} as DocumentProcessorConfig) {
    this.db = db;
    this.config = {
      enableEmbeddings: true,
      enableMetrics: true,
      logLevel: 'info',
      ...config,
    };

    this.textExtractor = new TextExtractor(this.config.extractionOptions);
    this.chunker = new Chunker(this.config.chunkingConfig);
    this.embeddingGenerator = new EmbeddingGenerator();
    this.vectorStore = new VectorStore();

    logger.info('DocumentProcessor initialized', {
      enableEmbeddings: this.config.enableEmbeddings,
      enableMetrics: this.config.enableMetrics,
    });
  }

  /**
   * Process a complete document through the RAG pipeline
   */
  async processDocument(
    documentId: string,
    projectId: string,
    workspaceId: string,
    filename: string,
    buffer: Buffer,
    onProgress?: (progress: ProcessingProgress) => void,
  ): Promise<DatabaseOperationResult<ProcessedDocument>> {
    const startTime = Date.now();

    try {
      logger.info('Starting document processing pipeline', {
        documentId,
        projectId,
        workspaceId,
        filename,
      });

      // Step 1: Update document stage - PARSING
      await this.updateDocumentStage(documentId, ProcessingStage.PARSING, 10);
      onProgress?.({ stage: ProcessingStage.PARSING, progress: 10, message: 'Extracting text...' });

      // Step 2: Extract text
      const extraction = await this.textExtractor.extract(filename, buffer);
      if (!extraction.success) {
        throw new Error(`Extraction failed: ${extraction.error}`);
      }

      this.stats.totalCharacters += extraction.metadata.characterCount;
      this.stats.totalTokens += extraction.metadata.tokenCount;

      logger.info('Text extraction completed', {
        characterCount: extraction.metadata.characterCount,
        wordCount: extraction.metadata.wordCount,
      });

      // Step 3: Update document stage - NORMALIZING
      await this.updateDocumentStage(documentId, ProcessingStage.NORMALIZING, 25, {
        content: extraction.content,
        metadata: extraction.metadata,
      });
      onProgress?.({
        stage: ProcessingStage.NORMALIZING,
        progress: 25,
        message: 'Normalizing content...',
      });

      // Step 4: Chunk the document
      await this.updateDocumentStage(documentId, ProcessingStage.CHUNKING, 40);
      onProgress?.({ stage: ProcessingStage.CHUNKING, progress: 40, message: 'Chunking document...' });

      const chunkingResult = await this.chunker.chunk(
        documentId,
        extraction.content,
        filename,
        extraction.metadata.title,
      );

      if (!chunkingResult.success) {
        throw new Error(`Chunking failed: ${chunkingResult.error}`);
      }

      logger.info('Document chunking completed', {
        chunkCount: chunkingResult.chunkCount,
        averageChunkSize: chunkingResult.averageChunkSize,
      });

      this.stats.chunksCreated += chunkingResult.chunkCount;
      this.stats.averageChunkSize = Math.round(
        (this.stats.averageChunkSize * (this.stats.documentsProcessed) +
          chunkingResult.averageChunkSize) /
          (this.stats.documentsProcessed + 1),
      );

      // Step 5: Store chunks in database
      await this.updateDocumentStage(documentId, ProcessingStage.EMBEDDING, 60);
      onProgress?.({
        stage: ProcessingStage.EMBEDDING,
        progress: 60,
        message: 'Storing chunks...',
      });

      const storedChunks = await this.storeChunks(
        chunkingResult.chunks,
        documentId,
        projectId,
        workspaceId,
        filename,
      );

      if (!storedChunks.success || !storedChunks.data) {
        throw new Error('Failed to store chunks in database');
      }

      logger.info('Chunks stored in database', { count: storedChunks.data.length });

      // Step 6: Generate embeddings (if enabled)
      if (this.config.enableEmbeddings) {
        await this.embeddingGenerator.initialize();

        onProgress?.({
          stage: ProcessingStage.EMBEDDING,
          progress: 70,
          message: 'Generating embeddings...',
        });

        const embeddingResults = await this.embeddingGenerator.generateBatch(
          chunkingResult.chunks.map(c => c.content),
        );

        logger.info('Embeddings generated', { count: embeddingResults.length });

        // Step 7: Store embeddings
        onProgress?.({
          stage: ProcessingStage.INDEXING,
          progress: 85,
          message: 'Indexing embeddings...',
        });

        const storedEmbeddings = await this.storeEmbeddings(
          embeddingResults,
          storedChunks.data,
          documentId,
          projectId,
          workspaceId,
        );

        if (!storedEmbeddings.success) {
          logger.warn('Failed to store some embeddings', storedEmbeddings.error);
        }

        // Add embeddings to vector store
        for (const embedding of storedEmbeddings.data || []) {
          await this.vectorStore.addEmbedding(embedding);
        }

        logger.info('Embeddings indexed', { count: storedEmbeddings.data?.length || 0 });
      }

      // Step 8: Complete processing
      await this.updateDocumentStage(documentId, ProcessingStage.COMPLETED, 100, {
        chunk_count: storedChunks.data.length,
        processing_duration_ms: Date.now() - startTime,
      });

      onProgress?.({
        stage: ProcessingStage.COMPLETED,
        progress: 100,
        message: 'Processing completed',
      });

      // Log completion
      await this.logProcessing(
        documentId,
        projectId,
        workspaceId,
        ProcessingStage.COMPLETED,
        'info',
        `Successfully processed document with ${storedChunks.data.length} chunks`,
      );

      // Update metrics
      this.stats.documentsProcessed++;
      this.stats.totalProcessingTimeMs += Date.now() - startTime;
      this.stats.averageProcessingTimeMs = Math.round(
        this.stats.totalProcessingTimeMs / this.stats.documentsProcessed,
      );

      if (this.config.enableMetrics) {
        await this.storeMetrics(workspaceId, projectId);
      }

      logger.info('Document processing pipeline completed', {
        documentId,
        duration: Date.now() - startTime,
        chunkCount: storedChunks.data.length,
      });

      return {
        success: true,
        data: {
          id: documentId,
          uploadId: documentId,
          projectId,
          workspaceId,
          stage: ProcessingStage.COMPLETED,
          content: extraction.content,
          // @ts-ignore
          metadata: extraction.metadata,
          chunkCount: storedChunks.data.length,
          startedAt: new Date(startTime),
          completedAt: new Date(),
          processingTimeMs: Date.now() - startTime,
          stageHistory: [],
        },
      };
    } catch (error) {
      logger.error('Document processing failed', error);

      this.stats.extractionErrors++;

      // Update document with error
      await this.updateDocumentStage(documentId, ProcessingStage.FAILED, 0, {
        error_message: error instanceof Error ? error.message : 'Unknown error',
      });

      await this.logProcessing(
        documentId,
        projectId,
        workspaceId,
        ProcessingStage.FAILED,
        'error',
        error instanceof Error ? error.message : 'Unknown error',
      );

      onProgress?.({
        stage: ProcessingStage.FAILED,
        progress: 0,
        message: `Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Update document processing stage
   */
  private async updateDocumentStage(
    documentId: string,
    stage: ProcessingStage,
    progress: number,
    additionalUpdates?: Record<string, unknown>,
  ): Promise<void> {
    try {
      const result = await this.db.updateDocumentStage(documentId, stage, {
        updated_at: new Date(),
        ...additionalUpdates,
      });

      if (!result.success) {
        logger.warn('Failed to update document stage', { documentId, stage, error: result.error });
      }
    } catch (error) {
      logger.error('Error updating document stage', error);
    }
  }

  /**
   * Store chunks in database
   */
  private async storeChunks(
    chunks: any[],
    documentId: string,
    projectId: string,
    workspaceId: string,
    filename: string,
  ): Promise<DatabaseOperationResult<ChunkRecord[]>> {
    try {
      const chunkRecords: Omit<ChunkRecord, 'id' | 'created_at' | 'updated_at'>[] = chunks.map(
        chunk => ({
          document_id: documentId,
          project_id: projectId,
          workspace_id: workspaceId,
          content: chunk.content,
          chunk_index: chunk.metadata.chunkIndex,
          total_chunks: chunk.metadata.totalChunks,
          start_position: chunk.metadata.startPosition,
          end_position: chunk.metadata.endPosition,
          character_count: chunk.metadata.characterCount,
          word_count: chunk.metadata.wordCount,
          token_count: chunk.metadata.tokenCount,
          source_filename: filename,
          source_title: chunk.metadata.sourceTitle,
          chunking_strategy: chunk.metadata.strategy,
          confidence_score: chunk.metadata.confidenceScore,
          context_type: chunk.metadata.contextType,
          is_first_chunk: chunk.metadata.isFirstChunk,
          is_last_chunk: chunk.metadata.isLastChunk,
          previous_chunk_id: chunk.metadata.previousChunkId,
          next_chunk_id: chunk.metadata.nextChunkId,
          metadata: chunk.metadata.customMetadata || {},
        }),
      );

      const result = await this.db.createChunksBatch(chunkRecords);

      if (!result.success) {
        throw new Error(`Failed to store chunks: ${result.results.filter(r => !r.success).length} failed`);
      }

      return {
        success: true,
        data: result.results.filter(r => r.success).map(r => r.data!),
      };
    } catch (error) {
      logger.error('Failed to store chunks', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Store embeddings in database
   */
  private async storeEmbeddings(
    embeddingResults: any[],
    chunks: ChunkRecord[],
    documentId: string,
    projectId: string,
    workspaceId: string,
  ): Promise<DatabaseOperationResult<EmbeddingRecord[]>> {
    try {
      const embeddingRecords: Omit<EmbeddingRecord, 'id' | 'created_at' | 'updated_at'>[] =
        embeddingResults.map((result, index) => ({
          chunk_id: chunks[index].id,
          document_id: documentId,
          project_id: projectId,
          workspace_id: workspaceId,
          embedding: result.embedding,
          embedding_model: result.model,
          embedding_dimension: result.dimension,
          cosine_similarity_search_enabled: true,
          metadata: {},
        }));

      const result = await this.db.createEmbeddingsBatch(embeddingRecords);

      if (!result.success) {
        logger.warn('Some embeddings failed to store', {
          successful: result.totalSuccessful,
          failed: result.totalFailed,
        });
      }

      return {
        success: result.success,
        data: result.results.filter(r => r.success).map(r => r.data!),
      };
    } catch (error) {
      logger.error('Failed to store embeddings', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Log processing event
   */
  private async logProcessing(
    documentId: string,
    projectId: string,
    workspaceId: string,
    stage: ProcessingStage,
    level: 'debug' | 'info' | 'warning' | 'error',
    message: string,
  ): Promise<void> {
    try {
      const log: Omit<ProcessingLogRecord, 'id' | 'created_at'> = {
        document_id: documentId,
        project_id: projectId,
        workspace_id: workspaceId,
        stage,
        level,
        message,
        metadata: {},
      };

      await this.db.logProcessing(log);
    } catch (error) {
      logger.warn('Failed to log processing event', error);
    }
  }

  /**
   * Store metrics
   */
  private async storeMetrics(workspaceId: string, projectId?: string): Promise<void> {
    try {
      const metrics: Omit<RAGMetricsRecord, 'id' | 'created_at'> = {
        workspace_id: workspaceId,
        project_id: projectId,
        documents_processed: this.stats.documentsProcessed,
        chunks_created: this.stats.chunksCreated,
        average_chunk_size: this.stats.averageChunkSize,
        total_characters: this.stats.totalCharacters,
        total_tokens: this.stats.totalTokens,
        average_processing_time_ms: this.stats.averageProcessingTimeMs,
        total_processing_time_ms: this.stats.totalProcessingTimeMs,
        extraction_errors: this.stats.extractionErrors,
        chunking_errors: this.stats.chunkingErrors,
        embeddings_created: this.stats.chunksCreated, // Approximate
        period_start: new Date(Date.now() - 24 * 60 * 60 * 1000),
        period_end: new Date(),
      };

      await this.db.updateRAGMetrics(metrics);
    } catch (error) {
      logger.warn('Failed to store metrics', error);
    }
  }

  /**
   * Get current statistics
   */
  getStatistics(): RAGProcessingStats {
    return { ...this.stats };
  }

  /**
   * Reset statistics
   */
  resetStatistics(): void {
    this.stats = {
      documentsProcessed: 0,
      chunksCreated: 0,
      averageChunkSize: 0,
      totalCharacters: 0,
      totalTokens: 0,
      averageProcessingTimeMs: 0,
      totalProcessingTimeMs: 0,
      extractionErrors: 0,
      chunkingErrors: 0,
    };

    logger.info('Statistics reset');
  }
}

/**
 * Factory function to create a document processor
 */
export function createDocumentProcessor(
  db: SupabaseService,
  config?: DocumentProcessorConfig,
): DocumentProcessor {
  return new DocumentProcessor(db, config);
}
