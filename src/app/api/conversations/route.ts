import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');
  // If no projectId is given, return all? Normally we want to filter by workspace or project.
  // For AI Workspace, we'll fetch all conversations for now, or just those with matching projectId.
  
  try {
    const conversations = await prisma.conversation.findMany({
      where: projectId ? { projectId } : undefined,
      include: {
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
    return NextResponse.json(conversations);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, projectId } = await req.json();

    const conversation = await prisma.conversation.create({
      data: {
        title: title || 'New Conversation',
        projectId: projectId || null,
      },
      include: {
        messages: true
      }
    });

    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
