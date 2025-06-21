import { marked } from "marked";
import { loadTemplate, replaceTemplateVariables } from "./template-loader";

// Función para generar una versión de texto plano del HTML
function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// Función para convertir markdown a HTML
function markdownToHtml(markdown: string): string {
  try {
    // Configurar marked para emails
    marked.setOptions({
      breaks: true,
      gfm: true,
    });

    const result = marked.parse(markdown);
    return typeof result === "string" ? result : result.toString();
  } catch (error) {
    console.error("Error processing markdown:", error);
    // Fallback: devolver el markdown original en un <pre>
    return `<pre>${markdown}</pre>`;
  }
}

// Email de bienvenida
export async function welcomeEmailTemplate(data: {
  name: string;
  loginUrl: string;
}) {
  const template = await loadTemplate("welcome");
  const html = replaceTemplateVariables(template, {
    ...data,
    year: new Date().getFullYear(),
  });

  return {
    html,
    text: stripHtml(html),
  };
}

// Email de cambio de suscripción
export async function subscriptionChangeEmailTemplate(data: {
  name: string;
  plan: string;
  status: string;
  renewalDate?: string;
}) {
  const template = await loadTemplate("subscription-change");
  const html = replaceTemplateVariables(template, {
    ...data,
    year: new Date().getFullYear(),
  });

  return {
    html,
    text: stripHtml(html),
  };
}

// Email de restablecimiento de contraseña
export async function passwordResetEmailTemplate(data: {
  name: string;
  resetUrl: string;
  expiryMinutes: number;
}) {
  const template = await loadTemplate("password-reset");
  const html = replaceTemplateVariables(template, {
    ...data,
    year: new Date().getFullYear(),
  });

  return {
    html,
    text: stripHtml(html),
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
  const template = await loadTemplate("version-update");
  const html = replaceTemplateVariables(template, {
    ...data,
    year: new Date().getFullYear(),
  });

  return {
    html,
    text: stripHtml(html),
  };
}

// Email de broadcast (masivo)
export async function broadcastEmailTemplate(data: {
  name: string;
  subject: string;
  message: string;
  isImportant?: boolean;
}) {
  const template = await loadTemplate("broadcast");
  const html = replaceTemplateVariables(template, {
    ...data,
    year: new Date().getFullYear(),
  });

  return {
    html,
    text: stripHtml(html),
  };
}

export async function comingSoonEmailTemplate(data: { email: string }) {
  const template = await loadTemplate("coming-soon");
  const html = replaceTemplateVariables(template, {
    ...data,
    year: new Date().getFullYear(),
  });

  return {
    html,
    text: stripHtml(html),
  };
}

// Email para notificaciones de administradores sobre Managed VPS
export async function managedVPSAdminNotificationTemplate(data: {
  name: string;
  action: string;
  actionText: string;
  userName: string;
  userEmail: string;
  userPlan: string;
  userId: string;
  accountId?: number;
  accountNumber?: string;
  platform?: string;
  accountType?: string;
  timestamp: string;
  dashboardUrl?: string;
}) {
  const template = await loadTemplate("managed-vps-admin-notification");
  const html = replaceTemplateVariables(template, {
    ...data,
    dashboardUrl:
      data.dashboardUrl ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000",
    year: new Date().getFullYear(),
  });

  return {
    html,
    text: stripHtml(html),
  };
}

// Email con contenido enriquecido (markdown)
export async function richContentEmailTemplate(data: {
  name: string;
  subject: string;
  markdownContent: string;
}) {
  try {
    console.log("Loading rich-content template...");
    const template = await loadTemplate("rich-content");
    console.log("Template loaded successfully");

    // Convertir markdown a HTML
    console.log("Converting markdown to HTML...");
    const richContent = markdownToHtml(data.markdownContent);
    console.log("Markdown converted successfully");

    console.log("Replacing template variables...");
    const html = replaceTemplateVariables(template, {
      ...data,
      richContent,
      year: new Date().getFullYear(),
    });
    console.log("Variables replaced successfully");

    return {
      html,
      text: stripHtml(html),
    };
  } catch (error) {
    console.error("Error in richContentEmailTemplate:", error);
    throw error;
  }
}
