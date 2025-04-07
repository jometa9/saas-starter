import nodemailer from 'nodemailer';
import { Resend } from 'resend';

// Configuración de Resend (servicio de email moderno)
export const resend = new Resend(process.env.RESEND_API_KEY);

// Configuración de Nodemailer como alternativa
// En desarrollo, usa ethereal.email (servicio de prueba)
let transporter: nodemailer.Transporter;

// Función para verificar si estamos en modo producción
const isProduction = (): boolean => {
  // Primero verificamos nuestra propia variable, si existe
  if (process.env.NEXT_PUBLIC_EMAIL_MODE) {
    return process.env.NEXT_PUBLIC_EMAIL_MODE === 'production';
  }
  // Como respaldo, verificamos NODE_ENV (aunque Next.js podría ignorar cambios en .env.local)
  return process.env.NODE_ENV === 'production';
};

// Inicializa el transporter de Nodemailer
export async function initializeEmailTransporter() {
  // Si ya existe un transporter, regrésalo
  if (transporter) return transporter;

  // Si estamos en desarrollo, usa ethereal.email
  if (!isProduction()) {
    try {
      // Crear una cuenta de prueba en ethereal.email
      const testAccount = await nodemailer.createTestAccount();
      
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } catch (error) {
      console.error('❌ Failed to create Ethereal test account:', error);
      throw new Error('Failed to configure email transport');
    }
  } else {
    // En producción, usa SMTP configurado o un servicio externo
    if (!process.env.SMTP_HOST && !process.env.RESEND_API_KEY) {
      console.warn('⚠️ No email configuration found. Set SMTP_* or RESEND_API_KEY env variables.');
    }
    
    if (process.env.SMTP_HOST) {
      try {
        transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT) || 587,
          secure: process.env.SMTP_SECURE === 'true',
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          },
        });
      } catch (error) {
        console.error('❌ Failed to configure SMTP transport:', error);
        throw new Error('Failed to configure email transport');
      }
    } else {
      // Si no hay SMTP configurado, creamos un transporter "dummy" que lanza errores
      // Esto evita errores innecesarios en la aplicación, pero el envío fallará
      console.warn('⚠️ No SMTP configuration found, creating fallback transport');
      transporter = nodemailer.createTransport({
        name: 'no-reply',
        version: '1.0.0',
        send: (mail, callback) => {
          const error = new Error('No SMTP configuration found, email not sent');
          callback(error);
        }
      } as any);
    }
  }
  
  return transporter;
}

/**
 * Verifica si una dirección de email es válida para pruebas con Resend
 * En modo de prueba, Resend solo permite enviar a dominios verificados o @resend.dev
 */
const isValidResendTestAddress = (email: string): boolean => {
  // En producción, Resend rechaza dominios de prueba comunes
  const invalidTestDomains = [
    '@test.com',
    '@example.com',
    '@testing.com',
    '@sample.com'
  ];
  
  // Si es un dominio de prueba conocido, no es válido en producción
  if (invalidTestDomains.some(domain => email.toLowerCase().endsWith(domain))) {
    return false;
  }
  
  // Dominios válidos para pruebas en Resend
  const validTestDomains = [
    '@resend.dev',
    '@gmail.com',
    '@hotmail.com',
    '@outlook.com',
    '@yahoo.com',
    '@icloud.com',
    '@aol.com',
    '@protonmail.com',
    '@iptradecopier.com'
    // Puedes añadir más dominios según sea necesario
  ];
  
  return validTestDomains.some(domain => email.toLowerCase().endsWith(domain));
};

/**
 * Asegura que la dirección de email sea válida para Resend
 * Si no lo es, la reemplaza por una dirección segura para pruebas
 */
const getSafeResendEmail = (email: string): string => {
  // En producción, siempre rechaza los dominios de prueba comunes
  const invalidTestDomains = [
    '@test.com',
    '@example.com',
    '@testing.com',
    '@sample.com'
  ];
  
  const isInvalidTestDomain = invalidTestDomains.some(domain => 
    email.toLowerCase().endsWith(domain)
  );
  
  // En modo producción, permitimos todos los dominios excepto los de prueba conocidos
  if (isProduction()) {
    if (isInvalidTestDomain) {
      console.warn(`⚠️ Email ${email} es un dominio de prueba inválido. Usando dirección alternativa.`);
      return process.env.RESEND_TEST_EMAIL || 'onboarding@resend.dev';
    }
    return email; // En producción, devolvemos el email tal cual si no es un dominio de prueba
  }
  
  // En desarrollo, solo permitimos dominios verificados
  if (!isValidResendTestAddress(email)) {
    console.warn(`⚠️ Email ${email} no es válido para Resend en desarrollo. Usando dirección de prueba alternativa.`);
    return process.env.RESEND_TEST_EMAIL || 'onboarding@resend.dev';
  }
  
  return email;
};

// Función para enviar emails usando Resend (preferido) o Nodemailer (fallback)
export async function sendEmail({
  to,
  subject,
  html,
  text,
  from = process.env.EMAIL_FROM || 'no-reply@saas-starter.com',
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
  from?: string;
}) {
  try {
    // Intenta enviar con Resend primero
    if (process.env.RESEND_API_KEY) {
      // Asegurar que la dirección sea válida para Resend en cualquier modo
      let safeRecipient = getSafeResendEmail(to);
      
      try {
        const { data, error } = await resend.emails.send({
          from,
          to: safeRecipient,
          subject,
          html,
          text,
        });
        
        if (error) {
          console.error('❌ Error sending email with Resend:', error);
          throw error;
        }
        
        return { id: data?.id, provider: 'resend', originalRecipient: to, actualRecipient: safeRecipient };
      } catch (resendError) {
        console.error('❌ Resend failed, trying Nodemailer as fallback:', resendError);
        throw resendError; // Lanzamos el error para pasar al fallback
      }
    }
    
    const transport = await initializeEmailTransporter();
    const info = await transport.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
    
    return { id: info.messageId, provider: 'nodemailer' };
  } catch (error) {
    console.error('❌ Failed to send email:', error);
   
    throw error;
  }
}

// Función para verificar la configuración de email
export async function testEmailConfiguration() {
  try {
    let resendConfigured = false;
    let nodemailerConfigured = false;
    
    // Probar si Resend está configurado
    if (process.env.RESEND_API_KEY) {
      try {
        const domains = await resend.domains.list();
        resendConfigured = true;
      } catch (error) {
        console.error('❌ Resend test failed:', error);
        // No lanzamos error aquí, dejamos que Nodemailer sea la alternativa
      }
    }
    
    // Probar Nodemailer solo si hay configuración SMTP o estamos en desarrollo
    const hasSmtpConfig = !!process.env.SMTP_HOST && !!process.env.SMTP_PORT;
    
    if (hasSmtpConfig || !isProduction()) {
      try {
        const transport = await initializeEmailTransporter();
        
        // Verificar la conexión
        await transport.verify();
        nodemailerConfigured = true;
        
        // Si estamos en desarrollo, enviar un email de prueba
        if (!isProduction()) {
          const info = await transport.sendMail({
            from: process.env.EMAIL_FROM || 'test@example.com',
            to: 'test@example.com',
            subject: 'Test Email',
            text: 'This is a test email to verify configuration',
            html: '<p>This is a test email to verify configuration</p>',
          });
        }
      } catch (error) {
        console.error('❌ Nodemailer test failed:', error);
        // No lanzamos error aquí a menos que Resend también haya fallado
      }
    }
    
    // Verificar si al menos un método de envío está configurado
    if (!resendConfigured && !nodemailerConfigured) {
      throw new Error('No email service configured. Please configure either Resend or SMTP.');
    }
    
    return { 
      success: true, 
      message: 'Email configuration test passed',
      services: {
        resend: resendConfigured ? 'configured' : 'not configured',
        nodemailer: nodemailerConfigured ? 'configured' : 'not configured',
      }
    };
  } catch (error) {
    console.error('❌ Email configuration test failed:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error',
      error
    };
  }
} 