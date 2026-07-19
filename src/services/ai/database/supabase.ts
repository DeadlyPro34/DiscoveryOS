import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Metadata type for vector store records
 */
export interface DocumentMetadata {
  projectId?: string;
  source?: string;
  [key: string]: unknown;
}

/**
 * Vector store result
 */
export interface VectorSearchResult {
  id: string;
  content: string;
  metadata: DocumentMetadata;
  similarity: number;
}

/**
 * Vector Store for managing embeddings using Supabase pgvector
 */
export class VectorStore {
  private client: SupabaseClient;

  constructor() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      throw new Error('Supabase URL and Service Role Key are required for VectorStore');
    }

    this.client = createClient(url, key);
  }

  /**
   * Inserts an embedding into the vector store
   */
  async insertEmbedding(id: string, content: string, embedding: number[], metadata: DocumentMetadata = {}): Promise<void> {
    const { error } = await this.client
      .from('document_embeddings')
      .insert({
        document_id: id,
        content,
        embedding,
        metadata
      });

    if (error) {
      throw new Error(`Failed to insert embedding: ${error.message}`);
    }
  }

  /**
   * Searches for similar documents
   */
  async searchSimilar(queryEmbedding: number[], topK: number = 5, threshold: number = 0.7): Promise<VectorSearchResult[]> {
    const { data, error } = await this.client.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: threshold,
      match_count: topK
    });

    if (error) {
      throw new Error(`Failed to search similar documents: ${error.message}`);
    }

    return (data || []).map((row: any) => ({
      id: row.document_id,
      content: row.content,
      metadata: row.metadata,
      similarity: row.similarity
    }));
  }

  /**
   * Deletes all embeddings for a given document
   */
  async deleteByDocumentId(documentId: string): Promise<void> {
    const { error } = await this.client
      .from('document_embeddings')
      .delete()
      .eq('document_id', documentId);

    if (error) {
      throw new Error(`Failed to delete document embeddings: ${error.message}`);
    }
  }
}

let instance: VectorStore | null = null;

/**
 * Creates or returns the singleton instance of VectorStore
 */
export function getVectorStore(): VectorStore {
  if (!instance) {
    instance = new VectorStore();
  }
  return instance;
}
