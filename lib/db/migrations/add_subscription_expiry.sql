-- Añadir la columna subscription_expiry_date a la tabla users
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "subscription_expiry_date" timestamp;

-- Actualizar la columna con valores nulos por defecto para registros existentes
UPDATE "users" SET "subscription_expiry_date" = NULL; 