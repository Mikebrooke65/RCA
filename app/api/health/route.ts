import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

// Simple health check that pings Supabase to keep it active
export async function GET() {
  try {
    // Quick query to keep Supabase awake
    const { count } = await supabaseAdmin
      .from('members')
      .select('*', { count: 'exact', head: true });

    return NextResponse.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      members: count 
    });
  } catch (error) {
    return NextResponse.json({ status: 'error' }, { status: 500 });
  }
}
