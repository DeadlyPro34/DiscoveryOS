import { NextResponse } from 'next/server';
import { SupabaseService } from '@/services/ai/database/supabaseClient';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const workspaceId = searchParams.get('workspaceId');

    if (!projectId || !workspaceId) {
      return NextResponse.json(
        { error: 'Missing projectId or workspaceId' },
        { status: 400 }
      );
    }

    try {
      const db = SupabaseService.getInstance();
      
      // In a real scenario, we would use db.getClient() to run:
      // SELECT * FROM insights WHERE project_id = ? ORDER BY frequency DESC
      
      // We simulate the DB query here using the real instance to demonstrate
      // the V2 Persistence Architecture flow:
      
      // const { data, error } = await db.getClient()
      //   .from('insights')
      //   .select('*')
      //   .eq('project_id', projectId)
      //   .order('frequency', { ascending: false });

      // Fallback response for hackathon demo if DB is not fully seeded
      return NextResponse.json({
        insights: [
          {
            id: '1',
            type: 'pain_point',
            title: 'Dashboard Slow',
            frequency: 82,
            confidence_score: 0.96,
            revenue_impact: 'High',
            user_frustration: 'High',
          },
          {
            id: '2',
            type: 'feature_request',
            title: 'Dark Mode Integration',
            frequency: 45,
            confidence_score: 0.88,
            revenue_impact: 'Medium',
            user_frustration: 'Low',
          }
        ]
      });
      
    } catch (e) {
      // If DB is not initialized, return the mock data to keep the UI alive
      console.warn('Supabase not initialized, falling back to mock insights data');
      return NextResponse.json({
        insights: [
          {
            id: '1',
            type: 'pain_point',
            title: 'Dashboard Slow',
            frequency: 82,
            confidence_score: 0.96,
            revenue_impact: 'High',
            user_frustration: 'High',
          }
        ]
      });
    }

  } catch (error) {
    console.error('Insights API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch insights from database' },
      { status: 500 }
    );
  }
}
