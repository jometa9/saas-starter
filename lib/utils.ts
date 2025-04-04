import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from "crypto"
import { randomBytes } from 'crypto'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateApiKey(): string {
  // Crear una clave de 32 bytes (256 bits)
  const randomBytes = crypto.randomBytes(32)
  // Convertir a string hexadecimal y añadir prefijo para identificar
  return `sk_${randomBytes.toString("hex")}`
}

export function generateResetToken(): string {
  // Generar un token aleatorio para restablecer contraseña
  return crypto.randomBytes(32).toString('hex');
}

export function getResetTokenExpiry(): Date {
  // El token expira en 24 horas
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + 24);
  return expiry;
}

// Conjunto de colores agradables para los avatares
const backgroundColors = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-orange-500',
  'bg-cyan-500',
];

/**
 * Genera un color de fondo consistente basado en un string (nombre de usuario)
 */
export function getAvatarBgColor(name: string): string {
  // Calculamos un hash simple basado en la suma de códigos ASCII
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Obtenemos un índice dentro del rango de nuestro array de colores
  const index = Math.abs(hash) % backgroundColors.length;
  
  return backgroundColors[index];
}

// También podemos generar colores de texto adecuados para el fondo
export function getAvatarTextColor(bgColor: string): string {
  // Colores claros reciben texto oscuro, colores oscuros reciben texto claro
  return bgColor.includes('yellow') || bgColor.includes('pink') ? 'text-gray-900' : 'text-white';
}
