import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Find or create user based on name
    let user = await prisma.user.findFirst({
      where: { name }
    });

    if (!user) {
      // Create a dummy email since we are just doing simple name auth
      user = await prisma.user.create({
        data: {
          name,
          email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`
        }
      });
      
      // Auto-create a default workspace for new users
      await prisma.workspace.create({
        data: {
          name: `${name}'s Workspace`,
          userId: user.id
        }
      });
    }

    // Fetch user's workspaces
    const workspaces = await prisma.workspace.findMany({
      where: { userId: user.id }
    });

    return NextResponse.json({ user, workspaces });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
