import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import { getGroupMembers } from '@/lib/facebook';

export async function POST() {
  try {
    // TODO: Add admin auth check

    // Get Facebook group members
    const fbMembers = await getGroupMembers();
    const fbUserIds = new Set(fbMembers.data?.map((m: any) => m.id) || []);

    // Get all RCA members with Facebook IDs
    const { data: rcaMembers } = await supabaseAdmin
      .from('members')
      .select('id, facebook_user_id, facebook_joined')
      .not('facebook_user_id', 'is', null);

    // Update join status
    for (const member of rcaMembers || []) {
      const isInGroup = fbUserIds.has(member.facebook_user_id);
      
      if (member.facebook_joined !== isInGroup) {
        await supabaseAdmin
          .from('members')
          .update({ facebook_joined: isInGroup })
          .eq('id', member.id);
      }
    }

    // TODO: Log sync to audit trail

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Facebook sync error:', error);
    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}
