/**
 * Embedding Generator Service
 * Generates vector embeddings for document chunks using transformer models.
 */

interface EmbeddingGeneratorConfig {
  modelName: string;
  maxSequenceLength: number;
  batchSize: number;
  useGPU: boolean;
}

interface EmbeddingBatch {
  texts: string[];
  embeddings: number[][];
}

interface EmbeddingResult {
  text: string;
  embedding: number[];
  model: string;
  dimension: number;
}

const logger = {
  debug: (msg: string, data?: unknown) => console.debug(`[EmbeddingGenerator:DEBUG] ${msg}`, data),
  info: (msg: string, data?: unknown) => console.info(`[EmbeddingGenerator:INFO] ${msg}`, data),
  warn: (msg: string, data?: unknown) => console.warn(`[EmbeddingGenerator:WARN] ${msg}`, data),
  error: (msg: string, data?: unknown) => console.error(`[EmbeddingGenerator:ERROR] ${msg}`, data),
};

/**
 * Default embedding configuration
 */
const DEFAULT_CONFIG: EmbeddingGeneratorConfig = {
  modelName: 'all-MiniLM-L6-v2',
  maxSequenceLength: 384,
  batchSize: 32,
  useGPU: false,
};

/**
 * Embedding generator service using transformer models
 */
export class EmbeddingGenerator {
  private config: EmbeddingGeneratorConfig;
  private model: unknown | null = null;
  private isInitialized = false;

  constructor(config?: Partial<EmbeddingGeneratorConfig>) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    logger.info('EmbeddingGenerator initialized', { model: this.config.modelName });
  }

  /**
   * Initialize the embedding model
   */
  async initialize(): Promise<void> {
    try {
      if (this.isInitialized) {
        logger.debug('EmbeddingGenerator already initialized');
        return;
      }

      logger.info('Initializing embedding model', { model: this.config.modelName });

      // In production, use @xenova/transformers or similar
      // This is a simplified stub that works without external dependencies
      logger.info('Embedding model initialized', { model: this.config.modelName });
      this.isInitialized = true;
    } catch (error) {
      logger.error('Failed to initialize embedding model', error);
      throw error;
    }
  }

  /**
   * Generate embeddings for a single text
   */
  async generate(text: string): Promise<EmbeddingResult> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      logger.debug('Generating embedding for text', { textLength: text.length });

      // Truncate if needed
      const truncatedText = this.truncateText(text, this.config.maxSequenceLength);

      // Generate embedding
      // In production, call the actual model
      const embedding = this.generateEmbedding(truncatedText);

      logger.debug('Embedding generated', { dimension: embedding.length });

      return {
        text: truncatedText,
        embedding,
        model: this.config.modelName,
        dimension: embedding.length,
      };
    } catch (error) {
      logger.error('Failed to generate embedding', error);
      throw error;
    }
  }

  /**
   * Generate embeddings for multiple texts (batched)
   */
  async generateBatch(texts: string[]): Promise<EmbeddingResult[]> {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      logger.info('Generating embeddings for batch', { batchSize: texts.length });

      const results: EmbeddingResult[] = [];

      // Process in batches
      for (let i = 0; i < texts.length; i += this.config.batchSize) {
        const batch = texts.slice(i, i + this.config.batchSize);
        const batchResults = await this.processBatch(batch);
        results.push(...batchResults);
      }

      logger.info('Batch embedding generation completed', { totalEmbeddings: results.length });

      return results;
    } catch (error) {
      logger.error('Failed to generate batch embeddings', error);
      throw error;
    }
  }

  /**
   * Process a batch of texts
   */
  private async processBatch(texts: string[]): Promise<EmbeddingResult[]> {
    const results: EmbeddingResult[] = [];

    for (const text of texts) {
      const truncatedText = this.truncateText(text, this.config.maxSequenceLength);
      const embedding = this.generateEmbedding(truncatedText);

      results.push({
        text: truncatedText,
        embedding,
        model: this.config.modelName,
        dimension: embedding.length,
      });
    }

    return results;
  }

  /**
   * Truncate text to max sequence length
   */
  private truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) {
      return text;
    }

    // Find a good truncation point (at word boundary)
    let truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');

    if (lastSpace > 0) {
      truncated = truncated.substring(0, lastSpace);
    }

    return truncated;
  }

  /**
   * Generate embedding vector (stub implementation)
   * In production, use the actual transformer model
   */
  private generateEmbedding(text: string): number[] {
    // Stub implementation that generates a deterministic embedding based on text hash
    // In production, use @xenova/transformers or a backend service

    const dimension = 384; // all-MiniLM-L6-v2 dimension
    const embedding: number[] = new Array(dimension);

    // Simple hash-based generation for demonstration
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }

    // Generate deterministic random values
    const seededRandom = this.seededRandomGenerator(hash);

    for (let i = 0; i < dimension; i++) {
      // Generate random values in roughly normal distribution
      const u1 = seededRandom();
      const u2 = seededRandom();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      embedding[i] = z / 10; // Scale to reasonable range
    }

    // Normalize to unit vector
    const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    for (let i = 0; i < embedding.length; i++) {
      embedding[i] = norm > 0 ? embedding[i] / norm : 0;
    }

    return embedding;
  }

  /**
   * Seeded random number generator
   */
  private seededRandomGenerator(seed: number) {
    let state = seed;

    return () => {
      state = (state * 9301 + 49297) % 233280;
      return state / 233280;
    };
  }

  /**
   * Calculate similarity between two embeddings
   */
  static calculateSimilarity(embedding1: number[], embedding2: number[]): number {
    if (embedding1.length !== embedding2.length) {
      throw new Error('Embeddings must have the same dimension');
    }

    let dotProduct = 0;
    let norm1 = 0;
    let norm2 = 0;

    for (let i = 0; i < embedding1.length; i++) {
      dotProduct += embedding1[i] * embedding2[i];
      norm1 += embedding1[i] * embedding1[i];
      norm2 += embedding2[i] * embedding2[i];
    }

    norm1 = Math.sqrt(norm1);
    norm2 = Math.sqrt(norm2);

    if (norm1 === 0 || norm2 === 0) {
      return 0;
    }

    return dotProduct / (norm1 * norm2);
  }

  /**
   * Find top k most similar embeddings
   */
  static findTopSimilar(
    queryEmbedding: number[],
    embeddings: Array<{ embedding: number[]; id: string; score?: number }>,
    k: number = 5,
  ): Array<{ id: string; similarity: number }> {
    const similarities = embeddings.map(item => ({
      id: item.id,
      similarity: EmbeddingGenerator.calculateSimilarity(queryEmbedding, item.embedding),
    }));

    return similarities.sort((a, b) => b.similarity - a.similarity).slice(0, k);
  }

  /**
   * Get model information
   */
  getModelInfo() {
    return {
      name: this.config.modelName,
      dimension: 384,
      maxSequenceLength: this.config.maxSequenceLength,
      initialized: this.isInitialized,
    };
  }
}

/**
 * Factory function to create an embedding generator
 */
export function createEmbeddingGenerator(
  config?: Partial<EmbeddingGeneratorConfig>,
): EmbeddingGenerator {
  return new EmbeddingGenerator(config);
}
