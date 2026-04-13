import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function GET() {
  try {
    // Count full members (active, full_member type)
    const { count: membersCount } = await supabaseAdmin
      .from('members')
      .select('*', { count: 'exact', head: true })
      .eq('membership_status', 'active')
      .eq('membership_type', 'full_member');

    // Count friends
    const { count: friendsCount } = await supabaseAdmin
      .from('members')
      .select('*', { count: 'exact', head: true })
      .eq('membership_status', 'active')
      .eq('membership_type', 'friend');

    const members = membersCount || 0;
    const friends = friendsCount || 0;

    return NextResponse.json({
      all: members + friends,
      members,
      friends,
    }, {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' },
    });
  } catch (error) {
    console.error('Failed to fetch recipient counts:', error);
    return NextResponse.json({ error: 'Failed to fetch counts' }, { status: 500 });
  }
}
