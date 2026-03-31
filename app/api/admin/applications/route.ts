import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    // TODO: Add admin auth check

    const { data: applications, error } = await supabaseAdmin
      .from('members')
      .select('id, first_name, last_name, email, membership_type, created_at, household_id, is_primary_household_member')
      .eq('membership_status', 'pending')
      .eq('email_verified', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ applications }, {
      headers: { 'Cache-Control': 'no-store' }
    });
  } catch (error) {
    console.error('Fetch applications error:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}
