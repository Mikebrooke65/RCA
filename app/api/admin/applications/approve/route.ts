import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import { createCheckoutSession } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    // TODO: Add admin auth check
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

      // Create Stripe checkout session
      const session = await createCheckoutSession(memberId, 10);
      
      // Store session ID in payment record
      await supabaseAdmin
        .from('payments')
        .update({
          stripe_checkout_session_id: session.id,
        })
        .eq('id', payment.id);
      
      paymentLink = session.url;

      // TODO: Send approval email with payment link
      // TODO: Log to audit trail
    } else {
      // Additional household member - exempt from payment
      await supabaseAdmin
        .from('payments')
        .insert({
          member_id: memberId,
          amount: 0,
          payment_method: 'other',
          payment_status: 'exempt',
        });
    }

    // TODO: Send approval email
    // TODO: Send Facebook invite link

    return NextResponse.json({ 
      success: true,
      paymentLink: paymentLink,
      requiresPayment: member.is_primary_household_member,
    });
  } catch (error) {
    console.error('Approve error:', error);
    return NextResponse.json({ error: 'Failed to approve application' }, { status: 500 });
  }
}
