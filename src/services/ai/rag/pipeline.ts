import { getEmbeddingService } from '../embedding/embedder';
import { getVectorStore, DocumentMetadata } from '../database/supabase';
import { chunkText } from './chunker';

/**
 * RAG Pipeline to handle document ingestion and retrieval
 */
export class RAGPipeline {
  private embedder = getEmbeddingService();
  private store = getVectorStore();

  /**
   * Ingests a document by chunking, embedding, and storing
   */
  async ingestDocument(documentId: string, content: string, metadata: DocumentMetadata = {}): Promise<void> {
    const chunks = chunkText(content);
    
    // Process in batches or sequentially
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await this.embedder.embed(chunk);
      
      await this.store.insertEmbedding(
        documentId, 
        chunk, 
        embedding, 
        { ...metadata, chunkIndex: i }
      );
    }
  }

  /**
   * Retrieves context chunks relevant to a query
   */
  async retrieveContext(query: string, topK: number = 5) {
    const queryEmbedding = await this.embedder.embed(query);
    return await this.store.searchSimilar(queryEmbedding, topK);
  }

  /**
   * Deletes a document from the RAG pipeline storage
   */
  async deleteDocument(documentId: string): Promise<void> {
    await this.store.deleteByDocumentId(documentId);
  }
}

let instance: RAGPipeline | null = null;

/**
 * Creates or returns the singleton RAGPipeline
 */
export function getRAGPipeline(): RAGPipeline {
  if (!instance) {
    instance = new RAGPipeline();
  }
  return instance;
}
