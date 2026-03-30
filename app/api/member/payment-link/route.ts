import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import { createCheckoutSession } from '@/lib/stripe';

export async function POST(request: NextRequest) {
  try {
    const { memberId } = await request.json();
    
    // TODO: Get memberId from authenticated session instead
    if (!memberId) {
      return NextResponse.json({ error: 'Member ID required' }, { status: 400 });
    }

    // Get member and unpaid payment
    const { data: payment } = await supabaseAdmin
      .from('payments')
      .select('*, members(*)')
      .eq('member_id', memberId)
      .eq('payment_status', 'unpaid')
      .single();

    if (!payment) {
      return NextResponse.json({ error: 'No unpaid payment found' }, { status: 404 });
    }

    // Create or retrieve Stripe checkout session
    let sessionUrl = null;
    
    if (payment.stripe_checkout_session_id) {
      // Try to retrieve existing session
      const stripe = (await import('@/lib/stripe')).stripe;
      try {
        const session = await stripe.checkout.sessions.retrieve(payment.stripe_checkout_session_id);
        if (session.status === 'open') {
          sessionUrl = session.url;
        }
      } catch (error) {
        // Session expired or invalid, create new one
      }
    }
    
    if (!sessionUrl) {
      // Create new checkout session
      const session = await createCheckoutSession(memberId, payment.amount);
      
      // Update payment record with session ID
      await supabaseAdmin
        .from('payments')
        .update({ stripe_checkout_session_id: session.id })
        .eq('id', payment.id);
      
      sessionUrl = session.url;
    }

    return NextResponse.json({ 
      paymentLink: sessionUrl,
      amount: payment.amount,
    });
  } catch (error) {
    console.error('Payment link error:', error);
    return NextResponse.json({ error: 'Failed to create payment link' }, { status: 500 });
  }
}
