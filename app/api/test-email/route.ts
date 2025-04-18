import { NextRequest, NextResponse } from 'next/server';
import { testEmailConfiguration, sendEmail } from '@/lib/email';
import { getUser } from '@/lib/db/queries';
import { sendSubscriptionChangeEmail, sendWelcomeEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    // Verificar si es un administrador
    const user = await getUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - only admins can use this endpoint' },
        { status: 401 }
      );
    }

    // Probar la configuración de email
    const configResult = await testEmailConfiguration();
    
    return NextResponse.json({ 
      message: 'Email configuration test completed',
      configResult,
    });
  } catch (error) {
    
    return NextResponse.json(
      { error: 'Failed to test email configuration' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar si es un administrador
    const user = await getUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized - only admins can use this endpoint' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { type, email } = data;
    
    // Usar el email proporcionado o el del usuario actual
    const targetEmail = email || user.email;
    
    if (!targetEmail) {
      return NextResponse.json(
        { error: 'No email address provided' },
        { status: 400 }
      );
    }
    
    let result;
    // Enviar diferentes tipos de emails de prueba
    switch (type) {
      case 'welcome':
        result = await sendWelcomeEmail({
          email: targetEmail,
          name: user.name || targetEmail.split('@')[0],
        });
        break;
      case 'subscription':
        result = await sendSubscriptionChangeEmail({
          email: targetEmail,
          name: user.name || targetEmail.split('@')[0],
          planName: 'Plan de Prueba',
          status: 'active',
          expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        });
        break;
      default:
        // Email genérico de prueba
        result = await sendEmail({
          to: targetEmail,
          subject: 'Prueba de Email desde IPTRADE',
          html: `
            <h1>¡Prueba exitosa!</h1>
            <p>Si estás viendo este email, la configuración de email está funcionando correctamente.</p>
            <p>Fecha y hora de la prueba: ${new Date().toLocaleString()}</p>
          `,
          text: `¡Prueba exitosa! Si estás viendo este email, la configuración de email está funcionando correctamente. Fecha y hora de la prueba: ${new Date().toLocaleString()}`,
        });
    }
    
    return NextResponse.json({ 
      message: `Test email sent successfully to ${targetEmail}`,
      type: type || 'generic',
      result,
    });
  } catch (error) {
    
    return NextResponse.json(
      { error: 'Failed to send test email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 