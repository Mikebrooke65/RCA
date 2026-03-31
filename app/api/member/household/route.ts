import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Get current member's household
    const { data: currentMember } = await supabaseAdmin
      .from('members')
      .select('household_id, households(normalized_address)')
      .eq('auth_user_id', user.id)
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
