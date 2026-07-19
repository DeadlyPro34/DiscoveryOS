import { NextRequest } from 'next/server';
import { multiAgentOrchestrator } from '@/services/ai/orchestrator/orchestrator';
import type { AgentInput } from '@/types/ai/agent';

export const runtime = 'nodejs';

/**
 * Process API route - ingests documents and runs the multi-agent pipeline.
 * 
 * When Supabase is configured, also stores embeddings via RAG pipeline.
 * The agent pipeline runs regardless.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content, documentId, projectId, metadata = {} } = body as {
      content: string;
      documentId: string;
      projectId: string;
      metadata?: Record<string, unknown>;
    };

    if (!content || !documentId || !projectId) {
      return new Response(
        JSON.stringify({ error: 'content, documentId, and projectId are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // Step 1: Ingest into RAG pipeline (if Supabase is configured)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    let ragStatus = 'skipped';

    if (supabaseUrl && supabaseKey) {
      try {
        const { getRAGPipeline } = await import('@/services/ai/rag/pipeline');
        const ragPipeline = getRAGPipeline();
        await ragPipeline.ingestDocument(documentId, content, { ...metadata, projectId });
        ragStatus = 'success';
      } catch (ragError) {
        console.warn('RAG ingestion failed:', ragError);
        ragStatus = 'failed';
      }
    }

    // Step 2: Run the multi-agent pipeline
    const agentInput: AgentInput = {
      requestId: `process-${documentId}-${Date.now()}`,
      content,
      parameters: { documentId, projectId, ...metadata },
    };

    const pipelineResult = await multiAgentOrchestrator.executePipeline(
      agentInput,
      `workflow-${projectId}-${Date.now()}`,
    );

    return new Response(
      JSON.stringify({
        success: true,
        documentId,
        ragStatus,
        pipeline: {
          totalAgents: pipelineResult.results.length,
          successfulAgents: pipelineResult.results.filter(r => r.status === 'success').length,
          executionTimeMs: pipelineResult.totalExecutionTime,
          errors: pipelineResult.errors,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Process API error:', errMessage);
    return new Response(
      JSON.stringify({ error: `Process failed: ${errMessage}` }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
