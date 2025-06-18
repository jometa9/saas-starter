import fs from "fs";
import path from "path";
import { promisify } from "util";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Ruta a la carpeta de templates
const TEMPLATES_DIR = path.resolve(process.cwd(), "email-templates");

// Cache para almacenar los templates cargados
const templateCache: Record<string, string> = {};

/**
 * Carga un template HTML desde un archivo
 * @param templateName Nombre del template (sin extensión)
 * @returns El contenido del template HTML
 */
export async function loadTemplate(templateName: string): Promise<string> {
  if (!fs.existsSync(TEMPLATES_DIR)) {
    fs.mkdirSync(TEMPLATES_DIR, { recursive: true });
  }

  // Listar archivos en el directorio
  const files = fs.readdirSync(TEMPLATES_DIR);

  // Verificar si el template ya está en caché
  if (templateCache[templateName]) {
    return templateCache[templateName];
  }

  try {
    // Intentar cargar el template desde el archivo
    const filePath = path.join(TEMPLATES_DIR, `${templateName}.html`);

    if (!fs.existsSync(filePath)) {
      const defaultTemplate = getDefaultTemplate(templateName);
      await saveTemplate(templateName, defaultTemplate);
      return defaultTemplate;
    }

    const templateContent = await readFile(filePath, "utf8");
    templateCache[templateName] = templateContent;

    return templateContent;
  } catch (error) {
    return getDefaultTemplate(templateName);
  }
}

/**
 * Guarda un template HTML en un archivo
 * @param templateName Nombre del template (sin extensión)
 * @param content Contenido del template HTML
 */
export async function saveTemplate(
  templateName: string,
  content: string
): Promise<void> {
  try {
    if (!fs.existsSync(TEMPLATES_DIR)) {
      fs.mkdirSync(TEMPLATES_DIR, { recursive: true });
    }

    // Guardar el template en un archivo
    const filePath = path.join(TEMPLATES_DIR, `${templateName}.html`);
    await writeFile(filePath, content, "utf8");

    // Actualizar la caché
    templateCache[templateName] = content;
  } catch (error) {
    throw error;
  }
}

/**
 * Obtiene un template por defecto si no se puede cargar desde el archivo
 * @param templateName Nombre del template
 * @returns El contenido del template por defecto
 */
function getDefaultTemplate(templateName: string): string {
  const defaultTemplates: Record<string, string> = {
    base: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IPTRADE</title>
</head>
<body>
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 20px;">
      <h1 style="color: #0ea5e9;">IPTRADE</h1>
    </div>
    {{content}}
    <div style="text-align: center; margin-top: 20px; color: #64748b;">
      <p>&copy; {{year}} IPTRADE. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`,

    "version-update": `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Version Available</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
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
      margin-bottom: 30px;
    }
    .header h1 {
      font-size: 28px;
      color: #111;
      margin-bottom: 10px;
    }
    .greeting {
      margin-bottom: 20px;
    }
    .content {
      margin-bottom: 30px;
    }
    .version-info {
      display: flex;
      justify-content: space-between;
      margin: 25px 0;
    }
    .version-box {
      padding: 12px 20px;
      border-radius: 6px;
      font-weight: 500;
    }
    .current-version {
      background: #f3f4f6;
      color: #4b5563;
    }
    .new-version {
      background: #dbeafe;
      color: #1d4ed8;
    }
    .release-notes {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 15px;
      margin-bottom: 25px;
    }
    .release-notes h3 {
      margin-top: 0;
      margin-bottom: 10px;
      font-size: 16px;
    }
    .btn {
      display: inline-block;
      background: #4b5563;
      color: white;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 6px;
      font-weight: 500;
      text-align: center;
    }
    .footer {
      text-align: center;
      color: #6b7280;
      font-size: 14px;
      margin-top: 40px;
      border-top: 1px solid #e5e7eb;
      padding-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Version Available</h1>
    </div>
    
    <div class="greeting">
      <p>Hi {{name}},</p>
      <p>A new version of IPTRADE is now available.</p>
    </div>
    
    <div class="content">
      <div class="version-info">
        <div class="version-box current-version">
          Current: {{currentVersion}}
        </div>
        <div class="version-box new-version">
          New: {{newVersion}}
        </div>
      </div>
      
      {{#if releaseNotes}}
      <div class="release-notes">
        <h3>What's New:</h3>
        <p>{{releaseNotes}}</p>
      </div>
      {{/if}}
      
      {{#if downloadUrl}}
      <div style="text-align: center;">
        <a href="{{downloadUrl}}" class="btn">Download Update</a>
      </div>
      {{/if}}
    </div>
    
    <div class="footer">
      <p>&copy; {{year}} IPTRADE. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`,

    broadcast: `<!DOCTYPE html>
<html>
<head>
  <title>{{subject}}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
    .important { background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .important-badge { color: #9a3412; font-weight: 600; margin-bottom: 10px; }
    .message { color: #374151; white-space: pre-line; }
  </style>
</head>
<body>
  <h1>{{subject}}</h1>
  <p>Hello {{name}},</p>
  
  {{#if isImportant}}
  <div class="important">
    <div class="important-badge">📢 Important Announcement</div>
    <div class="message">{{message}}</div>
  </div>
  {{else}}
  <div class="message">{{message}}</div>
  {{/if}}
  
  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
    <p>&copy; {{year}} IPTRADE. All rights reserved.</p>
  </div>
</body>
</html>`,

    welcome: `<!DOCTYPE html>
<html>
<head>
  <title>Welcome to IPTRADE</title>
</head>
<body>
  <h1>Welcome to IPTRADE, {{name}}!</h1>
  <p>Thank you for joining our platform.</p>
  <a href="{{loginUrl}}">Access your account</a>
</body>
</html>`,

    "subscription-change": `<!DOCTYPE html>
<html>
<head>
  <title>Subscription Update</title>
</head>
<body>
  <h1>Subscription Update</h1>
  <p>Hello {{name}},</p>
  <p>Your subscription has been updated:</p>
  <p>Plan: {{plan}}</p>
  <p>Status: {{status}}</p>
  {{#if renewalDate}}
  <p>Next renewal: {{renewalDate}}</p>
  {{/if}}
</body>
</html>`,

    "password-reset": `<!DOCTYPE html>
<html>
<head>
  <title>Password Reset</title>
</head>
<body>
  <h1>Password Reset</h1>
  <p>Hello {{name}},</p>
  <p>Click the link below to reset your password:</p>
  <a href="{{resetUrl}}">Reset Password</a>
  <p>This link will expire soon.</p>
</body>
</html>`,
  };

  const template = defaultTemplates[templateName];
  if (!template) {
    return "<p>Template not found</p>";
  }

  return template;
}

/**
 * Reemplaza las variables en un template con valores reales
 * @param template Contenido del template
 * @param data Datos para reemplazar en el template
 * @returns El template con las variables reemplazadas
 */
export function replaceTemplateVariables(
  template: string,
  data: Record<string, any>
): string {
  let result = template;

  // Manejar bloques condicionales con {{else}}: {{#if variable}}...{{else}}...{{/if}}
  const ifElseRegex = /{{#if\s+([^}]+)}}([\s\S]*?){{else}}([\s\S]*?){{\/if}}/g;
  result = result.replace(
    ifElseRegex,
    (match, condition, trueContent, falseContent) => {
      const value = condition.split(".").reduce((obj, key) => obj?.[key], data);
      return value ? trueContent : falseContent;
    }
  );

  // Manejar bloques condicionales simples {{#if variable}}...{{/if}}
  const ifRegex = /{{#if\s+([^}]+)}}([\s\S]*?){{\/if}}/g;
  result = result.replace(ifRegex, (match, condition, content) => {
    const value = condition.split(".").reduce((obj, key) => obj?.[key], data);
    return value ? content : "";
  });

  // Reemplazar variables simples {{variable}}
  const varRegex = /{{([^#/][^}]*)}}/g;
  result = result.replace(varRegex, (match, key) => {
    const value = key.split(".").reduce((obj, k) => obj?.[k], data);
    return value !== undefined ? String(value) : match;
  });

  return result;
}
