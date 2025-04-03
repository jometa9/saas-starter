import { NextRequest, NextResponse } from 'next/server';
import { getUser, updateUserById } from '@/lib/db/queries';
import { stripe } from '@/lib/payments/stripe';
import { cookies } from 'next/headers';
import { lucia } from '@/lib/auth/lucia';

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id');
  console.log(`🔄 Callback de Stripe recibido: ${req.url}`);
  console.log(`🔄 Parámetros: ${req.nextUrl.search}`);
  
  if (!sessionId) {
    console.error(`❌ No se encontró session_id en la URL: ${req.url}`);
    return NextResponse.redirect(new URL('/dashboard?error=missing-session', req.url));
  }
  
  try {
    console.log(`🔄 Procesando finalización de checkout para sessionId: ${sessionId}`);
    
    // Obtener la sesión de Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer', 'line_items']
    });
    
    if (!session) {
      console.error(`❌ Sesión de Stripe no encontrada: ${sessionId}`);
      return NextResponse.redirect(new URL('/dashboard?error=invalid-session', req.url));
    }
    
    console.log(`✅ Sesión Stripe recuperada:`, JSON.stringify({
      id: session.id,
      customer: session.customer,
      subscription: session.subscription,
      status: session.status,
      mode: session.mode
    }, null, 2));
    
    // Validar que tengamos los datos necesarios
    if (!session.customer) {
      console.error(`❌ No hay customer en la sesión: ${sessionId}`);
      return NextResponse.redirect(new URL('/dashboard?error=missing-customer', req.url));
    }
    
    if (!session.subscription) {
      console.error(`❌ No hay subscription en la sesión: ${sessionId}`);
      return NextResponse.redirect(new URL('/dashboard?error=missing-subscription', req.url));
    }
    
    // Obtener detalles de la suscripción
    const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription.id;
    const customerId = typeof session.customer === 'string' ? session.customer : session.customer.id;
    
    if (!subscriptionId || !customerId) {
      console.error(`❌ Datos incompletos en la sesión. SubscriptionId: ${subscriptionId}, CustomerId: ${customerId}`);
      return NextResponse.redirect(new URL('/dashboard?error=incomplete-data', req.url));
    }
    
    console.log(`🔄 Obteniendo detalles de suscripción: ${subscriptionId}`);
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['items.data.price.product']
    });
    
    // Obtener información del producto
    const item = subscription.items.data[0];
    if (!item || !item.price) {
      console.error(`❌ No hay items o price en la suscripción: ${subscriptionId}`);
      return NextResponse.redirect(new URL('/dashboard?error=missing-price-data', req.url));
    }
    
    const priceId = item.price.id;
    const productId = typeof item.price.product === 'string' ? item.price.product : item.price.product.id;
    const productName = typeof item.price.product === 'string' ? null : item.price.product.name;
    
    // Determinar el estado de la suscripción
    const status = subscription.status;
    
    console.log(`🔄 Datos de suscripción: 
      - CustomerId: ${customerId}
      - SubscriptionId: ${subscriptionId}
      - ProductId: ${productId}
      - ProductName: ${productName}
      - PriceId: ${priceId}
      - Status: ${status}`);
    
    // Obtener el usuario actual
    const user = await getUser();
    if (!user) {
      console.error(`❌ Usuario no encontrado en la sesión`);
      return NextResponse.redirect(new URL('/sign-in?error=no-session', req.url));
    }
    
    // Actualizar el usuario con los datos de Stripe
    console.log(`🔄 Actualizando usuario ${user.id} con datos de suscripción`);
    
    try {
      await updateUserById(user.id, {
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        stripeProductId: productId,
        planName: productName,
        subscriptionStatus: status
      });
      
      console.log(`✅ Usuario actualizado correctamente con datos de suscripción`);
    } catch (updateError) {
      console.error(`❌ Error al actualizar usuario:`, updateError);
      return NextResponse.redirect(new URL('/dashboard?error=update-error', req.url));
    }
    
    // Redirigir al dashboard con mensaje de éxito
    return NextResponse.redirect(new URL('/dashboard?success=subscription-activated', req.url));
  } catch (error) {
    console.error('❌ Error procesando sesión de checkout:', error);
    if (error instanceof Error) {
      console.error(`❌ Detalles del error: ${error.message}`);
      console.error(`❌ Stack: ${error.stack}`);
    }
    return NextResponse.redirect(new URL('/dashboard?error=checkout-error', req.url));
  }
}

// Ruta simulada para desarrollo sin Stripe real
export async function POST(req: NextRequest) {
  // Esta ruta es solo para desarrollo sin Stripe real
  try {
    console.log('🔧 Simulando finalización de checkout (POST)');
    
    // Obtener el usuario actual
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'No user session found' }, { status: 401 });
    }
    
    // Parse JSON body
    const body = await req.json();
    const { priceId, productId, productName } = body;
    
    if (!priceId) {
      return NextResponse.json({ error: 'Missing priceId' }, { status: 400 });
    }
    
    // Simular IDs
    const simulatedCustomerId = `cus_sim_${Math.random().toString(36).substring(2, 15)}`;
    const simulatedSubscriptionId = `sub_sim_${Math.random().toString(36).substring(2, 15)}`;
    const simulatedProductId = productId || `prod_sim_${Math.random().toString(36).substring(2, 15)}`;
    const simulatedProductName = productName || 'Plan Simulado';
    
    console.log(`🔧 Simulando suscripción: 
      - CustomerId: ${simulatedCustomerId}
      - SubscriptionId: ${simulatedSubscriptionId}
      - ProductId: ${simulatedProductId}
      - ProductName: ${simulatedProductName}`);
    
    // Actualizar el usuario con datos simulados
    await updateUserById(user.id, {
      stripeCustomerId: simulatedCustomerId,
      stripeSubscriptionId: simulatedSubscriptionId,
      stripeProductId: simulatedProductId,
      planName: simulatedProductName,
      subscriptionStatus: 'active'
    });
    
    console.log(`✅ Usuario actualizado con datos simulados: ${user.id}`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Suscripción simulada activada correctamente',
      redirectUrl: '/dashboard?success=subscription-activated'
    });
  } catch (error) {
    console.error('❌ Error en simulación de checkout:', error);
    return NextResponse.json({ 
      error: 'Error en la simulación de checkout', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
