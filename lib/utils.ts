import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import crypto from "crypto"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateApiKey(): string {
  // Crear una clave de 32 bytes (256 bits)
  const randomBytes = crypto.randomBytes(32)
  // Convertir a string hexadecimal y añadir prefijo para identificar
  return `sk_${randomBytes.toString("hex")}`
}
