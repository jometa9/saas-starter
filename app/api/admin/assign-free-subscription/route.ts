'use server';

import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth/utils';
import { db } from '@/lib/db/drizzle';
import { eq } from 'drizzle-orm';
import { user} from '@/lib/db/schema';
import { sendSubscriptionChangeEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    // Verificar si la solicitud proviene de un administrador
    const isAdmin = await isAdminRequest(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Obtener los datos de la solicitud
    const data = await req.json();
    const { email, plan, duration, force = false } = data;

    if (!email || !plan || !duration) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Buscar al usuario por email
    const userResult = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = userResult[0];

    // Verificar si el usuario ya tiene una suscripción activa
    if (
      !force &&
      user.subscriptionStatus === 'active' && 
      user.stripeSubscriptionId
    ) {
      // Si ya tiene una suscripción activa y no se está forzando el cambio, retornar advertencia
      return NextResponse.json(
        {
          warning: true,
          message: 'User already has an active subscription. Use force=true to override.',
          existingSubscription: {
            planName: user.planName || 'Unknown',
            status: user.subscriptionStatus,
            isPaid: !!user.stripeSubscriptionId
          }
        },
        { status: 409 }
      );
    }

    // Calcular la fecha de expiración basada en la duración (en meses)
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + duration);
    const expiryDateString = expiryDate.toISOString().split('T')[0];

    // Actualizar la suscripción del usuario
    await db
      .update(users)
      .set({
        planName: plan,
        subscriptionStatus: 'active',
        stripeSubscriptionId: null, // Es una suscripción gratuita, no tiene ID de Stripe
        updatedAt: new Date()
      })
      .where(eq(users.id, user.id));

    // Enviar email de notificación al usuario
    try {
      await sendSubscriptionChangeEmail({
        email: user.email,
        name: user.name || user.email.split('@')[0],
        planName: plan,
        status: 'active',
        expiryDate: expiryDateString
      });
    } catch (emailError) {
      
      // No bloqueamos el flujo principal si falla el envío de email
    }

    return NextResponse.json({
      success: true,
      message: `Free subscription ${plan} assigned to ${email} for ${duration} month(s).`
    });
  } catch (error) {
    
    return NextResponse.json({ error: 'Failed to assign free subscription' }, { status: 500 });
  }
}
