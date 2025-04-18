'use server';

import { NextRequest, NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/auth/utils';
import { sendWelcomeEmail, sendPasswordResetEmail, sendSubscriptionChangeEmail } from '@/lib/email';
import { getUser } from '@/lib/db/queries';

export async function POST(req: NextRequest) {
  try {
    // Verificar si la solicitud proviene de un administrador
    const isAdmin = await isAdminRequest(req);
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Obtener el usuario administrador
    const admin = await getUser();
    if (!admin) {
      return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
    }

    // Enviar los correos de prueba al administrador
    const adminEmail = admin.email;
    const adminName = admin.name || adminEmail.split('@')[0];

    // Enviar email de bienvenida
    await sendWelcomeEmail({
      email: adminEmail,
      name: adminName,
      loginUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    });

    // Enviar email de restablecimiento de contraseña
    await sendPasswordResetEmail({
      email: adminEmail,
      name: adminName,
      resetToken: 'dummy-token-for-testing',
      resetUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=dummy-token-for-testing`
    });

    // Enviar email de cambio de suscripción
    await sendSubscriptionChangeEmail({
      email: adminEmail,
      name: adminName,
      planName: 'Premium (Test)',
      status: 'active',
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });

    return NextResponse.json({ success: true, message: 'Test emails sent successfully' });
  } catch (error) {
    
    return NextResponse.json({ error: 'Failed to send test emails' }, { status: 500 });
  }
}
