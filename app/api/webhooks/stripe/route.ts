import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase/client';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const memberId = session.metadata?.member_id;

        if (memberId) {
          await supabaseAdmin
            .from('payments')
            .update({
              payment_status: 'paid',
              stripe_checkout_session_id: session.id,
              stripe_payment_intent_id: session.payment_intent as string,
              payment_date: new Date().toISOString(),
            })
            .eq('member_id', memberId)
            .eq('payment_status', 'unpaid');

          // TODO: Send payment confirmation email
          // TODO: Log to audit trail
        }
        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object;
        // Additional handling if needed
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        // TODO: Handle failed payment
        // TODO: Send failure notification
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
