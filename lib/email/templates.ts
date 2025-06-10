import { loadTemplate, replaceTemplateVariables } from './template-loader';

interface TemplateData {
  [key: string]: string | number | boolean | undefined;
}

// Función para generar una versión de texto plano del HTML
function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Email de bienvenida
export async function welcomeEmailTemplate(data: { name: string; loginUrl: string }) {
  const template = await loadTemplate('welcome');
  const html = replaceTemplateVariables(template, {
    ...data,
    year: new Date().getFullYear()
  });
  
  return {
    html,
    text: stripHtml(html)
  };
}

// Email de cambio de suscripción
export async function subscriptionChangeEmailTemplate(data: { 
  name: string; 
  plan: string; 
  status: string;
  renewalDate?: string;
}) {
  const template = await loadTemplate('subscription-change');
  const html = replaceTemplateVariables(template, {
    ...data,
    year: new Date().getFullYear()
  });
  
  return {
    html,
    text: stripHtml(html)
  };
}

// Email de restablecimiento de contraseña
export async function passwordResetEmailTemplate(data: { 
  name: string; 
  resetUrl: string;
  expiryMinutes: number;
}) {
  const template = await loadTemplate('password-reset');
  const html = replaceTemplateVariables(template, {
    ...data,
    year: new Date().getFullYear()
  });
  
  return {
    html,
    text: stripHtml(html)
  };
}

// Email de actualización de versión
export async function versionUpdateEmailTemplate(data: { 
  name: string; 
  currentVersion: string; 
  newVersion: string;
  releaseNotes?: string;
  downloadUrl?: string;
  isCritical?: boolean;
}) {
  const template = await loadTemplate('version-update');
  const html = replaceTemplateVariables(template, {
    ...data,
    year: new Date().getFullYear()
  });
  
  return {
    html,
    text: stripHtml(html)
  };
}

// Email de broadcast (masivo)
export async function broadcastEmailTemplate(data: { 
  name: string; 
  subject: string;
  message: string;
  isImportant?: boolean;
}) {
  const template = await loadTemplate('broadcast');
  console.log('DEBUG - Template loaded:', template.substring(0, 200) + '...');
  console.log('DEBUG - Data for template:', data);
  
  const html = replaceTemplateVariables(template, {
    ...data,
    year: new Date().getFullYear()
  });
  
  console.log('DEBUG - Processed HTML length:', html.length);
  console.log('DEBUG - HTML contains name:', html.includes(data.name));
  console.log('DEBUG - HTML contains message:', html.includes(data.message));
  console.log('DEBUG - HTML sample (500 chars):', html.substring(0, 500) + '...');
  
  return {
    html,
    text: stripHtml(html)
  };
} 