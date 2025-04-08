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
      console.warn(`⚠️ Template file does not exist: ${filePath}`);
      const defaultTemplate = getDefaultTemplate(templateName);
      await saveTemplate(templateName, defaultTemplate);
      return defaultTemplate;
    }

    const templateContent = await readFile(filePath, "utf8");
    templateCache[templateName] = templateContent;

    return templateContent;
  } catch (error) {
    console.error(`❌ Error loading template ${templateName}:`, error);

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
    console.error(`❌ Error saving template ${templateName}:`, error);
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
  <title>Version Update</title>
</head>
<body>
  <h1>New Version Available!</h1>
  <p>Hello {{name}},</p>
  <p>A new version of IPTRADE is now available.</p>
  <p>Current version: {{currentVersion}}</p>
  <p>New version: {{newVersion}}</p>
  {{#if releaseNotes}}
  <p>{{releaseNotes}}</p>
  {{/if}}
  {{#if downloadUrl}}
  <a href="{{downloadUrl}}">Download Update</a>
  {{/if}}
</body>
</html>`,

    broadcast: `<!DOCTYPE html>
<html>
<head>
  <title>{{subject}}</title>
</head>
<body>
  <h1>{{subject}}</h1>
  <p>Hello {{name}},</p>
  <p>{{message}}</p>
  {{#if ctaUrl}}
  <a href="{{ctaUrl}}">{{ctaLabel}}</a>
  {{/if}}
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
    console.warn(`⚠️ No default template found for: ${templateName}`);
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

  // Manejar bloques condicionales {{#if variable}}...{{/if}}
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
