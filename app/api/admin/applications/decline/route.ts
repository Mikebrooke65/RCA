import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function POST(request: NextRequest) {
  try {
    // TODO: Add admin auth check
    const { memberId, reason } = await request.json();

    await supabaseAdmin
      .from('members')
      .update({
        membership_status: 'removed',
        date_removed: new Date().toISOString(),
        notes: reason ? `Declined: ${reason}` : 'Application declined',
      })
      .eq('id', memberId);

    // TODO: Send decline email
    // TODO: Log to audit trail

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Decline error:', error);
    return NextResponse.json({ error: 'Failed to decline application' }, { status: 500 });
  }
}
