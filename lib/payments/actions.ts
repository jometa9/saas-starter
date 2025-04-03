'use server';

import { redirect } from 'next/navigation';
import { User } from '@/lib/db/schema';
import { getUser } from '@/lib/db/queries';
import { createCheckoutSession, createCustomerPortalSession } from '@/lib/payments/stripe';

export async function checkoutAction(priceId: string): Promise<{ error?: string; redirect?: string }> {
  // Añadir logs destacados para identificar fácilmente este proceso
  console.log('\n\n');
  console.log('🚀 =================================== 🚀');
  console.log('🚀      INICIANDO PROCESO DE CHECKOUT      🚀');
  console.log('🚀 =================================== 🚀');
  console.log('\n');
  
  try {
    console.log(`🔄 Iniciando checkout con priceId: ${priceId}`);
    
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
    
    console.log(`✅ Usuario recuperado: ${user.id} (${user.email})`);
    console.log(`🔄 Estado del usuario:
      - stripeCustomerId: ${user.stripeCustomerId || 'No tiene'}
      - stripeSubscriptionId: ${user.stripeSubscriptionId || 'No tiene'}
      - stripeProductId: ${user.stripeProductId || 'No tiene'}
      - subscriptionStatus: ${user.subscriptionStatus || 'No tiene'}
    `);
    
    if (user.stripeSubscriptionId && user.subscriptionStatus === 'active') {
      console.log(`⚠️ El usuario ya tiene una suscripción activa: ${user.stripeSubscriptionId}`);
      return { error: 'subscription-exists' };
    }
    
    console.log(`🔄 Conectando directamente con Stripe para crear sesión de checkout...`);
    
    // Usar siempre Stripe directamente sin simulación
    const redirectUrl = await createCheckoutSession({ user, priceId });
    
    console.log(`✅ URL de redirección generada: ${redirectUrl}`);
    console.log('🚀 ======= FIN DE PROCESO DE CHECKOUT ======= 🚀\n\n');
    
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
  console.log('\n\n');
  console.log('💳 =================================== 💳');
  console.log('💳    INICIANDO ACCESO AL PORTAL DE CLIENTE    💳');
  console.log('💳 =================================== 💳');
  console.log('\n');
  
  try {
    const user = await getUser();
    
    if (!user) {
      console.error(`❌ No se encontró sesión de usuario`);
      return { error: 'no-session' };
    }
    
    console.log(`✅ Usuario recuperado: ${user.id} (${user.email})`);
    console.log(`🔄 Estado del usuario:
      - stripeCustomerId: ${user.stripeCustomerId || 'No tiene'}
      - stripeSubscriptionId: ${user.stripeSubscriptionId || 'No tiene'}
      - stripeProductId: ${user.stripeProductId || 'No tiene'}
      - subscriptionStatus: ${user.subscriptionStatus || 'No tiene'}
    `);
    
    // Verificar si el usuario tiene un ID de cliente de Stripe
    if (!user.stripeCustomerId) {
      console.error(`❌ El usuario no tiene un ID de cliente de Stripe`);
      return { error: 'no-customer-id' };
    }
    
    // Verificar si el usuario tiene una suscripción activa
    if (!user.stripeSubscriptionId || user.subscriptionStatus !== 'active') {
      console.error(`❌ El usuario no tiene una suscripción activa (Status: ${user.subscriptionStatus})`);
      return { error: 'no-active-subscription' };
    }
    
    // Verificar si el usuario tiene un ID de producto
    if (!user.stripeProductId) {
      console.error(`❌ El usuario no tiene un ID de producto`);
      return { error: 'no-product-id' };
    }
    
    console.log(`🔄 Conectando directamente con Stripe para crear sesión de portal...`);
    
    const session = await createCustomerPortalSession(user);
    
    if (!session.url) {
      console.error('❌ La sesión del portal no tiene URL');
      return { error: 'portal-access' };
    }
    
    console.log(`✅ URL de portal generada: ${session.url}`);
    console.log('💳 ======= FIN DE ACCESO AL PORTAL ======= 💳\n\n');
    
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
