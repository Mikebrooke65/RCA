import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  try {
    // TODO: Add admin auth check
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    let query = supabaseAdmin
      .from('members')
      .select('*, households(normalized_address)')
      .order('created_at', { ascending: false });

    if (status && status !== 'all') {
      query = query.eq('membership_status', status);
    }

    const { data: members, error } = await query;

    if (error) throw error;

    return NextResponse.json({ members });
  } catch (error) {
    console.error('Fetch members error:', error);
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}
