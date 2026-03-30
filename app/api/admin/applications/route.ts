import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function GET() {
  try {
    // TODO: Add admin auth check

    const { data: applications, error } = await supabaseAdmin
      .from('members')
      .select('*')
      .eq('membership_status', 'pending')
      .eq('email_verified', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Fetch applications error:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}
