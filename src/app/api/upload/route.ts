import { NextResponse } from 'next/server';
import { MultiAgentOrchestrator } from '@/services/ai/orchestrator/orchestrator';
import { agentRegistry } from '@/services/ai/agents';
import { prisma } from '@/lib/prisma';


export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const projectId = formData.get('projectId') as string;
    const workspaceId = formData.get('workspaceId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!projectId) {
      return NextResponse.json({ error: 'No projectId provided' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let extractedText = '';

    // Handle PDF Parsing
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      const pdf = require('pdf-parse/lib/pdf-parse.js');
      const data = await pdf(buffer);
      extractedText = data.text;
    } else if (file.name.endsWith('.docx') || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const mammoth = require('mammoth');
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    } else {
      // Fallback for simple text files for testing
      extractedText = buffer.toString('utf-8');
    }

    if (!extractedText.trim()) {
      return NextResponse.json({ error: 'Failed to extract text from file' }, { status: 400 });
    }

    // Pass the extracted text to the Orchestrator
    const orchestrator = new MultiAgentOrchestrator();

    const requestId = `req-${Date.now()}`;
    const workflowId = `wf-${Date.now()}`;
    console.log(`Starting AI pipeline for uploaded file ${file.name}`);

    // This will synchronously execute the entire pipeline (including saving to the DB)
    // In a real production app, this would be passed to an async job queue (like Inngest)
    const resultContext = await orchestrator.executePipeline({
      requestId,
      content: extractedText.substring(0, 4000), // Trim for hackathon speed & token limits
      metadata: {
        fileName: file.name,
        projectId,
        workspaceId,
        source: 'upload'
      }
    }, workflowId);

    // Save to Postgres
    const document = await prisma.document.create({
      data: {
        projectId,
        name: file.name,
        type: file.name.split('.').pop() || 'unknown',
        size: file.size,
        status: 'Completed',
        uploadProgress: 100,
      }
    });

    // Calculate how many insights the AI produced (e.g. pain points)
    const insightAgentResult = resultContext.results.find((r: any) => r.agentId === 'insight-agent');
    let newInsightsCount = 0;
    if (insightAgentResult && insightAgentResult.output?.structured) {
       // if it returns an array of pain points, use its length, otherwise 1
       const structured = insightAgentResult.output.structured as any;
       if (Array.isArray(structured)) newInsightsCount = structured.length;
       else if (structured.painPoints && Array.isArray(structured.painPoints)) newInsightsCount = structured.painPoints.length;
       else newInsightsCount = 1;
    } else if (resultContext.results.length > 0) {
       newInsightsCount = 1; // Fallback if some AI ran successfully
    }

    // Increment project upload count and insights count
    await prisma.project.update({
      where: { id: projectId },
      data: { 
        uploadCount: { increment: 1 },
        insightsCount: { increment: newInsightsCount }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'File processed and insights generated',
      context: resultContext,
    });

  } catch (error) {
    console.error('Error processing upload:', error);
    return NextResponse.json(
      { error: 'Failed to process file', details: error instanceof Error ? error.message : String(error), stack: error instanceof Error ? error.stack : undefined },
      { status: 500 }
    );
  }
}
