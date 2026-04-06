import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  try {
    // Get auth token
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get member
    const { data: member } = await supabaseAdmin
      .from('members')
      .select('id, email, first_name, last_name')
      .eq('auth_user_id', user.id)
      .single();

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    const { amount } = await request.json();
    
    if (!amount || amount < 1) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Create Stripe checkout session for donation
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'nzd',
            product_data: {
              name: 'Donation to Riverhead Community Association',
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/member/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/member/donate`,
      customer_email: member.email,
      metadata: {
        member_id: member.id,
        type: 'donation',
      },
    });

    // Create donation record
    await supabaseAdmin
      .from('donations')
      .insert({
        member_id: member.id,
        amount: amount,
        payment_method: 'stripe',
        payment_status: 'pending',
        stripe_session_id: session.id,
      });

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error('Donation error:', error);
    return NextResponse.json({ error: 'Failed to process donation' }, { status: 500 });
  }
}
