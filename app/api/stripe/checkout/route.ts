import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';
import { setSession } from '@/lib/auth/session';
import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/payments/stripe';
import Stripe from 'stripe';
import { getUser, updateUserById } from '@/lib/db/queries';
import { cookies } from 'next/headers';
import { lucia } from '@/lib/auth/lucia';
import { sendSubscriptionChangeEmail } from '@/lib/email';

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id');
  
  if (!sessionId) {
    
    return NextResponse.redirect(new URL('/dashboard?error=missing-session', req.url));
  }
  
  try {
    
    // Obtener la sesión de Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer', 'line_items']
    });
    
    if (!session) {
      
      return NextResponse.redirect(new URL('/dashboard?error=invalid-session', req.url));
    }
    
    // Validar que tengamos los datos necesarios
    if (!session.customer) {
      
      return NextResponse.redirect(new URL('/dashboard?error=missing-customer', req.url));
    }
    
    if (!session.subscription) {
      
      return NextResponse.redirect(new URL('/dashboard?error=missing-subscription', req.url));
    }
    
    // Obtener detalles de la suscripción
    const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription.id;
    const customerId = typeof session.customer === 'string' ? session.customer : session.customer.id;
    
    if (!subscriptionId || !customerId) {
      
      return NextResponse.redirect(new URL('/dashboard?error=incomplete-data', req.url));
    }
    
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['items.data.price.product']
    });
    
    // Obtener información del producto
    const item = subscription.items.data[0];
    if (!item || !item.price) {
      
      return NextResponse.redirect(new URL('/dashboard?error=missing-price-data', req.url));
    }
    
    const priceId = item.price.id;
    const productId = typeof item.price.product === 'string' ? item.price.product : item.price.product.id;
    const productName = typeof item.price.product === 'string' ? 'Suscripción Premium' : item.price.product.name;
    const status = subscription.status;
    
    const user = await getUser();
    if (!user) {
      
      return NextResponse.redirect(new URL('/sign-in?error=no-session', req.url));
    }
    
    // Obtener información de fecha de finalización para la suscripción
    let expiryDate: string | undefined = undefined;
    if (subscription.current_period_end) {
      expiryDate = new Date(subscription.current_period_end * 1000).toISOString().split('T')[0];
    }
    
    try {
      await updateUserById(user.id, {
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        stripeProductId: productId,
        planName: productName,
        subscriptionStatus: status
      });
      
      try {
        await sendSubscriptionChangeEmail({
          email: user.email,
          name: user.name || user.email.split('@')[0],
          planName: productName || 'Plan Premium',
          status: status,
          expiryDate: expiryDate
        });
      } catch (emailError) {
        
      }
    } catch (updateError) {
      
      return NextResponse.redirect(new URL('/dashboard?error=update-error', req.url));
    }
    
    // Redirigir al dashboard con mensaje de éxito
    return NextResponse.redirect(new URL('/dashboard?success=subscription-activated', req.url));
  } catch (error) {
    
    if (error instanceof Error) {
      
      
    }
    return NextResponse.redirect(new URL('/dashboard?error=checkout-error', req.url));
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: 'No user session found' }, { status: 401 });
    }
    
    const body = await req.json();
    const { priceId, productId, productName } = body;
    
    if (!priceId) {
      return NextResponse.json({ error: 'Missing priceId' }, { status: 400 });
    }
    
    const simulatedCustomerId = `cus_sim_${Math.random().toString(36).substring(2, 15)}`;
    const simulatedSubscriptionId = `sub_sim_${Math.random().toString(36).substring(2, 15)}`;
    const simulatedProductId = productId || `prod_sim_${Math.random().toString(36).substring(2, 15)}`;
    const simulatedProductName = productName || 'Plan Premium (Simulado)';
    
    await updateUserById(user.id, {
      stripeCustomerId: simulatedCustomerId,
      stripeSubscriptionId: simulatedSubscriptionId,
      stripeProductId: simulatedProductId,
      planName: simulatedProductName,
      subscriptionStatus: 'active'
    });
    
    try {
      await sendSubscriptionChangeEmail({
        email: user.email,
        name: user.name || user.email.split('@')[0],
        planName: simulatedProductName,
        status: 'active',
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 días desde hoy
      });
    } catch (emailError) {
      // No bloqueamos el flujo principal si falla el envío de email
      
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Suscripción simulada activada correctamente',
      redirectUrl: '/dashboard?success=subscription-activated'
    });
  } catch (error) {
    
    return NextResponse.json({ 
      error: 'Error en la simulación de checkout', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
