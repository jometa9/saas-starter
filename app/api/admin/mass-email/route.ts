'use server';

import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth/utils';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';
import { isNull } from 'drizzle-orm';

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
      isImportant = false
    } = data;

    if (!subject || !message) {
      return NextResponse.json({ error: 'Subject and message are required' }, { status: 400 });
    }

    // Consulta simple para obtener todos los usuarios activos
    const usersList = await db
      .select()
      .from(users)
      .where(isNull(users.deletedAt));

    if (usersList.length === 0) {
      return NextResponse.json({ 
        warning: true,
        message: 'No users found in the database'
      }, { status: 200 });
    }

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
    
    return NextResponse.json({ error: 'Failed to send mass email' }, { status: 500 });
  }
} 