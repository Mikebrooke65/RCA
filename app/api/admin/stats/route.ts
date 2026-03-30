import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function GET() {
  try {
    // TODO: Add admin auth check

    const [members, pending, friends, unpaid] = await Promise.all([
      supabaseAdmin.from('members').select('id', { count: 'exact' }).eq('membership_type', 'full_member').eq('membership_status', 'active'),
      supabaseAdmin.from('members').select('id', { count: 'exact' }).eq('membership_status', 'pending'),
      supabaseAdmin.from('members').select('id', { count: 'exact' }).eq('membership_type', 'friend').eq('membership_status', 'active'),
      supabaseAdmin.from('renewals').select('id', { count: 'exact' }).eq('payment_status', 'unpaid'),
    ]);

    return NextResponse.json({
      totalMembers: members.count || 0,
      pendingApplications: pending.count || 0,
      activeFriends: friends.count || 0,
      unpaidRenewals: unpaid.count || 0,
    });
  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
