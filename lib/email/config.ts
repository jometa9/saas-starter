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
      console.log('🔄 Creating Ethereal test account for email testing...');
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
      
      console.log('✅ Nodemailer configured with Ethereal account for testing');
      console.log(`📬 Username: ${testAccount.user}`);
      console.log(`📬 Password: ${testAccount.pass}`);
      console.log(`📬 View test emails at: https://ethereal.email/login`);
    } catch (error) {
      console.error('❌ Failed to create Ethereal test account:', error);
      throw new Error('Failed to configure email transport');
    }
  } else {
    try {
      // En producción, usa SMTP configurado o un servicio externo
      if (!process.env.SMTP_HOST && !process.env.RESEND_API_KEY) {
        console.warn('⚠️ No email configuration found. Set SMTP_* or RESEND_API_KEY env variables.');
      }
      
      console.log(`🔄 Setting up SMTP transport with: ${process.env.SMTP_HOST}:${process.env.SMTP_PORT}`);
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });
      
      console.log('✅ Nodemailer configured with SMTP server');
    } catch (error) {
      console.error('❌ Failed to configure SMTP transport:', error);
      throw new Error('Failed to configure email transport');
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
    '@gmail.com', // Agrega aquí cualquier dominio que hayas verificado en Resend
    '@iptradecopier.com' // Tu dominio verificado
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
  
  if (isInvalidTestDomain || !isProduction() && !isValidResendTestAddress(email)) {
    console.log(`⚠️ Email ${email} no es válido para Resend. Usando dirección de prueba alternativa.`);
    
    // Direcciones seguras para pruebas en Resend
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
  console.log(`🔄 Sending email to: ${to}, Subject: ${subject}`);
  console.log(`🔄 Email mode: ${isProduction() ? 'PRODUCTION' : 'DEVELOPMENT'}`);
  
  try {
    // Intenta enviar con Resend primero
    if (process.env.RESEND_API_KEY) {
      console.log(`🔄 Using Resend to send email (API key exists)`);
      
      // Asegurar que la dirección sea válida para Resend en cualquier modo
      let safeRecipient = getSafeResendEmail(to);
      
      if (to !== safeRecipient) {
        console.log(`🔄 Converting recipient from ${to} to safe email: ${safeRecipient}`);
      }
      
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
        
        console.log(`✅ Email sent successfully with Resend, ID: ${data?.id}`);
        console.log(`ℹ️ Original recipient: ${to}, Actual recipient: ${safeRecipient}`);
        return { id: data?.id, provider: 'resend', originalRecipient: to, actualRecipient: safeRecipient };
      } catch (resendError) {
        console.error('❌ Resend failed, trying Nodemailer as fallback:', resendError);
        throw resendError; // Lanzamos el error para pasar al fallback
      }
    }
    
    // Si no hay API key de Resend o falló, usa Nodemailer
    console.log(`🔄 Using Nodemailer to send email (fallback or primary method)`);
    
    const transport = await initializeEmailTransporter();
    const info = await transport.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
    
    // En desarrollo, imprime la URL para ver el email
    if (!isProduction()) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log(`📬 Email preview URL: ${previewUrl}`);
    }
    
    console.log(`✅ Email sent successfully with Nodemailer, ID: ${info.messageId}`);
    return { id: info.messageId, provider: 'nodemailer' };
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    
    // Si está en desarrollo, imprimir mensaje informativo
    if (!isProduction()) {
      console.log(`
        ⚠️ MODO DESARROLLO: Email no enviado a ${to}
        ⚠️ ASUNTO: ${subject}
        ⚠️ Para probar con Resend, usa direcciones que terminen en @resend.dev o dominios verificados
        ⚠️ Para evitar este mensaje, configura SMTP o añade dominios verificados en Resend
      `);
    }
    
    throw error;
  }
}

// Función para verificar la configuración de email
export async function testEmailConfiguration() {
  console.log('🧪 Testing email configuration...');
  console.log(`🔄 Email mode: ${isProduction() ? 'PRODUCTION' : 'DEVELOPMENT'}`);
  
  try {
    // Probar si Resend está configurado
    if (process.env.RESEND_API_KEY) {
      console.log('🔍 Resend API key found, testing Resend...');
      try {
        const domains = await resend.domains.list();
        console.log(`✅ Resend connection successful. Found ${domains.data?.length || 0} domains.`);
      } catch (error) {
        console.error('❌ Resend test failed:', error);
        throw new Error('Resend configuration test failed');
      }
    } else {
      console.log('ℹ️ No Resend API key found, skipping Resend test');
    }
    
    // Probar Nodemailer
    console.log('🔍 Testing Nodemailer configuration...');
    const transport = await initializeEmailTransporter();
    
    try {
      // Verificar la conexión
      await transport.verify();
      console.log('✅ Nodemailer connection verified successfully');
      
      // Si estamos en desarrollo, enviar un email de prueba
      if (!isProduction()) {
        const info = await transport.sendMail({
          from: process.env.EMAIL_FROM || 'test@example.com',
          to: 'test@example.com',
          subject: 'Test Email',
          text: 'This is a test email to verify configuration',
          html: '<p>This is a test email to verify configuration</p>',
        });
        
        console.log(`✅ Test email sent. Preview: ${nodemailer.getTestMessageUrl(info)}`);
      }
    } catch (error) {
      console.error('❌ Nodemailer test failed:', error);
      throw new Error('Nodemailer configuration test failed');
    }
    
    return { success: true, message: 'Email configuration test passed' };
  } catch (error) {
    console.error('❌ Email configuration test failed:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error',
      error
    };
  }
} 