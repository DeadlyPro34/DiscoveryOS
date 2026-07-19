import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { messages } = await req.json();
    
    // For simplicity, we can just clear existing and re-insert, or insert new ones.
    // The easiest way is to delete all messages for this conversation and insert the new array.
    await prisma.message.deleteMany({
      where: { conversationId: params.id }
    });

    const newMessages = await prisma.message.createMany({
      data: messages.map((m: any) => ({
        conversationId: params.id,
        role: m.role,
        content: m.content,
        timestamp: new Date(m.timestamp)
      }))
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: params.id },
      data: { updatedAt: new Date() }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
