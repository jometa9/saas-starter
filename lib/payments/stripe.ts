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
  
  if (!apiKey || !apiKey.startsWith('sk_')) {
    // La clave API no está configurada o no tiene el formato correcto
    console.warn('⚠️ STRIPE_SECRET_KEY no es válida. Para usar Stripe, debes configurar una clave válida en .env.local');
    console.warn('⚠️ Las claves de prueba válidas comienzan con "sk_test_" y las de producción con "sk_live_"');
    
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
                throw new Error('Stripe no está configurado correctamente. Añade una clave válida de Stripe en tu archivo .env.local');
              };
            }
          });
        }
        return () => {
          throw new Error('Stripe no está configurado correctamente. Añade una clave válida de Stripe en tu archivo .env.local');
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
    return `/sign-up?redirect=checkout&priceId=${priceId}`;
  }

  try {
    // Verificar que tengamos un customerId válido o crear uno
    if (!user.stripeCustomerId) {
      try {
        // Crear un cliente en Stripe
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.name || undefined,
          metadata: {
            userId: user.id.toString(),
            source: 'checkout_flow'
          }
        });
        
        // Actualizar el usuario con el nuevo ID de cliente
        await updateUserById(user.id, {
          stripeCustomerId: customer.id
        });
        
        // Actualizar el customerId para usarlo en la sesión
        user.stripeCustomerId = customer.id;
      } catch (createError) {
        console.error(`❌ Error al crear cliente en Stripe:`, createError);
        return '/dashboard?error=customer-error';
      }
    } else {
      // Verificar que el cliente exista en Stripe
      try {
        // Intentar recuperar el cliente de Stripe para verificar que existe
        const customer = await stripe.customers.retrieve(user.stripeCustomerId);
        
        // Asegurarse de que el correo esté actualizado en Stripe
        if (customer.email !== user.email) {
          await stripe.customers.update(user.stripeCustomerId, {
            email: user.email,
            name: user.name || undefined
          });
        }
      } catch (customerError) {
        console.error(`❌ Error: El cliente ${user.stripeCustomerId} no existe en Stripe:`, customerError);
        
        try {
          // El cliente no existe, crear uno nuevo
          const customer = await stripe.customers.create({
            email: user.email,
            name: user.name || undefined,
            metadata: {
              userId: user.id.toString(),
              source: 'checkout_recovery'
            }
          });
          
          // Actualizar el usuario con el nuevo ID de cliente
          await updateUserById(user.id, {
            stripeCustomerId: customer.id
          });
          
          // Actualizar el customerId para usarlo en la sesión
          user.stripeCustomerId = customer.id;
        } catch (createError) {
          console.error(`❌ Error al crear nuevo cliente en Stripe:`, createError);
          return '/dashboard?error=customer-error';
        }
      }
    }

    // Verificar que el precio exista en Stripe
    try {
      // Intentar recuperar el precio para verificar que existe
      const price = await stripe.prices.retrieve(priceId);
    } catch (priceError) {
      console.error(`❌ Error: El precio ${priceId} no existe en Stripe:`, priceError);
      return '/dashboard?error=invalid-price';
    }

    // Intentar crear la sesión de checkout con el customerId existente
    try {
      // Si el usuario ya tiene una suscripción activa, mostrar mensaje
      if (user.stripeSubscriptionId && user.subscriptionStatus === 'active') {
        console.error(`❌ Usuario ya tiene una suscripción activa: ${user.stripeSubscriptionId}`);
        return '/dashboard?error=subscription-exists';
      }
      
      // Construir URLs absolutas para success y cancel
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.BASE_URL || 'http://localhost:3000';
      const successUrl = `${baseUrl}/api/stripe/checkout?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${baseUrl}/pricing`;
      
      // Configuración simplificada de la sesión de checkout
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
        customer: user.stripeCustomerId,
        client_reference_id: user.id.toString(),
        subscription_data: {
          trial_period_days: 14
        }
      };
      
      const session = await stripe.checkout.sessions.create(sessionConfig);

      if (!session.url) {
        console.error('❌ Error: La sesión de checkout no tiene URL');
        throw new Error('No se pudo crear la URL de checkout');
      }
      
      // Retornar la URL en lugar de redirigir
      return session.url;
    } catch (stripeError) {
      console.error('❌ Error al crear sesión en Stripe:', stripeError);
      
      // Obtener detalles completos del error
      if (stripeError instanceof Error) {
        const errorMsg = stripeError.message;
        console.error(`❌ Mensaje de error completo: ${errorMsg}`);
        console.error(`❌ Stack trace: ${stripeError.stack}`);
        
        // Verificar errores comunes específicos de Stripe
        if (errorMsg.includes('No such customer') || errorMsg.includes('customer')) {
          return '/dashboard?error=invalid-customer-id';
        }
        
        if (errorMsg.includes('No such price') || errorMsg.includes('price')) {
          return '/dashboard?error=invalid-price-id';
        }
        
        if (errorMsg.includes('API key') || errorMsg.includes('Invalid API Key')) {
          return '/dashboard?error=invalid-api-key';
        }
        
        // Problema con la URL de redirección
        if (errorMsg.includes('success_url') || errorMsg.includes('cancel_url')) {
          return '/dashboard?error=invalid-redirect-url';
        }
      }
      
      // Cualquier otro error de Stripe
      throw stripeError;
    }
  } catch (error) {
    console.error('❌ Error en createCheckoutSession:', error);
    throw error;
  }
}

// Función auxiliar para actualizar un usuario por ID
async function updateUserById(userId: number, data: Partial<User>) {
  // Esta función podría estar en lib/db/queries, pero la implementamos aquí para evitar dependencias circulares
  try {
    // Usar la API de Next.js para actualizar el usuario
    const response = await fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Error actualizando usuario: ${response.status}`);
    }
  } catch (error) {
    console.error(`❌ Error actualizando usuario ${userId}:`, error);
    throw error;
  }
}

export async function createCustomerPortalSession(user: User): Promise<{ url: string } | { error: string }> {
  // Verificar que el usuario tenga la información necesaria
  if (!user.stripeCustomerId) {
    console.error(`❌ Error: Usuario sin stripeCustomerId`);
    return { error: 'no-customer-id' };
  }
  
  if (!user.stripeSubscriptionId || (user.subscriptionStatus !== 'active' && user.subscriptionStatus !== 'trialing')) {
    console.error(`❌ Error: Usuario sin suscripción activa o en prueba (Status: ${user.subscriptionStatus})`);
    return { error: 'no-active-subscription' };
  }
  
  if (!user.stripeProductId) {
    console.error(`❌ Error: Usuario sin stripeProductId`);
    return { error: 'no-product-id' };
  }

  try {
    // Buscar configuración existente o crear una nueva
    let configuration: Stripe.BillingPortal.Configuration;
    const configurations = await stripe.billingPortal.configurations.list();

    if (configurations.data.length > 0) {
      configuration = configurations.data[0];
    } else {
      // Verificar que el producto existe antes de crear la configuración
      try {
        const product = await stripe.products.retrieve(user.stripeProductId);
        if (!product.active) {
          console.error(`❌ Error: El producto ${user.stripeProductId} no está activo en Stripe`);
          throw new Error("User's product is not active in Stripe");
        }

        // Obtener precios asociados al producto
        const prices = await stripe.prices.list({
          product: product.id,
          active: true
        });
        
        if (prices.data.length === 0) {
          console.error(`❌ Error: No se encontraron precios activos para el producto ${product.id}`);
          throw new Error("No active prices found for the user's product");
        }

        // Crear nueva configuración
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
        console.error(`❌ Error al verificar producto o crear configuración:`, error);
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
    console.error(`❌ Error al crear sesión del portal:`, error);
    
    if (error instanceof Error) {
      console.error(`❌ Mensaje de error: ${error.message}`);
      
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
    console.error(`❌ User not found for Stripe customer: ${customerId}`);
    return;
  }

  let planName = null;
  const plan = subscription.items.data[0]?.plan;
  
  // Obtener el nombre del plan y otros datos para el email
  if (plan && typeof plan.product === 'string') {
    try {
      const product = await stripe.products.retrieve(plan.product);
      planName = product.name;
    } catch (error) {
      console.error(`❌ Error retrieving product: ${plan.product}`, error);
    }
  } else if (plan && typeof plan.product === 'object') {
    planName = plan.product.name;
  }

  // Manejar más estados de suscripción
  if (status === 'active' || status === 'trialing') {
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
      await sendSubscriptionChangeEmail({
        email: user.email,
        name: user.name || user.email.split('@')[0],
        planName: planName || 'Desconocido',
        status,
        expiryDate,
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || process.env.BASE_URL || 'http://localhost:3000'}/dashboard`
      });
    } catch (error) {
      console.error(`❌ Error sending subscription change email:`, error);
    }
  } else if (status === 'canceled' || status === 'unpaid' || status === 'incomplete_expired' || status === 'incomplete') {
    await updateUserSubscription(user.id, {
      stripeSubscriptionId: null,
      stripeProductId: null,
      planName: null,
      subscriptionStatus: status
    });
    
    // Enviar email notificando la cancelación o falta de pago
    try {
      await sendSubscriptionChangeEmail({
        email: user.email,
        name: user.name || user.email.split('@')[0],
        planName: 'N/A',
        status,
        dashboardUrl: `${process.env.NEXT_PUBLIC_APP_URL || process.env.BASE_URL || 'http://localhost:3000'}/dashboard`
      });
    } catch (error) {
      console.error(`❌ Error sending subscription cancellation email:`, error);
    }
  } else {
    console.warn(`⚠️ Unhandled subscription status: ${status}`);
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

// Función para verificar si estamos en modo de prueba de Stripe
export function isTestMode(): boolean {
  const apiKey = process.env.STRIPE_SECRET_KEY;
  return !!apiKey && apiKey.startsWith('sk_test_');
}
