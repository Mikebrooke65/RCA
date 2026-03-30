import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  try {
    // TODO: Add admin auth check
    const searchParams = request.nextUrl.searchParams;
    const entityType = searchParams.get('entity_type');

    let query = supabaseAdmin
      .from('audit_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (entityType && entityType !== 'all') {
      query = query.eq('entity_type', entityType);
    }

    const { data: logs, error } = await query;

    if (error) throw error;

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Fetch audit log error:', error);
    return NextResponse.json({ error: 'Failed to fetch audit log' }, { status: 500 });
  }
}
