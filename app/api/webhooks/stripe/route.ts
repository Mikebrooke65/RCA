import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase/client';
import { templates, sendEmail } from '@/lib/email/templates';

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
        const paymentType = session.metadata?.type;

        if (paymentType === 'donation') {
          // Handle donation payment
          const donorName = session.metadata?.donor_name || 'Supporter';
          const donorEmail = session.metadata?.donor_email || session.customer_email;
          const amount = (session.amount_total || 0) / 100;
          
          // Generate receipt number
          const receiptNumber = `DON-${Date.now()}`;
          const paymentDate = new Date();
          
          // Update donation record
          await supabaseAdmin
            .from('donations')
            .update({
              payment_status: 'completed',
              stripe_payment_intent_id: session.payment_intent as string,
              payment_date: paymentDate.toISOString(),
              receipt_number: receiptNumber,
            })
            .eq('stripe_session_id', session.id);
          
          // Send donation receipt email
          if (donorEmail) {
            const formattedDate = paymentDate.toLocaleDateString('en-NZ', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });
            
            await sendEmail(
              donorEmail,
              templates.donationReceived(donorName, amount, receiptNumber, formattedDate),
              memberId || undefined
            );
          }
        } else if (memberId) {
          // Handle membership payment
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
