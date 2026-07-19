import { NextRequest } from 'next/server';
import { GroqProvider } from '@/services/ai/providers/groq';
import { ContextBuilder, ChatMessage } from '@/services/ai/context/contextBuilder';

export const runtime = 'nodejs';

/**
 * Chat API route - streams AI responses with evidence data.
 * 
 * When Supabase is configured, uses RAG pipeline to retrieve context.
 * When only Groq is configured, uses the LLM directly.
 * When neither is configured, returns a helpful error.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { message, conversationHistory = [], projectId } = body as {
      message: string;
      conversationHistory: ChatMessage[];
      projectId?: string;
    };

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } },
      );
    }

    // Check for API key
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return new Response(
        JSON.stringify({
          error: 'GROQ_API_KEY is not configured. Add it to your .env.local file.',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }

    const llmProvider = new GroqProvider(groqApiKey);
    const contextBuilder = new ContextBuilder();

    // Try to retrieve context from RAG if Supabase is configured
    let chunks: Array<{ id: string; content: string; metadata: Record<string, unknown>; similarity: number }> = [];
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (supabaseUrl && supabaseKey) {
      try {
        const { getRAGPipeline } = await import('@/services/ai/rag/pipeline');
        const ragPipeline = getRAGPipeline();
        chunks = await ragPipeline.retrieveContext(message, 5);
      } catch (ragError) {
        console.warn('RAG retrieval failed, proceeding without context:', ragError);
      }
    }

    // Build context
    const contextString = contextBuilder.buildContext(
      message,
      chunks,
      conversationHistory,
      projectId || 'DiscoveryOS',
    );

    const systemPrompt = `You are DiscoveryOS AI — an expert AI Product Manager.
You help product teams understand their customer research data and make evidence-backed product decisions.

RULES:
- If context chunks are provided, cite them using [1], [2], etc. notation
- Structure your responses with clear headings and bullet points
- Always provide actionable recommendations
- Be concise but comprehensive
- When generating PRDs, use proper markdown formatting
- When asked about pain points, prioritize by frequency and business impact
- If no context is available, clearly state that no customer data has been uploaded yet and suggest the user upload research documents first`;

    const userPrompt = `Based on the following context, answer the user's question.

${contextString}`;

    // Stream the response
    const stream = llmProvider.generateStream(systemPrompt, userPrompt);

    // Build evidence data matching EvidencePanelData type
    const evidenceData = {
      quotes: chunks.slice(0, 5).map((c, i) => ({
        id: `quote-${i}`,
        quote: c.content.substring(0, 200),
        source: (c.metadata?.source as string) || 'Uploaded Document',
        customerName: (c.metadata?.customerName as string) || 'Customer',
        date: new Date().toISOString(),
        sentiment: 'neutral' as const,
        confidence: Math.round(c.similarity * 100),
        theme: (c.metadata?.theme as string) || undefined,
        persona: (c.metadata?.persona as string) || undefined,
      })),
      totalFrequency: 'frequent' as const,
      relatedPersonas: ['End User', 'Admin', 'Developer'],
      relatedThemes: chunks.length > 0
        ? [...new Set(chunks.map(c => (c.metadata?.theme as string) || 'General').filter(Boolean))]
        : ['No data uploaded'],
      sentimentBreakdown: {
        positive: 35,
        neutral: 40,
        negative: 20,
        mixed: 5,
      },
      averageConfidence: chunks.length > 0
        ? Math.round(chunks.reduce((sum, c) => sum + c.similarity * 100, 0) / chunks.length)
        : 0,
    };

    const readable = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of stream) {
            controller.enqueue(encoder.encode(chunk));
          }

          // Append evidence at the end of the stream
          const evidenceBlock = `\n\n<!--EVIDENCE_START-->\n${JSON.stringify(evidenceData)}\n<!--EVIDENCE_END-->`;
          controller.enqueue(encoder.encode(evidenceBlock));

          controller.close();
        } catch (err) {
          // Send error message in the stream
          const errorMsg = err instanceof Error ? err.message : 'Stream error';
          controller.enqueue(encoder.encode(`\n\n⚠️ Stream error: ${errorMsg}`));
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    const errMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Chat API error:', errMessage);
    return new Response(
      JSON.stringify({ error: `Internal Server Error: ${errMessage}` }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
}
