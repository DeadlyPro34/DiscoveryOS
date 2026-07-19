-- DiscoveryOS Supabase Database Schema
-- Phase 2: Database Integration and RAG Pipeline
-- Created: 2024

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- WORKSPACES AND MEMBERS
-- ============================================================================

-- Workspaces table: Core workspace/organization container
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  logo_url VARCHAR(500),
  owner_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  CONSTRAINT valid_name CHECK (length(name) > 0),
  CONSTRAINT valid_slug CHECK (slug ~ '^[a-z0-9_-]+$')
);

-- Workspace members table: Role-based access control
CREATE TABLE IF NOT EXISTS workspace_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'viewer' CHECK (role IN ('owner', 'admin', 'editor', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  permissions TEXT[] DEFAULT '{}',
  UNIQUE(workspace_id, user_id)
);

-- Indexes for workspace queries
CREATE INDEX idx_workspaces_owner_id ON workspaces(owner_id);
CREATE INDEX idx_workspaces_slug ON workspaces(slug);
CREATE INDEX idx_workspace_members_workspace_id ON workspace_members(workspace_id);
CREATE INDEX idx_workspace_members_user_id ON workspace_members(user_id);

-- ============================================================================
-- PROJECTS
-- ============================================================================

-- Projects table: Project container within a workspace
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'research' CHECK (status IN ('research', 'processing', 'completed', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb,
  tags TEXT[] DEFAULT '{}',
  CONSTRAINT valid_name CHECK (length(name) > 0)
);

-- Indexes for project queries
CREATE INDEX idx_projects_workspace_id ON projects(workspace_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);

-- ============================================================================
-- DOCUMENTS AND CHUNKS
-- ============================================================================

-- Documents table: Uploaded documents with processing tracking
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(500) NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  stage VARCHAR(50) NOT NULL DEFAULT 'uploaded' CHECK (
    stage IN ('uploaded', 'parsing', 'normalizing', 'chunking', 'embedding', 'indexing', 'completed', 'failed')
  ),
  content TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  processing_started_at TIMESTAMP WITH TIME ZONE,
  processing_completed_at TIMESTAMP WITH TIME ZONE,
  processing_duration_ms INTEGER,
  chunk_count INTEGER DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for document queries
CREATE INDEX idx_documents_project_id ON documents(project_id);
CREATE INDEX idx_documents_workspace_id ON documents(workspace_id);
CREATE INDEX idx_documents_stage ON documents(stage);
CREATE INDEX idx_documents_created_at ON documents(created_at DESC);

-- Chunks table: Text chunks from documents for RAG
CREATE TABLE IF NOT EXISTS chunks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  total_chunks INTEGER NOT NULL,
  start_position INTEGER NOT NULL,
  end_position INTEGER NOT NULL,
  character_count INTEGER NOT NULL,
  word_count INTEGER NOT NULL,
  token_count INTEGER NOT NULL,
  source_filename VARCHAR(255) NOT NULL,
  source_title VARCHAR(255),
  chunking_strategy VARCHAR(50) NOT NULL DEFAULT 'fixed-size' CHECK (
    chunking_strategy IN ('fixed-size', 'semantic', 'paragraph', 'sentence', 'hierarchical')
  ),
  confidence_score NUMERIC(3,2) NOT NULL DEFAULT 1.0,
  context_type VARCHAR(50) NOT NULL DEFAULT 'unknown' CHECK (
    context_type IN ('sentence', 'paragraph', 'custom', 'unknown')
  ),
  is_first_chunk BOOLEAN DEFAULT false,
  is_last_chunk BOOLEAN DEFAULT false,
  previous_chunk_id UUID REFERENCES chunks(id),
  next_chunk_id UUID REFERENCES chunks(id),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT valid_positions CHECK (start_position < end_position),
  CONSTRAINT valid_counts CHECK (character_count > 0 AND word_count >= 0 AND token_count >= 0)
);

-- Indexes for chunk queries
CREATE INDEX idx_chunks_document_id ON chunks(document_id);
CREATE INDEX idx_chunks_project_id ON chunks(project_id);
CREATE INDEX idx_chunks_workspace_id ON chunks(workspace_id);
CREATE INDEX idx_chunks_chunk_index ON chunks(chunk_index);
CREATE INDEX idx_chunks_created_at ON chunks(created_at DESC);
CREATE INDEX idx_chunks_previous_id ON chunks(previous_chunk_id);
CREATE INDEX idx_chunks_next_id ON chunks(next_chunk_id);

-- ============================================================================
-- EMBEDDINGS AND VECTOR SEARCH
-- ============================================================================

-- Embeddings table: Vector embeddings for semantic search
CREATE TABLE IF NOT EXISTS embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chunk_id UUID NOT NULL REFERENCES chunks(id) ON DELETE CASCADE,
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  embedding vector(384),
  embedding_model VARCHAR(100) NOT NULL DEFAULT 'all-MiniLM-L6-v2',
  embedding_dimension INTEGER NOT NULL DEFAULT 384,
  cosine_similarity_search_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb,
  UNIQUE(chunk_id)
);

-- Indexes for embedding queries
CREATE INDEX idx_embeddings_chunk_id ON embeddings(chunk_id);
CREATE INDEX idx_embeddings_document_id ON embeddings(document_id);
CREATE INDEX idx_embeddings_project_id ON embeddings(project_id);
CREATE INDEX idx_embeddings_workspace_id ON embeddings(workspace_id);
-- Vector similarity index for semantic search
CREATE INDEX idx_embeddings_vector ON embeddings USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- ============================================================================
-- CONVERSATIONS AND MESSAGES
-- ============================================================================

-- Conversations table: Chat sessions with AI
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  message_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  is_archived BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table: Individual messages in conversations
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  reasoning TEXT,
  citations JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for conversation queries
CREATE INDEX idx_conversations_project_id ON conversations(project_id);
CREATE INDEX idx_conversations_workspace_id ON conversations(workspace_id);
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_project_id ON messages(project_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- ============================================================================
-- PROCESSING LOGS AND METRICS
-- ============================================================================

-- Processing logs table: Audit trail for debugging
CREATE TABLE IF NOT EXISTS processing_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  stage VARCHAR(50) NOT NULL CHECK (
    stage IN ('uploaded', 'parsing', 'normalizing', 'chunking', 'embedding', 'indexing', 'completed', 'failed')
  ),
  level VARCHAR(50) NOT NULL DEFAULT 'info' CHECK (level IN ('debug', 'info', 'warning', 'error')),
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for logging queries
CREATE INDEX idx_processing_logs_document_id ON processing_logs(document_id);
CREATE INDEX idx_processing_logs_workspace_id ON processing_logs(workspace_id);
CREATE INDEX idx_processing_logs_stage ON processing_logs(stage);
CREATE INDEX idx_processing_logs_level ON processing_logs(level);
CREATE INDEX idx_processing_logs_created_at ON processing_logs(created_at DESC);

-- RAG metrics table: Aggregated statistics
CREATE TABLE IF NOT EXISTS rag_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  documents_processed INTEGER DEFAULT 0,
  chunks_created INTEGER DEFAULT 0,
  average_chunk_size NUMERIC(10,2) DEFAULT 0,
  total_characters BIGINT DEFAULT 0,
  total_tokens BIGINT DEFAULT 0,
  average_processing_time_ms NUMERIC(10,2) DEFAULT 0,
  total_processing_time_ms BIGINT DEFAULT 0,
  extraction_errors INTEGER DEFAULT 0,
  chunking_errors INTEGER DEFAULT 0,
  embeddings_created INTEGER DEFAULT 0,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for metrics queries
CREATE INDEX idx_rag_metrics_workspace_id ON rag_metrics(workspace_id);
CREATE INDEX idx_rag_metrics_project_id ON rag_metrics(project_id);
CREATE INDEX idx_rag_metrics_period ON rag_metrics(period_start, period_end);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update workspace updated_at timestamp
CREATE OR REPLACE FUNCTION update_workspace_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update project updated_at timestamp
CREATE OR REPLACE FUNCTION update_project_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update document updated_at timestamp
CREATE OR REPLACE FUNCTION update_document_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for workspace updated_at
CREATE TRIGGER workspace_updated_at_trigger
BEFORE UPDATE ON workspaces
FOR EACH ROW
EXECUTE FUNCTION update_workspace_updated_at();

-- Trigger for project updated_at
CREATE TRIGGER project_updated_at_trigger
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_project_updated_at();

-- Trigger for document updated_at
CREATE TRIGGER document_updated_at_trigger
BEFORE UPDATE ON documents
FOR EACH ROW
EXECUTE FUNCTION update_document_updated_at();

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View: Document processing statistics
CREATE OR REPLACE VIEW document_stats AS
SELECT
  d.id,
  d.workspace_id,
  d.project_id,
  d.filename,
  d.stage,
  COUNT(DISTINCT c.id) as chunk_count,
  SUM(c.character_count) as total_characters,
  SUM(c.token_count) as total_tokens,
  COUNT(DISTINCT e.id) as embedding_count,
  d.created_at,
  d.processing_completed_at
FROM documents d
LEFT JOIN chunks c ON d.id = c.document_id
LEFT JOIN embeddings e ON c.id = e.chunk_id
GROUP BY d.id, d.workspace_id, d.project_id, d.filename, d.stage, d.created_at, d.processing_completed_at;

-- View: RAG pipeline health
CREATE OR REPLACE VIEW rag_health AS
SELECT
  p.workspace_id,
  p.id as project_id,
  COUNT(DISTINCT d.id) as total_documents,
  COUNT(DISTINCT CASE WHEN d.stage = 'completed' THEN d.id END) as completed_documents,
  COUNT(DISTINCT CASE WHEN d.stage = 'failed' THEN d.id END) as failed_documents,
  COUNT(DISTINCT c.id) as total_chunks,
  COUNT(DISTINCT e.id) as total_embeddings,
  ROUND(COUNT(DISTINCT CASE WHEN d.stage = 'completed' THEN d.id END)::numeric / 
    NULLIF(COUNT(DISTINCT d.id), 0) * 100, 2) as completion_rate
FROM projects p
LEFT JOIN documents d ON p.id = d.project_id
LEFT JOIN chunks c ON d.id = c.document_id
LEFT JOIN embeddings e ON c.id = e.chunk_id
GROUP BY p.workspace_id, p.id;

-- ============================================================================
-- DATA RETENTION POLICIES
-- ============================================================================

-- Soft delete for sensitive data (documents can be hard-deleted after 90 days)
CREATE OR REPLACE VIEW active_documents AS
SELECT * FROM documents WHERE deleted_at IS NULL;

CREATE OR REPLACE VIEW active_projects AS
SELECT * FROM projects WHERE deleted_at IS NULL;

CREATE OR REPLACE VIEW active_workspaces AS
SELECT * FROM workspaces WHERE deleted_at IS NULL;

-- ============================================================================
-- PERSISTENCE ARCHITECTURE (V2)
-- ============================================================================

-- Themes table
CREATE TABLE IF NOT EXISTS themes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  frequency INTEGER DEFAULT 1,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Personas table
CREATE TABLE IF NOT EXISTS personas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  role VARCHAR(255) NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insights table (Pain points, feature requests, bugs)
CREATE TABLE IF NOT EXISTS insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('pain_point', 'feature_request', 'bug', 'compliment', 'question')),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  frequency INTEGER DEFAULT 1,
  confidence_score NUMERIC(3,2) DEFAULT 1.0,
  revenue_impact VARCHAR(50) CHECK (revenue_impact IN ('High', 'Medium', 'Low', 'Unknown')),
  user_frustration VARCHAR(50) CHECK (user_frustration IN ('High', 'Medium', 'Low', 'Unknown')),
  theme_id UUID REFERENCES themes(id) ON DELETE SET NULL,
  persona_id UUID REFERENCES personas(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sentiments table
CREATE TABLE IF NOT EXISTS sentiments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  insight_id UUID REFERENCES insights(id) ON DELETE CASCADE,
  sentiment VARCHAR(50) NOT NULL CHECK (sentiment IN ('Positive', 'Neutral', 'Negative', 'Mixed')),
  score NUMERIC(3,2),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Evidence table (Join table linking insights to original source chunks)
CREATE TABLE IF NOT EXISTS evidence (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  insight_id UUID NOT NULL REFERENCES insights(id) ON DELETE CASCADE,
  chunk_id UUID NOT NULL REFERENCES chunks(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  exact_quote TEXT,
  relevance_score NUMERIC(3,2) DEFAULT 1.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Artifacts table (PRDs, Roadmaps, Reports)
CREATE TABLE IF NOT EXISTS artifacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('prd', 'roadmap', 'report', 'executive_summary')),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'archived')),
  created_by UUID, -- Can be null if AI generated
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for V2
CREATE INDEX idx_themes_project_id ON themes(project_id);
CREATE INDEX idx_personas_project_id ON personas(project_id);
CREATE INDEX idx_insights_project_id ON insights(project_id);
CREATE INDEX idx_insights_type ON insights(type);
CREATE INDEX idx_evidence_insight_id ON evidence(insight_id);
CREATE INDEX idx_evidence_chunk_id ON evidence(chunk_id);
CREATE INDEX idx_artifacts_project_id ON artifacts(project_id);

