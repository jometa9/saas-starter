'use server';

import { redirect } from 'next/navigation';
import { User } from '@/lib/db/schema';
import { getUser } from '@/lib/db/queries';
import { createCheckoutSession, createCustomerPortalSession } from '@/lib/payments/stripe';

export async function checkoutAction(priceId: string): Promise<{ error?: string; redirect?: string }> {
  try {
    // Validar el formato del ID de precio
    if (!priceId || !priceId.startsWith('price_')) {
      console.error(`❌ Formato de priceId inválido: ${priceId}`);
      return { error: 'invalid-price-format' };
    }
    
    const user = await getUser();
    
    if (!user) {
      console.error(`❌ No se encontró sesión de usuario`);
      return { error: 'no-session' };
    }
    
    if (user.stripeSubscriptionId && user.subscriptionStatus === 'active') {
      console.error(`❌ El usuario ya tiene una suscripción activa: ${user.stripeSubscriptionId}`);
      return { error: 'subscription-exists' };
    }
    
    // Usar siempre Stripe directamente sin simulación
    const redirectUrl = await createCheckoutSession({ user, priceId });
    
    // Comprobar si la URL es una URL de error o una URL de Stripe
    if (redirectUrl.startsWith('/')) {
      // Es una URL de error interna
      const errorCode = new URL(redirectUrl, 'http://localhost').searchParams.get('error');
      if (errorCode) {
        return { error: errorCode };
      }
      return { redirect: redirectUrl };
    }
    
    // Es una URL válida de Stripe
    return { redirect: redirectUrl };
  } catch (error) {
    console.error('❌ Error en checkoutAction:', error);
    
    if (error instanceof Error) {
      console.error(`❌ Mensaje de error: ${error.message}`);
      console.error(`❌ Stack: ${error.stack}`);
      
      // Mapear errores comunes a códigos más amigables
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
    
    // Verificar si el usuario tiene un ID de cliente de Stripe
    if (!user.stripeCustomerId) {
      console.error(`❌ El usuario no tiene un ID de cliente de Stripe`);
      return { error: 'no-customer-id' };
    }
    
    // Verificar si el usuario tiene una suscripción activa o en prueba
    if (!user.stripeSubscriptionId || (user.subscriptionStatus !== 'active' && user.subscriptionStatus !== 'trialing')) {
      console.error(`❌ El usuario no tiene una suscripción activa o en prueba (Status: ${user.subscriptionStatus})`);
      return { error: 'no-active-subscription' };
    }
    
    // Verificar si el usuario tiene un ID de producto
    if (!user.stripeProductId) {
      console.error(`❌ El usuario no tiene un ID de producto`);
      return { error: 'no-product-id' };
    }
    
    const session = await createCustomerPortalSession(user);
    
    // Manejar si createCustomerPortalSession devuelve un error
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
      
      // Mapear errores comunes a códigos más amigables
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
