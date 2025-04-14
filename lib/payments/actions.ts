'use server';

import { getUser } from '@/lib/db/queries';
import { createCheckoutSession, createCustomerPortalSession, getStripeProducts, getStripePrices } from '@/lib/payments/stripe';

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
    
    console.error('No se encontró ningún precio válido');
    return null;
  } catch (error) {
    console.error('Error al obtener precios de Stripe:', error);
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
      console.error('No se pudo determinar un ID de precio para el checkout');
      return { error: 'no-price-id' };
    }
    
    const checkoutSession = await createCheckoutSession({
      priceId,
      userId: user.id,
      email: user.email,
      customerId: user.stripeCustomerId,
    });
    
    if (!checkoutSession || !checkoutSession.url) {
      console.error('No se pudo crear la sesión de checkout');
      return { error: 'checkout-creation-failed' };
    }
    
    return { redirect: checkoutSession.url };
  } catch (error) {
    console.error('Error en directCheckoutAction:', error);
    
    if (error instanceof Error) {
      console.error(`❌ Mensaje de error: ${error.message}`);
      
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

export async function checkoutAction(priceId: string): Promise<{ error?: string; redirect?: string }> {

  try {
    if (!priceId || !priceId.startsWith('price_')) {
      console.error(`❌ Formato de priceId inválido: ${priceId}`);
      return { error: 'invalid-price-format' };
    }
    
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
    
    // Crear sesión de checkout
    const checkoutSession = await createCheckoutSession({
      priceId,
      userId: user.id,
      email: user.email,
      customerId: user.stripeCustomerId,
    });
    
    if (!checkoutSession || !checkoutSession.url) {
      console.error('No se pudo crear la sesión de checkout');
      return { error: 'checkout-creation-failed' };
    }
    
    return { redirect: checkoutSession.url };
  } catch (error) {
    console.error('Error en la acción de checkout:', error);
    
    if (error instanceof Error) {
      console.error(`❌ Mensaje de error: ${error.message}`);
      console.error(`❌ Stack: ${error.stack}`);
      
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
      console.error(`❌ No se encontró sesión de usuario`);
      return { error: 'no-session' };
    }
    
    if (!user.stripeCustomerId) {
      console.error(`❌ El usuario no tiene un ID de cliente de Stripe`);
      return { error: 'no-customer-id' };
    }
    
    if (!user.stripeSubscriptionId || (user.subscriptionStatus !== 'active' && user.subscriptionStatus !== 'trialing')) {
      console.error(`❌ El usuario no tiene una suscripción activa o en prueba (Status: ${user.subscriptionStatus})`);
      return { error: 'no-active-subscription' };
    }
    
    if (!user.stripeProductId) {
      console.error(`❌ El usuario no tiene un ID de producto`);
      return { error: 'no-product-id' };
    }
    
    const session = await createCustomerPortalSession(user);
    
    if ('error' in session) {
      console.error(`❌ Error de la sesión del portal: ${session.error}`);
      return { error: session.error };
    }
    
    if (!session.url) {
      console.error('❌ La sesión del portal no tiene URL');
      return { error: 'portal-access' };
    }
    
    return { redirect: session.url };
  } catch (error) {
    console.error('❌ Error en customerPortalAction:', error);
    
    if (error instanceof Error) {
      console.error(`❌ Mensaje de error: ${error.message}`);
      console.error(`❌ Stack: ${error.stack}`);
      
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
