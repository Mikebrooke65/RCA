import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import { createCheckoutSession } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { memberId } = await request.json();

    const { data: member } = await supabaseAdmin
      .from('members')
      .select('*, households(*)')
      .eq('id', memberId)
      .single();

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Update member status
    await supabaseAdmin
      .from('members')
      .update({
        membership_status: 'active',
        date_approved: new Date().toISOString(),
        date_joined: new Date().toISOString(),
      })
      .eq('id', memberId);

    // Create Supabase Auth account and send invite email
    const { data: authUser, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      member.email,
      {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/member`,
        data: { member_id: memberId }
      }
    );

    if (inviteError) {
      console.error('Invite error:', inviteError);
      // Don't fail the approval if invite fails - admin can resend manually
    } else if (authUser?.user) {
      // Link the auth user to the member record
      await supabaseAdmin
        .from('members')
        .update({ auth_user_id: authUser.user.id })
        .eq('id', memberId);
    }

    // Create payment record if primary household member
    let paymentLink = null;
    
    if (member.is_primary_household_member) {
      const { data: payment } = await supabaseAdmin
        .from('payments')
        .insert({
          member_id: memberId,
          amount: 10.00,
          payment_method: 'stripe',
          payment_status: 'unpaid',
        })
        .select()
        .single();

      const session = await createCheckoutSession(memberId, 10);
      
      await supabaseAdmin
        .from('payments')
        .update({ stripe_checkout_session_id: session.id })
        .eq('id', payment.id);
      
      paymentLink = session.url;
    } else {
      await supabaseAdmin
        .from('payments')
        .insert({
          member_id: memberId,
          amount: 0,
          payment_method: 'other',
          payment_status: 'exempt',
        });
    }

    return NextResponse.json({ 
      success: true,
      paymentLink,
      requiresPayment: member.is_primary_household_member,
      inviteSent: !inviteError,
    });
  } catch (error) {
    console.error('Approve error:', error);
    return NextResponse.json({ error: 'Failed to approve application' }, { status: 500 });
  }
}
