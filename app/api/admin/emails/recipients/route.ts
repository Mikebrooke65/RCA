import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function GET() {
  try {
    // Count full members (approved, not friends)
    const { count: membersCount } = await supabaseAdmin
      .from('members')
      .select('*', { count: 'exact', head: true })
      .eq('membership_status', 'approved')
      .eq('is_friend', false);

    // Count friends
    const { count: friendsCount } = await supabaseAdmin
      .from('members')
      .select('*', { count: 'exact', head: true })
      .eq('membership_status', 'approved')
      .eq('is_friend', true);

    const members = membersCount || 0;
    const friends = friendsCount || 0;

    return NextResponse.json({
      all: members + friends,
      members,
      friends,
    });
  } catch (error) {
    console.error('Failed to fetch recipient counts:', error);
    return NextResponse.json({ error: 'Failed to fetch counts' }, { status: 500 });
  }
}
