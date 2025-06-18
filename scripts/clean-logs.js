#!/usr/bin/env node

/**
 * Este script elimina mensajes de consola (console.log, console.error, etc) del código
 *
 * Uso:
 *   - Solo console.log: node scripts/clean-logs.js log
 *   - Todos los tipos: node scripts/clean-logs.js all
 *   - Tipos específicos: node scripts/clean-logs.js log error warn
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Argumentos de la línea de comandos
const args = process.argv.slice(2);
const typesToRemove = args.length > 0 ? args : ["log"]; // Por defecto, solo elimina console.log

// Si 'all' está en los argumentos, eliminar todos los tipos
if (typesToRemove.includes("all")) {
  typesToRemove.length = 0; // Limpiar el array
  typesToRemove.push(
    "log",
    "error",
    "warn",
    "info",
    "debug",
    "table",
    "trace",
    "group",
    "groupEnd",
    "time",
    "timeEnd"
  );
}

// Contador para estadísticas
let stats = {
  filesChecked: 0,
  filesModified: 0,
  logsRemoved: 0,
  byType: {},
};

// Inicializar contador por tipo
typesToRemove.forEach((type) => {
  stats.byType[type] = 0;
});

// Obtener la ruta base del proyecto
const basePath = path.resolve(process.cwd());

// Mostrar información de inicio

// Encontrar todos los archivos JS/TS del proyecto (excluyendo node_modules, .git, etc.)
const findCmd = `find ${basePath} -type f \\( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \\) -not -path "*/node_modules/*" -not -path "*/.git/*" -not -path "*/.next/*" -not -path "*/dist/*" -not -path "*/build/*"`;

try {
  const files = execSync(findCmd, { encoding: "utf-8" })
    .split("\n")
    .filter(Boolean);

  // Procesar cada archivo
  files.forEach((filePath) => {
    try {
      processFile(filePath);
      stats.filesChecked++;
    } catch (err) {}
  });

  // Mostrar resultados

  // Mostrar estadísticas por tipo
  if (stats.logsRemoved > 0) {
    for (const type in stats.byType) {
      if (stats.byType[type] > 0) {
      }
    }
  } else {
  }
} catch (error) {}

// Función para procesar un archivo
function processFile(filePath) {
  // Leer el contenido del archivo
  const content = fs.readFileSync(filePath, "utf-8");
  let newContent = content;
  let totalRemoved = 0;

  // Procesar cada tipo
  typesToRemove.forEach((type) => {
    // Expresión regular para encontrar el tipo específico de console con varios formatos
    // Esta regex captura console.X( ... ); incluyendo todo el contenido entre paréntesis
    const regex = new RegExp(`console\\.${type}\\s*\\([^;]*\\);?`, "g");

    // Contar ocurrencias
    const matches = newContent.match(regex) || [];
    const count = matches.length;

    if (count > 0) {
      // Reemplazar todos los console.X
      newContent = newContent.replace(regex, "");

      // Actualizar estadísticas
      stats.byType[type] += count;
      totalRemoved += count;
    }
  });

  // Si se eliminó algún mensaje, guardar el archivo
  if (totalRemoved > 0) {
    // Eliminar líneas vacías consecutivas que pudieron quedar
    newContent = newContent.replace(/(\r?\n){2,}/g, "\n\n");

    // Guardar el archivo modificado
    fs.writeFileSync(filePath, newContent);
    stats.filesModified++;
    stats.logsRemoved += totalRemoved;
  }
}
