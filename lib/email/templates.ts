interface TemplateData {
  [key: string]: string | number | boolean | undefined;
}

// Plantilla base para todos los emails
const baseTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
      line-height: 1.5;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #eaeaea;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #f97316;
    }
    .content {
      margin-bottom: 30px;
    }
    .footer {
      text-align: center;
      font-size: 12px;
      color: #666;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eaeaea;
    }
    .button {
      display: inline-block;
      background-color: #f97316;
      color: white;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 5px;
      margin: 20px 0;
      font-weight: 500;
    }
    .button:hover {
      background-color: #ea580c;
    }
    h1, h2, h3 {
      color: #1a202c;
    }
    a {
      color: #f97316;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .info-box {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 5px;
      padding: 15px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">SaaS Starter</div>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} SaaS Starter. All rights reserved.</p>
      <p>Si no solicitaste este email, por favor ignóralo o contáctanos.</p>
    </div>
  </div>
</body>
</html>
`;

// Email de bienvenida
export const welcomeEmailTemplate = (data: { name: string; loginUrl: string }) => {
  const content = `
    <h1>¡Bienvenido a SaaS Starter, ${data.name}!</h1>
    <p>Gracias por registrarte en nuestra plataforma. Estamos emocionados de tenerte con nosotros.</p>
    <p>Con SaaS Starter, puedes gestionar fácilmente suscripciones, validar licencias y mucho más.</p>
    
    <div style="text-align: center;">
      <a href="${data.loginUrl}" class="button">Acceder a tu cuenta</a>
    </div>
    
    <div class="info-box">
      <h3>Primeros pasos</h3>
      <ol>
        <li>Configura tu perfil</li>
        <li>Explora nuestro panel de control</li>
        <li>Revisa nuestra <a href="${data.loginUrl}/docs">documentación</a></li>
      </ol>
    </div>
    
    <p>Si tienes alguna pregunta, no dudes en responder a este correo.</p>
    <p>¡Esperamos que disfrutes usando nuestra plataforma!</p>
  `;
  
  return {
    html: baseTemplate(content),
    text: `¡Bienvenido a SaaS Starter, ${data.name}! Gracias por registrarte en nuestra plataforma. Puedes acceder a tu cuenta en: ${data.loginUrl}`
  };
};

// Email de cambio de suscripción
export const subscriptionChangeEmailTemplate = (data: { 
  name: string; 
  planName: string; 
  status: string;
  expiryDate?: string;
  dashboardUrl: string;
}) => {
  const statusText = data.status === 'active' 
    ? 'Tu suscripción está activa y funcionando correctamente.'
    : data.status === 'canceled'
    ? 'Tu suscripción ha sido cancelada.'
    : `El estado actual de tu suscripción es: ${data.status}`;
  
  const expiryInfo = data.expiryDate 
    ? `<p>Tu suscripción es válida hasta: <strong>${data.expiryDate}</strong></p>` 
    : '';
  
  const content = `
    <h1>Actualización de tu suscripción</h1>
    <p>Hola ${data.name},</p>
    <p>Te informamos que ha habido un cambio en tu suscripción a SaaS Starter.</p>
    
    <div class="info-box">
      <h3>Detalles de la suscripción</h3>
      <p>Plan: <strong>${data.planName}</strong></p>
      <p>Estado: <strong>${data.status}</strong></p>
      ${expiryInfo}
      <p>${statusText}</p>
    </div>
    
    <div style="text-align: center;">
      <a href="${data.dashboardUrl}" class="button">Ver detalles en tu cuenta</a>
    </div>
    
    <p>Si no realizaste este cambio o tienes alguna pregunta, por favor contáctanos inmediatamente.</p>
  `;
  
  return {
    html: baseTemplate(content),
    text: `Actualización de tu suscripción: Plan ${data.planName}, Estado: ${data.status}. ${statusText} Puedes ver más detalles en: ${data.dashboardUrl}`
  };
};

// Email de restablecimiento de contraseña
export const passwordResetEmailTemplate = (data: { name: string; resetUrl: string; expiryMinutes: number }) => {
  const content = `
    <h1>Restablecimiento de contraseña</h1>
    <p>Hola ${data.name},</p>
    <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Si no fuiste tú, puedes ignorar este correo.</p>
    
    <div class="info-box">
      <p>Para restablecer tu contraseña, haz clic en el botón a continuación:</p>
      <div style="text-align: center;">
        <a href="${data.resetUrl}" class="button">Restablecer contraseña</a>
      </div>
      <p style="color: #666; font-size: 13px;">Este enlace expirará en ${data.expiryMinutes} minutos.</p>
    </div>
    
    <p>Si el botón no funciona, copia y pega esta URL en tu navegador:</p>
    <p style="word-break: break-all; font-size: 14px;"><a href="${data.resetUrl}">${data.resetUrl}</a></p>
    
    <p>Por razones de seguridad, este enlace caducará después de ${data.expiryMinutes} minutos.</p>
    <p>Si no solicitaste restablecer tu contraseña, te recomendamos que revises la seguridad de tu cuenta.</p>
  `;
  
  return {
    html: baseTemplate(content),
    text: `Restablecimiento de contraseña para SaaS Starter. Usa este enlace para restablecer tu contraseña (expira en ${data.expiryMinutes} minutos): ${data.resetUrl}`
  };
};

// Email de actualización de versión
export const versionUpdateEmailTemplate = (data: { 
  name: string;
  currentVersion: string;
  newVersion: string;
  releaseNotes?: string;
  downloadUrl?: string;
  isCritical?: boolean;
}) => {
  const criticalNotice = data.isCritical 
    ? `<p style="color: #e53e3e; font-weight: bold;">Esta es una actualización crítica que contiene importantes correcciones de seguridad o funcionalidad.</p>` 
    : '';
  
  const releaseNotes = data.releaseNotes 
    ? `
      <div class="info-box">
        <h3>Notas de la versión</h3>
        <p>${data.releaseNotes}</p>
      </div>
    ` 
    : '';
  
  const downloadButton = data.downloadUrl 
    ? `
      <div style="text-align: center;">
        <a href="${data.downloadUrl}" class="button">Descargar actualización</a>
      </div>
    ` 
    : '';
  
  const content = `
    <h1>Nueva actualización disponible</h1>
    <p>Hola ${data.name},</p>
    <p>Nos complace informarte que hay una nueva versión de nuestra aplicación disponible.</p>
    
    <div class="info-box">
      <h3>Detalles de la actualización</h3>
      <p>Versión actual: <strong>${data.currentVersion}</strong></p>
      <p>Nueva versión: <strong>${data.newVersion}</strong></p>
      ${criticalNotice}
    </div>
    
    ${releaseNotes}
    
    ${downloadButton}
    
    <p>Te recomendamos mantener tu aplicación actualizada para disfrutar de las últimas características y mejoras de seguridad.</p>
  `;
  
  return {
    html: baseTemplate(content),
    text: `Nueva actualización disponible: ${data.newVersion} (actual: ${data.currentVersion}). ${data.isCritical ? 'ACTUALIZACIÓN CRÍTICA - ' : ''}${data.downloadUrl ? `Descargar: ${data.downloadUrl}` : ''}`
  };
}; 