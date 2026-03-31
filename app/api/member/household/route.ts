import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function GET() {
  try {
    // TODO: Get authenticated user ID from session
    const userId = 'temp-user-id';

    // Get current member's household
    const { data: currentMember } = await supabaseAdmin
      .from('members')
      .select('household_id, households(normalized_address)')
      .eq('id', userId)
      .single();

    if (!currentMember?.household_id) {
      return NextResponse.json({ members: [], address: '' });
    }

    // Get all members at this household
    const { data: members } = await supabaseAdmin
      .from('members')
      .select('id, first_name, last_name, email, is_primary_household_member, membership_status')
      .eq('household_id', currentMember.household_id)
      .order('is_primary_household_member', { ascending: false });

    return NextResponse.json({
      members: members || [],
      address: (currentMember.households as any)?.[0]?.normalized_address ?? '',
    });
  } catch (error) {
    console.error('Household fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch household' }, { status: 500 });
  }
}
