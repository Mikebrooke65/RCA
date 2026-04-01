import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import { logAudit } from '@/lib/audit';

export async function PATCH(request: NextRequest) {
  try {
    const { memberId, facebookJoined } = await request.json();

    // Get member info for audit
    const { data: member } = await supabaseAdmin
      .from('members')
      .select('first_name, last_name, facebook_joined')
      .eq('id', memberId)
      .single();

    const { error } = await supabaseAdmin
      .from('members')
      .update({ facebook_joined: facebookJoined })
      .eq('id', memberId);

    if (error) throw error;

    await logAudit({
      actionType: facebookJoined ? 'facebook_member_added' : 'facebook_member_removed',
      entityType: 'member',
      entityId: memberId,
      beforeValue: { facebook_joined: member?.facebook_joined },
      afterValue: { facebook_joined: facebookJoined, name: `${member?.first_name} ${member?.last_name}` },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Facebook status update error:', error);
    return NextResponse.json({ error: 'Failed to update Facebook status' }, { status: 500 });
  }
}
