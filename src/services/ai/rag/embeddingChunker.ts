/**
 * Chunker Service
 * Handles document chunking using various strategies for RAG pipeline.
 */

const uuidv4 = () => crypto.randomUUID();
import {
  ChunkingStrategy,
  ChunkingConfig,
  ChunkingResult,
  DocumentChunk,
  ChunkMetadata,
} from '@/types/ai/rag';

const logger = {
  debug: (msg: string, data?: unknown) => console.debug(`[Chunker:DEBUG] ${msg}`, data),
  info: (msg: string, data?: unknown) => console.info(`[Chunker:INFO] ${msg}`, data),
  warn: (msg: string, data?: unknown) => console.warn(`[Chunker:WARN] ${msg}`, data),
  error: (msg: string, data?: unknown) => console.error(`[Chunker:ERROR] ${msg}`, data),
};

/**
 * Default chunking configuration
 */
const DEFAULT_CHUNKING_CONFIG: ChunkingConfig = {
  strategy: ChunkingStrategy.FIXED_SIZE,
  chunkSize: 1024,
  overlapSize: 128,
  minChunkSize: 100,
  maxChunkSize: 4096,
  preserveSentenceBoundaries: true,
  preserveParagraphBoundaries: true,
  language: 'en',
  maxChunksPerDocument: 1000,
};

/**
 * Document chunking service
 */
export class Chunker {
  private config: ChunkingConfig;

  constructor(config?: Partial<ChunkingConfig>) {
    this.config = { ...DEFAULT_CHUNKING_CONFIG, ...config };
    logger.info('Chunker initialized', { strategy: this.config.strategy });
  }

  /**
   * Chunk a document into smaller pieces
   */
  async chunk(
    documentId: string,
    content: string,
    filename: string,
    title?: string,
    config?: Partial<ChunkingConfig>,
  ): Promise<ChunkingResult> {
    const startTime = Date.now();
    const cfg = { ...this.config, ...config };

    try {
      logger.debug('Starting document chunking', {
        documentId,
        contentLength: content.length,
        strategy: cfg.strategy,
      });

      // Validate content
      if (!content || content.trim().length === 0) {
        throw new Error('Document content is empty');
      }

      let chunks: DocumentChunk[] = [];

      // Choose chunking strategy
      switch (cfg.strategy) {
        case ChunkingStrategy.FIXED_SIZE:
          chunks = this.chunkByFixedSize(content, documentId, filename, title, cfg);
          break;

        case ChunkingStrategy.SEMANTIC:
          chunks = this.chunkBySemantic(content, documentId, filename, title, cfg);
          break;

        case ChunkingStrategy.PARAGRAPH:
          chunks = this.chunkByParagraph(content, documentId, filename, title, cfg);
          break;

        case ChunkingStrategy.SENTENCE:
          chunks = this.chunkBySentence(content, documentId, filename, title, cfg);
          break;

        case ChunkingStrategy.HIERARCHICAL:
          chunks = this.chunkHierarchical(content, documentId, filename, title, cfg);
          break;

        default:
          throw new Error(`Unknown chunking strategy: ${cfg.strategy}`);
      }

      // Enforce max chunks
      if (chunks.length > cfg.maxChunksPerDocument) {
        logger.warn('Document produced too many chunks, truncating', {
          originalCount: chunks.length,
          maxChunks: cfg.maxChunksPerDocument,
        });
        chunks = chunks.slice(0, cfg.maxChunksPerDocument);
      }

      // Link chunks for context retrieval
      this.linkChunks(chunks);

      // Calculate metrics
      const averageChunkSize = chunks.length > 0 
        ? Math.round(chunks.reduce((sum, c) => sum + c.content.length, 0) / chunks.length)
        : 0;
      const totalContentSize = chunks.reduce((sum, c) => sum + c.content.length, 0);

      logger.info('Document chunking completed', {
        documentId,
        chunkCount: chunks.length,
        averageChunkSize,
        strategy: cfg.strategy,
        duration: Date.now() - startTime,
      });

      return {
        chunks,
        chunkCount: chunks.length,
        strategy: cfg.strategy,
        averageChunkSize,
        totalContentSize,
        success: true,
        processingTimeMs: Date.now() - startTime,
        warnings: [],
      };
    } catch (error) {
      logger.error('Document chunking failed', error);
      return {
        chunks: [],
        chunkCount: 0,
        strategy: cfg.strategy,
        averageChunkSize: 0,
        totalContentSize: 0,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        processingTimeMs: Date.now() - startTime,
        warnings: [],
      };
    }
  }

  /**
   * Chunk by fixed size with overlap
   */
  private chunkByFixedSize(
    content: string,
    documentId: string,
    filename: string,
    title: string | undefined,
    config: ChunkingConfig,
  ): DocumentChunk[] {
    const chunks: DocumentChunk[] = [];
    const { chunkSize, overlapSize, minChunkSize } = config;

    let position = 0;
    let chunkIndex = 0;

    while (position < content.length) {
      const end = Math.min(position + chunkSize, content.length);
      const chunkContent = content.substring(position, end);

      // Skip very small chunks
      if (chunkContent.length < minChunkSize && position > 0) {
        break;
      }

      const chunk = this.createChunk(
        documentId,
        filename,
        title,
        chunkContent,
        position,
        end,
        chunkIndex,
        0, // Will be set when total is known
        ChunkingStrategy.FIXED_SIZE,
      );

      chunks.push(chunk);

      // Move position with overlap
      position = end - overlapSize;
      if (position <= 0) position = end;
      chunkIndex++;
    }

    // Update total chunks
    chunks.forEach(chunk => {
      chunk.metadata.totalChunks = chunks.length;
    });

    return chunks;
  }

  /**
   * Chunk by semantic units (sentences and paragraphs)
   */
  private chunkBySemantic(
    content: string,
    documentId: string,
    filename: string,
    title: string | undefined,
    config: ChunkingConfig,
  ): DocumentChunk[] {
    const paragraphs = content.split(/\n\n+/);
    const chunks: DocumentChunk[] = [];
    let currentChunk = '';
    let currentStart = 0;
    let chunkIndex = 0;
    let position = 0;

    for (const paragraph of paragraphs) {
      const sentences = paragraph.split(/(?<=[.!?])\s+/);

      for (const sentence of sentences) {
        const potentialChunk = currentChunk ? currentChunk + ' ' + sentence : sentence;

        if (potentialChunk.length <= config.chunkSize) {
          if (!currentChunk) currentStart = position;
          currentChunk = potentialChunk;
        } else {
          if (currentChunk.length >= config.minChunkSize) {
            const chunk = this.createChunk(
              documentId,
              filename,
              title,
              currentChunk,
              currentStart,
              position,
              chunkIndex,
              0,
              ChunkingStrategy.SEMANTIC,
            );
            chunks.push(chunk);
            chunkIndex++;
          }
          currentChunk = sentence;
          currentStart = position;
        }

        position += sentence.length + 1;
      }

      // Add paragraph break
      position += 2;
    }

    // Add final chunk
    if (currentChunk.length >= config.minChunkSize) {
      const chunk = this.createChunk(
        documentId,
        filename,
        title,
        currentChunk,
        currentStart,
        position,
        chunkIndex,
        0,
        ChunkingStrategy.SEMANTIC,
      );
      chunks.push(chunk);
    }

    // Update total chunks
    chunks.forEach(chunk => {
      chunk.metadata.totalChunks = chunks.length;
    });

    return chunks;
  }

  /**
   * Chunk by paragraph
   */
  private chunkByParagraph(
    content: string,
    documentId: string,
    filename: string,
    title: string | undefined,
    config: ChunkingConfig,
  ): DocumentChunk[] {
    const paragraphs = content.split(/\n\n+/).filter(p => p.trim().length > 0);
    const chunks: DocumentChunk[] = [];
    let currentChunk = '';
    let currentStart = 0;
    let chunkIndex = 0;
    let position = 0;

    for (const paragraph of paragraphs) {
      const potentialChunk = currentChunk ? currentChunk + '\n\n' + paragraph : paragraph;

      if (potentialChunk.length <= config.chunkSize) {
        if (!currentChunk) currentStart = position;
        currentChunk = potentialChunk;
      } else {
        if (currentChunk.length >= config.minChunkSize) {
          const chunk = this.createChunk(
            documentId,
            filename,
            title,
            currentChunk,
            currentStart,
            position,
            chunkIndex,
            0,
            ChunkingStrategy.PARAGRAPH,
          );
          chunks.push(chunk);
          chunkIndex++;
        }
        currentChunk = paragraph;
        currentStart = position;
      }

      position += paragraph.length + 2;
    }

    // Add final chunk
    if (currentChunk.length >= config.minChunkSize) {
      const chunk = this.createChunk(
        documentId,
        filename,
        title,
        currentChunk,
        currentStart,
        position,
        chunkIndex,
        0,
        ChunkingStrategy.PARAGRAPH,
      );
      chunks.push(chunk);
    }

    // Update total chunks
    chunks.forEach(chunk => {
      chunk.metadata.totalChunks = chunks.length;
    });

    return chunks;
  }

  /**
   * Chunk by sentence
   */
  private chunkBySentence(
    content: string,
    documentId: string,
    filename: string,
    title: string | undefined,
    config: ChunkingConfig,
  ): DocumentChunk[] {
    const sentences = content.split(/(?<=[.!?])\s+/);
    const chunks: DocumentChunk[] = [];
    let currentChunk = '';
    let currentStart = 0;
    let chunkIndex = 0;
    let position = 0;

    for (const sentence of sentences) {
      const potentialChunk = currentChunk ? currentChunk + ' ' + sentence : sentence;

      if (potentialChunk.length <= config.chunkSize) {
        if (!currentChunk) currentStart = position;
        currentChunk = potentialChunk;
      } else {
        if (currentChunk.length >= config.minChunkSize) {
          const chunk = this.createChunk(
            documentId,
            filename,
            title,
            currentChunk,
            currentStart,
            position,
            chunkIndex,
            0,
            ChunkingStrategy.SENTENCE,
          );
          chunks.push(chunk);
          chunkIndex++;
        }
        currentChunk = sentence;
        currentStart = position;
      }

      position += sentence.length + 1;
    }

    // Add final chunk
    if (currentChunk.length >= config.minChunkSize) {
      const chunk = this.createChunk(
        documentId,
        filename,
        title,
        currentChunk,
        currentStart,
        position,
        chunkIndex,
        0,
        ChunkingStrategy.SENTENCE,
      );
      chunks.push(chunk);
    }

    // Update total chunks
    chunks.forEach(chunk => {
      chunk.metadata.totalChunks = chunks.length;
    });

    return chunks;
  }

  /**
   * Hierarchical chunking (combination of strategies)
   */
  private chunkHierarchical(
    content: string,
    documentId: string,
    filename: string,
    title: string | undefined,
    config: ChunkingConfig,
  ): DocumentChunk[] {
    // First chunk by paragraphs, then by sentences if needed
    const paragraphChunks = this.chunkByParagraph(content, documentId, filename, title, {
      ...config,
      chunkSize: config.chunkSize * 2, // Use larger size for paragraphs
    });

    const finalChunks: DocumentChunk[] = [];
    let chunkIndex = 0;

    for (const chunk of paragraphChunks) {
      if (chunk.content.length > config.chunkSize) {
        // Further chunk large paragraphs by sentence
        const subChunks = this.chunkBySentence(
          chunk.content,
          documentId,
          filename,
          title,
          config,
        );

        for (const subChunk of subChunks) {
          subChunk.metadata.chunkIndex = chunkIndex++;
          finalChunks.push(subChunk);
        }
      } else {
        chunk.metadata.chunkIndex = chunkIndex++;
        finalChunks.push(chunk);
      }
    }

    // Update total chunks
    finalChunks.forEach(chunk => {
      chunk.metadata.totalChunks = finalChunks.length;
    });

    return finalChunks;
  }

  /**
   * Create a chunk object
   */
  private createChunk(
    documentId: string,
    filename: string,
    title: string | undefined,
    content: string,
    startPosition: number,
    endPosition: number,
    chunkIndex: number,
    totalChunks: number,
    strategy: ChunkingStrategy,
  ): DocumentChunk {
    const id = uuidv4();
    const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
    const tokenCount = Math.ceil(content.length / 4); // Rough estimate

    const metadata: ChunkMetadata = {
      id,
      documentId,
      chunkIndex,
      totalChunks,
      startPosition,
      endPosition,
      characterCount: content.length,
      wordCount,
      tokenCount,
      sourceFilename: filename,
      sourceTitle: title,
      strategy,
      confidenceScore: 1.0,
      contextType: 'unknown',
      isFirstChunk: chunkIndex === 0,
      isLastChunk: false, // Will be set when total is known
      previousChunkId: undefined,
      nextChunkId: undefined,
    };

    return {
      id,
      content,
      metadata,
      processed: false,
      createdAt: new Date(),
    };
  }

  /**
   * Link chunks for context retrieval
   */
  private linkChunks(chunks: DocumentChunk[]): void {
    for (let i = 0; i < chunks.length; i++) {
      if (i > 0) {
        chunks[i].metadata.previousChunkId = chunks[i - 1].id;
      }

      if (i < chunks.length - 1) {
        chunks[i].metadata.nextChunkId = chunks[i + 1].id;
      }

      chunks[i].metadata.isLastChunk = i === chunks.length - 1;
    }
  }
}

/**
 * Factory function to create a chunker
 */
export function createChunker(config?: Partial<ChunkingConfig>): Chunker {
  return new Chunker(config);
}
