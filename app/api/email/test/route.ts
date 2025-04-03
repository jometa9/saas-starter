import { NextRequest, NextResponse } from 'next/server';
import { testEmailConfiguration, sendEmail } from '@/lib/email/config';
import { isAdminRequest } from '@/lib/auth/utils';

export async function GET(req: NextRequest) {
  try {
    // Verificar si es una solicitud de administrador
    const isAdmin = await isAdminRequest(req);
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'No autorizado, se requiere acceso de administrador' },
        { status: 403 }
      );
    }
    
    // Ejecutar las pruebas de configuración de email
    const configTestResult = await testEmailConfiguration();
    
    // Devolver los resultados
    return NextResponse.json({
      success: configTestResult.success,
      message: configTestResult.message,
      emailMode: process.env.NEXT_PUBLIC_EMAIL_MODE || process.env.NODE_ENV || 'unknown',
      testEmailAddress: process.env.RESEND_TEST_EMAIL || 'onboarding@resend.dev',
      resendApiKeyConfigured: !!process.env.RESEND_API_KEY,
      smtpConfigured: !!process.env.SMTP_HOST,
    });
  } catch (error) {
    console.error('Error al probar la configuración de email:', error);
    return NextResponse.json(
      { error: 'Error al probar la configuración de email' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Verificar si es una solicitud de administrador
    const isAdmin = await isAdminRequest(req);
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'No autorizado, se requiere acceso de administrador' },
        { status: 403 }
      );
    }
    
    // Obtener los datos de la solicitud
    const data = await req.json();
    const { to = process.env.ADMIN_EMAIL } = data;
    
    if (!to) {
      return NextResponse.json(
        { error: 'Se requiere una dirección de email para enviar' },
        { status: 400 }
      );
    }
    
    // Enviar un email de prueba
    const emailResult = await sendEmail({
      to,
      subject: '🧪 Email de prueba - SaaS Starter',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1>Email de prueba</h1>
          <p>Este es un email de prueba enviado desde tu aplicación SaaS Starter.</p>
          <p>Si estás viendo esto, ¡la configuración de email funciona correctamente!</p>
          <hr />
          <p><strong>Detalles técnicos:</strong></p>
          <ul>
            <li>Modo: ${process.env.NEXT_PUBLIC_EMAIL_MODE || process.env.NODE_ENV || 'unknown'}</li>
            <li>Email de prueba: ${process.env.RESEND_TEST_EMAIL || 'No configurado'}</li>
            <li>Resend API: ${process.env.RESEND_API_KEY ? 'Configurado' : 'No configurado'}</li>
            <li>SMTP: ${process.env.SMTP_HOST ? 'Configurado' : 'No configurado'}</li>
            <li>Timestamp: ${new Date().toISOString()}</li>
          </ul>
        </div>
      `,
      text: `Email de prueba\n\nEste es un email de prueba enviado desde tu aplicación SaaS Starter.\nSi estás viendo esto, ¡la configuración de email funciona correctamente!\n\nDetalles técnicos:\n- Modo: ${process.env.NEXT_PUBLIC_EMAIL_MODE || process.env.NODE_ENV || 'unknown'}\n- Email de prueba: ${process.env.RESEND_TEST_EMAIL || 'No configurado'}\n- Resend API: ${process.env.RESEND_API_KEY ? 'Configurado' : 'No configurado'}\n- SMTP: ${process.env.SMTP_HOST ? 'Configurado' : 'No configurado'}\n- Timestamp: ${new Date().toISOString()}`
    });
    
    // Devolver los resultados
    return NextResponse.json({
      success: true,
      message: 'Email de prueba enviado correctamente',
      result: emailResult,
      emailMode: process.env.NEXT_PUBLIC_EMAIL_MODE || process.env.NODE_ENV || 'unknown',
      testEmailAddress: process.env.RESEND_TEST_EMAIL || 'onboarding@resend.dev',
    });
  } catch (error) {
    console.error('Error al enviar email de prueba:', error);
    return NextResponse.json(
      { 
        error: 'Error al enviar email de prueba',
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
} 