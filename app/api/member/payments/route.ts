import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function GET() {
  try {
    // TODO: Get authenticated user ID from session
    const userId = 'temp-user-id';

    const { data: payments, error } = await supabaseAdmin
      .from('payments')
      .select('*')
      .eq('member_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ payments: payments || [] });
  } catch (error) {
    console.error('Payments fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}
