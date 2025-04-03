import Stripe from 'stripe';
import { handleSubscriptionChange, stripe } from '@/lib/payments/stripe';
import { NextRequest, NextResponse } from 'next/server';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    console.log(`✅ Webhook event received: ${event.type}`);
  } catch (err) {
    console.error('❌ Webhook signature verification failed.', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed.' },
      { status: 400 }
    );
  }

  // Manejar más tipos de eventos relacionados con suscripciones
  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
      case 'customer.subscription.trial_will_end':
      case 'customer.subscription.paused':
      case 'customer.subscription.resumed':
        console.log(`🔄 Processing subscription event: ${event.type}`);
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription, event.type);
        break;
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        // Solo procesar si está relacionado con suscripciones
        if (session.mode === 'subscription' && session.subscription) {
          console.log(`🔄 Processing checkout session for subscription: ${session.subscription}`);
          // Obtener la suscripción completa y procesarla
          const subscriptionData = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          await handleSubscriptionChange(subscriptionData, 'checkout.session.completed');
        }
        break;
      default:
        console.log(`ℹ️ Unhandled event type ${event.type}`);
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error(`❌ Error processing webhook: ${error}`);
    return NextResponse.json(
      { error: 'Error processing webhook' },
      { status: 500 }
    );
  }
}
