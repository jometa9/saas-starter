'use server';

import { getUser } from '@/lib/db/queries';
import { createCheckoutSession, createCustomerPortalSession, getStripeProducts, getStripePrices } from '@/lib/payments/stripe';
import { stripe } from '@/lib/payments/stripe';

// Precios de planes
// Plan Premium
const PREMIUM_MONTHLY_PRICE_ID = process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID || 'price_1RB3j0A3C4QniATDapoM1A3a';
const PREMIUM_ANNUAL_PRICE_ID = process.env.STRIPE_PREMIUM_ANNUAL_PRICE_ID || 'price_1RB3jfA3C4QniATDbeuwOUrx';
// Plan Unlimited
const UNLIMITED_MONTHLY_PRICE_ID = process.env.STRIPE_UNLIMITED_MONTHLY_PRICE_ID || 'price_1RDo2sA3C4QniATDKk2O4xZb';
const UNLIMITED_ANNUAL_PRICE_ID = process.env.STRIPE_UNLIMITED_ANNUAL_PRICE_ID || 'price_1RDo2sA3C4QniATDbnZkwM0E';
// Plan Managed VPS
const MANAGED_VPS_MONTHLY_PRICE_ID = process.env.STRIPE_MANAGED_VPS_MONTHLY_PRICE_ID || 'price_1RDo4HA3C4QniATDCV2KY2JF';
const MANAGED_VPS_ANNUAL_PRICE_ID = process.env.STRIPE_MANAGED_VPS_ANNUAL_PRICE_ID || 'price_1RDo4gA3C4QniATDR0bB6698';

// Precio por defecto para checkout directo (usado en el botón "Subscribe Now")
const DEFAULT_PRICE_ID = process.env.STRIPE_DEFAULT_PRICE_ID || PREMIUM_MONTHLY_PRICE_ID;

// Función para obtener un precio válido para checkout
async function getValidStripePrice(): Promise<string | null> {
  try {
    // Primero intentamos usar el precio por defecto (mensual) desde las variables de entorno
    if (DEFAULT_PRICE_ID) {
      return DEFAULT_PRICE_ID;
    }
    
    // Si no hay variable de entorno, intentamos con los otros precios disponibles
    if (PREMIUM_MONTHLY_PRICE_ID) {
      return PREMIUM_MONTHLY_PRICE_ID;
    }
    
    if (UNLIMITED_MONTHLY_PRICE_ID) {
      return UNLIMITED_MONTHLY_PRICE_ID;
    }
    
    if (MANAGED_VPS_MONTHLY_PRICE_ID) {
      return MANAGED_VPS_MONTHLY_PRICE_ID;
    }
    
    const stripePrices = await getStripePrices();
    
    const anyValidPrice = stripePrices.prices.find(price => price.active);
    if (anyValidPrice?.id) {
      return anyValidPrice.id;
    }
    
    
    return null;
  } catch (error) {
    
    return null;
  }
}

// Nueva acción para suscribirse directamente al plan por defecto (mensual)
export async function directCheckoutAction(): Promise<{ error?: string; redirect?: string }> {
  try {
    // Obtener el usuario actual
    const user = await getUser();
    
    if (!user) {
      return { error: 'no-auth' };
    }
    
    // Verificar si el usuario ya tiene una suscripción activa
    if (user.stripeSubscriptionId && (
      user.subscriptionStatus === 'active' || 
      user.subscriptionStatus === 'trialing'
    )) {
      return { error: 'subscription-exists' };
    }
    
    // Obtener un precio válido
    const priceId = await getValidStripePrice();
    
    // Validar que tenemos un ID de precio
    if (!priceId) {
      
      return { error: 'no-price-id' };
    }
    
    const checkoutSession = await createCheckoutSession({
      priceId,
      userId: user.id,
      email: user.email,
      customerId: user.stripeCustomerId,
    });
    
    if (!checkoutSession || !checkoutSession.url) {
      
      return { error: 'checkout-creation-failed' };
    }
    
    return { redirect: checkoutSession.url };
  } catch (error) {
    
    
    if (error instanceof Error) {
      
      
      if (error.message.includes('API key') || error.message.includes('stripe')) {
        return { error: 'stripe-api-key' };
      } else if (error.message.includes('price') || error.message.includes('product')) {
        return { error: 'invalid-price' };
      } else if (error.message.includes('customer')) {
        return { error: 'customer-error' };
      }
    }
    
    return { error: 'checkout-error' };
  }
}

export async function checkoutAction(
  priceId: string, 
  options?: { 
    changePlan?: boolean; 
    currentPlan?: string;
  }
): Promise<{ error?: string; redirect?: string }> {

  try {
    if (!priceId || !priceId.startsWith('price_')) {
      
      return { error: 'invalid-price-format' };
    }
    
    const user = await getUser();
    
    if (!user) {
      return { error: 'no-auth' };
    }
    
    // Verificar si el usuario ya tiene una suscripción activa y está cambiando de plan
    if (options?.changePlan && user.stripeSubscriptionId && (
      user.subscriptionStatus === 'active' || 
      user.subscriptionStatus === 'trialing'
    )) {
      try {
        
        
        // Cancelar la suscripción actual al final del período
        await stripe.subscriptions.update(user.stripeSubscriptionId, {
          cancel_at_period_end: true,
          metadata: {
            cancelReason: 'changing_plan',
            newPriceId: priceId
          }
        });
        
        
      } catch (cancelError) {
        
        // Continuamos con el checkout aunque falle la cancelación
      }
    }
    // Si tiene suscripción activa pero no está cambiando de plan (llegó directamente al checkout)
    else if (user.stripeSubscriptionId && (
      user.subscriptionStatus === 'active' || 
      user.subscriptionStatus === 'trialing'
    )) {
      return { error: 'subscription-exists' };
    }
    
    // Crear sesión de checkout
    const checkoutSession = await createCheckoutSession({
      priceId,
      userId: user.id,
      email: user.email,
      customerId: user.stripeCustomerId,
      metadata: options?.changePlan ? {
        changePlan: 'true',
        previousPlan: options.currentPlan || 'unknown',
        previousSubscriptionId: user.stripeSubscriptionId || 'none'
      } : undefined
    });
    
    if (!checkoutSession || !checkoutSession.url) {
      
      return { error: 'checkout-creation-failed' };
    }
    
    return { redirect: checkoutSession.url };
  } catch (error) {
    
    
    if (error instanceof Error) {
      
      
      
      if (error.message.includes('API key') || error.message.includes('stripe')) {
        return { error: 'stripe-api-key' };
      } else if (error.message.includes('price') || error.message.includes('product')) {
        return { error: 'invalid-price' };
      } else if (error.message.includes('customer')) {
        return { error: 'customer-error' };
      }
    }
    
    return { error: 'checkout-error' };
  }
}

export async function customerPortalAction(): Promise<{ error?: string; redirect?: string }> {
  try {
    const user = await getUser();
    
    if (!user) {
      
      return { error: 'no-session' };
    }
    
    if (!user.stripeCustomerId) {
      
      return { error: 'no-customer-id' };
    }
    
    if (!user.stripeSubscriptionId || (user.subscriptionStatus !== 'active' && user.subscriptionStatus !== 'trialing')) {
      
      return { error: 'no-active-subscription' };
    }
    
    if (!user.stripeProductId) {
      
      return { error: 'no-product-id' };
    }
    
    const session = await createCustomerPortalSession(user);
    
    if ('error' in session) {
      
      return { error: session.error };
    }
    
    if (!session.url) {
      
      return { error: 'portal-access' };
    }
    
    return { redirect: session.url };
  } catch (error) {
    
    
    if (error instanceof Error) {
      
      
      
      if (error.message.includes('API key') || error.message.includes('stripe')) {
        return { error: 'stripe-api-key' };
      } else if (error.message.includes('product')) {
        return { error: 'no-product-id' };
      } else if (error.message.includes('customer')) {
        return { error: 'invalid-customer' };
      } else if (error.message.includes('configuration')) {
        return { error: 'portal-config' };
      }
    }
    
    return { error: 'portal-access' };
  }
}
