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
    :root {
      --primary: #0ea5e9;
      --primary-dark: #0284c7;
      --primary-light: #e0f2fe;
      --success: #22c55e;
      --warning: #f59e0b;
      --danger: #ef4444;
      --gray-50: #f8fafc;
      --gray-100: #f1f5f9;
      --gray-200: #e2e8f0;
      --gray-300: #cbd5e1;
      --gray-400: #94a3b8;
      --gray-500: #64748b;
      --gray-600: #475569;
      --gray-700: #334155;
      --gray-800: #1e293b;
      --gray-900: #0f172a;
    }

    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; 
      line-height: 1.6;
      color: var(--gray-800);
      margin: 0;
      padding: 0;
      background-color: var(--gray-50);
    }

    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--gray-200);
    }

    .logo {
      font-size: 24px;
      font-weight: bold;
      color: var(--primary);
      text-decoration: none;
      display: inline-block;
      margin-bottom: 10px;
    }

    .content {
      margin-bottom: 30px;
      padding: 0 20px;
    }

    .footer {
      text-align: center;
      font-size: 14px;
      color: var(--gray-500);
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid var(--gray-200);
    }

    .button {
      display: inline-block;
      background-color: var(--primary);
      color: white;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 6px;
      margin: 20px 0;
      font-weight: 500;
      transition: background-color 0.2s ease;
    }

    .button:hover {
      background-color: var(--primary-dark);
    }

    h1 {
      color: var(--gray-900);
      font-size: 24px;
      margin-bottom: 20px;
      font-weight: 600;
    }

    h2 {
      color: var(--gray-800);
      font-size: 20px;
      margin-bottom: 16px;
      font-weight: 600;
    }

    h3 {
      color: var(--gray-700);
      font-size: 18px;
      margin-bottom: 12px;
      font-weight: 600;
    }

    p {
      margin-bottom: 16px;
      color: var(--gray-700);
    }

    a {
      color: var(--primary);
      text-decoration: none;
      transition: color 0.2s ease;
    }

    a:hover {
      color: var(--primary-dark);
      text-decoration: underline;
    }

    .info-box {
      background-color: var(--gray-50);
      border: 1px solid var(--gray-200);
      border-radius: 6px;
      padding: 20px;
      margin: 20px 0;
    }

    .important-notice {
      background-color: #fef2f2;
      border: 1px solid #fee2e2;
      border-radius: 6px;
      padding: 16px;
      margin: 20px 0;
      color: var(--danger);
    }

    .success-notice {
      background-color: #f0fdf4;
      border: 1px solid #dcfce7;
      border-radius: 6px;
      padding: 16px;
      margin: 20px 0;
      color: var(--success);
    }

    .warning-notice {
      background-color: #fffbeb;
      border: 1px solid #fef3c7;
      border-radius: 6px;
      padding: 16px;
      margin: 20px 0;
      color: var(--warning);
    }

    .version-badge {
      display: inline-block;
      background-color: var(--primary-light);
      color: var(--primary-dark);
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      margin: 4px 0;
    }

    .critical-badge {
      display: inline-block;
      background-color: #fee2e2;
      color: var(--danger);
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      margin: 4px 0;
    }

    @media (max-width: 600px) {
      .container {
        padding: 15px;
      }

      .content {
        padding: 0 10px;
      }

      h1 {
        font-size: 22px;
      }

      h2 {
        font-size: 18px;
      }

      h3 {
        font-size: 16px;
      }

      .button {
        display: block;
        text-align: center;
        margin: 20px 0;
      }
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
      <p>If you didn't request this email, please ignore it or contact us.</p>
    </div>
  </div>
</body>
</html>
`;

// Email de bienvenida
export const welcomeEmailTemplate = (data: { name: string; loginUrl: string }) => {
  const content = `
    <h1>Welcome to SaaS Starter, ${data.name}!</h1>
    <p>Thank you for joining our platform. We're excited to have you on board.</p>
    <p>With SaaS Starter, you can easily manage subscriptions, validate licenses, and much more.</p>
    
    <div style="text-align: center;">
      <a href="${data.loginUrl}" class="button">Access your account</a>
    </div>
    
    <div class="info-box">
      <h3>Getting Started</h3>
      <ol>
        <li>Set up your profile</li>
        <li>Explore our dashboard</li>
        <li>Check our <a href="${data.loginUrl}/docs">documentation</a></li>
      </ol>
    </div>
    
    <p>If you have any questions, feel free to reply to this email.</p>
    <p>We hope you enjoy using our platform!</p>
  `;
  
  return {
    html: baseTemplate(content),
    text: `Welcome to SaaS Starter, ${data.name}! Thank you for joining our platform. You can access your account at: ${data.loginUrl}`
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
    ? 'Your subscription is active and working properly.'
    : data.status === 'canceled'
    ? 'Your subscription has been canceled.'
    : `Your current subscription status is: ${data.status}`;
  
  const expiryInfo = data.expiryDate 
    ? `<p>Your subscription is valid until: <strong>${data.expiryDate}</strong></p>` 
    : '';
  
  const content = `
    <h1>Subscription Update</h1>
    <p>Hello ${data.name},</p>
    <p>We're informing you about a change in your SaaS Starter subscription.</p>
    
    <div class="info-box">
      <h3>Subscription Details</h3>
      <p>Plan: <strong>${data.planName}</strong></p>
      <p>Status: <strong>${data.status}</strong></p>
      ${expiryInfo}
      <p>${statusText}</p>
    </div>
    
    <div style="text-align: center;">
      <a href="${data.dashboardUrl}" class="button">View details in your account</a>
    </div>
    
    <p>If you didn't make this change or have any questions, please contact us immediately.</p>
  `;
  
  return {
    html: baseTemplate(content),
    text: `Subscription Update: Plan ${data.planName}, Status: ${data.status}. ${statusText} You can view more details at: ${data.dashboardUrl}`
  };
};

// Email de restablecimiento de contraseña
export const passwordResetEmailTemplate = (data: { name: string; resetUrl: string; expiryMinutes: number }) => {
  const content = `
    <h1>Password Reset</h1>
    <p>Hello ${data.name},</p>
    <p>We received a request to reset your account password. If this wasn't you, you can ignore this email.</p>
    
    <div class="info-box">
      <p>To reset your password, click the button below:</p>
      <div style="text-align: center;">
        <a href="${data.resetUrl}" class="button">Reset password</a>
      </div>
      <p style="color: var(--gray-500); font-size: 13px;">This link will expire in ${data.expiryMinutes} minutes.</p>
    </div>
    
    <p>If the button doesn't work, copy and paste this URL into your browser:</p>
    <p style="word-break: break-all; font-size: 14px;"><a href="${data.resetUrl}">${data.resetUrl}</a></p>
    
    <p>For security reasons, this link will expire after ${data.expiryMinutes} minutes.</p>
    <p>If you didn't request a password reset, we recommend checking your account security.</p>
  `;
  
  return {
    html: baseTemplate(content),
    text: `Password Reset for SaaS Starter. Use this link to reset your password (expires in ${data.expiryMinutes} minutes): ${data.resetUrl}`
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
    ? `<div class="critical-badge">CRITICAL UPDATE</div>
       <div class="important-notice">
         <p>This is a critical update containing important security fixes or functionality improvements.</p>
       </div>` 
    : '';
  
  const releaseNotes = data.releaseNotes 
    ? `
      <div class="info-box">
        <h3>Release Notes</h3>
        <p>${data.releaseNotes}</p>
      </div>
    ` 
    : '';
  
  const downloadButton = data.downloadUrl 
    ? `
      <div style="text-align: center;">
        <a href="${data.downloadUrl}" class="button">Download update</a>
      </div>
    ` 
    : '';
  
  const content = `
    <h1>New Update Available</h1>
    <p>Hello ${data.name},</p>
    <p>We're pleased to inform you that a new version of our application is available.</p>
    
    <div class="info-box">
      <h3>Update Details</h3>
      <p>Current version: <span class="version-badge">${data.currentVersion}</span></p>
      <p>New version: <span class="version-badge">${data.newVersion}</span></p>
      ${criticalNotice}
    </div>
    
    ${releaseNotes}
    
    ${downloadButton}
    
    <p>We recommend keeping your application up to date to enjoy the latest features and security improvements.</p>
  `;
  
  return {
    html: baseTemplate(content),
    text: `New update available: ${data.newVersion} (current: ${data.currentVersion}). ${data.isCritical ? 'CRITICAL UPDATE - ' : ''}${data.downloadUrl ? `Download: ${data.downloadUrl}` : ''}`
  };
};

// Email para anuncios o comunicaciones masivas
export const broadcastEmailTemplate = (data: { 
  name: string;
  subject: string;
  message: string;
  ctaLabel?: string;
  ctaUrl?: string;
  isImportant?: boolean;
}) => {
  const importantNotice = data.isImportant 
    ? `<div class="important-notice">
         <p>This is an important communication that requires your attention.</p>
       </div>` 
    : '';
  
  const ctaButton = data.ctaUrl && data.ctaLabel
    ? `
      <div style="text-align: center;">
        <a href="${data.ctaUrl}" class="button">${data.ctaLabel}</a>
      </div>
    ` 
    : '';
  
  const content = `
    <h1>${data.subject}</h1>
    <p>Hello ${data.name},</p>
    ${importantNotice}
    
    <div class="info-box">
      ${data.message.replace(/\n/g, '<br />')}
    </div>
    
    ${ctaButton}
    
    <p>If you have any questions, feel free to contact us.</p>
  `;
  
  return {
    html: baseTemplate(content),
    text: `${data.subject}\n\nHello ${data.name},\n\n${data.isImportant ? 'IMPORTANT: ' : ''}${data.message}\n\n${data.ctaUrl ? `${data.ctaLabel}: ${data.ctaUrl}` : ''}`
  };
}; 