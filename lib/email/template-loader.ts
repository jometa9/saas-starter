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
  console.log(`📧 Loading template: ${templateName}`);
  console.log(`📁 Templates directory: ${TEMPLATES_DIR}`);
  console.log(`📁 Current working directory: ${process.cwd()}`);
  console.log(`📁 Absolute templates path: ${path.resolve(TEMPLATES_DIR)}`);

  // Verificar si el directorio existe
  if (!fs.existsSync(TEMPLATES_DIR)) {
    console.warn(`⚠️ Templates directory does not exist: ${TEMPLATES_DIR}`);
    console.log("Creating templates directory...");
    fs.mkdirSync(TEMPLATES_DIR, { recursive: true });
  }

  // Listar archivos en el directorio
  const files = fs.readdirSync(TEMPLATES_DIR);
  console.log(`📁 Files in templates directory: ${files.join(", ")}`);

  // Verificar si el template ya está en caché
  if (templateCache[templateName]) {
    console.log(`✅ Template found in cache: ${templateName}`);
    return templateCache[templateName];
  }

  try {
    // Intentar cargar el template desde el archivo
    const filePath = path.join(TEMPLATES_DIR, `${templateName}.html`);
    console.log(`📄 Loading template file: ${filePath}`);
    console.log(`📄 File exists: ${fs.existsSync(filePath)}`);

    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ Template file does not exist: ${filePath}`);
      console.log("Using default template...");
      const defaultTemplate = getDefaultTemplate(templateName);

      // Guardar el template por defecto en el archivo
      console.log("Saving default template to file...");
      await saveTemplate(templateName, defaultTemplate);

      return defaultTemplate;
    }

    const templateContent = await readFile(filePath, "utf8");
    console.log(`✅ Template loaded successfully: ${templateName}`);
    console.log(
      `📄 Template content length: ${templateContent.length} characters`
    );

    // Guardar en caché
    templateCache[templateName] = templateContent;

    return templateContent;
  } catch (error) {
    console.error(`❌ Error loading template ${templateName}:`, error);

    // Si hay un error, devolver un template por defecto
    console.log("Using default template due to error...");
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
  console.log(`💾 Saving template: ${templateName}`);

  try {
    // Asegurarse de que el directorio existe
    if (!fs.existsSync(TEMPLATES_DIR)) {
      console.log(`📁 Creating templates directory: ${TEMPLATES_DIR}`);
      fs.mkdirSync(TEMPLATES_DIR, { recursive: true });
    }

    // Guardar el template en un archivo
    const filePath = path.join(TEMPLATES_DIR, `${templateName}.html`);
    console.log(`📝 Writing template to file: ${filePath}`);
    await writeFile(filePath, content, "utf8");

    // Actualizar la caché
    templateCache[templateName] = content;

    console.log(`✅ Template ${templateName} saved successfully`);
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
  console.log(`🔄 Getting default template for: ${templateName}`);

  // Templates por defecto para cada tipo
  const defaultTemplates: Record<string, string> = {
    base: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SaaS Starter</title>
</head>
<body>
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="text-align: center; margin-bottom: 20px;">
      <h1 style="color: #0ea5e9;">SaaS Starter</h1>
    </div>
    {{content}}
    <div style="text-align: center; margin-top: 20px; color: #64748b;">
      <p>&copy; {{year}} SaaS Starter. All rights reserved.</p>
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
  <p>A new version of SaaS Starter is now available.</p>
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
  <title>Welcome to SaaS Starter</title>
</head>
<body>
  <h1>Welcome to SaaS Starter, {{name}}!</h1>
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

  console.log(`✅ Default template found for: ${templateName}`);
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
