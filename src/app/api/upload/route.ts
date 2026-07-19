import { NextResponse } from 'next/server';
import { MultiAgentOrchestrator } from '@/services/ai/orchestrator/orchestrator';
import { agentRegistry } from '@/services/ai/agents';
// @ts-ignore
const pdf = require('pdf-parse');

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
      let pdfFunc = pdf;
      if (typeof pdfFunc !== 'function') {
        pdfFunc = pdf.default || pdf.pdf || (Object.values(pdf).find(v => typeof v === 'function'));
      }
      
      if (typeof pdfFunc !== 'function') {
         console.error('Could not resolve pdf-parse function. pdf object keys:', Object.keys(pdf || {}));
         throw new Error('PDF parsing library failed to load correctly');
      }

      const data = await pdfFunc(buffer);
      extractedText = data.text;
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

    return NextResponse.json({
      success: true,
      message: 'File processed and insights generated',
      context: resultContext,
    });

  } catch (error) {
    console.error('Error processing upload:', error);
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    );
  }
}
