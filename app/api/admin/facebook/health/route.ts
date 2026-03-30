import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function GET() {
  try {
    // TODO: Add admin auth check

    const [invited, joined, left, friends, shouldRemove] = await Promise.all([
      supabaseAdmin.from('members').select('id', { count: 'exact' }).eq('facebook_invite_sent', true),
      supabaseAdmin.from('members').select('id', { count: 'exact' }).eq('facebook_joined', true),
      supabaseAdmin.from('members').select('id', { count: 'exact' }).eq('facebook_invite_sent', true).eq('facebook_joined', false),
      supabaseAdmin.from('members').select('id', { count: 'exact' }).eq('membership_type', 'friend').eq('facebook_joined', true),
      supabaseAdmin.from('members').select('id', { count: 'exact' }).eq('facebook_joined', true).in('membership_status', ['lapsed', 'resigned', 'removed']),
    ]);

    return NextResponse.json({
      membersInvited: invited.count || 0,
      membersJoined: joined.count || 0,
      membersLeft: left.count || 0,
      friendsJoined: friends.count || 0,
      shouldBeRemoved: shouldRemove.count || 0,
    });
  } catch (error) {
    console.error('Facebook health error:', error);
    return NextResponse.json({ error: 'Failed to fetch health data' }, { status: 500 });
  }
}
