# 📋 DiscoveryOS Mock Data Inventory

## Overview
The codebase contains **extensive mock data** across 6 main files in `src/lib/mock-data/` directory. This data is used for development, testing, and UI/UX demonstration purposes.

---

## Mock Data Files

### 1. **src/lib/mock-data/workspaces.ts**
**Purpose**: Mock workspace entries  
**Content**:
- 5 sample workspaces
- Workspace IDs: ws-001 to ws-005
- Sample member lists
- Sample project counts

**Sample Workspaces**:
```
1. Slack Feedback (ws-001)
2. Customer Interviews (ws-002)
3. Mobile Beta (ws-003)
4. Q2 User Research (ws-004)
5. Enterprise Clients (ws-005)
```

---

### 2. **src/lib/mock-data/projects.ts**
**Purpose**: Mock project data  
**Content**:
- Multiple projects per workspace
- Project metadata (name, description, status)
- Upload counts and insights counts
- Last updated dates
- Project statuses: Completed, Processing, Research

**Sample Projects**:
```
- Feature Requests Analysis (ws-001)
- Bug Reports Sentiment (ws-001)
- Product Feedback May (ws-001)
- User Satisfaction Survey (ws-001)
- Competitor Analysis (ws-001)
- And more...
```

---

### 3. **src/lib/mock-data/documents.ts**
**Purpose**: Mock document uploads  
**Content**:
- Document metadata (name, size, type)
- File types: PDF, CSV, XLSX
- Document status: Completed
- Upload progress: 100%
- Project associations
- Sample extracted text
- Preview text

**Sample Documents**:
```
- customer_interviews_may_2024.pdf (4.85 MB)
- slack_feedback_march.csv (2.1 MB)
- feature_request_form_responses.xlsx (1.85 MB)
- support_tickets_april_2024.csv (3.2 MB)
- And more...
```

---

### 4. **src/lib/mock-data/aiWorkspaceData.ts**
**Purpose**: AI workspace mock responses and conversations  
**Content**:
- Mock projects for AI workspace
- Mock evidence quotes
- Mock AI responses
- Mock conversations
- Mock suggested prompts
- Mock agent status data

**Key Data**:
```
- 3 sample projects
- Multiple evidence quotes with sources
- Mock AI responses with citations
- Mock conversations history
- Suggested follow-up questions
```

---

### 5. **src/lib/mock-data/evidenceGraphMockData.ts**
**Purpose**: Evidence graph visualization data  
**Content**:
- Graph nodes (personas, themes, insights)
- Graph edges (relationships)
- Evidence connections
- Graph layout data

---

### 6. **src/lib/mock-data/executiveData.ts**
**Purpose**: Executive dashboard mock data  
**Content**:
- Key metrics
- Timeline insights
- Opportunity cards
- Executive summaries

---

## Where Mock Data is Used

### Components Using Mock Data:
1. **ProjectsSidebar** - Shows mock projects
2. **ConversationArea** - Displays mock conversations
3. **EvidencePanel** - Shows mock evidence quotes
4. **ExecutiveDashboard** - Shows mock KPIs and insights
5. **GraphVisualization** - Shows mock graph data
6. **DocumentList** - Shows mock uploaded documents

### Hooks Using Mock Data:
1. **useProjects()** - Returns mock projects
2. **useWorkspace()** - Returns mock workspaces
3. **useUploads()** - Returns mock documents
4. **useAIWorkspace()** - Returns mock AI responses

### Stores Using Mock Data:
1. **useProjectStore** - Initialized with MOCK_PROJECTS
2. **useWorkspaceStore** - Initialized with MOCK_WORKSPACES
3. **useUploadStore** - Initialized with MOCK_DOCUMENTS

---

## Statistics

| Category | Count | Files |
|----------|-------|-------|
| **Mock Workspaces** | 5 | 1 |
| **Mock Projects** | 20+ | 1 |
| **Mock Documents** | 30+ | 1 |
| **Mock Evidence Quotes** | 15+ | 1 |
| **Mock AI Responses** | 8+ | 1 |
| **Mock Conversations** | 5+ | 1 |
| **Graph Nodes** | 50+ | 1 |
| **Total Mock Data** | 150+ items | 6 files |

---

## Phase 2 Tasks: Replace Mock Data

### To Integrate Real Data:

#### 1. **Replace Workspace Data**
- [ ] Connect to Supabase workspaces table
- [ ] Fetch real workspace data from database
- [ ] Replace `MOCK_WORKSPACES` with database queries

#### 2. **Replace Project Data**
- [ ] Connect to Supabase projects table
- [ ] Fetch real project data from database
- [ ] Update `useProjects()` hook to use real data

#### 3. **Replace Document Data**
- [ ] Connect to Supabase documents/uploads table
- [ ] Fetch real document metadata
- [ ] Show real extracted text

#### 4. **Replace AI Responses**
- [ ] Connect agents to Groq LLM
- [ ] Replace mock responses with real Groq calls
- [ ] Implement streaming responses

#### 5. **Replace Evidence Data**
- [ ] Connect to Supabase embeddings table
- [ ] Fetch real evidence from vector database
- [ ] Implement semantic search

#### 6. **Replace Graph Data**
- [ ] Generate graph nodes from real analysis
- [ ] Build relationships from real data
- [ ] Implement dynamic graph visualization

---

## Current Flow (With Mock Data)

```
User uploads document
    ↓
Mock upload pipeline processes it
    ↓
Mock agents analyze content
    ↓
Mock data returned to UI
    ↓
UI displays mock results
```

---

## Target Flow (After Real AI Integration)

```
User uploads document
    ↓
Real document processor extracts text
    ↓
Real text chunker splits content
    ↓
Real embeddings generated (Transformers.js)
    ↓
Embeddings stored in Supabase pgvector
    ↓
User queries trigger semantic search
    ↓
Retrieved context + user query → Groq API
    ↓
Real Groq response streamed to UI
    ↓
Citations and evidence retrieved
    ↓
UI displays real results with sources
```

---

## Files to Update for Real Data Integration

### Database Layer:
- [ ] Create Supabase tables schema
- [ ] Create database connection service
- [ ] Implement CRUD operations

### API Routes (if needed):
- [ ] Create API endpoints for data retrieval
- [ ] Implement rate limiting
- [ ] Add authentication

### Services:
- [ ] Replace mock agent implementations with Groq calls
- [ ] Implement RAG pipeline
- [ ] Add embedding generation

### Hooks:
- [ ] Update `useProjects()` to fetch from database
- [ ] Update `useWorkspace()` to fetch from database
- [ ] Update `useUploads()` to fetch from database
- [ ] Update `useAIWorkspace()` to call real agents

### Stores:
- [ ] Migrate from Zustand mock initialization
- [ ] Keep Zustand for client-side caching
- [ ] Add cache invalidation

---

## Data Structure Examples

### Current Mock Workspace:
```typescript
{
  id: 'ws-001',
  name: 'Slack Feedback',
  logo: '💬',
  members: ['alex@company.com', 'sarah@company.com'],
  createdDate: new Date('2024-01-15'),
  projectsCount: 8,
}
```

### Target Real Workspace (from DB):
```typescript
{
  id: 'uuid-1234',
  name: 'Slack Feedback',
  logo: 'slack_icon_url',
  members: [/* user IDs */],
  createdDate: '2024-01-15T00:00:00Z',
  projectsCount: 8, // Updated from count query
  owner_id: 'user-uuid',
  created_at: '2024-01-15T00:00:00Z',
  updated_at: '2024-01-20T14:30:00Z',
}
```

---

## Recommended Migration Order

1. **Phase 1**: Infrastructure (✅ DONE - Current Session)
   - Groq config ✅
   - Error handling ✅
   - Token management ✅
   - Logging ✅

2. **Phase 2**: Database & Basic Retrieval (NEXT)
   - Supabase schema
   - Connection service
   - CRUD operations
   - Basic queries

3. **Phase 3**: RAG Pipeline (NEXT)
   - Text extraction
   - Document chunking
   - Embedding generation
   - Vector storage

4. **Phase 4**: Agent Real LLM (NEXT)
   - Replace each agent mock with Groq
   - Implement streaming
   - Add retry logic
   - Error handling

5. **Phase 5**: AI Chat & Retrieval (NEXT)
   - Real semantic search
   - Context building
   - Streaming responses
   - Citation generation

6. **Phase 6**: Data Migration (FINAL)
   - Replace mock workspaces
   - Replace mock projects
   - Replace mock documents
   - Replace mock conversations

---

## Summary

✅ **Current State**: System fully functional with mock data
- All UI works perfectly
- All workflows complete
- Perfect for demo/testing

🔄 **Next State**: Replace mock data with real data from:
- Supabase database
- Groq LLM API
- Vector embeddings
- Semantic search

📊 **Mock Data Locations**:
- `src/lib/mock-data/` (6 files)
- Zustand stores initialization
- Component data props

🚀 **Ready for Phase 2**: Start database integration and real LLM calls

---

**Mock Data Status**: Complete and Comprehensive ✅  
**Ready for Real AI Integration**: YES  
**Estimated Phase 2 Duration**: 2-3 weeks  
