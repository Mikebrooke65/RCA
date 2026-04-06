import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
});

export async function POST(request: NextRequest) {
  try {
    const { amount, email, name } = await request.json();
    
    if (!amount || amount < 1) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    // Check if donor is an existing member
    const { data: member } = await supabaseAdmin
      .from('members')
      .select('id')
      .eq('email', email)
      .single();

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
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/donate`,
      customer_email: email,
      metadata: {
        member_id: member?.id || null,
        donor_name: name || '',
        donor_email: email,
        type: 'donation',
      },
    });

    // Create donation record
    await supabaseAdmin
      .from('donations')
      .insert({
        member_id: member?.id || null,
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
