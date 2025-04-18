'use server';

import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth/utils';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';
import { isNull, sql, inArray, and, eq, or } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  try {
    // Verificar si la solicitud proviene de un administrador
    const isAdmin = await isAdminRequest(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Obtener los datos de la solicitud
    const data = await req.json();
    const { 
      subject, 
      message, 
      ctaLabel, 
      ctaUrl, 
      isImportant = false,
      targetGroup = 'all' // Puede ser 'all', 'free', 'paid', etc.
    } = data;

    if (!subject || !message) {
      return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 });
    }

    // Construir la consulta según el grupo objetivo
    let query = db.select().from(users).where(isNull(users.deletedAt));

    if (targetGroup === 'free') {
      // Usuarios con suscripciones gratuitas:
      // - Estado "active" o "admin_assigned" sin stripeSubscriptionId, o
      // - Estado diferente de "active", "trialing" (suscripciones inactivas)
      query = query.where(
        or(
          // Suscripciones asignadas manualmente por el admin (gratuitas)
          and(
            eq(users.subscriptionStatus, 'admin_assigned'),
            isNull(users.stripeSubscriptionId)
          ),
          // Suscripciones gratuitas activas sin Stripe
          and(
            eq(users.subscriptionStatus, 'active'),
            isNull(users.stripeSubscriptionId)
          ),
          // Usuarios sin suscripción activa
          and(
            sql`${users.subscriptionStatus} IS NULL OR ${users.subscriptionStatus} NOT IN ('active', 'trialing')`
          )
        )
      );
    } else if (targetGroup === 'paid') {
      // Usuarios con suscripciones pagas:
      // - Estado "active" o "trialing" con stripeSubscriptionId
      query = query.where(
        and(
          inArray(users.subscriptionStatus, ['active', 'trialing']),
          sql`${users.stripeSubscriptionId} IS NOT NULL`
        )
      );
    }
    // Para 'all', no hacemos filtro adicional

    // Obtener la lista de usuarios
    const usersList = await query;

    if (usersList.length === 0) {
      return NextResponse.json({ 
        warning: true,
        message: 'No users found matching the criteria'
      }, { status: 200 });
    }

    // Importar dinámicamente el servicio de email para evitar errores de "Cannot use server-only APIs in client components"
    const { sendBroadcastEmail } = await import('@/lib/email');

    // Preparar para envío en lotes de 10 emails a la vez para no sobrecargar el servidor
    const batchSize = 10;
    let successCount = 0;
    let failedEmails: string[] = [];

    for (let i = 0; i < usersList.length; i += batchSize) {
      const batch = usersList.slice(i, i + batchSize);
      
      // Procesar cada lote en paralelo
      const results = await Promise.allSettled(
        batch.map(user => {
          return sendBroadcastEmail({
            email: user.email,
            name: user.name || user.email.split('@')[0],
            subject,
            message,
            ctaLabel,
            ctaUrl,
            isImportant
          });
        })
      );
      
      // Contar éxitos y fallos
      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successCount++;
        } else {
          failedEmails.push(batch[index].email);
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: `Emails sent successfully to ${successCount} out of ${usersList.length} users`,
      stats: {
        total: usersList.length,
        success: successCount,
        failed: failedEmails.length,
        failedEmails: failedEmails.length > 0 ? failedEmails : undefined
      }
    });
  } catch (error) {
    console.error('Error sending mass email:', error);
    return NextResponse.json({ error: 'Failed to send mass email' }, { status: 500 });
  }
} 