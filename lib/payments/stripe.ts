import Stripe from 'stripe';
import { redirect } from 'next/navigation';
import { User } from '@/lib/db/schema';
import {
  getUserByStripeCustomerId,
  getUser,
  updateUserSubscription,
  updateUserById
} from '@/lib/db/queries';
import { sendSubscriptionChangeEmail } from '@/lib/email';

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (stripeInstance) return stripeInstance;
  
  const apiKey = process.env.STRIPE_SECRET_KEY;
  
  if (!apiKey || !apiKey.startsWith('sk_')) {
    // @ts-ignore - Creamos un proxy que simula la API de Stripe
    return new Proxy({}, {
      get: (target, prop) => {
        if (prop === 'checkout' || prop === 'customers' || prop === 'billingPortal' || 
            prop === 'products' || prop === 'prices' || prop === 'subscriptions') {
          return new Proxy({}, {
            get: () => {
              return () => {
                throw new Error('Stripe is not configured correctly. Add a valid Stripe key in your .env.local file');
              };
            }
          });
        }
        return () => {
          throw new Error('Stripe is not configured correctly. Add a valid Stripe key in your .env.local file');
        };
      }
    });
  }
  
  stripeInstance = new Stripe(apiKey, {
    apiVersion: '2025-02-24.acacia'
  });
  
  return stripeInstance;
}

export const stripe = getStripe();

export async function createCheckoutSession({
  priceId,
  userId,
  email,
  customerId,
  metadata
}: {
  priceId: string;
  userId: number;
  email: string;
  customerId?: string | null;
  metadata?: Record<string, string>;
}) {
  try {
    console.log('🔧 Getting Stripe instance...');
    const stripe = getStripe();
    console.log('✅ Stripe instance ready');
    let customerIdToUse = customerId;

    if (!customerIdToUse) {
      console.log('🏗️ Creating new Stripe customer for:', email);
      try {
        const customer = await stripe.customers.create({
          email: email,
          metadata: {
            userId: userId.toString()
          }
        });
        
        console.log('✅ Stripe customer created:', customer.id);
        customerIdToUse = customer.id;
        
        console.log('💾 Updating user in DB with stripeCustomerId...');
        await updateUserById(userId.toString(), {
          stripeCustomerId: customer.id
        });
        console.log('✅ User updated successfully');
      } catch (createError) {
        console.error('❌ Failed to create Stripe customer:', createError);
        console.error('❌ Error details:', createError instanceof Error ? createError.message : createError);
        throw new Error('customer-error');
      }
    }

    try {
      await stripe.prices.retrieve(priceId);
    } catch (priceError) {
      
      throw new Error('invalid-price');
    }

    // Build absolute URLs for success and cancel
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.BASE_URL || 'http://localhost:3000';
    const successUrl = `${baseUrl}/api/stripe/checkout?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/dashboard`;
    
    const sessionConfig = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer: customerIdToUse,
      client_reference_id: userId.toString(),
      metadata: {
        userId: userId.toString(),
        ...metadata
      }
    };
    
    const session = await stripe.checkout.sessions.create(sessionConfig);
    
    if (!session.url) {
      
      throw new Error('checkout-creation-failed');
    }
    
    return session;
  } catch (error) {
    
    throw error;
  }
}



export async function createCustomerPortalSession(user: User): Promise<{ url: string } | { error: string }> {
  if (!user.stripeCustomerId) {
    
    return { error: 'no-customer-id' };
  }
  
  if (!user.stripeSubscriptionId || (user.subscriptionStatus !== 'active' && user.subscriptionStatus !== 'trialing')) {
    
    return { error: 'no-active-subscription' };
  }
  
  if (!user.stripeProductId) {
    
    return { error: 'no-product-id' };
  }

  try {
    // Look for existing configuration or create a new one
    let configuration: Stripe.BillingPortal.Configuration;
    const configurations = await stripe.billingPortal.configurations.list();

    if (configurations.data.length > 0) {
      configuration = configurations.data[0];
    } else {
      // Verify that the product exists before creating the configuration
      try {
        const product = await stripe.products.retrieve(user.stripeProductId);
        if (!product.active) {
          
          throw new Error("User's product is not active in Stripe");
        }

        // Obtener precios asociados al producto
        const prices = await stripe.prices.list({
          product: product.id,
          active: true
        });
        
        if (prices.data.length === 0) {
          
          throw new Error("No active prices found for the user's product");
        }

        // Create new configuration
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
      } catch (error) {
        
        throw error;
      }
    }

    // Crear la sesión del portal
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL || process.env.BASE_URL || 'http://localhost:3000'}/dashboard`,
      configuration: configuration.id
    });
    
    return { url: session.url };
  } catch (error) {
    
    
    if (error instanceof Error) {
      
      
      // Mapear errores comunes a códigos más amigables
      if (error.message.includes('API key') || error.message.includes('stripe')) {
        return { error: 'stripe-api-key' };
      } else if (error.message.includes('configuration')) {
        return { error: 'portal-config' };
      } else if (error.message.includes('customer')) {
        return { error: 'invalid-customer' };
      }
    }
    
    return { error: 'portal-access' };
  }
}

export async function handleSubscriptionChange(
  subscription: Stripe.Subscription,
  eventType?: string
) {
  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;
  const status = subscription.status;

  const user = await getUserByStripeCustomerId(customerId);

  if (!user) {
    
    return;
  }

  let planName = null;
  const plan = subscription.items.data[0]?.plan;
  
  // Get plan name and other data for the email
  if (plan && typeof plan.product === 'string') {
    try {
      const product = await stripe.products.retrieve(plan.product);
      planName = product.name;
    } catch (error) {
      
    }
  } else if (plan && typeof plan.product === 'object') {
    planName = plan.product.name;
  }

  if (status === 'active' || status === 'trialing') {
    await updateUserSubscription(user.id, {
      stripeSubscriptionId: subscriptionId,
      stripeProductId: typeof plan?.product === 'string' 
        ? plan?.product 
        : plan?.product?.id,
      planName,
      subscriptionStatus: status
    });
    
    const expiryDate = subscription.current_period_end 
      ? new Date(subscription.current_period_end * 1000).toISOString().split('T')[0]
      : undefined;
    
    try {
      await sendSubscriptionChangeEmail({
        email: user.email,
        name: user.name || user.email.split('@')[0],
        planName: planName || 'Desconocido',
        status,
        expiryDate,
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || process.env.BASE_URL || 'http://localhost:3000'}/dashboard`
      });
    } catch (error) {
      
    }
  } else if (status === 'canceled' || status === 'unpaid' || status === 'incomplete_expired' || status === 'incomplete') {
    await updateUserSubscription(user.id, {
      stripeSubscriptionId: null,
      stripeProductId: null,
      planName: null,
      subscriptionStatus: status
    });
    
    try {
      await sendSubscriptionChangeEmail({
        email: user.email,
        name: user.name || user.email.split('@')[0],
        planName: 'N/A',
        status,
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || process.env.BASE_URL || 'http://localhost:3000'}/dashboard`
      });
    } catch (error) {
      
    }
  } else {
    
  }
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

export function isTestMode(): boolean {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  return !!apiKey && apiKey.startsWith('sk_test_');
}
