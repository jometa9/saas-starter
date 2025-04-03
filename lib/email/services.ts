import { sendEmail } from './config';
import {
  welcomeEmailTemplate,
  subscriptionChangeEmailTemplate,
  passwordResetEmailTemplate,
  versionUpdateEmailTemplate,
} from './templates';

// Función de utilidad para reintento de operaciones
async function withRetry<T>(
  operation: () => Promise<T>,
  retries = 3,
  delay = 500,
  name = 'Operation'
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (retries <= 0) {
      console.error(`❌ ${name} failed after all retries:`, error);
      throw error;
    }
    
    console.log(`⚠️ ${name} failed, retrying (${retries} attempts left). Error:`, error);
    
    // Esperar antes de reintentar
    await new Promise(resolve => setTimeout(resolve, delay));
    
    // Incrementar el delay para el próximo intento (backoff exponencial)
    return withRetry(operation, retries - 1, delay * 1.5, name);
  }
}

// Servicio para enviar email de bienvenida
export async function sendWelcomeEmail({
  email,
  name,
  loginUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
}: {
  email: string;
  name: string;
  loginUrl?: string;
}) {
  console.log(`📨 Sending welcome email to ${email}`);
  
  const { html, text } = welcomeEmailTemplate({
    name,
    loginUrl,
  });
  
  return withRetry(
    () => sendEmail({
      to: email,
      subject: '¡Bienvenido a SaaS Starter!',
      html,
      text,
    }),
    3,
    500,
    `Welcome email to ${email}`
  );
}

// Servicio para enviar email de cambio de suscripción
export async function sendSubscriptionChangeEmail({
  email,
  name,
  planName,
  status,
  expiryDate,
  dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard`,
}: {
  email: string;
  name: string;
  planName: string;
  status: string;
  expiryDate?: string;
  dashboardUrl?: string;
}) {
  console.log(`📨 Sending subscription change email to ${email} for plan ${planName} (status: ${status})`);
  
  try {
    if (!email) {
      throw new Error('Email address is missing');
    }
    
    const { html, text } = subscriptionChangeEmailTemplate({
      name,
      planName,
      status,
      expiryDate,
      dashboardUrl,
    });
    
    // Determinar asunto del email basado en el estado
    let subject = 'Actualización de tu suscripción a SaaS Starter';
    if (status === 'active') {
      subject = 'Tu suscripción a SaaS Starter está activa';
    } else if (status === 'trialing') {
      subject = 'Tu período de prueba de SaaS Starter ha comenzado';
    } else if (status === 'canceled') {
      subject = 'Tu suscripción a SaaS Starter ha sido cancelada';
    } else if (status === 'unpaid') {
      subject = 'Problema de pago en tu suscripción a SaaS Starter';
    }
    
    console.log(`🔄 Sending subscription email with status: ${status}, subject: ${subject}`);
    
    // Reintentar el envío hasta 3 veces
    return await withRetry(
      () => sendEmail({
        to: email,
        subject,
        html,
        text,
      }),
      3,
      500,
      `Subscription email to ${email}`
    );
  } catch (error) {
    console.error(`❌ Critical error preparing subscription email for ${email}:`, error);
    throw error;
  }
}

// Servicio para enviar email de restablecimiento de contraseña
export async function sendPasswordResetEmail({
  email,
  name,
  token,
  expiryMinutes = 60,
}: {
  email: string;
  name: string;
  token: string;
  expiryMinutes?: number;
}) {
  console.log(`📨 Sending password reset email to ${email}`);
  
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
  
  const { html, text } = passwordResetEmailTemplate({
    name,
    resetUrl,
    expiryMinutes,
  });
  
  return sendEmail({
    to: email,
    subject: 'Restablecimiento de contraseña para SaaS Starter',
    html,
    text,
  });
}

// Servicio para enviar email de actualización de versión
export async function sendVersionUpdateEmail({
  email,
  name,
  currentVersion,
  newVersion,
  releaseNotes,
  downloadUrl,
  isCritical = false,
}: {
  email: string;
  name: string;
  currentVersion: string;
  newVersion: string;
  releaseNotes?: string;
  downloadUrl?: string;
  isCritical?: boolean;
}) {
  console.log(`📨 Sending version update email to ${email}`);
  
  const { html, text } = versionUpdateEmailTemplate({
    name,
    currentVersion,
    newVersion,
    releaseNotes,
    downloadUrl,
    isCritical,
  });
  
  const subject = isCritical
    ? `[ACTUALIZACIÓN CRÍTICA] Nueva versión ${newVersion} disponible`
    : `Nueva versión ${newVersion} disponible para SaaS Starter`;
  
  return sendEmail({
    to: email,
    subject,
    html,
    text,
  });
} 