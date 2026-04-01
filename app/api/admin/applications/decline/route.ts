import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import { logAudit } from '@/lib/audit';

export async function POST(request: NextRequest) {
  try {
    // TODO: Add admin auth check
    const { memberId, reason } = await request.json();

    // Get member info before update for audit
    const { data: member } = await supabaseAdmin
      .from('members')
      .select('first_name, last_name, email, membership_status')
      .eq('id', memberId)
      .single();

    await supabaseAdmin
      .from('members')
      .update({
        membership_status: 'removed',
        date_removed: new Date().toISOString(),
        notes: reason ? `Declined: ${reason}` : 'Application declined',
      })
      .eq('id', memberId);

    // Log to audit trail
    await logAudit({
      actionType: 'member_declined',
      entityType: 'member',
      entityId: memberId,
      beforeValue: { membership_status: member?.membership_status },
      afterValue: { membership_status: 'removed', email: member?.email, name: `${member?.first_name} ${member?.last_name}` },
      reason: reason || 'No reason provided',
    });

    // TODO: Send decline email

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Decline error:', error);
    return NextResponse.json({ error: 'Failed to decline application' }, { status: 500 });
  }
}
