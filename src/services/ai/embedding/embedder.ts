/**
 * Embedding service using Xenova Transformers
 */
export class EmbeddingService {
  private pipelinePromise: Promise<any> | null = null;
  private readonly modelName = 'Xenova/all-MiniLM-L6-v2';

  private async getPipeline() {
    if (!this.pipelinePromise) {
      this.pipelinePromise = import('@xenova/transformers').then(
        ({ pipeline }) => pipeline('feature-extraction', this.modelName)
      );
    }
    return this.pipelinePromise;
  }

  /**
   * Embeds a single text string
   */
  async embed(text: string): Promise<number[]> {
    const pipe = await this.getPipeline();
    const result = await pipe(text, { pooling: 'mean', normalize: true });
    return Array.from(result.data);
  }

  /**
   * Embeds a batch of text strings
   */
  async embedBatch(texts: string[]): Promise<number[][]> {
    const pipe = await this.getPipeline();
    const result = await pipe(texts, { pooling: 'mean', normalize: true });
    const output: number[][] = [];
    const size = result.dims[1];
    for (let i = 0; i < texts.length; i++) {
      output.push(Array.from(result.data.slice(i * size, (i + 1) * size)));
    }
    return output;
  }
}

let instance: EmbeddingService | null = null;

/**
 * Creates or returns the singleton instance of EmbeddingService
 */
export function getEmbeddingService(): EmbeddingService {
  if (!instance) {
    instance = new EmbeddingService();
  }
  return instance;
}
