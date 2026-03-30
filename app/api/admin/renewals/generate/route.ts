import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';

export async function POST() {
  try {
    // TODO: Add admin auth check
    
    // Get or create current membership year
    const yearStart = new Date(new Date().getFullYear(), 3, 1); // April 1
    const yearEnd = new Date(new Date().getFullYear() + 1, 2, 31); // March 31

    let { data: membershipYear } = await supabaseAdmin
      .from('membership_years')
      .select('id')
      .eq('year_start', yearStart.toISOString().split('T')[0])
      .single();

    if (!membershipYear) {
      const { data: newYear } = await supabaseAdmin
        .from('membership_years')
        .insert({
          year_start: yearStart.toISOString().split('T')[0],
          year_end: yearEnd.toISOString().split('T')[0],
          renewal_fee: 10.00,
        })
        .select()
        .single();
      
      membershipYear = newYear;
    }

    // Get all active full members
    const { data: activeMembers } = await supabaseAdmin
      .from('members')
      .select('id, is_primary_household_member')
      .eq('membership_type', 'full_member')
      .eq('membership_status', 'active');

    if (!activeMembers) {
      return NextResponse.json({ count: 0 });
    }

    // Create renewal records
    const renewals = activeMembers.map(member => ({
      member_id: member.id,
      membership_year_id: membershipYear!.id,
      amount_due: member.is_primary_household_member ? 10.00 : 0,
      payment_status: member.is_primary_household_member ? 'unpaid' : 'exempt',
    }));

    const { error } = await supabaseAdmin
      .from('renewals')
      .upsert(renewals, { onConflict: 'member_id,membership_year_id' });

    if (error) throw error;

    // TODO: Generate Stripe checkout links
    // TODO: Prepare renewal emails (don't send yet - admin preview)

    return NextResponse.json({ count: renewals.length });
  } catch (error) {
    console.error('Generate renewals error:', error);
    return NextResponse.json({ error: 'Failed to generate renewals' }, { status: 500 });
  }
}
