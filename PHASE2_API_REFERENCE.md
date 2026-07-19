/**
 * Phase 2 RAG Pipeline - Quick Reference API Guide
 * All methods with signatures and examples
 */

// ============================================================================
// SUPABASE CLIENT SERVICE
// ============================================================================

import { SupabaseService, createSupabaseService } from '@/services/ai/database/supabaseClient';
import {
  DatabaseOperationResult,
  BatchOperationResult,
  QueryOptions,
  DatabaseConnectionOptions,
} from '@/types/database';

/**
 * INITIALIZATION
 */

// Create and initialize the Supabase client
const db = createSupabaseService({
  supabaseUrl: process.env.SUPABASE_URL!,
  supabaseKey: process.env.SUPABASE_KEY!,
  poolSize: 10,
  connectionTimeout: 10000,
  queryTimeout: 30000,
  maxRetries: 3,
});

await db.initialize();

// Check database health
const health = await db.healthCheck();
// Returns: {
//   healthy: boolean;
//   connectionValid: boolean;
//   responseTimeMs: number;
//   timestamp: Date;
//   details?: Record<string, unknown>;
// }

/**
 * WORKSPACE OPERATIONS
 */

// Create workspace
const createWorkspaceResult = await db.createWorkspace({
  name: 'Company Name',
  slug: 'company-slug',
  owner_id: 'user-uuid',
  is_active: true,
});
// Returns: DatabaseOperationResult<WorkspaceRecord>

// Get workspace
const getWorkspaceResult = await db.getWorkspace('workspace-id');

// List workspaces with filters
const listWorkspacesResult = await db.listWorkspaces({
  filters: [
    { field: 'is_active', operator: 'eq', value: true },
  ],
  sort: [{ field: 'created_at', order: 'desc' }],
  pagination: { offset: 0, limit: 10 },
});

// Update workspace
const updateResult = await db.updateWorkspace('workspace-id', {
  name: 'Updated Name',
  description: 'New description',
});

/**
 * PROJECT OPERATIONS
 */

// Create project
const createProjectResult = await db.createProject({
  workspace_id: 'workspace-id',
  name: 'Project Name',
  status: 'research',
  description: 'Project description',
  tags: ['tag1', 'tag2'],
});

// Get project
const getProjectResult = await db.getProject('project-id');

// List projects for workspace
const listProjectsResult = await db.listProjects('workspace-id', {
  filters: [{ field: 'status', operator: 'eq', value: 'processing' }],
  sort: [{ field: 'created_at', order: 'desc' }],
});

/**
 * DOCUMENT OPERATIONS
 */

// Create document
const createDocumentResult = await db.createDocument({
  project_id: 'project-id',
  workspace_id: 'workspace-id',
  filename: 'document.txt',
  file_path: 's3://bucket/path/file.txt',
  file_size: 1024,
  mime_type: 'text/plain',
  original_name: 'Document.txt',
  stage: 'uploaded',
  chunk_count: 0,
});

// Get document
const getDocumentResult = await db.getDocument('document-id');

// Update document stage
const updateStageResult = await db.updateDocumentStage(
  'document-id',
  'completed',
  {
    chunk_count: 10,
    processing_duration_ms: 5000,
  },
);

// List documents in project
const listDocumentsResult = await db.listDocuments('project-id', {
  filters: [{ field: 'stage', operator: 'eq', value: 'completed' }],
  pagination: { offset: 0, limit: 20 },
});

/**
 * CHUNK OPERATIONS
 */

// Create single chunk
const createChunkResult = await db.createChunk({
  document_id: 'doc-id',
  project_id: 'project-id',
  workspace_id: 'workspace-id',
  content: 'Chunk text content...',
  chunk_index: 0,
  total_chunks: 5,
  start_position: 0,
  end_position: 1024,
  character_count: 1024,
  word_count: 200,
  token_count: 256,
  source_filename: 'doc.txt',
  chunking_strategy: 'fixed-size',
  confidence_score: 1.0,
  context_type: 'paragraph',
  is_first_chunk: true,
  is_last_chunk: false,
});

// Batch create chunks (more efficient for multiple)
const batchChunkResult = await db.createChunksBatch(chunks);
// Returns: BatchOperationResult<ChunkRecord>

// Get single chunk
const getChunkResult = await db.getChunk('chunk-id');

// List chunks from document
const listChunksResult = await db.listChunks('document-id', {
  sort: [{ field: 'chunk_index', order: 'asc' }],
});

/**
 * EMBEDDING OPERATIONS
 */

// Create single embedding
const createEmbeddingResult = await db.createEmbedding({
  chunk_id: 'chunk-id',
  document_id: 'doc-id',
  project_id: 'project-id',
  workspace_id: 'workspace-id',
  embedding: [0.1, 0.2, 0.3, /* ... 384 dimensions */],
  embedding_model: 'all-MiniLM-L6-v2',
  embedding_dimension: 384,
  cosine_similarity_search_enabled: true,
});

// Batch create embeddings
const batchEmbeddingResult = await db.createEmbeddingsBatch(embeddings);

// Vector similarity search
const searchResult = await db.vectorSearch(
  'workspace-id',
  'project-id',
  queryEmbedding, // number[]
  5, // limit
  0.5, // similarity threshold
);

/**
 * CONVERSATION OPERATIONS
 */

// Create conversation
const createConvResult = await db.createConversation({
  project_id: 'project-id',
  workspace_id: 'workspace-id',
  user_id: 'user-id',
  title: 'Chat Title',
  started_at: new Date(),
  last_message_at: new Date(),
  message_count: 0,
  is_archived: false,
});

// Add message to conversation
const addMessageResult = await db.addMessage({
  conversation_id: 'conv-id',
  project_id: 'project-id',
  workspace_id: 'workspace-id',
  role: 'user', // or 'assistant'
  content: 'Message content',
  citations: [
    {
      chunk_id: 'chunk-id',
      document_id: 'doc-id',
      relevance_score: 0.95,
      quote: 'Relevant quote from chunk',
    },
  ],
});

/**
 * LOGGING OPERATIONS
 */

// Log processing event
const logResult = await db.logProcessing({
  document_id: 'doc-id',
  project_id: 'project-id',
  workspace_id: 'workspace-id',
  stage: 'chunking',
  level: 'info',
  message: 'Successfully created 10 chunks',
  metadata: { chunkCount: 10 },
});

/**
 * METRICS OPERATIONS
 */

// Record RAG metrics
const metricsResult = await db.updateRAGMetrics({
  workspace_id: 'workspace-id',
  project_id: 'project-id',
  documents_processed: 10,
  chunks_created: 150,
  average_chunk_size: 1024,
  total_characters: 153600,
  total_tokens: 38400,
  average_processing_time_ms: 5000,
  total_processing_time_ms: 50000,
  extraction_errors: 0,
  chunking_errors: 0,
  embeddings_created: 150,
  period_start: new Date(Date.now() - 24 * 60 * 60 * 1000),
  period_end: new Date(),
});

// ============================================================================
// TEXT EXTRACTOR SERVICE
// ============================================================================

import { TextExtractor, createTextExtractor } from '@/services/ai/rag/textExtractor';

const extractor = createTextExtractor({
  supportedFormats: ['.txt', '.pdf', '.md', '.json'],
  extractMetadata: true,
  detectEncoding: true,
  normalizeWhitespace: true,
  maxSizeBytes: 50 * 1024 * 1024,
});

// Extract text from file
const extractionResult = await extractor.extract('document.txt', buffer);
// Returns: ExtractionResult {
//   content: string;
//   encoding: string;
//   metadata: {
//     title?: string;
//     author?: string;
//     characterCount: number;
//     wordCount: number;
//     tokenCount: number;
//     warnings: string[];
//   };
//   success: boolean;
//   error?: string;
//   processingTimeMs: number;
// }

// ============================================================================
// CHUNKER SERVICE
// ============================================================================

import { Chunker, createChunker } from '@/services/ai/rag/embeddingChunker';
import { ChunkingStrategy } from '@/types/ai/rag';

const chunker = createChunker({
  strategy: ChunkingStrategy.FIXED_SIZE,
  chunkSize: 1024,
  overlapSize: 128,
  minChunkSize: 100,
  maxChunkSize: 4096,
  preserveSentenceBoundaries: true,
  preserveParagraphBoundaries: true,
  language: 'en',
  maxChunksPerDocument: 1000,
});

// Chunk a document
const chunkingResult = await chunker.chunk(
  'document-id',
  'Long document content...',
  'document.txt',
  'Document Title',
  { strategy: ChunkingStrategy.SEMANTIC },
);
// Returns: ChunkingResult {
//   chunks: DocumentChunk[];
//   chunkCount: number;
//   strategy: ChunkingStrategy;
//   averageChunkSize: number;
//   totalContentSize: number;
//   success: boolean;
//   error?: string;
//   processingTimeMs: number;
//   warnings: string[];
// }

// ============================================================================
// EMBEDDING GENERATOR SERVICE
// ============================================================================

import { EmbeddingGenerator, createEmbeddingGenerator } from '@/services/ai/rag/embeddingGenerator';

const generator = createEmbeddingGenerator({
  modelName: 'all-MiniLM-L6-v2',
  maxSequenceLength: 384,
  batchSize: 32,
  useGPU: false,
});

// Initialize model
await generator.initialize();

// Generate single embedding
const embeddingResult = await generator.generate('Text to embed');
// Returns: EmbeddingResult {
//   text: string;
//   embedding: number[];
//   model: string;
//   dimension: number;
// }

// Generate batch embeddings
const batchEmbeddings = await generator.generateBatch([
  'First text',
  'Second text',
  'Third text',
]);

// Calculate similarity
const similarity = EmbeddingGenerator.calculateSimilarity(embedding1, embedding2);

// Find top similar
const topSimilar = EmbeddingGenerator.findTopSimilar(
  queryEmbedding,
  embeddingsList,
  5, // top 5
);

// Get model info
const modelInfo = generator.getModelInfo();

// ============================================================================
// VECTOR STORE SERVICE
// ============================================================================

import { VectorStore, createVectorStore } from '@/services/ai/rag/vectorStore';

const vectorStore = createVectorStore({
  maxVectorDimension: 384,
  similarityThreshold: 0.5,
  maxSearchResults: 10,
});

// Add embedding
await vectorStore.addEmbedding(embeddingRecord);

// Batch add embeddings
await vectorStore.addEmbeddingsBatch(embeddingRecords);

// Search for similar embeddings
const searchResults = await vectorStore.search(
  'workspace-id',
  'project-id',
  queryEmbedding,
  5, // limit
);
// Returns: VectorSearchResult[] {
//   chunkId: string;
//   documentId: string;
//   similarity: number;
//   content: string;
//   metadata: Record<string, unknown>;
// }[]

// Search with pagination
const paginatedResults = await vectorStore.searchWithPagination(
  'workspace-id',
  'project-id',
  queryEmbedding,
  5, // limit
  0, // offset
);

// Multi-query search
const multiResults = await vectorStore.multiSearch(
  'workspace-id',
  'project-id',
  [queryEmbedding1, queryEmbedding2, queryEmbedding3],
  5,
);

// Delete embedding
await vectorStore.deleteEmbedding('embedding-id');

// Clear all embeddings for workspace
await vectorStore.clearWorkspaceEmbeddings('workspace-id');

// Get statistics
const stats = vectorStore.getStatistics();

// ============================================================================
// DOCUMENT PROCESSOR SERVICE
// ============================================================================

import { DocumentProcessor, createDocumentProcessor } from '@/services/ai/rag/documentProcessor';

const processor = createDocumentProcessor(db, {
  enableEmbeddings: true,
  enableMetrics: true,
  logLevel: 'info',
});

// Process complete document pipeline
const processingResult = await processor.processDocument(
  'document-id',
  'project-id',
  'workspace-id',
  'document.txt',
  fileBuffer,
  (progress) => {
    console.log(`[${progress.stage}] ${progress.progress}% - ${progress.message}`);
  },
);
// Returns: DatabaseOperationResult<ProcessedDocument>

// Get processing statistics
const stats = processor.getStatistics();
// Returns: RAGProcessingStats {
//   documentsProcessed: number;
//   chunksCreated: number;
//   averageChunkSize: number;
//   totalCharacters: number;
//   totalTokens: number;
//   averageProcessingTimeMs: number;
//   totalProcessingTimeMs: number;
//   extractionErrors: number;
//   chunking errors: number;
// }

// Reset statistics
processor.resetStatistics();

// ============================================================================
// COMMON PATTERNS
// ============================================================================

/**
 * Pattern 1: Handle result gracefully
 */
const result = await db.getWorkspace('id');
if (result.success) {
  console.log('Workspace:', result.data);
} else {
  console.error('Error:', result.error);
}

/**
 * Pattern 2: Chain operations
 */
const project = await db.createProject({
  workspace_id: 'ws-id',
  name: 'New Project',
  status: 'research',
});

if (project.success && project.data) {
  const documents = await db.listDocuments(project.data.id);
}

/**
 * Pattern 3: Batch process with progress
 */
const documents = await db.listDocuments('project-id');
const processor = createDocumentProcessor(db);

for (const doc of documents.data || []) {
  const buffer = await loadFile(doc.file_path);
  await processor.processDocument(
    doc.id,
    doc.project_id,
    doc.workspace_id,
    doc.original_name,
    buffer,
  );
}

/**
 * Pattern 4: Search and retrieve
 */
const results = await vectorStore.search(wsId, projId, queryEmbedding, 5);

for (const result of results) {
  const chunk = await db.getChunk(result.chunkId);
  const doc = await db.getDocument(result.documentId);
}

/**
 * Pattern 5: Error recovery with retry
 */
async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error('Operation failed');
}

export {};
