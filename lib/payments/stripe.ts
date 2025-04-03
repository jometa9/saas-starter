import Stripe from 'stripe';
import { redirect } from 'next/navigation';
import { User } from '@/lib/db/schema';
import {
  getUserByStripeCustomerId,
  getUser,
  updateUserSubscription
} from '@/lib/db/queries';
import { sendSubscriptionChangeEmail } from '@/lib/email';

// Variable para almacenar la instancia de Stripe
let stripeInstance: Stripe | null = null;

// Función para obtener la instancia de Stripe de forma segura
export function getStripe(): Stripe {
  if (stripeInstance) return stripeInstance;
  
  const apiKey = process.env.STRIPE_SECRET_KEY;
  
  if (!apiKey) {
    // Crear una instancia mock para desarrollo que no realice solicitudes reales
    console.warn('⚠️ STRIPE_SECRET_KEY no está configurado. Las funciones de pago no estarán disponibles.');
    
    // Devolvemos un objeto que actúa como Stripe pero que no hace nada real
    // @ts-ignore - Creamos un proxy que simula la API de Stripe
    return new Proxy({}, {
      get: (target, prop) => {
        // Devuelve un objeto para cualquier propiedad solicitada
        if (prop === 'checkout' || prop === 'customers' || prop === 'billingPortal' || 
            prop === 'products' || prop === 'prices' || prop === 'subscriptions') {
          return new Proxy({}, {
            get: () => {
              // Devuelve una función que lanza un error cuando se intenta usar
              return () => {
                throw new Error('Stripe no está configurado. Añade STRIPE_SECRET_KEY a tu archivo .env.local');
              };
            }
          });
        }
        return () => {
          throw new Error('Stripe no está configurado. Añade STRIPE_SECRET_KEY a tu archivo .env.local');
        };
      }
    });
  }
  
  // Creamos la instancia real de Stripe
  stripeInstance = new Stripe(apiKey, {
    apiVersion: '2025-02-24.acacia'
  });
  
  return stripeInstance;
}

// Obtenemos Stripe solo cuando se necesita
export const stripe = getStripe();

export async function createCheckoutSession({
  user,
  priceId
}: {
  user: User | null;
  priceId: string;
}) {
  if (!user) {
    redirect(`/sign-up?redirect=checkout&priceId=${priceId}`);
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    mode: 'subscription',
    success_url: `${process.env.BASE_URL}/api/stripe/checkout?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.BASE_URL}/pricing`,
    customer: user.stripeCustomerId || undefined,
    client_reference_id: user.id.toString(),
    allow_promotion_codes: true,
    subscription_data: {
      trial_period_days: 14
    }
  });

  redirect(session.url!);
}

export async function createCustomerPortalSession(user: User) {
  if (!user.stripeCustomerId || !user.stripeProductId) {
    redirect('/pricing');
  }

  let configuration: Stripe.BillingPortal.Configuration;
  const configurations = await stripe.billingPortal.configurations.list();

  if (configurations.data.length > 0) {
    configuration = configurations.data[0];
  } else {
    const product = await stripe.products.retrieve(user.stripeProductId);
    if (!product.active) {
      throw new Error("User's product is not active in Stripe");
    }

    const prices = await stripe.prices.list({
      product: product.id,
      active: true
    });
    if (prices.data.length === 0) {
      throw new Error("No active prices found for the user's product");
    }

    configuration = await stripe.billingPortal.configurations.create({
      business_profile: {
        headline: 'Manage your subscription'
      },
      features: {
        subscription_update: {
          enabled: true,
          default_allowed_updates: ['price', 'quantity', 'promotion_code'],
          proration_behavior: 'create_prorations',
          products: [
            {
              product: product.id,
              prices: prices.data.map((price) => price.id)
            }
          ]
        },
        subscription_cancel: {
          enabled: true,
          mode: 'at_period_end',
          cancellation_reason: {
            enabled: true,
            options: [
              'too_expensive',
              'missing_features',
              'switched_service',
              'unused',
              'other'
            ]
          }
        }
      }
    });
  }

  return stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.BASE_URL}/dashboard`,
    configuration: configuration.id
  });
}

export async function handleSubscriptionChange(
  subscription: Stripe.Subscription,
  eventType?: string
) {
  console.log(`🔍 Processing subscription change: ${subscription.id}, Event: ${eventType || 'unknown'}, Status: ${subscription.status}`);
  
  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;
  const status = subscription.status;

  console.log(`🔄 Looking up user for Stripe customer: ${customerId}`);
  const user = await getUserByStripeCustomerId(customerId);

  if (!user) {
    console.error(`❌ User not found for Stripe customer: ${customerId}`);
    return;
  }
  
  console.log(`✅ Found user: ${user.id} (${user.email})`);

  let planName = null;
  const plan = subscription.items.data[0]?.plan;
  
  // Obtener el nombre del plan y otros datos para el email
  if (plan && typeof plan.product === 'string') {
    try {
      console.log(`🔄 Retrieving product details for: ${plan.product}`);
      const product = await stripe.products.retrieve(plan.product);
      planName = product.name;
      console.log(`✅ Retrieved product: ${planName}`);
    } catch (error) {
      console.error(`❌ Error retrieving product: ${plan.product}`, error);
    }
  } else if (plan && typeof plan.product === 'object') {
    planName = plan.product.name;
    console.log(`✅ Using product from plan object: ${planName}`);
  }

  // Manejar más estados de suscripción
  if (status === 'active' || status === 'trialing') {
    console.log(`🔄 Updating user subscription to: ${status}, Plan: ${planName}`);
    
    await updateUserSubscription(user.id, {
      stripeSubscriptionId: subscriptionId,
      stripeProductId: typeof plan?.product === 'string' 
        ? plan?.product 
        : plan?.product?.id,
      planName,
      subscriptionStatus: status
    });
    
    // Calcular fecha de expiración de la suscripción
    const expiryDate = subscription.current_period_end 
      ? new Date(subscription.current_period_end * 1000).toISOString().split('T')[0]
      : undefined;
    
    // Enviar email notificando la suscripción activa o trial
    try {
      console.log(`📧 Sending subscription email to: ${user.email}, Status: ${status}, Plan: ${planName}`);
      
      await sendSubscriptionChangeEmail({
        email: user.email,
        name: user.name || user.email.split('@')[0],
        planName: planName || 'Desconocido',
        status,
        expiryDate,
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || process.env.BASE_URL || 'http://localhost:3000'}/dashboard`
      });
      
      console.log(`✅ Email sent successfully`);
    } catch (error) {
      console.error(`❌ Error sending subscription change email:`, error);
    }
  } else if (status === 'canceled' || status === 'unpaid' || status === 'incomplete_expired' || status === 'incomplete') {
    console.log(`🔄 Updating user subscription to: ${status} (removal)`);
    
    await updateUserSubscription(user.id, {
      stripeSubscriptionId: null,
      stripeProductId: null,
      planName: null,
      subscriptionStatus: status
    });
    
    // Enviar email notificando la cancelación o falta de pago
    try {
      console.log(`📧 Sending subscription cancellation email to: ${user.email}, Status: ${status}`);
      
      await sendSubscriptionChangeEmail({
        email: user.email,
        name: user.name || user.email.split('@')[0],
        planName: planName || 'Plan cancelado',
        status,
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || process.env.BASE_URL || 'http://localhost:3000'}/dashboard`
      });
      
      console.log(`✅ Cancellation email sent successfully`);
    } catch (error) {
      console.error(`❌ Error sending subscription cancellation email:`, error);
    }
  } else {
    console.log(`⚠️ Unhandled subscription status: ${status}`);
  }
  
  console.log(`✅ Subscription processing completed for: ${subscriptionId}`);
}

export async function getStripePrices() {
  const prices = await stripe.prices.list({
    expand: ['data.product'],
    active: true,
    type: 'recurring'
  });

  return prices.data.map((price) => ({
    id: price.id,
    productId:
      typeof price.product === 'string' ? price.product : price.product.id,
    unitAmount: price.unit_amount,
    currency: price.currency,
    interval: price.recurring?.interval,
    trialPeriodDays: price.recurring?.trial_period_days
  }));
}

export async function getStripeProducts() {
  const products = await stripe.products.list({
    active: true,
    expand: ['data.default_price']
  });

  return products.data.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    defaultPriceId:
      typeof product.default_price === 'string'
        ? product.default_price
        : product.default_price?.id
  }));
}
